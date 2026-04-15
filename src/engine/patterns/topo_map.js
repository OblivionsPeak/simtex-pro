export default {
  id: 'topographic_pro',
  name: 'Topographic Map',
  category: 'Abstract',
  description: 'Technical contour lines mimicking elevation mapping.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec3 generate() {
      float n = noise(v_uv * u_scale);
      float line = fract(n * u_layers);
      float mask = step(0.9, line);
      
      vec3 color = mix(u_secondary_color, u_primary_color, mask);
      if (u_is_spec > 0.5) return vec3(0.1, 0.4, 1.0);
      return color;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Territory Size', type: 'float', min: 1.0, max: 10.0, default: 3.0 },
    { id: 'u_layers', name: 'Contour Detail', type: 'float', min: 5.0, max: 50.0, default: 20.0 },
    { id: 'u_primary_color', name: 'Line Color', type: 'color', default: [1.0, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Land Color', type: 'color', default: [0.1, 0.1, 0.1] }
  ]
};
