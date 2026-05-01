export default {
  id: 'oil_slick',
  name: 'Oil Slick',
  category: 'Natural',
  description: 'Thin-film oil interference on wet dark tarmac — rainbow iridescence bands in sinuous organic puddles.',
  shader: `
    // --- helpers BEFORE generate() ---

    float hash1_os(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float smoothnoise_os(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash1_os(i);
      float b = hash1_os(i + vec2(1.0, 0.0));
      float c = hash1_os(i + vec2(0.0, 1.0));
      float d = hash1_os(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    // 3-octave FBM
    float fbm_os(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      vec2  s = vec2(1.0);
      for (int i = 0; i < 3; i++) {
        v += a * smoothnoise_os(p * s);
        s *= 2.1;
        a *= 0.48;
      }
      return v;
    }

    // HSV-style hue to RGB (GLSL 1.0 compatible, no ES3)
    vec3 hue2rgb(float h) {
      h = fract(h);
      float r = abs(h * 6.0 - 3.0) - 1.0;
      float g = 2.0 - abs(h * 6.0 - 2.0);
      float b = 2.0 - abs(h * 6.0 - 4.0);
      return clamp(vec3(r, g, b), 0.0, 1.0);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Animated noise coordinates
      vec2 noiseUV = uv * u_band_scale + vec2(u_time * 0.02, u_time * 0.015);

      // Thickness map — two FBM layers for complexity
      float thickness1 = fbm_os(noiseUV);
      float thickness2 = fbm_os(noiseUV * 1.7 + vec2(5.3, 2.1));
      float thickness  = thickness1 * 0.65 + thickness2 * 0.35;

      // Puddle mask — wetness controls coverage
      // Use a separate low-freq noise as a coverage mask
      float puddle_mask = fbm_os(uv * u_band_scale * 0.4 + vec2(3.7, 8.2));
      float wet_mask = smoothstep(1.0 - u_wetness, 1.0 - u_wetness * 0.3, puddle_mask);
      wet_mask = clamp(wet_mask, 0.0, 1.0);

      // Map thickness to hue — full rainbow cycle
      // Shift hue with time for slow drift
      float hue = fract(thickness * 1.2 + u_time * 0.04);
      vec3 iridescent = hue2rgb(hue);

      // Thin-film intensity: brighter at mid-thickness, dimmer at edges
      float film_intensity = smoothstep(0.1, 0.4, thickness) * smoothstep(1.0, 0.6, thickness);
      film_intensity *= u_iridescence * wet_mask;

      // Wet tarmac base: very dark blue-black
      vec3 tarmac_dry = vec3(0.10, 0.10, 0.11);
      // Wet darkens and adds slight grey-blue sheen
      vec3 tarmac_wet = vec3(0.04, 0.04, 0.05);
      vec3 base = mix(tarmac_dry, tarmac_wet, wet_mask * 0.7);

      // Slight specular highlight on wet surface
      float spec_noise = smoothnoise_os(uv * 18.0 + vec2(u_time * 0.1));
      float spec = pow(clamp(spec_noise, 0.0, 1.0), 6.0) * wet_mask * 0.12;

      // Additive iridescence on top of base
      vec3 col = base + iridescent * film_intensity * 0.7 + spec;

      return vec4(col * u_opacity, u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_band_scale',  name: 'Band Scale',        type: 'float', min: 1.0, max: 10.0, default: 3.0 },
    { id: 'u_iridescence', name: 'Color Intensity',   type: 'float', min: 0.0, max: 2.0,  default: 1.2 },
    { id: 'u_wetness',     name: 'Puddle Coverage',   type: 'float', min: 0.0, max: 1.0,  default: 0.8 }
  ]
};
