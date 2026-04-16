export default {
  id: 'penrose_tiling_artisan',
  name: 'Penrose Mesh',
  category: 'Abstract',
  description: 'Aperiodic, non-repeating tiling lines mimicking complex mathematical quasicrystal structures.',
  shader: `
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * u_scale;
      float a = 0.62831853; // 2pi/10
      float d = 0.0;
      for (int i=0; i<5; i++) {
        vec2 dir = vec2(cos(float(i)*a), sin(float(i)*a));
        d += step(0.9, fract(dot(uv, dir)));
      }
      return mix(u_secondary_color, u_primary_color, clamp(d, 0.0, 1.0));
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Penrose Detail', type: 'float', min: 2.0, max: 20.0, default: 10.0 },
    { id: 'u_primary_color', name: 'Tiling Line', type: 'color', default: [1.0, 0.8, 0.0, 1.0] },
    { id: 'u_secondary_color', name: 'Void Space', type: 'color', default: [0.05, 0.05, 0.1, 1.0] }
  ]
};
