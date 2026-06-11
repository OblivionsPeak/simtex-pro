export default {
  id: 'sea_urchin_shell',
  name: 'Sea Urchin Shell',
  category: 'Ocean',
  added: '2026-06-11',
  description: 'A bleached urchin test seen from above — five-fold sectors, beaded tubercle rows and pinprick pore pairs radiating from the apex.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv - 0.5;
      float r = length(uv) * 2.0;
      float ang = atan(uv.y, uv.x);
      float turn = fract(ang / 6.28318 + 0.5);     // 0..1 around the apex

      vec3 shell = u_shell_color.rgb;

      // --- base test: domed shading, lighter at the apex ---
      float dome = sqrt(clamp(1.0 - r * r * 0.55, 0.0, 1.0));
      vec3 col = shell * (0.55 + 0.55 * dome);
      col += (noise(v_uv * 220.0) - 0.5) * 0.04;   // calcite grain

      // --- ten sectors: 5 ambulacral (pore) + 5 interambulacral (tubercle) ---
      float sectors = 10.0;
      float sec = turn * sectors;
      float sec_id = floor(sec);
      float sec_f = fract(sec);
      float is_amb = mod(sec_id, 2.0);             // alternate sector types

      // sector boundary sutures: fine pale zigzag lines
      float suture = smoothstep(0.05, 0.0, min(sec_f, 1.0 - sec_f));
      // sutures meander slightly with radius
      suture *= 0.7 + 0.3 * sin(r * 40.0 + sec_id);
      col = mix(col, shell * 1.30 + vec3(0.08), suture * 0.55 * step(0.06, r));

      // plate rows: faint concentric growth lines
      float plates = fract(r * u_plate_rows);
      float plate_line = smoothstep(0.08, 0.0, min(plates, 1.0 - plates));
      col = mix(col, shell * 0.80, plate_line * 0.30 * step(0.08, r));

      // --- interambulacral sectors: beaded tubercles (spine bosses) ---
      float ring_i = floor(r * u_plate_rows);
      float ring_f = fract(r * u_plate_rows) - 0.5;
      // tubercle sits mid-sector, one per plate ring, shrinking near apex
      float tub_size = (0.30 + 0.25 * r) * u_bump_size;
      vec2 tp = vec2((sec_f - 0.5) * (0.9 + r * 2.0), ring_f);
      float tub_d = length(tp) / max(tub_size, 0.01);
      float tub = smoothstep(1.0, 0.75, tub_d) * (1.0 - is_amb) * step(0.10, r);
      // domed boss: bright crown, shadowed base, dark areole ring
      float boss = sqrt(clamp(1.0 - tub_d * tub_d, 0.0, 1.0));
      vec3 tub_col = mix(shell * 0.65, shell * 1.45 + vec3(0.10), boss);
      tub_col = mix(tub_col, shell * 0.55, smoothstep(0.85, 1.0, tub_d) * 0.8);
      col = mix(col, tub_col, tub);
      // secondary mini-tubercles flanking the main row
      vec2 mp = vec2((abs(sec_f - 0.5) - 0.32) * (0.9 + r * 2.0), ring_f);
      float mini = smoothstep(0.18, 0.10, length(mp)) * (1.0 - is_amb) * step(0.15, r);
      col = mix(col, shell * 1.2, mini * 0.5);

      // --- ambulacral sectors: paired pore pinpricks marching outward ---
      float pore_y = fract(r * u_plate_rows * 2.0) - 0.5;
      float pore_x = abs(sec_f - 0.5) - 0.18;
      float pore = smoothstep(0.10, 0.04, length(vec2(pore_x * (1.0 + r * 2.0), pore_y)));
      col = mix(col, shell * 0.40, pore * is_amb * 0.8 * step(0.08, r));
      // ambulacral zones tinted slightly differently
      col = mix(col, col * vec3(0.93, 0.96, 1.02), is_amb * 0.5);

      // --- apex: madreporite button ---
      float apex = smoothstep(0.07, 0.03, r);
      col = mix(col, shell * 1.25 + vec3(0.05), apex);
      col = mix(col, shell * 0.5, smoothstep(0.02, 0.0, r));

      // outer edge falls away into shadow
      col *= 1.0 - smoothstep(0.85, 1.05, r) * 0.45;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_plate_rows',  name: 'Plate Rows',     type: 'float', min: 4.0, max: 16.0, default: 8.0 },
    { id: 'u_bump_size',   name: 'Tubercle Size',  type: 'float', min: 0.3, max: 1.5,  default: 0.8 },
    { id: 'u_shell_color', name: 'Shell Color',    type: 'color', default: [0.58, 0.42, 0.52, 1.0] }
  ]
};
