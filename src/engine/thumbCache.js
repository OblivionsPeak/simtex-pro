// IndexedDB cache for pattern thumbnails. Generating 500+ thumbnails means
// compiling 500+ shaders every visit; caching the rendered PNGs makes repeat
// loads instant. Entries are keyed by pattern id and salted with the app
// version — any release invalidates the whole cache, so pattern tweaks that
// don't change the id (wobble fixes, recolors) still get fresh thumbs.

const DB_NAME = 'simtex-thumbs';
const STORE = 'thumbs';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// All cached thumbnails matching this app version: { [patternId]: dataUrl }.
// Stale-version entries are ignored (and swept on the next save).
export async function loadThumbs(version) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).openCursor();
    const out = {};
    req.onsuccess = () => {
      const cursor = req.result;
      if (!cursor) { db.close(); resolve(out); return; }
      const v = cursor.value;
      if (v && v.version === version) out[cursor.key] = v.dataUrl;
      cursor.continue();
    };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

// Persist a batch of freshly rendered thumbnails; also drops any entry left
// over from a previous version so the store doesn't grow across releases.
export async function saveThumbs(version, batch) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    for (const [id, dataUrl] of Object.entries(batch)) {
      store.put({ version, dataUrl }, id);
    }
    const sweep = store.openCursor();
    sweep.onsuccess = () => {
      const cursor = sweep.result;
      if (!cursor) return;
      if (cursor.value && cursor.value.version !== version) cursor.delete();
      cursor.continue();
    };
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}
