export default {
  id: 'rain_on_glass',
  name: 'Rain on Glass',
  category: 'Natural',
  description: 'Rainwater on a tinted glass windshield — beaded droplets with meniscus rim highlights and wavy vertical rivulets.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    float hash1(float n) { return fract(sin(n) * 43758.5453123); }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.1; a *= 0.5; }
      return v;
    }

    // ---- Voronoi-like droplet field ----
    // Returns (distance-to-nearest-center, cell hash).
    vec2 dropletCell(vec2 uv) {
      vec2 cellID = floor(uv);
      vec2 cellUV = fract(uv);
      float minDist = 1e9;
      float minHash = 0.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 nID = cellID + neighbor;
          // Random point within the neighboring cell — offset by noise for organic shape
          float hx = hash(nID);
          float hy = hash(nID + vec2(31.41, 27.18));
          vec2 center = neighbor + vec2(hx, hy);
          // Warp center slightly with slow noise for irregular droplet placement
          center += 0.15 * vec2(
            noise(nID * 0.7 + u_time * 0.03),
            noise(nID * 0.7 + vec2(5.3, 1.7) + u_time * 0.03)
          );
          float d = length(cellUV - center);
          if (d < minDist) {
            minDist = d;
            minHash = hash(nID + vec2(99.1, 7.3));
          }
        }
      }
      return vec2(minDist, minHash);
    }

    // ---- Rivulet streak ----
    // One vertical streak at normalised x position xPos [0,1].
    float rivulet(vec2 uv, float xPos) {
      float xDist = abs(uv.x - xPos);
      // Wavy wobble along Y using noise + time (slow drip)
      float wobble = fbm(vec2(xPos * 4.7, uv.y * 2.5 + u_time * 0.04)) * 0.04;
      float streak = smoothstep(0.022, 0.008, xDist + wobble);
      return streak;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // ---- Base tinted glass ----
      vec3 col = u_glass_color.rgb;

      // ---- Droplets ----
      vec2 dropUV = uv * u_drop_density;
      vec2 cell = dropletCell(dropUV);
      float d   = cell.x;   // 0 at droplet center, ~0.5 at cell edge
      float ch  = cell.y;   // per-cell hash for size variation

      // Vary droplet radius slightly per cell for organic feel
      float dropRadius = 0.28 + ch * 0.12;
      dropRadius *= u_wetness;

      // Interior of droplet: slightly brighter (refraction / lensing)
      float dropInterior = smoothstep(dropRadius + 0.01, dropRadius - 0.01, d);

      // Annular rim highlight (surface tension meniscus)
      float rimInner  = dropRadius * 0.78;
      float rimOuter  = dropRadius;
      float rim = smoothstep(rimInner - 0.01, rimInner + 0.01, d)
                - smoothstep(rimOuter  - 0.008, rimOuter,       d);
      rim = clamp(rim, 0.0, 1.0);

      // Water lens brightening inside droplet
      vec3 dropCol = col * (1.0 + 0.18 * dropInterior);
      // Specular rim: white-ish highlight
      dropCol += vec3(rim * 0.55);

      // Blend droplet over glass by coverage
      float dropMask = clamp(dropInterior + rim * 0.6, 0.0, 1.0) * u_wetness;
      col = mix(col, dropCol, dropMask);

      // ---- Rivulets ----
      // Space u_rivulet_count streaks evenly across X, with per-streak hash offset
      float rivMask = 0.0;
      for (int i = 0; i < 20; i++) {
        if (float(i) >= u_rivulet_count) break;
        float xPos = (float(i) + 0.5 + hash1(float(i) * 7.39) * 0.4) / u_rivulet_count;
        rivMask += rivulet(uv, xPos);
      }
      rivMask = clamp(rivMask, 0.0, 1.0) * u_wetness;

      // Rivulets: brighter, slightly blue-tinted water streak
      vec3 rivColor = col * 1.22 + vec3(0.02, 0.03, 0.05);
      col = mix(col, rivColor, rivMask * 0.75);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_glass_color.a * u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_glass_color',    name: 'Glass Tint',     type: 'color', default: [0.1, 0.13, 0.16, 1.0] },
    { id: 'u_drop_density',   name: 'Drop Density',   type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_rivulet_count',  name: 'Rivulet Count',  type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_wetness',        name: 'Wetness',        type: 'float', min: 0.0, max: 1.0,  default: 0.7 }
  ]
};
