export default {
  id: 'brain_coral_pro',
  name: 'Brain Coral',
  category: 'Natural',
  description: 'Labyrinthine organic structure mimicking undersea brain coral.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = noise(uv);
      float maze = abs(sin(n * 20.0 + uv.x * 2.0));
      float mask = smoothstep(0.4, 0.5, maze);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Folding Size', type: 'float', min: 1.0, max: 10.0, default: 4.0 },
    { id: 'u_primary_color', name: 'Ridge', type: 'color', default: [1.0, 0.8, 0.8, 1.0] },
    { id: 'u_secondary_color', name: 'Deep Crevice', type: 'color', default: [0.4, 0.1, 0.2, 1.0] }
  ]
};
