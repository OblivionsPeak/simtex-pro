export default {
  id: 'supernova_remnant',
  name: 'Supernova Remnant',
  category: 'Cosmos',
  added: '2026-06-11',
  description: 'Lace-like filamentary shells of a stellar explosion — interlocking ribbons of glowing oxygen teal and sulfur crimson around a hollow blast cavity.',
  shader: `
    // Ridged turbulence: |snoise| folded into sharp filament crests
    float ridge_snr(vec2 p) {
      float v = 0.0;
      float a = 0.55;
      for (int i = 0; i < 5; i++) {
        v += a * (1.0 - abs(snoise(p)));
        p = p * 2.07 + vec2(13.7, 7.3);
        a *= 0.52;
      }
      return v;
    }

    vec4 generate() {
      vec2 uv = fract(v_uv) - 0.5;
      float r = length(uv) * 2.0;
      float theta = atan(uv.y, uv.x);

      vec3 space = vec3(0.008, 0.008, 0.020);
      vec3 col = space;

      // Background stars
      vec2 sg = floor(v_uv * 80.0);
      float star = smoothstep(0.965, 1.0, hash(sg + 6.6)) *
                   smoothstep(0.09, 0.0, length(fract(v_uv * 80.0) - vec2(hash(sg), hash(sg + 21.0))));
      col += vec3(0.85, 0.88, 1.0) * star;

      // --- Shell geometry: blast wave radius perturbed per-angle ---
      float wob = snoise(vec2(cos(theta), sin(theta)) * 2.2) * 0.10
                + snoise(vec2(cos(theta), sin(theta)) * 5.5 + 9.0) * 0.045;
      float shellR = u_shell_size + wob;

      // Distance from the shell surface
      float sd = r - shellR;

      // --- Filaments: ridged turbulence concentrated in the shell band ---
      vec2 fuv = uv * (6.5 * u_filament_scale);
      float fil = ridge_snr(fuv);
      float filFine = ridge_snr(fuv * 2.6 + 31.0);
      float lace = pow(clamp(fil * 0.65 + filFine * 0.45 - 0.35, 0.0, 1.0), 2.2);

      // Shell band envelope: thick rim, hollow interior, fading exterior
      float band = exp(-pow(sd / 0.16, 2.0));
      float inner = exp(-pow((sd + 0.22) / 0.18, 2.0)) * 0.5; // trailing inner wisps
      float cavity = smoothstep(shellR * 0.55, shellR * 0.15, r);   // hollow centre

      // --- Two emission species woven through the lace ---
      float species = fbm(uv * 4.0 + 53.0) * 0.5 + 0.5;
      vec3 oxygen = u_teal_color.rgb;   // [O III] teal-green ribbons
      vec3 sulfur = u_red_color.rgb;    // [S II] crimson ribbons
      vec3 ribbon = mix(sulfur, oxygen, smoothstep(0.35, 0.65, species));

      float emission = lace * (band + inner) * (1.0 - cavity * 0.85);
      col += ribbon * emission * 1.7;

      // Bright knots where filaments crowd at the shock front
      float knots = pow(lace, 3.0) * band;
      col += vec3(0.95, 0.92, 0.85) * knots * 0.8;

      // Sharp leading shock edge: thin pale arc just outside the shell
      float shock = exp(-pow((sd - 0.07) / 0.022, 2.0));
      float shockBreaks = smoothstep(0.3, 0.6, noise(vec2(theta * 5.0, 2.2)));
      col += vec3(0.65, 0.78, 0.95) * shock * shockBreaks * 0.7;

      // Faint synchrotron haze filling the cavity
      float haze = cavity * (fbm(uv * 7.0 + 17.0) * 0.5 + 0.5);
      col += vec3(0.18, 0.12, 0.30) * haze * 0.45;

      // Central neutron star: tiny hard blue point
      float pulsarDot = exp(-r * r * 1800.0);
      col += vec3(0.6, 0.8, 1.0) * pulsarDot * 1.6;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_shell_size',     name: 'Shell Size',     type: 'float', min: 0.3, max: 0.9, default: 0.62 },
    { id: 'u_filament_scale', name: 'Filament Scale', type: 'float', min: 0.4, max: 2.5, default: 1.0 },
    { id: 'u_teal_color',     name: 'Oxygen Teal',    type: 'color', default: [0.15, 0.80, 0.70, 1.0] },
    { id: 'u_red_color',      name: 'Sulfur Red',     type: 'color', default: [0.85, 0.18, 0.12, 1.0] }
  ]
};
