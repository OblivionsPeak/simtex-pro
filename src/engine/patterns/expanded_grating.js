export default {
  id: 'expanded_grating_pro',
  name: 'Expanded Metal',
  category: 'Industrial',
  added: '2026-04-15',
  description: 'Expanded-metal walkway grating — staggered diamond apertures with twisted, light-catching strands.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // expanded metal is a staggered bond: offset alternate rows half a cell
      uv.x += step(1.0, mod(floor(uv.y), 2.0)) * 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = abs(gv.x) + abs(gv.y) * 1.6;   // elongated diamonds
      float hole = smoothstep(0.31, 0.34, d);  // 1 = metal, 0 = aperture
      // strand shading: the metal between holes twists — light rakes across
      float twist = sin((gv.x - gv.y) * 6.0 + 1.2);
      vec3 rib = u_primary_color.rgb * (0.65 + 0.35 * twist);
      // sheared top edge catches a hard highlight along the upper hole rim
      float rim = smoothstep(0.05, 0.0, abs(d - 0.36)) * clamp(-gv.y * 4.0, 0.0, 1.0);
      rib += rim * 0.35;
      // mild wear mottling
      rib *= 0.9 + 0.1 * snoise(uv * 3.0);
      // aperture: dark with a hint of depth gradient
      vec3 ap = u_secondary_color.rgb * (0.7 + 0.3 * clamp(gv.y + 0.5, 0.0, 1.0));
      vec3 col = mix(ap, rib, hole);
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Mesh Density', type: 'float', min: 5.0, max: 50.0, default: 14.0 },
    { id: 'u_primary_color', name: 'Steel Rib', type: 'color', default: [0.55, 0.56, 0.6, 1.0] },
    { id: 'u_secondary_color', name: 'Aperture', type: 'color', default: [0.04, 0.04, 0.05, 1.0] }
  ],
  variants: [
    { name: 'Walkway', uniforms: { u_primary_color: [0.55, 0.56, 0.6, 1.0], u_secondary_color: [0.04, 0.04, 0.05, 1.0], u_scale: 14.0 } },
    { name: 'Rusted Catwalk', uniforms: { u_primary_color: [0.5, 0.32, 0.2, 1.0], u_secondary_color: [0.06, 0.03, 0.02, 1.0], u_scale: 12.0 } },
    { name: 'Anodized Grille', uniforms: { u_primary_color: [0.2, 0.22, 0.28, 1.0], u_secondary_color: [0.02, 0.02, 0.03, 1.0], u_scale: 24.0 } }
  ]
};
