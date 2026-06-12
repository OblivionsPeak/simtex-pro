export default {
  id: 'column_fluting',
  name: 'Column Fluting',
  category: 'Architecture',
  added: '2026-06-12',
  description: 'Classical fluted column surface — concave half-round flutes between sharp fillets, raking light shading each groove, drum joints crossing horizontally and centuries of soot settled in the hollows.',
  shader: `
    float hash_cfl(vec2 p) {
      return fract(sin(dot(p, vec2(197.3, 331.7))) * 37199.1731);
    }

    vec4 generate() {
      float flutes = floor(u_flutes + 0.5);
      vec2 uv = v_uv;

      float fx = uv.x * flutes;
      float flute = floor(fx);
      float t = fract(fx);                 // 0..1 across one flute + fillet

      float filletW = 0.14;                // flat fillet ridge between grooves
      float grooveT = clamp((t - filletW * 0.5) / (1.0 - filletW), 0.0, 1.0);

      // concave half-round: depth profile across the groove
      float depth = sin(grooveT * 3.14159265);          // 0 at edges, 1 deepest
      float onFillet = 1.0 - smoothstep(0.0, filletW * 0.5, min(t, 1.0 - t));

      // surface normal x-component of the concave cut (for raking light)
      float slope = cos(grooveT * 3.14159265);          // +1 left wall, -1 right
      // light rakes from the left: left walls fall to shadow, right walls catch it
      float lit = clamp(0.55 - slope * 0.45, 0.0, 1.0);

      // --- stone base ---
      vec3 stone = u_stone_color.rgb;

      // bedding planes and crystalline mottle in the stone
      float mottle = fbm(uv * vec2(7.0, 5.0)) * 0.5 + 0.5;
      stone *= 0.90 + mottle * 0.16;
      stone *= 0.97 + noise(uv * 160.0) * 0.06;         // tooling-fine grain
      // faint warm veining drifting through the marble
      float vein = smoothstep(0.04, 0.0, abs(snoise(uv * vec2(2.0, 6.0)) * 0.5));
      stone = mix(stone, stone * vec3(0.92, 0.88, 0.82), vein * 0.35);

      vec3 col = stone;

      // groove shading: ambient occlusion in the hollow + raking light on walls
      col *= 1.0 - depth * 0.34;                        // deeper = darker
      col *= 0.72 + lit * 0.42;                         // wall lighting
      // crisp highlight along the arris where fillet meets groove
      float arris = smoothstep(0.06, 0.0, abs(t - filletW * 0.5))
                  + smoothstep(0.06, 0.0, abs(t - (1.0 - filletW * 0.5)));
      col += stone * arris * 0.30;
      // fillets are flat and fully lit
      col = mix(col, stone * 1.10, onFillet * 0.8);

      // --- drum joints: horizontal seams of the stacked column drums ---
      float drums = 3.0;
      float dy = fract(uv.y * drums);
      float joint = min(dy, 1.0 - dy);
      float jl = smoothstep(0.014, 0.004, joint);
      col *= 1.0 - jl * 0.45;
      // slight tonal step between drums — different quarry blocks
      float drumId = floor(uv.y * drums);
      col *= 0.97 + hash_cfl(vec2(mod(drumId, drums), 1.0)) * 0.06;
      // weather staining hanging below each joint
      float under = smoothstep(0.10, 0.0, dy) * step(0.02, dy);
      col *= 1.0 - under * 0.10 * u_age;

      // --- age: soot and grime pooled in the flutes, edges rubbed pale ---
      float soot = depth * (0.5 + mottle * 0.5) * u_age;
      col = mix(col, col * vec3(0.55, 0.54, 0.52), soot * 0.5);
      col = mix(col, stone * 1.18, onFillet * smoothstep(0.4, 0.9, mottle) * u_age * 0.25);

      // chips along the arrises where the sharp stone has spalled
      float chipSeed = hash_cfl(vec2(flute, floor(uv.y * 24.0)));
      float chip = step(0.95, chipSeed) * arris;
      col = mix(col, stone * 0.78, chip * 0.7);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_flutes',      name: 'Flutes', type: 'float', min: 4.0, max: 24.0, default: 10.0 },
    { id: 'u_age',         name: 'Age',    type: 'float', min: 0.0, max: 1.0,  default: 0.5 },
    { id: 'u_stone_color', name: 'Stone',  type: 'color', default: [0.82, 0.79, 0.72, 1.0] }
  ]
};
