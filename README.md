# SimTex Pro

**Live app:** https://OblivionsPeak.github.io/simtex-pro

SimTex Pro is a procedural texture and pattern generator for sim racing liveries. Every pattern is a real-time WebGL shader — tweak colors, scale, rotation, and finish live, then export production-ready maps for iRacing and Trading Paints workflows. It pairs with the [Clearcoat livery editor](https://oblivionspeak.github.io/clearcoat/), which imports SimTex seamless exports directly as tiling patterns.

## Features

- **502 patterns across 14 categories** (Abstract, Architecture, Cosmos, Geology, Geometric, Heritage, Industrial, Natural, Ocean, Organic, Racing, Retro, Technology, Textile)
- Search and category filtering, including a **Favorites** category
- Newest-first sorting with **NEW** badges on recently added patterns
- **Presets** — save and recall named parameter setups (stored locally)
- **Undo/redo** for parameter changes
- **Master opacity** control
- **UV transform** — scale, rotation, offset, with a 2×2 tiling preview toggle
- **iRacing spec map mode** — R = metallic, G = roughness, matched to iRacing's channel layout
- Runs entirely in the browser — nothing to install

## Exports

| Output | Notes |
|---|---|
| PNG diffuse | Standard color texture |
| iRacing spec map | Metallic/roughness packed in R/G channels |
| Normal map | Derived from the pattern's height response |
| Export Set | One click: diffuse + spec + normal with matching filenames |
| Seamless tiling | Edge-blended output for tileable patterns (what Clearcoat imports) |

All exports available at **1K, 2K, or 4K** resolution.

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `Ctrl+Z` / `Ctrl+Y` | Undo / redo |
| `Ctrl+D` | Export current pattern |
| `Esc` | Clear search + category filter, or toggle sidebar |
| `↑` / `↓` | Navigate patterns |

## Development

```bash
git clone https://github.com/OblivionsPeak/simtex-pro.git
cd simtex-pro
npm install
npm run dev       # local dev server (Vite)
npm run build     # production web build
npm run deploy    # publish web app to GitHub Pages (gh-pages -d dist)
```

Patterns live in `src/engine/patterns/` — one file per pattern. Categories are derived from the pattern data itself, so adding a pattern with a new category automatically extends the filter UI. Before committing new patterns, run the shader verification tool:

```bash
node scripts/verify-shader-helpers.mjs   # or: npm run verify
```

It checks that every pattern's GLSL helpers resolve exactly once against the engine's injected prelude and that each pattern carries an `added` date for newest-first sorting.

## License & Support

MIT License. See `LICENSE` for details.

SimTex Pro is free. If it earns a place in your livery workflow, you can [support development on Ko-fi](https://ko-fi.com/metalprophecymedia).
