export default {
  id: 'diffraction_grating_artisan',
  name: 'Diffraction Grating',
  category: 'Experimental',
  description: 'Rainbow-like spectral interference bands mimicking light diffraction on surfaces.',
  shader: `
    vec4 generate() {
      float d = sin(v_uv.x * 500.0 + v_uv.y * 50.0);
      vec3 rainbow = vec3(0.5) + 0.5 * cos(vec3(0,2,4) + d * 3.14);
      return vec4(rainbow, 1.0);
    }
  `,
  uniforms: []
};
