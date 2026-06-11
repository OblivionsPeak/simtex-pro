export default {
  id: 'spider_lightning',
  name: 'Spider Lightning',
  category: 'Abstract',
  added: '2026-06-11',
  description: 'A spider web spun from lightning: jagged electric bolts radiate from a glowing core, linked by sagging arcs of plasma and branching micro-filaments. Static render — Trading Paints safe.',
  shader: `

    // Hot bolt core plus a soft electric halo around it
    float boltGlow(float dist, float thickness) {
      float core = smoothstep(thickness, thickness * 0.15, dist);
      float halo = exp(-dist * (22.0 / max(u_glow, 0.05)));
      return core + halo * 0.55;
    }

    vec4 generate() {
      vec2 uv = v_uv - 0.5;
      float d = length(uv);
      float ang = atan(uv.y, uv.x) / 6.28318530718 + 0.5; // 0..1 around the web

      // Jagged displacement fields — this is what turns clean geometry
      // into crackling electricity.
      float j1 = fbm(uv * u_chaos + vec2(13.7, 7.3));
      float j2 = fbm(uv * u_chaos * 1.7 + vec2(91.2, 33.8));

      // Radial bolts (web spokes)
      float spokeFrac = abs(fract(ang * u_strands + j1 * u_jitter) - 0.5) * 2.0;
      float spokeDist = spokeFrac * d * 6.28318 / u_strands;
      float spokes = boltGlow(spokeDist, u_thickness);

      // Concentric arcs that sag toward the centre between spokes,
      // like silk strands in a real web
      float sagMid = 1.0 - abs(fract(ang * u_strands) - 0.5) * 2.0;
      float ringField = d * u_rings + sagMid * sagMid * 0.35 + j2 * u_jitter * 3.0;
      float ringDist = abs(fract(ringField) - 0.5) / u_rings;
      float rings = boltGlow(ringDist, u_thickness);
      rings *= smoothstep(0.015, 0.07, d); // keep the core clean

      // Branching micro-arcs along noise zero-crossings
      float filaments = boltGlow(abs(snoise(uv * u_chaos * 3.0)) * 0.09, u_thickness * 0.5) * 0.3;

      float energy = spokes + rings + filaments;

      // Hot core where all the bolts converge
      energy += exp(-d * 14.0) * 1.2;

      vec4 color = u_color_bg;
      color = mix(color, u_color_glow, clamp(energy * 0.8, 0.0, 1.0));
      color = mix(color, u_color_bolt, clamp((energy - 0.75) * 1.6, 0.0, 1.0));
      color.rgb += vec3(1.0) * clamp((energy - 1.5) * 0.7, 0.0, 0.55); // white-hot peaks

      return vec4(color.rgb, color.a);
    }
  `,
  variants: [
    {
      name: 'Storm Blue',
      uniforms: {
        u_color_bolt: [0.85, 0.95, 1.00, 1.0],
        u_color_glow: [0.15, 0.45, 1.00, 1.0],
        u_color_bg: [0.01, 0.02, 0.06, 1.0]
      }
    },
    {
      name: 'Plasma Purple',
      uniforms: {
        u_color_bolt: [0.95, 0.85, 1.00, 1.0],
        u_color_glow: [0.55, 0.20, 0.95, 1.0],
        u_color_bg: [0.03, 0.01, 0.06, 1.0]
      }
    },
    {
      name: 'Venom Green',
      uniforms: {
        u_color_bolt: [0.90, 1.00, 0.85, 1.0],
        u_color_glow: [0.25, 0.90, 0.20, 1.0],
        u_color_bg: [0.01, 0.04, 0.01, 1.0]
      }
    },
    {
      name: 'Hellfire',
      uniforms: {
        u_color_bolt: [1.00, 0.95, 0.75, 1.0],
        u_color_glow: [1.00, 0.35, 0.05, 1.0],
        u_color_bg: [0.05, 0.01, 0.01, 1.0]
      }
    }
  ],
  uniforms: [
    { id: 'u_strands', name: 'Web Strands', type: 'float', min: 4.0, max: 24.0, default: 12.0 },
    { id: 'u_rings', name: 'Web Rings', type: 'float', min: 2.0, max: 16.0, default: 6.0 },
    { id: 'u_chaos', name: 'Bolt Chaos', type: 'float', min: 1.0, max: 10.0, default: 3.5 },
    { id: 'u_jitter', name: 'Bolt Jitter', type: 'float', min: 0.0, max: 0.6, default: 0.16 },
    { id: 'u_thickness', name: 'Bolt Thickness', type: 'float', min: 0.001, max: 0.02, default: 0.004 },
    { id: 'u_glow', name: 'Glow Radius', type: 'float', min: 0.1, max: 3.0, default: 1.0 },
    { id: 'u_color_bolt', name: 'Bolt Core', type: 'color', default: [0.85, 0.95, 1.0, 1.0] },
    { id: 'u_color_glow', name: 'Electric Glow', type: 'color', default: [0.15, 0.45, 1.0, 1.0] },
    { id: 'u_color_bg', name: 'Background', type: 'color', default: [0.01, 0.02, 0.06, 1.0] }
  ]
};
