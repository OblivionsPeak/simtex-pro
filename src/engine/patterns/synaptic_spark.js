export default {
  id: 'synaptic_spark_artisan',
  name: 'Synaptic Spark',
  category: 'Organic',
  description: 'A network of neurons and dendrites with high-contrast electrical impulses.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec2 random2( vec2 p ) {
        return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
    }
    float voronoi(vec2 x) {
        vec2 n = floor(x);
        vec2 f = fract(x);
        float res = 8.0;
        for(int j=-1; j<=1; j++)
        for(int i=-1; i<=1; i++) {
            vec2 b = vec2(i, j);
            vec2 r = vec2(b) - f + random2(n + b);
            float d = dot(r, r);
            res = min(res, d);
        }
        return sqrt(res);
    }
    vec4 generate() {
        vec2 uv = v_uv * u_scale;
        
        // Base Voronoi for cellular structure
        float v1 = voronoi(uv);
        float v2 = voronoi(uv + vec2(1.5));
        
        // Neurons (soma) are the inverted voronoi centers
        float soma = smoothstep(0.3, 0.1, v1);
        
        // Dendrites are the edges of the voronoi cells, warped by noise
        float warp = noise(uv * 5.0) * 0.2;
        float vWarp = voronoi(uv + warp);
        float dendrites = smoothstep(0.05, 0.0, abs(vWarp - 0.2));
        
        // Synaptic sparks (moving along dendrites)
        float sparkPhase = u_time * 2.0 + vWarp * 10.0;
        float spark = fract(sparkPhase);
        float sparkGlow = smoothstep(0.95, 1.0, spark) * dendrites;
        
        vec4 network = mix(u_bg_color, u_neuron_color, max(soma, dendrites * 0.5));
        
        return network + u_spark_color * sparkGlow * 2.0;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Network Scale', type: 'float', min: 2.0, max: 20.0, default: 6.0 },
    { id: 'u_bg_color', name: 'Brain Matter', type: 'color', default: [0.05, 0.02, 0.08, 1.0] },
    { id: 'u_neuron_color', name: 'Neurons', type: 'color', default: [0.4, 0.2, 0.6, 1.0] },
    { id: 'u_spark_color', name: 'Electrical Impulse', type: 'color', default: [0.4, 1.0, 1.0, 1.0] },
    { id: 'u_time', name: 'Synapse Fire', type: 'float', min: 0.0, max: 100.0, default: 0.0 }
  ]
};
