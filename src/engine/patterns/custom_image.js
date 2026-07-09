export default {
  id: 'custom_image',
  name: 'Custom Image',
  category: 'Custom',
  added: '2026-07-09',
  isImage: true,
  description: 'Bring your own PNG or JPG and run it through the SimTex toolchain — seamless tiling, spec and normal map export, plus brightness, contrast, saturation, hue, and posterize controls.',
  shader: `
    uniform sampler2D u_image;
    uniform float u_has_image;

    vec3 hueshift_ci(vec3 color, float ang) {
      const vec3 k = vec3(0.57735);
      float c = cos(ang);
      return color * c + cross(k, color) * sin(ang) + k * dot(k, color) * (1.0 - c);
    }

    vec4 generate() {
      vec2 uv = fract(v_uv);

      if (u_has_image < 0.5) {
        // placeholder: checkerboard with a framed photo glyph
        float ch = mod(floor(uv.x * 10.0) + floor(uv.y * 10.0), 2.0);
        vec3 col = mix(vec3(0.055, 0.06, 0.072), vec3(0.082, 0.088, 0.104), ch);
        vec2 c = uv - 0.5;
        // frame
        vec2 fr = abs(c) - vec2(0.20, 0.15);
        float frame = step(max(fr.x, fr.y), 0.0) - step(max(fr.x + 0.012, fr.y + 0.012), 0.0);
        col = mix(col, vec3(0.30, 0.33, 0.38), clamp(frame, 0.0, 1.0));
        // sun
        float sun = smoothstep(0.035, 0.030, length(c - vec2(-0.09, 0.06)));
        // mountain
        float mtn = step(abs(c.x - 0.04), 0.10) * step(c.y, -0.14 + (0.10 - abs(c.x - 0.04)) * 1.1) * step(-0.15, c.y);
        float inside = step(max(fr.x + 0.02, fr.y + 0.02), 0.0);
        col = mix(col, vec3(0.30, 0.33, 0.38), clamp(sun + mtn, 0.0, 1.0) * inside);
        return vec4(col, 1.0);
      }

      vec3 col = texture2D(u_image, uv).rgb;
      col *= u_brightness;
      col = (col - 0.5) * u_contrast + 0.5;
      float lum = dot(col, vec3(0.299, 0.587, 0.114));
      col = mix(vec3(lum), col, u_saturation);
      col = hueshift_ci(col, radians(u_hue));
      if (u_posterize > 1.5) {
        float n = floor(u_posterize);
        col = floor(clamp(col, 0.0, 1.0) * n) / (n - 1.0);
      }
      return vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `,
  uniforms: [
    { id: 'u_brightness', name: 'Brightness', type: 'float', min: 0.2,    max: 2.0,   default: 1.0 },
    { id: 'u_contrast',   name: 'Contrast',   type: 'float', min: 0.2,    max: 2.5,   default: 1.0 },
    { id: 'u_saturation', name: 'Saturation', type: 'float', min: 0.0,    max: 2.0,   default: 1.0 },
    { id: 'u_hue',        name: 'Hue Shift',  type: 'float', min: -180.0, max: 180.0, default: 0.0 },
    { id: 'u_posterize',  name: 'Posterize',  type: 'float', min: 0.0,    max: 12.0,  default: 0.0 }
  ]
};
