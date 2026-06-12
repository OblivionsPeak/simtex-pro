export default {
  id: 'lightning_bolt_retro',
  name: 'Retro Lightning Bolt',
  category: 'Heritage',
  added: '2026-06-12',
  description: 'Fifties chrome-age lightning bolts repeating across candy paint — zigzag spears with chrome gradient fill, dark keyline shadow offset, and starburst glints.',
  shader: `
    // signed distance to a stylised three-kink lightning bolt, length ~1.2 tall
    float bolt_hrt16(vec2 p) {
      // bolt path: three line segments zig-zagging downward
      // segment helper inline: distance to segment ab with half-width tapering
      vec2 a0 = vec2(-0.10,  0.60); vec2 b0 = vec2( 0.12,  0.12);
      vec2 a1 = vec2(-0.14,  0.16); vec2 b1 = vec2( 0.10, -0.28);
      vec2 a2 = vec2(-0.06, -0.24); vec2 b2 = vec2( 0.10, -0.62);

      float d = 1.0e3;
      for (int i = 0; i < 3; i++) {
        vec2 a = (i == 0) ? a0 : (i == 1) ? a1 : a2;
        vec2 b = (i == 0) ? b0 : (i == 1) ? b1 : b2;
        vec2 pa = p - a; vec2 ba = b - a;
        float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
        // spear taper: fat at the top of each stroke, narrow at its tip
        float w = mix(0.085, 0.020, h) * mix(1.0, 0.55, float(i) * 0.5);
        d = min(d, length(pa - ba * h) - w);
      }
      return d;
    }

    vec4 generate() {
      // staggered repeat of bolts
      vec2 guv = v_uv * u_bolt_scale;
      float colm = floor(guv.x);
      guv.y += mod(colm, 2.0) * 0.5;
      vec2 cell = floor(guv);
      vec2 f = fract(guv) - 0.5;

      // --- palette: candy teal body, chrome bolt, ink keyline ---
      vec3 candy  = u_body_color.rgb;
      vec3 chr_hi = vec3(0.96, 0.97, 1.00);            // chrome sky reflection
      vec3 chr_md = u_chrome_color.rgb;                // chrome midtone
      vec3 chr_lo = vec3(0.25, 0.22, 0.28);            // chrome ground reflection
      vec3 keyl   = vec3(0.07, 0.06, 0.10);

      // candy paint: deep flake sparkle + soft panel glow
      vec3 col = candy;
      float flake = step(0.93, hash(floor(v_uv * 700.0)));
      col += flake * 0.10;
      col *= 0.96 + noise(v_uv * 460.0) * 0.05;
      col += smoothstep(0.8, 0.0, length(v_uv - vec2(0.5, 0.6))) * 0.05;

      // per-bolt lean: each bolt tips a few degrees differently
      float lean = (hash(cell + 5.0) - 0.5) * 0.35;
      vec2 p = mat2(cos(lean), sin(lean), -sin(lean), cos(lean)) * f * 1.15;

      float d = bolt_hrt16(p);
      float aa = 0.014;

      // --- ink keyline shadow: the bolt's offset dark twin (50s sign trick) ---
      float ds = bolt_hrt16(p - vec2(-0.035, -0.030));
      float in_sh = smoothstep(aa, -aa, ds);
      col = mix(col, keyl, in_sh * 0.85);

      // --- chrome bolt fill ---
      float in_b = smoothstep(aa, -aa, d);
      // chrome gradient: horizon band across the bolt (sky above, ground below)
      float horizon = p.y * 2.2 + 0.1 + (noise(cell + p * 3.0) - 0.5) * 0.15;
      vec3 b_col = mix(chr_lo, chr_md, smoothstep(-0.55, -0.02, horizon));
      b_col = mix(b_col, chr_hi, smoothstep(0.02, 0.45, horizon));
      // hard horizon line, the signature of sign-painted chrome
      b_col = mix(b_col, chr_lo * 0.8, smoothstep(0.025, 0.0, abs(horizon)) * 0.7);
      // vertical streaks in the chrome
      b_col *= 0.96 + 0.07 * noise(vec2(p.x * 60.0, p.y * 4.0) + cell);
      col = mix(col, b_col, in_b);

      // keyline ringing the bolt itself
      float ring = smoothstep(aa, 0.0, abs(d - 0.018) - 0.007);
      col = mix(col, keyl, ring * (1.0 - in_b) * 0.9);

      // --- starburst glint at the bolt's top tip ---
      vec2 tip = p - vec2(-0.10, 0.60);
      float cross = max(
        smoothstep(0.020, 0.0, abs(tip.x)) * smoothstep(0.16, 0.0, abs(tip.y)),
        smoothstep(0.020, 0.0, abs(tip.y)) * smoothstep(0.16, 0.0, abs(tip.x)));
      col += cross * u_glint * vec3(1.0, 1.0, 0.95);
      float spark = smoothstep(0.05, 0.0, length(tip));
      col += spark * u_glint * 0.8;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_bolt_scale', name: 'Bolts Per Tile', type: 'float', min: 1.0, max: 6.0, default: 3.0 },
    { id: 'u_glint', name: 'Glint Strength', type: 'float', min: 0.0, max: 1.0, default: 0.55 },
    { id: 'u_body_color', name: 'Candy Colour', type: 'color', default: [0.05, 0.28, 0.32, 1.0] },
    { id: 'u_chrome_color', name: 'Chrome Tint', type: 'color', default: [0.62, 0.66, 0.74, 1.0] }
  ]
};
