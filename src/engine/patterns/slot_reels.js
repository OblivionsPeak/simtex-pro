export default {
  id: 'slot_reels',
  name: 'Slot Reels',
  category: 'Retro',
  added: '2026-06-11',
  description: 'One-armed-bandit reel strips behind glass — cherries, BAR plates, lucky sevens and gold bells on cream stock, each drum rounding away into chrome dividers.',
  shader: `
    // distance from point to line segment
    float seg_sr(vec2 p, vec2 a, vec2 b) {
      vec2 pa = p - a; vec2 ba = b - a;
      float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
      return length(pa - ba * h);
    }

    vec4 generate() {
      float reels = u_reel_count;
      float rx = v_uv.x * reels;
      float reel = floor(rx);
      float fx = fract(rx);

      // each reel scrolls to its own random offset
      float spin = hash(vec2(reel, 5.0));
      float ry = v_uv.y * reels + spin * 8.0;
      vec2 cell = vec2(reel, floor(ry));
      vec2 f = vec2(fx, fract(ry)) - 0.5;

      // --- chrome divider rails between reels ---
      float railw = 0.055;
      float rail = min(fx, 1.0 - fx);
      if (rail < railw) {
        float t = rail / railw;
        vec3 chrome = mix(vec3(0.85, 0.87, 0.90), vec3(0.25, 0.27, 0.30), abs(t - 0.55) * 2.2);
        chrome *= 0.9 + noise(v_uv * 500.0) * 0.12;
        return vec4(chrome, 1.0);
      }

      // --- reel strip stock with cylindrical shading ---
      vec3 stock = vec3(0.96, 0.93, 0.85);
      stock *= 0.97 + noise(v_uv * 380.0) * 0.05;
      float curve = sin(((fx - railw) / (1.0 - 2.0 * railw)) * 3.14159);
      stock *= mix(1.0, 0.45 + 0.55 * curve, u_shade);

      // gold separator band between symbol cells
      float band = min(abs(f.y - 0.5), abs(f.y + 0.5));
      vec3 gold = u_accent_color.rgb;
      vec3 col = mix(stock, gold * (0.8 + curve * 0.3), 1.0 - smoothstep(0.025, 0.045, band));

      // --- the symbol ---
      float pick = hash(cell + 23.0);
      vec3 inkdark = vec3(0.12, 0.10, 0.10);

      if (pick < 0.28) {
        // CHERRIES: two red globes on green stems
        vec2 c1 = f - vec2(-0.11, -0.10);
        vec2 c2 = f - vec2( 0.13, -0.06);
        float ch = min(length(c1) - 0.105, length(c2) - 0.095);
        float stem = min(seg_sr(f, vec2(-0.11, -0.02), vec2(0.03, 0.22)),
                         seg_sr(f, vec2( 0.13,  0.02), vec2(0.03, 0.22))) - 0.018;
        col = mix(col, vec3(0.18, 0.45, 0.12), 1.0 - smoothstep(0.0, 0.02, stem));
        vec3 cherry = vec3(0.78, 0.08, 0.10);
        cherry += vec3(0.35, 0.2, 0.15) * exp(-dot(c1 - 0.04, c1 - 0.04) * 250.0);
        col = mix(col, cherry, 1.0 - smoothstep(0.0, 0.02, ch));
      } else if (pick < 0.54) {
        // BAR: three stacked plates with white inner stripes
        for (int i = 0; i < 3; i++) {
          float oy = (float(i) - 1.0) * 0.155;
          vec2 bp = vec2(f.x, f.y - oy);
          float plate = step(abs(bp.x), 0.26) * step(abs(bp.y), 0.062);
          float stripe = step(abs(bp.x), 0.235) * step(abs(bp.y), 0.036);
          col = mix(col, inkdark, plate);
          col = mix(col, vec3(0.95, 0.92, 0.85), stripe);
          col = mix(col, inkdark, stripe * step(abs(bp.y), 0.018) * step(0.3, fract(bp.x * 14.0)));
        }
      } else if (pick < 0.78) {
        // LUCKY 7: top bar + diagonal stroke, red with dark keyline
        float top = seg_sr(f, vec2(-0.17, 0.20), vec2(0.18, 0.20)) - 0.055;
        float diag = seg_sr(f, vec2(0.16, 0.18), vec2(-0.06, -0.24)) - 0.062;
        float sv = min(top, diag);
        col = mix(col, inkdark, 1.0 - smoothstep(0.025, 0.045, sv));
        vec3 seven = vec3(0.82, 0.10, 0.12) * (0.85 + curve * 0.25);
        col = mix(col, seven, 1.0 - smoothstep(0.0, 0.02, sv));
      } else {
        // GOLD BELL: dome + lip + clapper
        vec2 bp = f - vec2(0.0, 0.02);
        float dome = length(bp * vec2(1.0, 1.15)) - 0.165;
        dome = max(dome, -(bp.y + 0.13));                  // flatten the bottom
        float lip = step(abs(bp.y + 0.145), 0.028) * step(abs(bp.x), 0.21);
        float clap = length(f - vec2(0.0, -0.215)) - 0.038;
        vec3 bell = gold * (0.9 + curve * 0.3);
        bell += vec3(0.4, 0.32, 0.1) * exp(-dot(bp - vec2(-0.05, 0.06), bp - vec2(-0.05, 0.06)) * 120.0);
        float bellm = 1.0 - smoothstep(0.0, 0.02, dome);
        col = mix(col, inkdark, 1.0 - smoothstep(0.02, 0.045, dome));
        col = mix(col, bell, bellm);
        col = mix(col, bell * 1.1, lip);
        col = mix(col, inkdark, 1.0 - smoothstep(0.0, 0.015, clap));
      }

      // glass reflection streak across the whole window
      col += vec3(0.10) * exp(-pow((v_uv.x + v_uv.y * 0.4 - 0.75) * 5.0, 2.0));

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_reel_count', name: 'Reels', type: 'float', min: 2.0, max: 6.0, default: 3.0 },
    { id: 'u_shade', name: 'Drum Curvature', type: 'float', min: 0.0, max: 1.0, default: 0.6 },
    { id: 'u_accent_color', name: 'Gold Trim', type: 'color', default: [0.85, 0.65, 0.20, 1.0] }
  ]
};
