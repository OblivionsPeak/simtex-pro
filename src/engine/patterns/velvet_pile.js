export default {
  id: 'velvet_pile',
  name: 'Velvet Pile',
  category: 'Industrial',
  description: 'Velvet fabric with directional pile sheen — bright along the pile, dark against it, with a dramatic direction effect.',
  shader: `
    // Hash noise for micro-fibre variation
    float hash21(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    float smoothNoise(vec2 uv) {
      vec2 i = floor(uv);
      vec2 f = fract(uv);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash21(i);
      float b = hash21(i + vec2(1.0, 0.0));
      float c = hash21(i + vec2(0.0, 1.0));
      float d = hash21(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    vec4 generate() {
      vec3  baseCol  = u_base_color.rgb;
      float pileAngle = u_pile_direction;
      float sheen    = u_sheen;

      // Pile direction vector (unit vector in direction of pile lay)
      vec2 pileDir = vec2(cos(pileAngle), sin(pileAngle));

      // UV centred
      vec2 uv = v_uv - 0.5;

      // "View direction" approximation: simulate looking straight down at the fabric
      // The effective highlight depends on the angle between the pile direction
      // and the gradient of UV — simulating a raking light from upper-left
      vec2 lightDir = normalize(vec2(0.6, 0.8));

      // Pile orientation factor: how much the pile faces the light
      float pileDot = dot(pileDir, lightDir);

      // Micro-variation in pile direction (velvet is never perfectly uniform)
      float microNoise = smoothNoise(v_uv * 28.0) * 2.0 - 1.0;
      float microNoise2 = smoothNoise(v_uv * 7.0) * 2.0 - 1.0;

      // Local pile angle variation
      float localAngle = pileAngle + microNoise * 0.25 + microNoise2 * 0.08;
      vec2 localPile   = vec2(cos(localAngle), sin(localAngle));
      float localDot   = dot(localPile, lightDir);

      // Sheen factor: cos^n of angle between pile and view
      // Bright when pile faces light, dark when it faces away
      float sheenFactor = localDot * 0.5 + 0.5;   // [0,1]
      sheenFactor = pow(sheenFactor, 1.0 / max(sheen, 0.01));

      // Velvet characteristic: bright saturation in highlight direction
      // dark with increased saturation in shadow direction
      float bright = sheenFactor;
      float dark   = 1.0 - sheenFactor;

      // Luminance-preserving colour shift
      vec3 lightened = mix(baseCol, baseCol + (1.0 - baseCol) * 0.6, bright * sheen * 0.5);
      vec3 darkened  = baseCol * (0.22 + 0.78 * (1.0 - dark * sheen * 0.6));

      vec3 col = mix(darkened, lightened, sheenFactor);

      // Micro-fibre sparkle at highlight peak
      float sparkle = hash21(floor(v_uv * 140.0)) * pow(sheenFactor, 4.0) * sheen * 0.15;
      col += sparkle;

      // Fine micro-texture from pile tips
      float micro = smoothNoise(v_uv * 80.0) * 0.04 - 0.02;
      col += micro * sheenFactor;

      col = clamp(col, 0.0, 1.0);

      return vec4(col, 1.0) * u_opacity;
    }
  `,
  uniforms: [
    { name: 'u_base_color',     type: 'color', default: [0.35, 0.05, 0.08, 1.0], label: 'Velvet Colour' },
    { name: 'u_pile_direction', type: 'float', default: 0.785, min: 0.0, max: 6.28, label: 'Pile Direction (rad)' },
    { name: 'u_sheen',          type: 'float', default: 1.2,   min: 0.3, max: 2.0,  label: 'Sheen Intensity' }
  ]
};
