export default {
  id: 'mylar_heatshield',
  name: 'Mylar Heat Shield',
  category: 'Racing',
  added: '2026-05-01',
  description: 'Crumpled gold mylar foil — crease facets with directional striations and hard specular flashes.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_crinkle * 2.0;
      // crumple facets: voronoi cells, each a flat-ish plane of foil
      vec2 cell = floor(uv);
      float d1 = 8.0; float d2 = 8.0;
      vec2 id1 = vec2(0.0); vec2 pt1 = vec2(0.0);
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 c = cell + vec2(float(i), float(j));
          vec2 pt = c + vec2(hash(c + 1.1), hash(c + 2.2));
          float d = length(uv - pt);
          if (d < d1) { d2 = d1; d1 = d; id1 = c; pt1 = pt; }
          else if (d < d2) { d2 = d; }
        }
      }
      // each facet: parallel micro-ridges in its own random direction
      float ang = hash(id1 + 3.3) * 6.28318;
      vec2 dir = vec2(cos(ang), sin(ang));
      float ridge = sin(dot(uv - pt1, dir) * (14.0 + hash(id1 + 4.4) * 18.0)
                        + hash(id1 + 5.5) * 6.28);
      // facet base tone varies like tilted planes catching different light
      float facetLum = 0.45 + 0.65 * hash(id1 + 6.6);
      vec3 foil = u_foil_color.rgb * facetLum;
      // ridge shading + hard specular flash on ridge crests of bright facets
      foil *= 0.78 + 0.22 * ridge;
      float flash = pow(max(ridge, 0.0), 10.0) * smoothstep(0.6, 1.0, facetLum) * u_reflectivity;
      foil = mix(foil, vec3(1.0, 0.99, 0.92), clamp(flash, 0.0, 0.85));
      // crease lines between facets: bright catch-light edge then dark fold
      float border = d2 - d1;
      foil = mix(vec3(1.0, 0.97, 0.85) * 0.9 * u_reflectivity, foil, smoothstep(0.0, 0.05, border));
      foil *= 0.7 + 0.3 * smoothstep(0.0, 0.18, border);
      // fine foil micro-grain
      foil *= 0.96 + 0.04 * snoise(uv * 30.0);
      return vec4(clamp(foil, 0.0, 1.0), 1.0);
    }
  `,
  uniforms: [
    { id: 'u_foil_color',   name: 'Foil Color',           type: 'color', default: [0.92, 0.72, 0.22, 1.0] },
    { id: 'u_crinkle',      name: 'Crinkle Intensity',    type: 'float', min: 1.0, max: 10.0, default: 4.0 },
    { id: 'u_reflectivity', name: 'Highlight Brightness', type: 'float', min: 0.3, max: 2.0, default: 1.1 }
  ],
  variants: [
    { name: 'Gold NASA', uniforms: { u_foil_color: [0.92, 0.72, 0.22, 1.0], u_crinkle: 4.0, u_reflectivity: 1.1 } },
    { name: 'Silver Emergency', uniforms: { u_foil_color: [0.75, 0.77, 0.8, 1.0], u_crinkle: 5.0, u_reflectivity: 1.3 } },
    { name: 'Copper Shield', uniforms: { u_foil_color: [0.8, 0.45, 0.25, 1.0], u_crinkle: 3.0, u_reflectivity: 1.0 } }
  ]
};
