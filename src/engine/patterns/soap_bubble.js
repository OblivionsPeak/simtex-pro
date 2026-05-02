export default {
  id: 'soap_bubble_abstract',
  name: 'Soap Bubble',
  category: 'Abstract',
  description: 'Iridescent soap film with thin-film interference hues, Newton ring bands, and a dark background.',
  shader: `
    float hash21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    float smoothNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash21(i);
      float b = hash21(i + vec2(1.0, 0.0));
      float c = hash21(i + vec2(0.0, 1.0));
      float d = hash21(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    // Hue to RGB — GLSL 1.0 compatible, no array indexing issues
    vec3 hue2rgb(float h) {
      h = fract(h);
      float r = clamp(abs(h * 6.0 - 3.0) - 1.0, 0.0, 1.0);
      float g = clamp(2.0 - abs(h * 6.0 - 2.0), 0.0, 1.0);
      float b = clamp(2.0 - abs(h * 6.0 - 4.0), 0.0, 1.0);
      return vec3(r, g, b);
    }

    vec4 generate() {
      vec2 center = vec2(0.5);
      vec2 uv     = (v_uv - center) / u_bubble_size;
      float dist  = length(uv);

      // Outside bubble → background
      float bubbleMask = 1.0 - smoothstep(0.44, 0.50, dist);

      // Thin-film interference: hue varies with radial distance
      // Blue→green→yellow→red as we go from center outward
      float filmPhase = dist * 2.8 * u_iridescence;

      // Gentle noise distortion of the hue bands
      float distortion = smoothNoise(uv * 6.0) * 0.12 - 0.06;

      float hue = fract(filmPhase + distortion);
      vec3  iridCol = hue2rgb(hue);

      // Saturation and brightness: near center is dimmer/more transparent look
      float sat = smoothstep(0.05, 0.45, dist);  // more colorful toward rim
      iridCol = mix(vec3(0.85), iridCol, sat * 0.9);

      // Newton ring overlay — concentric bands
      float rings = sin(dist * 60.0 * u_iridescence) * 0.5 + 0.5;
      float ringHue = fract(hue + rings * 0.15);
      vec3 ringCol = hue2rgb(ringHue);
      iridCol = mix(iridCol, ringCol, rings * 0.25 * sat);

      // Bright rim highlight
      float rim = smoothstep(0.30, 0.44, dist) * (1.0 - smoothstep(0.44, 0.50, dist));
      iridCol += vec3(0.4) * rim;

      // Transparent center (slightly washed out, near clear)
      float centerFade = 1.0 - smoothstep(0.0, 0.18, dist);
      iridCol = mix(iridCol, vec3(0.92, 0.95, 0.98), centerFade * 0.55);

      // Composite bubble over background
      vec3 finalCol = mix(u_background.rgb, iridCol, bubbleMask);

      return vec4(clamp(finalCol, 0.0, 1.0), 1.0);
    }
  `,
  uniforms: [
    { id: 'u_bubble_size',  name: 'Bubble Size',       type: 'float', min: 0.5, max: 3.0, default: 1.2 },
    { id: 'u_iridescence',  name: 'Iridescence',        type: 'float', min: 0.5, max: 3.0, default: 1.8 },
    { id: 'u_background',   name: 'Background Color',   type: 'color',                     default: [0.02, 0.02, 0.04, 1.0] }
  ]
};
