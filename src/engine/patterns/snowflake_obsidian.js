export default {
  id: 'snowflake_obsidian',
  name: 'Snowflake Obsidian',
  category: 'Geology',
  added: '2026-06-12',
  description: 'Jet-black volcanic glass dotted with grey radial cristobalite rosettes — feathery snowflake spherulites on a glossy dark field.',
  shader: `
    vec2 hash2_sfo(vec2 p) {
      return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- Black glass base ---
      // Faint smoky flow bands frozen in the glass
      float flow = fbm(uv * vec2(6.0, 2.0)) * 0.5 + 0.5;
      vec3 col = vec3(0.030, 0.030, 0.036) + flow * 0.025;

      // Conchoidal sheen arcs: subtle curved gloss in the glass
      float arc = sin(length(uv - vec2(0.8, 0.2)) * 40.0 + snoise(uv * 3.0) * 2.0);
      col += clamp(arc, 0.0, 1.0) * 0.012;

      // --- Cristobalite rosettes ---
      // Loop the 3x3 neighborhood so adjacent snowflakes can overlap
      vec2 p = uv * u_rosette_scale;
      vec2 ip = floor(p);
      float rose = 0.0;
      float roseEdge = 0.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 g = vec2(float(x), float(y));
          vec2 o = hash2_sfo(ip + g);
          float ch = fract(o.x * 19.7 + o.y * 7.3);

          // Only some cells host a rosette
          if (ch < u_rosette_density) {
            vec2 centre = ip + g + 0.25 + o * 0.5;
            vec2 d = p - centre;
            float rr = length(d);
            float ang = atan(d.y, d.x);

            // Radial spokes: feathery arms, count varies per rosette
            float arms = 5.0 + floor(fract(ch * 13.1) * 4.0);
            float spoke = pow(abs(sin(ang * arms + ch * 20.0)), 1.5);

            // Feathered radial profile with noisy ragged rim
            float rag = noise(vec2(ang * 3.0 + ch * 40.0, rr * 8.0)) * 0.12;
            float radius = (0.28 + fract(ch * 7.7) * 0.14) + rag;
            float body = smoothstep(radius, radius * 0.15, rr);

            // Grainy crystalline interior
            float grain = noise(d * 30.0 + ch * 60.0);
            float petal = body * (0.45 + spoke * 0.55) * (0.7 + grain * 0.5);

            rose = max(rose, petal);
            // Soft halo where the spherulite devitrified into the glass
            roseEdge = max(roseEdge, smoothstep(radius * 1.25, radius * 0.6, rr) * 0.3);
          }
        }
      }

      // Grey snowflake color: cool grey with slight warm grain
      vec3 grey = u_rosette_color.rgb;
      col = mix(col, grey * 0.45, clamp(roseEdge - rose, 0.0, 1.0));
      col = mix(col, grey, rose * 0.95);

      // --- Glassy polish: strong sharp highlight (obsidian is mirror-glossy) ---
      float band = dot(uv - 0.5, normalize(vec2(0.8, 0.6)));
      float gloss = exp(-band * band * 30.0);
      col += gloss * 0.10 * (1.0 - rose * 0.7); // rosettes are matte

      float spot = pow(clamp(1.0 - length(uv - vec2(0.3, 0.72)) * 2.6, 0.0, 1.0), 3.0);
      col += spot * 0.12 * (1.0 - rose * 0.7);

      // Glass micro-sparkle
      float spark = pow(hash(floor(uv * 350.0)), 30.0);
      col += spark * 0.25 * (1.0 - rose);

      col += (hash(uv * 800.0) - 0.5) * 0.012;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_rosette_scale',   name: 'Rosette Scale',   type: 'float', min: 2.0, max: 14.0, default: 5.0 },
    { id: 'u_rosette_density', name: 'Rosette Density', type: 'float', min: 0.1, max: 1.0,  default: 0.45 },
    { id: 'u_rosette_color',   name: 'Snowflake Grey',  type: 'color', default: [0.62, 0.63, 0.60, 1.0] }
  ]
};
