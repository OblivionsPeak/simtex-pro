import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { ShaderEngine } from './engine/ShaderEngine';
import { PATTERNS, CATEGORIES } from './engine/patterns';
import { loadThumbs, saveThumbs } from './engine/thumbCache';
import { Download, Layers, Shield, Settings, Zap, Info, Maximize, Search, X, Star, Send } from 'lucide-react';
import pkg from '../package.json';

const APP_VERSION = pkg.version;

// Built-in seamless materials (FLUX-generated, shipped in public/textures).
// Loaded into the Custom Image pattern — every tool (tiling, spec/normal map,
// adjustments) then works on them.
const STUDIO_TEXTURES = [
  { id: 'carbon-twill', name: 'Carbon Twill' },
  { id: 'forged-carbon', name: 'Forged Carbon' },
  { id: 'woodland-camo', name: 'Woodland Camo' },
  { id: 'desert-camo', name: 'Desert Camo' },
  { id: 'digital-camo', name: 'Digital Camo' },
  { id: 'urban-camo', name: 'Urban Camo' },
  { id: 'brushed-alu', name: 'Brushed Aluminium' },
  { id: 'diamond-plate', name: 'Diamond Plate' },
  { id: 'hammered-ti', name: 'Hammered Titanium' },
  { id: 'hydro-dip', name: 'Hydro Dip' },
  { id: 'liquid-marble', name: 'Liquid Marble' },
  { id: 'galaxy', name: 'Galaxy Nebula' },
  { id: 'geo-facets', name: 'Geo Facets' },
  { id: 'snakeskin', name: 'Snakeskin' },
  { id: 'cracked-lava', name: 'Cracked Lava' },
  { id: 'circuit', name: 'Circuit Board' },
  { id: 'candy-flake', name: 'Candy Flake' },
  { id: 'pearl-white', name: 'Pearl White' },
  { id: 'chameleon', name: 'Chameleon' },
  { id: 'liquid-chrome', name: 'Liquid Chrome' },
  { id: 'kevlar-weave', name: 'Kevlar Weave' },
  { id: 'red-carbon', name: 'Red Carbon' },
  { id: 'carbon-kevlar', name: 'Carbon-Kevlar' },
  { id: 'tiger-camo', name: 'Tiger Stripe' },
  { id: 'arctic-camo', name: 'Arctic Camo' },
  { id: 'splinter-camo', name: 'Splinter Camo' },
  { id: 'damascus', name: 'Damascus Steel' },
  { id: 'rose-gold', name: 'Rose Gold' },
  { id: 'gunmetal-hex', name: 'Gunmetal Hex' },
  { id: 'holographic', name: 'Holographic' },
  { id: 'plasma', name: 'Plasma' },
  { id: 'rust-patina', name: 'Rust Patina' },
];

// Patterns added within the last 21 days get a NEW badge
const NEW_BADGE_CUTOFF = new Date(Date.now() - 21 * 86400000).toISOString().slice(0, 10);

const rgbToHex = (rgb) => {
  const toHex = (c) => Math.round(c * 255).toString(16).padStart(2, '0');
  return `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}`;
};

const hexToRgb = (hex, alpha = 1.0) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b, alpha];
};

// Typed hex + RGB (0-255) inputs, two-way synced with the color swatch.
// The hex field shows a local draft while focused so external updates
// don't clobber it mid-keystroke; only valid 6-digit hex commits.
const ColorValueInputs = ({ value, onChange }) => {
  const rgba = value || [1, 1, 1, 1];
  const canonicalHex = rgbToHex(rgba).toUpperCase();
  const [hexDraft, setHexDraft] = useState(canonicalHex);
  const [isHexFocused, setIsHexFocused] = useState(false);
  const displayHex = isHexFocused ? hexDraft : canonicalHex;

  const handleHexChange = (raw) => {
    setHexDraft(raw);
    const cleaned = raw.trim().replace(/^#/, '');
    if (/^[0-9a-fA-F]{6}$/.test(cleaned)) {
      onChange(hexToRgb(`#${cleaned}`, rgba[3]));
    }
  };

  const handleChannelChange = (index, raw) => {
    const parsed = parseInt(raw, 10);
    if (Number.isNaN(parsed)) return;
    const clamped = Math.min(255, Math.max(0, parsed));
    const next = [...rgba];
    next[index] = clamped / 255;
    onChange(next);
  };

  return (
    <div className="color-value-row">
      <input
        type="text"
        className="hex-input"
        value={displayHex}
        maxLength={7}
        spellCheck={false}
        onFocus={() => {
          setHexDraft(canonicalHex);
          setIsHexFocused(true);
        }}
        onChange={(e) => handleHexChange(e.target.value)}
        onBlur={() => setIsHexFocused(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur();
        }}
      />
      {['R', 'G', 'B'].map((label, i) => (
        <label key={label} className="rgb-field">
          <span>{label}</span>
          <input
            type="number"
            min="0"
            max="255"
            value={Math.round(rgba[i] * 255)}
            onChange={(e) => handleChannelChange(i, e.target.value)}
          />
        </label>
      ))}
    </div>
  );
};

function App() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const [activePattern, setActivePattern] = useState(PATTERNS[0]);
  const [uniforms, setUniforms] = useState({});
  const [isSpecMap, setIsSpecMap] = useState(false);
  const [resolution, setResolution] = useState(2048);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isElectron = window.electronAPI !== undefined;

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortNewest, setSortNewest] = useState(false);

  // Update State
  const [, setUpdateStatus] = useState('');
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdateReady, setIsUpdateReady] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [updateLog, setUpdateLog] = useState([]);
  const [masterOpacity, setMasterOpacity] = useState(1.0);

  // Bug 1 fix: ref keeps masterOpacity in sync for use inside updateShader closure
  const masterOpacityRef = useRef(1.0);

  // Feature A: Favorites
  const [favorites, setFavorites] = useState(() =>
    JSON.parse(localStorage.getItem('simtex_favorites') || '[]')
  );

  // Feature B: Presets
  const [presets, setPresets] = useState(() =>
    JSON.parse(localStorage.getItem('simtex_presets') || '[]')
  );
  const [presetNameInput, setPresetNameInput] = useState('');
  const [isNamingPreset, setIsNamingPreset] = useState(false);

  // Feature C: Undo/Redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  // Slider drags are debounced into a single history entry
  const historyTimerRef = useRef(null);

  // Thumbnails: pattern id -> dataURL, generated progressively after mount
  const [thumbs, setThumbs] = useState({});

  // Seamless tiling export
  const [seamlessExport, setSeamlessExport] = useState(false);

  // Clearcoat bridge: opened as a popup from Clearcoat with ?bridge=clearcoat,
  // we can postMessage seamless exports straight back to the opener window
  const [isBridgeMode] = useState(() =>
    new URLSearchParams(window.location.search).get('bridge') === 'clearcoat' && !!window.opener
  );
  const [bridgeStatus, setBridgeStatus] = useState('idle'); // idle | sending | sent | error
  const bridgeTimerRef = useRef(null);

  // Name of the last-applied variant of the active pattern (null = base look);
  // cleared on pattern change / preset load, used to label bridge sends
  const [activeVariantName, setActiveVariantName] = useState(null);

  // Custom image pattern: name of the loaded file (texture lives in the
  // engine for the whole session; it is not persisted across reloads)
  const [imageName, setImageName] = useState(null);
  const imageInputRef = useRef(null);

  // UV Transform
  const [uvScale, setUvScale] = useState([1.0, 1.0]);
  const [uvRotation, setUvRotation] = useState(0.0);
  const [uvOffset, setUvOffset] = useState([0.0, 0.0]);
  const [tilingPreview, setTilingPreview] = useState(false);

  // Extended categories including Favorites
  const allCategories = useMemo(() => ['All', 'Favorites', ...CATEGORIES.filter(c => c !== 'All')], []);

  // Filtered Patterns
  const filteredPatterns = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const filtered = PATTERNS.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      const matchesCategory =
        activeCategory === 'All' ||
        (activeCategory === 'Favorites' ? favorites.includes(p.id) : p.category === activeCategory);
      return matchesSearch && matchesCategory;
    });
    if (sortNewest) {
      return [...filtered].sort((a, b) =>
        (b.added || '').localeCompare(a.added || '') || a.name.localeCompare(b.name)
      );
    }
    return filtered;
  }, [searchQuery, activeCategory, favorites, sortNewest]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = new ShaderEngine(canvasRef.current);
    engineRef.current = engine;
    updateShader(activePattern);
    // baseline history entry so the very first tweak is undoable
    pushHistory({ patternId: activePattern.id, uniforms: patternDefaults(activePattern) });
    return () => engine.stop();
  }, [canvasRef]);

  // Handle viewport resizing — render at device-pixel resolution so the
  // preview stays crisp on high-DPI displays (capped at 2x for GPU sanity)
  useEffect(() => {
    const handleResize = () => {
      if (!engineRef.current || !canvasRef.current) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const sidebarWidth = isSidebarOpen ? 340 : 0;
      const cssW = window.innerWidth - sidebarWidth - 40;
      const cssH = window.innerHeight - 100;
      canvasRef.current.width = Math.round(cssW * dpr);
      canvasRef.current.height = Math.round(cssH * dpr);
      canvasRef.current.style.width = cssW + 'px';
      canvasRef.current.style.height = cssH + 'px';
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  // Pattern thumbnails: served from the IndexedDB cache when this app
  // version already rendered them; only misses compile shaders, chunked so
  // the UI stays responsive. First visit renders all, later visits none.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const cached = await loadThumbs(APP_VERSION).catch(() => ({}));
      if (cancelled) return;
      const missing = PATTERNS.filter(p => !cached[p.id]);
      if (Object.keys(cached).length) setThumbs(prev => ({ ...cached, ...prev }));
      if (!missing.length) return;

      const off = document.createElement('canvas');
      off.width = 96;
      off.height = 96;
      let engine;
      try {
        engine = new ShaderEngine(off);
      } catch {
        return; // no WebGL — cards just render without thumbnails
      }
      engine.stop(); // no animation loop needed; we draw synchronously

      let idx = 0;
      const BATCH = 4;
      const generateBatch = () => {
        if (cancelled || idx >= missing.length) return;
        const batch = {};
        for (let n = 0; n < BATCH && idx < missing.length; n++, idx++) {
          const p = missing[idx];
          const defaults = {};
          p.uniforms.forEach(u => { defaults[u.id] = u.default; });
          engine.setShader(p);
          engine.render({
            ...defaults,
            u_is_spec: 0.0,
            u_opacity: 1.0,
            u_uv_scale: [1.0, 1.0],
            u_uv_rotation: 0.0,
            u_uv_offset: [0.0, 0.0],
          });
          engine.draw();
          batch[p.id] = off.toDataURL('image/png');
        }
        setThumbs(prev => ({ ...prev, ...batch }));
        saveThumbs(APP_VERSION, batch).catch(() => {}); // best-effort persist
        setTimeout(generateBatch, 30);
      };
      setTimeout(generateBatch, 300); // let the main canvas come up first
    })();

    return () => { cancelled = true; };
  }, []);

  // Handle Update Events
  useEffect(() => {
    if (!window.electronAPI) return;

    window.electronAPI.onUpdateStatus((status) => {
      setUpdateStatus(status);
      setUpdateLog(prev => [...prev.slice(-4), status]);
    });

    window.electronAPI.onUpdateAvailableData((info) => {
      setIsUpdateAvailable(true);
      setUpdateInfo(info);
      setUpdateLog(prev => [...prev.slice(-4), `v${info.version} found on GitHub`]);
    });

    window.electronAPI.onUpdateDownloaded(() => {
      setIsUpdateReady(true);
      setIsUpdateAvailable(false);
      setUpdateLog(prev => [...prev.slice(-4), 'Update ready — click to install']);
    });
  }, []);

  // Update Opacity in Engine
  useEffect(() => {
    masterOpacityRef.current = masterOpacity;
    if (engineRef.current) {
      engineRef.current.render({ u_opacity: masterOpacity });
    }
  }, [masterOpacity]);

  // Sync UV transform to engine
  useEffect(() => {
    if (!engineRef.current) return;
    const effectiveScale = tilingPreview
      ? [uvScale[0] * 2, uvScale[1] * 2]
      : uvScale;
    engineRef.current.render({
      u_uv_scale: effectiveScale,
      u_uv_rotation: uvRotation * (Math.PI / 180),
      u_uv_offset: uvOffset,
    });
  }, [uvScale, uvRotation, uvOffset, tilingPreview]);

  const patternDefaults = (pattern) => {
    const defaults = {};
    pattern.uniforms.forEach(u => { defaults[u.id] = u.default; });
    return defaults;
  };

  // Bug 1 fix: use masterOpacityRef.current so stale closure never loses the
  // current opacity. `overrides` lets preset loads apply their saved uniforms
  // in the same pass as the shader swap (no setTimeout races).
  const updateShader = async (pattern, overrides = null) => {
    if (!engineRef.current) return;
    const values = { ...patternDefaults(pattern), ...(overrides || {}) };
    setUniforms(values);
    await engineRef.current.setShader(pattern);
    engineRef.current.render({
      ...values,
      u_is_spec: isSpecMap ? 1.0 : 0.0,
      u_opacity: masterOpacityRef.current,
    });
  };

  const handlePatternChange = (pattern) => {
    setActivePattern(pattern);
    setActiveVariantName(null);
    updateShader(pattern);
    // baseline history entry: the first slider tweak on a pattern can be
    // undone back to its defaults, and undo walks across pattern switches
    pushHistory({ patternId: pattern.id, uniforms: patternDefaults(pattern) });
  };

  const pushHistory = (entry) => {
    setHistory(prev => {
      const truncated = prev.slice(0, historyIndex + 1);
      return [...truncated, entry].slice(-30);
    });
    setHistoryIndex(prev => Math.min(prev + 1, 29));
  };

  // Feature C: variants push to history immediately (discrete action)
  const applyVariant = (variant) => {
    const newUniforms = { ...uniforms, ...variant.uniforms };
    setUniforms(newUniforms);
    setActiveVariantName(variant.name);
    if (engineRef.current) {
      engineRef.current.render({ ...newUniforms, u_is_spec: isSpecMap ? 1.0 : 0.0, u_opacity: masterOpacityRef.current });
    }
    pushHistory({ patternId: activePattern.id, uniforms: newUniforms });
  };

  // Feature C: slider/color changes render immediately but debounce the
  // history push, so a drag becomes one undo step instead of dozens
  const handleUniformChange = (id, value) => {
    const newUniforms = { ...uniforms, [id]: value };
    setUniforms(newUniforms);
    if (engineRef.current) {
      engineRef.current.render({ ...newUniforms, u_is_spec: isSpecMap ? 1.0 : 0.0, u_opacity: masterOpacityRef.current });
    }

    clearTimeout(historyTimerRef.current);
    historyTimerRef.current = setTimeout(() => {
      pushHistory({ patternId: activePattern.id, uniforms: newUniforms });
    }, 400);
  };

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.render({ u_is_spec: isSpecMap ? 1.0 : 0.0 });
    }
  }, [isSpecMap]);

  // Custom image pattern: decode the picked file and hand it to the engine
  const loadCustomImage = async (file) => {
    if (!file || !engineRef.current) return;
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      engineRef.current.setTexture('u_image', img);
      engineRef.current.render({}); // repaint with the new texture
      setImageName(file.name);
    } catch {
      setImageName(null);
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  // Built-in materials: seamless textures shipped with the app (generated
  // locally with FLUX) — one click loads them through the same image pipeline.
  const loadBuiltinTexture = async (tex) => {
    if (!engineRef.current) return;
    try {
      const img = new Image();
      img.src = `textures/full/${tex.id}.webp`;
      await img.decode();
      engineRef.current.setTexture('u_image', img);
      engineRef.current.render({});
      setImageName(tex.name);
    } catch {
      setImageName(null);
    }
  };

  // Blob + object URL downloads: no multi-MB base64 strings in memory
  const saveBlob = (blob, filename) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const downloadTexture = async () => {
    if (!engineRef.current) return;
    const exportUniforms = {
      ...uniforms,
      u_is_spec: isSpecMap ? 1.0 : 0.0,
    };
    const blob = await (seamlessExport
      ? engineRef.current.exportSeamless(resolution, resolution, exportUniforms)
      : engineRef.current.export(resolution, resolution, exportUniforms));
    saveBlob(blob, `simtex_${activePattern.id}_${isSpecMap ? 'spec' : 'diff'}${seamlessExport ? '_seamless' : ''}_${resolution}.png`);
  };

  // Clearcoat bridge: seamless-export the current look and postMessage it to
  // the opener (Clearcoat). Same uniform plumbing as downloadTexture, always
  // seamless (Clearcoat imports tiling patterns).
  const sendToClearcoat = async () => {
    if (!engineRef.current || bridgeStatus === 'sending') return;
    clearTimeout(bridgeTimerRef.current);
    if (!window.opener || window.opener.closed) {
      setBridgeStatus('error');
      return;
    }
    setBridgeStatus('sending');
    try {
      const res = resolution || 1024;
      const blob = await engineRef.current.exportSeamless(res, res, {
        ...uniforms,
        u_is_spec: isSpecMap ? 1.0 : 0.0,
      });
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
      });
      // opener may have closed while we were rendering
      if (!window.opener || window.opener.closed) {
        setBridgeStatus('error');
        return;
      }
      window.opener.postMessage({
        type: 'simtex-texture',
        name: activeVariantName ? `${activePattern.name} — ${activeVariantName}` : activePattern.name,
        dataUrl,
      }, '*');
      setBridgeStatus('sent');
      bridgeTimerRef.current = setTimeout(() => setBridgeStatus('idle'), 2000);
    } catch {
      setBridgeStatus('error');
      bridgeTimerRef.current = setTimeout(() => setBridgeStatus('idle'), 2000);
    }
  };

  // Export Set: diffuse + spec + normal with matching filenames, one click.
  // Downloads are staggered so the browser doesn't swallow them.
  const downloadSet = async () => {
    if (!engineRef.current) return;
    const e = engineRef.current;
    const base = `simtex_${activePattern.id}${seamlessExport ? '_seamless' : ''}_${resolution}`;
    const pause = (ms) => new Promise(r => setTimeout(r, ms));

    const diffUniforms = { ...uniforms, u_is_spec: 0.0 };
    saveBlob(
      await (seamlessExport
        ? e.exportSeamless(resolution, resolution, diffUniforms)
        : e.export(resolution, resolution, diffUniforms)),
      `${base}_diff.png`
    );
    await pause(400);
    const specUniforms = { ...uniforms, u_is_spec: 1.0 };
    saveBlob(
      await (seamlessExport
        ? e.exportSeamless(resolution, resolution, specUniforms)
        : e.export(resolution, resolution, specUniforms)),
      `${base}_spec.png`
    );
    await pause(400);
    saveBlob(
      await e.exportNormalMap(resolution, resolution, { ...uniforms, u_is_spec: 0.0, u_opacity: 1.0 }),
      `${base}_normal.png`
    );
  };

  const downloadNormalMap = async () => {
    if (!engineRef.current) return;
    const blob = await engineRef.current.exportNormalMap(resolution, resolution, {
      ...uniforms,
      u_is_spec: 0.0,
      u_opacity: 1.0,
    });
    saveBlob(blob, `simtex_${activePattern.id}_normal_${resolution}.png`);
  };

  // Feature A: toggle favorite
  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('simtex_favorites', JSON.stringify(next));
      return next;
    });
  };

  // Feature B: save preset — captures the full look: uniforms, UV transform,
  // and master opacity (older presets without uv/opacity still load fine)
  const savePreset = () => {
    const name = presetNameInput.trim() || activePattern.name;
    const preset = {
      id: Date.now(),
      patternId: activePattern.id,
      name,
      uniforms: { ...uniforms },
      uv: { scale: [...uvScale], rotation: uvRotation, offset: [...uvOffset] },
      opacity: masterOpacity,
    };
    setPresets(prev => {
      const next = [...prev, preset].slice(-20);
      localStorage.setItem('simtex_presets', JSON.stringify(next));
      return next;
    });
    setPresetNameInput('');
    setIsNamingPreset(false);
  };

  const deletePreset = (id) => {
    setPresets(prev => {
      const next = prev.filter(p => p.id !== id);
      localStorage.setItem('simtex_presets', JSON.stringify(next));
      return next;
    });
  };

  const loadPreset = (preset) => {
    const pattern = PATTERNS.find(p => p.id === preset.patternId);
    if (!pattern) return;
    setActivePattern(pattern);
    setActiveVariantName(null);
    if (typeof preset.opacity === 'number') {
      masterOpacityRef.current = preset.opacity;
      setMasterOpacity(preset.opacity);
    }
    if (preset.uv) {
      setUvScale(preset.uv.scale);
      setUvRotation(preset.uv.rotation);
      setUvOffset(preset.uv.offset);
    }
    // saved uniforms apply in the same pass as the shader swap
    updateShader(pattern, preset.uniforms);
    pushHistory({ patternId: pattern.id, uniforms: { ...patternDefaults(pattern), ...preset.uniforms } });
  };

  // Feature C: undo/redo helpers. When the entry belongs to a different
  // pattern, the shader program must be swapped too — rendering another
  // pattern's uniforms into the current program shows the wrong texture.
  const applyHistoryEntry = useCallback(async (entry) => {
    const pattern = PATTERNS.find(p => p.id === entry.patternId);
    if (!pattern || !engineRef.current) return;
    if (pattern.id !== activePattern.id) {
      setActivePattern(pattern);
      await engineRef.current.setShader(pattern);
    }
    setUniforms(entry.uniforms);
    engineRef.current.render({
      ...entry.uniforms,
      u_is_spec: isSpecMap ? 1.0 : 0.0,
      u_opacity: masterOpacityRef.current,
    });
  }, [activePattern.id, isSpecMap]);

  // Feature C + D: keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const ctrl = e.ctrlKey || e.metaKey;

      // Don't hijack keys while the user is in an input (sliders, search,
      // preset name) — Escape is the only shortcut that still applies.
      const tag = e.target.tagName;
      if ((tag === 'INPUT' || tag === 'TEXTAREA') && e.key !== 'Escape') return;

      // Feature D: Escape — clear search+category or toggle sidebar
      if (e.key === 'Escape') {
        if (isSidebarOpen && searchQuery) {
          setSearchQuery('');
          setActiveCategory('All');
        } else {
          setIsSidebarOpen(prev => !prev);
        }
        return;
      }

      // Feature D: Ctrl+D / Cmd+D — export
      if (ctrl && e.key === 'd') {
        e.preventDefault();
        downloadTexture();
        return;
      }

      // Feature C: Ctrl+Z — undo
      if (ctrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        const nextIdx = historyIndex - 1;
        if (nextIdx >= 0 && history[nextIdx]) {
          applyHistoryEntry(history[nextIdx]);
          setHistoryIndex(nextIdx);
        }
        return;
      }

      // Feature C: Ctrl+Y or Ctrl+Shift+Z — redo
      if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        const nextIdx = historyIndex + 1;
        if (nextIdx < history.length) {
          applyHistoryEntry(history[nextIdx]);
          setHistoryIndex(nextIdx);
        }
        return;
      }

      // Feature D: ArrowUp/ArrowDown — navigate patterns
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        const currentIdx = filteredPatterns.findIndex(p => p.id === activePattern.id);
        if (currentIdx === -1) return;
        const nextIdx =
          e.key === 'ArrowUp'
            ? Math.max(0, currentIdx - 1)
            : Math.min(filteredPatterns.length - 1, currentIdx + 1);
        if (nextIdx !== currentIdx) {
          e.preventDefault(); // the list scrolls via scrollIntoView, not the page
          const next = filteredPatterns[nextIdx];
          handlePatternChange(next);
          document.getElementById(`pattern-card-${next.id}`)
            ?.scrollIntoView({ block: 'nearest' });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // uniforms/resolution/seamlessExport/isSpecMap keep Ctrl+D's closure
    // fresh — without them a slider tweak inside the history debounce window
    // exported stale values
  }, [isSidebarOpen, searchQuery, filteredPatterns, activePattern, history, historyIndex, applyHistoryEntry, uniforms, resolution, seamlessExport, isSpecMap]);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`sidebar glass-panel ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-top">
          <div className="sidebar-header">
            <div className="logo">
              <Shield size={24} color="var(--color-accent)" />
              <h1>SIMTEX<span>PRO</span> <small className="v-tag">v{APP_VERSION}</small></h1>
            </div>
          </div>

          <section className="sidebar-section">
            <div className="search-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search patterns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {/* Bug 2 fix: also reset activeCategory on X click */}
              {searchQuery && (
                <X
                  size={14}
                  className="clear-search"
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                />
              )}
            </div>
            <div className="category-tabs pro-scrollbar">
              {allCategories.map(cat => (
                <button
                  key={cat}
                  className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Scrollable Patterns List */}
        <section className="patterns-container pro-scrollbar">
          <div className="section-title patterns-title">
            <Layers size={16} />
            <span>PATTERNS ({filteredPatterns.length})</span>
            <button
              className={`sort-toggle ${sortNewest ? 'active' : ''}`}
              onClick={() => setSortNewest(s => !s)}
              title={sortNewest ? 'Sorted newest first — click for default order' : 'Sort newest first'}
            >
              NEW FIRST
            </button>
          </div>
          <div className="pattern-grid">
            {filteredPatterns.length > 0 ? filteredPatterns.map(p => (
              // div, not button: the fav star inside is a real <button>, and
              // nested buttons are invalid HTML with flaky click behavior
              <div
                key={p.id}
                id={`pattern-card-${p.id}`}
                role="button"
                tabIndex={0}
                className={`pattern-card ${activePattern.id === p.id ? 'active' : ''}`}
                onClick={() => handlePatternChange(p)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePatternChange(p);
                  }
                }}
              >
                <div className="card-body">
                  {thumbs[p.id] ? (
                    <img className="pattern-thumb" src={thumbs[p.id]} alt="" draggable={false} />
                  ) : (
                    <div className="pattern-thumb placeholder" />
                  )}
                  <div className="card-text">
                    <div className="card-header">
                      <div className="pattern-name">
                        {p.name}
                        {p.added >= NEW_BADGE_CUTOFF && <span className="new-badge">NEW</span>}
                      </div>
                      <div className="pattern-category">{p.category}</div>
                    </div>
                    <div className="pattern-desc">{p.description}</div>
                  </div>
                </div>
                {/* Feature A: star button */}
                <button
                  className={`fav-star ${favorites.includes(p.id) ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(p.id); }}
                  title={favorites.includes(p.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {favorites.includes(p.id) ? '★' : '☆'}
                </button>
              </div>
            )) : (
              <div className="no-results">No patterns found for "{searchQuery || activeCategory}"</div>
            )}
          </div>
        </section>

        {/* Fixed Controls at Bottom */}
        <div className="sidebar-bottom">

          {/* Feature B: preset chips */}
          {presets.length > 0 && (
            <div className="preset-chips-row">
              {presets.map(preset => (
                <span key={preset.id} className="preset-chip" title={preset.name}>
                  <span className="preset-chip-name" onClick={() => loadPreset(preset)}>
                    {preset.name.slice(0, 12)}
                  </span>
                  <span className="preset-chip-del" onClick={() => deletePreset(preset.id)}>×</span>
                </span>
              ))}
            </div>
          )}

          <section className="sidebar-section">
            <div className="section-title">
              <Settings size={16} />
              <span>CONTROLS</span>
            </div>
            <div className="controls-list pro-scrollbar">
              <div className="control-group master-control">
                <div className="control-label">
                  <span>Master Opacity</span>
                  <span className="control-value">{(masterOpacity * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={masterOpacity}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    masterOpacityRef.current = v;
                    setMasterOpacity(v);
                  }}
                />
              </div>

              {activePattern.isImage && (
                <div className="control-group image-loader">
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      loadCustomImage(e.target.files[0]);
                      e.target.value = ''; // re-picking the same file re-fires
                    }}
                  />
                  <button
                    className="btn-load-image"
                    onClick={() => imageInputRef.current?.click()}
                    title="Load a PNG, JPG, or WebP to use as the texture"
                  >
                    {imageName ? `Image: ${imageName.length > 24 ? imageName.slice(0, 21) + '…' : imageName}` : '+ Load Image (PNG / JPG)…'}
                  </button>
                  <p className="image-hint">
                    Your image never leaves the browser. It lasts for this session — all
                    exports work on it: seamless tiling, spec map, and normal map.
                  </p>
                  <div className="builtin-materials">
                    <div className="control-label" style={{ margin: '4px 0 6px' }}>
                      <span>Built-in materials</span>
                    </div>
                    <div className="material-grid">
                      {STUDIO_TEXTURES.map((tex) => (
                        <button
                          key={tex.id}
                          className="material-swatch"
                          title={`Load "${tex.name}"`}
                          onClick={() => loadBuiltinTexture(tex)}
                          style={{ backgroundImage: `url(textures/thumb/${tex.id}.jpg)` }}
                        >
                          <span>{tex.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activePattern.variants && activePattern.variants.length > 0 && (
                <div className="control-group variants-control" style={{ marginBottom: '16px' }}>
                  <div className="control-label" style={{ marginBottom: '8px' }}>
                    <span>Theme / Variant</span>
                  </div>
                  <div className="variants-row" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {activePattern.variants.map((v, i) => (
                      <button
                        key={i}
                        className="variant-btn"
                        onClick={() => applyVariant(v)}
                      >
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activePattern.uniforms.map(u => (
                <div key={u.id} className="control-group">
                  <div className="control-label">
                    <span>{u.name}</span>
                    <span className="control-value">
                      {u.type === 'color' ? '' : (uniforms[u.id] || 0).toFixed(2)}
                    </span>
                  </div>
                  {u.type === 'float' ? (
                    <input
                      type="range"
                      min={u.min}
                      max={u.max}
                      step={(u.max - u.min) / 100}
                      value={uniforms[u.id] || u.default}
                      onChange={(e) => handleUniformChange(u.id, parseFloat(e.target.value))}
                    />
                  ) : (
                    <div className="color-control-stack">
                      <input
                        type="color"
                        className="color-input"
                        value={uniforms[u.id] ? rgbToHex(uniforms[u.id]) : '#ffffff'}
                        onChange={(e) =>
                          handleUniformChange(
                            u.id,
                            hexToRgb(e.target.value, uniforms[u.id] ? uniforms[u.id][3] : 1.0)
                          )
                        }
                      />
                      <ColorValueInputs
                        value={uniforms[u.id]}
                        onChange={(rgba) => handleUniformChange(u.id, rgba)}
                      />
                      <div className="alpha-slider-row">
                        <span className="alpha-label">Alpha</span>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={uniforms[u.id] ? uniforms[u.id][3] : 1.0}
                          onChange={(e) => {
                            const current = uniforms[u.id] || [1, 1, 1, 1];
                            handleUniformChange(u.id, [
                              current[0],
                              current[1],
                              current[2],
                              parseFloat(e.target.value),
                            ]);
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Feature B: Save Preset */}
            <div className="preset-save-area">
              {isNamingPreset ? (
                <div className="preset-name-row">
                  <input
                    type="text"
                    className="preset-name-input"
                    placeholder="Preset name..."
                    value={presetNameInput}
                    onChange={(e) => setPresetNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') savePreset();
                      if (e.key === 'Escape') setIsNamingPreset(false);
                    }}
                    autoFocus
                  />
                  <button className="preset-confirm-btn" onClick={savePreset}>Save</button>
                  <button className="preset-cancel-btn" onClick={() => setIsNamingPreset(false)}>
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <button
                  className="btn-save-preset"
                  onClick={() => { setPresetNameInput(''); setIsNamingPreset(true); }}
                  disabled={presets.length >= 20}
                  title={presets.length >= 20 ? 'Max 20 presets reached' : 'Save current settings as preset'}
                >
                  + Save Preset
                </button>
              )}
            </div>
          </section>

          <section className="sidebar-section">
            <div className="section-title">
              <Settings size={16} />
              <span>UV TRANSFORM</span>
            </div>
            <div className="uv-controls">
              <div className="uv-row">
                <div className="uv-col">
                  <div className="control-label">
                    <span>Scale X</span>
                    <span className="control-value">{uvScale[0].toFixed(2)}×</span>
                  </div>
                  <input type="range" min="0.1" max="4.0" step="0.05"
                    value={uvScale[0]}
                    onChange={e => setUvScale([parseFloat(e.target.value), uvScale[1]])} />
                </div>
                <div className="uv-col">
                  <div className="control-label">
                    <span>Scale Y</span>
                    <span className="control-value">{uvScale[1].toFixed(2)}×</span>
                  </div>
                  <input type="range" min="0.1" max="4.0" step="0.05"
                    value={uvScale[1]}
                    onChange={e => setUvScale([uvScale[0], parseFloat(e.target.value)])} />
                </div>
              </div>
              <div className="control-label" style={{marginTop:'8px'}}>
                <span>Rotation</span>
                <span className="control-value">{uvRotation.toFixed(0)}°</span>
              </div>
              <input type="range" min="-180" max="180" step="1"
                value={uvRotation}
                onChange={e => setUvRotation(parseFloat(e.target.value))} />
              <div className="uv-row" style={{marginTop:'8px'}}>
                <div className="uv-col">
                  <div className="control-label">
                    <span>Offset X</span>
                    <span className="control-value">{uvOffset[0].toFixed(2)}</span>
                  </div>
                  <input type="range" min="-1" max="1" step="0.01"
                    value={uvOffset[0]}
                    onChange={e => setUvOffset([parseFloat(e.target.value), uvOffset[1]])} />
                </div>
                <div className="uv-col">
                  <div className="control-label">
                    <span>Offset Y</span>
                    <span className="control-value">{uvOffset[1].toFixed(2)}</span>
                  </div>
                  <input type="range" min="-1" max="1" step="0.01"
                    value={uvOffset[1]}
                    onChange={e => setUvOffset([uvOffset[0], parseFloat(e.target.value)])} />
                </div>
              </div>
              <div className="uv-actions">
                <button
                  className={`uv-btn ${tilingPreview ? 'active' : ''}`}
                  onClick={() => setTilingPreview(p => !p)}
                >
                  2×2 Tile Preview
                </button>
                <button
                  className="uv-btn"
                  onClick={() => { setUvScale([1.0, 1.0]); setUvRotation(0); setUvOffset([0.0, 0.0]); setTilingPreview(false); }}
                >
                  Reset
                </button>
              </div>
            </div>
          </section>

          <section className="sidebar-section">
            <div className="section-title">
              <Zap size={16} />
              <span>MATERIAL MODE</span>
            </div>
            <div className="mode-toggle">
              <button className={`toggle-btn ${!isSpecMap ? 'active' : ''}`} onClick={() => setIsSpecMap(false)}>Standard</button>
              <button className={`toggle-btn ${isSpecMap ? 'active' : ''}`} onClick={() => setIsSpecMap(true)}>iRacing Spec</button>
            </div>
            {isSpecMap && (
              <div className="info-box">
                <Info size={14} />
                <p>R: Metallic | G: Roughness</p>
              </div>
            )}
          </section>

          {updateLog.length > 0 && (
            <div className="update-console">
              {updateLog.map((log, i) => (
                <div key={i} className="log-entry">{log}</div>
              ))}
              {isUpdateAvailable && (
                <button className="btn-update-action download" onClick={() => window.electronAPI.downloadUpdate()}>
                  Download v{updateInfo?.version}
                </button>
              )}
              {isUpdateReady && (
                <button className="btn-update-action install" onClick={() => window.electronAPI.restartAndInstall()}>
                  Install &amp; Restart
                </button>
              )}
            </div>
          )}

        </div>

        <div className="sidebar-footer">
          <span className="version-label">v{APP_VERSION}</span>
          {isElectron && (
            <button className="check-updates-link" onClick={() => window.electronAPI?.checkForUpdates()}>
              Check for Updates
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-bar glass-panel">
          <div className="res-selector">
            {[1024, 2048, 4096].map(res => (
              <button key={res} onClick={() => setResolution(res)} className={resolution === res ? 'active' : ''}>
                {res / 1024}K
              </button>
            ))}
          </div>

          <div className="actions">
            <a
              className="support-link"
              href="https://ko-fi.com/metalprophecymedia"
              target="_blank"
              rel="noopener noreferrer"
              title="SimTex Pro is free — tips keep it growing"
            >
              ♥ Support
            </a>
            <button className="btn-secondary" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Maximize size={18} />
            </button>
            <button
              className={`btn-secondary btn-seamless ${seamlessExport ? 'active' : ''}`}
              onClick={() => setSeamlessExport(s => !s)}
              title={seamlessExport ? 'Seamless tiling export ON — edges will wrap perfectly' : 'Seamless tiling export OFF'}
            >
              <span style={{fontSize:'10px', fontWeight:800, letterSpacing:'0.05em'}}>TILE</span>
            </button>
            <button className="btn-secondary btn-normal" onClick={downloadNormalMap} title="Export Normal Map">
              <span style={{fontSize:'11px', fontWeight:800, letterSpacing:'0.05em'}}>NRM</span>
            </button>
            <button className="btn-primary" onClick={downloadTexture}>
              <Download size={18} />
              <span>Export PNG</span>
            </button>
            {isBridgeMode && (
              <button
                className={`btn-primary btn-bridge ${bridgeStatus}`}
                onClick={sendToClearcoat}
                disabled={bridgeStatus === 'sending' || bridgeStatus === 'error'}
                title="Export the current pattern seamlessly and send it to the Clearcoat window that opened SimTex"
              >
                <Send size={18} />
                <span>
                  {bridgeStatus === 'sending' && 'Sending…'}
                  {bridgeStatus === 'sent' && 'Sent ✓'}
                  {bridgeStatus === 'error' && 'Clearcoat closed'}
                  {bridgeStatus === 'idle' && 'Send to Clearcoat'}
                </span>
              </button>
            )}
            <button
              className="btn-primary btn-set"
              onClick={downloadSet}
              title="Export the full iRacing set: diffuse + spec + normal maps with matching filenames"
            >
              <Download size={18} />
              <span>Export Set</span>
            </button>
          </div>
        </header>

        <div className="viewport">
          <div className="canvas-wrapper">
            <canvas ref={canvasRef} />
            <div className="canvas-overlay">
              {tilingPreview && <span className="tile-badge">TILING 2×2</span>}
              <span>{resolution} x {resolution} PREVIEW</span>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .app-container { display: flex; height: 100vh; width: 100vw; background: #050507; overflow: hidden; }

        .sidebar {
          width: 320px;
          height: 100vh;
          background: #0a0a0c;
          border-right: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          z-index: 100;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
        .sidebar.closed { transform: translateX(-320px); position: absolute; }

        .sidebar-top, .sidebar-bottom {
          flex-shrink: 0;
          padding: 16px 24px;
          background: #0a0a0c;
          z-index: 110;
        }
        .sidebar-top { border-bottom: 1px solid var(--color-border); }
        .sidebar-bottom {
          border-top: 1px solid var(--color-border);
          box-shadow: 0 -10px 30px rgba(0,0,0,0.5);
          max-height: 50vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .patterns-container {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .logo { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .logo h1 { font-size: 20px; font-weight: 800; color: #fff; letter-spacing: -0.05em; }
        .logo h1 span { color: var(--color-accent); }

        .search-wrapper { position: relative; display: flex; align-items: center; }
        .search-icon { position: absolute; left: 12px; color: var(--color-text-dim); }
        .clear-search { position: absolute; right: 12px; color: var(--color-text-dim); cursor: pointer; }
        .search-input { width: 100%; background: #1a1a20; border: 1px solid var(--color-border); border-radius: 8px; padding: 10px 12px 10px 36px; color: #fff; font-size: 13px; outline: none; transition: border-color 0.2s; }
        .search-input:focus { border-color: var(--color-accent); }

        .category-tabs {
          display: flex;
          gap: 10px;
          margin-top: 12px;
          padding-bottom: 10px;
          overflow-x: auto;
          white-space: nowrap;
          -webkit-overflow-scrolling: touch;
          mask-image: linear-gradient(to right, black 90%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, black 90%, transparent 100%);
          scrollbar-width: thin;
          scrollbar-color: var(--color-accent) transparent;
        }

        /* Styled sub-scrollbar for categories */
        .category-tabs::-webkit-scrollbar {
          height: 3px;
        }
        .category-tabs::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02);
          border-radius: 10px;
        }
        .category-tabs::-webkit-scrollbar-thumb {
          background: var(--color-accent);
          border-radius: 10px;
          opacity: 0.5;
        }

        .category-tab {
          flex-shrink: 0;
          padding: 6px 16px;
          font-size: 11px;
          font-weight: 700;
          border-radius: 20px;
          background: rgba(255,255,255,0.05);
          color: var(--color-text-dim);
          transition: all 0.2s;
          margin-bottom: 2px;
        }
        .category-tab.active { background: var(--color-accent); color: #fff; box-shadow: var(--shadow-glow); }
        .category-tab:hover:not(.active) { background: rgba(255,255,255,0.1); color: #fff; }

        .section-title { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; color: var(--color-text-dim); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.1em; }

        .pattern-grid { display: flex; flex-direction: column; gap: 10px; }
        .pattern-card {
          padding: 14px;
          text-align: left;
          border-radius: 10px;
          background: #111115;
          border: 1px solid rgba(255,255,255,0.05);
          transition: all 0.2s;
          position: relative;
          cursor: pointer; /* card is a div now (fav star nests a real button) */
          user-select: none;
        }
        .pattern-card:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 1px; }

        .variant-btn {
          background: #1a1a20;
          border: 1px solid var(--color-border);
          color: #fff;
          padding: 6px 10px;
          border-radius: 4px;
          font-size: 11px;
          cursor: pointer;
          flex: 1 1 calc(50% - 6px);
          transition: border-color 0.2s;
        }
        .variant-btn:hover { border-color: var(--color-accent); }
        .pattern-card:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.15); background: #16161c; }
        .card-body { display: flex; gap: 10px; align-items: flex-start; }
        .card-text { flex: 1; min-width: 0; }
        .pattern-thumb {
          width: 44px;
          height: 44px;
          border-radius: 6px;
          flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.08);
          object-fit: cover;
          background: #1a1a20;
        }
        .pattern-thumb.placeholder { background: linear-gradient(135deg, #15151a, #1d1d24); }
        .support-link { color: var(--color-text-dim); font-size: 11px; text-decoration: none; margin-right: 6px; white-space: nowrap; transition: color .15s; align-self: center; }
        .support-link:hover { color: var(--color-accent); }
        .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; }
        .pattern-category { font-size: 9px; font-weight: 800; color: var(--color-accent); text-transform: uppercase; background: rgba(37, 99, 235, 0.1); padding: 2px 6px; border-radius: 4px; }
        .pattern-card.active { background: rgba(37, 99, 235, 0.1); border-color: var(--color-accent); box-shadow: var(--shadow-glow); }
        .pattern-name { font-weight: 600; font-size: 13px; color: #fff; }
        .new-badge {
          display: inline-block;
          margin-left: 6px;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #fff;
          background: var(--color-accent);
          border-radius: 4px;
          padding: 1px 5px;
          vertical-align: 2px;
        }
        .patterns-title { position: relative; }
        .sort-toggle {
          margin-left: auto;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.06em;
          padding: 3px 8px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          color: var(--color-text-dim);
          cursor: pointer;
          transition: all 0.2s;
        }
        .sort-toggle:hover:not(.active) { background: rgba(255,255,255,0.1); color: #fff; }
        .sort-toggle.active { background: var(--color-accent); color: #fff; box-shadow: var(--shadow-glow); }
        .pattern-desc { font-size: 11px; color: var(--color-text-dim); line-height: 1.4; }
        .no-results { font-size: 12px; color: var(--color-text-dim); text-align: center; padding: 40px 20px; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1); }

        /* Feature A: star button */
        .fav-star {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 14px;
          line-height: 1;
          color: var(--color-text-dim);
          background: none;
          border: none;
          padding: 2px 4px;
          cursor: pointer;
          transition: color 0.2s, transform 0.15s;
          z-index: 1;
        }
        .fav-star:hover { transform: scale(1.2); }
        .fav-star.active { color: var(--color-accent); }

        .controls-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          overflow-y: auto;
          flex: 1;
          margin-right: -8px;
          padding-right: 8px;
        }
        .control-group { display: flex; flex-direction: column; gap: 6px; }
        .control-label { display: flex; justify-content: space-between; font-size: 12px; color: var(--color-text); font-weight: 500; }
        .control-value { color: var(--color-accent); font-family: var(--font-mono); font-size: 10px; background: rgba(37, 99, 235, 0.1); padding: 2px 6px; border-radius: 4px; }
        .color-input { width: 100%; height: 36px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); background: #1a1a20; cursor: pointer; padding: 4px; }

        .color-control-stack { display: flex; flex-direction: column; gap: 8px; }
        .color-value-row { display: flex; gap: 6px; }
        .hex-input { flex: 1.4; min-width: 0; background: #1a1a20; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 5px 6px; font-family: var(--font-mono); font-size: 10px; color: var(--color-text); text-transform: uppercase; }
        .hex-input:focus { border-color: var(--color-accent); outline: none; }
        .rgb-field { flex: 1; display: flex; align-items: center; gap: 3px; min-width: 0; }
        .rgb-field span { font-size: 9px; font-weight: 800; color: var(--color-text-dim); }
        .rgb-field input { width: 100%; min-width: 0; background: #1a1a20; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 5px 4px; font-family: var(--font-mono); font-size: 10px; color: var(--color-text); -moz-appearance: textfield; appearance: textfield; }
        .rgb-field input::-webkit-inner-spin-button, .rgb-field input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        .rgb-field input:focus { border-color: var(--color-accent); outline: none; }
        .alpha-slider-row { display: flex; align-items: center; gap: 10px; padding: 4px 8px; background: rgba(255,255,255,0.03); border-radius: 4px; }
        .alpha-label { font-size: 9px; font-weight: 800; color: var(--color-text-dim); text-transform: uppercase; }
        .alpha-slider-row input { flex: 1; height: 12px; }

        .mode-toggle { display: flex; background: #1a1a20; padding: 4px; border-radius: 8px; gap: 4px; }
        .toggle-btn { flex: 1; padding: 10px; font-size: 11px; font-weight: 700; border-radius: 6px; color: var(--color-text-dim); }
        .toggle-btn.active { background: var(--color-accent); color: #fff; box-shadow: var(--shadow-glow); }
        .info-box { margin-top: 12px; padding: 10px 14px; background: rgba(37, 99, 235, 0.1); border: 1px solid rgba(37, 99, 235, 0.2); border-radius: 8px; display: flex; align-items: center; gap: 10px; color: var(--color-accent); font-size: 11px; font-weight: 600; }

        .main-content { flex: 1; display: flex; flex-direction: column; padding: 20px; gap: 20px; position: relative; overflow: hidden; background: #050507; }
        .top-bar { height: 64px; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
        .res-selector { display: flex; gap: 8px; }
        .actions { display: flex; align-items: center; gap: 8px; flex-wrap: nowrap; }
        .res-selector button { padding: 8px 16px; border-radius: 8px; font-size: 11px; font-weight: 800; background: rgba(255,255,255,0.05); color: var(--color-text-dim); transition: all 0.2s; }
        .res-selector button.active { background: #fff; color: #000; box-shadow: 0 4px 20px rgba(255,255,255,0.2); }

        .btn-primary { background: var(--color-accent); color: #fff; padding: 10px 24px; border-radius: 10px; display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 800; box-shadow: var(--shadow-glow); }
        .btn-primary:hover { background: var(--color-accent-hover); transform: translateY(-1px); }
        .btn-secondary { background: rgba(255,255,255,0.05); color: #fff; width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .btn-secondary:hover { background: rgba(255,255,255,0.1); }

        .viewport { flex: 1; display: flex; align-items: center; justify-content: center; background: #000; border-radius: 16px; overflow: hidden; position: relative;
          background-image: linear-gradient(45deg, #09090b 25%, transparent 25%), linear-gradient(-45deg, #09090b 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #09090b 75%), linear-gradient(-45deg, transparent 75%, #09090b 75%);
          background-size: 60px 60px; background-position: 0 0, 0 30px, 30px -30px, -30px 0px; }
        .canvas-wrapper { position: relative; box-shadow: 0 60px 120px rgba(0,0,0,0.9); border: 1px solid rgba(255,255,255,0.05); }
        .canvas-overlay { position: absolute; bottom: 20px; right: 20px; background: rgba(0,0,0,0.7); padding: 8px 16px; border-radius: 6px; font-family: var(--font-mono); font-size: 10px; color: var(--color-text-dim); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1); }

        .master-control { padding-bottom: 12px; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); }

        /* Update UI Styles */
        .update-section { margin-top: 10px; }
        .update-card { background: rgba(37, 99, 235, 0.1); border: 1px solid rgba(37, 99, 235, 0.3); padding: 16px; border-radius: 12px; }
        .update-header { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 800; color: #fff; margin-bottom: 8px; }
        .update-header .glow { color: var(--color-accent); filter: drop-shadow(0 0 5px var(--color-accent)); animation: pulse 2s infinite; }
        .update-card p { font-size: 11px; color: var(--color-text-dim); line-height: 1.4; margin-bottom: 12px; }
        .progress-bar-container { height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; margin-bottom: 8px; }
        .progress-bar { height: 100%; background: var(--color-accent); transition: width 0.3s; }
        .btn-update-install { width: 100%; background: #fff; color: #000; font-weight: 800; font-size: 11px; padding: 10px; border-radius: 8px; transition: all 0.2s; }
        .btn-update-install:hover { transform: scale(1.02); background: var(--color-accent); color: #fff; }
        .btn-update-action { width: 100%; font-weight: 700; font-size: 11px; padding: 8px; border-radius: 8px; margin-top: 6px; transition: all 0.2s; border: none; cursor: pointer; }
        .btn-update-action.download { background: var(--color-accent); color: #000; }
        .btn-update-action.download:hover { filter: brightness(1.15); }
        .btn-update-action.install { background: #fff; color: #000; }
        .btn-update-action.install:hover { transform: scale(1.02); background: var(--color-accent); color: #fff; }

        .sidebar-footer {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .check-updates-link { font-size: 10px; color: var(--color-text-dim); background: none; border: none; padding: 0; cursor: pointer; text-decoration: underline; transition: color 0.2s; }
        .check-updates-link:hover { color: var(--color-accent); }
        .version-label { font-size: 10px; color: rgba(255,255,255,0.2); font-family: var(--font-mono); }

        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }

        /* Feature B: preset chips */
        .preset-chips-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 10px 0 4px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          margin-bottom: 12px;
        }
        .preset-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(37, 99, 235, 0.12);
          border: 1px solid rgba(37, 99, 235, 0.25);
          border-radius: 20px;
          padding: 3px 10px 3px 10px;
          font-size: 10px;
          font-weight: 700;
          color: var(--color-accent);
          max-width: 140px;
          white-space: nowrap;
        }
        .preset-chip-name {
          cursor: pointer;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        }
        .preset-chip-name:hover { text-decoration: underline; }
        .preset-chip-del {
          cursor: pointer;
          font-size: 12px;
          line-height: 1;
          color: var(--color-text-dim);
          flex-shrink: 0;
          transition: color 0.15s;
        }
        .preset-chip-del:hover { color: #fff; }

        /* Feature B: save preset controls */
        .preset-save-area { margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05); }
        .btn-save-preset {
          font-size: 10px;
          font-weight: 700;
          color: var(--color-text-dim);
          background: rgba(255,255,255,0.04);
          border: 1px dashed rgba(255,255,255,0.1);
          border-radius: 6px;
          padding: 6px 12px;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
        }
        .btn-save-preset:hover:not(:disabled) { color: var(--color-accent); border-color: var(--color-accent); background: rgba(37, 99, 235, 0.07); }
        .btn-save-preset:disabled { opacity: 0.4; cursor: not-allowed; }

        .preset-name-row { display: flex; gap: 6px; align-items: center; }
        .preset-name-input {
          flex: 1;
          background: #1a1a20;
          border: 1px solid var(--color-accent);
          border-radius: 6px;
          padding: 6px 10px;
          color: #fff;
          font-size: 11px;
          outline: none;
          min-width: 0;
        }
        .preset-confirm-btn {
          font-size: 10px;
          font-weight: 800;
          background: var(--color-accent);
          color: #fff;
          border-radius: 6px;
          padding: 6px 10px;
          flex-shrink: 0;
          cursor: pointer;
          transition: filter 0.2s;
        }
        .preset-confirm-btn:hover { filter: brightness(1.15); }
        .preset-cancel-btn {
          font-size: 10px;
          background: rgba(255,255,255,0.06);
          color: var(--color-text-dim);
          border-radius: 6px;
          padding: 6px 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          cursor: pointer;
          transition: background 0.2s;
        }
        .preset-cancel-btn:hover { background: rgba(255,255,255,0.12); }

        /* Custom image loader */
        .btn-load-image {
          width: 100%;
          padding: 10px 12px;
          font-size: 11px;
          font-weight: 700;
          border-radius: 8px;
          background: rgba(37, 99, 235, 0.12);
          border: 1px dashed rgba(37, 99, 235, 0.45);
          color: var(--color-accent);
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-load-image:hover { background: rgba(37, 99, 235, 0.22); border-style: solid; }
        .image-hint { font-size: 10px; color: var(--color-text-dim); line-height: 1.4; margin-top: 6px; }

        .uv-controls { display: flex; flex-direction: column; gap: 6px; }
        .uv-row { display: flex; gap: 12px; }
        .uv-col { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .uv-actions { display: flex; gap: 8px; margin-top: 10px; }
        .uv-btn { flex: 1; padding: 7px 10px; font-size: 10px; font-weight: 700; border-radius: 6px; background: rgba(255,255,255,0.06); color: var(--color-text-dim); transition: all 0.2s; letter-spacing: 0.05em; text-transform: uppercase; }
        .uv-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
        .uv-btn.active { background: rgba(37,99,235,0.25); color: var(--color-accent); border: 1px solid rgba(37,99,235,0.4); }
        .btn-normal { width: 42px; height: 42px; font-size: 10px; }
        .btn-seamless.active { background: rgba(37,99,235,0.3); color: var(--color-accent); box-shadow: var(--shadow-glow); }
        .btn-bridge.sent { background: #16a34a; }
        .btn-bridge.error { background: #dc2626; cursor: not-allowed; }
        .btn-bridge:disabled { transform: none; opacity: 0.85; }
        .btn-set { background: rgba(37,99,235,0.18); color: var(--color-accent); border: 1px solid rgba(37,99,235,0.45); box-shadow: none; }
        .btn-set:hover { background: rgba(37,99,235,0.3); transform: translateY(-1px); }
        .tile-badge { background: var(--color-accent); color: #fff; font-size: 9px; font-weight: 800; padding: 2px 8px; border-radius: 4px; letter-spacing: 0.08em; }
        .canvas-overlay { display: flex; align-items: center; gap: 8px; }
      `}</style>
    </div>
  );
}

export default App;
