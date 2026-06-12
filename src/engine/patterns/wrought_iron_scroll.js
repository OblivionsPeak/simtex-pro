export default {
  id: 'wrought_iron_scroll',
  name: 'Wrought Iron Scroll',
  category: 'Architecture',
  added: '2026-06-12',
  description: 'Forged scrollwork lattice — C-scrolls curling between straight bars, hammered collar bands clamping the joints, black-lead finish with worn edge highlights and rust creeping out of the seams.',
  shader: `
    float hash_wis(vec2 p) {
      return fract(sin(dot(p, vec2(173.7, 313.1))) * 40961.7193);
    }

    // distance to a circular arc of radius rad centred at c, spanning
    // angles [a0, a1] (radians) — used to build the scroll curls
    float arc_wis(vec2 p, vec2 c, float rad, float a0, float a1) {
      vec2 d = p - c;
      float ang = atan(d.y, d.x);
      // wrap angle into the arc span
      float mid = (a0 + a1) * 0.5;
      float half_span = (a1 - a0) * 0.5;
      float off = ang - mid;
      off = mod(off + 3.14159265, 6.2831853) - 3.14159265;
      float inArc = step(abs(off), half_span);
      float dRing = abs(length(d) - rad);
      // off the arc span, measure to the arc end points
      vec2 e0 = c + rad * vec2(cos(a0), sin(a0));
      vec2 e1 = c + rad * vec2(cos(a1), sin(a1));
      float dEnds = min(length(p - e0), length(p - e1));
      return mix(dEnds, dRing, inArc);
    }

    vec4 generate() {
      float n = floor(u_cells + 0.5);
      vec2 uv = v_uv * n;
      vec2 cell = mod(floor(uv), n);
      vec2 f = fract(uv);
      vec2 p = f - 0.5;

      float PI = 3.14159265;
      float bar = u_bar_width;

      // --- straight frame bars on the cell borders ---
      float edge = min(min(f.x, 1.0 - f.x), min(f.y, 1.0 - f.y));
      float dFrame = edge; // distance to nearest border

      // --- C-scrolls: two opposed curls per cell, mirrored on a checker ---
      vec2 q = p;
      if (mod(cell.x + cell.y, 2.0) > 0.5) q.x = -q.x;   // alternate handedness

      // big curl sweeping from the left bar into the centre
      float d1 = arc_wis(q, vec2(-0.18, 0.10), 0.27, -PI * 0.85, PI * 0.45);
      // its inner volute tightening near the middle
      float d2 = arc_wis(q, vec2(0.02, 0.04), 0.10, -PI * 0.6, PI * 0.9);
      // opposing curl from the bottom bar
      float d3 = arc_wis(q, vec2(0.16, -0.16), 0.22, PI * 0.25, PI * 1.45);
      float d4 = arc_wis(q, vec2(0.10, -0.02), 0.075, -PI * 0.2, PI * 1.2);

      float dScroll = min(min(d1, d2), min(d3, d4));
      float dIron = min(dScroll, dFrame);

      float metal = smoothstep(bar, bar * 0.55, dIron);

      // --- collar bands where scroll ends meet the bars ---
      vec2 j1 = q - vec2(-0.18 - 0.27, 0.10);  // scroll 1 root on the left bar
      vec2 j2 = q - vec2(0.16, -0.16 - 0.22);  // scroll 3 root on the bottom bar
      float collar = smoothstep(bar * 1.9, bar * 1.4, length(j1) )
                   + smoothstep(bar * 1.9, bar * 1.4, length(j2));
      collar = clamp(collar, 0.0, 1.0) * metal;

      // --- ironwork shading ---
      // round bar profile: bright spine along the centre of each member
      float spine = smoothstep(bar * 0.55, 0.0, dIron);
      float hammer = noise(uv * 28.0 + cell * 9.1);     // hammer-mark mottle

      vec3 iron = u_iron_color.rgb;
      vec3 col = iron * (0.55 + spine * 0.5);
      col *= 0.88 + hammer * 0.22;

      // worn black-lead: edge highlights where hands and weather polish it
      float polish = smoothstep(bar * 0.40, bar * 0.10, dIron) * (0.4 + hammer * 0.6);
      col += vec3(0.50, 0.52, 0.56) * polish * 0.35;

      // collars stand proud and catch more light
      col = mix(col, iron * 1.5 + vec3(0.10), collar * 0.6);
      // crease shadow where the collar clamps the bar
      float collarEdge = collar * smoothstep(bar * 0.5, bar * 0.2, abs(dIron - bar * 0.35));
      col *= 1.0 - collarEdge * 0.25;

      // rust blooming from joints and the underside of curls
      float rustN = fbm(uv * 6.0 + 41.0) * 0.5 + 0.5;
      float rust = smoothstep(0.62, 0.85, rustN + collar * 0.15) * u_rust;
      col = mix(col, vec3(0.45, 0.23, 0.12) * (0.7 + hammer * 0.5), rust * metal * 0.8);

      // --- background: whatever the gate is mounted over, kept neutral ---
      vec3 back = vec3(0.84, 0.83, 0.80);
      back *= 0.94 + noise(uv * 40.0) * 0.10;
      // soft drop shadow the ironwork casts behind itself
      float shadow = smoothstep(bar * 2.6, bar * 0.9, dIron) * (1.0 - metal);
      back *= 1.0 - shadow * 0.30;

      vec3 outCol = mix(back, col, metal);
      return vec4(outCol, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_cells',      name: 'Lattice Cells', type: 'float', min: 1.0,  max: 8.0,   default: 3.0 },
    { id: 'u_bar_width',  name: 'Bar Weight',    type: 'float', min: 0.015, max: 0.06, default: 0.030 },
    { id: 'u_rust',       name: 'Rust',          type: 'float', min: 0.0,  max: 1.0,   default: 0.35 },
    { id: 'u_iron_color', name: 'Iron',          type: 'color', default: [0.13, 0.13, 0.15, 1.0] }
  ]
};
