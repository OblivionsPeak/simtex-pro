export default {
  id: 'multi_env_camo',
  name: 'Multi-Environment Camo',
  category: 'Organic',
  description: 'An advanced shader that uses smooth gradients and soft blending between layers rather than hard edges, creating a highly modern, versatile camouflage.',
  shader: `
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ; m = m*m ;
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
      float n2 = fbm(uv + vec2(12.3, 4.5));
      float n3 = fbm(uv * 2.0 + vec2(33.1, 11.2));
      
      // Use smoothstep to create smooth gradient transitions instead of hard cuts
      float blend1 = smoothstep(-0.2, 0.4, n1);
      float blend2 = smoothstep(0.1, 0.6, n2);
      float blend3 = smoothstep(0.2, 0.7, n3);
      
      vec4 color = mix(u_color_base, u_color_1, blend1);
      color = mix(color, u_color_2, blend2);
      
      // Add smaller, sharper dark/light accents
      float n4 = snoise(uv * 4.0);
      float n5 = snoise(uv * 4.0 + vec2(50.0));
      
      if (n4 > 0.5) {
          color = mix(color, u_color_3, smoothstep(0.5, 0.7, n4));
      }
      if (n5 > 0.6) {
          color = mix(color, u_color_4, smoothstep(0.6, 0.8, n5));
      }
      
      return color;
    }
  `,
  variants: [
    {
      name: 'Arid (Default)',
      uniforms: {
        u_color_base: [0.65, 0.60, 0.50, 1.0], // Base Tan
        u_color_1: [0.55, 0.50, 0.40, 1.0],    // Mid Tan
        u_color_2: [0.45, 0.40, 0.35, 1.0],    // Green-Brown
        u_color_3: [0.30, 0.25, 0.20, 1.0],    // Dark Brown Accent
        u_color_4: [0.80, 0.75, 0.65, 1.0]     // Light Cream Accent
      }
    },
    {
      name: 'Tropic',
      uniforms: {
        u_color_base: [0.35, 0.45, 0.25, 1.0],
        u_color_1: [0.25, 0.35, 0.15, 1.0],
        u_color_2: [0.15, 0.25, 0.10, 1.0],
        u_color_3: [0.05, 0.15, 0.05, 1.0],
        u_color_4: [0.55, 0.65, 0.40, 1.0]
      }
    },
    {
      name: 'Alpine',
      uniforms: {
        u_color_base: [0.85, 0.85, 0.90, 1.0],
        u_color_1: [0.70, 0.70, 0.75, 1.0],
        u_color_2: [0.55, 0.55, 0.60, 1.0],
        u_color_3: [0.30, 0.30, 0.35, 1.0],
        u_color_4: [0.95, 0.95, 1.00, 1.0]
      }
    },
    {
      name: 'Blackout Stealth',
      uniforms: {
        u_color_base: [0.15, 0.15, 0.15, 1.0],
        u_color_1: [0.12, 0.12, 0.12, 1.0],
        u_color_2: [0.09, 0.09, 0.09, 1.0],
        u_color_3: [0.05, 0.05, 0.05, 1.0],
        u_color_4: [0.25, 0.25, 0.25, 1.0]
      }
    }
  ],
  uniforms: [
    { id: 'u_scale', name: 'Blend Scale', type: 'float', min: 1.0, max: 20.0, default: 4.0 },
    { id: 'u_color_base', name: 'Base Color', type: 'color', default: [0.65, 0.60, 0.50, 1.0] },
    { id: 'u_color_1', name: 'Gradient 1', type: 'color', default: [0.55, 0.50, 0.40, 1.0] },
    { id: 'u_color_2', name: 'Gradient 2', type: 'color', default: [0.45, 0.40, 0.35, 1.0] },
    { id: 'u_color_3', name: 'Dark Accent', type: 'color', default: [0.30, 0.25, 0.20, 1.0] },
    { id: 'u_color_4', name: 'Light Accent', type: 'color', default: [0.80, 0.75, 0.65, 1.0] }
  ]
};
