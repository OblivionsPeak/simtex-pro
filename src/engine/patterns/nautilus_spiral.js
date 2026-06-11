export default {
  id: 'nautilus_spiral',
  name: 'Nautilus Spiral',
  category: 'Ocean',
  added: '2026-06-11',
  description: 'A chambered nautilus in cross-section — logarithmic spiral whorls, curved septa walls and flame-striped cream shell.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv - 0.5;
      float r = max(length(uv) * 2.0, 0.001);
      float ang = atan(uv.y, uv.x);

      vec3 shell  = u_shell_color.rgb;
      vec3 stripe = u_stripe_color.rgb;

      // --- logarithmic spiral coordinate ---
      // s increases by 1 every whorl outward; fract(s) = position across the whorl
      float b = u_tightness;                       // growth rate per turn
      float s = log(r) / b - ang / 6.28318;
      float whorl = floor(s);
      float wf = fract(s);

      // --- base shell: cream with subtle radial sheen ---
      float sheen = fbm(uv * 5.0) * 0.5 + 0.5;
      vec3 col = shell * (0.88 + 0.18 * sheen);
      col += (noise(v_uv * 240.0) - 0.5) * 0.035;  // porcelain grain

      // --- whorl wall: dark spiral seam between successive turns ---
      float wall = smoothstep(0.06, 0.0, min(wf, 1.0 - wf));
      col = mix(col, shell * 0.45, wall * 0.85);
      // shading across each whorl tube: rounded, lit toward the outer side
      float tube = sin(wf * 3.14159);
      col *= 0.80 + 0.28 * tube;

      // --- septa: curved chamber walls subdividing each whorl ---
      // chamber index advances along the spiral arc
      float arc = (ang / 6.28318 + s) * u_chambers; // marches around the coil
      float ch = fract(arc);
      float septa = smoothstep(0.05, 0.0, min(ch, 1.0 - ch));
      // septa fade out across the outermost (living) chamber
      float living = smoothstep(0.0, -1.0, s + 1.0);
      col = mix(col, shell * 0.50, septa * 0.7 * (1.0 - living));
      // nacre gleam inside each chamber: brightest just past each septum
      float nacre = smoothstep(0.05, 0.35, ch) * smoothstep(0.95, 0.55, ch);
      col += vec3(0.10, 0.09, 0.07) * nacre * tube * 0.6;
      // iridescent cast in the inner chambers
      vec3 irid = vec3(0.5 + 0.5 * sin(arc * 2.0),
                       0.5 + 0.5 * sin(arc * 2.0 + 2.1),
                       0.5 + 0.5 * sin(arc * 2.0 + 4.2));
      col = mix(col, col * (0.85 + irid * 0.25), smoothstep(0.6, 0.0, r) * 0.5);

      // --- flame stripes: red-brown bands sweeping over the outer shell ---
      // stripes follow radial-ish lines, irregular width via noise
      float fl = sin(ang * 14.0 + snoise(vec2(ang * 2.0, s * 1.5)) * 1.5);
      float flame = smoothstep(0.15, 0.55, fl);
      // stripes belong to the outer whorls only, fading toward the apex
      float outer = smoothstep(0.25, 0.65, r);
      // and they break up across each whorl (tiger striping)
      flame *= 0.65 + 0.35 * snoise(vec2(s * 4.0, ang * 3.0));
      col = mix(col, stripe, clamp(flame, 0.0, 1.0) * outer * 0.85);
      // stripe edges darken slightly for printed depth
      float fl_edge = smoothstep(0.10, 0.18, fl) - smoothstep(0.18, 0.30, fl);
      col = mix(col, stripe * 0.6, clamp(fl_edge, 0.0, 1.0) * outer * 0.5);

      // --- apex: tight dark coil centre ---
      col = mix(col, shell * 0.40, smoothstep(0.06, 0.0, r));

      // gentle top-light across the whole shell
      col *= 0.92 + 0.12 * (1.0 - v_uv.y);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_tightness',    name: 'Spiral Tightness', type: 'float', min: 0.15, max: 0.8, default: 0.35 },
    { id: 'u_chambers',     name: 'Chamber Count',    type: 'float', min: 4.0,  max: 20.0, default: 11.0 },
    { id: 'u_shell_color',  name: 'Shell Color',      type: 'color', default: [0.93, 0.88, 0.78, 1.0] },
    { id: 'u_stripe_color', name: 'Stripe Color',     type: 'color', default: [0.55, 0.22, 0.10, 1.0] }
  ]
};
