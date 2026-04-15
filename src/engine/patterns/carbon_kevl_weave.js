export default {
  id: 'carbon_kevl_weave',
  name: 'Carbon-Kevlar',
  category: 'Racing',
  description: 'Hybrid Kevlar and Carbon weave.',
  shader: `
    vec3 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 id = floor(uv);
      float mask = step(0.5, fract(uv.x + uv.y * 0.5));
      if (mod(id.x + id.y, 2.0) > 0.5) mask = 1.0 - mask;
      return mix(vec3(0.1), vec3(0.8, 0.7, 0.1), mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Weave Size', type: 'float', min: 10.0, max: 100.0, default: 50.0 }
  ]
};
