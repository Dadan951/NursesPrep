import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { API_URL } from '../context/AuthContext';

/* ─── Palette ───────────────────────────────────────────────────────────────── */
const PALETTE = [
  { from: '#2563eb', to: '#0891b2', emoji: '📅' },
  { from: '#7c3aed', to: '#6d28d9', emoji: '📋' },
  { from: '#059669', to: '#047857', emoji: '📝' },
  { from: '#dc2626', to: '#db2777', emoji: '🎓' },
  { from: '#ea580c', to: '#d97706', emoji: '📖' },
  { from: '#0f766e', to: '#0891b2', emoji: '🔬' },
  { from: '#be185d', to: '#9333ea', emoji: '📜' },
  { from: '#6366f1', to: '#8b5cf6', emoji: '🏥' },
];

/* ─── Helpers ───────────────────────────────────────────────────────────────── */
const FILE_ICON_COLOR = {
  'application/pdf': '#ef4444',
  'image/jpeg': '#10b981', 'image/png': '#10b981', 'image/webp': '#10b981',
  'application/msword': '#3b82f6',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '#3b82f6',
};
const FILE_TYPE_LABEL = {
  'application/pdf': 'PDF',
  'image/jpeg': 'Image', 'image/png': 'Image', 'image/webp': 'Image',
  'application/msword': 'Word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
};
function formatSize(b) {
  if (!b) return '';
  if (b < 1024) return b + ' o';
  if (b < 1024 * 1024) return (b / 1024).toFixed(0) + ' Ko';
  return (b / (1024 * 1024)).toFixed(1) + ' Mo';
}
function isImage(mime) { return mime?.startsWith('image/'); }
function isPDF(mime)   { return mime === 'application/pdf'; }

/* ─── Breadcrumb ────────────────────────────────────────────────────────────── */
function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 flex-wrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          )}
          {item.onClick
            ? <button onClick={item.onClick} className="hover:text-blue-600 transition font-medium">{item.label}</button>
            : <span className="text-slate-700 font-semibold">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}

/* ─── File Viewer ───────────────────────────────────────────────────────────── */
function FileViewer({ annaleId, fileMimeType, fileName, fileSize }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  useEffect(() => {
    let url;
    axios.get(`${API_URL}/annales/${annaleId}/file`, { responseType: 'arraybuffer' })
      .then(r => {
        const blob = new Blob([r.data], { type: fileMimeType });
        url = URL.createObjectURL(blob);
        setBlobUrl(url);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [annaleId, fileMimeType]);

  if (loading) return (
    <div className="flex items-center justify-center py-8">
      <div className="w-7 h-7 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
    </div>
  );
  if (error) return (
    <div className="text-center py-6 text-red-400 text-sm">Impossible de charger le fichier.</div>
  );

  const color = FILE_ICON_COLOR[fileMimeType] || '#3b82f6';
  const label = FILE_TYPE_LABEL[fileMimeType] || 'Fichier';

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold px-2 py-0.5 rounded-md text-white" style={{ backgroundColor: color }}>{label}</span>
          <span className="text-xs text-slate-600 font-medium truncate max-w-xs">{fileName}</span>
          {fileSize > 0 && <span className="text-xs text-slate-400">{formatSize(fileSize)}</span>}
        </div>
        <a href={blobUrl} download={fileName}
          className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Télécharger
        </a>
      </div>
      {isImage(fileMimeType) ? (
        <div className="bg-gray-50 flex justify-center p-4">
          <img src={blobUrl} alt={fileName} className="max-w-full max-h-[65vh] rounded-xl object-contain"/>
        </div>
      ) : isPDF(fileMimeType) ? (
        <iframe src={blobUrl} title={fileName} className="w-full" style={{ height: '65vh', border: 'none' }}/>
      ) : (
        <div className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{fileName}</p>
            <a href={blobUrl} download={fileName} className="text-xs text-blue-500 hover:text-blue-700 underline transition">
              Cliquer pour télécharger
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Annale Card (detail view) ─────────────────────────────────────────────── */
function AnnaleCard({ annale, yearPalette, onBack }) {
  const color = FILE_ICON_COLOR[annale.fileMimeType] || '#3b82f6';
  return (
    <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl">
      <button onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-6 transition font-medium">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Retour
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Gradient top band */}
        <div className="h-1.5" style={{ background: `linear-gradient(90deg,${yearPalette.from},${yearPalette.to})` }}/>

        {/* Header */}
        <div className="px-6 py-5" style={{ background: `linear-gradient(135deg,${yearPalette.from}10,${yearPalette.from}05)`, borderBottom: '1px solid #e2e8f0' }}>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
              style={{ background: `linear-gradient(135deg,${yearPalette.from},${yearPalette.to})` }}>
              {annale.year}
            </span>
            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">{annale.semester}</span>
            <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">{annale.subject}</span>
            {annale.hasFile && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: color }}>
                {FILE_TYPE_LABEL[annale.fileMimeType] || 'Fichier'}
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold text-slate-800">{annale.title}</h1>
          {annale.description && <p className="text-sm text-slate-500 mt-1">{annale.description}</p>}
        </div>

        {/* File viewer */}
        <div className="p-6">
          {annale.hasFile ? (
            <FileViewer annaleId={annale._id} fileMimeType={annale.fileMimeType} fileName={annale.fileName} fileSize={annale.fileSize}/>
          ) : (
            <div className="text-center py-10 text-slate-400">
              <div className="text-4xl mb-3">📄</div>
              <p className="text-sm font-medium">Aucun fichier joint à cette annale</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main ──────────────────────────────────────────────────────────────────── */
export default function Annales() {
  const [annales, setAnnales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // annale being viewed

  const [view, setView]                 = useState('years');
  const [selectedYear, setSelectedYear]       = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubject, setSelectedSubject]   = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/annales`).then(r => setAnnales(r.data)).finally(() => setLoading(false));
  }, []);

  // Build structure: year → semester → subject → [annales]
  const structure = {};
  annales.forEach(a => {
    const yr  = a.year     || 'Autre';
    const sem = a.semester || 'Non classé';
    const sub = a.subject  || 'Général';
    if (!structure[yr]) structure[yr] = {};
    if (!structure[yr][sem]) structure[yr][sem] = {};
    if (!structure[yr][sem][sub]) structure[yr][sem][sub] = [];
    structure[yr][sem][sub].push(a);
  });

  // Sort years descending (most recent first)
  const years     = Object.keys(structure).sort((a, b) => b.localeCompare(a));
  const semesters = selectedYear ? Object.keys(structure[selectedYear] || {}).sort() : [];
  const subjects  = (selectedYear && selectedSemester) ? Object.keys(structure[selectedYear]?.[selectedSemester] || {}).sort() : [];
  const currentAnnales = (selectedYear && selectedSemester && selectedSubject)
    ? (structure[selectedYear]?.[selectedSemester]?.[selectedSubject] || []) : [];

  const totalInSem = (selectedYear && selectedSemester)
    ? Object.values(structure[selectedYear]?.[selectedSemester] || {}).flat().length : 0;

  const reset = () => { setView('years'); setSelectedYear(null); setSelectedSemester(null); setSelectedSubject(null); setSelected(null); };

  // Get palette for a year (consistent by index)
  const yearPalette = selectedYear ? PALETTE[years.indexOf(selectedYear) % PALETTE.length] : PALETTE[0];

  if (loading) return (
    <DashboardLayout>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto">

        {/* ── Hero ── */}
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0c4a6e 100%)' }} className="px-6 pt-8 pb-0">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Annales</h1>
              <p className="text-blue-200/70 text-sm">Sujets d'examens classés par année et semestre</p>
            </div>
            <div className="flex gap-4 text-center pb-1">
              <div>
                <p className="text-xl font-bold text-white">{annales.length}</p>
                <p className="text-xs text-blue-300/70">Sujets</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white">{years.length}</p>
                <p className="text-xs text-blue-300/70">Années</p>
              </div>
            </div>
          </div>
          {/* Tab underline spacer */}
          <div className="h-4"/>
        </div>

        {/* ── Content ── */}
        <div className="p-6 bg-slate-50 min-h-full">

          {/* Detail view — shown over navigation */}
          {selected && (
            <AnnaleCard
              annale={selected}
              yearPalette={yearPalette}
              onBack={() => setSelected(null)}
            />
          )}

          {!selected && (
            <AnimatePresence mode="wait">

              {/* YEARS */}
              {view === 'years' && (
                <motion.div key="years-view"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}>
                  {years.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                      <div className="text-5xl mb-3">📜</div>
                      <p className="font-semibold">Aucune annale disponible</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {years.map((year, idx) => {
                        const pal        = PALETTE[idx % PALETTE.length];
                        const semCount   = Object.keys(structure[year]).length;
                        const total      = Object.values(structure[year]).flatMap(s => Object.values(s)).flat().length;
                        return (
                          <motion.button key={year}
                            onClick={() => { setSelectedYear(year); setView('semesters'); }}
                            whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.97 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                            className="relative overflow-hidden rounded-2xl p-6 text-left shadow-md hover:shadow-xl transition-shadow"
                            style={{ background: `linear-gradient(135deg,${pal.from},${pal.to})` }}>
                            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 blur-2xl"/>
                            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-black/10 blur-xl"/>
                            <div className="text-4xl mb-4">{pal.emoji}</div>
                            <h3 className="font-bold text-white text-xl mb-1">{year}</h3>
                            <p className="text-white/75 text-xs mb-4">
                              {semCount} semestre{semCount > 1 ? 's' : ''} · {total} sujet{total > 1 ? 's' : ''}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex gap-1">
                                {Array.from({ length: Math.min(total, 6) }).map((_, i) => (
                                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/60"/>
                                ))}
                              </div>
                              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                                  <polyline points="9 18 15 12 9 6"/>
                                </svg>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* SEMESTERS */}
              {view === 'semesters' && selectedYear && (
                <motion.div key="sems-view"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}>
                  <Breadcrumb items={[
                    { label: 'Annales', onClick: reset },
                    { label: selectedYear }
                  ]}/>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-800">{selectedYear}</h2>
                    <p className="text-sm text-slate-400 mt-0.5">{semesters.length} semestre{semesters.length > 1 ? 's' : ''}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {semesters.map((sem, idx) => {
                      const pal      = PALETTE[idx % PALETTE.length];
                      const subCount = Object.keys(structure[selectedYear][sem]).length;
                      const total    = Object.values(structure[selectedYear][sem]).flat().length;
                      return (
                        <motion.button key={sem}
                          onClick={() => { setSelectedSemester(sem); setView('subjects'); }}
                          whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.98 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                          className="relative overflow-hidden rounded-2xl p-6 text-left shadow-md hover:shadow-xl transition-shadow"
                          style={{ background: `linear-gradient(135deg,${pal.from},${pal.to})` }}>
                          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10 blur-2xl"/>
                          <div className="text-3xl mb-3">{pal.emoji}</div>
                          <h3 className="font-bold text-white text-lg mb-1">{sem}</h3>
                          <p className="text-white/75 text-xs mb-3">
                            {subCount} matière{subCount > 1 ? 's' : ''} · {total} sujet{total > 1 ? 's' : ''}
                          </p>
                          <div className="flex justify-end">
                            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                                <polyline points="9 18 15 12 9 6"/>
                              </svg>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* SUBJECTS */}
              {view === 'subjects' && selectedYear && selectedSemester && (
                <motion.div key="subs-view"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}>
                  <Breadcrumb items={[
                    { label: 'Annales', onClick: reset },
                    { label: selectedYear, onClick: () => { setSelectedSemester(null); setView('semesters'); } },
                    { label: selectedSemester }
                  ]}/>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-800">{selectedSemester} — {selectedYear}</h2>
                    <p className="text-sm text-slate-400 mt-0.5">{totalInSem} sujet{totalInSem > 1 ? 's' : ''} disponible{totalInSem > 1 ? 's' : ''}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subjects.map((sub, idx) => {
                      const pal   = PALETTE[idx % PALETTE.length];
                      const count = structure[selectedYear][selectedSemester][sub].length;
                      return (
                        <motion.button key={sub}
                          onClick={() => { setSelectedSubject(sub); setView('annales'); }}
                          whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
                          className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50 transition-all text-left group flex items-center gap-4 shadow-sm">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                            style={{ background: `linear-gradient(135deg,${pal.from},${pal.to})` }}>
                            {pal.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-800 text-sm truncate">{sub}</h3>
                            <p className="text-xs text-slate-400 mt-0.5">{count} sujet{count > 1 ? 's' : ''} disponible{count > 1 ? 's' : ''}</p>
                          </div>
                          <div className="text-slate-300 group-hover:text-blue-500 transition flex-shrink-0">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                              <polyline points="9 18 15 12 9 6"/>
                            </svg>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ANNALES LIST */}
              {view === 'annales' && selectedYear && selectedSemester && selectedSubject && (
                <motion.div key="annales-list"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}>
                  <Breadcrumb items={[
                    { label: 'Annales', onClick: reset },
                    { label: selectedYear, onClick: () => { setSelectedSemester(null); setSelectedSubject(null); setView('semesters'); } },
                    { label: selectedSemester, onClick: () => { setSelectedSubject(null); setView('subjects'); } },
                    { label: selectedSubject }
                  ]}/>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-800">{selectedSubject}</h2>
                    <p className="text-sm text-slate-400 mt-0.5">
                      {currentAnnales.length} sujet{currentAnnales.length > 1 ? 's' : ''} · {selectedSemester} {selectedYear}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
                    {currentAnnales.map((annale, i) => {
                      const fileColor = FILE_ICON_COLOR[annale.fileMimeType] || '#3b82f6';
                      const fileLabel = FILE_TYPE_LABEL[annale.fileMimeType];
                      return (
                        <motion.div key={annale._id}
                          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                          className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-100 transition-all group">
                          {/* Top gradient band */}
                          <div className="h-1.5" style={{ background: `linear-gradient(90deg,${yearPalette.from},${yearPalette.to})` }}/>
                          <div className="p-5">
                            {/* Badges */}
                            <div className="flex items-center gap-2 flex-wrap mb-3">
                              {annale.hasFile && fileLabel && (
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                                  style={{ backgroundColor: fileColor }}>
                                  {fileLabel}
                                </span>
                              )}
                              {annale.hasFile && annale.fileSize > 0 && (
                                <span className="text-xs text-slate-400">{formatSize(annale.fileSize)}</span>
                              )}
                            </div>

                            <h3 className="text-sm font-bold text-slate-800 mb-1 leading-snug">{annale.title}</h3>
                            {annale.description && (
                              <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">{annale.description}</p>
                            )}

                            {/* Action button */}
                            <div className="flex gap-2 mt-3">
                              {annale.hasFile ? (
                                <motion.button onClick={() => setSelected(annale)}
                                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                  className="flex-1 py-2.5 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                                  style={{ background: `linear-gradient(135deg,${yearPalette.from},${yearPalette.to})` }}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                  </svg>
                                  Consulter le sujet
                                </motion.button>
                              ) : (
                                <div className="flex-1 py-2.5 bg-slate-100 text-slate-400 rounded-xl text-xs font-semibold text-center">
                                  Aucun fichier
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
