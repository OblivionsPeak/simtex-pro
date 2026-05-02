export default {
  id: 'pearl_flake_paint',
  name: 'Pearl Flake Paint',
  category: 'Racing',
  description: 'Iridescent pearl automotive paint with hue-shifting colour across the surface and fine mica flake shimmer.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }

    // Hue rotation applied to an RGB colour
    vec3 rotateHue(vec3 col, float shift) {
      // Convert to approximate YIQ, rotate chroma
      float Y  =  dot(col, vec3(0.299,  0.587,  0.114));
      float I  =  dot(col, vec3(0.596, -0.274, -0.321));
      float Q  =  dot(col, vec3(0.211, -0.523,  0.311));
      float ang = shift * 6.28318;
      float ca = cos(ang); float sa = sin(ang);
      float Ir = I * ca - Q * sa;
      float Qr = I * sa + Q * ca;
      return clamp(vec3(
        Y + 0.956 * Ir + 0.621 * Qr,
        Y - 0.272 * Ir - 0.647 * Qr,
        Y - 1.107 * Ir + 1.705 * Qr), 0.0, 1.0);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Hue shift map — smooth spatial variation simulating viewing angle
      float shiftNoise = noise(uv * 3.0 + 1.5708 * 0.02);
      shiftNoise += noise(uv * 6.0 + 1.7) * 0.4;
      shiftNoise /= 1.4;
      float hueShift = (shiftNoise * 2.0 - 1.0) * u_shift_amount * 0.35;

      // Pearl base shifted
      vec3 pearlBase = rotateHue(u_base_color.rgb, hueShift);

      // Mica flake layer — tiny hexagonal-ish cells
      vec2 flakeUV   = uv * u_flake_density * 0.02;
      vec2 flakeCell = floor(flakeUV);
      vec2 flakeLocal = fract(flakeUV);
      float micaBright = 0.0;

      for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
          vec2 nc  = flakeCell + vec2(float(dx), float(dy));
          float rx = hash(nc + vec2(0.17, 0.53));
          float ry = hash(nc + vec2(0.74, 0.29));
          float reflectance = hash(nc + vec2(0.33, 0.81));
          vec2 diff = flakeLocal - (vec2(float(dx), float(dy)) + vec2(rx, ry));
          float d   = length(diff);
          float sz  = 0.25 + hash(nc + vec2(0.5, 0.1)) * 0.2;
          float inside = smoothstep(sz, sz * 0.6, d);
          micaBright = max(micaBright, inside * pow(reflectance, 2.0));
        }
      }

      // Mica flake colour: slightly iridescent — pull from the opposite hue shift
      vec3 micaColor = rotateHue(vec3(0.98, 0.97, 0.95), -hueShift * 0.5);

      vec3 col = mix(pearlBase, micaColor, micaBright * 0.7);

      // Soft gloss gradient to simulate environmental reflection
      float gloss = pow(1.0 - abs(uv.x - 0.5) * 2.0, 2.0) * 0.12;
      col += vec3(gloss);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_base_color',    name: 'Base Color',    type: 'color', default: [0.95, 0.93, 0.9, 1.0] },
    { id: 'u_shift_amount',  name: 'Colour Shift',  type: 'float', min: 0.0, max: 1.0,    default: 0.4   },
    { id: 'u_flake_density', name: 'Mica Density',  type: 'float', min: 100.0, max: 1000.0, default: 400.0 }
  ]
};
