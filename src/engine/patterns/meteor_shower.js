export default {
  id: 'meteor_shower',
  name: 'Meteor Shower',
  category: 'Cosmos',
  added: '2026-06-11',
  description: 'A radiant burst of shooting stars — parallel incandescent streaks with white-hot heads, sputtering ember trails, and a calm starfield behind.',
  shader: `
    vec2 rot_msh(vec2 p, float a) {
      float c = cos(a); float s = sin(a);
      return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
    }

    // One layer of meteors: streaks in slanted bands that wrap with the tile
    vec3 meteors_msh(vec2 uv, float density, float seed, float scale, vec3 headCol, vec3 trailCol) {
      // Rotate into meteor-aligned frame: meteors travel along +x
      vec2 m = rot_msh(uv, -u_angle);
      vec2 g = floor(m * density);
      vec3 acc = vec3(0.0);
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 cell = g + vec2(float(x), float(y));
          vec2 cw = mod(cell, density * 4.0); // wrap window for tiling-ish repeat
          float exists = step(0.72, hash(cw + seed));
          // Head position inside the cell
          vec2 hp = (cell + vec2(hash(cw + seed + 7.0), hash(cw + seed + 19.0))) / density;
          vec2 rel = m - hp;
          float len = (0.10 + 0.22 * hash(cw + seed + 31.0)) * scale;

          // Trail: bright at the head, exponential decay behind (rel.x < 0)
          float behind = -rel.x;
          float onTrail = step(0.0, behind) * step(behind, len);
          float trailFall = exp(-behind * (4.5 / len));
          float thick = 0.0022 * scale * (0.4 + 0.6 * trailFall);
          float lateral = exp(-pow(rel.y / max(thick, 0.0001), 2.0));
          // Sputtering brightness flickers along the trail
          float sputter = 0.65 + 0.35 * hash(vec2(floor(behind * 90.0), cw.x + seed));
          acc += trailCol * exists * onTrail * lateral * trailFall * sputter;

          // White-hot head with a small teardrop bloom
          float hd = length(rel * vec2(1.0, 2.2));
          acc += headCol * exists * exp(-pow(hd / (0.008 * scale), 2.0)) * 1.6;
          acc += headCol * exists * exp(-hd * (140.0 / scale)) * 0.35;
        }
      }
      return acc;
    }

    float stars_msh(vec2 uv) {
      vec2 g = floor(uv * 80.0);
      vec2 f = fract(uv * 80.0);
      vec2 p = vec2(hash(g + 9.7), hash(g + 25.1));
      return smoothstep(0.96, 1.0, hash(g)) * smoothstep(0.10, 0.0, length(f - p));
    }

    vec4 generate() {
      vec2 uv = fract(v_uv);

      // --- Night sky with faint airglow gradient and thin cloud wisp ---
      vec3 col = mix(vec3(0.020, 0.026, 0.055), vec3(0.008, 0.010, 0.030), uv.y);
      float wisp = fbm(uv * vec2(3.0, 6.0)) * 0.5 + 0.5;
      col += vec3(0.030, 0.035, 0.055) * smoothstep(0.6, 0.9, wisp) * 0.6;

      // --- Static stars, some twinkle-bright ---
      col += vec3(0.80, 0.85, 1.0) * stars_msh(v_uv + 2.2) * 0.9;
      col += vec3(1.0, 0.95, 0.85) * stars_msh(v_uv * 0.6 + 8.8) * 0.5;

      // --- Meteor layers: faint distant + bold foreground ---
      vec3 head = vec3(1.0, 0.99, 0.95);
      vec3 trail = u_trail_color.rgb;
      vec3 ember = trail * vec3(1.0, 0.55, 0.30);

      col += meteors_msh(uv, u_density * 1.6, 13.0, 0.6, head * 0.55, trail * 0.45);
      col += meteors_msh(uv, u_density, 47.0, 1.0, head, trail);
      // Ember after-glow layer slightly offset behind the bright trails
      col += meteors_msh(uv + 0.002, u_density, 47.0, 1.1, vec3(0.0), ember * 0.30);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_density',     name: 'Meteor Count', type: 'float', min: 2.0, max: 9.0,  default: 4.0 },
    { id: 'u_angle',       name: 'Fall Angle',   type: 'float', min: 0.0, max: 6.28, default: 5.6 },
    { id: 'u_trail_color', name: 'Trail Colour', type: 'color', default: [0.60, 0.80, 1.0, 1.0] }
  ]
};
