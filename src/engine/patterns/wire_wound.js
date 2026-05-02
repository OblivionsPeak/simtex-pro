export default {
  id: 'wire_wound',
  name: 'Wire Wound',
  category: 'Industrial',
  description: 'Tightly wound coil seen from above — concentric oval rings from wire turns with bright highlights and trailing-edge shadows, as in a solenoid cross-section.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }

    // Oval ring radius: slight Y compression gives wound-coil perspective
    float ovalRadius(vec2 uv) {
      vec2 p = uv - 0.5;
      // Compress Y slightly to give an oblique view of the coil axis
      p.y *= 1.35;
      return length(p);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      float r = ovalRadius(uv);

      // Map radius to coil turns
      // r goes 0 (centre) to ~0.7 (corners); scale to turns count
      float rNorm = r * 2.0; // 0..1 across half-width
      float ring = fract(rNorm * u_turns);

      // Wire cross-section profile: bright lit top, dark shadow underneath
      // ring 0 = wire top (bright), ring 0.5 = gap (dark), ring ~0.8 = shadow underside
      // Smooth cosine-like profile
      float wireProfile = (cos(ring * 6.2832) * 0.5 + 0.5);

      // Shadow asymmetry — trailing edge (ring 0.5–1.0) is darker (self-shadow)
      float shadow = smoothstep(0.5, 0.85, ring) * 0.5;

      // Blend wire colour and gap colour
      // Gap is not zero — you see the gap shadow and the previous wire layer beneath
      vec3 wireCol = u_wire_color.rgb;
      vec3 gapCol  = u_gap_color.rgb;

      // Lit top
      vec3 lit    = wireCol * mix(0.75, 1.35, wireProfile);
      // Shadow fade on trailing side
      lit -= vec3(shadow * 0.35);

      // Mix wire face vs gap
      float gapMask = smoothstep(0.45, 0.55, ring); // gap at ring ~0.5
      vec3 col = mix(lit, gapCol, gapMask * 0.85);

      // Fine surface micro-noise on the wire (surface texture)
      float micro = noise(uv * 80.0) * 0.03 - 0.015;
      col += vec3(micro);

      // Vignette towards edges (coil out-of-frame)
      float vig = smoothstep(0.72, 0.48, rNorm);
      col = mix(gapCol * 0.6, col, vig);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_turns',      name: 'Coil Turns',  type: 'float', min: 4.0,  max: 30.0, default: 12.0 },
    { id: 'u_wire_color', name: 'Wire Color',  type: 'color', default: [0.75, 0.73, 0.68, 1.0] },
    { id: 'u_gap_color',  name: 'Gap Color',   type: 'color', default: [0.10, 0.09, 0.08, 1.0] }
  ]
};
