export default {
  id: 'hex_cascade',
  name: 'Hex Cascade',
  category: 'Racing',
  added: '2026-07-09',
  description: 'Hexagonal armour dissolving along the diagonal — filled steel cells thin out into ghost outlines with scattered voltage-green accents. A livery fade with engineering underneath.',
  shader: `
    float hexdist_hxc(vec2 p) {
      p = abs(p);
      return max(dot(p, normalize(vec2(1.0, 1.73))), p.x);
    }

    vec4 generate() {
      vec2 p = v_uv * u_scale;
      vec2 r = vec2(1.0, 1.7320508);
      vec2 h = r * 0.5;
      vec2 a = mod(p, r) - h;
      vec2 b = mod(p - h, r) - h;
      vec2 gv = dot(a, a) < dot(b, b) ? a : b;
      vec2 id = p - gv;
      float d = hexdist_hxc(gv);

      vec2 hc = id / u_scale;                       // hex centre in uv space
      float g = (hc.x + hc.y) * 0.5;                // diagonal fade coordinate
      float n = noise(id * 3.7 + 17.0);
      float s = 1.0 - g * u_fade + (n - 0.5) * 0.35;
      s = clamp((s - 0.12) / 0.75, 0.0, 1.0);

      vec3 bg = vec3(0.058, 0.066, 0.078);
      if (s < 0.03) return vec4(bg, 1.0);

      float rad = 0.5 * (0.30 + 0.66 * s);
      float u = hash(id + 4.2);
      float fill = smoothstep(rad, rad - 0.05, d);
      vec3 col = bg;

      if (u < u_accent && s > 0.15 && s < 0.9) {
        // rare live cell
        col = mix(bg, vec3(0.0, 1.0, 0.61), fill * (0.5 + 0.5 * s));
      } else if (s > 0.62 && u < 0.90) {
        // filled steel plate with a brighter rim
        vec3 steel = vec3(0.29, 0.33, 0.36) * (0.8 + 0.4 * hash(id + 9.1));
        float inner = smoothstep(rad - 0.06, rad - 0.10, d);
        col = mix(bg, steel, fill * (0.35 + 0.55 * s));
        col = mix(col, vec3(0.43, 0.48, 0.52), fill * inner);
      } else {
        // outline-only cell, weight scaling with the fade
        float w = 0.045 + 0.055 * s;
        float outline = fill - smoothstep(rad - w, rad - w - 0.035, d);
        col = mix(bg, vec3(0.38, 0.42, 0.45), clamp(outline, 0.0, 1.0) * (0.25 + 0.75 * s));
      }
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale',  name: 'Cell Density', type: 'float', min: 6.0,  max: 30.0, default: 14.0 },
    { id: 'u_fade',   name: 'Fade Strength', type: 'float', min: 0.4, max: 1.6,  default: 1.0 },
    { id: 'u_accent', name: 'Accent Cells', type: 'float', min: 0.0,  max: 0.3,  default: 0.10 }
  ]
};
