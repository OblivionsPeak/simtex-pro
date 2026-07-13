export default {
  id: 'basketball_pebble',
  name: 'Basketball Pebble',
  category: 'Sports',
  added: '2026-07-13',
  description: 'Game-ball pebble-grain leather — domed orange pebbles with per-pebble specular pop, split by curving black channel seams.',
  shader: `
    vec2 pebbleField(vec2 g) {
      vec2 cell = floor(g);
      vec2 f = fract(g);
      float dmin = 8.0;
      float id = 0.0;
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 o = vec2(float(i), float(j));
          vec2 pt = o + 0.15 + 0.7 * vec2(hash(cell + o), hash(cell + o + 7.7));
          float d = length(pt - f);
          if (d < dmin) { dmin = d; id = hash(cell + o + 3.1); }
        }
      }
      return vec2(dmin, id);
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 pw = pebbleField(uv);
      float d = pw.x;
      float id = pw.y;
      // domed pebble height and the recessed valley between pebbles
      float dome = 1.0 - smoothstep(0.0, 0.62, d);
      float valley = smoothstep(0.30, 0.55, d);
      // per-pebble tone variation so the grain never reads flat
      vec3 leather = u_primary_color.rgb * (0.90 + 0.20 * (id - 0.5));
      vec3 col = leather * (0.72 + 0.30 * dome);
      col = mix(col, leather * 0.55, valley * 0.6);
      // specular pop: sample the field offset toward the light to find lit slopes
      vec2 pw2 = pebbleField(uv + vec2(-0.10, 0.13));
      float lift = clamp((pw2.x - pw.x) * 3.5, 0.0, 1.0);
      float spec = pow(lift * dome, 3.0) * (0.45 + 0.85 * id);
      col += u_accent_color.rgb * spec * u_gloss;
      // faint grime settling into the valleys
      float grime = fbm(v_uv * 11.0 + 4.2);
      col *= 1.0 - 0.10 * valley * grime;
      // curving channel seams (tile via fract, wave via full sine periods)
      float s1 = abs(fract(v_uv.x + 0.5 + 0.10 * sin(v_uv.y * 6.28318)) - 0.5);
      float s2 = abs(fract(v_uv.y + 0.5 + 0.10 * sin(v_uv.x * 6.28318)) - 0.5);
      float sd = min(s1, s2);
      float w = u_seam_width;
      float shadow = 1.0 - smoothstep(w, w + 0.05, sd);
      col *= 1.0 - 0.35 * shadow;
      float seam = 1.0 - smoothstep(w, w + 0.008, sd);
      vec3 seamCol = u_secondary_color.rgb * (0.85 + 0.30 * dome);
      col = mix(col, seamCol, seam);
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Pebble Density', type: 'float', min: 30.0, max: 160.0, default: 70.0 },
    { id: 'u_seam_width', name: 'Seam Width', type: 'float', min: 0.005, max: 0.05, default: 0.018 },
    { id: 'u_gloss', name: 'Gloss', type: 'float', min: 0.0, max: 1.0, default: 0.6 },
    { id: 'u_primary_color', name: 'Leather', type: 'color', default: [0.82, 0.38, 0.12, 1.0] },
    { id: 'u_secondary_color', name: 'Seams', type: 'color', default: [0.06, 0.05, 0.05, 1.0] },
    { id: 'u_accent_color', name: 'Highlight', type: 'color', default: [1.0, 0.85, 0.65, 1.0] }
  ],
  variants: [
    { name: 'Game Ball', uniforms: { u_scale: 70.0, u_seam_width: 0.018, u_gloss: 0.6, u_primary_color: [0.82, 0.38, 0.12, 1.0], u_secondary_color: [0.06, 0.05, 0.05, 1.0], u_accent_color: [1.0, 0.85, 0.65, 1.0] } },
    { name: 'Blacktop', uniforms: { u_scale: 90.0, u_seam_width: 0.022, u_gloss: 0.35, u_primary_color: [0.16, 0.16, 0.18, 1.0], u_secondary_color: [0.55, 0.35, 0.12, 1.0], u_accent_color: [0.75, 0.78, 0.85, 1.0] } },
    { name: 'Neon League', uniforms: { u_scale: 55.0, u_seam_width: 0.015, u_gloss: 0.85, u_primary_color: [0.15, 0.65, 0.35, 1.0], u_secondary_color: [0.04, 0.08, 0.06, 1.0], u_accent_color: [0.85, 1.0, 0.6, 1.0] } }
  ]
};
