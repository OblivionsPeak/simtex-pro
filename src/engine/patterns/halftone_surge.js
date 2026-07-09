export default {
  id: 'halftone_surge',
  name: 'Halftone Surge',
  category: 'Retro',
  added: '2026-07-09',
  description: 'A rotated halftone dot sweep surging across the diagonal, with a single red accent stripe cutting through the field — print-shop energy at racing scale.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;
      float c = cos(0.2618);
      float s = sin(0.2618);                        // 15-degree screen angle
      vec2 ruv = mat2(c, -s, s, c) * (uv - 0.5) + 0.5;
      vec2 p = ruv * u_scale;
      vec2 id = floor(p);
      vec2 f = fract(p) - 0.5;

      // cell centre back in un-rotated space drives the gradient
      vec2 cuv = (id + 0.5) / u_scale;
      vec2 guv = mat2(c, s, -s, c) * (cuv - 0.5) + 0.5;
      float g = (guv.x + guv.y) * 0.5;
      float v = 1.0 - g + sin(g * 6.2831853 * 1.5) * 0.10 + (noise(id * 0.13) - 0.5) * 0.22;
      v = clamp(v, 0.0, 1.0);

      float rad = u_size * pow(v, 1.35);
      float dotm = smoothstep(rad, rad - 0.06, length(f));

      float band = guv.x - guv.y;                   // accent stripe coordinate
      vec3 ink = (band > u_stripe && band < u_stripe + 0.16)
        ? vec3(0.91, 0.165, 0.235)
        : vec3(0.925, 0.925, 0.91);
      vec3 col = mix(vec3(0.047, 0.047, 0.055), ink, dotm);
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale',  name: 'Dot Density',     type: 'float', min: 20.0, max: 80.0, default: 44.0 },
    { id: 'u_size',   name: 'Max Dot Size',    type: 'float', min: 0.3,  max: 0.9,  default: 0.62 },
    { id: 'u_stripe', name: 'Stripe Position', type: 'float', min: -0.5, max: 0.5,  default: 0.18 }
  ]
};
