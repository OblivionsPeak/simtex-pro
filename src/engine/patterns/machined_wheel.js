export default {
  id: 'machined_wheel',
  name: 'Machined Wheel',
  category: 'Racing',
  description: 'CNC machined aluminum wheel face with concentric lathe rings, radial spoke shadows, and a polished centre hub.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }

    vec4 generate() {
      vec2 uv = v_uv - 0.5;          // centre at 0,0

      float r    = length(uv);
      float ang  = atan(uv.y, uv.x); // -pi .. pi

      // ---- Concentric machining rings ----
      // Lathe produces fine, evenly spaced ridges
      float ringPhase = r * u_ring_freq;
      float ring = sin(ringPhase * 6.28318);
      // Vary slightly with micro noise (tool chatter)
      float chatter = noise(vec2(r * u_ring_freq * 0.5, ang * 3.0)) * 0.15;
      ring = ring * (1.0 - chatter) + chatter;
      ring = ring * 0.5 + 0.5;  // [0,1]

      // Polished highlight: bright crests, dark valleys
      float machinedBright = mix(0.55, 0.92, ring);

      // ---- Spoke shadow regions ----
      // Normalise angle to [0, 2pi)
      float angN  = ang + 3.14159;
      float sector = angN * u_spoke_count / 6.28318; // which spoke
      float sectorFrac = fract(sector);
      // Shadow in pocket between spokes (centre 0.5 of each sector)
      float spokeMask = abs(sectorFrac - 0.5) * 2.0; // 0 at midpoint, 1 at spoke
      float spokeShadow = smoothstep(0.3, 0.7, spokeMask);
      // Only apply beyond inner hub radius
      float hubRadius = 0.12;
      float rimRadius = 0.48;
      float spokeBlend = smoothstep(hubRadius, hubRadius + 0.06, r) *
                         smoothstep(rimRadius, rimRadius - 0.04, r);
      float shadowFactor = mix(1.0, spokeShadow * 0.55 + 0.35, spokeBlend);

      // ---- Hub: smooth polished disc ----
      float hubMask = smoothstep(hubRadius, hubRadius - 0.03, r);
      float hubGlow = 1.0 - r / hubRadius;
      float hubLight = mix(0.0, 0.85 + hubGlow * 0.15, hubMask);

      // ---- Rim lip: slightly darker ----
      float rimMask = smoothstep(rimRadius - 0.03, rimRadius, r);
      float rimDark = mix(1.0, 0.6, rimMask);

      // ---- Compose ----
      float lum = machinedBright * shadowFactor * rimDark;
      lum = mix(lum, 0.9, hubMask); // hub overrides ring texture

      // Aluminium colour — neutral with faint warm tinge
      vec3 alumColor = vec3(0.88, 0.87, 0.86);
      vec3 col = alumColor * lum;

      // Thin iridescent sheen on machined ridges
      float irid = sin(ringPhase * 6.28318 * 0.5 + ang) * 0.03;
      col += vec3(irid * 0.4, irid * 0.5, irid * 0.8) * (1.0 - hubMask);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_ring_freq',   name: 'Ring Density', type: 'float', min: 10.0, max: 60.0, default: 30.0 },
    { id: 'u_spoke_count', name: 'Spoke Count',  type: 'float', min: 3.0,  max: 10.0, default: 5.0  }
  ]
};
