export default {
  id: 'lemans_twin_stripes',
  name: 'Le Mans Twin Stripes',
  category: 'Heritage',
  added: '2026-06-12',
  description: 'Twin centre racing stripes running nose to tail — stitch-edge detail along each border, masked-paint ridge, and a body colour worn satin by seasons of polishing.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;

      // --- palette: GT silver-blue body, oxford white stripes, navy keys ---
      vec3 body   = u_body_color.rgb;
      vec3 stripe = u_stripe_color.rgb;
      vec3 keynav = stripe * 0.22 + vec3(0.02, 0.04, 0.12);   // dark keyline
      vec3 stitch = mix(stripe, vec3(0.0), 0.55);             // stitch dashes

      float sw  = u_stripe_width * 0.5;     // single-stripe half width
      float gap = u_stripe_gap * 0.5;       // half of the gap between stripes
      float aa  = 0.003;

      // body: satin metallic with long polishing strokes
      vec3 col = body;
      col *= 0.965 + noise(uv * 520.0) * 0.055;
      col *= 0.99 + 0.018 * noise(vec2(uv.x * 4.0, uv.y * 120.0));
      // panel sheen rolling across the body
      col += smoothstep(0.5, 0.0, abs(uv.x - 0.82)) * 0.03;

      // whisper of masking-tape texture — stripes must still read dead straight
      float wob = (noise(vec2(uv.y * 11.0, 3.7)) - 0.5) * 0.0008;

      // fold to one stripe: distance from centreline, then from stripe centre
      float dx = abs(uv.x - 0.5 + wob);
      float d  = abs(dx - (gap + sw)) - sw;       // signed: inside stripe < 0

      // soft shadow where the stripe paint ridge stands proud
      col *= 1.0 - smoothstep(0.012, 0.0, abs(d)) * step(0.0, d) * 0.10;

      // --- stripe fill ---
      float in_s = smoothstep(aa, -aa, d);
      vec3 s_col = stripe;
      s_col *= 0.975 + noise(uv * 300.0) * 0.04;                     // paint texture
      s_col *= 0.99 + 0.02 * noise(vec2(uv.x * 90.0, uv.y * 5.0));   // roller striae
      // stone-chip wear concentrated toward the leading (bottom) edge
      float chip = step(0.972, hash(floor(uv * 220.0))) * smoothstep(0.45, 0.0, uv.y);
      s_col = mix(s_col, body * 0.9, chip * 0.85);
      col = mix(col, s_col, in_s);

      // --- navy keyline hugging each stripe edge ---
      float key = smoothstep(aa * 1.5, 0.0, abs(abs(d) - 0.008) - 0.0028);
      col = mix(col, keynav, key * 0.95);

      // --- stitch-edge detail: dashed saddle stitching just inside each border ---
      float edge_in = abs(d + 0.018) - 0.0022;          // thin track inside the stripe
      float dash = step(0.5, fract(uv.y * 60.0));        // dash rhythm
      float st = smoothstep(aa, -aa, edge_in) * dash;
      // each dash leans slightly — hand-stitched, not machine
      float lean = step(0.5, fract(uv.y * 60.0 + dx * 18.0));
      col = mix(col, stitch, st * (0.55 + 0.35 * lean) * in_s);
      // thread highlight catching the light on top of each dash
      col += st * (1.0 - dash * 0.0) * step(fract(uv.y * 60.0), 0.58) * in_s * 0.05;

      // gap between the stripes collects a whisper of grime
      float in_gap = smoothstep(aa, -aa, dx - gap);
      col *= 1.0 - in_gap * (fbm(uv * 8.0) * 0.5 + 0.5) * 0.05;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_stripe_width', name: 'Stripe Width', type: 'float', min: 0.04, max: 0.22, default: 0.13 },
    { id: 'u_stripe_gap', name: 'Centre Gap', type: 'float', min: 0.01, max: 0.12, default: 0.045 },
    { id: 'u_body_color', name: 'Body Colour', type: 'color', default: [0.42, 0.51, 0.62, 1.0] },
    { id: 'u_stripe_color', name: 'Stripe Colour', type: 'color', default: [0.95, 0.94, 0.90, 1.0] }
  ]
};
