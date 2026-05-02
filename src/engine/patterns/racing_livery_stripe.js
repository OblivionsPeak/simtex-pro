export default {
  id: 'racing_livery_stripe',
  name: 'Racing Livery Stripe',
  category: 'Racing',
  description: 'Dual-tone diagonal speed stripe with gradient fade and crisp edges — a classic motorsport livery element.',
  shader: `
    // Signed distance to an infinite angled stripe centred on the canvas
    float stripeSDist(vec2 uv, float angle) {
      // Direction perpendicular to stripe edge
      vec2 dir = vec2(cos(angle), sin(angle));
      // Project UV (centred at 0.5) onto the perpendicular axis
      vec2 p = uv - 0.5;
      return dot(p, dir);
    }

    // Remap x from [a,b] to [0,1]
    float remap01(float x, float a, float b) {
      return clamp((x - a) / (b - a), 0.0, 1.0);
    }

    vec4 generate() {
      vec3  stripeCol = u_stripe_color.rgb;
      vec3  bgCol     = u_bg_color.rgb;
      float halfW     = u_stripe_width * 0.5;
      float angle     = u_angle * 3.14159;  // -pi to pi

      // Perpendicular signed distance to stripe centreline
      float sDist = stripeSDist(v_uv, angle + 1.5707963); // perpendicular to stripe direction

      // Sharp stripe mask — no anti-alias blur (crisp edge)
      float stripeMask = step(-halfW, sDist) * step(sDist, halfW);

      // Gradient along the stripe length (parallel to stripe direction)
      vec2  stripeDir = vec2(cos(angle), sin(angle));
      float along     = dot(v_uv - 0.5, stripeDir) + 0.5; // 0→1 along stripe

      // Colour gradient from stripeCol at one end to a lighter/darker variant
      vec3 stripeEnd   = mix(stripeCol, vec3(1.0), 0.25); // lighter at far end
      vec3 gradStripe  = mix(stripeCol, stripeEnd, along);

      // Edge highlight — very thin bright line at each stripe edge for crispness
      float edgeDist = min(abs(sDist - halfW), abs(sDist + halfW));
      float edgeHighlight = smoothstep(0.012, 0.0, edgeDist) * 0.35 * stripeMask;

      // Compose
      vec3 col = mix(bgCol, gradStripe, stripeMask);
      col += edgeHighlight;
      col = clamp(col, 0.0, 1.0);

      return vec4(col, 1.0) * u_opacity;
    }
  `,
  uniforms: [
    { name: 'u_stripe_color', type: 'color', default: [0.90, 0.10, 0.10, 1.0], label: 'Stripe Colour' },
    { name: 'u_bg_color',     type: 'color', default: [0.05, 0.05, 0.05, 1.0], label: 'Background Colour' },
    { name: 'u_stripe_width', type: 'float', default: 0.45, min: 0.1,  max: 0.9, label: 'Stripe Width' },
    { name: 'u_angle',        type: 'float', default: 0.3,  min: -1.0, max: 1.0, label: 'Stripe Angle' }
  ]
};
