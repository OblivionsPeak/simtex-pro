export default {
  id: 'tie_dye_spiral',
  name: 'Tie-Dye Spiral',
  category: 'Textile',
  added: '2026-07-07',
  description: 'The classic pinwheel tie-dye — dye sectors twisting into the center with white crease rays.',
  shader: `
    vec4 generate() {
      vec2 p = (v_uv - 0.5) * u_scale;
      float r = length(p);
      float ang = atan(p.y, p.x);
      // spiral: sector angle advances with radius
      float spiral = ang + r * u_twist;
      // wobble the sector boundaries like soaked fabric
      spiral += snoise(p * 3.0) * 0.25;
      float sector = fract(spiral * 3.0 / 6.28318);
      // three dye colors around the wheel
      vec3 c;
      if (sector < 0.333) c = mix(u_primary_color.rgb, u_accent_color.rgb, sector * 3.0);
      else if (sector < 0.666) c = mix(u_accent_color.rgb, u_pop_color.rgb, (sector - 0.333) * 3.0);
      else c = mix(u_pop_color.rgb, u_primary_color.rgb, (sector - 0.666) * 3.0);
      // dye saturation varies with cloth absorption
      c = mix(c, c * 1.25, snoise(p * 6.0 + 5.0) * 0.3);
      // white crease lines where the fabric was folded (sector edges)
      float crease = smoothstep(0.06, 0.0, abs(fract(spiral * 3.0 / 6.28318 * 3.0) - 0.5) - 0.42);
      c = mix(c, u_secondary_color.rgb, crease * u_crease);
      // pale center knot
      c = mix(c, u_secondary_color.rgb, smoothstep(0.25, 0.0, r) * 0.5);
      // fabric weave
      c *= 0.95 + 0.05 * sin(p.x * 160.0) * sin(p.y * 160.0);
      return vec4(c, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Zoom', type: 'float', min: 1.0, max: 8.0, default: 2.5 },
    { id: 'u_twist', name: 'Spiral Twist', type: 'float', min: 0.5, max: 8.0, default: 3.0 },
    { id: 'u_crease', name: 'Crease Lines', type: 'float', min: 0.0, max: 1.0, default: 0.6 },
    { id: 'u_primary_color', name: 'Dye 1', type: 'color', default: [0.9, 0.2, 0.3, 1.0] },
    { id: 'u_accent_color', name: 'Dye 2', type: 'color', default: [0.95, 0.8, 0.15, 1.0] },
    { id: 'u_pop_color', name: 'Dye 3', type: 'color', default: [0.2, 0.4, 0.85, 1.0] },
    { id: 'u_secondary_color', name: 'Cloth', type: 'color', default: [0.96, 0.95, 0.92, 1.0] }
  ],
  variants: [
    { name: 'Summer of 69', uniforms: { u_primary_color: [0.9, 0.2, 0.3, 1.0], u_accent_color: [0.95, 0.8, 0.15, 1.0], u_pop_color: [0.2, 0.4, 0.85, 1.0], u_secondary_color: [0.96, 0.95, 0.92, 1.0], u_twist: 3.0 } },
    { name: 'Grape Swirl', uniforms: { u_primary_color: [0.5, 0.2, 0.7, 1.0], u_accent_color: [0.85, 0.3, 0.6, 1.0], u_pop_color: [0.25, 0.25, 0.55, 1.0], u_secondary_color: [0.94, 0.92, 0.95, 1.0], u_twist: 4.5 } },
    { name: 'Sea Breeze', uniforms: { u_primary_color: [0.1, 0.55, 0.6, 1.0], u_accent_color: [0.4, 0.8, 0.75, 1.0], u_pop_color: [0.15, 0.3, 0.55, 1.0], u_secondary_color: [0.95, 0.97, 0.96, 1.0], u_twist: 2.0 } }
  ]
};
