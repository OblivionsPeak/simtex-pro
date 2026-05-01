export default {
  id: 'mylar_heatshield',
  name: 'Mylar Heat Shield',
  category: 'Racing',
  description: 'Crinkled mylar or aluminium heat shield foil with bright specular hotspots and crinkle shadow valleys.',
  shader: `
    // --- helpers BEFORE generate() ---

    float hash1_mh(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float smoothnoise_mh(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash1_mh(i);
      float b = hash1_mh(i + vec2(1.0, 0.0));
      float c = hash1_mh(i + vec2(0.0, 1.0));
      float d = hash1_mh(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    // FBM for wrinkle surface
    float fbm_mh(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      vec2  s = vec2(1.0);
      for (int i = 0; i < 4; i++) {
        v += a * smoothnoise_mh(p * s);
        s *= 2.1;
        a *= 0.50;
      }
      return v;
    }

    // Approximate gradient of FBM for surface normal
    vec2 fbm_gradient(vec2 p) {
      float eps = 0.02;
      float dx = fbm_mh(p + vec2(eps, 0.0)) - fbm_mh(p - vec2(eps, 0.0));
      float dy = fbm_mh(p + vec2(0.0, eps)) - fbm_mh(p - vec2(0.0, eps));
      return vec2(dx, dy) / (2.0 * eps);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Crinkle noise coordinates — scaled by crinkle intensity
      vec2 crinkleUV = uv * u_crinkle;

      // Height field from FBM
      float height = fbm_mh(crinkleUV);

      // Surface gradient — used as a fake normal perturbation
      vec2 grad = fbm_gradient(crinkleUV);

      // Perturbed "normal" in 2D (we simulate a z component)
      // Normal direction: (-grad.x, -grad.y, 1.0) normalized approximately
      float normal_z = 1.0 / sqrt(1.0 + dot(grad, grad) * 0.5);
      float normal_x = -grad.x * normal_z * 0.4;
      float normal_y = -grad.y * normal_z * 0.4;

      // Light direction — coming from upper-left (simulated environment)
      vec3 light_dir = normalize(vec3(0.4, 0.6, 1.0));
      vec3 n = normalize(vec3(normal_x, normal_y, normal_z));
      float ndotl = clamp(dot(n, light_dir), 0.0, 1.0);

      // Environment: bright sky gradient from above
      float sky_env = clamp(0.5 + 0.5 * normal_y, 0.0, 1.0);

      // Specular reflection — approximate mirror highlight
      vec3 view_dir = vec3(0.0, 0.0, 1.0);
      vec3 reflect_dir = vec3(-normal_x * 2.0, -normal_y * 2.0, 1.0);
      float spec_raw = clamp(reflect_dir.z, 0.0, 1.0);
      float spec = pow(spec_raw, 18.0) * u_reflectivity;

      // Foil base color
      vec3 foil = u_foil_color.rgb;
      // Shadow color: dark version of foil
      vec3 shadow_col = foil * 0.15;
      // Bright highlight: near white with foil tint
      vec3 highlight_col = mix(foil, vec3(1.0, 1.0, 1.0), 0.7);

      // Compose: diffuse bounce + specular hotspot
      vec3 col = mix(shadow_col, foil, ndotl);
      // Sky environment adds secondary bounce
      col = mix(col, foil * 1.1, sky_env * 0.25);
      // Specular hotspot is bright white
      col += highlight_col * spec;

      // Height-based crinkle texture: ridges catch more light
      float ridge = smoothstep(0.45, 0.65, height);
      col = mix(col, foil * 1.2, ridge * 0.15);

      // Micro-sheen: fine dimple structure
      float micro = smoothnoise_mh(uv * 80.0 * u_crinkle);
      col += (micro - 0.5) * 0.04;

      col = clamp(col, 0.0, 1.0);

      return vec4(col * u_opacity, u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_foil_color',   name: 'Foil Color',         type: 'color', default: [0.92, 0.75, 0.25, 1.0]   },
    { id: 'u_crinkle',      name: 'Crinkle Intensity',  type: 'float', min: 1.0, max: 10.0, default: 4.0   },
    { id: 'u_reflectivity', name: 'Highlight Brightness', type: 'float', min: 0.3, max: 2.0, default: 1.4  }
  ]
};
