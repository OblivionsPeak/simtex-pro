export default {
  id: 'lava_lamp',
  name: 'Lava Lamp',
  category: 'Retro',
  added: '2026-06-11',
  description: 'Molten wax suspended mid-rise — backlit metaball globs stretching and necking apart in violet liquid, hot yellow cores cooling to orange skins with a gooey glow.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;

      // gooey domain warp so blob edges wobble organically
      vec2 w = uv + vec2(snoise(uv * 3.0 + 5.0), snoise(uv * 3.0 + 9.0)) * 0.045 * u_goo;

      // --- metaball field: 8 wax globs, wrapped both axes so the sheet tiles ---
      float field = 0.0;
      for (int i = 0; i < 8; i++) {
        float fi = float(i);
        vec2 c = vec2(hash(vec2(fi, 3.7)), hash(vec2(fi, 8.1)));
        vec2 d = fract(w - c + 0.5) - 0.5;        // wrapped distance
        d.x *= 1.7;                                // globs stretch vertically as they rise
        float r = (0.045 + hash(vec2(fi, 13.3)) * 0.085) * u_blob_scale;
        field += (r * r) / (dot(d, d) + 0.0006);
      }
      // a few small trailing droplets
      for (int j = 0; j < 5; j++) {
        float fj = float(j) + 20.0;
        vec2 c = vec2(hash(vec2(fj, 3.7)), hash(vec2(fj, 8.1)));
        vec2 d = fract(w - c + 0.5) - 0.5;
        d.x *= 1.7;
        float r = 0.022 * u_blob_scale;
        field += (r * r) / (dot(d, d) + 0.0006);
      }

      // --- the liquid: backlit gradient, brightest at the lamp base ---
      vec3 fluidDeep = u_fluid_color.rgb;
      vec3 fluidLit  = mix(fluidDeep, u_wax_color.rgb, 0.45) + 0.10;
      vec3 fluid = mix(fluidLit, fluidDeep, smoothstep(0.0, 1.0, uv.y));
      // bulb rays shafting up through the liquid
      fluid += u_wax_color.rgb * 0.06 * (0.5 + 0.5 * sin(uv.x * 40.0 + snoise(uv * 4.0) * 3.0)) * (1.0 - uv.y);
      // suspended glitter motes
      float mote = step(0.995, hash(floor(uv * 220.0)));
      fluid += vec3(0.35, 0.25, 0.30) * mote;

      // --- compose wax over liquid ---
      float body = smoothstep(0.92, 1.18, field);
      float core = smoothstep(1.6, 4.5, field);

      vec3 wax = u_wax_color.rgb;
      // skin darkens slightly where the glob curves away
      vec3 skin = wax * 0.78;
      // core superheats toward yellow-white
      vec3 hot = mix(wax, vec3(1.0, 0.92, 0.55), 0.85);
      vec3 glob = mix(skin, wax, smoothstep(0.92, 1.5, field));
      glob = mix(glob, hot, core);
      // rim light where liquid backlights the skin
      float rim = smoothstep(0.92, 1.05, field) * (1.0 - smoothstep(1.05, 1.5, field));
      glob += fluidLit * rim * 0.4;

      vec3 col = mix(fluid, glob, body);

      // halo: the liquid warms around each glob (sub-threshold field glow)
      float nearGlob = smoothstep(0.45, 0.92, field) * (1.0 - body);
      col += wax * nearGlob * 0.18;

      // glass curvature: subtle vertical highlight bands (the lamp wall)
      col += vec3(0.05) * exp(-pow((fract(uv.x * 1.0) - 0.18) * 9.0, 2.0));
      col *= 0.94 + noise(uv * 300.0) * 0.06;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_blob_scale', name: 'Glob Size', type: 'float', min: 0.5, max: 2.0, default: 1.0 },
    { id: 'u_goo', name: 'Goo Wobble', type: 'float', min: 0.0, max: 2.0, default: 1.0 },
    { id: 'u_wax_color', name: 'Wax', type: 'color', default: [1.0, 0.45, 0.08, 1.0] },
    { id: 'u_fluid_color', name: 'Liquid', type: 'color', default: [0.25, 0.05, 0.45, 1.0] }
  ]
};
