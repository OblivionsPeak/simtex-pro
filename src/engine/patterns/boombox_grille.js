export default {
  id: 'boombox_grille',
  name: 'Boombox Grille',
  category: 'Retro',
  added: '2026-06-11',
  description: 'Ghetto-blaster speaker grille — staggered punched perforations in brushed gunmetal, the paper cone and dust cap glimpsed dimly through every hole.',
  shader: `
    // the speaker cone seen through the holes, in whole-sheet coordinates
    vec3 cone_bg(vec2 uv) {
      vec2 c = uv - 0.5;
      float rc = length(c) * 2.0;
      // paper cone: radial weave shading toward the dust cap
      vec3 cone = mix(vec3(0.07, 0.06, 0.055), vec3(0.16, 0.14, 0.12), smoothstep(1.0, 0.25, rc));
      cone *= 0.85 + 0.15 * sin(atan(c.y, c.x) * 60.0) * smoothstep(0.25, 0.5, rc);
      // dust cap: domed highlight
      float cap = 1.0 - smoothstep(0.20, 0.26, rc);
      vec3 capc = vec3(0.05) + vec3(0.12) * exp(-pow((rc - 0.10) * 9.0, 2.0));
      cone = mix(cone, capc, cap);
      // rubber surround ring near the rim
      cone = mix(cone, vec3(0.03), smoothstep(0.86, 0.92, rc) * smoothstep(1.04, 0.98, rc));
      return cone;
    }

    vec4 generate() {
      // --- staggered perforation lattice ---
      vec2 p = v_uv * u_hole_density;
      float row = floor(p.y);
      p.x += mod(row, 2.0) * 0.5;
      vec2 cellf = fract(p) - 0.5;
      float d = length(cellf);
      float hr = u_hole_size * 0.42;

      // --- brushed metal face ---
      vec3 metal = u_metal_color.rgb;
      float brush = noise(vec2(v_uv.x * 7.0, v_uv.y * 900.0));
      metal *= 0.82 + brush * 0.34;
      // broad diagonal showroom glare
      float glare = exp(-pow((v_uv.x + v_uv.y - 1.05) * 2.6, 2.0));
      metal += vec3(0.10, 0.10, 0.11) * glare;
      // fingerprint smudges
      metal *= 1.0 - smoothstep(0.55, 0.95, fbm(v_uv * 5.0) * 0.5 + 0.5) * 0.10;

      vec3 col = metal;

      // --- holes: countersunk, dark interior showing the cone ---
      float hole = 1.0 - smoothstep(hr, hr + 0.045, d);
      vec3 through = cone_bg(v_uv) * 0.85;
      // interior shadow biased to the top of each hole (light from above)
      through *= 0.55 + 0.45 * smoothstep(0.5, -0.5, cellf.y / max(hr, 0.001));
      col = mix(col, through, hole);

      // punched rim: bright lower-right lip, dark upper-left cut
      float rim = smoothstep(hr + 0.10, hr + 0.02, d) - hole;
      float lip = dot(normalize(cellf + 0.0001), vec2(0.6, -0.8));
      col += vec3(0.16) * rim * max(lip, 0.0) * 1.4;
      col -= vec3(0.10) * rim * max(-lip, 0.0);

      // occasional dead-sharp specular glint between holes
      vec2 gcell = floor(p);
      if (hash(gcell + 41.3) > 0.93) {
        float gd = length(fract(p) - vec2(0.18, 0.80));
        col += vec3(0.5, 0.5, 0.55) * exp(-gd * gd * 320.0) * glare * 2.0;
      }

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_hole_density', name: 'Perforation Pitch', type: 'float', min: 10.0, max: 60.0, default: 26.0 },
    { id: 'u_hole_size', name: 'Hole Size', type: 'float', min: 0.3, max: 1.0, default: 0.65 },
    { id: 'u_metal_color', name: 'Grille Metal', type: 'color', default: [0.16, 0.17, 0.19, 1.0] }
  ]
};
