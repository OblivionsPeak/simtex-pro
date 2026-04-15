export default {
  id: 'digi_camo_urban',
  name: 'Urban Digi Camo',
  category: 'Racing',
  description: 'High-contrast city digital camouflage.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec3 generate() {
      vec2 uv = floor(v_uv * u_scale);
      float n = hash(uv);
      vec3 color = vec3(0.5);
      if (n > 0.8) color = vec3(0.1);
      else if (n > 0.5) color = vec3(0.3);
      else if (n > 0.2) color = vec3(0.7);
      return color;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Detail', type: 'float', min: 10.0, max: 100.0, default: 50.0 }
  ]
};
