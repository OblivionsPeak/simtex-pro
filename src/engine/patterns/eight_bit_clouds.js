export default {
  id: 'eight_bit_clouds',
  name: '8-Bit Clouds',
  category: 'Retro',
  added: '2026-06-11',
  description: 'Side-scroller sky straight off a 1985 cartridge — chunky white clouds with navy outlines and powder-blue undersides drifting over banded NES blue.',
  shader: `
    float cloudfield_ebc(vec2 p) {
      return noise(p * 1.5) * 0.60 + noise(p * 3.0 + 4.7) * 0.30 + noise(p * 6.0 + 9.3) * 0.10;
    }

    vec4 generate() {
      float px = u_pixels;
      vec2 pv = floor(v_uv * px) / px;       // hard pixel quantization
      float tx = 1.0 / px;

      float thresh = 1.0 - u_cover * 0.7;    // higher cover -> lower threshold
      float scale = 3.0;

      // cloud occupancy at this pixel and its 4-neighbours (for outlines)
      float c0 = step(thresh, cloudfield_ebc(pv * scale));
      float cn = step(thresh, cloudfield_ebc((pv + vec2(0.0,  tx)) * scale));
      float cs = step(thresh, cloudfield_ebc((pv + vec2(0.0, -tx)) * scale));
      float ce = step(thresh, cloudfield_ebc((pv + vec2( tx, 0.0)) * scale));
      float cw = step(thresh, cloudfield_ebc((pv + vec2(-tx, 0.0)) * scale));
      float cs2 = step(thresh, cloudfield_ebc((pv + vec2(0.0, -2.0 * tx)) * scale));

      // sky: hard-banded gradient, brighter near the top of each tile
      vec3 sky = u_sky_color.rgb;
      float band = floor(fract(pv.y) * 6.0) / 5.0;
      vec3 col = mix(sky * 0.80, sky * 1.10, band);

      // distant cloud layer: smaller puffs, mixed halfway into the sky
      float far = step(thresh + 0.06, cloudfield_ebc(pv * scale * 2.3 + 17.0));
      col = mix(col, mix(col, vec3(1.0), 0.5), far);

      if (c0 > 0.5) {
        vec3 cloudTop   = vec3(0.99, 0.99, 1.00);
        vec3 cloudUnder = vec3(0.62, 0.78, 0.96);   // powder-blue shading
        vec3 outline    = vec3(0.07, 0.13, 0.38);   // navy keyline

        vec3 cloud = cloudTop;
        // underside shading: two pixels above the open sky
        if (cs2 < 0.5 || cs < 0.5) cloud = cloudUnder;
        // hard 1px outline against any sky neighbour
        if (cn < 0.5 || cs < 0.5 || ce < 0.5 || cw < 0.5) cloud = outline;
        col = cloud;
      }

      // 8-bit dither speckle in the sky only (sparse single bright pixels)
      if (c0 < 0.5 && far < 0.5) {
        float spark = hash(floor(v_uv * px) + 0.7);
        if (spark > 0.992) col = mix(col, vec3(1.0), 0.6);
      }

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_pixels', name: 'Pixel Grid', type: 'float', min: 24.0, max: 96.0, default: 48.0 },
    { id: 'u_cover', name: 'Cloud Cover', type: 'float', min: 0.1, max: 1.0, default: 0.55 },
    { id: 'u_sky_color', name: 'Sky Blue', type: 'color', default: [0.36, 0.58, 0.98, 1.0] }
  ]
};
