export default {
  id: 'planet_rings',
  name: 'Planet Rings',
  category: 'Cosmos',
  added: '2026-06-11',
  description: 'Saturn-style ice rings seen edge-on across the panel — banded ringlets, a dark Cassini gap, grainy particle shimmer, and a shadowed limb.',
  shader: `
    // Layered 1D value noise along the ring radius (drives ringlet banding)
    float ringNoise_prn(float x) {
      float v = 0.0;
      float a = 0.55;
      float f = 1.0;
      for (int i = 0; i < 5; i++) {
        float fl = floor(x * f);
        float fr = fract(x * f);
        fr = fr * fr * (3.0 - 2.0 * fr);
        v += a * mix(hash(vec2(fl, 3.7)), hash(vec2(fl + 1.0, 3.7)), fr);
        f *= 2.13;
        a *= 0.55;
      }
      return v;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Rings run horizontally with a gentle perspective bow
      float bow = sin(uv.x * 3.14159265) * u_tilt * 0.08;
      float ry = uv.y + bow;

      // Radial coordinate within the ring system (0 inner edge, 1 outer)
      float t = fract(ry * u_ring_scale);

      // --- Ringlet density profile ---
      // Stacked octaves of banding at several radial frequencies
      float bands = ringNoise_prn(t * 7.0);
      float fine  = ringNoise_prn(t * 41.0 + 13.0);
      float micro = ringNoise_prn(t * 160.0 + 51.0);
      float density = bands * 0.6 + fine * 0.3 + micro * 0.18;

      // --- Cassini division: a clean dark gap ---
      float gapPos = 0.62;
      float gap = 1.0 - smoothstep(0.035, 0.012, abs(t - gapPos));
      // Encke-style thin secondary gap
      float gap2 = 1.0 - smoothstep(0.012, 0.004, abs(t - 0.86));
      density *= gap * (0.55 + 0.45 * gap2);

      // Inner C-ring is translucent, B-ring densest, A-ring moderate
      float profile = smoothstep(0.02, 0.18, t) *
                      (0.45 + 0.55 * smoothstep(0.18, 0.34, t)) *
                      smoothstep(1.0, 0.93, t);
      // A-ring slightly dimmer than B-ring
      profile *= mix(1.0, 0.72, smoothstep(gapPos, gapPos + 0.05, t));
      density *= profile;

      // --- Particle grain: icy rubble shimmer along the bands ---
      float grain = hash(vec2(floor(uv.x * 900.0), floor(t * 380.0)));
      density *= 0.82 + 0.30 * grain;

      // --- Lighting: soft top-lit shading across each ring annulus ---
      float shade = 0.75 + 0.25 * sin(t * 6.2831853 + 1.2);

      // --- Palette ---
      vec3 space    = vec3(0.012, 0.012, 0.022);
      vec3 iceCol   = u_ring_color.rgb;            // pale sand-ice
      vec3 dustCol  = iceCol * vec3(0.62, 0.55, 0.50); // dustier inner tone
      vec3 shadowed = iceCol * 0.22;

      vec3 ringCol = mix(dustCol, iceCol, smoothstep(0.15, 0.6, t));
      ringCol = mix(shadowed, ringCol, shade);

      vec3 col = mix(space, ringCol, clamp(density * 1.6, 0.0, 1.0));

      // Bright specular thread where the densest B-ring catches the sun
      float gleam = smoothstep(0.55, 0.95, density) * smoothstep(0.42, 0.36, abs(t - 0.40));
      col += vec3(1.0, 0.97, 0.9) * gleam * 0.25;

      // Sparse background stars in the gaps
      vec2 g = floor(uv * 80.0);
      float star = smoothstep(0.97, 1.0, hash(g + 7.7)) *
                   smoothstep(0.09, 0.0, length(fract(uv * 80.0) - vec2(hash(g), hash(g + 31.0))));
      col += vec3(0.8, 0.85, 1.0) * star * (1.0 - clamp(density * 2.0, 0.0, 1.0));

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_ring_scale', name: 'Ring Bands',  type: 'float', min: 0.5, max: 4.0, default: 1.0 },
    { id: 'u_tilt',       name: 'Ring Bow',    type: 'float', min: 0.0, max: 1.0, default: 0.4 },
    { id: 'u_ring_color', name: 'Ice Colour',  type: 'color', default: [0.86, 0.78, 0.62, 1.0] }
  ]
};
