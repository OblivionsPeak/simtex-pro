export default {
  id: 'heat_blued_titanium',
  name: 'Heat-Blued Titanium',
  category: 'Industrial',
  description: 'Titanium heat-oxidation colour bands — the characteristic silver → straw → gold → purple → blue gradient on exhaust systems and racing hardware.',
  shader: `
    float hash_hbt(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise_hbt(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash_hbt(i), hash_hbt(i+vec2(1,0)), f.x),
                 mix(hash_hbt(i+vec2(0,1)), hash_hbt(i+vec2(1,1)), f.x), f.y);
    }

    // Cascade of mix() — GPU-friendly colour ramp, no branching
    vec3 titaniumRamp(float t) {
      vec3 c0 = vec3(0.78, 0.76, 0.74); // cool silver
      vec3 c1 = vec3(0.90, 0.80, 0.48); // straw
      vec3 c2 = vec3(0.84, 0.60, 0.18); // gold
      vec3 c3 = vec3(0.58, 0.28, 0.68); // purple
      vec3 c4 = vec3(0.22, 0.38, 0.82); // blue
      vec3 c5 = vec3(0.46, 0.54, 0.72); // grey-blue (very hot)
      float s = t * 5.0;
      vec3 col = mix(c0, c1, clamp(s,       0.0, 1.0));
      col      = mix(col, c2, clamp(s-1.0,  0.0, 1.0));
      col      = mix(col, c3, clamp(s-2.0,  0.0, 1.0));
      col      = mix(col, c4, clamp(s-3.0,  0.0, 1.0));
      col      = mix(col, c5, clamp(s-4.0,  0.0, 1.0));
      return col;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Primary heat gradient along chosen axis
      float primary = mix(uv.x, 1.0 - uv.y, u_direction);

      // Organic turbulence for natural heat-flow shape
      float turb = noise_hbt(uv * 2.8) * 0.3 + noise_hbt(uv * 6.5) * 0.12;
      turb /= 0.42;

      float t = clamp(primary * u_spread + (turb - 0.5) * 0.25 + u_heat_bias, 0.0, 1.0);

      vec3 col = titaniumRamp(t);

      // Directional brushed grain (fine horizontal lines like turned/polished titanium)
      float grainAxis = mix(uv.x, uv.y, u_direction);
      float grain = noise_hbt(vec2(grainAxis * 180.0, uv.y * 1.5)) * 0.045;
      col += vec3(grain);

      // Subtle specular sheen
      float sheen = pow(max(0.0, 1.0 - abs(primary - 0.5) * 2.5), 5.0) * 0.12;
      col += vec3(sheen);

      return vec4(clamp(col, 0.0, 1.0), u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_heat_bias',  name: 'Heat Level',  type: 'float', default: 0.4,  min: 0.0,  max: 1.0 },
    { id: 'u_spread',     name: 'Band Spread', type: 'float', default: 0.85, min: 0.2,  max: 1.5 },
    { id: 'u_direction',  name: 'Direction',   type: 'float', default: 0.0,  min: 0.0,  max: 1.0 },
  ]
};
