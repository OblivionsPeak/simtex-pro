export default {
  id: 'aero_riblets',
  name: 'Aerodynamic Riblets',
  category: 'Racing',
  added: '2026-05-13',
  description: 'Microscale V-groove riblets machined into aerodynamic surfaces to reduce turbulent drag — as used on F1 cars, aircraft, and high-performance bodywork.',
  shader: `
    float hash_ar(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise_ar(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash_ar(i), hash_ar(i+vec2(1,0)), f.x),
                 mix(hash_ar(i+vec2(0,1)), hash_ar(i+vec2(1,1)), f.x), f.y);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Rotate UV to riblet direction
      float ang = u_angle * 3.14159;
      float ca = cos(ang), sa = sin(ang);
      vec2 ruv = mat2(ca, -sa, sa, ca) * (uv - 0.5) + 0.5;

      // Primary riblet axis: V-groove profile along ruv.y, repeating along ruv.x
      float ribX = fract(ruv.x * u_density);

      // V-groove: triangle wave gives sharp valley, bright ridge
      // 0 at centre = deepest valley, 1 at edge = ridge
      float groove = abs(ribX - 0.5) * 2.0; // 0 = valley, 1 = ridge

      // Shadow in valley, specular on ridge
      float shadow = 1.0 - groove;                   // deep in valley
      float ridge  = smoothstep(0.72, 1.0, groove);  // highlight at peak

      // Secondary micro-groove for realism (every 4th riblet is slightly wider)
      float macroGroove = abs(fract(ruv.x * u_density / 4.0) - 0.5) * 2.0;
      float macroAccent = (1.0 - macroGroove) * 0.12;

      // Slight surface imperfection along the riblet length
      float imperfect = noise_ar(vec2(ruv.x * u_density * 0.5, ruv.y * 3.0)) * 0.04;

      // Light from top-left hitting the angled V faces
      float face = groove; // how much this face points toward light
      float diffuse = face * 0.7 + 0.3;

      // Compose
      vec3 base  = u_surface_color.rgb;
      vec3 col   = base * diffuse;
      col -= shadow * base * 0.35;          // darken valley
      col += vec3(ridge * u_sharpness * 0.35); // bright ridge line
      col -= vec3(macroAccent);              // deeper macro groove shadow
      col += vec3(imperfect);               // micro surface noise

      return vec4(clamp(col, 0.0, 1.0), u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_surface_color', name: 'Surface Colour', type: 'color', default: [0.72, 0.72, 0.74, 1.0] },
    { id: 'u_density',       name: 'Riblet Density', type: 'float', default: 120.0, min: 20.0, max: 400.0 },
    { id: 'u_angle',         name: 'Direction',      type: 'float', default: 0.0,   min: -0.5, max: 0.5   },
    { id: 'u_sharpness',     name: 'Ridge Sharpness',type: 'float', default: 0.7,   min: 0.1,  max: 1.0   },
  ]
};
