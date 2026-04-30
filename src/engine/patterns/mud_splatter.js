export default {
  id: 'mud_splatter',
  name: 'Mud Splatter',
  category: 'Racing',
  description: 'Dried mud and dirt splatter with organic layered blobs of varying size and opacity, typical of rally or race car bodywork.',
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
      for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.2; a *= 0.48; }
      return v;
    }

    // Single splatter blob centred at c with radius r
    float blob(vec2 uv, vec2 c, float r) {
      // Organic distortion via fbm
      float distort = fbm(uv * 5.0 + c * 4.3) * 0.25 * r;
      vec2 diff = uv - c;
      // Stretch in X axis slightly (horizontal splatter motion)
      diff.x *= 0.75;
      float d = length(diff) - distort;
      return smoothstep(r, r * 0.4, d);
    }

    // Small satellite droplets around a main blob
    float droplets(vec2 uv, vec2 c, float seed) {
      float acc = 0.0;
      for (int i = 0; i < 6; i++) {
        float fi = float(i);
        float ang   = hash(vec2(seed + fi, 1.1)) * 6.28318;
        float dist  = 0.04 + hash(vec2(seed + fi, 2.3)) * 0.10;
        float dropR = 0.005 + hash(vec2(seed + fi, 3.7)) * 0.018;
        vec2 dropC  = c + vec2(cos(ang), sin(ang)) * dist;
        acc = max(acc, blob(uv, dropC, dropR * u_size));
      }
      return acc;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      float mudTotal = 0.0;

      // Main blobs at pseudo-random positions scaled by u_density
      float count = u_density;
      // We iterate a fixed number but break early based on count via weight
      for (int i = 0; i < 20; i++) {
        float fi = float(i);
        // Weight fades blobs beyond u_density
        float weight = clamp(count - fi, 0.0, 1.0);
        if (weight < 0.001) break;

        vec2 centre = vec2(hash(vec2(fi * 1.7, 0.3)), hash(vec2(fi * 2.3, 0.8)));
        float r = (0.04 + hash(vec2(fi, 5.5)) * 0.09) * u_size;

        float b = blob(uv, centre, r) * weight;
        // Satellite drops
        float d = droplets(uv, centre, fi * 10.0 + 1.3) * weight;
        mudTotal = max(mudTotal, max(b, d));
      }

      // Thin dried mud edge — slightly lighter, more cracked looking
      float edgeNoise = fbm(uv * 20.0) * 0.1;
      float mudThick  = mudTotal;
      float mudEdge   = smoothstep(0.1, 0.4, mudThick) * (1.0 - smoothstep(0.4, 0.9, mudThick));
      mudEdge *= (0.5 + edgeNoise);

      // Mud colour variation — darker wet centre, lighter dried edge
      vec3 mudDark  = u_mud_color.rgb * 0.6;
      vec3 mudLight = mix(u_mud_color.rgb, vec3(0.55, 0.48, 0.36), 0.5);
      vec3 mudCol   = mix(mudLight, mudDark, smoothstep(0.3, 0.9, mudThick));
      mudCol = mix(mudCol, mudLight * 1.2, mudEdge);

      // Substrate
      float subGrain = noise(uv * 80.0) * 0.03;
      vec3 subCol = u_substrate.rgb + vec3(subGrain);

      vec3 col = mix(subCol, mudCol, mudTotal * 0.95);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_mud_color', name: 'Mud Color',   type: 'color', default: [0.3,  0.22, 0.12, 1.0] },
    { id: 'u_substrate', name: 'Substrate',   type: 'color', default: [0.15, 0.13, 0.12, 1.0] },
    { id: 'u_density',   name: 'Density',     type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_size',      name: 'Blob Size',   type: 'float', min: 0.5, max: 3.0,  default: 1.0 }
  ]
};
