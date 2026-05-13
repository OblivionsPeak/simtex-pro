export default {
  id: 'powder_coat',
  name: 'Powder Coat',
  category: 'Industrial',
  description: 'Powder coat finish with characteristic orange-peel micro-texture. Common on roll cages, wheel centres, and suspension components.',
  shader: `
    float hash_pc(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise_pc(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash_pc(i), hash_pc(i+vec2(1,0)), f.x),
                 mix(hash_pc(i+vec2(0,1)), hash_pc(i+vec2(1,1)), f.x), f.y);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Orange-peel: 3 octaves of noise at different scales
      // Creates the characteristic random bumpy surface
      float s = u_peel_scale;
      float n1 = noise_pc(uv * s);
      float n2 = noise_pc(uv * s * 2.1 + vec2(1.7, 3.3)) * 0.5;
      float n3 = noise_pc(uv * s * 4.3 + vec2(5.1, 2.8)) * 0.25;
      float peel = (n1 + n2 + n3) / 1.75;

      // Convert to surface normal approximation for shading
      // Sample nearby for gradient
      float dx = noise_pc(uv * s + vec2(0.002, 0.0)) - noise_pc(uv * s - vec2(0.002, 0.0));
      float dy = noise_pc(uv * s + vec2(0.0, 0.002)) - noise_pc(uv * s - vec2(0.0, 0.002));
      // Simple Lambertian diffuse from fixed light direction
      vec3 lightDir = normalize(vec3(-0.4, 0.6, 1.0));
      vec3 normal   = normalize(vec3(-dx * u_depth * 8.0, -dy * u_depth * 8.0, 1.0));
      float diffuse = max(0.0, dot(normal, lightDir));

      // Specular — powder coat is semi-matte so keep this subtle
      vec3 viewDir  = vec3(0.0, 0.0, 1.0);
      vec3 halfDir  = normalize(lightDir + viewDir);
      float spec    = pow(max(0.0, dot(normal, halfDir)), 12.0) * 0.08 * u_gloss;

      // Compose
      vec3 base  = u_coat_color.rgb;
      vec3 col   = base * (0.35 + diffuse * 0.65) + vec3(spec);

      // Micro specks — powder coat often has tiny metallic particles
      float speck = step(0.97, hash_pc(uv * 400.0)) * 0.15 * u_gloss;
      col += vec3(speck);

      return vec4(clamp(col, 0.0, 1.0), u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_coat_color',  name: 'Coat Colour',   type: 'color', default: [0.08, 0.08, 0.09, 1.0] },
    { id: 'u_peel_scale',  name: 'Peel Scale',    type: 'float', default: 60.0, min: 10.0, max: 150.0 },
    { id: 'u_depth',       name: 'Texture Depth', type: 'float', default: 0.6,  min: 0.0,  max: 1.0   },
    { id: 'u_gloss',       name: 'Gloss Level',   type: 'float', default: 0.4,  min: 0.0,  max: 1.0   },
  ]
};
