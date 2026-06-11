export default {
  id: 'prismatic_flip',
  name: 'Prismatic Flip Paint',
  category: 'Racing',
  added: '2026-05-13',
  description: 'Colour-shifting flip paint that sweeps through the spectrum across the surface — as seen on modern motorsport liveries and special-edition road cars.',
  shader: `
    float hash_pf(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise_pf(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash_pf(i), hash_pf(i+vec2(1,0)), f.x),
                 mix(hash_pf(i+vec2(0,1)), hash_pf(i+vec2(1,1)), f.x), f.y);
    }

    vec3 hsvToRgb(float h, float s, float v) {
      vec3 c = abs(fract(vec3(h) + vec3(0.0, 0.333, 0.667)) * 6.0 - 3.0) - 1.0;
      return v * mix(vec3(1.0), clamp(c, 0.0, 1.0), s);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Directional hue sweep across surface
      float axis  = mix(uv.x, uv.y, u_direction);
      float sweep = (axis - 0.5) * u_range;

      // Organic turbulence breaks up the flat gradient
      float n = noise_pf(uv * 2.8) * 0.5 + noise_pf(uv * 7.2) * 0.22;
      n /= 0.72;

      float hue = fract(u_base_hue + sweep + (n - 0.5) * u_turbulence);

      vec3 col = hsvToRgb(hue, u_saturation, u_brightness);

      // Directional gloss band — simulates environmental reflection sweep
      float gloss = pow(max(0.0, 1.0 - abs(axis - 0.5) * 2.0), 4.0) * 0.18;
      col = clamp(col + gloss, 0.0, 1.0);

      if (u_is_spec > 0.5) {
        // Flip paint: moderate-high metallic, glossy; turbulence noise gives subtle variation
        float metallic = clamp(0.65 + (n - 0.5) * 0.2, 0.0, 1.0);
        float roughness = clamp(0.1 + (0.5 - n) * 0.08, 0.05, 0.18);
        return vec4(metallic, roughness, 0.0, u_opacity);
      }
      return vec4(col, u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_base_hue',   name: 'Base Hue',    type: 'float', default: 0.0,  min: 0.0,  max: 1.0 },
    { id: 'u_range',      name: 'Hue Range',   type: 'float', default: 0.55, min: 0.05, max: 2.0 },
    { id: 'u_direction',  name: 'Direction',   type: 'float', default: 0.3,  min: 0.0,  max: 1.0 },
    { id: 'u_saturation', name: 'Saturation',  type: 'float', default: 0.88, min: 0.1,  max: 1.0 },
    { id: 'u_brightness', name: 'Brightness',  type: 'float', default: 0.88, min: 0.2,  max: 1.0 },
    { id: 'u_turbulence', name: 'Turbulence',  type: 'float', default: 0.28, min: 0.0,  max: 1.0 },
  ]
};
