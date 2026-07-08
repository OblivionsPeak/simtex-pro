export default {
  id: 'murmuration',
  name: 'Murmuration',
  category: 'Natural',
  added: '2026-07-07',
  description: 'A starling flock at dusk — thousands of tiny wing-flecks pooling into dense waves.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // dusk sky gradient
      vec4 col = mix(u_secondary_color, u_accent_color, clamp(1.0 - v_uv.y, 0.0, 1.0));
      // flock density field: swirling banded fbm
      vec2 q = uv + vec2(snoise(uv * 0.3), snoise(uv * 0.3 + vec2(7.0, 2.0))) * 2.0;
      float density = smoothstep(0.1, 0.9, fbm(q * 0.5) * 0.5 + 0.5);
      // birds: jittered grid points that only appear where dense
      vec2 grid = uv * 6.0;
      vec2 cell = floor(grid);
      vec2 f = fract(grid) - 0.5;
      vec2 jit = vec2(hash(cell + 1.7), hash(cell + 3.9)) - 0.5;
      vec2 bp = f - jit * 0.8;
      // tiny elongated fleck, orientation follows the flow
      float ang = snoise(cell * 0.2) * 3.14;
      vec2 lp = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * bp;
      float bird = smoothstep(0.09, 0.03, length(lp * vec2(1.0, 3.5)));
      float present = step(hash(cell + 8.1), density * u_flock);
      col.rgb = mix(col.rgb, u_primary_color.rgb, bird * present);
      // distant haze of the densest core
      col.rgb = mix(col.rgb, u_primary_color.rgb, density * density * 0.25);
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Flock Scale', type: 'float', min: 1.0, max: 10.0, default: 4.0 },
    { id: 'u_flock', name: 'Flock Density', type: 'float', min: 0.2, max: 1.0, default: 0.85 },
    { id: 'u_primary_color', name: 'Birds', type: 'color', default: [0.1, 0.09, 0.12, 1.0] },
    { id: 'u_secondary_color', name: 'Sky High', type: 'color', default: [0.45, 0.5, 0.65, 1.0] },
    { id: 'u_accent_color', name: 'Horizon', type: 'color', default: [0.95, 0.6, 0.35, 1.0] }
  ],
  variants: [
    { name: 'Dusk Flock', uniforms: { u_primary_color: [0.1, 0.09, 0.12, 1.0], u_secondary_color: [0.45, 0.5, 0.65, 1.0], u_accent_color: [0.95, 0.6, 0.35, 1.0], u_flock: 0.85 } },
    { name: 'Storm Front', uniforms: { u_primary_color: [0.06, 0.06, 0.08, 1.0], u_secondary_color: [0.35, 0.38, 0.42, 1.0], u_accent_color: [0.6, 0.62, 0.66, 1.0], u_flock: 1.0 } },
    { name: 'Dawn Rose', uniforms: { u_primary_color: [0.2, 0.12, 0.18, 1.0], u_secondary_color: [0.55, 0.55, 0.75, 1.0], u_accent_color: [0.98, 0.75, 0.7, 1.0], u_flock: 0.6 } }
  ]
};
