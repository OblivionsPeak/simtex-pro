export default {
  id: 'mesh_jersey',
  name: 'Mesh Jersey',
  category: 'Industrial',
  description: 'Open-hole sports jersey knit mesh with rounded thread loops forming a regular grid of holes.',
  shader: `
    // Smooth minimum for rounded shape merging
    float smin(float a, float b, float k) {
      float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
      return mix(b, a, h) - k * h * (1.0 - h);
    }

    // Signed distance to a rounded rectangle
    float sdRoundRect(vec2 p, vec2 b, float r) {
      vec2 q = abs(p) - b + r;
      return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
    }

    // Loop cross-section: a kidney/loop shaped thread path around hole
    float loopSDF(vec2 local, float holeRadius) {
      // Distance to hole border (negative = outside hole)
      float distToHole = length(local) - holeRadius;
      // Thread occupies a band around the hole
      return abs(distToHole) - 0.12;
    }

    vec4 generate() {
      float scale    = u_scale;
      float holeSize = u_hole_size;

      vec2 uv = v_uv * scale;

      // Offset every other column for jersey knit stagger
      float col = floor(uv.x);
      float rowOffset = mod(col, 2.0) * 0.5;
      vec2 shifted = vec2(uv.x, uv.y + rowOffset);

      vec2 cell  = floor(shifted);
      vec2 local = fract(shifted) - 0.5; // [-0.5, 0.5]

      // Elliptical hole (slightly taller than wide — jersey stretches horizontally)
      vec2 holeScale = vec2(1.0 / (holeSize * 0.9), 1.0 / holeSize);
      float holeDist = length(local * holeScale) - 1.0;

      // Thread band around the hole
      float threadWidth = 0.22 - holeSize * 0.15;
      threadWidth = clamp(threadWidth, 0.06, 0.18);
      float thread = abs(holeDist) - threadWidth;

      // Shading: inside of loop is slightly darker (depth), top of loop is bright
      float loopShade = 1.0 - smoothstep(-0.05, 0.25, holeDist) * 0.3;

      // Specular glint along the top of each loop arc
      float angle = atan(local.y, local.x);
      float specAngle = cos(angle - 1.1);
      float specGlint = smoothstep(0.6, 1.0, specAngle) * smoothstep(threadWidth, 0.0, abs(thread)) * 0.4;

      // Thread mask
      float threadMask = 1.0 - smoothstep(-0.01, 0.02, thread);

      // Hole (transparent / background)
      float holeMask = smoothstep(-0.02, 0.02, holeDist);
      float bgMask   = 1.0 - threadMask;

      // Darken background (no thread — just see-through dark)
      vec3 bgCol     = u_thread_color.rgb * 0.08;
      vec3 threadCol = u_thread_color.rgb * loopShade + specGlint;

      vec3 col3 = mix(bgCol, threadCol, threadMask);

      // Slight crosshatch from neighbouring loops (ambient contact shadow)
      float shadow = 1.0 - smoothstep(0.30, 0.50, length(local)) * 0.18;
      col3 *= shadow;

      return vec4(clamp(col3, 0.0, 1.0), 1.0) * u_opacity;
    }
  `,
  uniforms: [
    { name: 'u_scale',        type: 'float', default: 14,  min: 4,   max: 30,  label: 'Mesh Scale' },
    { name: 'u_thread_color', type: 'color', default: [0.90, 0.90, 0.90, 1.0], label: 'Thread Colour' },
    { name: 'u_hole_size',    type: 'float', default: 0.45, min: 0.2, max: 0.7, label: 'Hole Size' }
  ]
};
