export default {
  id: 'stucco_dash',
  name: 'Stucco Dash',
  category: 'Architecture',
  added: '2026-06-12',
  description: 'Rough-cast render — wet mortar thrown against the wall, every lump and crater throwing its own shadow, sharp aggregate poking through the skin and broad trowel passes ghosting beneath.',
  shader: `
    float hash_std(vec2 p) {
      return fract(sin(dot(p, vec2(241.3, 179.9))) * 39719.4571);
    }

    // height field of the thrown render (0..1)
    float relief_std(vec2 uv) {
      float h = 0.0;
      // large dollops
      h += (snoise(uv * 9.0) * 0.5 + 0.5) * 0.45;
      // mid splatter
      h += (snoise(uv * 23.0 + 7.0) * 0.5 + 0.5) * 0.33;
      // fine sand skin
      h += noise(uv * 70.0) * 0.22;
      return h;
    }

    vec4 generate() {
      vec2 uv = v_uv * (1.0 + u_coarseness * 0.0); // coarseness applied inside
      float scale = 0.6 + u_coarseness;

      vec2 suv = uv * scale;
      float h = relief_std(suv);

      // finite differences -> fake sun from the upper left
      float e = 0.004 * scale;
      float hx = relief_std(suv + vec2(e, 0.0)) - relief_std(suv - vec2(e, 0.0));
      float hy = relief_std(suv + vec2(0.0, e)) - relief_std(suv - vec2(0.0, e));
      float lit = clamp(0.55 - hx * 9.0 + hy * 9.0, 0.0, 1.3);
      // ambient occlusion in the craters between lumps
      float ao = smoothstep(0.15, 0.65, h);

      vec3 render = u_render_color.rgb;

      vec3 col = render;
      col *= 0.55 + lit * 0.50;            // raking light over the lumps
      col *= 0.70 + ao * 0.35;             // crater shadowing

      // --- aggregate: sharp stones breaking the render skin ---
      vec2 ag = uv * 38.0 * scale;
      vec2 aCell = floor(ag);
      vec2 af = fract(ag) - 0.5;
      vec2 aJit = vec2(hash_std(aCell), hash_std(aCell + 11.0)) - 0.5;
      float aDist = length(af - aJit * 0.5);
      float hasStone = step(0.62, hash_std(aCell + 23.0));
      float stoneR = 0.10 + hash_std(aCell + 31.0) * 0.14;
      float stone = smoothstep(stoneR, stoneR * 0.55, aDist) * hasStone;

      // stones in mixed greys, tans and the odd dark flint
      float sPick = hash_std(aCell + 47.0);
      vec3 sCol = vec3(0.58, 0.56, 0.53);
      if (sPick < 0.30)      sCol = vec3(0.66, 0.58, 0.45);   // tan quartzite
      else if (sPick < 0.45) sCol = vec3(0.30, 0.30, 0.32);   // flint
      else if (sPick < 0.60) sCol = vec3(0.72, 0.70, 0.66);   // pale granite
      sCol *= 0.85 + noise(ag * 6.0) * 0.3;
      // each stone is lit on its sun side, shadowed beneath
      vec2 toLight = normalize(vec2(-0.6, 0.8));
      float sLight = clamp(0.55 + dot(normalize(af - aJit * 0.5 + 0.0001), toLight) * 0.5, 0.0, 1.1);
      sCol *= sLight;
      // contact shadow the stone throws onto the render below it
      float sShadow = smoothstep(stoneR * 1.9, stoneR * 0.9,
        length(af - aJit * 0.5 - toLight * -0.06)) * hasStone * (1.0 - stone);
      col *= 1.0 - sShadow * 0.22;

      col = mix(col, sCol, stone * 0.9);

      // --- broad trowel passes ghosting under the dash ---
      float pass = snoise(vec2(uv.x * 1.5, uv.y * 6.0)) * 0.5 + 0.5;
      col *= 0.95 + pass * 0.08;

      // weather: grime washing down, heavier under the deep texture
      float wash = fbm(uv * 3.0 + 13.0) * 0.5 + 0.5;
      col = mix(col, col * vec3(0.72, 0.71, 0.68),
                (1.0 - ao) * wash * u_grime * 0.6);
      // hairline shrinkage crack wandering through the render
      float crk = abs(snoise(vec2(uv.x * 2.0, uv.y * 2.0) + 53.0));
      float crack = smoothstep(0.012, 0.0, crk - 0.002) * u_grime;
      col *= 1.0 - crack * 0.4;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_coarseness',   name: 'Coarseness', type: 'float', min: 0.4, max: 2.5, default: 1.0 },
    { id: 'u_grime',        name: 'Weathering', type: 'float', min: 0.0, max: 1.0, default: 0.4 },
    { id: 'u_render_color', name: 'Render',     type: 'color', default: [0.80, 0.76, 0.68, 1.0] }
  ]
};
