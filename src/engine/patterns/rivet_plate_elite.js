export default {
  id: 'rivet_plate_elite',
  name: 'Rivet Plate Elite',
  category: 'Industrial',
  description: 'Overlapping heavy armor sections with structural corner rivets.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv);
      
      float plate = step(0.02, gv.x) * step(gv.x, 0.98) * step(0.02, gv.y) * step(gv.y, 0.98);
      float rivet = 0.0;
      if (length(gv - 0.1) < 0.05) rivet = 1.0;
      if (length(gv - 0.9) < 0.05) rivet = 1.0;
      
      float mask = max(plate * 0.5, rivet);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Plate Count', type: 'float', min: 1.0, max: 10.0, default: 4.0 },
    { id: 'u_primary_color', name: 'Armor Steel', type: 'color', default: [0.5, 0.5, 0.55, 1.0] },
    { id: 'u_secondary_color', name: 'Seam', type: 'color', default: [0.1, 0.1, 0.12, 1.0] }
  ]
};
