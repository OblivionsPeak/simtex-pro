export default {
  id: 'knurl_grip',
  name: 'Knurl Grip',
  category: 'Racing',
  description: 'Diamond knurl grip pattern — two sets of diagonal machined ridges crossing at 45 degrees to form sharp pyramid diamonds with bright tips and dark valleys.',
  shader: `
    // Rotate a UV coordinate by angle (radians)
    vec2 rot2d(vec2 p, float a) {
      float s = sin(a); float c = cos(a);
      return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
    }

    // Single set of parallel ridges along one axis after rotation
    // Returns 0 at valley, 1 at ridge peak
    float ridges(vec2 uv, float density, float angle) {
      vec2 r = rot2d(uv, angle);
      // Use r.x for ridge position, fract gives saw-tooth, smoothed to sine-like
      float t = fract(r.x * density);
      // Smooth triangle wave: sharp at peak, smooth at valley
      t = 1.0 - abs(t * 2.0 - 1.0);
      return t;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Two ridge sets at +45 and -45 degrees (0.7854 rad)
      float r1 = ridges(uv, u_density, 0.7854);
      float r2 = ridges(uv, u_density, -0.7854);

      // Diamond height: both ridges must be high simultaneously
      // Multiply gives peak only where both are at maximum
      float diamond = r1 * r2;

      // Sharpen the peak using a power — creates pyramid look
      diamond = pow(diamond, mix(1.5, 3.5, u_depth * 0.5));

      // Valley (dark) vs tip (bright)
      // Valleys between ridges are the darkest points
      float valley = (1.0 - r1) * (1.0 - r2);
      float valleyMask = pow(valley, 1.8);

      // Base colour
      vec3 col = u_base_color.rgb;

      // Darken valleys
      col *= mix(1.0, 0.35, valleyMask * u_depth * 0.7);

      // Bright highlight on pyramid tips
      float tipHighlight = diamond * u_depth * 0.45;
      col += vec3(tipHighlight, tipHighlight * 0.98, tipHighlight * 0.95);

      // Mid-slope shading — slight gradient on ridge faces
      float slope = r1 * (1.0 - r2) + r2 * (1.0 - r1);
      col *= mix(1.0, 0.72, slope * u_depth * 0.3);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_density',    name: 'Diamond Density', type: 'float', min: 4.0,  max: 40.0, default: 16.0 },
    { id: 'u_base_color', name: 'Base Metal',       type: 'color', default: [0.55, 0.55, 0.57, 1.0] },
    { id: 'u_depth',      name: 'Ridge Depth',      type: 'float', min: 0.2,  max: 2.0,  default: 1.0 }
  ]
};
