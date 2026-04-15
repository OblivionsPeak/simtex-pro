export default {
  id: 'solar_flare_pro',
  name: 'Solar Flare',
  category: 'Abstract',
  description: 'Static plasma energy flux with high-intensity radiation centers.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // Removed time dependency
      float n = noise(uv);
      float flare = pow(n, 3.0) * 2.0;
      return mix(u_secondary_color, u_primary_color, flare);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Flare Scale', type: 'float', min: 1.0, max: 10.0, default: 4.0 },
    { id: 'u_primary_color', name: 'Plasma Heat', type: 'color', default: [1.0, 0.8, 0.2, 1.0] },
    { id: 'u_secondary_color', name: 'Corona', type: 'color', default: [0.5, 0.1, 0.0, 1.0] }
  ]
};
