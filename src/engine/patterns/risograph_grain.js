export default {
  id: 'risograph_grain',
  name: 'Risograph Grain',
  category: 'Retro',
  added: '2026-06-11',
  description: 'Two-drum riso zine print — fluorescent pink and federal blue soy inks overprinting off-register, every shape dissolving into gritty stochastic grain on toothy paper.',
  shader: `
    // ink coverage artwork for one drum: blobby discs + screened bands
    float inkart_rg(vec2 uv, float seed) {
      float n = fbm(uv * 2.2 + seed) * 0.5 + 0.5;
      float blobs = smoothstep(0.50, 0.72, n);
      float bands = step(0.70, fract(uv.y * 5.0 + n * 1.6)) * 0.65;
      float dots = smoothstep(0.78, 0.86, noise(uv * 9.0 + seed * 3.0)) * 0.8;
      return clamp(blobs + bands + dots, 0.0, 1.0);
    }

    // stochastic riso screen: coverage -> grainy printed mask
    float screen_rg(vec2 uv, float cov) {
      float g = hash(floor(uv * 850.0));
      float thresh = mix(0.5, g, u_grain);
      // drum pressure blotch: coverage wobbles at low frequency
      cov *= 0.82 + 0.36 * (noise(uv * 3.5 + 21.0));
      return smoothstep(thresh - 0.18, thresh + 0.18, cov);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // toothy recycled paper
      vec3 paper = vec3(0.95, 0.93, 0.87);
      paper -= vec3(0.06) * noise(uv * 320.0);
      paper -= vec3(0.10, 0.08, 0.05) * smoothstep(0.93, 1.0, noise(uv * 55.0)); // flecks

      // drum 1: fluorescent pink, on register
      float covA = inkart_rg(uv * 3.0, 4.7);
      float maskA = screen_rg(uv, covA);

      // drum 2: blue, deliberately knocked off register
      vec2 off = vec2(u_misreg, -u_misreg * 0.6);
      float covB = inkart_rg((uv + off) * 3.0 + vec2(13.0, 5.0), 9.2);
      float maskB = screen_rg(uv + off * 0.5, covB);

      // translucent soy inks multiply onto the sheet
      vec3 col = paper;
      col *= mix(vec3(1.0), u_ink_a.rgb, maskA * 0.92);
      col *= mix(vec3(1.0), u_ink_b.rgb, maskB * 0.88);
      // overprint pools slightly darker where both drums hit
      col *= 1.0 - maskA * maskB * 0.18;

      // roller pickup: faint horizontal ghosting streaks
      col *= 1.0 - (noise(vec2(uv.y * 120.0, 3.0)) - 0.5) * 0.05;

      // ink never quite reaches the grain valleys — paper sparkle
      float valley = step(0.94, hash(floor(uv * 850.0) + 7.0));
      col = mix(col, paper, valley * 0.5);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_grain', name: 'Grain Strength', type: 'float', min: 0.0, max: 1.0, default: 0.65 },
    { id: 'u_misreg', name: 'Misregistration', type: 'float', min: 0.0, max: 0.02, default: 0.006 },
    { id: 'u_ink_a', name: 'Drum 1 Ink', type: 'color', default: [1.0, 0.30, 0.55, 1.0] },
    { id: 'u_ink_b', name: 'Drum 2 Ink', type: 'color', default: [0.15, 0.35, 0.85, 1.0] }
  ]
};
