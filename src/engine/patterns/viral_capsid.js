export default {
  id: 'viral_capsid_artisan',
  name: 'Viral Capsid',
  category: 'Organic',
  description: 'Geometric, icosahedral protein structures interlocking to form complex biological shells.',
  shader: `
    // Hexagonal grid basis to simulate icosahedral unwrapping
    float hexDist(vec2 p) {
      p = abs(p);
      float c = dot(p, normalize(vec2(1.0, 1.732)));
      return max(c, p.x);
    }
    vec2 hexCoords(vec2 uv) {
      vec2 r = vec2(1.0, 1.732);
      vec2 h = r * 0.5;
      vec2 a = mod(uv, r) - h;
      vec2 b = mod(uv - h, r) - h;
      vec2 gv = dot(a, a) < dot(b,b) ? a : b;
      return gv;
    }
    vec4 generate() {
        vec2 uv = v_uv * u_scale;
        
        vec2 gv = hexCoords(uv);
        float d = hexDist(gv);
        
        // Protein subunits (hexamers and pentamers)
        // Divide each hex into 6 triangles
        float angle = atan(gv.y, gv.x);
        float sector = floor(angle / (3.14159 / 3.0));
        
        // Add internal detail per sector
        float innerDist = length(gv);
        float subunit = smoothstep(0.45, 0.4, innerDist) - smoothstep(0.15, 0.1, innerDist);
        
        // Spike proteins at the center of some hexes
        float spikeMask = smoothstep(0.1, 0.05, innerDist);
        
        // Ambient occlusion on edges
        float edgeAO = smoothstep(0.5, 0.4, d);
        
        // Viral envelope color
        vec4 capsidLayer = mix(u_shell_dark, u_shell_light, subunit * edgeAO);
        
        // Add spike protein color
        return mix(capsidLayer, u_spike_color, spikeMask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Capsid Scale', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_shell_dark', name: 'Capsid Shadow', type: 'color', default: [0.1, 0.2, 0.15, 1.0] },
    { id: 'u_shell_light', name: 'Capsid Surface', type: 'color', default: [0.4, 0.7, 0.5, 1.0] },
    { id: 'u_spike_color', name: 'Spike Protein', type: 'color', default: [0.8, 0.2, 0.3, 1.0] }
  ]
};
