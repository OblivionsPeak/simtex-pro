export default {
  id: 'octopus_suckers',
  name: 'Octopus Suckers',
  category: 'Ocean',
  added: '2026-06-11',
  description: 'Underside of octopus arms — staggered double rows of fleshy suction cups with raised rims and deep cup centers on mottled mauve skin.',
  shader: `
    // One sucker: returns vec2(mask, height 0..1) for shading
    vec2 sucker_ocs(vec2 p, float radius) {
      float d = length(p) / radius;
      float mask = smoothstep(1.0, 0.92, d);
      // height profile: raised outer rim, dished cup, deep centre hole
      float rim = exp(-pow((d - 0.78) * 5.5, 2.0));          // rim torus
      float cup = smoothstep(0.78, 0.30, d) * 0.45;          // dished interior
      float hole = smoothstep(0.22, 0.05, d);                // dark orifice
      float h = rim + cup - hole * 0.9;
      return vec2(mask, clamp(h * 0.5 + 0.4, 0.0, 1.0));
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- arm skin base: mottled mauve-red ---
      vec3 skin = u_skin_color.rgb;
      float mott = fbm(uv * 8.0) * 0.5 + 0.5;
      vec3 col = mix(skin * 0.72, skin * 1.10, mott);
      col += (noise(uv * 200.0) - 0.5) * 0.05;   // skin micro-grain

      // arms run vertically; shade each arm cylinder across its width
      float arms = u_arms;
      float ax = fract(uv.x * arms);
      float arm_shade = sin(ax * 3.14159);
      col *= 0.70 + 0.40 * arm_shade;
      // dark crease between arms
      col *= 1.0 - smoothstep(0.10, 0.0, min(ax, 1.0 - ax)) * 0.45;

      // --- suckers: two staggered rows per arm ---
      float rows = u_row_density;
      float best_m = 0.0;
      float best_h = 0.5;
      for (int s = 0; s < 2; s++) {
        float side = float(s) * 2.0 - 1.0;                  // -1 left, +1 right
        float yoff = float(s) * 0.5;                        // stagger the rows
        float ry = uv.y * rows + yoff;
        float row_id = floor(ry);
        float fy = fract(ry) - 0.5;
        // sucker centre offset from arm midline; size varies per sucker
        float hsh = hash(vec2(floor(uv.x * arms), row_id + float(s) * 31.0));
        float cxo = 0.5 + side * (0.16 + 0.03 * hsh);
        // periodic size taper along the arm (suckers shrink, then repeat)
        float taper = 0.75 + 0.25 * sin(uv.y * 6.28318 + float(s));
        float radius = (0.13 + 0.04 * hsh) * taper;
        vec2 p = vec2((ax - cxo) , fy / rows * arms);       // arm-local coords
        p.y *= 1.0;
        vec2 sk = sucker_ocs(p, radius);
        if (sk.x > best_m) { best_m = sk.x; best_h = sk.y; }
      }

      // --- shade the sucker by its height profile ---
      vec3 cup_deep = skin * 0.30 + vec3(0.05, 0.0, 0.02);   // dark orifice
      vec3 cup_mid  = skin * 0.85 + vec3(0.08, 0.04, 0.05);  // dished interior
      vec3 rim_hi   = skin * 1.30 + vec3(0.16, 0.10, 0.12);  // lit rim flesh
      vec3 sucker_col = mix(cup_deep, cup_mid, smoothstep(0.0, 0.55, best_h));
      sucker_col = mix(sucker_col, rim_hi, smoothstep(0.55, 0.95, best_h));
      // wet specular ping on the rim crest
      sucker_col += vec3(0.35, 0.30, 0.32) * smoothstep(0.88, 1.0, best_h);
      // contact shadow around each sucker base
      float halo = best_m * (1.0 - smoothstep(0.0, 0.3, abs(best_h - 0.4)));
      col = mix(col, skin * 0.55, halo * 0.4);
      col = mix(col, sucker_col, best_m);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_arms',        name: 'Arm Count',   type: 'float', min: 1.0, max: 6.0,  default: 3.0 },
    { id: 'u_row_density', name: 'Sucker Rows', type: 'float', min: 4.0, max: 18.0, default: 9.0 },
    { id: 'u_skin_color',  name: 'Skin Color',  type: 'color', default: [0.55, 0.30, 0.34, 1.0] }
  ]
};
