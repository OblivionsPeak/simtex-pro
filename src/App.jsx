import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ShaderEngine } from './engine/ShaderEngine';
import { PATTERNS, CATEGORIES } from './engine/patterns';
import { Download, Layers, Shield, Settings, Zap, Info, Maximize, Search, X } from 'lucide-react';

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
  
  // Update State
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateProgress, setUpdateProgress] = useState(0);
  const [isUpdateReady, setIsUpdateReady] = useState(false);
  const [masterOpacity, setMasterOpacity] = useState(1.0);

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

  // Handle viewport resizing
  useEffect(() => {
    const handleResize = () => {
      if (!engineRef.current || !canvasRef.current) return;
      // We calculate the available width for the viewport
      const sidebarWidth = isSidebarOpen ? 340 : 0;
      canvasRef.current.width = window.innerWidth - sidebarWidth - 40; 
      canvasRef.current.height = window.innerHeight - 100;
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  // Handle Update Events
  useEffect(() => {
    if (!window.electronAPI) return;

    window.electronAPI.onUpdateStatus((status) => {
        setUpdateStatus(status);
        if (status === 'Your system is up to date.') {
            setTimeout(() => setUpdateStatus(''), 3000);
        }
    });
    window.electronAPI.onUpdateProgress((percent) => setUpdateProgress(percent));
    window.electronAPI.onUpdateDownloaded(() => setIsUpdateReady(true));
  }, []);

  // Update Opacity in Engine
  useEffect(() => {
    if (engineRef.current) {
        engineRef.current.render({ u_opacity: masterOpacity });
    }
  }, [masterOpacity]);

  const updateShader = async (pattern) => {
    if (!engineRef.current) return;
    const defaults = {};
    pattern.uniforms.forEach(u => {
      defaults[u.id] = u.default;
    });
    setUniforms(defaults);
    await engineRef.current.setShader(pattern);
    // The engine handles its own loop now, just update initial values
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
      // Just update values, loop picks it up
      engineRef.current.render({ ...newUniforms, u_is_spec: isSpecMap ? 1.0 : 0.0 });
    }
  };

  useEffect(() => {
    if (engineRef.current) {
        engineRef.current.render({ u_is_spec: isSpecMap ? 1.0 : 0.0 });
    }
  }, [isSpecMap]);

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

  const hexToRgb = (hex, alpha = 1.0) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b, alpha];
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`sidebar glass-panel ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-top">
          <div className="sidebar-header">
            <div className="logo">
              <Shield size={24} color="var(--color-accent)" />
              <h1>SIMTEX<span>PRO</span></h1>
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
        </div>

        {/* Scrollable Patterns List */}
        <section className="patterns-container pro-scrollbar">
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

        {/* Fixed Controls at Bottom */}
        <div className="sidebar-bottom">
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
                  onChange={(e) => setMasterOpacity(parseFloat(e.target.value))}
                />
              </div>

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
                        onChange={(e) => handleUniformChange(u.id, hexToRgb(e.target.value, uniforms[u.id] ? uniforms[u.id][3] : 1.0))}
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
                            const current = uniforms[u.id] || [1,1,1,1];
                            handleUniformChange(u.id, [current[0], current[1], current[2], parseFloat(e.target.value)]);
                          }}
                        />
                      </div>
                    </div>
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

          {/* Update Progress/Status Notification */}
          {(updateStatus || isUpdateReady) && (
            <section className="sidebar-section update-section">
              <div className="update-card glass-panel">
                <div className="update-header">
                  <Zap size={14} className={isUpdateReady ? 'glow' : ''} />
                  <span>{isUpdateReady ? 'UPDATE READY' : 'SYSTEM UPDATE'}</span>
                </div>
                <p>{isUpdateReady ? `New version is downloaded and ready to install.` : updateStatus}</p>
                
                {updateProgress > 0 && !isUpdateReady && (
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${updateProgress}%` }}></div>
                  </div>
                )}
                
                {isUpdateReady && (
                  <button className="btn-update-install" onClick={() => window.electronAPI.restartAndInstall()}>
                    Restart & Install
                  </button>
                )}
              </div>
            </section>
          )}

          </div>
        </div>

        <div className="sidebar-footer">
          <button className="check-updates-link" onClick={() => window.electronAPI.checkForUpdates()}>
            Check for Updates
          </button>
          <span className="version-label">v1.1.0</span>
        </div>
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
        
        .category-tabs { display: flex; gap: 8px; margin-top: 12px; padding-bottom: 8px; overflow-x: auto; white-space: nowrap; }
        .category-tab { padding: 5px 14px; font-size: 11px; font-weight: 700; border-radius: 20px; background: rgba(255,255,255,0.05); color: var(--color-text-dim); transition: all 0.2s; }
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
        }
        .pattern-card:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.15); background: #16161c; }
        .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; }
        .pattern-category { font-size: 9px; font-weight: 800; color: var(--color-accent); text-transform: uppercase; background: rgba(37, 99, 235, 0.1); padding: 2px 6px; border-radius: 4px; }
        .pattern-card.active { background: rgba(37, 99, 235, 0.1); border-color: var(--color-accent); box-shadow: var(--shadow-glow); }
        .pattern-name { font-weight: 600; font-size: 13px; color: #fff; }
        .pattern-desc { font-size: 11px; color: var(--color-text-dim); line-height: 1.4; }
        .no-results { font-size: 12px; color: var(--color-text-dim); text-align: center; padding: 40px 20px; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1); }

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
      `}</style>
    </div>
  );
}

export default App;
