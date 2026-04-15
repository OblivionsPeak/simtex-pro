import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ShaderEngine } from './engine/ShaderEngine';
import { PATTERNS, CATEGORIES } from './engine/patterns';
import { Download, Layers, Shield, Settings, Zap, Info, Maximize, Search, X, Filter } from 'lucide-react';

function App() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const [activePattern, setActivePattern] = useState(PATTERNS[0]);
  const [uniforms, setUniforms] = useState({});
  const [isSpecMap, setIsSpecMap] = useState(false);
  const [resolution, setResolution] = useState(2048);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Filtered Patterns
  const filteredPatterns = useMemo(() => {
    return PATTERNS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = new ShaderEngine(canvasRef.current);
    engineRef.current = engine;
    updateShader(activePattern);
    return () => engine.stop();
  }, [canvasRef]);

  // Handle sidebar resizing/visibility
  useEffect(() => {
    const handleResize = () => {
      if (!engineRef.current || !canvasRef.current) return;
      canvasRef.current.width = window.innerWidth - (isSidebarOpen ? 340 : 40);
      canvasRef.current.height = window.innerHeight - 80;
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  const updateShader = async (pattern) => {
    if (!engineRef.current) return;
    const defaults = {};
    pattern.uniforms.forEach(u => {
      defaults[u.id] = u.default;
    });
    setUniforms(defaults);
    await engineRef.current.setShader(pattern.shader);
    engineRef.current.render({ ...defaults, u_is_spec: isSpecMap ? 1.0 : 0.0 });
  };

  const handlePatternChange = (pattern) => {
    setActivePattern(pattern);
    updateShader(pattern);
  };

  const handleUniformChange = (id, value) => {
    const newUniforms = { ...uniforms, [id]: value };
    setUniforms(newUniforms);
    if (engineRef.current) {
      engineRef.current.render({ ...newUniforms, u_is_spec: isSpecMap ? 1.0 : 0.0 });
    }
  };

  useEffect(() => {
    if (engineRef.current) {
        engineRef.current.render({ ...uniforms, u_is_spec: isSpecMap ? 1.0 : 0.0 });
    }
  }, [isSpecMap, uniforms]);

  const downloadTexture = () => {
    if (!engineRef.current) return;
    const dataUrl = engineRef.current.export(resolution, resolution, { ...uniforms, u_is_spec: isSpecMap ? 1.0 : 0.0 });
    const link = document.createElement('a');
    link.download = `simtex_${activePattern.id}_${isSpecMap ? 'spec' : 'diff'}_${resolution}.png`;
    link.href = dataUrl;
    link.click();
  };

  const rgbToHex = (rgb) => {
    const toHex = (c) => Math.round(c * 255).toString(16).padStart(2, '0');
    return `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}`;
  };

  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`sidebar glass-panel pro-scrollbar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <Shield size={24} color="var(--color-accent)" />
            <h1>SIMTEX<span>PRO</span></h1>
          </div>
        </div>

        {/* Search and Filters */}
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
            {searchQuery && <X size={14} className="clear-search" onClick={() => setSearchQuery('')} />}
          </div>
          <div className="category-tabs pro-scrollbar">
            {CATEGORIES.map(cat => (
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

        <section className="sidebar-section patterns-section">
          <div className="section-title">
            <Layers size={16} />
            <span>PATTERNS ({filteredPatterns.length})</span>
          </div>
          <div className="pattern-grid">
            {filteredPatterns.length > 0 ? filteredPatterns.map(p => (
              <button 
                key={p.id}
                className={`pattern-card ${activePattern.id === p.id ? 'active' : ''}`}
                onClick={() => handlePatternChange(p)}
              >
                <div className="card-header">
                   <div className="pattern-name">{p.name}</div>
                   <div className="pattern-category">{p.category}</div>
                </div>
                <div className="pattern-desc">{p.description}</div>
              </button>
            )) : (
              <div className="no-results">No patterns found for "{searchQuery}"</div>
            )}
          </div>
        </section>

        <section className="sidebar-section">
          <div className="section-title">
            <Settings size={16} />
            <span>CONTROLS</span>
          </div>
          <div className="controls-list">
            {activePattern.uniforms.map(u => (
              <div key={u.id} className="control-group">
                <div className="control-label">
                  <span>{u.name}</span>
                  <span className="control-value">
                    {u.type === 'color' ? '' : uniforms[u.id]?.toFixed(2)}
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
                  <input 
                    type="color"
                    className="color-input"
                    value={uniforms[u.id] ? rgbToHex(uniforms[u.id]) : '#ffffff'}
                    onChange={(e) => handleUniformChange(u.id, hexToRgb(e.target.value))}
                  />
                )}
              </div>
            ))}
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
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-bar glass-panel">
          <div className="res-selector">
            {[1024, 2048, 4096].map(res => (
              <button key={res} onClick={() => setResolution(res)} className={resolution === res ? 'active' : ''}>
                {res/1024}K
              </button>
            ))}
          </div>
          
          <div className="actions">
             <button className="btn-secondary" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
               <Maximize size={18} />
             </button>
             <button className="btn-primary" onClick={downloadTexture}>
               <Download size={18} />
               <span>Export PNG</span>
             </button>
          </div>
        </header>

        <div className="viewport">
          <div className="canvas-wrapper">
            <canvas ref={canvasRef} />
            <div className="canvas-overlay">
              <span>{resolution} x {resolution} PREVIEW</span>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .app-container { display: flex; height: 100vh; width: 100vw; background: #050507; }
        .sidebar { width: 320px; height: 100%; padding: 24px; display: flex; flex-direction: column; gap: 24px; z-index: 10; transition: transform 0.3s ease; overflow-y: auto; overflow-x: hidden; }
        .sidebar.closed { transform: translateX(-100%); position: absolute; }
        .logo { display: flex; align-items: center; gap: 12px; }
        .logo h1 { font-size: 20px; font-weight: 800; color: #fff; }
        .logo h1 span { color: var(--color-accent); }
        
        .search-wrapper { position: relative; display: flex; align-items: center; }
        .search-icon { position: absolute; left: 12px; color: var(--color-text-dim); }
        .clear-search { position: absolute; right: 12px; color: var(--color-text-dim); cursor: pointer; }
        .search-input { width: 100%; background: #1a1a20; border: 1px solid var(--color-border); border-radius: 8px; padding: 10px 12px 10px 36px; color: #fff; font-size: 13px; outline: none; }
        
        .category-tabs { display: flex; gap: 8px; margin-top: 12px; padding-bottom: 4px; overflow-x: auto; white-space: nowrap; }
        .category-tab { padding: 4px 12px; font-size: 11px; font-weight: 700; border-radius: 20px; background: rgba(255,255,255,0.05); color: var(--color-text-dim); }
        .category-tab.active { background: var(--color-accent); color: #fff; }

        .section-title { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; color: var(--color-text-dim); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.1em; }
        .patterns-section { flex: 1; display: flex; flex-direction: column; min-height: 200px; }
        .pattern-grid { display: grid; grid-template-columns: 1fr; gap: 8px; }
        .pattern-card { padding: 12px; text-align: left; border-radius: 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
        .pattern-category { font-size: 9px; font-weight: 800; color: var(--color-accent); text-transform: uppercase; background: rgba(37, 99, 235, 0.1); padding: 2px 6px; border-radius: 4px; }
        .pattern-card.active { background: rgba(37, 99, 235, 0.15); border-color: var(--color-accent); box-shadow: var(--shadow-glow); }
        .pattern-name { font-weight: 600; font-size: 13px; }
        .pattern-desc { font-size: 10px; color: var(--color-text-dim); line-height: 1.3; }
        .no-results { font-size: 12px; color: var(--color-text-dim); text-align: center; padding: 20px; }

        .controls-list { display: flex; flex-direction: column; gap: 16px; }
        .control-group { display: flex; flex-direction: column; gap: 6px; }
        .control-label { display: flex; justify-content: space-between; font-size: 12px; color: var(--color-text); }
        .control-value { color: var(--color-accent); font-family: var(--font-mono); font-size: 10px; }
        .color-input { width: 100%; height: 32px; border-radius: 4px; border: none; background: none; cursor: pointer; }

        .mode-toggle { display: flex; background: #1a1a20; padding: 4px; border-radius: 8px; }
        .toggle-btn { flex: 1; padding: 8px; font-size: 11px; font-weight: 600; border-radius: 6px; color: var(--color-text-dim); }
        .toggle-btn.active { background: var(--color-accent); color: #fff; }
        .info-box { margin-top: 10px; padding: 10px; background: rgba(37, 99, 235, 0.1); border-radius: 6px; display: flex; align-items: center; gap: 8px; color: var(--color-accent); font-size: 10px; }

        .main-content { flex: 1; display: flex; flex-direction: column; padding: 20px; gap: 20px; position: relative; }
        .top-bar { height: 64px; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; }
        .res-selector { display: flex; gap: 8px; }
        .res-selector button { padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; background: rgba(255,255,255,0.05); color: var(--color-text-dim); }
        .res-selector button.active { background: #fff; color: #000; }
        
        .btn-primary { background: var(--color-accent); color: #fff; padding: 10px 20px; border-radius: 8px; display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; }
        .btn-primary:hover { background: var(--color-accent-hover); box-shadow: var(--shadow-glow); }
        .btn-secondary { background: rgba(255,255,255,0.05); color: #fff; width: 42px; height: 42px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }

        .viewport { flex: 1; display: flex; align-items: center; justify-content: center; background: #000; border-radius: 12px; overflow: hidden; position: relative;
          background-image: linear-gradient(45deg, #0a0a0a 25%, transparent 25%), linear-gradient(-45deg, #0a0a0a 25%, transparent 25%), 
          linear-gradient(45deg, transparent 75%, #0a0a0a 75%), linear-gradient(-45deg, transparent 75%, #0a0a0a 75%);
          background-size: 40px 40px; background-position: 0 0, 0 20px, 20px -20px, -20px 0px; }
        .canvas-wrapper { position: relative; box-shadow: 0 40px 100px rgba(0,0,0,0.8); }
        .canvas-overlay { position: absolute; bottom: 20px; right: 20px; background: rgba(0,0,0,0.5); padding: 6px 12px; border-radius: 4px; font-family: var(--font-mono); font-size: 9px; color: var(--color-text-dim); }
      `}</style>
    </div>
  );
}

export default App;
