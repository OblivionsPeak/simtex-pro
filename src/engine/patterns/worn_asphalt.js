export default {
  id: 'worn_asphalt',
  name: 'Worn Asphalt',
  category: 'Racing',
  description: 'Heavily worn racing asphalt with exposed aggregate, oil-stained patches, crack lines, and rubber marbling from racing tyres.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p *= 2.1; a *= 0.5;
      }
      return v;
    }

    // Crack lines — thin dark lines following noise gradient breaks
    float crackMap(vec2 uv, float density) {
      // Use fbm derivatives to find steep gradients = cracks
      vec2 q = uv * density;
      float f1 = fbm(q);
      float f2 = fbm(q + vec2(0.01, 0.0));
      float f3 = fbm(q + vec2(0.0, 0.01));
      float grad = length(vec2(f2 - f1, f3 - f1)) * 80.0;
      // Crack = high gradient region
      return smoothstep(0.6, 1.2, grad);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- Base worn asphalt ---
      // Exposed aggregate: lighter grey where tar is worn away
      float wearMap = fbm(uv * 3.5);
      wearMap = smoothstep(0.35, 0.65, wearMap);
      // Apply wear amount — u_wear 1.0 = maximum exposure
      float aggregateExpose = wearMap * u_wear;

      // Aggregate colour is lighter (stone grey) vs tar (dark)
      vec3 tarColor       = u_base_color.rgb;
      vec3 aggregateColor = u_base_color.rgb * 1.45 + vec3(0.05, 0.05, 0.04);

      vec3 col = mix(tarColor, aggregateColor, aggregateExpose);

      // Fine asphalt grain noise
      float grain = noise(uv * 200.0) * 0.07 - 0.035;
      col += vec3(grain);

      // --- Oil stains ---
      // Dark, slightly iridescent patches; positioned by low-freq noise
      float oilMap = fbm(uv * 2.2 + vec2(3.1, 7.4));
      oilMap = smoothstep(0.58, 0.72, oilMap) * u_wear * 0.8;
      // Oil is very dark with slight rainbow shimmer (handled as dark brownish)
      vec3 oilColor = vec3(0.07, 0.065, 0.05);
      col = mix(col, oilColor, oilMap);
      // Faint iridescent tinge at oil edges
      float oilEdge = smoothstep(0.55, 0.58, fbm(uv * 2.2 + vec2(3.1, 7.4)));
      col += vec3(oilEdge * 0.03, oilEdge * 0.02, oilEdge * 0.04) * u_wear;

      // --- Rubber marbling from tyres ---
      // Dark rubber smears — streaky near the racing line (varies with Y mostly)
      float rubberMap = fbm(vec2(uv.x * 6.0, uv.y * 2.0) + vec2(1.7, 0.9));
      rubberMap = smoothstep(0.58, 0.70, rubberMap) * u_wear * 0.65;
      vec3 rubberColor = vec3(0.06, 0.055, 0.05);
      col = mix(col, rubberColor, rubberMap);

      // --- Crack lines ---
      float cracks = crackMap(uv, u_crack_density) * u_wear;
      // Cracks are very dark, thin
      col = mix(col, vec3(0.05, 0.05, 0.04), cracks * 0.85);

      // --- Patch repairs (occasional lighter grey patches) ---
      float patch = fbm(uv * 1.8 + vec2(5.5, 2.2));
      patch = step(0.70, patch) * step(patch, 0.75) * u_wear * 0.5;
      vec3 patchColor = vec3(0.35, 0.34, 0.33);
      col = mix(col, patchColor, patch);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_wear',          name: 'Wear Level',     type: 'float', min: 0.0,  max: 1.0,  default: 0.7 },
    { id: 'u_base_color',    name: 'Asphalt Base',   type: 'color', default: [0.28, 0.27, 0.26, 1.0] },
    { id: 'u_crack_density', name: 'Crack Density',  type: 'float', min: 1.0,  max: 10.0, default: 4.0 }
  ]
};
