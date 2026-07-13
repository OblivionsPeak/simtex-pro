export default {
  id: 'cardboard_corrugation',
  name: 'Cardboard Corrugation',
  category: 'Heritage',
  added: '2026-07-13',
  description: 'Torn shipping cardboard — mottled kraft face with flutes telegraphing through, ripped open along a ragged band that exposes the wavy corrugated cross-section.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;
      // flute phase, wobbled so the ridges aren't machine-perfect
      float wob = (fbm(uv * 5.0) - 0.5) * 0.9;
      float ph = uv.x * u_scale * 6.2831853 + wob;
      float ridge = sin(ph);
      // kraft face: recycled fibre mottle + fine grain + telegraphing flutes
      vec3 kraft = u_primary_color.rgb;
      kraft *= 0.90 + 0.10 * fbm(uv * 12.0);
      kraft *= 0.93 + 0.07 * noise(uv * 260.0);
      kraft *= 1.0 + ridge * 0.055;
      // scuffs and handling grime on the face
      kraft *= 1.0 - smoothstep(0.68, 0.92, fbm(uv * 3.5 + 41.0)) * 0.10;
      // ragged tear band across the middle of the tile
      float rag1 = (fbm(vec2(uv.x * 7.0, 2.7)) - 0.5) * 0.06;
      float rag2 = (fbm(vec2(uv.x * 7.0, 9.4)) - 0.5) * 0.06;
      float y0 = 0.5 - u_tear * 0.5 + rag1;
      float y1 = 0.5 + u_tear * 0.5 + rag2;
      float inBand = smoothstep(y0 - 0.003, y0 + 0.003, uv.y) * smoothstep(y1 + 0.003, y1 - 0.003, uv.y);
      // exposed cross-section: sine flute wave sandwiched between liners
      float bandY = clamp((uv.y - y0) / max(y1 - y0, 0.001), 0.0, 1.0);
      float wave = 0.5 + 0.34 * sin(ph);
      float dWave = abs(bandY - wave);
      vec3 inner = u_secondary_color.rgb * (0.9 + 0.1 * noise(uv * 220.0));
      float wall = smoothstep(0.14, 0.03, dWave);
      // cavities fall into shadow, the flute wall catches light
      vec3 xsec = inner * (0.55 + 0.45 * wall);
      // thin liner edges at top and bottom of the cut
      float liner = smoothstep(0.05, 0.0, bandY) + smoothstep(0.95, 1.0, bandY);
      xsec = mix(xsec, inner * 1.08, liner * 0.8);
      // torn paper fibres fringe both tear edges
      float edge = smoothstep(0.05, 0.0, abs(uv.y - y0)) + smoothstep(0.05, 0.0, abs(uv.y - y1));
      float fuzz = noise(vec2(uv.x * 140.0, uv.y * 50.0));
      vec3 col = mix(kraft, xsec, inBand);
      col = mix(col, u_accent_color.rgb, edge * inBand * fuzz * 0.75);
      // drop shadow the top flap casts down into the tear
      col *= 1.0 - smoothstep(0.05, 0.0, uv.y - y0) * inBand * 0.22;
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Flute Density', type: 'float', min: 8.0, max: 80.0, default: 28.0 },
    { id: 'u_tear', name: 'Tear Width', type: 'float', min: 0.05, max: 0.35, default: 0.18 },
    { id: 'u_primary_color', name: 'Kraft Face', type: 'color', default: [0.62, 0.46, 0.28, 1.0] },
    { id: 'u_secondary_color', name: 'Exposed Flute', type: 'color', default: [0.76, 0.62, 0.42, 1.0] },
    { id: 'u_accent_color', name: 'Torn Fibre', type: 'color', default: [0.88, 0.79, 0.62, 1.0] }
  ],
  variants: [
    { name: 'Shipping Box', uniforms: { u_scale: 28.0, u_tear: 0.18, u_primary_color: [0.62, 0.46, 0.28, 1.0], u_secondary_color: [0.76, 0.62, 0.42, 1.0], u_accent_color: [0.88, 0.79, 0.62, 1.0] } },
    { name: 'Cold Chain', uniforms: { u_scale: 40.0, u_tear: 0.12, u_primary_color: [0.82, 0.80, 0.76, 1.0], u_secondary_color: [0.68, 0.66, 0.62, 1.0], u_accent_color: [0.94, 0.93, 0.90, 1.0] } },
    { name: 'Ripped Wide', uniforms: { u_scale: 16.0, u_tear: 0.32, u_primary_color: [0.45, 0.30, 0.18, 1.0], u_secondary_color: [0.70, 0.53, 0.32, 1.0], u_accent_color: [0.85, 0.72, 0.50, 1.0] } }
  ]
};
