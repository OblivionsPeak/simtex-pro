export default {
  id: 'interference_rings',
  name: 'Interference Rings',
  category: 'Abstract',
  description: "Newton's rings — concentric iridescent interference fringes radiating from a contact point.",
  shader: `
    // Convert HSV to RGB (GLSL 1.0 compatible)
    vec3 hsv2rgb(float h, float s, float v) {
      float hh = mod(h * 6.0, 6.0);
      float c  = v * s;
      float x  = c * (1.0 - abs(mod(hh, 2.0) - 1.0));
      vec3 rgb;
      if      (hh < 1.0) rgb = vec3(c, x, 0.0);
      else if (hh < 2.0) rgb = vec3(x, c, 0.0);
      else if (hh < 3.0) rgb = vec3(0.0, c, x);
      else if (hh < 4.0) rgb = vec3(0.0, x, c);
      else if (hh < 5.0) rgb = vec3(x, 0.0, c);
      else               rgb = vec3(c, 0.0, x);
      return rgb + (v - c);
    }

    // Thin-film fringe intensity at path-length difference delta (in half-waves)
    float fringeIntensity(float delta) {
      return 0.5 + 0.5 * cos(delta * 6.28318);
    }

    vec4 generate() {
      float freq  = u_fringe_freq;
      float irid  = u_iridescence;
      float cx    = u_center;        // ring centre X (Y is always 0.5)

      vec2  centre = vec2(cx, 0.5);
      float dist   = length(v_uv - centre);

      // Air-gap thickness grows as r^2 for Newton's rings geometry
      // But visually a sqrt mapping looks more like the classic photo
      float gap = dist * dist * freq * 8.0;

      // Three wavelengths (R, G, B) — slightly different fringe frequencies
      float fR = fringeIntensity(gap * 1.00);
      float fG = fringeIntensity(gap * 1.18);
      float fB = fringeIntensity(gap * 1.38);

      vec3 fringeRGB = vec3(fR, fG, fB);

      // Iridescent hue rotation — shift hue with gap
      float hue   = fract(gap * 0.08 + 0.0);
      vec3  iridCol = hsv2rgb(hue, irid * 0.7, 1.0);

      // Blend achromatic fringe with iridescent hue
      vec3 col = mix(fringeRGB, iridCol, clamp(irid * 0.5, 0.0, 1.0));

      // Dark centre spot (perfect contact — zero gap, destructive at all λ)
      float centreDark = smoothstep(0.015, 0.0, dist) * 0.9;
      col *= (1.0 - centreDark);

      // Slight radial vignette — interference fades at large radius
      float vignette = 1.0 - smoothstep(0.4, 0.72, dist);
      col = mix(vec3(0.92), col, vignette);
      col = clamp(col, 0.0, 1.0);

      return vec4(col, 1.0) * u_opacity;
    }
  `,
  uniforms: [
    { name: 'u_fringe_freq',  type: 'float', default: 18,  min: 4,   max: 40,  label: 'Fringe Frequency' },
    { name: 'u_iridescence',  type: 'float', default: 1.2, min: 0.0, max: 2.0, label: 'Iridescence' },
    { name: 'u_center',       type: 'float', default: 0.5, min: 0.1, max: 0.9, label: 'Ring Centre X' }
  ]
};
