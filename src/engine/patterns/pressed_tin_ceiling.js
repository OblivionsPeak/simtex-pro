export default {
  id: 'pressed_tin_ceiling',
  name: 'Pressed Tin Ceiling',
  category: 'Architecture',
  added: '2026-06-12',
  description: 'Embossed tin ceiling panels — repeating petal rosettes inside beaded square frames, generations of paint pooling in the recesses and rubbing thin on the high relief.',
  shader: `
    float hash_ptc(vec2 p) {
      return fract(sin(dot(p, vec2(157.3, 269.1))) * 41927.6151);
    }

    // signed height of the embossing at a point inside one panel (0..1)
    float relief_ptc(vec2 f) {
      vec2 p = f - 0.5;
      float r = length(p);
      float ang = atan(p.y, p.x);

      // central boss
      float boss = smoothstep(0.10, 0.02, r) * 0.9;

      // petal ring: lobed radius via cosine of angle
      float petals = floor(u_petals + 0.5);
      float lobe = 0.24 + 0.055 * cos(ang * petals);
      float petalRing = smoothstep(0.05, 0.0, abs(r - lobe)) * 0.75;
      // petal fill, slightly lower than its rim
      float petalFill = smoothstep(lobe, lobe - 0.10, r) * smoothstep(0.10, 0.16, r) * 0.45;

      // outer ring
      float ring2 = smoothstep(0.030, 0.0, abs(r - 0.36)) * 0.6;

      // beaded square frame near the panel edge
      float edge = max(abs(p.x), abs(p.y));
      float frame = smoothstep(0.030, 0.0, abs(edge - 0.435)) * 0.7;
      // beads: dots running along the frame line
      float along = (abs(p.x) > abs(p.y)) ? p.y : p.x;
      float bead = smoothstep(0.022, 0.0, abs(edge - 0.435)) *
                   (0.5 + 0.5 * cos(along * 78.0)) * 0.45;

      // corner fleurettes
      vec2 q = abs(p) - vec2(0.40, 0.40);
      float corner = smoothstep(0.045, 0.0, length(q)) * 0.8;

      return max(max(max(boss, petalRing + petalFill), max(ring2, frame + bead)), corner);
    }

    vec4 generate() {
      float n = floor(u_panel_count + 0.5);
      vec2 uv = v_uv * n;
      vec2 cell = mod(floor(uv), n);
      vec2 f = fract(uv);

      float h  = relief_ptc(f);
      // finite-difference slope for fake top-left lighting
      float e = 0.012;
      float hx = relief_ptc(f + vec2(e, 0.0)) - relief_ptc(f - vec2(e, 0.0));
      float hy = relief_ptc(f + vec2(0.0, e)) - relief_ptc(f - vec2(0.0, e));
      float lit = clamp(0.5 - hx * 6.0 + hy * 6.0, 0.0, 1.0);

      vec3 paint = u_paint_color.rgb;

      // paint buildup: recesses collect thick cream paint and grime
      float crevice = smoothstep(0.55, 0.05, h);
      vec3 col = paint * mix(1.0, 0.78, crevice * u_grime);
      col = mix(col, paint * vec3(0.88, 0.84, 0.74), crevice * u_grime * 0.6); // yellowed pooled paint

      // embossing light and shade
      col *= 0.80 + h * 0.30;                  // raised relief reads brighter
      col *= 0.72 + lit * 0.55;                // directional shading off the slopes

      // paint rubbed thin on the highest relief — tin metal ghosting through
      float rub = smoothstep(0.78, 0.95, h) * u_grime;
      col = mix(col, vec3(0.56, 0.57, 0.60), rub * 0.55);

      // rust freckles bleeding through old paint, varied per panel
      float rustN = noise(uv * 7.0 + cell * 13.7);
      float rust = smoothstep(0.78, 0.92, rustN) * u_grime;
      col = mix(col, vec3(0.42, 0.22, 0.13), rust * 0.6);

      // brush-stroke texture in the flat fields
      col *= 0.97 + noise(v_uv * vec2(220.0, 60.0)) * 0.05 * (1.0 - h);

      // panel seam: thin dark gap where sheets butt together
      float seam = min(min(f.x, 1.0 - f.x), min(f.y, 1.0 - f.y));
      col *= mix(0.55, 1.0, smoothstep(0.0, 0.018, seam));

      // per-panel paint batch variation
      col *= 0.96 + hash_ptc(cell) * 0.07;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_panel_count', name: 'Panels',      type: 'float', min: 1.0, max: 8.0,  default: 3.0 },
    { id: 'u_petals',      name: 'Petals',      type: 'float', min: 5.0, max: 16.0, default: 8.0 },
    { id: 'u_grime',       name: 'Age & Grime', type: 'float', min: 0.0, max: 1.0,  default: 0.5 },
    { id: 'u_paint_color', name: 'Paint',       type: 'color', default: [0.91, 0.89, 0.83, 1.0] }
  ]
};
