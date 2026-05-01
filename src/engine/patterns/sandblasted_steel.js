export default {
  id: 'sandblasted_steel',
  name: 'Sandblasted Steel',
  category: 'Industrial',
  description: 'Bead-blasted aluminium or steel with uniform isotropic micro-crater texture and soft satin sheen.',
  shader: `
    // --- helpers BEFORE generate() ---

    // Isotropic 2D hash — uses both x and y, no directional bias
    float hash2_sb(vec2 p) {
      vec2 q = vec2(dot(p, vec2(127.1, 311.7)),
                    dot(p, vec2(269.5, 183.3)));
      return fract(sin(dot(q, vec2(1.0, 37.0))) * 43758.5453);
    }

    float smoothnoise_sb(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      // Quintic interpolation for softer micro-pitting
      vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
      float a = hash2_sb(i);
      float b = hash2_sb(i + vec2(1.0, 0.0));
      float c = hash2_sb(i + vec2(0.0, 1.0));
      float d = hash2_sb(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    // Two octaves of isotropic micro-grain
    float micro_grain(vec2 p, float freq) {
      float v  = smoothnoise_sb(p * freq)          * 0.6;
      v       += smoothnoise_sb(p * freq * 2.1 + vec2(1.7, 3.3)) * 0.3;
      v       += smoothnoise_sb(p * freq * 4.3 + vec2(5.1, 2.8)) * 0.1;
      return v;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Isotropic micro-crater noise — scale by u_grit
      float grain = micro_grain(uv, u_grit);

      // Map noise to ±8% brightness variation around neutral
      float brightness_var = (grain - 0.5) * 0.16;

      // Base metal color
      vec3 base = u_metal_color.rgb;

      // Apply brightness variation
      vec3 col = base + brightness_var;

      // Soft Gaussian specular sheen — distant area light source
      // Sheen center near UV (0.35, 0.65) — off-center feels natural
      vec2 sheen_center = vec2(0.35, 0.65);
      float sheen_dist = length(uv - sheen_center);
      float sheen = exp(-4.5 * sheen_dist * sheen_dist) * u_sheen * 0.25;

      // Sheen is warm-white
      col += vec3(sheen * 1.0, sheen * 0.98, sheen * 0.94);

      // Second smaller specular hotspot (secondary light bounce)
      vec2  sheen2_center = vec2(0.72, 0.28);
      float sheen2_dist   = length(uv - sheen2_center);
      float sheen2        = exp(-8.0 * sheen2_dist * sheen2_dist) * u_sheen * 0.10;
      col += sheen2;

      // Subtle vignette — edges are marginally darker (blasted surface edge effect)
      float vignette = 1.0 - 0.06 * length(uv - 0.5) * 2.0;
      col *= vignette;

      col = clamp(col, 0.0, 1.0);

      return vec4(col * u_opacity, u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_metal_color', name: 'Metal Color',  type: 'color', default: [0.72, 0.72, 0.72, 1.0]          },
    { id: 'u_grit',        name: 'Grit Size',    type: 'float', min: 20.0, max: 200.0, default: 80.0       },
    { id: 'u_sheen',       name: 'Surface Sheen', type: 'float', min: 0.0,  max: 1.0,   default: 0.3        }
  ]
};
