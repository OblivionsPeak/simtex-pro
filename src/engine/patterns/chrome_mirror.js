export default {
  id: 'chrome_mirror',
  name: 'Chrome Mirror',
  category: 'Industrial',
  description: 'Mirror-polished chrome finish with gradient reflection bands simulating sky, horizon, and ground environment.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Micro surface imperfection — tiny waviness distorting the reflection
      float micro = noise(uv * 180.0) * 0.004;
      float distY = uv.y + micro;

      // Reflection bands: map distorted Y through band_count sinusoidal zones
      // Simulates: sky (bright blue-white top), dark horizon, bright floor, dark undercarriage
      float bandPos = distY * u_band_count;
      float band = sin(bandPos * 3.14159);

      // Colour palette of reflected environment
      // bright sky white-blue, mid dark, lower warm floor highlight
      float t = fract(bandPos / 2.0);
      vec3 skyCol   = vec3(0.85, 0.92, 1.00);   // sky
      vec3 horizCol = vec3(0.05, 0.05, 0.06);   // dark horizon
      vec3 floorCol = vec3(0.75, 0.72, 0.65);   // warm ground
      vec3 envColor;
      if (t < 0.5) {
        envColor = mix(skyCol, horizCol, t * 2.0);
      } else {
        envColor = mix(horizCol, floorCol, (t - 0.5) * 2.0);
      }

      // Apply contrast
      float lum = dot(envColor, vec3(0.299, 0.587, 0.114));
      envColor = mix(vec3(lum), envColor, 1.0) * pow(lum + 0.001, 1.0 - u_contrast * 0.3);
      envColor = mix(vec3(0.5), envColor, u_contrast);

      // Chrome tint — very slightly blue-silver
      vec3 chromeTint = vec3(0.96, 0.97, 1.0);
      vec3 col = envColor * chromeTint;

      // Sharp specular hotspot at UV centre
      float dx = uv.x - 0.5; float dy = uv.y - 0.5;
      float spec = exp(-(dx * dx + dy * dy) * 40.0) * 0.6;
      col += vec3(spec);

      // Horizontal edge darkening (shadow of object edge)
      float edgeDark = smoothstep(0.0, 0.08, uv.x) * smoothstep(1.0, 0.92, uv.x);
      col *= mix(0.55, 1.0, edgeDark);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_contrast',   name: 'Reflection Contrast', type: 'float', min: 0.5, max: 3.0,  default: 2.0 },
    { id: 'u_band_count', name: 'Band Count',           type: 'float', min: 2.0, max: 12.0, default: 6.0 }
  ]
};
