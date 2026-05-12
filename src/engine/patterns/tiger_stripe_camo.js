export default {
  id: 'tiger_stripe_camo',
  name: 'Tiger Stripe Camo',
  category: 'Organic',
  description: 'Aggressive, horizontally flowing organic stripes characteristic of jungle warfare uniforms.',
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
    
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      
      // Stretch horizontally and add vertical noise to create tiger stripes
      vec2 distorted_uv = vec2(uv.x, uv.y * 5.0 + snoise(uv * 2.0) * 1.5);
      
      float n1 = snoise(distorted_uv);
      float n2 = snoise(distorted_uv * 1.5 + vec2(10.0, 5.0));
      float n3 = snoise(distorted_uv * 2.0 + vec2(20.0, 10.0));
      
      vec4 color = u_color_base;
      if (n1 > 0.2) color = u_color_1;
      if (n2 > 0.4) color = u_color_2;
      if (n3 > 0.5) color = u_color_3;
      
      return color;
    }
  `,
  variants: [
    {
      name: 'Jungle Tiger',
      uniforms: {
        u_color_base: [0.35, 0.38, 0.25, 1.0], // Olive Green
        u_color_1: [0.20, 0.25, 0.15, 1.0],    // Dark Green
        u_color_2: [0.45, 0.35, 0.20, 1.0],    // Brown
        u_color_3: [0.08, 0.08, 0.08, 1.0]     // Black
      }
    },
    {
      name: 'Desert Tiger',
      uniforms: {
        u_color_base: [0.85, 0.75, 0.55, 1.0],
        u_color_1: [0.65, 0.55, 0.40, 1.0],
        u_color_2: [0.45, 0.35, 0.25, 1.0],
        u_color_3: [0.25, 0.15, 0.10, 1.0]
      }
    },
    {
      name: 'Snow Tiger',
      uniforms: {
        u_color_base: [0.95, 0.95, 0.95, 1.0],
        u_color_1: [0.75, 0.75, 0.78, 1.0],
        u_color_2: [0.45, 0.45, 0.50, 1.0],
        u_color_3: [0.15, 0.15, 0.18, 1.0]
      }
    },
    {
      name: 'Blackout Stealth',
      uniforms: {
        u_color_base: [0.12, 0.12, 0.12, 1.0],
        u_color_1: [0.08, 0.08, 0.08, 1.0],
        u_color_2: [0.05, 0.05, 0.05, 1.0],
        u_color_3: [0.02, 0.02, 0.02, 1.0]
      }
    }
  ],
  uniforms: [
    { id: 'u_scale', name: 'Stripe Scale', type: 'float', min: 1.0, max: 20.0, default: 4.0 },
    { id: 'u_color_base', name: 'Base Color', type: 'color', default: [0.35, 0.38, 0.25, 1.0] },
    { id: 'u_color_1', name: 'Stripe 1', type: 'color', default: [0.20, 0.25, 0.15, 1.0] },
    { id: 'u_color_2', name: 'Stripe 2', type: 'color', default: [0.45, 0.35, 0.20, 1.0] },
    { id: 'u_color_3', name: 'Stripe 3', type: 'color', default: [0.08, 0.08, 0.08, 1.0] }
  ]
};
