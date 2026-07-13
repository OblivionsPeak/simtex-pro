export default {
  id: 'petroglyph_ochre',
  name: 'Petroglyph Ochre',
  category: 'Heritage',
  added: '2026-07-13',
  description: 'Weathered rock face marked with bold ochre hand-painted figures — stick hunters, spirals, zigzag snakes, horned beasts and hand prints, edge-faded like ancient mineral pigment.',
  shader: `
    float segd(vec2 p, vec2 a, vec2 b) {
      vec2 pa = p - a;
      vec2 ba = b - a;
      float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
      return length(pa - ba * h);
    }
    float stroke(float d, float w) {
      return smoothstep(w + 0.025, w - 0.025, d);
    }
    float figure(vec2 p, float sel) {
      float m = 0.0;
      float w = 0.075;
      if (sel < 0.2) {
        // stick hunter with raised spear
        m = max(m, stroke(length(p - vec2(0.0, 0.30)) - 0.075, w));
        m = max(m, stroke(segd(p, vec2(0.0, 0.22), vec2(0.0, -0.08)), w));
        m = max(m, stroke(segd(p, vec2(0.0, 0.12), vec2(-0.20, 0.26)), w));
        m = max(m, stroke(segd(p, vec2(0.0, 0.12), vec2(0.20, 0.00)), w));
        m = max(m, stroke(segd(p, vec2(-0.30, 0.44), vec2(-0.12, 0.10)), w * 0.7));
        m = max(m, stroke(segd(p, vec2(0.0, -0.08), vec2(-0.17, -0.40)), w));
        m = max(m, stroke(segd(p, vec2(0.0, -0.08), vec2(0.17, -0.40)), w));
      } else if (sel < 0.4) {
        // archimedean spiral sign
        float r = length(p);
        float a = atan(p.y, p.x) * 0.15915494;
        float t = r * 2.6 - a;
        float d = abs(fract(t) - 0.5) / 2.6;
        m = stroke(d, w * 0.85) * smoothstep(0.47, 0.41, r) * smoothstep(0.02, 0.08, r);
      } else if (sel < 0.6) {
        // zigzag snake
        float zig = (abs(fract(p.x * 2.4 + 0.25) - 0.5) - 0.25) * 0.55;
        float d = abs(p.y - zig);
        m = stroke(d, w) * step(abs(p.x), 0.38);
        m = max(m, stroke(length(p - vec2(0.40, 0.07)) - 0.045, w * 0.8));
      } else if (sel < 0.8) {
        // horned quadruped
        m = max(m, stroke(segd(p, vec2(-0.24, 0.04), vec2(0.18, 0.04)), w * 1.45));
        m = max(m, stroke(segd(p, vec2(-0.21, 0.02), vec2(-0.29, -0.34)), w));
        m = max(m, stroke(segd(p, vec2(-0.10, 0.02), vec2(-0.12, -0.34)), w));
        m = max(m, stroke(segd(p, vec2(0.07, 0.02), vec2(0.05, -0.34)), w));
        m = max(m, stroke(segd(p, vec2(0.16, 0.02), vec2(0.24, -0.34)), w));
        m = max(m, stroke(segd(p, vec2(0.18, 0.08), vec2(0.29, 0.26)), w));
        m = max(m, stroke(segd(p, vec2(0.29, 0.26), vec2(0.14, 0.42)), w * 0.7));
        m = max(m, stroke(segd(p, vec2(0.29, 0.26), vec2(0.40, 0.40)), w * 0.7));
      } else {
        // hand print blob
        vec2 q = (p + vec2(0.0, 0.12)) * vec2(1.0, 0.88);
        m = smoothstep(0.035, -0.035, length(q) - 0.165);
        m = max(m, stroke(segd(p, vec2(-0.13, 0.00), vec2(-0.17, 0.26)), 0.05));
        m = max(m, stroke(segd(p, vec2(-0.05, 0.02), vec2(-0.06, 0.32)), 0.05));
        m = max(m, stroke(segd(p, vec2(0.03, 0.02), vec2(0.05, 0.31)), 0.05));
        m = max(m, stroke(segd(p, vec2(0.11, 0.00), vec2(0.15, 0.25)), 0.05));
        m = max(m, stroke(segd(p, vec2(0.15, -0.10), vec2(0.28, 0.02)), 0.05));
      }
      return m;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 cell = floor(uv);
      vec2 f = fract(uv) - 0.5;
      // weathered rock face: warm layered fbm with faint strata seams
      float rn = fbm(uv * 1.4);
      float strata = fbm(vec2(uv.x * 0.7, uv.y * 2.8) + 13.0);
      vec3 rock = u_secondary_color.rgb * (0.80 + 0.38 * rn);
      rock *= 0.93 + 0.14 * noise(uv * 9.0);
      rock *= 1.0 - 0.20 * smoothstep(0.66, 0.84, strata);
      // one painted figure per cell, jittered, rotated and scaled
      float m = 0.0;
      if (hash(cell + 5.1) < u_density) {
        vec2 jit = (vec2(hash(cell + 1.7), hash(cell + 2.9)) - 0.5) * 0.14;
        float ang = (hash(cell + 8.3) - 0.5) * 0.55;
        float ca = cos(ang);
        float sa = sin(ang);
        vec2 q = f - jit;
        q = vec2(ca * q.x - sa * q.y, sa * q.x + ca * q.y);
        q /= 0.85 + 0.30 * hash(cell + 3.3);
        // ragged mineral edge: warp the figure space with noise
        q += (vec2(noise(q * 7.0 + cell), noise(q * 7.0 + cell + 31.0)) - 0.5) * 0.05;
        m = figure(q, hash(cell + 17.3));
      }
      // pigment weathering — patchy fade that never erases the figure
      float wear = fbm(uv * 5.0 + 7.0);
      m *= mix(1.0, 0.4 + 0.6 * smoothstep(0.25, 0.62, wear), u_weathering);
      m *= 0.85 + 0.15 * noise(uv * 13.0);
      m = clamp(m, 0.0, 1.0);
      vec3 pig = mix(u_primary_color.rgb, u_accent_color.rgb, step(0.7, hash(cell + 4.2)));
      pig *= 0.88 + 0.24 * rn;
      vec3 col = mix(rock, pig, m * 0.95);
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Figure Count', type: 'float', min: 2.0, max: 10.0, default: 4.0 },
    { id: 'u_density', name: 'Figure Density', type: 'float', min: 0.3, max: 1.0, default: 0.9 },
    { id: 'u_weathering', name: 'Weathering', type: 'float', min: 0.0, max: 1.0, default: 0.45 },
    { id: 'u_primary_color', name: 'Ochre Pigment', type: 'color', default: [0.76, 0.36, 0.12, 1.0] },
    { id: 'u_accent_color', name: 'Rust Pigment', type: 'color', default: [0.48, 0.15, 0.08, 1.0] },
    { id: 'u_secondary_color', name: 'Rock Face', type: 'color', default: [0.68, 0.58, 0.46, 1.0] }
  ],
  variants: [
    { name: 'Desert Ochre', uniforms: { u_scale: 4.0, u_density: 0.9, u_weathering: 0.45, u_primary_color: [0.76, 0.36, 0.12, 1.0], u_accent_color: [0.48, 0.15, 0.08, 1.0], u_secondary_color: [0.68, 0.58, 0.46, 1.0] } },
    { name: 'Cave Charcoal', uniforms: { u_scale: 5.0, u_density: 0.95, u_weathering: 0.3, u_primary_color: [0.15, 0.13, 0.12, 1.0], u_accent_color: [0.55, 0.20, 0.10, 1.0], u_secondary_color: [0.78, 0.73, 0.64, 1.0] } },
    { name: 'Clay on Basalt', uniforms: { u_scale: 3.0, u_density: 0.8, u_weathering: 0.6, u_primary_color: [0.90, 0.86, 0.78, 1.0], u_accent_color: [0.72, 0.46, 0.20, 1.0], u_secondary_color: [0.20, 0.19, 0.18, 1.0] } }
  ]
};
