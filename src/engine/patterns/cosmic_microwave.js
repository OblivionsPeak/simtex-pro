export default {
  id: 'cosmic_microwave',
  name: 'Cosmic Microwave',
  category: 'Cosmos',
  added: '2026-06-11',
  description: 'The baby picture of the universe — mottled CMB temperature anisotropies in the classic blue-to-red heat map, speckled with acoustic-peak hot spots.',
  shader: `
    // Band-limited blobby field: sums of smooth noise at survey-map scales
    float anis_cmb(vec2 uv, float scale) {
      float v = 0.0;
      v += snoise(uv * scale * 1.0) * 0.50;
      v += snoise(uv * scale * 2.3 + 17.0) * 0.28;
      v += snoise(uv * scale * 5.1 + 43.0) * 0.16;
      v += snoise(uv * scale * 11.7 + 91.0) * 0.09;
      return v;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- Temperature fluctuation field, -1..1 ---
      float t = anis_cmb(uv, u_blob_scale);

      // Acoustic-peak emphasis: push values toward saturated extremes
      t = sign(t) * pow(abs(t), 1.0 / max(u_contrast, 0.001));
      t = clamp(t * 0.5 + 0.5, 0.0, 1.0);

      // --- Classic Planck-map palette: deep blue → cyan → cream → orange → red ---
      vec3 cold2  = vec3(0.04, 0.09, 0.45);   // coldest
      vec3 cold1  = vec3(0.10, 0.45, 0.80);
      vec3 medium = vec3(0.92, 0.88, 0.74);   // mean temperature cream
      vec3 warm1  = vec3(0.95, 0.55, 0.15);
      vec3 warm2  = vec3(0.70, 0.08, 0.04);   // hottest

      vec3 col;
      if (t < 0.25)      col = mix(cold2, cold1,  t / 0.25);
      else if (t < 0.5)  col = mix(cold1, medium, (t - 0.25) / 0.25);
      else if (t < 0.75) col = mix(medium, warm1, (t - 0.5) / 0.25);
      else               col = mix(warm1, warm2,  (t - 0.75) / 0.25);

      // --- Fine survey grain: instrument-noise stipple over the map ---
      float stipple = hash(floor(uv * 480.0));
      col *= 0.95 + 0.08 * stipple;

      // --- Compact hot/cold point sources scattered across the sky ---
      vec2 g = floor(uv * 60.0);
      vec2 f = fract(uv * 60.0);
      vec2 sp = vec2(hash(g + 7.0), hash(g + 23.0));
      float src = smoothstep(0.975, 1.0, hash(g + 51.0)) *
                  exp(-pow(length(f - sp) / 0.10, 2.0));
      vec3 srcCol = hash(g + 77.0) > 0.5 ? warm2 : cold2;
      col = mix(col, srcCol, src * 0.85);

      // --- Subtle large-scale dipole: one half of the sky runs warm ---
      float dipole = sin((uv.x + uv.y * 0.4) * 3.14159265) * u_dipole;
      col = mix(col, warm1, max(dipole, 0.0) * 0.10);
      col = mix(col, cold1, max(-dipole, 0.0) * 0.10);

      // Whisper of galactic-plane contamination: a faint dusty streak
      float plane = exp(-pow((uv.y - 0.5 - sin(uv.x * 6.2831853) * 0.04) / 0.05, 2.0));
      float planeTex = fbm(uv * vec2(14.0, 5.0) + 31.0) * 0.5 + 0.5;
      col = mix(col, vec3(0.55, 0.40, 0.28), plane * planeTex * 0.18);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_blob_scale', name: 'Anisotropy Scale', type: 'float', min: 2.0, max: 16.0, default: 6.0 },
    { id: 'u_contrast',   name: 'Peak Contrast',    type: 'float', min: 0.5, max: 3.0,  default: 1.4 },
    { id: 'u_dipole',     name: 'Dipole Tilt',      type: 'float', min: 0.0, max: 1.0,  default: 0.4 }
  ]
};
