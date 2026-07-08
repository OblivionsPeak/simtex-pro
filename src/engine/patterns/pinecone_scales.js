export default {
  id: 'pinecone_scales',
  name: 'Pinecone Scales',
  category: 'Natural',
  added: '2026-07-07',
  description: 'Woody diamond scales in staggered rows — each with a raised umbo catching the light.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // staggered rows
      uv.x += step(1.0, mod(floor(uv.y), 2.0)) * 0.5;
      vec2 cell = floor(uv);
      vec2 f = fract(uv) - 0.5;
      // diamond scale: manhattan-ish distance
      float d = abs(f.x) + abs(f.y) * 1.4;
      float scale_ = smoothstep(0.62, 0.55, d);
      vec4 col = u_secondary_color;
      // woody base tone with per-scale variation
      vec3 wood = u_primary_color.rgb * (0.85 + 0.3 * hash(cell + 2.3));
      // shading: light from top, tips shadowed where the next row overlaps
      wood *= 0.7 + 0.5 * smoothstep(0.6, -0.4, f.y);
      // fibrous streaks radiating to the tip
      wood *= 0.92 + 0.08 * sin(atan(f.y + 0.6, f.x) * 30.0);
      // umbo: raised bump near the center
      float umbo = exp(-((f.x * f.x) + (f.y - 0.05) * (f.y - 0.05)) * 60.0);
      wood += u_accent_color.rgb * umbo * 0.5;
      col.rgb = mix(col.rgb, wood, scale_);
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Scale Density', type: 'float', min: 4.0, max: 30.0, default: 11.0 },
    { id: 'u_primary_color', name: 'Scale Wood', type: 'color', default: [0.45, 0.3, 0.17, 1.0] },
    { id: 'u_accent_color', name: 'Umbo', type: 'color', default: [0.75, 0.6, 0.4, 1.0] },
    { id: 'u_secondary_color', name: 'Shadow Gap', type: 'color', default: [0.12, 0.08, 0.05, 1.0] }
  ],
  variants: [
    { name: 'Forest Floor', uniforms: { u_primary_color: [0.45, 0.3, 0.17, 1.0], u_accent_color: [0.75, 0.6, 0.4, 1.0], u_secondary_color: [0.12, 0.08, 0.05, 1.0] } },
    { name: 'Charred', uniforms: { u_primary_color: [0.18, 0.15, 0.13, 1.0], u_accent_color: [0.5, 0.35, 0.25, 1.0], u_secondary_color: [0.04, 0.03, 0.03, 1.0] } },
    { name: 'Gilded Craft', uniforms: { u_primary_color: [0.7, 0.55, 0.25, 1.0], u_accent_color: [0.95, 0.85, 0.5, 1.0], u_secondary_color: [0.25, 0.16, 0.06, 1.0] } }
  ]
};
