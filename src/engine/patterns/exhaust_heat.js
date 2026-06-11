export default {
  id: 'exhaust_heat_artisan',
  name: 'Exhaust Bluing',
  category: 'Industrial',
  description: 'Wavy prismatic heat seasoning found on high-temperature titanium and steel exhaust systems.',
  shader: `
    vec4 generate() {
      float n = noise(v_uv * 5.0);
      vec3 col = 0.5 + 0.5 * cos(3.14159 * (n + vec3(0, 0.2, 0.4)));
      return vec4(col, 1.0);
    }
  `,
  uniforms: []
};
