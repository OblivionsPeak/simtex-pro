export default {
  id: 'verdigris_patina',
  name: 'Verdigris Patina',
  category: 'Industrial',
  description: 'Aged copper or bronze with green-blue verdigris oxidation pooling in recesses over warm reddish copper.',
  shader: `
    // --- helpers BEFORE generate() ---

    float hash1_vp(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float smoothnoise_vp(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash1_vp(i);
      float b = hash1_vp(i + vec2(1.0, 0.0));
      float c = hash1_vp(i + vec2(0.0, 1.0));
      float d = hash1_vp(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    // FBM for patina coverage mask
    float fbm_vp(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      vec2  s = vec2(1.0);
      for (int i = 0; i < 5; i++) {
        v += a * smoothnoise_vp(p * s);
        s *= 2.03;
        a *= 0.50;
      }
      return v;
    }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;

      // Primary patina coverage mask
      float mask = fbm_vp(uv);

      // Secondary relief noise — surface topology (raised/recessed areas)
      float relief = fbm_vp(uv * 1.6 + vec2(5.2, 3.7));

      // Patina pools in recesses (low relief = low areas = more patina)
      // Bias mask by relief: high relief = less oxidation
      float patina_amount = mask - (relief - 0.5) * 0.35;
      patina_amount = clamp(patina_amount, 0.0, 1.0);

      // Apply coverage control — shift threshold
      float coverage_threshold = 1.0 - u_patina_coverage;
      float patina_t = smoothstep(coverage_threshold - 0.15, coverage_threshold + 0.25, patina_amount);

      // Bare copper threshold — very low mask = polished copper glimpse
      float bare_t = smoothstep(coverage_threshold - 0.3, coverage_threshold - 0.15, patina_amount);

      // Colors
      vec3 copper_base    = vec3(0.72, 0.35, 0.15);   // reddish-orange raw copper
      vec3 copper_polish  = vec3(0.85, 0.48, 0.20);   // brighter polished copper highlight
      vec3 transition     = vec3(0.35, 0.52, 0.40);   // intermediate blue-green
      vec3 verdigris      = u_patina_color.rgb;        // vivid verdigris green-blue

      // Copper base: mix polished and base by relief (raised = more polish)
      float polish_t = smoothstep(0.4, 0.7, relief);
      vec3  copper   = mix(copper_base, copper_polish, polish_t);

      // Transition zone: copper -> blue-green -> verdigris
      vec3 col = copper;
      col = mix(col, transition, smoothstep(0.0, 0.5, patina_t));
      col = mix(col, verdigris,  smoothstep(0.4, 1.0, patina_t));

      // Where mask is very low: bare copper gleam
      col = mix(col, copper_polish, (1.0 - bare_t) * (1.0 - patina_t) * 0.5);

      // Subtle metallic surface grain
      float grain = smoothnoise_vp(uv * 12.0) * 0.06 - 0.03;
      col += grain;

      // Add slight depth variation from relief (recessed = slightly darker)
      float depth = mix(0.80, 1.05, smoothstep(0.3, 0.7, relief));
      col *= depth;

      col = clamp(col, 0.0, 1.0);

      return vec4(col * u_opacity, u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_patina_coverage', name: 'Patina Coverage', type: 'float', min: 0.0,  max: 1.0,  default: 0.6  },
    { id: 'u_scale',           name: 'Pattern Scale',   type: 'float', min: 1.0,  max: 15.0, default: 5.0  },
    { id: 'u_patina_color',    name: 'Verdigris Color', type: 'color', default: [0.18, 0.52, 0.42, 1.0]    }
  ]
};
