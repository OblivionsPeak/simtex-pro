export default {
  id: 'tech_hex_v2_artisan',
  name: 'Tech Hex v2',
  category: 'Technology',
  description: 'Advanced geometric hex-grid with internal subdivided offsets for sci-fi panels.',
  shader: `
    vec2 hexCoords(vec2 uv) {
      vec2 r = vec2(1.0, 1.73);
      vec2 h = r * 0.5;
      vec2 a = mod(uv, r) - h;
      vec2 b = mod(uv - h, r) - h;
      return length(a) < length(b) ? a : b;
    }
    vec4 generate() {
      vec2 gv = hexCoords(v_uv * u_scale);
      float mask = smoothstep(0.45, 0.42, length(gv));
      float inner = smoothstep(0.3, 0.28, length(gv));
      return mix(u_secondary_color, u_primary_color, mask - inner);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Module Count', type: 'float', min: 2.0, max: 20.0, default: 10.0 },
    { id: 'u_primary_color', name: 'Housing', type: 'color', default: [0.0, 0.8, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Frame', type: 'color', default: [0.05, 0.05, 0.08, 1.0] }
  ]
};
