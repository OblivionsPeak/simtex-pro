export default {
  id: 'sponsor_patchwork',
  name: 'Sponsor Patchwork',
  category: 'Heritage',
  added: '2026-06-12',
  description: 'A dense quilt of varied blank sponsor blocks — white decal panels, colour bars, pill shapes and text-line placeholders crowding the bodywork like a 70s privateer.',
  shader: `
    // rounded-rectangle signed distance
    float rrect_hrt9(vec2 p, vec2 b, float r) {
      vec2 q = abs(p) - b + r;
      return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
    }

    vec4 generate() {
      float n = u_density;
      vec2 guv = v_uv * n;
      float row = floor(guv.y);
      // brick-stagger every row so decals never align into a grid
      guv.x += hash(vec2(row, 9.0)) * 0.9;
      vec2 cell = floor(guv);
      vec2 f = fract(guv) - 0.5;

      // --- palette: body colour plus a sponsor-decal swatch book ---
      vec3 body = u_body_color.rgb;
      vec3 white = vec3(0.95, 0.94, 0.91);
      vec3 sw0 = u_accent_color.rgb;                    // hero accent
      vec3 sw1 = vec3(0.91, 0.76, 0.12);                // marigold
      vec3 sw2 = vec3(0.15, 0.30, 0.55);                // royal blue
      vec3 sw3 = vec3(0.13, 0.13, 0.15);                // ink black

      // body coat
      vec3 col = body;
      col *= 0.965 + noise(v_uv * 500.0) * 0.055;
      col += smoothstep(0.7, 0.0, length(v_uv - vec2(0.75, 0.8))) * 0.03;

      float h0 = hash(cell);
      float h1 = hash(cell + 11.0);
      float h2 = hash(cell + 23.0);
      float h3 = hash(cell + 47.0);

      // each cell hosts a decal of varied size/aspect; a few cells stay bare
      float present = step(0.12, h0);
      vec2 half_b = vec2(0.30 + h1 * 0.14, 0.18 + h2 * 0.16);
      float pill = step(0.78, h3);                       // some decals are pills
      float rad = mix(0.04, half_b.y, pill);
      vec2 off = (vec2(h2, h3) - 0.5) * 0.12;
      vec2 p = f - off;

      float d = rrect_hrt9(p, half_b, rad);
      float aa = 0.02;
      float in_d = smoothstep(aa, -aa, d) * present;

      // sticker drop shadow
      col *= 1.0 - smoothstep(0.06, 0.0, rrect_hrt9(p + vec2(-0.02, 0.025), half_b, rad))
                 * step(0.0, d) * present * 0.10;

      // --- white decal base ---
      vec3 d_col = white * (0.97 + noise((cell + p) * 200.0) * 0.04);
      // decal yellows differently per sticker (different vinyl batches)
      d_col = mix(d_col, d_col * vec3(1.0, 0.96, 0.85), h1 * 0.5);

      // --- per-decal layout, picked by hash ---
      float style = floor(h0 * 4.0);
      vec3 ink = (h3 < 0.25) ? sw0 : (h3 < 0.5) ? sw1 : (h3 < 0.75) ? sw2 : sw3;
      vec2 q = p / half_b;                               // -1..1 inside the decal

      if (style < 1.0) {
        // top colour bar + two grey text lines
        d_col = mix(d_col, ink, step(0.30, q.y));
        float tl = step(abs(q.y + 0.25), 0.10) + step(abs(q.y + 0.62), 0.10);
        d_col = mix(d_col, sw3 * 1.8, clamp(tl, 0.0, 1.0) * step(abs(q.x), 0.72) * 0.45);
      } else if (style < 2.0) {
        // bold left lozenge + wordmark band
        float lz = smoothstep(0.05, -0.05, length(q - vec2(-0.55, 0.0)) - 0.38);
        d_col = mix(d_col, ink, lz);
        d_col = mix(d_col, sw3, step(abs(q.y), 0.16) * step(0.0, q.x) * step(q.x, 0.78) * 0.8);
      } else if (style < 3.0) {
        // full-flood colour with a white slash
        d_col = mix(d_col, ink, 0.92);
        d_col = mix(d_col, white, step(abs(q.x + q.y * 0.5), 0.12));
      } else {
        // keyline border + centred blocky mark
        float bord = step(0.78, max(abs(q.x), abs(q.y)));
        d_col = mix(d_col, ink, bord);
        float mk = step(abs(q.x), 0.34) * step(abs(q.y), 0.30) *
                   step(0.5, fract(q.x * 3.5 + h2 * 4.0));
        d_col = mix(d_col, ink, mk * 0.9);
      }

      // print misregistration: faint accent ghost on the text lines
      d_col = mix(d_col, sw0, step(abs(q.y + 0.25 + 0.03), 0.04) * step(abs(q.x), 0.72)
                              * step(style, 0.99) * 0.12);

      // edge curl highlight + worn corners
      d_col += smoothstep(0.0, -0.05, d) * smoothstep(-0.10, -0.05, d) * 0.04;
      float worn = step(0.92, hash(floor((cell + p) * 60.0))) *
                   smoothstep(0.5, 0.95, max(abs(q.x), abs(q.y)));
      d_col = mix(d_col, body, worn * 0.5);

      col = mix(col, d_col, in_d);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_density', name: 'Decal Density', type: 'float', min: 2.0, max: 8.0, default: 4.0 },
    { id: 'u_body_color', name: 'Body Colour', type: 'color', default: [0.85, 0.86, 0.88, 1.0] },
    { id: 'u_accent_color', name: 'Hero Accent', type: 'color', default: [0.80, 0.12, 0.10, 1.0] }
  ]
};
