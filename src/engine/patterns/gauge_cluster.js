export default {
  id: 'gauge_cluster_artisan',
  name: 'Gauge Finish',
  category: 'Racing',
  description: 'Concentric circular brushed finish found on high-end analog gauge clusters and trim panels.',
  shader: `
    vec4 generate() {
      float d = length(v_uv - 0.5);
      float rings = sin(d * 1000.0);
      float mask = smoothstep(-0.5, 0.5, rings);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Brushed Rim', type: 'color', default: [0.8, 0.8, 0.85, 1.0] },
    { id: 'u_secondary_color', name: 'Brushed Deep', type: 'color', default: [0.5, 0.5, 0.55, 1.0] }
  ]
};
