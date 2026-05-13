export default {
  id: 'vinyl_wrap',
  name: 'Vinyl Wrap Film',
  category: 'Racing',
  description: 'Matte vinyl wrap film with characteristic micro-pebble surface texture and subtle directional sheen. Excellent as a spec or normal-map source for flat paint finishes.',
  shader: `
    float hash_vw(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise_vw(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash_vw(i), hash_vw(i+vec2(1,0)), f.x),
                 mix(hash_vw(i+vec2(0,1)), hash_vw(i+vec2(1,1)), f.x), f.y);
    }

    // Voronoi cell for micro-pebble
    float voronoi_vw(vec2 uv) {
      vec2 cell = floor(uv);
      vec2 frac  = fract(uv);
      float minDist = 8.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 nb  = vec2(float(x), float(y));
          vec2 pt  = nb + vec2(hash_vw(cell + nb + 0.17), hash_vw(cell + nb + 0.89)) - frac;
          minDist  = min(minDist, dot(pt, pt));
        }
      }
      return sqrt(minDist);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // ---- Micro-pebble surface ----
      // Two scales of voronoi create the fine orange-peel texture of vinyl
      float pebble  = voronoi_vw(uv * u_pebble_scale);
      float pebble2 = voronoi_vw(uv * u_pebble_scale * 2.8 + 3.7);
      float surface = pebble * 0.65 + pebble2 * 0.35;

      // Convert to a gentle bump map luminance
      float bump = smoothstep(0.0, 0.55, surface) * u_texture_depth;

      // ---- Directional sheen (vinyl has a slight gloss in one direction) ----
      float sheen = pow(max(0.0, 1.0 - abs(uv.x - 0.5) * 2.0), 6.0) * 0.10 * u_sheen;

      // ---- Compose with base colour ----
      vec3 base   = u_base_color.rgb;
      // Shadow in pebble valleys, highlight on ridges
      vec3 shadow = base * 0.78;
      vec3 col    = mix(shadow, base, bump) + vec3(sheen);

      // Fine noise for printing grain
      float grain = (noise_vw(uv * 320.0) - 0.5) * 0.012;
      col += vec3(grain);

      return vec4(clamp(col, 0.0, 1.0), u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_base_color',    name: 'Base Colour',     type: 'color', default: [0.12, 0.12, 0.15, 1.0] },
    { id: 'u_pebble_scale',  name: 'Pebble Scale',    type: 'float', default: 80.0,  min: 20.0,  max: 200.0 },
    { id: 'u_texture_depth', name: 'Texture Depth',   type: 'float', default: 0.7,   min: 0.0,   max: 1.0   },
    { id: 'u_sheen',         name: 'Gloss Sheen',     type: 'float', default: 0.6,   min: 0.0,   max: 1.0   },
  ]
};
