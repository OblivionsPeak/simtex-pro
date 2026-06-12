export default {
  id: 'fire_opal',
  name: 'Fire Opal',
  category: 'Geology',
  added: '2026-06-12',
  description: 'Milky opal body with play-of-color — irregular patches flashing saturated spectral hues out of a warm translucent matrix.',
  shader: `
    vec2 hash2_fop(vec2 p) {
      return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
    }

    // Voronoi: returns (F1, F2, cellHash)
    vec3 voro_fop(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float f1 = 8.0;
      float f2 = 8.0;
      float id = 0.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 g = vec2(float(x), float(y));
          vec2 o = hash2_fop(i + g);
          float d = length(g + o - f);
          if (d < f1) { f2 = f1; f1 = d; id = fract(o.x * 41.7 + o.y * 13.3); }
          else if (d < f2) { f2 = d; }
        }
      }
      return vec3(f1, f2, id);
    }

    vec3 spectral_fop(float h) {
      return 0.5 + 0.5 * cos(6.28318 * (h + vec3(0.0, 0.33, 0.67)));
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Milky translucent body: layered fbm cloudiness
      float cloud = fbm(uv * 4.0) * 0.5 + 0.5;
      float depth = fbm(uv * 9.0 + 31.0) * 0.5 + 0.5;
      vec3 body = u_body_color.rgb;
      vec3 col = body * (0.82 + cloud * 0.28);
      col = mix(col, body * vec3(1.06, 0.96, 0.85), depth * 0.35);

      // Play-of-color patches: warped voronoi domains, each with its own hue
      vec2 warped = uv + vec2(snoise(uv * 3.0), snoise(uv * 3.0 + 17.0)) * 0.08;
      vec3 v = voro_fop(warped * u_patch_scale);

      // Only some cells fire — gate on cell hash
      float gate = step(1.0 - u_fire_coverage, fract(v.z * 7.13));

      // Patch mask: solid in the cell interior, fading at cell borders
      float edge = v.y - v.x;
      float patch = smoothstep(0.02, 0.16, edge) * gate;

      // Spectral hue per cell, with sub-cell hue drift for shimmer
      float hue = v.z + snoise(uv * u_patch_scale * 3.5) * 0.07;
      vec3 fire = spectral_fop(hue);

      // Flash intensity varies per cell and is brightest mid-patch
      float flash = patch * (0.55 + 0.45 * fract(v.z * 3.91));
      col = mix(col, fire, flash * u_fire_intensity * 0.85);
      // Hot saturated core
      col += fire * pow(patch, 3.0) * u_fire_intensity * 0.3;

      // Fine internal diffraction striations inside firing patches
      float stria = sin(dot(uv, vec2(140.0, 90.0)) + v.z * 40.0) * 0.5 + 0.5;
      col += fire * stria * flash * u_fire_intensity * 0.12;

      // Glassy cabochon sheen
      float gloss = pow(clamp(1.0 - length(uv - vec2(0.35, 0.65)) * 1.5, 0.0, 1.0), 3.0);
      col += gloss * 0.10;

      col += (hash(uv * 650.0) - 0.5) * 0.015;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_patch_scale',    name: 'Patch Scale',    type: 'float', min: 2.0, max: 20.0, default: 7.0 },
    { id: 'u_fire_intensity', name: 'Fire Intensity', type: 'float', min: 0.0, max: 1.5,  default: 0.9 },
    { id: 'u_fire_coverage',  name: 'Fire Coverage',  type: 'float', min: 0.1, max: 1.0,  default: 0.55 },
    { id: 'u_body_color',     name: 'Body Color',     type: 'color', default: [0.96, 0.78, 0.62, 1.0] }
  ]
};
