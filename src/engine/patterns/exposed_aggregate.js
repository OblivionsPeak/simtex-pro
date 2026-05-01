export default {
  id: 'exposed_aggregate',
  name: 'Exposed Aggregate',
  category: 'Natural',
  description: 'Exposed aggregate concrete with embedded smooth pebbles in warm stone colors set in a dark cement matrix.',
  shader: `
    // --- helpers BEFORE generate() ---

    vec2 voronoi_rand_ea(vec2 p) {
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return fract(sin(p) * 43758.5453);
    }

    float hash1_ea(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float hash1b_ea(vec2 p) {
      return fract(sin(dot(p, vec2(269.5, 183.3))) * 43758.5453);
    }

    // Warm stone palette — 6 tones
    vec3 stone_palette(float idx) {
      // 0: mid grey, 1: warm beige, 2: cream, 3: warm brown, 4: terracotta, 5: cool grey
      if (idx < 0.5)       return vec3(0.56, 0.54, 0.52);   // mid grey
      else if (idx < 1.5)  return vec3(0.74, 0.68, 0.56);   // warm beige
      else if (idx < 2.5)  return vec3(0.86, 0.82, 0.72);   // cream
      else if (idx < 3.5)  return vec3(0.58, 0.44, 0.32);   // warm brown
      else if (idx < 4.5)  return vec3(0.68, 0.42, 0.30);   // terracotta
      else                 return vec3(0.62, 0.62, 0.66);   // cool grey
    }

    float smoothnoise_ea(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash1_ea(i);
      float b = hash1_ea(i + vec2(1.0, 0.0));
      float c = hash1_ea(i + vec2(0.0, 1.0));
      float d = hash1_ea(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    vec4 generate() {
      vec2 uv = v_uv * u_stone_size;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);

      // Voronoi — find closest cell and edge distance
      float m_dist  = 10.0;
      float m2_dist = 10.0;
      vec2  m_id    = vec2(0.0);
      vec2  m_local = vec2(0.0);   // local pos within cell (relative to site)

      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          // Randomize stone site position — jitter 0.2–0.8 to avoid overlap issues
          vec2 rng  = 0.2 + 0.6 * voronoi_rand_ea(i_uv + neighbor);
          vec2 diff = neighbor + rng - f_uv;
          float d   = length(diff);
          if (d < m_dist) {
            m2_dist = m_dist;
            m_dist  = d;
            m_id    = i_uv + neighbor;
            m_local = diff;
          } else if (d < m2_dist) {
            m2_dist = d;
          }
        }
      }

      // Edge distance
      float edge_dist = m2_dist - m_dist;

      // Cement between stones
      float cement_mask = smoothstep(0.0, u_grout_width, edge_dist);

      // Stone color from palette
      float cell_hash = hash1_ea(m_id);
      float palette_idx = floor(cell_hash * 6.0);
      vec3 stone_col = stone_palette(palette_idx);

      // Slight brightness variation within each stone (second hash axis)
      float stone_var = hash1b_ea(m_id + vec2(3.7, 9.2));
      stone_col *= mix(0.88, 1.08, stone_var);

      // Pebble rounding: stones are brighter at their center (curved surface catching light)
      // m_dist is distance from stone site — normalized by typical cell size ~0.5
      float center_t = clamp(m_dist * 2.0, 0.0, 1.0);
      float curvature = 1.0 - center_t * center_t * 0.18;
      stone_col *= curvature;

      // Micro-texture on stone surface
      float micro = smoothnoise_ea(v_uv * 80.0 + m_id * 13.7);
      stone_col += (micro - 0.5) * 0.04;

      // Cement color — slightly darker than supplied, recessed
      vec3 cement = u_cement_color.rgb * 0.85;
      // Micro-texture on cement
      float cement_micro = smoothnoise_ea(v_uv * 40.0 + vec2(5.3, 2.1));
      cement += (cement_micro - 0.5) * 0.025;

      // Blend stone and cement
      vec3 col = mix(cement, stone_col, cement_mask);

      // Edge shadow — recessed cement casts slight shadow on adjacent stone edge
      float edge_shadow = smoothstep(0.0, u_grout_width * 2.5, edge_dist);
      col *= mix(0.82, 1.0, edge_shadow);

      col = clamp(col, 0.0, 1.0);

      return vec4(col * u_opacity, u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_stone_size',   name: 'Aggregate Density', type: 'float', min: 2.0,  max: 20.0, default: 8.0  },
    { id: 'u_cement_color', name: 'Cement Color',      type: 'color', default: [0.25, 0.24, 0.23, 1.0]    },
    { id: 'u_grout_width',  name: 'Cement Gap Width',  type: 'float', min: 0.02, max: 0.15, default: 0.06 }
  ]
};
