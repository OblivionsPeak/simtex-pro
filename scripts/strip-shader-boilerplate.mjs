// Removes copy-pasted GLSL helper functions (hash/noise/permute/snoise/fbm)
// from pattern files when they exactly match the canonical versions that
// ShaderEngine now injects automatically. Divergent implementations (custom
// constants, octave counts, etc.) are left untouched so no texture changes
// visually. Run: node scripts/strip-shader-boilerplate.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), '../src/engine/patterns');

// Collapse whitespace and normalize number literals (1 ≡ 1.0, 0.50 ≡ 0.5)
// so formatting-only differences still count as canonical.
const normalize = (s) =>
  s.replace(/\s+/g, '')
   .replace(/(\d+\.?\d*)/g, (n) => String(parseFloat(n)));

const CANONICAL = {
  hash: `float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }`,
  noise: `float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }`,
  permute: `vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }`,
  snoise: `float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ; m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }`,
  fbm: `float fbm(vec2 x) {
      float v = 0.0;
      float a = 0.5;
      vec2 shift = vec2(100.0);
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
      for (int i = 0; i < 4; ++i) {
        v += a * snoise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
      }
      return v;
    }`,
};
const NORM = Object.fromEntries(Object.entries(CANONICAL).map(([k, v]) => [k, normalize(v)]));

const SIGNATURES = {
  hash: /float\s+hash\s*\(\s*vec2[^)]*\)\s*\{/,
  noise: /float\s+noise\s*\(\s*vec2\s+\w+\s*\)\s*\{/,
  permute: /vec3\s+permute\s*\(/,
  snoise: /float\s+snoise\s*\(\s*vec2[^)]*\)\s*\{/,
  fbm: /float\s+fbm\s*\(/,
};

// Extract a full function block starting at the signature match by brace counting.
function extractBlock(src, startIdx) {
  const open = src.indexOf('{', startIdx);
  if (open === -1) return null;
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) return { start: startIdx, end: i + 1 };
    }
  }
  return null;
}

let filesChanged = 0, removed = 0, kept = 0;
const keptDetail = {};

for (const file of readdirSync(dir).filter(f => f.endsWith('.js'))) {
  const path = join(dir, file);
  let src = readFileSync(path, 'utf8');
  let changed = false;

  for (const [name, sig] of Object.entries(SIGNATURES)) {
    const m = src.match(sig);
    if (!m) continue;
    const block = extractBlock(src, m.index);
    if (!block) continue;
    const body = src.slice(block.start, block.end);
    if (normalize(body) === NORM[name]) {
      // Remove the block plus the trailing newline/indent that preceded it.
      let start = block.start;
      while (start > 0 && (src[start - 1] === ' ' || src[start - 1] === '\t')) start--;
      let end = block.end;
      if (src[end] === '\n') end++;
      src = src.slice(0, start) + src.slice(end);
      changed = true;
      removed++;
    } else {
      kept++;
      (keptDetail[name] ??= []).push(file);
    }
  }

  if (changed) {
    // Collapse any triple blank lines the removal left behind.
    src = src.replace(/\n{3,}/g, '\n\n');
    writeFileSync(path, src);
    filesChanged++;
  }
}

console.log(`Files changed: ${filesChanged}`);
console.log(`Helper blocks removed: ${removed}`);
console.log(`Divergent helpers kept in place: ${kept}`);
for (const [name, files] of Object.entries(keptDetail)) {
  console.log(`  ${name}: ${files.length} file(s)`);
}
