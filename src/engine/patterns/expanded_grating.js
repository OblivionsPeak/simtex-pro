export default {
  id: 'expanded_grating_pro',
  name: 'Expanded Metal',
  category: 'Industrial',
  description: 'Heavy industrial walkway grating with diamond-slotted apertures.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      
      float d = abs(gv.x) + abs(gv.y);
      float mask = step(0.4, d);
      
      // Slit shadow
      float shadow = smoothstep(0.4, 0.45, d) * 0.3;
      
      vec4 color = mix(u_secondary_color, u_primary_color, mask);
      color.rgb -= shadow;
      return color;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Mesh Density', type: 'float', min: 5.0, max: 50.0, default: 20.0 },
    { id: 'u_primary_color', name: 'Steel Rib', type: 'color', default: [0.3, 0.3, 0.33, 1.0] },
    { id: 'u_secondary_color', name: 'Aperture', type: 'color', default: [0.0, 0.0, 0.0, 1.0] }
  ]
};
