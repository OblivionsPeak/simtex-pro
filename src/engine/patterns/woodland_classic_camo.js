export default {
  id: 'woodland_classic_camo',
  name: 'Woodland Classic Camo',
  category: 'Organic',
  description: 'Classic M81 style camouflage with large organic blobs overlapping each other.',
  shader: `
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
    
    float fbm(vec2 x) {
      float v = 0.0;
      float a = 0.5;
      vec2 shift = vec2(100.0);
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
      for (int i = 0; i < 4; ++i) {
        v += a * snoise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
      }
      return v;
    }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      
      float n1 = fbm(uv);
      float n2 = fbm(uv + vec2(5.2, 1.3));
      float n3 = fbm(uv + vec2(10.1, -3.4));
      
      vec4 color = u_color_base;
      if (n1 > 0.1) color = u_color_1;
      if (n2 > 0.3) color = u_color_2;
      if (n3 > 0.5) color = u_color_3;
      
      return color;
    }
  `,
  variants: [
    {
      name: 'Classic Woodland',
      uniforms: {
        u_color_base: [0.63, 0.56, 0.45, 1.0], // Tan
        u_color_1: [0.28, 0.35, 0.22, 1.0],    // Green
        u_color_2: [0.35, 0.26, 0.18, 1.0],    // Brown
        u_color_3: [0.08, 0.08, 0.08, 1.0]     // Black
      }
    },
    {
      name: 'Desert Recon',
      uniforms: {
        u_color_base: [0.82, 0.75, 0.61, 1.0],
        u_color_1: [0.73, 0.62, 0.47, 1.0],
        u_color_2: [0.55, 0.44, 0.31, 1.0],
        u_color_3: [0.35, 0.25, 0.15, 1.0]
      }
    },
    {
      name: 'Urban Stealth',
      uniforms: {
        u_color_base: [0.70, 0.70, 0.75, 1.0],
        u_color_1: [0.45, 0.45, 0.50, 1.0],
        u_color_2: [0.25, 0.25, 0.30, 1.0],
        u_color_3: [0.10, 0.10, 0.12, 1.0]
      }
    },
    {
      name: 'Blackout Stealth',
      uniforms: {
        u_color_base: [0.12, 0.12, 0.14, 1.0],
        u_color_1: [0.08, 0.08, 0.10, 1.0],
        u_color_2: [0.04, 0.04, 0.05, 1.0],
        u_color_3: [0.01, 0.01, 0.01, 1.0]
      }
    }
  ],
  uniforms: [
    { id: 'u_scale', name: 'Pattern Scale', type: 'float', min: 1.0, max: 20.0, default: 5.0 },
    { id: 'u_color_base', name: 'Base (Tan)', type: 'color', default: [0.63, 0.56, 0.45, 1.0] },
    { id: 'u_color_1', name: 'Layer 1 (Green)', type: 'color', default: [0.28, 0.35, 0.22, 1.0] },
    { id: 'u_color_2', name: 'Layer 2 (Brown)', type: 'color', default: [0.35, 0.26, 0.18, 1.0] },
    { id: 'u_color_3', name: 'Layer 3 (Black)', type: 'color', default: [0.08, 0.08, 0.08, 1.0] }
  ]
};
