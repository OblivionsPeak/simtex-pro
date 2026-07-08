export default {
  id: 'race_tape',
  name: 'Race Tape Repair',
  category: 'Racing',
  added: '2026-07-07',
  description: 'Strips of 100-mph tape slapped across the bodywork — battle damage patched in the pits.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec4 col = u_secondary_color;
      // paint scuffing under the tape
      col.rgb *= 0.94 + 0.06 * snoise(uv * 3.0);
      for (int i = 0; i < 7; i++) {
        float fi = float(i);
        float ang = hash(vec2(fi, 1.7)) * 3.14159;
        vec2 dir = vec2(cos(ang), sin(ang));
        vec2 ctr = vec2(hash(vec2(fi, 4.2)), hash(vec2(fi, 8.8))) * u_scale;
        vec2 rel = uv - ctr;
        float along = dot(rel, dir);
        float across = dot(rel, vec2(-dir.y, dir.x));
        float len = 0.8 + hash(vec2(fi, 3.3)) * 1.6;
        float wid = 0.14 + hash(vec2(fi, 5.5)) * 0.08;
        float strip = step(abs(along), len) * step(abs(across), wid);
        if (strip > 0.5) {
          vec4 tape = u_primary_color;
          // ragged torn ends
          float tear = step(abs(along), len - 0.08 * hash(vec2(floor(across * 30.0), fi)));
          // fabric weave of the tape + edge shadow
          tape.rgb *= 0.9 + 0.1 * sin(along * 90.0) * sin(across * 90.0);
          tape.rgb *= 0.75 + 0.25 * smoothstep(wid, wid * 0.7, abs(across));
          col = mix(col, tape, tear * u_opacity_tape);
        }
      }
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Coverage Scale', type: 'float', min: 1.0, max: 8.0, default: 3.0 },
    { id: 'u_opacity_tape', name: 'Tape Opacity', type: 'float', min: 0.4, max: 1.0, default: 0.95 },
    { id: 'u_primary_color', name: 'Tape', type: 'color', default: [0.75, 0.75, 0.76, 1.0] },
    { id: 'u_secondary_color', name: 'Bodywork', type: 'color', default: [0.85, 0.1, 0.1, 1.0] }
  ],
  variants: [
    { name: 'Silver on Red', uniforms: { u_primary_color: [0.75, 0.75, 0.76, 1.0], u_secondary_color: [0.85, 0.1, 0.1, 1.0], u_opacity_tape: 0.95 } },
    { name: 'Black on White', uniforms: { u_primary_color: [0.12, 0.12, 0.13, 1.0], u_secondary_color: [0.93, 0.93, 0.9, 1.0], u_opacity_tape: 0.95 } },
    { name: 'Blue Painters', uniforms: { u_primary_color: [0.15, 0.35, 0.75, 1.0], u_secondary_color: [0.2, 0.2, 0.22, 1.0], u_opacity_tape: 0.9 } }
  ]
};
