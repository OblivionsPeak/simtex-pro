const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../src/engine/patterns');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const packs = [
    { cat: 'Racing', name: 'Carbon Twill', id: 'carbon_twill', shader: 'vec3 generate() { float d = step(0.5, fract(v_uv.x * u_scale + v_uv.y * 0.5)); return mix(u_secondary_color, u_primary_color, d); }' },
    { cat: 'Industrial', name: 'Metal Brushed', id: 'metal_brushed', shader: 'vec3 generate() { float d = fract(sin(v_uv.x * 0.1) * u_scale); return mix(u_secondary_color, u_primary_color, d); }' },
    { cat: 'Technology', name: 'Nano Weave', id: 'tech_nano', shader: 'vec3 generate() { float d = step(0.9, sin(v_uv.x * u_scale) * cos(v_uv.y * u_scale)); return mix(u_secondary_color, u_primary_color, d); }' },
    { cat: 'Geometric', name: 'Lattice Grid', id: 'geo_grid', shader: 'vec3 generate() { vec2 g = fract(v_uv * u_scale); float d = step(0.95, max(g.x, g.y)); return mix(u_secondary_color, u_primary_color, d); }' },
    { cat: 'Natural', name: 'Stone Grit', id: 'nat_grit', shader: 'vec3 generate() { float d = fract(sin(dot(floor(v_uv * u_scale), vec2(12.9, 78.2))) * 43758.5); return mix(u_secondary_color, u_primary_color, d); }' }
];

// Restore core patterns
const core = [
    { id: 'forged_carbon', name: 'Forged Carbon', cat: 'Organic', desc: 'Randomized carbon shred pattern used in hypercars.', uniforms: [{ id: 'u_scale', name: 'Scale', type: 'float', min: 1.0, max: 20.0, default: 8.0 }], shader: 'float fbm(vec2 p) { float f = 0.0; float a = 0.5; for(int i=0; i<6; i++) { f += a * abs(sin(p.x + sin(p.y))); p *= 2.0; a *= 0.5; } return f; } vec3 generate() { vec2 uv = v_uv * u_scale; float n = fbm(uv * 3.0); float n2 = fbm(uv * 5.0 + n); float final = mix(n, n2, 0.5); return mix(u_secondary_color, u_primary_color, final); }' }
];

// Generate 200 variations
for (let i = 1; i <= 200; i++) {
    const pack = packs[i % packs.length];
    const id = `${pack.id}_${i}`;
    const name = `${pack.name} ${i}`;
    const scale = (10 + i * 0.5).toFixed(1);
    
    const content = `export default {
  id: '${id}',
  name: '${name}',
  category: '${pack.cat}',
  description: 'High-quality procedural ${pack.name.toLowerCase()} variation ${i}.',
  shader: \`${pack.shader}\`,
  uniforms: [
    { id: 'u_scale', name: 'Scale', type: 'float', min: 1.0, max: 1000.0, default: ${scale} },
    { id: 'u_primary_color', name: 'Primary', type: 'color', default: [0.35, 0.35, 0.4] },
    { id: 'u_secondary_color', name: 'Secondary', type: 'color', default: [0.1, 0.1, 0.12] }
  ]
};`;
    fs.writeFileSync(path.join(outDir, `${id}.js`), content);
}

// Write core
core.forEach(p => {
    const content = `export default {
  id: '${p.id}',
  name: '${p.name}',
  category: '${p.cat}',
  description: '${p.desc}',
  shader: \`${p.shader}\`,
  uniforms: ${JSON.stringify(p.uniforms, null, 2)}
};`;
    fs.writeFileSync(path.join(outDir, `${p.id}.js`), content);
});

console.log('Successfully generated 201 patterns.');
