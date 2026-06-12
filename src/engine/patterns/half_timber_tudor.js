export default {
  id: 'half_timber_tudor',
  name: 'Half-Timber Tudor',
  category: 'Architecture',
  added: '2026-06-12',
  description: 'Tudor half-timbering — adze-hewn oak posts, rails and diagonal braces stained near-black, infill panels of whitewashed wattle-and-daub bulging softly between them.',
  shader: `
    float hash_htt(vec2 p) {
      return fract(sin(dot(p, vec2(229.1, 167.7))) * 38117.9341);
    }

    vec4 generate() {
      float n = floor(u_bays + 0.5);
      vec2 uv = v_uv * n;
      vec2 cell = mod(floor(uv), n);
      vec2 f = fract(uv);

      float tw = u_timber_width;

      // --- frame members ---
      // posts (vertical) on cell sides, rails (horizontal) on cell tops/bottoms
      float dPost = min(f.x, 1.0 - f.x);
      float dRail = min(f.y, 1.0 - f.y);

      // diagonal brace in alternating bays, alternating direction
      float kind = mod(cell.x + cell.y, 2.0);
      float diagPos = (kind < 0.5) ? (f.y - f.x) : (f.y - (1.0 - f.x));
      float dBrace = abs(diagPos) * 0.70710678;
      // some bays have no brace at all
      float hasBrace = step(0.35, hash_htt(floor(cell / 1.0) + 13.0));
      if (hasBrace < 0.5) dBrace = 1.0;

      float dFrame = min(min(dPost, dRail), dBrace + tw * 0.15);
      float onTimber = smoothstep(tw, tw * 0.7, dFrame);

      // --- oak surface ---
      // grain runs along the member: pick direction by nearest member type
      vec2 grainUV;
      if (dPost <= dRail && dPost <= dBrace) grainUV = vec2(uv.x * 80.0, uv.y * 7.0);
      else if (dRail <= dBrace)              grainUV = vec2(uv.x * 7.0, uv.y * 80.0);
      else                                   grainUV = vec2((f.x + f.y) * 7.0, diagPos * 80.0) + cell * 11.0;

      float grain = noise(grainUV) * 0.6 + noise(grainUV * 2.7) * 0.4;
      // adze facets: low-frequency chop marks along the timber
      float adze = noise(grainUV * vec2(0.35, 1.0) + 51.0);

      vec3 oak = u_timber_color.rgb;
      vec3 timber = oak * (0.75 + grain * 0.45);
      timber *= 0.88 + adze * 0.22;
      // silvered ridges where the stain has weathered off the high grain
      timber += vec3(0.30, 0.29, 0.27) * smoothstep(0.75, 0.95, grain) * 0.25;
      // edge highlight where the chamfered arris catches light
      float arris = smoothstep(tw, tw * 0.78, dFrame) * smoothstep(tw * 0.55, tw * 0.78, dFrame);
      timber += oak * arris * 0.8 + vec3(0.06) * arris;

      // --- wattle-and-daub infill ---
      vec3 wash = u_plaster_color.rgb;
      // panel bulge: daub is never flat — it pillows out between timbers
      float bulge = smoothstep(tw, 0.5, dFrame);
      bulge = bulge * bulge * (3.0 - 2.0 * bulge);
      vec3 plaster = wash * (0.84 + bulge * 0.18);

      // rough limewash texture with trowel sweeps
      plaster *= 0.92 + fbm(uv * 6.0 + cell * 5.7) * 0.5 * 0.24;
      plaster *= 0.97 + noise(uv * 70.0) * 0.06;
      // faint horizontal wattle ridges ghosting through thin daub
      plaster *= 0.985 + sin(f.y * 60.0 + hash_htt(cell) * 6.0) * 0.015 * bulge;

      // weather staining bleeding down from the timber above each panel
      float drip = exp(-(f.y - tw) * 5.0) * step(tw, f.y);
      drip *= 0.5 + noise(vec2(uv.x * 30.0, cell.y)) * 0.8;
      plaster *= 1.0 - clamp(drip, 0.0, 1.0) * 0.16;

      // shadow line where plaster meets the frame (frame stands proud)
      float meet = smoothstep(tw * 2.2, tw, dFrame);
      plaster *= 1.0 - meet * 0.28;

      vec3 col = mix(timber, plaster, onTimber);

      // wooden peg dots at post/rail intersections
      vec2 pegP = vec2(min(f.x, 1.0 - f.x), min(f.y, 1.0 - f.y));
      float peg = smoothstep(tw * 0.42, tw * 0.26, length(pegP - vec2(tw * 0.5)));
      col = mix(col, oak * 1.35, peg * (1.0 - onTimber) * 0.8);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_bays',          name: 'Bays',         type: 'float', min: 2.0,  max: 10.0, default: 4.0 },
    { id: 'u_timber_width',  name: 'Timber Width', type: 'float', min: 0.04, max: 0.16, default: 0.09 },
    { id: 'u_timber_color',  name: 'Oak Stain',    type: 'color', default: [0.16, 0.11, 0.08, 1.0] },
    { id: 'u_plaster_color', name: 'Limewash',     type: 'color', default: [0.90, 0.87, 0.79, 1.0] }
  ]
};
