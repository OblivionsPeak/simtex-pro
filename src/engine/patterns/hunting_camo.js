export default {
  id: 'hunting_camo_forest',
  name: 'Forest Hunting Camo',
  category: 'Racing',
  description: 'Pro-grade wilderness camouflage with organic branch and leaf shapes.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n1 = noise(uv * 1.5);
      float mask1 = step(0.6, n1);
      float n2 = noise(uv * 3.0 + n1 * 0.5);
      float mask2 = step(0.6, n2);
      float n3 = noise(vec2(uv.x * 0.5, uv.y * 4.0));
      float mask3 = step(0.7, n3);
      
      vec4 forestGreen = vec4(0.1, 0.15, 0.05, 1.0);
      vec4 tan = vec4(0.5, 0.45, 0.3, 1.0);
      vec4 brown = vec4(0.25, 0.15, 0.1, 1.0);
      vec4 dark = vec4(0.05, 0.05, 0.02, 1.0);
      
      vec4 color = tan;
      color = mix(color, forestGreen, mask2);
      color = mix(color, brown, mask1);
      color = mix(color, dark, mask3);
      
      if (u_is_spec > 0.5) return vec4(0.0, 0.9, 0.0, 1.0);
      return color;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Detail Density', type: 'float', min: 1.0, max: 10.0, default: 3.5 }
  ]
};
