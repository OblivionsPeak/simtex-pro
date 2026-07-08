export default {
  id: 'crochet_granny_squares',
  name: 'Granny Squares',
  category: 'Textile',
  added: '2026-07-07',
  description: 'Crocheted granny-square blanket — concentric yarn rounds in clashing colors, joined by a border stitch.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 cell = floor(uv);
      vec2 f = fract(uv) - 0.5;
      // concentric rounds by chebyshev distance
      float d = max(abs(f.x), abs(f.y));
      float roundI = floor(d * 8.0);
      // color per round per square
      float pick = hash(cell + roundI * 0.173);
      vec3 yarn = u_primary_color.rgb;
      if (pick > 0.75) yarn = u_accent_color.rgb;
      else if (pick > 0.5) yarn = u_pop_color.rgb;
      else if (pick > 0.25) yarn = u_secondary_color.rgb;
      // shell-cluster stitch texture: bumps along the round
      float ang = atan(f.y, f.x);
      float peri = d * 8.0;
      float bumps = 0.5 + 0.5 * sin(ang * (8.0 + roundI * 6.0));
      float rr = fract(d * 8.0);
      float stitch = sin(rr * 3.14159);
      yarn *= 0.7 + 0.3 * stitch * (0.7 + 0.3 * bumps);
      // border join in a constant color
      float border = step(0.44, d);
      yarn = mix(yarn, u_border_color.rgb * (0.75 + 0.25 * bumps), border);
      // tiny gaps between clusters read as dark holes
      float hole = smoothstep(0.35, 0.0, stitch) * smoothstep(0.4, 0.2, bumps);
      yarn *= 1.0 - hole * 0.5;
      return vec4(yarn, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Square Density', type: 'float', min: 2.0, max: 14.0, default: 5.0 },
    { id: 'u_primary_color', name: 'Yarn 1', type: 'color', default: [0.85, 0.3, 0.25, 1.0] },
    { id: 'u_secondary_color', name: 'Yarn 2', type: 'color', default: [0.9, 0.7, 0.2, 1.0] },
    { id: 'u_pop_color', name: 'Yarn 3', type: 'color', default: [0.25, 0.55, 0.5, 1.0] },
    { id: 'u_accent_color', name: 'Yarn 4', type: 'color', default: [0.8, 0.8, 0.75, 1.0] },
    { id: 'u_border_color', name: 'Border Yarn', type: 'color', default: [0.12, 0.12, 0.14, 1.0] }
  ],
  variants: [
    { name: 'Cabin Blanket', uniforms: { u_primary_color: [0.85, 0.3, 0.25, 1.0], u_secondary_color: [0.9, 0.7, 0.2, 1.0], u_pop_color: [0.25, 0.55, 0.5, 1.0], u_accent_color: [0.8, 0.8, 0.75, 1.0], u_border_color: [0.12, 0.12, 0.14, 1.0] } },
    { name: 'Pastel Nursery', uniforms: { u_primary_color: [0.95, 0.75, 0.8, 1.0], u_secondary_color: [0.75, 0.85, 0.95, 1.0], u_pop_color: [0.8, 0.92, 0.8, 1.0], u_accent_color: [0.98, 0.95, 0.85, 1.0], u_border_color: [0.95, 0.95, 0.95, 1.0] } },
    { name: 'Van Interior 74', uniforms: { u_primary_color: [0.65, 0.35, 0.12, 1.0], u_secondary_color: [0.85, 0.6, 0.2, 1.0], u_pop_color: [0.45, 0.45, 0.2, 1.0], u_accent_color: [0.55, 0.25, 0.1, 1.0], u_border_color: [0.2, 0.12, 0.06, 1.0] } }
  ]
};
