export default {
  id: 'suzani_embroidery',
  name: 'Suzani Embroidery',
  category: 'Textile',
  added: '2026-06-12',
  description: 'Uzbek suzani: huge embroidered sun-flower medallions in silk thread on cotton, the fill built from visible radial satin stitches with chain-stitch outlines and vine tendrils.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;

      // --- Cream cotton ground ---
      vec3 cream = vec3(0.92, 0.88, 0.78);
      float warp = sin(uv.x * 3.14159 * 240.0) * 0.5 + 0.5;
      float weft = sin(uv.y * 3.14159 * 240.0) * 0.5 + 0.5;
      vec3 col = cream * (0.95 + 0.025 * warp + 0.025 * weft);
      col *= 0.95 + 0.08 * fbm(uv * 3.0);

      // --- Medallion lattice ---
      float reps = u_repeats;
      vec2 g = uv * reps;
      float row = floor(g.y);
      g.x += mod(row, 2.0) * 0.5;
      vec2 cell = floor(g);
      vec2 f = fract(g) - 0.5;
      float r = length(f);
      float a = atan(f.y, f.x);

      vec3 sun   = u_sun_color.rgb;
      vec3 wine  = vec3(0.40, 0.10, 0.16);
      vec3 leafc = vec3(0.25, 0.36, 0.20);

      // hand wobble on every stitched edge
      float wob = (noise(vec2(a * 2.0 + cell.x * 7.0, cell.y * 5.0)) - 0.5) * 0.03;
      float rw = r + wob;

      // --- Satin-stitch fill: visible thread direction ---
      // radial stitches: fine lines running outward from the centre
      float radial = sin(a * 90.0) * 0.5 + 0.5;
      // concentric chain stitches for ring outlines
      float chain = sin(rw * 280.0) * 0.5 + 0.5;

      // medallion zones
      float z_core  = 1.0 - smoothstep(0.085, 0.105, rw);
      float z_ring1 = smoothstep(0.105, 0.125, rw) - smoothstep(0.22, 0.24, rw);
      // petal scallop on the outer flower edge
      float scallop = 0.33 + 0.045 * cos(a * 12.0);
      float z_petal = smoothstep(0.24, 0.26, rw) - smoothstep(scallop - 0.012, scallop + 0.012, rw);

      // thread colours modulated by stitch direction (sheen follows thread)
      vec3 core_th  = wine * (0.80 + 0.30 * radial);
      vec3 ring_th  = sun  * (0.72 + 0.38 * radial);
      vec3 petal_th = sun  * 0.85 + wine * 0.15;
      petal_th *= 0.74 + 0.36 * radial;
      // silk sheen: highlight band where thread angle faces the light
      float sheen = pow(max(cos(a * 2.0 - 1.2), 0.0), 3.0);
      ring_th  += sun * 0.25 * sheen;
      petal_th += sun * 0.20 * sheen;

      col = mix(col, core_th, z_core);
      col = mix(col, ring_th, z_ring1);
      col = mix(col, petal_th, z_petal);

      // chain-stitch outlines between zones
      float out1 = 1.0 - smoothstep(0.008, 0.020, abs(rw - 0.105));
      float out2 = 1.0 - smoothstep(0.008, 0.020, abs(rw - 0.24));
      float out3 = 1.0 - smoothstep(0.008, 0.020, abs(rw - scallop));
      float outl = clamp(out1 + out2 + out3, 0.0, 1.0);
      col = mix(col, wine * (0.7 + 0.3 * chain), outl);

      // cloth pucker shadow just outside the heavy embroidery
      float pucker = smoothstep(scallop, scallop + 0.05, rw) * (1.0 - smoothstep(scallop + 0.05, scallop + 0.13, rw));
      col *= 1.0 - pucker * 0.13;

      // --- Vine tendrils connecting medallions ---
      // sinuous line along cell edges
      vec2 vf = fract(g + 0.5) - 0.5;
      float vine_y = vf.y - 0.10 * sin(g.x * 6.28318);
      float vine = 1.0 - smoothstep(0.012, 0.030, abs(vine_y));
      vine *= smoothstep(0.30, 0.45, length(f)); // only between medallions
      col = mix(col, leafc * (0.8 + 0.3 * (sin(g.x * 160.0) * 0.5 + 0.5)), vine * u_vines);
      // little leaves on the vine
      float leaf = 1.0 - smoothstep(0.035, 0.06, length(vec2(fract(g.x * 2.0) - 0.5, vine_y - 0.05)));
      col = mix(col, leafc * 1.15, leaf * smoothstep(0.32, 0.45, length(f)) * u_vines);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_repeats',   name: 'Medallion Repeats', type: 'float', min: 1.0, max: 5.0, default: 2.0 },
    { id: 'u_vines',     name: 'Vine Tendrils',     type: 'float', min: 0.0, max: 1.0, default: 0.8 },
    { id: 'u_sun_color', name: 'Sun Thread',        type: 'color', default: [0.83, 0.45, 0.10, 1.0] }
  ]
};
