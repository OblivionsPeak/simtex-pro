export default {
  id: 'moorish_zellige',
  name: 'Moorish Zellige',
  category: 'Architecture',
  added: '2026-06-12',
  description: 'Eight-fold star-and-cross zellige mosaic — hand-cut glazed clay in the Fez manner, every piece a slightly different depth of glaze, set into pale gypsum with chisel-soft edges.',
  shader: `
    float hash_mzl(vec2 p) {
      return fract(sin(dot(p, vec2(133.7, 219.5))) * 44721.3595);
    }

    // signed-ish distance inside an 8-pointed star (two squares at 45 deg)
    // centred at origin, outer size s. Negative inside.
    float star8_mzl(vec2 p, float s) {
      vec2 a = abs(p);
      float sq1 = max(a.x, a.y) - s;                    // axis square
      float sq2 = (a.x + a.y) * 0.70710678 - s;         // rotated square
      return min(sq1, sq2);                             // union = 8-point star
    }

    vec4 generate() {
      float n = floor(u_star_count + 0.5);
      vec2 uv = v_uv * n;
      vec2 cell = mod(floor(uv), n);
      vec2 f = fract(uv) - 0.5;

      float starSize = 0.30;

      // stars sit at cell centres AND cell corners (offset lattice),
      // crosses fill the space between
      float dC = star8_mzl(f, starSize);
      vec2 corner = vec2(f.x - 0.5 * sign(f.x + 0.0001), f.y - 0.5 * sign(f.y + 0.0001));
      float dK = star8_mzl(corner, starSize);
      float dStar = min(dC, dK);

      // which star claimed this pixel (for per-piece glaze)
      vec2 starId = (dC < dK) ? cell : cell + sign(f) * 0.5;

      float jointW = 0.022;
      float inStar = smoothstep(jointW, -jointW, dStar);
      float joint = 1.0 - smoothstep(jointW * 0.5, jointW * 1.6, abs(dStar));

      // --- piece colours ---
      vec3 starGlaze  = u_star_color.rgb;
      vec3 crossGlaze = u_cross_color.rgb;

      // each star is one hand-glazed piece: its own depth of colour
      float dip = hash_mzl(starId * 1.31 + 5.0);
      vec3 sCol = starGlaze * (0.78 + dip * 0.45);

      // crosses are cut into four arms; tint each arm independently
      vec2 armId = floor((f + 0.5) * 2.0) + cell * 2.0;
      float armDip = hash_mzl(armId * 0.77 + 11.0);
      vec3 cCol = crossGlaze * (0.80 + armDip * 0.40);

      vec3 glaze = mix(cCol, sCol, inStar);

      // --- glaze material depth ---
      // pooling: colour deepens toward each piece's centre where glaze is thick
      float pieceDepth = clamp(-dStar * 6.0, 0.0, 1.0);
      float pool = inStar > 0.5 ? pieceDepth : clamp(dStar * 6.0, 0.0, 1.0);
      glaze *= 0.88 + pool * 0.18;

      // kiln speckle and pinholes in the glaze
      glaze *= 0.95 + noise(uv * 55.0) * 0.09;
      float pin = step(0.982, hash_mzl(floor(uv * 90.0)));
      glaze = mix(glaze, glaze * 0.6, pin * 0.7);

      // wet-glass specular: a soft window reflection on each piece,
      // angled differently because hand-set pieces never sit flat
      float tiltA = hash_mzl(starId + 23.0) * 6.2831;
      vec2 tilt = vec2(cos(tiltA), sin(tiltA));
      float spec = exp(-10.0 * pow(dot(f, tilt) - 0.12, 2.0));
      glaze += vec3(1.0) * spec * 0.16 * (0.4 + dip * 0.6);

      // hand-cut chisel edge: a bright bevel just inside every joint
      float bevel = smoothstep(jointW * 2.6, jointW * 1.2, abs(dStar))
                  * smoothstep(jointW * 0.6, jointW * 1.2, abs(dStar));
      glaze += glaze * bevel * 0.30;

      // --- gypsum joint ---
      vec3 gypsum = vec3(0.78, 0.74, 0.67);
      gypsum *= 0.85 + noise(uv * 90.0) * 0.22;        // crumbly mortar grain
      gypsum *= 0.75;                                  // joints sit recessed in shadow

      vec3 col = mix(glaze, gypsum, joint);

      // faint overall age patina pooling across the panel
      float age = fbm(v_uv * 4.0) * 0.5 + 0.5;
      col *= 0.93 + age * 0.10;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_star_count',  name: 'Star Scale',  type: 'float', min: 2.0, max: 12.0, default: 5.0 },
    { id: 'u_star_color',  name: 'Star Glaze',  type: 'color', default: [0.09, 0.32, 0.36, 1.0] },
    { id: 'u_cross_color', name: 'Cross Glaze', type: 'color', default: [0.88, 0.83, 0.72, 1.0] }
  ]
};
