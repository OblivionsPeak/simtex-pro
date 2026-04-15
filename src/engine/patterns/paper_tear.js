export default {
  id: 'paper_tear_artisan',
  name: 'Aggressive Tear',
  category: 'Abstract',
  description: 'High-intensity directional shreds and jagged ruptures mimicking ripped metal or heavy cardstock.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p); p *= 2.0; a *= 0.5;
      }
      return v;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // Directional shred math
      float shred = fbm(uv * vec2(1.0, 5.0) + fbm(uv * 2.0) * u_intensity);
      float mask = smoothstep(0.4, 0.5, shred);
      
      // Add jaggedness to the edge
      float jagged = fbm(uv * 15.0) * 0.2;
      mask = smoothstep(0.4 + jagged, 0.5 + jagged, shred);
      
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Shred Scale', type: 'float', min: 1.0, max: 10.0, default: 3.0 },
    { id: 'u_intensity', name: 'Aggression', type: 'float', min: 0.1, max: 5.0, default: 2.0 },
    { id: 'u_primary_color', name: 'Top Layer', type: 'color', default: [0.1, 0.1, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Deep Tear', type: 'color', default: [0.95, 0.95, 0.95, 1.0] }
  ]
};
