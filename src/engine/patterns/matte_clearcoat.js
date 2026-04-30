export default {
  id: 'matte_clearcoat',
  name: 'Matte Clearcoat',
  category: 'Racing',
  description: 'Flat/satin automotive paint finish with micro-surface grain, mimicking matte-wrapped or flat-painted race cars.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

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

    // 3-octave fBm for micro-surface tooth
    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 3; i++) {
        v += a * noise(p);
        p  *= 2.1;
        a  *= 0.5;
      }
      return v;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // High-frequency micro-texture grain (the "tooth" of flat paint)
      float grain = fbm(uv * u_noise_scale);
      // Keep grain subtle — it's a very small surface roughness
      grain = (grain - 0.5) * 0.06;

      // Base pigment color with grain applied as a lightness nudge
      vec3 col = u_paint_color.rgb + vec3(grain);

      // Fresnel-style brightening: UV edges simulate viewing-angle curvature.
      // Map v_uv to [-1, 1] and use squared distance from center as proxy.
      vec2 centered = uv * 2.0 - 1.0;
      float edgeFactor = dot(centered, centered); // 0 at center, ~1 at corners
      edgeFactor = clamp(edgeFactor, 0.0, 1.0);

      // Satin level governs how much the Fresnel sheen shows
      float sheenAmount = u_sheen * 0.12 * edgeFactor;
      col += vec3(sheenAmount);

      // Very faint specular blob at center for satin finish
      float centralSpec = (1.0 - edgeFactor) * u_sheen * 0.05;
      col += vec3(centralSpec);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_paint_color.a * u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_paint_color', name: 'Paint Color',  type: 'color', default: [0.08, 0.08, 0.08, 1.0] },
    { id: 'u_noise_scale', name: 'Grain Scale',  type: 'float', min: 0.5, max: 20.0, default: 8.0 },
    { id: 'u_sheen',       name: 'Satin Sheen',  type: 'float', min: 0.0, max: 1.0,  default: 0.15 }
  ]
};
