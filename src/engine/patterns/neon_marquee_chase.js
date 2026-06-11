export default {
  id: 'neon_marquee_chase',
  name: 'Marquee Chase Lights',
  category: 'Retro',
  added: '2026-06-11',
  description: 'Theatre-marquee bulb rows frozen mid-chase — every third incandescent globe blazing in its brass socket, the rest cooling amber to dead glass on enamelled red channel.',
  shader: `
    vec4 generate() {
      float rows = u_rows;
      float ry = v_uv.y * rows;
      float row = floor(ry);
      float fy = fract(ry);

      // --- enamelled channel panel between bulb strips ---
      vec3 panel = u_panel_color.rgb;
      panel *= 0.88 + noise(v_uv * 140.0) * 0.18;          // orange-peel enamel
      panel *= 0.85 + 0.15 * sin(fy * 3.14159);            // channel curvature
      // gold pinstripes at each band edge
      float edge = min(fy, 1.0 - fy);
      float pin = (1.0 - smoothstep(0.035, 0.05, edge)) - (1.0 - smoothstep(0.012, 0.02, edge));
      vec3 gold = vec3(0.78, 0.60, 0.22);
      vec3 col = mix(panel, gold * (0.8 + noise(v_uv * 300.0) * 0.4), clamp(pin, 0.0, 1.0));

      // --- bulb strip down the middle of each band ---
      float count = u_bulb_count;
      float bx = v_uv.x * count + mod(row, 2.0) * 0.5;     // stagger alternate rows
      float bulbIdx = floor(bx);
      vec2 bf = vec2(fract(bx) - 0.5, (fy - 0.5) * (count / rows));
      float d = length(bf);

      // chase phase: position in the 1-in-3 cycle (rows counter-rotate)
      float phase = mod(bulbIdx + row * 2.0, 3.0);
      float lit  = step(phase, 0.5);                        // full burn
      float warm = step(0.5, phase) * step(phase, 1.5);     // cooling filament

      vec3 litc = u_lit_color.rgb;

      // socket: brass collar
      float collar = (1.0 - smoothstep(0.30, 0.36, d)) - (1.0 - smoothstep(0.24, 0.28, d));
      col = mix(col, gold * (0.55 + 0.45 * max(-bf.y * 3.0, 0.0)), clamp(collar, 0.0, 1.0));

      // glass globe
      float globe = 1.0 - smoothstep(0.24, 0.27, d);
      // dead bulb: smoked glass with a sliver of filament
      vec3 glass = vec3(0.10, 0.09, 0.09) + vec3(0.06) * (1.0 - d * 3.5);
      float fil = exp(-pow(bf.x * 30.0, 2.0)) * exp(-pow((bf.y + 0.04) * 22.0, 2.0));
      glass += vec3(0.25, 0.14, 0.06) * fil;
      // cooling bulb: amber ember
      vec3 ember = mix(glass, litc * vec3(0.7, 0.45, 0.25), 0.75 - d * 1.8);
      // lit bulb: white-hot core falling to amber rim
      vec3 burn = mix(litc * 1.6, litc * vec3(1.0, 0.7, 0.4), smoothstep(0.0, 0.26, d));

      vec3 bulb = glass;
      bulb = mix(bulb, ember, warm);
      bulb = mix(bulb, burn, lit);
      // specular pip upper-left on every globe
      bulb += vec3(0.8) * exp(-dot(bf - vec2(-0.07, 0.08), bf - vec2(-0.07, 0.08)) * 600.0) * (0.4 + lit);
      col = mix(col, bulb, globe);

      // halo spilling onto the enamel from lit bulbs
      col += litc * exp(-max(d - 0.24, 0.0) * 7.0) * lit * u_glow * 0.6;
      col += litc * vec3(1.0, 0.6, 0.3) * exp(-max(d - 0.24, 0.0) * 12.0) * warm * u_glow * 0.15;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_rows', name: 'Bulb Rows', type: 'float', min: 2.0, max: 8.0, default: 4.0 },
    { id: 'u_bulb_count', name: 'Bulbs Per Row', type: 'float', min: 6.0, max: 24.0, default: 12.0 },
    { id: 'u_glow', name: 'Halo Spill', type: 'float', min: 0.0, max: 2.0, default: 1.0 },
    { id: 'u_lit_color', name: 'Filament Glow', type: 'color', default: [1.0, 0.85, 0.55, 1.0] }
  ]
};
