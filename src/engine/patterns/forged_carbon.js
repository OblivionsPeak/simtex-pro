export default {
  id: 'forged_carbon',
  name: 'Forged Carbon',
  category: 'Organic',
  description: 'Randomized carbon shred pattern used in hypercars.',
  shader: `float fbm(vec2 p) { float f = 0.0; float a = 0.5; for(int i=0; i<6; i++) { f += a * abs(sin(p.x + sin(p.y))); p *= 2.0; a *= 0.5; } return f; } vec3 generate() { vec2 uv = v_uv * u_scale; float n = fbm(uv * 3.0); float n2 = fbm(uv * 5.0 + n); float final = mix(n, n2, 0.5); return mix(u_secondary_color, u_primary_color, final); }`,
  uniforms: [
  {
    "id": "u_scale",
    "name": "Scale",
    "type": "float",
    "min": 1,
    "max": 20,
    "default": 8
  }
]
};