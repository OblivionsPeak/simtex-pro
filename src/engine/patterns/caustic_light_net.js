export default {
  id: 'caustic_light_net',
  name: 'Caustic Light Net',
  category: 'Ocean',
  added: '2026-06-11',
  description: 'Dancing webs of refracted sunlight crisscrossing a shallow pool floor, with bright knots where the filaments converge.',
  shader: `
    // Ridged-noise filament: bright where noise crosses zero
    float ridge_cln(vec2 p) {
      return 1.0 - abs(snoise(p));
    }

    // Two ridged fields multiplied — bright only where both filaments cross
    float net_cln(vec2 p) {
      float a = ridge_cln(p);
      float b = ridge_cln(p * 1.27 + vec2(7.7, 3.1));
      return pow(max(a * b, 0.0), 4.0);
    }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;

      // domain warp so the net wobbles like real refraction
      vec2 warp = vec2(snoise(uv * 0.9 + vec2(31.4, 7.2)),
                       snoise(uv * 0.9 + vec2(4.8, 19.6))) * 0.35;
      vec2 p = uv + warp;

      // --- pool floor base ---
      vec3 floor_col = u_floor_color.rgb;
      float grain = noise(v_uv * 180.0) * 0.10 - 0.05;     // sand / plaster grain
      float patch = fbm(v_uv * 4.0) * 0.5 + 0.5;            // broad floor tone shifts
      vec3 col = floor_col * (0.80 + 0.25 * patch) + grain;

      // depth tint — slightly bluer where the floor reads deeper
      col = mix(col, col * vec3(0.75, 0.9, 1.05), (1.0 - patch) * 0.5);

      // --- caustic net, two octaves ---
      float c1 = net_cln(p);                  // primary web
      float c2 = net_cln(p * 2.3 + 11.0);     // finer secondary web
      float caustic = c1 + c2 * 0.45;

      // chromatic fringing: red and blue webs sampled slightly apart
      float cr = net_cln(p + vec2(0.012, 0.0));
      float cb = net_cln(p - vec2(0.012, 0.0));

      vec3 light = u_light_color.rgb;
      col += light * caustic * u_intensity;
      col += vec3(0.35, 0.05, 0.0) * cr * u_intensity * 0.25;
      col += vec3(0.0, 0.08, 0.35) * cb * u_intensity * 0.25;

      // hot knots where filaments converge bloom toward white
      col += vec3(1.0) * smoothstep(0.55, 1.1, caustic) * u_intensity * 0.5;

      // soft ambient shimmer between the webs
      float shimmer = ridge_cln(p * 0.7 + 40.0);
      col += light * shimmer * shimmer * 0.06;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale',       name: 'Net Scale',      type: 'float', min: 2.0, max: 16.0, default: 6.0 },
    { id: 'u_intensity',   name: 'Sun Intensity',  type: 'float', min: 0.2, max: 2.0, default: 1.0 },
    { id: 'u_light_color', name: 'Sunlight Color', type: 'color', default: [0.85, 0.95, 1.0, 1.0] },
    { id: 'u_floor_color', name: 'Floor Color',    type: 'color', default: [0.10, 0.42, 0.55, 1.0] }
  ]
};
