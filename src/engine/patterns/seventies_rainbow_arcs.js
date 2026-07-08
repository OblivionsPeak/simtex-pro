export default {
  id: 'seventies_rainbow_arcs',
  name: '70s Rainbow Arcs',
  category: 'Retro',
  added: '2026-07-07',
  description: 'Supergraphic rainbow bands sweeping in quarter-circles from alternating corners.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 cell = floor(uv);
      vec2 f = fract(uv);
      // anchor corner alternates in a 2x2 super-tile
      vec2 corner = vec2(mod(cell.x, 2.0), mod(cell.y, 2.0));
      vec2 p = abs(f - corner);
      float r = length(p);
      // band index from the radius
      float bands = u_bands;
      float idx = floor(r * bands);
      float t = clamp(idx / (bands - 1.0), 0.0, 1.0);
      // ramp across three anchor colors
      vec3 c;
      if (t < 0.5) c = mix(u_primary_color.rgb, u_accent_color.rgb, t * 2.0);
      else c = mix(u_accent_color.rgb, u_pop_color.rgb, (t - 0.5) * 2.0);
      // outside the largest arc: field color
      float inside = step(r, 1.0);
      vec3 outc = mix(u_secondary_color.rgb, c, inside);
      // crisp seam lines between bands
      float seam = smoothstep(0.03, 0.0, abs(fract(r * bands) - 0.5) - 0.44) * inside;
      outc *= 1.0 - seam * u_seams * 0.25;
      return vec4(outc, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Arc Density', type: 'float', min: 1.0, max: 8.0, default: 2.0 },
    { id: 'u_bands', name: 'Band Count', type: 'float', min: 3.0, max: 12.0, default: 6.0 },
    { id: 'u_seams', name: 'Seam Lines', type: 'float', min: 0.0, max: 1.0, default: 0.4 },
    { id: 'u_secondary_color', name: 'Field', type: 'color', default: [0.94, 0.9, 0.8, 1.0] },
    { id: 'u_primary_color', name: 'Inner Band', type: 'color', default: [0.85, 0.25, 0.15, 1.0] },
    { id: 'u_accent_color', name: 'Middle Band', type: 'color', default: [0.9, 0.6, 0.15, 1.0] },
    { id: 'u_pop_color', name: 'Outer Band', type: 'color', default: [0.35, 0.45, 0.3, 1.0] }
  ],
  variants: [
    { name: 'Harvest Kitchen', uniforms: { u_secondary_color: [0.94, 0.9, 0.8, 1.0], u_primary_color: [0.85, 0.25, 0.15, 1.0], u_accent_color: [0.9, 0.6, 0.15, 1.0], u_pop_color: [0.35, 0.45, 0.3, 1.0], u_bands: 6.0 } },
    { name: 'Roller Disco', uniforms: { u_secondary_color: [0.1, 0.08, 0.16, 1.0], u_primary_color: [0.95, 0.35, 0.65, 1.0], u_accent_color: [0.5, 0.35, 0.85, 1.0], u_pop_color: [0.2, 0.75, 0.85, 1.0], u_bands: 8.0 } },
    { name: 'Sunroom', uniforms: { u_secondary_color: [0.97, 0.95, 0.9, 1.0], u_primary_color: [0.95, 0.75, 0.3, 1.0], u_accent_color: [0.9, 0.55, 0.35, 1.0], u_pop_color: [0.75, 0.4, 0.45, 1.0], u_bands: 5.0 } }
  ]
};
