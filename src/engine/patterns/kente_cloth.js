export default {
  id: 'kente_cloth',
  name: 'Kente Cloth',
  category: 'Textile',
  added: '2026-06-12',
  description: 'Ghanaian strip-woven kente: narrow horizontal strips divided into blocks of alternating motifs — gold ground with red, green and black stripe, zigzag and check designs, with visible strip seams.',
  shader: `
    float tri_ken(float x) {
      return abs(fract(x) - 0.5) * 2.0;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- Strip-cloth structure: horizontal woven strips sewn together ---
      float strips = u_strips;
      float strip_id = floor(uv.y * strips);
      float strip_v  = fract(uv.y * strips);

      // Blocks along each strip, offset per strip like real sewn kente
      float blocks = 4.0;
      float strip_shift = hash(vec2(strip_id, 3.7));
      float bx = uv.x * blocks + floor(strip_shift * 4.0) * 0.5;
      float block_id = floor(bx);
      float block_u  = fract(bx);

      // Motif selector: stable per block, cycles through 4 designs
      float sel = floor(mod(hash(vec2(block_id * 1.3, strip_id * 2.1)) * 7.0 + block_id + strip_id, 4.0));

      // --- Kente palette ---
      vec3 gold  = vec3(0.85, 0.62, 0.12);
      vec3 red   = vec3(0.62, 0.10, 0.08);
      vec3 green = vec3(0.10, 0.35, 0.16);
      vec3 black = vec3(0.10, 0.08, 0.06);

      vec3 col = gold;

      // Motif 0: vertical warp stripes (babadua)
      if (sel < 0.5) {
        float s = floor(fract(block_u * 7.0) * 2.0);
        float band = mod(floor(block_u * 7.0), 3.0);
        col = gold;
        if (band < 1.0) col = red;
        else if (band < 2.0) col = mix(gold, green, s);
      }
      // Motif 1: horizontal weft bars
      else if (sel < 1.5) {
        float band = mod(floor(strip_v * 6.0), 3.0);
        col = (band < 1.0) ? black : ((band < 2.0) ? gold : red);
      }
      // Motif 2: zigzag (nkyimkyim)
      else if (sel < 2.5) {
        float zz = tri_ken(block_u * 3.0);
        float line_d = abs(strip_v - mix(0.25, 0.75, zz));
        col = mix(gold, black, 1.0 - smoothstep(0.07, 0.12, line_d));
        float line_d2 = abs(strip_v - mix(0.75, 0.25, zz));
        col = mix(col, green, 1.0 - smoothstep(0.06, 0.11, line_d2));
      }
      // Motif 3: checks (fahia kotwere)
      else {
        float cx = floor(block_u * 4.0);
        float cy = floor(strip_v * 4.0);
        float chk = mod(cx + cy, 2.0);
        col = mix(red, black, chk);
      }

      // --- Strip seams: shadowed join where strips are hand-sewn ---
      float seam = smoothstep(0.0, 0.045, strip_v) * smoothstep(1.0, 0.955, strip_v);
      col *= 0.55 + 0.45 * seam;

      // Block boundary: weft change leaves a slight ridge
      float bedge = smoothstep(0.0, 0.03, block_u) * smoothstep(1.0, 0.97, block_u);
      col *= 0.88 + 0.12 * bedge;

      // --- Weave texture: dense weft ribs inside each strip ---
      float weft_rib = sin(strip_v * 3.14159 * 30.0) * 0.5 + 0.5;
      float warp_rib = sin(uv.x * 3.14159 * 160.0) * 0.5 + 0.5;
      col *= 0.90 + 0.07 * weft_rib + 0.05 * warp_rib;

      // Silk sheen drifting across the cloth
      float sheen = fbm(uv * 3.0 + vec2(strip_id * 0.37, 0.0));
      col *= 0.95 + 0.10 * sheen;
      col += vec3(0.06, 0.05, 0.02) * smoothstep(0.45, 0.9, sheen) * u_sheen;

      // Thread slubs
      float slub = smoothstep(0.97, 1.0, noise(uv * vec2(190.0, 40.0)));
      col = mix(col, col * 1.25, slub);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_strips', name: 'Strip Count', type: 'float', min: 3.0, max: 12.0, default: 6.0 },
    { id: 'u_sheen',  name: 'Silk Sheen',  type: 'float', min: 0.0, max: 1.0,  default: 0.5 }
  ]
};
