export default {
  id: 'exhaust_heat_artisan',
  name: 'Exhaust Bluing',
  category: 'Industrial',
  description: 'Wavy prismatic heat seasoning found on high-temperature titanium and steel exhaust systems.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * 5.0);
      vec3 col = 0.5 + 0.5 * cos(3.14159 * (n + vec3(0, 0.2, 0.4)));
      return vec4(col, 1.0);
    }
  `,
  uniforms: []
};
