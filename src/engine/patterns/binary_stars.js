export default {
  id: 'binary_stars',
  name: 'Binary Stars',
  category: 'Cosmos',
  added: '2026-06-11',
  description: 'A close stellar pair locked in orbit — a fat amber giant and a fierce blue dwarf trading a glowing mass-transfer stream, each crowned with diffraction spikes.',
  shader: `
    float segDist_bns(vec2 p, vec2 a, vec2 b) {
      vec2 pa = p - a;
      vec2 ba = b - a;
      float h = clamp(dot(pa, ba) / max(dot(ba, ba), 0.0001), 0.0, 1.0);
      return length(pa - ba * h);
    }

    // Star with limb-darkened disc, corona, and 4-point diffraction spikes
    vec3 star_bns(vec2 d, float radius, vec3 coreCol, vec3 coronaCol) {
      float r = length(d);
      vec3 c = vec3(0.0);
      // Limb-darkened disc
      float disc = smoothstep(radius, radius * 0.55, r);
      float limb = 1.0 - 0.45 * pow(clamp(r / radius, 0.0, 1.0), 2.0);
      c += coreCol * disc * limb * 1.4;
      // Granulation boiling on the surface
      float gran = noise(d * (28.0 / radius)) * 0.5 + 0.5;
      c *= 0.88 + 0.18 * gran * disc;
      // Corona glow
      c += coronaCol * exp(-(r - radius) * (5.5 / radius)) * step(radius, r) * 0.55;
      c += coronaCol * exp(-r * (1.4 / radius)) * 0.10;
      // Diffraction spikes (+ shape)
      float spike = exp(-abs(d.x) * 90.0) + exp(-abs(d.y) * 90.0);
      c += coreCol * spike * exp(-r * (2.2 / radius)) * 0.5;
      return c;
    }

    vec4 generate() {
      vec2 uv = fract(v_uv) - 0.5;

      // Orbit axis tilted across the tile
      float ca = cos(0.5); float sa = sin(0.5);
      vec2 axis = vec2(ca, sa);
      float sep = u_separation * 0.5;

      vec2 posA = -axis * sep;          // primary: amber giant
      vec2 posB =  axis * sep;          // secondary: blue dwarf
      float radA = u_size_ratio * 0.16;
      float radB = 0.07;

      vec3 space = vec3(0.010, 0.010, 0.024);
      vec3 col = space;

      // Background stars
      vec2 sg = floor(v_uv * 90.0);
      float bgs = smoothstep(0.965, 1.0, hash(sg + 12.0)) *
                  smoothstep(0.09, 0.0, length(fract(v_uv * 90.0) - vec2(hash(sg), hash(sg + 33.0))));
      col += vec3(0.8, 0.85, 1.0) * bgs;

      // --- Mass-transfer stream: a glowing arc sagging between the pair ---
      // Approximate with segments along a curved path
      float streamGlow = 0.0;
      vec2 prev = posA + axis * radA * 0.8;
      for (int i = 1; i <= 6; i++) {
        float t = float(i) / 6.0;
        vec2 p = mix(posA + axis * radA * 0.8, posB - axis * radB * 0.9, t);
        // Sag perpendicular to the axis (orbital trailing curve)
        p += vec2(-axis.y, axis.x) * sin(t * 3.14159265) * sep * 0.35;
        float d = segDist_bns(uv, prev, p);
        streamGlow = max(streamGlow, exp(-d * d * 2200.0));
        prev = p;
      }
      float streamTex = 0.6 + 0.4 * noise(uv * 40.0 + 7.0);
      col += vec3(0.95, 0.55, 0.25) * streamGlow * streamTex * u_stream * 1.2;

      // Hot impact spot where the stream strikes the dwarf
      vec2 impact = posB - axis * radB * 0.9;
      col += vec3(1.0, 0.85, 0.6) * exp(-pow(length(uv - impact) / 0.03, 2.0)) * u_stream;

      // --- The two stars ---
      vec3 amberCore   = u_primary_color.rgb;
      vec3 amberCorona = amberCore * vec3(1.0, 0.75, 0.45);
      col += star_bns(uv - posA, radA, amberCore, amberCorona);

      vec3 blueCore   = vec3(0.72, 0.84, 1.0);
      vec3 blueCorona = vec3(0.35, 0.55, 1.0);
      col += star_bns(uv - posB, radB, blueCore, blueCorona);

      // Shared envelope: faint figure-eight haze around both
      float envA = exp(-pow(length(uv - posA) / (radA * 3.5), 2.0));
      float envB = exp(-pow(length(uv - posB) / (radB * 5.0), 2.0));
      col += vec3(0.30, 0.22, 0.30) * clamp(envA + envB, 0.0, 1.0) * 0.30;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_separation',    name: 'Separation',  type: 'float', min: 0.25, max: 0.85, default: 0.5 },
    { id: 'u_size_ratio',    name: 'Giant Size',  type: 'float', min: 0.6,  max: 2.0,  default: 1.0 },
    { id: 'u_stream',        name: 'Mass Stream', type: 'float', min: 0.0,  max: 2.0,  default: 1.0 },
    { id: 'u_primary_color', name: 'Giant Tint',  type: 'color', default: [1.0, 0.70, 0.35, 1.0] }
  ]
};
