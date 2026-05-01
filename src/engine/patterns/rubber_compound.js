export default {
  id: 'rubber_compound',
  name: 'Rubber Compound',
  category: 'Racing',
  description: 'Fresh vulcanised racing tyre rubber — near-black carbon grain, subtle mould-release sheen, and low-frequency press flow marks.',
  shader: `
    // --- helpers BEFORE generate() ---

    float hash1_rb(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float smoothnoise_rb(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash1_rb(i);
      float b = hash1_rb(i + vec2(1.0, 0.0));
      float c = hash1_rb(i + vec2(0.0, 1.0));
      float d = hash1_rb(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    // FBM for carbon-black micro grain
    float fbm_rb(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      vec2  s = vec2(1.0);
      for (int i = 0; i < 4; i++) {
        v += a * smoothnoise_rb(p * s);
        s *= 2.1;
        a *= 0.50;
      }
      return v;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- Carbon-black micro grain ---
      float grain = fbm_rb(uv * u_grain);

      // Low-frequency vulcanisation press flow marks
      // Circular concentric arcs — low frequency, very subtle
      float flow_angle = atan(uv.y - 0.5, uv.x - 0.5);
      float flow_radius = length(uv - 0.5);
      // Faint concentric ripple from press
      float flow = sin(flow_radius * 18.0 - flow_angle * 0.3) * 0.012;

      // Slight directional sheen — mould release surface
      // The sheen is slightly stronger across the x direction (mould release direction)
      float sheen_grad = 1.0 - abs(uv.x - 0.5) * 0.4;
      // Combined with a Gaussian centered at top-right (raking light)
      float sheen_spot = exp(-5.0 * length(uv - vec2(0.75, 0.75)) * 1.5);
      float sheen = (sheen_grad * 0.3 + sheen_spot * 0.7) * u_sheen;

      // Compound base color
      vec3 base = u_compound_color.rgb;

      // Carbon grain: very subtle brightness — ±4% on near-black base
      float grain_v = (grain - 0.5) * 0.08;

      // Highlight tint: raw rubber has faint warm (brownish) highlight
      vec3 warm_tint = vec3(0.04, 0.02, 0.00);
      float highlight_t = smoothstep(0.45, 0.65, grain);

      vec3 col = base + grain_v + warm_tint * highlight_t * 0.6;

      // Add flow marks (very faint)
      col += flow;

      // Mould-release surface sheen — slightly warm off-white reflection
      col += vec3(0.12, 0.11, 0.09) * sheen * 0.4;

      // Prevent blowing out — rubber stays dark
      col = clamp(col, 0.0, 0.22);

      return vec4(col * u_opacity, u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_compound_color', name: 'Rubber Color',  type: 'color', default: [0.06, 0.05, 0.04, 1.0]   },
    { id: 'u_grain',          name: 'Surface Grain', type: 'float', min: 5.0, max: 50.0, default: 20.0  },
    { id: 'u_sheen',          name: 'Rubber Gloss',  type: 'float', min: 0.0, max: 1.0,  default: 0.4   }
  ]
};
