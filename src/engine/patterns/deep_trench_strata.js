export default {
  id: 'deep_trench_strata',
  name: 'Deep Trench Strata',
  category: 'Ocean',
  added: '2026-06-11',
  description: 'A trench wall in cross-section — banded sediment strata sheared by vertical faults, with pale ash layers and crumbling edges.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;

      vec3 base = u_sediment_color.rgb;

      // --- fault blocks: columns shifted vertically against each other ---
      float cols = 3.0;
      float cidx = floor(uv.x * cols);
      float cf = fract(uv.x * cols);
      // wrap column index so the fault offsets tile horizontally
      float cw = mod(cidx, cols);
      float drop = (hash(vec2(cw, 7.7)) - 0.5) * u_fault;

      // layer coordinate: warped, faulted vertical position
      float wob = fbm(vec2(uv.x * 3.0, uv.y * 0.5)) * u_warp;
      float yy = (uv.y + drop + wob) * u_layers;
      float li = floor(yy);
      float lf = fract(yy);

      // --- per-layer sediment palette ---
      float lh = hash(vec2(li, 3.1));
      vec3 clay   = base;                               // ochre clay
      vec3 silt_g = base * vec3(0.70, 0.75, 0.80);      // grey silt
      vec3 organ  = base * vec3(0.45, 0.40, 0.38);      // dark organic mud
      vec3 ash    = vec3(0.82, 0.80, 0.76);             // pale volcanic ash
      vec3 lay_col = mix(clay, silt_g, step(0.35, lh));
      lay_col = mix(lay_col, organ, step(0.68, lh));
      // occasional thin ash marker bed
      float is_ash = step(0.88, lh);
      lay_col = mix(lay_col, ash, is_ash);

      // layer thickness shading: compacted dark base, lighter top
      float grade = mix(0.78, 1.12, lf);
      vec3 col = lay_col * grade;

      // crisp bedding plane at each layer boundary
      float bed = smoothstep(0.06, 0.0, min(lf, 1.0 - lf));
      col = mix(col, lay_col * 0.45, bed * 0.7);

      // --- intra-layer lamination: fine sub-bands ---
      float lam = sin(yy * 24.0 + lh * 31.0) * 0.5 + 0.5;
      col *= 0.95 + lam * 0.07;

      // --- fault planes: dark crush zones at column boundaries ---
      float fault_line = smoothstep(0.035, 0.0, min(cf, 1.0 - cf)) * step(0.01, abs(u_fault));
      col = mix(col, col * 0.40, fault_line * 0.85);
      // crushed breccia speckle along the fault
      float brec = noise(uv * vec2(40.0, 200.0));
      col = mix(col, lay_col * 0.65, fault_line * brec * 0.6);
      // drag fold: layers brighten slightly as they bend into the fault
      float drag = smoothstep(0.10, 0.0, min(cf, 1.0 - cf)) * (1.0 - fault_line);
      col *= 1.0 + drag * 0.06;

      // --- weathering: granular surface wear and crumbled pockets ---
      col += (noise(uv * 200.0) - 0.5) * 0.06;
      float pock = smoothstep(0.75, 0.95, fbm(uv * 8.0 + 51.0) * 0.5 + 0.5);
      col = mix(col, lay_col * 0.55, pock * 0.35);
      // pale mineral veining cutting across bedding
      float veinv = pow(1.0 - abs(snoise(uv * vec2(2.0, 6.0) + 23.0)), 12.0);
      col = mix(col, ash * 0.9, veinv * 0.35);

      // abyssal gloom gathers toward the bottom of the wall
      col *= mix(0.80, 1.05, uv.y);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_layers',         name: 'Layer Count',   type: 'float', min: 4.0, max: 24.0, default: 12.0 },
    { id: 'u_fault',          name: 'Fault Offset',  type: 'float', min: 0.0, max: 0.5,  default: 0.18 },
    { id: 'u_warp',           name: 'Bed Warping',   type: 'float', min: 0.0, max: 0.4,  default: 0.12 },
    { id: 'u_sediment_color', name: 'Sediment Tone', type: 'color', default: [0.52, 0.43, 0.32, 1.0] }
  ]
};
