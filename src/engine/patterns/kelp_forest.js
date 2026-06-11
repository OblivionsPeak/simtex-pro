export default {
  id: 'kelp_forest',
  name: 'Kelp Forest',
  category: 'Ocean',
  added: '2026-06-11',
  description: 'Sinuous kelp stalks with fluttering blades rising through teal water, layered into hazy depth under slanting light shafts.',
  shader: `
    // One depth layer of kelp: returns stalk+blade mask for a column field
    float kelp_layer_klp(vec2 uv, float count, float sway, float seed) {
      float xc = uv.x * count;
      float col_id = floor(xc);
      float fx = fract(xc) - 0.5;
      float h = hash(vec2(col_id, seed));
      if (h < 0.35) return 0.0; // some columns empty — forest, not a fence

      // stalk centreline weaves with height
      float weave = sin(uv.y * (5.0 + h * 6.0) + h * 31.0) * sway
                  + snoise(vec2(col_id * 3.7 + seed, uv.y * 2.0)) * sway * 0.6;
      float d = fx - weave;

      // stipe: thin continuous stalk
      float stipe = smoothstep(0.035, 0.012, abs(d));

      // blades: lobes alternating left/right along the stalk
      float seg = uv.y * (9.0 + h * 4.0) + h * 17.0;
      float si = floor(seg);
      float sf = fract(seg);
      float side = mod(si, 2.0) < 1.0 ? 1.0 : -1.0;
      // blade reaches out from stalk, widest mid-segment, ragged tip
      float reach = (0.10 + 0.10 * hash(vec2(col_id, si + seed)))
                  * sin(sf * 3.14159);
      float bd = d * side; // distance on the blade side
      float blade = smoothstep(reach, reach * 0.2, bd) * step(0.0, bd)
                  * smoothstep(0.0, 0.15, sf) * smoothstep(1.0, 0.85, sf);
      // blade ruffle
      blade *= 0.7 + 0.3 * snoise(vec2(seg * 4.0, col_id + seed));

      return clamp(stipe + blade * 0.9, 0.0, 1.0);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- water column: darker at the bottom, hazier behind ---
      vec3 water = u_water_color.rgb;
      vec3 col = mix(water * 0.45, water * 1.25, uv.y);
      col += (fbm(uv * 5.0) * 0.5 + 0.5) * water * 0.15; // drifting murk

      // slanting light shafts from the surface
      float shaft = noise(vec2((uv.x + uv.y * 0.35) * 6.0, 0.5));
      shaft = pow(shaft, 3.0) * uv.y;
      col += u_light_color.rgb * shaft * 0.35;

      // --- three kelp layers, back to front ---
      vec3 kelp_far  = mix(water, vec3(0.10, 0.22, 0.16), 0.55);
      vec3 kelp_mid  = vec3(0.13, 0.30, 0.14);
      vec3 kelp_near = vec3(0.20, 0.38, 0.12);

      float k1 = kelp_layer_klp(uv + vec2(0.13, 0.0), u_stalks * 1.6, u_sway * 0.7, 3.0);
      col = mix(col, kelp_far, k1 * 0.6);

      float k2 = kelp_layer_klp(uv + vec2(0.41, 0.0), u_stalks * 1.2, u_sway * 0.85, 7.0);
      col = mix(col, kelp_mid, k2 * 0.85);

      float k3 = kelp_layer_klp(uv, u_stalks, u_sway, 11.0);
      // foreground kelp catches rim light on its top edges
      vec3 lit = kelp_near + u_light_color.rgb * shaft * 0.5;
      col = mix(col, lit, k3);

      // pneumatocysts: tiny gas bladders glinting on near stalks
      float bub = step(0.97, hash(floor(uv * vec2(u_stalks * 6.0, 40.0)))) * k3;
      col += vec3(0.5, 0.6, 0.4) * bub;

      // floating detritus specks
      col += vec3(0.25, 0.3, 0.28) * step(0.992, hash(floor(uv * 160.0))) * 0.5;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_stalks',      name: 'Stalk Count', type: 'float', min: 3.0, max: 14.0, default: 7.0 },
    { id: 'u_sway',        name: 'Current Sway', type: 'float', min: 0.0, max: 0.25, default: 0.10 },
    { id: 'u_water_color', name: 'Water Color', type: 'color', default: [0.03, 0.20, 0.24, 1.0] },
    { id: 'u_light_color', name: 'Light Shafts', type: 'color', default: [0.55, 0.85, 0.75, 1.0] }
  ]
};
