export default {
  id: 'turquoise_matrix',
  name: 'Turquoise Matrix',
  category: 'Geology',
  added: '2026-06-12',
  description: 'Sky-blue turquoise shot through with a black-brown spiderweb matrix — two scales of veining with thickened web junctions and waxy polish.',
  shader: `
    // Ridged vein line from simplex noise: 1 at the ridge, 0 elsewhere
    float vein_tqm(vec2 p, float width) {
      float n = snoise(p);
      return smoothstep(width, 0.0, abs(n));
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- Turquoise body ---
      vec3 sky = u_stone_color.rgb;
      // Mottled color zones: greener and bluer patches
      float zone = fbm(uv * 3.5) * 0.5 + 0.5;
      vec3 greener = sky * vec3(0.85, 1.05, 0.85);
      vec3 paler   = sky * 1.12 + 0.05;
      vec3 col = mix(sky, greener, smoothstep(0.35, 0.75, zone));
      col = mix(col, paler, smoothstep(0.7, 0.95, fbm(uv * 6.0 + 13.0) * 0.5 + 0.5) * 0.5);

      // Soft cloudy depth
      col *= 0.9 + (fbm(uv * 11.0) * 0.5 + 0.5) * 0.2;

      // --- Spiderweb matrix: primary veins ---
      vec2 w1 = uv * u_web_scale + vec2(snoise(uv * 2.0) * 0.3, 0.0);
      float v1 = vein_tqm(w1, 0.06 * u_web_thickness);
      // --- Secondary finer web ---
      vec2 w2 = uv * u_web_scale * 2.7 + 31.0;
      float v2 = vein_tqm(w2, 0.045 * u_web_thickness) * 0.7;
      // --- Hairline tertiary cracks ---
      vec2 w3 = uv * u_web_scale * 5.9 + 77.0;
      float v3 = vein_tqm(w3, 0.03 * u_web_thickness) * 0.4;

      float web = max(v1, max(v2, v3));

      // Junction thickening: where two webs cross, the matrix pools darker
      float junction = v1 * v2 * 2.0;
      web = clamp(web + junction, 0.0, 1.0);

      // Matrix color: black-brown limonite with slight rusty variation
      float rust = noise(uv * 40.0);
      vec3 matrix = mix(vec3(0.06, 0.05, 0.04), vec3(0.22, 0.13, 0.06), rust * 0.6);

      col = mix(col, matrix, web * 0.92);

      // Pale alteration halo hugging the big veins
      float halo = vein_tqm(w1, 0.16 * u_web_thickness) - v1;
      col = mix(col, paler, clamp(halo, 0.0, 1.0) * 0.25);

      // Waxy cabochon sheen
      float gloss = pow(clamp(1.0 - length(uv - vec2(0.4, 0.62)) * 1.4, 0.0, 1.0), 2.5);
      col += gloss * 0.09;
      // Veins stay matte: pull the sheen back off the matrix
      col -= gloss * 0.06 * web;

      // Fine stone grain
      col += (hash(uv * 750.0) - 0.5) * 0.02;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_web_scale',     name: 'Web Scale',     type: 'float', min: 2.0, max: 16.0, default: 6.0 },
    { id: 'u_web_thickness', name: 'Web Thickness', type: 'float', min: 0.2, max: 2.5,  default: 1.0 },
    { id: 'u_stone_color',   name: 'Stone Blue',    type: 'color', default: [0.22, 0.66, 0.72, 1.0] }
  ]
};
