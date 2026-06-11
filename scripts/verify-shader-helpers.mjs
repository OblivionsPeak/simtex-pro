// Verifies that every pattern shader, combined with the helper prelude that
// ShaderEngine injects, has exactly one definition for each GLSL helper it
// calls. Run after adding patterns or touching the prelude:
//   node scripts/verify-shader-helpers.mjs
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildHelperPrelude } from '../src/engine/ShaderEngine.js';

const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, '../src/engine/patterns');
const HELPERS = ['hash', 'noise', 'permute', 'snoise', 'fbm'];

let bad = 0, checked = 0;
for (const f of readdirSync(dir).filter(x => x.endsWith('.js'))) {
  const p = (await import(`file://${join(dir, f)}`)).default;
  const full = buildHelperPrelude(p.shader) + p.shader;

  for (const name of HELPERS) {
    const calls = new RegExp(`\\b${name}\\s*\\(`).test(p.shader);
    const defs = [...full.matchAll(new RegExp(`(float|vec3)\\s+${name}\\s*\\([^)]*\\)\\s*\\{`, 'g'))];
    if (calls && defs.length === 0) {
      console.log(`MISSING   ${name} in ${f}`);
      bad++;
    }
    // Same-signature double definition would fail to compile
    const sigs = defs.map(d => d[0].replace(/\s+/g, ''));
    if (new Set(sigs).size !== sigs.length) {
      console.log(`DUPLICATE ${name} in ${f}`);
      bad++;
    }
  }
  checked++;
}
console.log(`${checked} patterns checked, ${bad} problems`);
process.exit(bad ? 1 : 0);
