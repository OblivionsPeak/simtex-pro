export default {
  id: 'stained_glass',
  name: 'Stained Glass',
  category: 'Abstract',
  description: 'Backlit stained glass window with vivid saturated color panels and thick dark lead came lines.',
  shader: `
    // --- helpers BEFORE generate() ---

    vec2 voronoi_rand(vec2 p) {
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return fract(sin(p) * 43758.5453);
    }

    float hash1(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    // Low-frequency smooth noise for glass inhomogeneity
    float smoothnoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash1(i);
      float b = hash1(i + vec2(1.0, 0.0));
      float c = hash1(i + vec2(0.0, 1.0));
      float d = hash1(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    // Pick one of 6 vivid stained-glass hues from a fixed palette
    vec3 glass_palette(float idx) {
      // 0: ruby red, 1: cobalt blue, 2: emerald green,
      // 3: amber gold, 4: violet, 5: teal
      if (idx < 0.5)       return vec3(0.82, 0.06, 0.08);   // ruby red
      else if (idx < 1.5)  return vec3(0.05, 0.12, 0.78);   // cobalt blue
      else if (idx < 2.5)  return vec3(0.04, 0.62, 0.14);   // emerald green
      else if (idx < 3.5)  return vec3(0.92, 0.58, 0.02);   // amber gold
      else if (idx < 4.5)  return vec3(0.48, 0.05, 0.75);   // violet
      else                 return vec3(0.02, 0.58, 0.62);    // teal
    }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);

      // Voronoi — find closest and second-closest cell
      float m_dist  = 10.0;
      float m2_dist = 10.0;
      vec2  m_id    = vec2(0.0);

      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 rng      = voronoi_rand(i_uv + neighbor);
          // Animate jitter slightly to feel alive
          rng = 0.5 + 0.5 * sin(6.2831 * rng);
          vec2 diff     = neighbor + rng - f_uv;
          float d       = length(diff);
          if (d < m_dist) {
            m2_dist = m_dist;
            m_dist  = d;
            m_id    = i_uv + neighbor;
          } else if (d < m2_dist) {
            m2_dist = d;
          }
        }
      }

      // Edge distance = difference between closest and second-closest
      float edge_dist = m2_dist - m_dist;

      // Lead came: narrow band near cell boundary
      float lead_mask = smoothstep(0.0, u_lead_width, edge_dist);

      // Pick palette color from cell hash
      float cell_hash = hash1(m_id);
      float palette_idx = floor(cell_hash * 6.0);
      vec3 glass_color = glass_palette(palette_idx);

      // Subtle brightness variation inside panel (±15%) — handblown glass
      float variation = smoothnoise(m_id * 1.7 + vec2(3.1, 7.4));
      float brightness = 1.0 + (variation - 0.5) * 0.30;

      // Backlit luminosity — boost saturation by squaring and scaling
      vec3 lit = glass_color * glass_color * brightness * u_brightness;

      // Lead came color: near-black dark grey
      vec3 lead_color = vec3(0.06, 0.06, 0.07);

      // Blend: inside cell = vivid glass, at boundary = lead
      vec3 col = mix(lead_color, lit, lead_mask);

      // Lead line itself gets a slight sheen highlight at its center
      float lead_sheen = (1.0 - lead_mask) * smoothstep(0.0, u_lead_width * 0.35, edge_dist);
      col += lead_sheen * 0.08;

      return vec4(col * u_opacity, u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_scale',      name: 'Glass Sections', type: 'float', min: 2.0,  max: 20.0, default: 7.0  },
    { id: 'u_lead_width', name: 'Lead Thickness',  type: 'float', min: 0.01, max: 0.12, default: 0.04 },
    { id: 'u_brightness', name: 'Panel Luminosity', type: 'float', min: 0.3,  max: 2.0,  default: 1.3  }
  ]
};
