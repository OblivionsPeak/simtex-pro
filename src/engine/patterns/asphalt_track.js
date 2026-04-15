export default {
  id: 'asphalt_track',
  name: 'Track Asphalt',
  category: 'Natural',
  description: 'Rough high-grip racing circuit asphalt.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9, 78.2))) * 43758.5); }
    vec3 generate() {
      float n = hash(floor(v_uv * u_scale));
      return mix(vec3(0.15), vec3(0.25), n);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Grit Scale', type: 'float', min: 100.0, max: 1000.0, default: 400.0 }
  ]
};
