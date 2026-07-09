export default {
  id: 'camo_prism',
  name: 'Camo Prism',
  category: 'Geometric',
  added: '2026-07-09',
  description: 'Low-poly faceted camouflage in five graphite tones, the lattice gently warped so facets read hand-cut — with rare burnt-orange prisms breaking the field.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;
      // gentle warp so the facets read hand-cut, not gridded
      vec2 wuv = uv + vec2(fbm(uv * 2.0 + 5.0), fbm(uv * 2.0 + 23.0)) * u_warp;
      vec2 p = wuv * u_scale;
      vec2 id = floor(p);
      vec2 f = fract(p);

      // each cell splits into two triangles along a random diagonal
      float diagPick = step(0.5, hash(id + 6.6));
      float tri = diagPick > 0.5 ? step(f.x, f.y) : step(f.x + f.y, 1.0);
      vec2 tkey = id + vec2(tri * 0.37 + diagPick * 0.71, tri * 0.53);

      // facet tone from a slow field, quantised to a five-step palette
      float fv = fbm((id + 0.5) / u_scale * 4.0) * 0.5 + 0.5;
      float t = clamp(fv + (hash(tkey * 1.3 + 2.2) - 0.5) * 0.30, 0.0, 1.0);
      t = floor(t * 5.0) / 4.0;
      vec3 col = mix(vec3(0.10, 0.11, 0.125), vec3(0.27, 0.30, 0.34), min(t, 1.0));

      // flat facet lighting jitter
      col *= 0.88 + 0.24 * hash(tkey + 8.8);

      // rare accent facet
      if (hash(tkey + 4.4) > 1.0 - u_accent && fv > 0.35 && fv < 0.75) {
        col = vec3(1.0, 0.47, 0.094);
      }

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale',  name: 'Facet Density', type: 'float', min: 6.0, max: 24.0, default: 12.0 },
    { id: 'u_warp',   name: 'Lattice Warp',  type: 'float', min: 0.0, max: 0.2,  default: 0.08 },
    { id: 'u_accent', name: 'Accent Facets', type: 'float', min: 0.0, max: 0.15, default: 0.035 }
  ]
};
