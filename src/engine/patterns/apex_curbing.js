export default {
  id: 'apex_curb_pro',
  name: 'Apex Curbing',
  category: 'Racing',
  description: 'Alternating track-side curb pattern with adjustable curve intensity.',
  shader: `
    vec3 generate() {
      // Warp the UV to simulate a curve
      float warp = sin(v_uv.x * 2.0) * u_curve;
      float val = fract((v_uv.y + warp) * u_scale);
      float mask = step(0.5, val);
      
      vec3 color = mix(u_secondary_color, u_primary_color, mask);
      if (u_is_spec > 0.5) return vec3(0.0, 0.0, 0.0);
      return color;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Segments', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_curve', name: 'Curve Warping', type: 'float', min: 0.0, max: 0.5, default: 0.1 },
    { id: 'u_primary_color', name: 'Color A', type: 'color', default: [1.0, 0.0, 0.0] },
    { id: 'u_secondary_color', name: 'Color B', type: 'color', default: [1.0, 1.0, 1.0] }
  ]
};
