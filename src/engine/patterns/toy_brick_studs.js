export default {
  id: 'toy_brick_studs',
  name: 'Toy Brick Studs',
  category: 'Novelty',
  added: '2026-07-13',
  description: 'A top-down toy brick baseplate — glossy cylindrical studs on a molded grid, with optional multicolour brick regions.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 cell = floor(uv);
      vec2 f = fract(uv) - 0.5;
      // 4x2-stud brick regions
      vec2 brick = vec2(floor(uv.x / 4.0), floor(uv.y / 2.0));
      float hb = hash(brick + 13.5);
      vec3 base = u_primary_color.rgb;
      if (hb < u_mix) {
        base = mix(u_secondary_color.rgb, u_accent_color.rgb, step(0.5, hash(brick + 27.9)));
      }
      // per-brick molding tone + injection grain
      base *= 0.96 + 0.08 * hash(brick + 3.3);
      base *= 0.985 + 0.03 * noise(uv * 7.0);
      // seams between bricks
      float sx = min(fract(uv.x / 4.0), 1.0 - fract(uv.x / 4.0)) * 4.0;
      float sy = min(fract(uv.y / 2.0), 1.0 - fract(uv.y / 2.0)) * 2.0;
      float seam = min(sx, sy);
      vec3 col = base * (0.68 + 0.32 * smoothstep(0.015, 0.06, seam));
      // gentle per-cell plate light from upper-left
      col *= 1.0 + 0.05 * (f.y - f.x);
      float r = length(f);
      float aa = 0.02;
      float dS = r - 0.33;
      // soft cast shadow low-right of each stud
      float dSh = length(f - vec2(0.05, -0.05)) - 0.34;
      col = mix(col, col * 0.62, (1.0 - smoothstep(0.0, 0.09, dSh)) * step(0.0, dS));
      // cylinder wall with directional light and a specular arc
      float lit = dot(normalize(f + vec2(0.0001, 0.0)), normalize(vec2(-0.6, 0.75)));
      vec3 wallCol = base * (0.80 + 0.32 * lit);
      wallCol += vec3(u_gloss * 0.40 * pow(max(lit, 0.0), 6.0));
      col = mix(col, wallCol, 1.0 - smoothstep(0.33 - aa, 0.33 + aa, r));
      // flat blank stud top, slightly brighter
      float topM = 1.0 - smoothstep(0.24 - aa, 0.24 + aa, r);
      col = mix(col, base * 1.08, topM);
      // plastic gloss dot on the stud top
      float gd = length(f - vec2(-0.09, 0.10));
      col += vec3(u_gloss * 0.45) * (1.0 - smoothstep(0.02, 0.10, gd)) * topM;
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Stud Density', type: 'float', min: 6.0, max: 40.0, default: 16.0 },
    { id: 'u_mix', name: 'Colour Bricks', type: 'float', min: 0.0, max: 1.0, default: 0.35 },
    { id: 'u_gloss', name: 'Gloss', type: 'float', min: 0.0, max: 1.0, default: 0.6 },
    { id: 'u_primary_color', name: 'Plate', type: 'color', default: [0.75, 0.10, 0.12, 1.0] },
    { id: 'u_secondary_color', name: 'Brick A', type: 'color', default: [0.95, 0.75, 0.10, 1.0] },
    { id: 'u_accent_color', name: 'Brick B', type: 'color', default: [0.12, 0.35, 0.70, 1.0] }
  ],
  variants: [
    { name: 'Playroom Red', uniforms: { u_scale: 16.0, u_mix: 0.35, u_gloss: 0.6, u_primary_color: [0.75, 0.10, 0.12, 1.0], u_secondary_color: [0.95, 0.75, 0.10, 1.0], u_accent_color: [0.12, 0.35, 0.70, 1.0] } },
    { name: 'Baseplate Green', uniforms: { u_scale: 22.0, u_mix: 0.0, u_gloss: 0.5, u_primary_color: [0.15, 0.45, 0.20, 1.0], u_secondary_color: [0.15, 0.45, 0.20, 1.0], u_accent_color: [0.15, 0.45, 0.20, 1.0] } },
    { name: 'Pastel Builder', uniforms: { u_scale: 12.0, u_mix: 0.7, u_gloss: 0.8, u_primary_color: [0.90, 0.88, 0.92, 1.0], u_secondary_color: [0.60, 0.82, 0.90, 1.0], u_accent_color: [0.95, 0.70, 0.78, 1.0] } }
  ]
};
