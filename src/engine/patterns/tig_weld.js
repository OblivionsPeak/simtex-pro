export default {
  id: 'tig_weld',
  name: 'TIG Weld Bead',
  category: 'Industrial',
  description: 'TIG weld bead running horizontally with characteristic stacked-coin ripple arcs, hot bright center, and heat-affected steel.',
  shader: `
    // --- helpers BEFORE generate() ---

    float hash1_tw(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float smoothnoise_tw(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash1_tw(i);
      float b = hash1_tw(i + vec2(1.0, 0.0));
      float c = hash1_tw(i + vec2(0.0, 1.0));
      float d = hash1_tw(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Vertical distance from horizontal center line
      float dy = uv.y - 0.5;
      float abs_dy = abs(dy);

      // Bead half-width in UV space
      float half_bead = u_bead_width * 0.5;

      // --- Ripple pattern ---
      // fract along x gives position within one ripple period
      float ripple_x = fract(uv.x * u_bead_freq);
      // Arc: distance from the trailing edge center of each coin
      // Each coin arc is centered at (ripple_x=0, dy=0)
      float arc_dist = length(vec2(ripple_x, dy / half_bead));

      // The stacked-coin ripple: rings of arc distance
      float ring = fract(arc_dist * 2.2);
      float ripple_band = smoothstep(0.35, 0.5, ring) * smoothstep(0.85, 0.7, ring);

      // Bead cross-section envelope: Gaussian falloff from center
      float bead_env = exp(-3.5 * (abs_dy / half_bead) * (abs_dy / half_bead));
      bead_env = clamp(bead_env, 0.0, 1.0);

      // Inside bead flag
      float in_bead = smoothstep(half_bead * 1.1, half_bead * 0.7, abs_dy);

      // --- Colors ---
      // Hot center: near-white/yellow-white
      vec3 hot_center   = vec3(1.00, 0.98, 0.90);
      // Ripple color: warm amber / gold
      vec3 ripple_color = vec3(0.88, 0.62, 0.18);
      // Edge of bead: transition to blue-steel
      vec3 bead_edge    = vec3(0.38, 0.48, 0.58);
      // Steel base: blue-grey
      vec3 steel_base   = vec3(0.55, 0.57, 0.60);
      // HAZ (heat affected zone): slight straw/blue tint
      vec3 haz_color    = vec3(0.52, 0.54, 0.62);

      // Micro surface noise on steel
      float micro = smoothnoise_tw(uv * 120.0) * 0.06 - 0.03;

      // --- Bead interior color ---
      // Blend from hot center outward through ripple amber to bead edge
      float center_t = clamp(abs_dy / half_bead, 0.0, 1.0);
      vec3 bead_col = mix(hot_center, ripple_color, smoothstep(0.0, 0.5, center_t));
      bead_col      = mix(bead_col,   bead_edge,    smoothstep(0.5, 1.0, center_t));

      // Add ripple bands on top (visible on mid-section of bead)
      float ripple_strength = (1.0 - center_t * center_t) * 0.30;
      bead_col = mix(bead_col, ripple_color * 0.7, ripple_band * ripple_strength);

      // --- HAZ gradient either side ---
      // HAZ width controlled by u_heat_spread
      float haz_width = half_bead * u_heat_spread;
      float haz_t = smoothstep(half_bead, haz_width, abs_dy);
      vec3 steel_col = mix(steel_base + micro, haz_color, haz_t);

      // --- Composite bead over steel ---
      vec3 col = mix(steel_col, bead_col, in_bead * bead_env);

      // Slight surface gloss highlight along bead center
      float gloss = exp(-80.0 * dy * dy) * exp(-4.0 * (ripple_x - 0.5) * (ripple_x - 0.5));
      col += gloss * 0.12 * in_bead;

      return vec4(col * u_opacity, u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_bead_freq',   name: 'Ripple Frequency',   type: 'float', min: 4.0,  max: 40.0, default: 16.0 },
    { id: 'u_bead_width',  name: 'Bead Width',          type: 'float', min: 0.05, max: 0.4,  default: 0.18 },
    { id: 'u_heat_spread', name: 'Heat Affected Zone',  type: 'float', min: 0.5,  max: 3.0,  default: 1.5  }
  ]
};
