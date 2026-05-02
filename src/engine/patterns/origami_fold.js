export default {
  id: 'origami_fold',
  name: 'Origami Fold',
  category: 'Geometric',
  description: 'Origami crease pattern with radiating mountain and valley fold lines on cream paper.',
  shader: `
    // Distance from point p to infinite line through a and b
    float lineDistance(vec2 p, vec2 a, vec2 b) {
      vec2 ab = b - a;
      vec2 ap = p - a;
      float t = clamp(dot(ap, ab) / dot(ab, ab), 0.0, 1.0);
      return length(ap - ab * t);
    }

    // Hash for deterministic fold point placement
    float hash11(float n) {
      return fract(sin(n) * 43758.5453);
    }
    float hash21(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    // Distance to a crease line from a given fold point, radiating at angle theta
    float creaseLine(vec2 uv, vec2 origin, float angle, float lineWidth) {
      vec2 dir = vec2(cos(angle), sin(angle));
      vec2 p = uv - origin;
      float para  = dot(p, dir);
      float perp  = abs(dot(p, vec2(-dir.y, dir.x)));
      // Only draw the ray (half-line), not full infinite line
      float rayMask = step(0.0, para);
      return perp * rayMask + (1.0 - rayMask) * 9999.0;
    }

    vec4 generate() {
      float complexity = u_complexity;
      vec3  paper  = u_paper_color.rgb;
      vec3  crease = u_crease_color.rgb;

      vec2 uv = v_uv;

      // Number of fold point sources — driven by complexity
      int numPoints = int(clamp(complexity * 2.0 + 1.0, 1.0, 11.0));

      float minCreaseDist = 9999.0;
      float creaseAngle   = 0.0;

      // For each fold point, radiate several crease lines
      for (int i = 0; i < 11; i++) {
        if (i >= numPoints) break;
        float fi = float(i);

        // Deterministic fold origin on canvas
        vec2 origin = vec2(
          hash11(fi * 3.71 + 1.0),
          hash11(fi * 5.13 + 2.0)
        );

        // Number of radiating folds from this point
        int numRays = int(3.0 + floor(hash11(fi * 7.0) * complexity * 1.5));
        numRays = min(numRays, 7);

        for (int j = 0; j < 7; j++) {
          if (j >= numRays) break;
          float fj = float(j);
          float baseAngle = hash11(fi * 13.0 + fj * 3.0) * 6.2831;
          float angle = baseAngle;

          // Mountain fold: every other ray
          float isMountain = step(0.5, hash11(fi * 2.1 + fj));

          float d = creaseLine(uv, origin, angle, 0.002);

          if (d < minCreaseDist) {
            minCreaseDist = d;
            creaseAngle   = isMountain;
          }
        }
      }

      // Base paper texture — very slight mottled grain
      float grain = (hash21(uv * 180.0) - 0.5) * 0.025;

      // Crease line width (thinner for high complexity)
      float creaseWidth = 0.003 / clamp(complexity * 0.4, 0.5, 2.0);

      float creaseMask  = 1.0 - smoothstep(creaseWidth * 0.5, creaseWidth * 1.5, minCreaseDist);

      // Shadow on valley fold side (slight gradient perpendicular to crease)
      float shadowWidth = creaseWidth * 5.0;
      float foldShadow  = smoothstep(shadowWidth, 0.0, minCreaseDist) * (1.0 - creaseAngle) * 0.18;

      // Light on mountain fold side
      float foldLight   = smoothstep(shadowWidth, 0.0, minCreaseDist) * creaseAngle * 0.10;

      vec3 paperGrain = paper + grain;
      vec3 col = paperGrain;
      col -= foldShadow;       // valley shadow
      col += foldLight;        // mountain highlight
      col = mix(col, crease, creaseMask);  // dark crease line itself

      col = clamp(col, 0.0, 1.0);

      return vec4(col, 1.0) * u_opacity;
    }
  `,
  uniforms: [
    { name: 'u_complexity',   type: 'float', default: 2.5, min: 1.0, max: 5.0, label: 'Complexity' },
    { name: 'u_paper_color',  type: 'color', default: [0.96, 0.94, 0.90, 1.0], label: 'Paper Colour' },
    { name: 'u_crease_color', type: 'color', default: [0.55, 0.50, 0.45, 1.0], label: 'Crease Colour' }
  ]
};
