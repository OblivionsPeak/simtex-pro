export default {
  id: 'desert_rose',
  name: 'Desert Rose',
  category: 'Geology',
  added: '2026-06-12',
  description: 'Intergrown bladed gypsum rosettes — sandy crystal petals radiating from clustered centres, edges catching the light, sand-blasted matrix between.',
  shader: `
    vec2 hash2_dro(vec2 p) {
      return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
    }

    vec4 generate() {
      vec2 uv = v_uv;
      vec3 sand = u_sand_color.rgb;

      // --- Sandy matrix base ---
      float grit = noise(uv * 220.0) * 0.5 + noise(uv * 90.0) * 0.5;
      vec3 col = sand * vec3(0.55, 0.48, 0.42) * (0.75 + grit * 0.4);

      // --- Bladed rosettes: loop neighborhood so rosettes intergrow ---
      vec2 p = uv * u_rosette_scale;
      vec2 ip = floor(p);

      float bladeVal = 0.0;   // crystal blade coverage
      float edgeVal = 0.0;    // bright blade-edge highlights
      float idVal = 0.0;      // winning rosette hash for tinting

      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 g = vec2(float(x), float(y));
          vec2 o = hash2_dro(ip + g);
          float ch = fract(o.x * 23.3 + o.y * 11.9);

          vec2 centre = ip + g + 0.2 + o * 0.6;
          vec2 d = p - centre;
          float rr = length(d);
          float ang = atan(d.y, d.x);

          // Bladed petals: sharp lens-shaped blades around the centre
          float blades = abs(sin(ang * u_blade_count * 0.5 + ch * 6.28318));
          float blade = pow(blades, 3.0 + fract(ch * 5.1) * 3.0);

          // Blades tilt: radial profile shifts per petal so tips stagger
          float tip = 0.42 + 0.18 * sin(ang * u_blade_count + ch * 9.0) + fract(ch * 3.3) * 0.12;
          float reach = smoothstep(tip, tip * 0.2, rr);

          float petal = blade * reach;

          if (petal > bladeVal) {
            bladeVal = petal;
            idVal = ch;
          }
          // Crystal edge glint: thin bright line at the blade boundary
          float rim = smoothstep(0.55, 0.85, blade) * smoothstep(0.85, 0.55, blade + 0.001);
          edgeVal = max(edgeVal, rim * reach * smoothstep(tip * 0.15, tip * 0.5, rr));
        }
      }

      // --- Crystal blade coloring ---
      // Gypsum blades: sandy tan with paler translucent crystal faces
      vec3 bladeDark = sand * 0.8;
      vec3 bladeLight = sand * 1.25 + 0.08;
      vec3 crystal = mix(bladeDark, bladeLight, bladeVal);

      // Per-rosette tint variation
      crystal *= 0.85 + idVal * 0.3;

      // Sand inclusions inside the blades (desert roses grow around sand)
      float inclusion = noise(uv * 150.0 + idVal * 20.0);
      crystal *= 0.88 + inclusion * 0.2;

      float coverage = smoothstep(0.08, 0.45, bladeVal);
      col = mix(col, crystal, coverage);

      // Bright selenite edge glints
      col += vec3(1.0, 0.96, 0.88) * edgeVal * u_edge_glint * 0.45;

      // Soft shadowing in the rosette throats (between blades, near centres)
      float throat = (1.0 - bladeVal) * coverage;
      col *= 1.0 - throat * 0.25;

      // Dusty matte sheen — desert rose is satin, not glassy
      float band = dot(uv - 0.5, normalize(vec2(0.7, 0.7)));
      col += sand * exp(-band * band * 8.0) * 0.10;

      col += (hash(uv * 600.0) - 0.5) * 0.03;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_rosette_scale', name: 'Rosette Scale', type: 'float', min: 1.5, max: 10.0, default: 4.0 },
    { id: 'u_blade_count',   name: 'Blade Count',   type: 'float', min: 4.0, max: 16.0, default: 9.0 },
    { id: 'u_edge_glint',    name: 'Edge Glint',    type: 'float', min: 0.0, max: 2.0,  default: 1.0 },
    { id: 'u_sand_color',    name: 'Sand Color',    type: 'color', default: [0.78, 0.62, 0.45, 1.0] }
  ]
};
