export default {
  id: 'cinder_block',
  name: 'Cinder Block',
  category: 'Architecture',
  added: '2026-06-12',
  description: 'Standard CMU wall — 2:1 concrete masonry units in running bond, struck mortar joints in shadow, the hollow cores ghosting darker through each face and slag-speckled grey aggregate throughout.',
  shader: `
    float hash_cbk(vec2 p) {
      return fract(sin(dot(p, vec2(199.7, 263.3))) * 40417.8311);
    }

    vec4 generate() {
      float courses = floor(u_courses + 0.5);
      float cols = courses * 0.5;             // blocks are 2:1

      vec2 uv = v_uv * vec2(cols, courses);
      float course = floor(uv.y);
      uv.x += mod(course, 2.0) * 0.5;          // running bond
      vec2 block = vec2(mod(floor(uv.x), cols), mod(course, courses));
      vec2 f = fract(uv);

      float jointW = 0.045;
      vec2 d = min(f, 1.0 - f) * vec2(2.0, 1.0);
      float edge = min(d.x, d.y);
      float inBlock = smoothstep(jointW, jointW * 1.8, edge);

      // --- concrete face ---
      vec3 cem = u_block_color.rgb;
      float batch = hash_cbk(block);
      vec3 face = cem * (0.88 + batch * 0.20);

      // open-textured CMU surface: pitted, sandy, slag-speckled
      float pits = noise(uv * vec2(28.0, 56.0) + block * 7.0);
      face *= 0.84 + pits * 0.26;
      face *= 0.95 + hash_cbk(floor(uv * vec2(60.0, 120.0))) * 0.09;
      // dark slag flecks
      float slag = step(0.965, hash_cbk(floor(uv * vec2(45.0, 90.0)) + 17.0));
      face = mix(face, face * 0.45, slag * 0.8);
      // pale lime pops
      float pop = step(0.985, hash_cbk(floor(uv * vec2(40.0, 80.0)) + 29.0));
      face = mix(face, face * 1.5, pop * 0.7);

      // --- hollow-core shadows ghosting through the face ---
      // two cores per block: faint darker rectangles where the face shell
      // is unbacked, plus the centre web reading slightly lighter
      float coreL = smoothstep(0.07, 0.16, abs(f.x - 0.28)) ;
      float coreR = smoothstep(0.07, 0.16, abs(f.x - 0.72));
      float coreMask = (1.0 - coreL) + (1.0 - coreR);
      coreMask *= smoothstep(0.40, 0.28, abs(f.y - 0.5));
      face *= 1.0 - clamp(coreMask, 0.0, 1.0) * 0.10 * u_core_shadow;
      // webs (ends + centre) very slightly lighter where backed
      float web = smoothstep(0.06, 0.02, abs(f.x - 0.5))
                + smoothstep(0.06, 0.02, f.x) + smoothstep(0.06, 0.02, 1.0 - f.x);
      face *= 1.0 + clamp(web, 0.0, 1.0) * 0.045 * u_core_shadow;

      // broad curing blotch per block
      face *= 0.94 + (fbm(uv * 2.0 + block * 9.0) * 0.5 + 0.5) * 0.10;

      // --- mortar joints, struck concave ---
      vec3 mortar = cem * vec3(1.02, 1.00, 0.96) * 0.92;
      mortar *= 0.82 + noise(uv * 80.0) * 0.25;
      // concave strike: dark centre line, lit lips
      float strike = smoothstep(0.0, jointW, edge);
      mortar *= 0.52 + strike * 0.48;
      float lip = smoothstep(jointW * 0.9, jointW * 0.55, edge)
                * smoothstep(jointW * 0.25, jointW * 0.55, edge);
      mortar *= 1.0 + lip * 0.18;
      // hollow-core shadow leaks into the bed joints right above the cores
      float bedJoint = step(d.y, d.x);
      mortar *= 1.0 - bedJoint * clamp(coreMask, 0.0, 1.0) * 0.12 * u_core_shadow;

      vec3 col = mix(mortar, face, inBlock);

      // block face edge shadow onto the joint
      col *= 1.0 - (1.0 - inBlock) * smoothstep(jointW * 1.8, jointW, edge) * 0.16;

      // damp wicking up the bottom of each block from the bed joint
      float wick = smoothstep(0.18, 0.0, f.y) * inBlock;
      col *= 1.0 - wick * 0.10;

      // odd chipped corner showing brighter fresh aggregate
      float chip = step(0.94, hash_cbk(block + 37.0)) *
        smoothstep(0.10, 0.03, length(f - vec2(step(0.5, hash_cbk(block + 5.0)), 1.0)));
      col = mix(col, cem * 1.18, chip * 0.6);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_courses',     name: 'Courses',     type: 'float', min: 3.0, max: 14.0, default: 6.0 },
    { id: 'u_core_shadow', name: 'Core Shadow', type: 'float', min: 0.0, max: 1.0,  default: 0.7 },
    { id: 'u_block_color', name: 'Concrete',    type: 'color', default: [0.64, 0.63, 0.60, 1.0] }
  ]
};
