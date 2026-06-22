import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { API_URL, useAuth } from '../context/AuthContext';
import { getCache, setCache } from '../utils/cache';

/* ─── Helpers ────────────────────────────────────────────────────────────────── */
const DIFF_COLORS = { easy: 'bg-emerald-100 text-emerald-700', medium: 'bg-amber-100 text-amber-700', hard: 'bg-red-100 text-red-700' };
const DIFF_LABEL  = { easy: 'Facile', medium: 'Moyen', hard: 'Difficile' };

const FILE_ICON_COLOR = {
  'application/pdf': '#ef4444',
  'image/jpeg': '#10b981', 'image/png': '#10b981', 'image/webp': '#10b981',
  'application/msword': '#3b82f6',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '#3b82f6',
  'text/plain': '#6366f1',
};
const FILE_TYPE_LABEL = {
  'application/pdf': 'PDF',
  'image/jpeg': 'Image', 'image/png': 'Image', 'image/webp': 'Image',
  'application/msword': 'Word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
  'text/plain': 'Texte',
};

function formatSize(b) {
  if (!b) return '';
  if (b < 1024) return b + ' o';
  if (b < 1024 * 1024) return (b / 1024).toFixed(0) + ' Ko';
  return (b / (1024 * 1024)).toFixed(1) + ' Mo';
}
function isImage(mime) { return mime?.startsWith('image/'); }
function isPDF(mime)   { return mime === 'application/pdf'; }

/* ─── File Viewer ────────────────────────────────────────────────────────────── */
function FileViewer({ lessonId, fileMimeType, fileName, fileSize }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  useEffect(() => {
    let url;
    axios.get(`${API_URL}/lessons/${lessonId}/file`, { responseType: 'arraybuffer' })
      .then(r => {
        const blob = new Blob([r.data], { type: fileMimeType });
        url = URL.createObjectURL(blob);
        setBlobUrl(url);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [lessonId, fileMimeType]);

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
          {fileSize && <span className="text-xs text-slate-400">{formatSize(fileSize)}</span>}
        </div>
        <a href={blobUrl} download={fileName}
          className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Télécharger
        </a>
      </div>
      {isImage(fileMimeType) ? (
        <div className="bg-gray-50 flex justify-center p-4">
          <img src={blobUrl} alt={fileName} className="max-w-full max-h-[60vh] rounded-xl object-contain"/>
        </div>
      ) : isPDF(fileMimeType) ? (
        <iframe src={blobUrl} title={fileName} className="w-full" style={{ height: '60vh', border: 'none' }}/>
      ) : (
        <div className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{fileName}</p>
            <a href={blobUrl} download={fileName} className="text-xs text-blue-500 hover:text-blue-700 underline transition">Cliquez pour télécharger</a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Text Content Renderer ──────────────────────────────────────────────────── */
function LessonContent({ content }) {
  if (!content?.trim()) return null;
  return (
    <div className="space-y-1">
      {content.split('\n').map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return <h3 key={i} className="text-sm font-bold text-slate-800 mt-5 mb-2 first:mt-0">{line.slice(2,-2)}</h3>;
        }
        if (line.startsWith('- ') || line.match(/^\d+\.\s/)) {
          return <p key={i} className="text-sm text-slate-700 leading-relaxed pl-4 flex gap-2"><span className="text-blue-400 flex-shrink-0 mt-1">·</span>{line.replace(/^- /,'').replace(/^\d+\.\s/,'')}</p>;
        }
        if (!line.trim()) return <div key={i} className="h-2"/>;
        return <p key={i} className="text-sm text-slate-700 leading-relaxed">{line}</p>;
      })}
    </div>
  );
}

/* ─── Category color palette for cours cards ────────────────────────────────── */
const CAT_COLORS = [
  '#2563eb','#0891b2','#7c3aed','#059669','#dc2626','#ea580c','#be185d','#0f766e',
];
function catColor(str) {
  if (!str) return CAT_COLORS[0];
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffff;
  return CAT_COLORS[h % CAT_COLORS.length];
}

const COURS_PALETTE = [
  { from: '#6366f1', to: '#8b5cf6', emoji: '' },
  { from: '#0891b2', to: '#0284c7', emoji: '' },
  { from: '#059669', to: '#047857', emoji: '' },
  { from: '#dc2626', to: '#db2777', emoji: '' },
  { from: '#ea580c', to: '#d97706', emoji: '' },
  { from: '#7c3aed', to: '#6d28d9', emoji: '' },
  { from: '#0f766e', to: '#0891b2', emoji: '' },
  { from: '#be185d', to: '#9333ea', emoji: '' },
];

function CoursBreadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-5 flex-wrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>}
          {item.onClick
            ? <button onClick={item.onClick} className="hover:text-blue-600 transition font-medium">{item.label}</button>
            : <span className="text-slate-700 font-semibold">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}

/* ─── Cours Tab ──────────────────────────────────────────────────────────────── */
/* ─── Quota helpers (localStorage, free plan) ────────────────────────────────── */
const monthKey = () => new Date().toISOString().slice(0, 7);

function getViewed(type) {
  return JSON.parse(localStorage.getItem(`${type}_viewed_${monthKey()}`) || '[]');
}
function addViewed(type, id) {
  const list = getViewed(type);
  if (!list.includes(id)) localStorage.setItem(`${type}_viewed_${monthKey()}`, JSON.stringify([...list, id]));
}

function QuotaModal({ type, onClose }) {
  const navigate = useNavigate();
  const labels = {
    cours: { title: 'Accès limité aux cours', body: 'Le plan Gratuit vous permet de lire 1 cours par mois. Passez à Étudiant pour un accès illimité.' },
    fiche: { title: 'Accès limité aux fiches', body: 'Le plan Gratuit vous permet de consulter 1 fiche de révision par mois. Passez à Étudiant pour un accès illimité.' },
  };
  const { title, body } = labels[type] || labels.cours;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
        onClick={e => e.stopPropagation()}>
        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">{body}</p>
        <div className="flex flex-col gap-2">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/dashboard/subscription')}
            className="w-full py-3 rounded-2xl text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #2563eb, #0891b2)' }}>
            Voir les abonnements
          </motion.button>
          <button onClick={onClose}
            className="w-full py-2.5 rounded-2xl text-sm font-semibold text-slate-500 hover:bg-slate-50 transition">
            Plus tard
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CoursTab() {
  const { user } = useAuth();
  const isFree   = (user?.subscription || 'free') === 'free';

  const [lessons, setLessons]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [quotaModal, setQuotaModal] = useState(false);

  const [view, setView]                 = useState('semesters');
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedUE, setSelectedUE]             = useState(null);
  const [selectedChapter, setSelectedChapter]   = useState(null);

  useEffect(() => {
    const cached = getCache('lessons_cours');
    if (cached) { setLessons(cached); setLoading(false); }
    axios.get(`${API_URL}/lessons?type=cours`).then(r => {
      setLessons(r.data); setCache('lessons_cours', r.data);
    }).finally(() => setLoading(false));
  }, []);

  // Build 3-level structure
  const structure = {};
  lessons.forEach(l => {
    const sem  = (l.semester  || 'Non classé').trim();
    const ue   = (l.category  || 'Autre').trim();
    const chap = (l.chapter   || 'Général').trim();
    if (!structure[sem]) structure[sem] = {};
    if (!structure[sem][ue]) structure[sem][ue] = {};
    if (!structure[sem][ue][chap]) structure[sem][ue][chap] = [];
    structure[sem][ue][chap].push(l);
  });

  const semesters   = Object.keys(structure).sort();
  const ues         = selectedSemester ? Object.keys(structure[selectedSemester] || {}).sort() : [];
  const chapters    = (selectedSemester && selectedUE) ? Object.keys(structure[selectedSemester]?.[selectedUE] || {}).sort() : [];
  const currentLessons = (selectedSemester && selectedUE && selectedChapter)
    ? (structure[selectedSemester]?.[selectedUE]?.[selectedChapter] || []) : [];

  const reset = () => { setView('semesters'); setSelectedSemester(null); setSelectedUE(null); setSelectedChapter(null); };

  const openLesson = async (lesson) => {
    if (isFree) {
      const viewed = getViewed('cours');
      if (!viewed.includes(lesson._id) && viewed.length >= 1) {
        setQuotaModal(true);
        return;
      }
      addViewed('cours', lesson._id);
    }
    setFetching(true);
    try {
      const { data } = await axios.get(`${API_URL}/lessons/${lesson._id}`);
      setSelected(data);
    } finally { setFetching(false); }
  };

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
    </div>
  );

  return (
    <>
      <AnimatePresence>{quotaModal && <QuotaModal type="cours" onClose={() => setQuotaModal(false)}/>}</AnimatePresence>
      <CoursTabContent selected={selected} setSelected={setSelected} fetching={fetching} view={view} setView={setView}
        selectedSemester={selectedSemester} setSelectedSemester={setSelectedSemester}
        selectedUE={selectedUE} setSelectedUE={setSelectedUE}
        selectedChapter={selectedChapter} setSelectedChapter={setSelectedChapter}
        semesters={semesters} ues={ues} chapters={chapters} currentLessons={currentLessons}
        openLesson={openLesson} reset={reset} structure={structure}/>
    </>
  );
}

function CoursTabContent({ selected, setSelected, fetching, view, setView,
  selectedSemester, setSelectedSemester, selectedUE, setSelectedUE,
  selectedChapter, setSelectedChapter, semesters, ues, chapters, currentLessons,
  openLesson, reset, structure }) {

  /* ── Lesson detail view ── */
  if (selected) return (
    <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl">
      <button onClick={() => setSelected(null)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-6 transition font-medium">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        Retour
      </button>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-5" style={{ background: `linear-gradient(135deg, ${catColor(selected.category)}18, ${catColor(selected.category)}08)`, borderBottom: `3px solid ${catColor(selected.category)}` }}>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: catColor(selected.category) }}>{selected.category}</span>
            {selected.chapter && <span className="text-xs text-slate-500 font-medium">{selected.chapter}</span>}
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${DIFF_COLORS[selected.difficulty]}`}>{DIFF_LABEL[selected.difficulty]}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-800">{selected.title}</h1>
          {selected.summary && <p className="text-sm text-slate-500 mt-1">{selected.summary}</p>}
        </div>
        <div className="p-6 space-y-6">
          {selected.hasFile && <FileViewer lessonId={selected._id} fileMimeType={selected.fileMimeType} fileName={selected.fileName} fileSize={selected.fileSize}/>}
          {selected.content?.trim() && <div className="pt-1"><LessonContent content={selected.content}/></div>}
          {selected.tags?.length > 0 && (
            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2">
              {selected.tags.map(tag => <span key={tag} className="text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full font-medium">#{tag}</span>)}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  /* ── Navigation views ── */
  return (
    <AnimatePresence mode="wait">

      {/* SEMESTERS */}
      {view === 'semesters' && (
        <motion.div key="sems" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
          {semesters.length === 0 ? (
            <div className="text-center py-16 text-slate-400"><div className="text-5xl mb-3"></div><p className="font-semibold">Aucun cours disponible</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {semesters.map((sem, idx) => {
                const pal     = COURS_PALETTE[idx % COURS_PALETTE.length];
                const ueCount = Object.keys(structure[sem]).length;
                const total   = Object.values(structure[sem]).flatMap(ue => Object.values(ue)).flat().length;
                return (
                  <motion.button key={sem}
                    onClick={() => { setSelectedSemester(sem); setView('ues'); }}
                    whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    className="relative overflow-hidden rounded-2xl p-6 text-left shadow-md hover:shadow-xl transition-shadow"
                    style={{ background: `linear-gradient(135deg,${pal.from},${pal.to})` }}>
                    <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 blur-2xl"/>
                    <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-black/10 blur-xl"/>
                    <h3 className="font-bold text-white text-base mb-1">{sem}</h3>
                    <p className="text-white/75 text-xs mb-4">{ueCount} UE · {total} cours</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">{Array.from({ length: Math.min(ueCount, 5) }).map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/60"/>)}</div>
                      <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* UEs */}
      {view === 'ues' && selectedSemester && (
        <motion.div key="ues-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
          <CoursBreadcrumb items={[{ label: 'Cours', onClick: reset }, { label: selectedSemester }]}/>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-800">{selectedSemester}</h2>
            <p className="text-sm text-slate-400 mt-0.5">{ues.length} unité{ues.length > 1 ? 's' : ''} d'enseignement</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ues.map((ue, idx) => {
              const pal     = COURS_PALETTE[idx % COURS_PALETTE.length];
              const total   = Object.values(structure[selectedSemester][ue]).flat().length;
              const chCount = Object.keys(structure[selectedSemester][ue]).length;
              return (
                <motion.button key={ue}
                  onClick={() => { setSelectedUE(ue); setView('chapters'); }}
                  whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="relative overflow-hidden rounded-2xl p-5 text-left shadow-md hover:shadow-xl transition-shadow"
                  style={{ background: `linear-gradient(135deg,${pal.from},${pal.to})` }}>
                  <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10 blur-2xl"/>
                  <h3 className="font-bold text-white text-sm mb-1">{ue}</h3>
                  <p className="text-white/75 text-xs mb-3">{chCount} chapitre{chCount > 1 ? 's' : ''} · {total} cours</p>
                  <div className="flex justify-end">
                    <div className="w-7 h-7 bg-white/20 rounded-xl flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* CHAPTERS */}
      {view === 'chapters' && selectedSemester && selectedUE && (
        <motion.div key="chaps" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
          <CoursBreadcrumb items={[
            { label: 'Cours', onClick: reset },
            { label: selectedSemester, onClick: () => { setSelectedUE(null); setView('ues'); } },
            { label: selectedUE }
          ]}/>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-800">{selectedUE}</h2>
            <p className="text-sm text-slate-400 mt-0.5">{chapters.length} chapitre{chapters.length > 1 ? 's' : ''}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chapters.map((chap, idx) => {
              const pal   = COURS_PALETTE[idx % COURS_PALETTE.length];
              const count = structure[selectedSemester][selectedUE][chap].length;
              return (
                <motion.button key={chap}
                  onClick={() => { setSelectedChapter(chap); setView('lessons'); }}
                  whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50 transition-all text-left group flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                    style={{ background: `linear-gradient(135deg,${pal.from},${pal.to})` }}>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-sm truncate">{chap}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{count} cours</p>
                  </div>
                  <div className="text-slate-300 group-hover:text-blue-500 transition flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* LESSONS LIST */}
      {view === 'lessons' && selectedSemester && selectedUE && selectedChapter && (
        <motion.div key="lessons-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
          <CoursBreadcrumb items={[
            { label: 'Cours', onClick: reset },
            { label: selectedSemester, onClick: () => { setSelectedUE(null); setSelectedChapter(null); setView('ues'); } },
            { label: selectedUE, onClick: () => { setSelectedChapter(null); setView('chapters'); } },
            { label: selectedChapter }
          ]}/>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-800">{selectedChapter}</h2>
            <p className="text-sm text-slate-400 mt-0.5">{currentLessons.length} cours</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentLessons.map((lesson, i) => {
              const cc = catColor(lesson.category);
              return (
                <motion.button key={lesson._id}
                  onClick={() => openLesson(lesson)}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i < 6 ? i * 0.04 : 0, duration: 0.25 }}
                  whileHover={{ y: -4 }} whileTap={{ y: 0 }}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:shadow-blue-100 transition-all text-left group relative">
                  {fetching && <div className="absolute inset-0 rounded-2xl bg-white/80 flex items-center justify-center z-10"><div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/></div>}
                  <div className="h-1.5" style={{ background: `linear-gradient(90deg,${cc},${cc}88)` }}/>
                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs"
                        style={{ backgroundColor: cc + '22', color: cc, border: `1.5px solid ${cc}33` }}>
                        {lesson.category?.slice(0,2) || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFF_COLORS[lesson.difficulty]}`}>{DIFF_LABEL[lesson.difficulty]}</span>
                          {lesson.hasFile && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: (FILE_ICON_COLOR[lesson.fileMimeType]||'#3b82f6') + '15', color: FILE_ICON_COLOR[lesson.fileMimeType]||'#3b82f6' }}>{FILE_TYPE_LABEL[lesson.fileMimeType] || 'Fichier'}</span>}
                        </div>
                        <h3 className="text-sm font-bold text-slate-800 leading-snug">{lesson.title}</h3>
                        {lesson.summary && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{lesson.summary}</p>}
                      </div>
                    </div>
                    <div className="flex justify-end mt-3">
                      <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600 transition flex items-center gap-1">
                        Lire <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Fiches Tab ─────────────────────────────────────────────────────────────── */
const FICHE_COLORS = [
  { bg: '#eff6ff', border: '#bfdbfe', accent: '#2563eb', light: '#dbeafe', text: '#1e3a5f' },
  { bg: '#f5f3ff', border: '#ddd6fe', accent: '#7c3aed', light: '#ede9fe', text: '#3b0764' },
  { bg: '#f0fdf4', border: '#bbf7d0', accent: '#16a34a', light: '#dcfce7', text: '#052e16' },
  { bg: '#fff7ed', border: '#fed7aa', accent: '#ea580c', light: '#ffedd5', text: '#431407' },
  { bg: '#fdf2f8', border: '#fbcfe8', accent: '#db2777', light: '#fce7f3', text: '#500724' },
];

function FicheFileCard({ fiche, index }) {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const isFree    = (user?.subscription || 'free') === 'free';

  const palette = FICHE_COLORS[index % FICHE_COLORS.length];
  const [open,       setOpen]       = useState(false);
  const [fullData,   setFullData]   = useState(null);
  const [loadingFull, setLoadingFull] = useState(false);
  const [quotaModal, setQuotaModal] = useState(false);

  const handleOpen = async () => {
    if (!open && !fullData && isFree) {
      const viewed = getViewed('fiche');
      if (!viewed.includes(fiche._id) && viewed.length >= 1) {
        setQuotaModal(true);
        return;
      }
      addViewed('fiche', fiche._id);
    }
    if (!fullData) {
      setLoadingFull(true);
      try {
        const { data } = await axios.get(`${API_URL}/lessons/${fiche._id}`);
        setFullData(data);
      } finally { setLoadingFull(false); }
    }
    setOpen(o => !o);
  };

  const lesson = fullData || fiche;

  return (
    <>
      <AnimatePresence>
        {quotaModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setQuotaModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
              onClick={e => e.stopPropagation()}>
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Accès limité aux fiches</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Le plan Gratuit vous permet de consulter <strong>1 fiche de révision</strong> par mois.<br/>
                Passez à Étudiant pour un accès illimité.
              </p>
              <div className="flex flex-col gap-2">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/dashboard/subscription')}
                  className="w-full py-3 rounded-2xl text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #0891b2)' }}>
                  Voir les abonnements
                </motion.button>
                <button onClick={() => setQuotaModal(false)}
                  className="w-full py-2.5 rounded-2xl text-sm font-semibold text-slate-500 hover:bg-slate-50 transition">
                  Plus tard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    <div className="rounded-2xl overflow-hidden border transition-all shadow-sm hover:shadow-md"
      style={{ borderColor: open ? palette.accent : palette.border }}>
      <button onClick={handleOpen} className="w-full px-5 py-4 flex items-center justify-between text-left transition-all"
        style={{ backgroundColor: open ? palette.accent : palette.bg }}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: open ? 'rgba(255,255,255,0.25)' : palette.light, color: open ? 'white' : palette.accent }}>
              {fiche.category}
            </span>
            {fiche.hasFile && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: open ? 'rgba(255,255,255,0.15)' : palette.border, color: open ? 'rgba(255,255,255,0.9)' : palette.accent }}>
                {FILE_TYPE_LABEL[fiche.fileMimeType] || 'Fichier'}
              </span>
            )}
          </div>
          <h3 className="text-sm font-bold truncate" style={{ color: open ? 'white' : palette.text }}>{fiche.title}</h3>
          {fiche.summary && !open && (
            <p className="text-xs mt-0.5 line-clamp-1" style={{ color: palette.accent, opacity: 0.7 }}>{fiche.summary}</p>
          )}
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
          className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ml-3"
          style={{ backgroundColor: open ? 'rgba(255,255,255,0.2)' : palette.light }}
        >
          {loadingFull
            ? <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: open ? 'white' : palette.accent }}/>
            : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={open ? 'white' : palette.accent} strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          }
        </motion.div>
      </button>

      <AnimatePresence>
        {open && fullData && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 space-y-4" style={{ backgroundColor: palette.bg }}>
              {fullData.hasFile && (
                <FileViewer lessonId={fullData._id} fileMimeType={fullData.fileMimeType} fileName={fullData.fileName} fileSize={fullData.fileSize}/>
              )}
              {fullData.content?.trim() && (
                <div>
                  {fullData.content.split('\n').map((line, i) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <h4 key={i} className="text-xs font-bold mt-3 mb-1.5 first:mt-0" style={{ color: palette.accent }}>{line.slice(2,-2)}</h4>;
                    }
                    if (line.startsWith('- ') || line.match(/^\d+\.\s/)) {
                      return <p key={i} className="text-xs leading-relaxed pl-3" style={{ color: palette.text }}>· {line.replace(/^- /,'').replace(/^\d+\.\s/,'')}</p>;
                    }
                    if (!line.trim()) return <div key={i} className="h-1.5"/>;
                    return <p key={i} className="text-xs leading-relaxed" style={{ color: palette.text }}>{line}</p>;
                  })}
                </div>
              )}
              {fullData.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2" style={{ borderTop: `1px solid ${palette.border}` }}>
                  {fullData.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: palette.light, color: palette.accent }}>#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}

function FichesTab() {
  const [fiches, setFiches]   = useState([]);
  const [loading, setLoading] = useState(true);

  const [view, setView]                 = useState('semesters');
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedUE, setSelectedUE]             = useState(null);
  const [selectedChapter, setSelectedChapter]   = useState(null);

  useEffect(() => {
    const cached = getCache('lessons_fiches');
    if (cached) { setFiches(cached); setLoading(false); }
    axios.get(`${API_URL}/lessons?type=fiche`).then(r => {
      setFiches(r.data); setCache('lessons_fiches', r.data);
    }).finally(() => setLoading(false));
  }, []);

  const structure = {};
  fiches.forEach(f => {
    const sem  = (f.semester  || 'Non classé').trim();
    const ue   = (f.category  || 'Autre').trim();
    const chap = (f.chapter   || 'Général').trim();
    if (!structure[sem]) structure[sem] = {};
    if (!structure[sem][ue]) structure[sem][ue] = {};
    if (!structure[sem][ue][chap]) structure[sem][ue][chap] = [];
    structure[sem][ue][chap].push(f);
  });

  const semesters     = Object.keys(structure).sort();
  const ues           = selectedSemester ? Object.keys(structure[selectedSemester] || {}).sort() : [];
  const chapters      = (selectedSemester && selectedUE) ? Object.keys(structure[selectedSemester]?.[selectedUE] || {}).sort() : [];
  const currentFiches = (selectedSemester && selectedUE && selectedChapter)
    ? (structure[selectedSemester]?.[selectedUE]?.[selectedChapter] || []) : [];

  const reset = () => { setView('semesters'); setSelectedSemester(null); setSelectedUE(null); setSelectedChapter(null); };

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
    </div>
  );

  return (
    <AnimatePresence mode="wait">

      {/* SEMESTERS */}
      {view === 'semesters' && (
        <motion.div key="sems-f" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
          {semesters.length === 0 ? (
            <div className="text-center py-16 text-slate-400"><div className="text-5xl mb-3"></div><p className="font-semibold">Aucune fiche disponible</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {semesters.map((sem, idx) => {
                const pal     = COURS_PALETTE[idx % COURS_PALETTE.length];
                const ueCount = Object.keys(structure[sem]).length;
                const total   = Object.values(structure[sem]).flatMap(ue => Object.values(ue)).flat().length;
                return (
                  <motion.button key={sem}
                    onClick={() => { setSelectedSemester(sem); setView('ues'); }}
                    whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    className="relative overflow-hidden rounded-2xl p-6 text-left shadow-md hover:shadow-xl transition-shadow"
                    style={{ background: `linear-gradient(135deg,${pal.from},${pal.to})` }}>
                    <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 blur-2xl"/>
                    <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-black/10 blur-xl"/>
                    <h3 className="font-bold text-white text-base mb-1">{sem}</h3>
                    <p className="text-white/75 text-xs mb-4">{ueCount} UE · {total} fiche{total > 1 ? 's' : ''}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">{Array.from({ length: Math.min(ueCount, 5) }).map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/60"/>)}</div>
                      <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* UEs */}
      {view === 'ues' && selectedSemester && (
        <motion.div key="ues-f" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
          <CoursBreadcrumb items={[{ label: 'Fiches', onClick: reset }, { label: selectedSemester }]}/>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-800">{selectedSemester}</h2>
            <p className="text-sm text-slate-400 mt-0.5">{ues.length} unité{ues.length > 1 ? 's' : ''} d'enseignement</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ues.map((ue, idx) => {
              const pal     = COURS_PALETTE[idx % COURS_PALETTE.length];
              const total   = Object.values(structure[selectedSemester][ue]).flat().length;
              const chCount = Object.keys(structure[selectedSemester][ue]).length;
              return (
                <motion.button key={ue}
                  onClick={() => { setSelectedUE(ue); setView('chapters'); }}
                  whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="relative overflow-hidden rounded-2xl p-5 text-left shadow-md hover:shadow-xl transition-shadow"
                  style={{ background: `linear-gradient(135deg,${pal.from},${pal.to})` }}>
                  <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10 blur-2xl"/>
                  <h3 className="font-bold text-white text-sm mb-1">{ue}</h3>
                  <p className="text-white/75 text-xs mb-3">{chCount} chapitre{chCount > 1 ? 's' : ''} · {total} fiche{total > 1 ? 's' : ''}</p>
                  <div className="flex justify-end">
                    <div className="w-7 h-7 bg-white/20 rounded-xl flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* CHAPTERS */}
      {view === 'chapters' && selectedSemester && selectedUE && (
        <motion.div key="chaps-f" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
          <CoursBreadcrumb items={[
            { label: 'Fiches', onClick: reset },
            { label: selectedSemester, onClick: () => { setSelectedUE(null); setView('ues'); } },
            { label: selectedUE }
          ]}/>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-800">{selectedUE}</h2>
            <p className="text-sm text-slate-400 mt-0.5">{chapters.length} chapitre{chapters.length > 1 ? 's' : ''}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chapters.map((chap, idx) => {
              const pal   = COURS_PALETTE[idx % COURS_PALETTE.length];
              const count = structure[selectedSemester][selectedUE][chap].length;
              return (
                <motion.button key={chap}
                  onClick={() => { setSelectedChapter(chap); setView('fiches'); }}
                  whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50 transition-all text-left group flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                    style={{ background: `linear-gradient(135deg,${pal.from},${pal.to})` }}>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-sm truncate">{chap}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{count} fiche{count > 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-slate-300 group-hover:text-blue-500 transition flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* FICHES LIST */}
      {view === 'fiches' && selectedSemester && selectedUE && selectedChapter && (
        <motion.div key="fiches-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
          <CoursBreadcrumb items={[
            { label: 'Fiches', onClick: reset },
            { label: selectedSemester, onClick: () => { setSelectedUE(null); setSelectedChapter(null); setView('ues'); } },
            { label: selectedUE, onClick: () => { setSelectedChapter(null); setView('chapters'); } },
            { label: selectedChapter }
          ]}/>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-800">{selectedChapter}</h2>
            <p className="text-sm text-slate-400 mt-0.5">{currentFiches.length} fiche{currentFiches.length > 1 ? 's' : ''}</p>
          </div>
          <div className="space-y-3 max-w-2xl">
            {currentFiches.map((fiche, i) => <FicheFileCard key={fiche._id} fiche={fiche} index={i}/>)}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── AI Revision Sheet components (unchanged) ───────────────────────────────── */
const COLOR_PALETTE = {
  blue:   { bg: '#eff6ff', border: '#bfdbfe', accent: '#3b82f6', text: '#1e3a5f' },
  purple: { bg: '#f5f3ff', border: '#ddd6fe', accent: '#7c3aed', text: '#3b0764' },
  green:  { bg: '#f0fdf4', border: '#bbf7d0', accent: '#16a34a', text: '#052e16' },
  orange: { bg: '#fff7ed', border: '#fed7aa', accent: '#ea580c', text: '#431407' },
  pink:   { bg: '#fdf2f8', border: '#fbcfe8', accent: '#db2777', text: '#500724' },
};

const SECTION_ICONS = {
  definition: c => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  key_points: c => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  schema:     c => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  remember:   c => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>,
  caution:    c => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  values:     c => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
};

function RevisionSheetCard({ sheet, onDelete }) {
  const palette  = COLOR_PALETTE[sheet.colorScheme] || COLOR_PALETTE.blue;
  const sections = sheet.content?.sections || [];
  return (
    <div className="rounded-2xl overflow-hidden border shadow-sm" style={{ borderColor: palette.border }}>
      <div className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: palette.accent }}>
        <div>
          <h3 className="text-sm font-bold text-white">{sheet.title}</h3>
          {sheet.category && <p className="text-xs text-white/70 mt-0.5">{sheet.category}</p>}
        </div>
        <button onClick={() => onDelete(sheet._id)}
          className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      </div>
      <div className="p-4 space-y-3" style={{ backgroundColor: palette.bg }}>
        {sections.map((section, i) => (
          <div key={i} className="bg-white rounded-xl p-3.5 border" style={{ borderColor: palette.border }}>
            <div className="flex items-center gap-2 mb-2">
              {SECTION_ICONS[section.type]?.(palette.accent)}
              <span className="text-xs font-bold" style={{ color: palette.accent }}>{section.title}</span>
            </div>
            {(section.type === 'key_points' || section.type === 'caution' || section.type === 'values') ? (
              <ul className="space-y-1">
                {(section.items || []).map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs" style={{ color: palette.text }}>
                    <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: palette.accent }}/>
                    {item}
                  </li>
                ))}
              </ul>
            ) : section.type === 'schema' ? (
              <div className="flex flex-wrap items-center gap-1.5">
                {(section.steps || []).map((step, j) => (
                  <div key={j} className="flex items-center gap-1.5">
                    <span className="text-xs px-2.5 py-1 rounded-lg font-medium" style={{ backgroundColor: palette.border, color: palette.text }}>{step}</span>
                    {j < section.steps.length - 1 && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={palette.accent} strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs leading-relaxed" style={{ color: palette.text }}>{section.content}</p>
            )}
          </div>
        ))}
      </div>
      <div className="px-4 py-2 text-right" style={{ backgroundColor: palette.bg, borderTop: `1px solid ${palette.border}` }}>
        <span className="text-xs" style={{ color: palette.accent }}>
          {new Date(sheet.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      </div>
    </div>
  );
}

/* ─── Fiches Perso Tab (all original logic preserved) ───────────────────────── */
const PERSO_FILE_ACCEPT = '.pdf,.jpg,.jpeg,.png,.webp';
const PERSO_FILE_MIME   = { 'application/pdf': 'PDF', 'image/jpeg': 'Image', 'image/png': 'Image', 'image/jpg': 'Image', 'image/webp': 'Image' };
const PERSO_FILE_COLORS = { PDF: 'bg-red-100 text-red-600', Image: 'bg-emerald-100 text-emerald-600' };
const SOURCE_MODES = [
  { id: 'text',  label: 'Texte',  icon: (a) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={a} strokeWidth="2" strokeLinecap="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg> },
  { id: 'image', label: 'Image',  icon: (a) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={a} strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
  { id: 'pdf',   label: 'PDF',    icon: (a) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={a} strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
];

function FichesPersoUpgradeWall() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="max-w-md w-full text-center">
        <div className="relative mx-auto w-24 h-24 mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-200">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Fiches personnelles</h2>
        <p className="text-sm text-slate-500 mb-2 leading-relaxed">
          Les fiches perso sont disponibles à partir de l'abonnement <strong className="text-blue-700">Pro</strong>.
        </p>
        <p className="text-xs text-slate-400 mb-7">
          Importez vos cours et laissez l'IA générer des fiches de révision colorées et structurées en quelques secondes.
        </p>
        <div className="bg-slate-50 rounded-2xl p-5 text-left mb-6 space-y-3 border border-slate-200">
          {[
            { icon: '', text: 'Import de PDF, images et texte' },
            { icon: '', text: 'Génération automatique de fiches par IA' },
            { icon: '', text: 'Fiches colorées, épurées et bien structurées' },
            { icon: '', text: 'Stockage de vos fichiers personnels' },
            { icon: '', text: "Jusqu'à 5 fiches générées par jour (Pro) ou 10 (Premium)" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm text-sm">{item.icon}</div>
              <span className="text-xs text-slate-700 font-medium">{item.text}</span>
            </div>
          ))}
        </div>
        <a href="/dashboard/subscription"
          className="block w-full py-3 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-blue-100 mb-3"
          style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
          Passer à Pro — Voir les offres
        </a>
        <p className="text-xs text-slate-400">Sans engagement · Résiliable à tout moment</p>
      </div>
    </div>
  );
}

function FichesPersoTab({ isPro }) {
  const [files, setFiles]               = useState([]);
  const [filesLoading, setFilesLoading] = useState(true);
  const [uploading, setUploading]       = useState(false);
  const [dragOver, setDragOver]         = useState(false);
  const fileInputRef = useRef(null);

  const [sheets, setSheets]               = useState([]);
  const [sheetsLoading, setSheetsLoading] = useState(true);
  const [status, setStatus]               = useState(null);
  const [generating, setGenerating]       = useState(false);
  const [sourceMode, setSourceMode]       = useState('text');
  const [courseText, setCourseText]       = useState('');
  const [aiFile, setAiFile]               = useState(null);
  const [title, setTitle]                 = useState('');
  const [category, setCategory]           = useState('');
  const [error, setError]                 = useState('');
  const [success, setSuccess]             = useState('');
  const aiFileRef = useRef(null);

  useEffect(() => {
    if (!isPro) { setFilesLoading(false); setSheetsLoading(false); return; }
    const cachedFiles  = getCache('user_files');
    const cachedSheets = getCache('user_sheets');
    if (cachedFiles)  { setFiles(cachedFiles);   setFilesLoading(false); }
    if (cachedSheets) { setSheets(cachedSheets); setSheetsLoading(false); }
    axios.get(`${API_URL}/files`).then(r => { setFiles(r.data);  setCache('user_files', r.data);  }).finally(() => setFilesLoading(false));
    axios.get(`${API_URL}/sheets`).then(r => { setSheets(r.data); setCache('user_sheets', r.data); }).finally(() => setSheetsLoading(false));
    axios.get(`${API_URL}/sheets/gen-status`).then(r => setStatus(r.data)).catch(() => {});
  }, [isPro]);

  if (!isPro) return <FichesPersoUpgradeWall/>;

  const handleUpload = async (file) => {
    if (!file) return;
    const allowed = ['application/pdf','image/jpeg','image/png','image/jpg','image/webp'];
    if (!allowed.includes(file.type)) { alert('Seuls les PDF et images sont acceptés.'); return; }
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file); fd.append('name', file.name);
    try {
      const { data } = await axios.post(`${API_URL}/files/upload`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setFiles(prev => [data, ...prev]);
    } catch (err) { alert(err.response?.data?.message || "Erreur lors de l'envoi"); }
    setUploading(false);
  };

  const handleDeleteFile  = async (id) => {
    try { await axios.delete(`${API_URL}/files/${id}`); setFiles(prev => prev.filter(f => f._id !== id)); } catch {}
  };
  const handleDeleteSheet = async (id) => {
    try { await axios.delete(`${API_URL}/sheets/${id}`); setSheets(prev => prev.filter(s => s._id !== id)); } catch {}
  };

  const canGenerate = () => sourceMode === 'text' ? courseText.length >= 30 : !!aiFile;

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setGenerating(true);
    try {
      const fd = new FormData();
      fd.append('sourceType', sourceMode); fd.append('title', title); fd.append('category', category);
      if (sourceMode === 'text') fd.append('courseText', courseText);
      else if (aiFile) fd.append('file', aiFile);
      const { data } = await axios.post(`${API_URL}/sheets/generate`, fd);
      const full = await axios.get(`${API_URL}/sheets/${data.sheet._id}`);
      setSheets(prev => [full.data, ...prev]);
      setStatus(s => s ? { ...s, used: s.used + 1, remaining: s.remaining - 1 } : null);
      setSuccess(`Fiche "${data.sheet.title}" générée !`);
      setCourseText(''); setTitle(''); setCategory(''); setAiFile(null);
    } catch (err) { setError(err.response?.data?.message || 'Erreur lors de la génération.'); }
    setGenerating(false);
  };

  const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition placeholder:text-slate-400';

  return (
    <div className="max-w-3xl space-y-8">
      {/* Section 1: My files */}
      <section>
        <h2 className="text-sm font-bold text-slate-800 mb-1">Mes fichiers</h2>
        <p className="text-xs text-slate-400 mb-4">Déposez vos fiches PDF ou photos de cours pour les retrouver facilement.</p>
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleUpload(f); }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all mb-4 ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'}`}>
          <input ref={fileInputRef} type="file" className="hidden" accept={PERSO_FILE_ACCEPT}
            onChange={e => { if (e.target.files[0]) handleUpload(e.target.files[0]); e.target.value = ''; }}/>
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-7 h-7 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
              <p className="text-sm text-blue-500 font-medium">Envoi en cours...</p>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-700 mb-0.5">Glissez ou cliquez pour déposer</p>
              <p className="text-xs text-slate-400">PDF et images (JPG, PNG, WebP) · Max 8 Mo</p>
            </>
          )}
        </div>
        {filesLoading ? (
          <div className="flex justify-center py-4"><div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/></div>
        ) : files.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">Aucun fichier déposé pour l'instant.</p>
        ) : (
          <div className="space-y-2">
            {files.map(file => {
              const typeLabel  = PERSO_FILE_MIME[file.mimetype] || 'Fichier';
              const colorClass = PERSO_FILE_COLORS[typeLabel] || 'bg-blue-100 text-blue-600';
              return (
                <div key={file._id} className="bg-white rounded-2xl border border-slate-200 p-3.5 flex items-center gap-3 hover:border-slate-300 transition shadow-sm">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${colorClass}`}>{typeLabel.slice(0,3)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                    <p className="text-xs text-slate-400">{formatSize(file.size)} · {new Date(file.createdAt).toLocaleDateString('fr-FR',{day:'2-digit',month:'short'})}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <a href={`${API_URL}/files/${file._id}/download`} target="_blank" rel="noopener noreferrer"
                      className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition" title="Ouvrir">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                    </a>
                    <button onClick={() => handleDeleteFile(file._id)} className="p-2 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition" title="Supprimer">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="border-t border-slate-200"/>

      {/* Section 2: AI generation */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-sm font-bold text-slate-800">Fiches générées par IA</h2>
          <span className="text-xs font-bold bg-blue-500 text-white px-2 py-0.5 rounded-full">Pro</span>
        </div>
        <p className="text-xs text-slate-400 mb-4">Importez votre cours (texte, image ou PDF) — l'IA génère une fiche colorée et structurée.</p>

        {status && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 flex items-center gap-4 shadow-sm">
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">Fiches générées aujourd'hui</span>
                <span className={`font-bold ${status.remaining === 0 ? 'text-red-500' : 'text-blue-600'}`}>{status.used}/{status.limit}</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-1.5 rounded-full transition-all ${status.remaining === 0 ? 'bg-red-400' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min((status.used / status.limit) * 100, 100)}%`}}/>
              </div>
            </div>
            <p className="text-xs text-slate-400 flex-shrink-0">{status.remaining} restante{status.remaining !== 1 ? 's' : ''}</p>
          </div>
        )}

        <form onSubmit={handleGenerate} className="bg-white rounded-2xl border border-slate-200 p-5 mb-5 space-y-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Titre</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Hémostase" className={inputCls}/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">UE / Matière</label>
              <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Ex: UE 2.4" className={inputCls}/>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Source du contenu *</label>
            <div className="flex gap-2 mb-3">
              {SOURCE_MODES.map(m => (
                <button key={m.id} type="button" onClick={() => { setSourceMode(m.id); setAiFile(null); }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${sourceMode === m.id ? 'text-white border-transparent' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}
                  style={sourceMode === m.id ? { background: 'linear-gradient(135deg,#2563eb,#0891b2)' } : {}}>
                  {m.icon(sourceMode === m.id ? 'white' : '#64748b')}
                  {m.label}
                </button>
              ))}
            </div>

            {sourceMode === 'text' && (
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-slate-400">Collez ou saisissez votre cours</span>
                  <span className={`text-xs font-medium ${courseText.length < 30 ? 'text-red-400' : 'text-emerald-600'}`}>{courseText.length} car.</span>
                </div>
                <textarea value={courseText} onChange={e => setCourseText(e.target.value)} rows={6}
                  placeholder={"Collez votre cours ici (notes, polycopié, manuel...)"}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-white transition resize-none placeholder:text-slate-400"/>
              </div>
            )}

            {(sourceMode === 'image' || sourceMode === 'pdf') && (
              <div>
                <input ref={aiFileRef} type="file"
                  accept={sourceMode === 'pdf' ? '.pdf' : '.jpg,.jpeg,.png,.webp'}
                  className="hidden"
                  onChange={e => { if (e.target.files[0]) setAiFile(e.target.files[0]); e.target.value=''; }}/>
                {aiFile ? (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: sourceMode === 'pdf' ? '#fee2e2' : '#dcfce7' }}>
                      {sourceMode === 'pdf'
                        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{aiFile.name}</p>
                      <p className="text-xs text-slate-400">{formatSize(aiFile.size)}</p>
                    </div>
                    <button type="button" onClick={() => setAiFile(null)} className="text-xs text-red-400 hover:text-red-600 transition px-2 py-1 rounded-lg hover:bg-red-50">Retirer</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => aiFileRef.current?.click()}
                    className="w-full flex items-center gap-3 p-4 border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/30 transition">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: sourceMode === 'pdf' ? '#fee2e2' : '#dcfce7' }}>
                      {sourceMode === 'pdf'
                        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      }
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {sourceMode === 'pdf' ? 'Choisir un PDF' : 'Choisir une image (photo de cours)'}
                      </p>
                      <p className="text-xs text-slate-400">{sourceMode === 'pdf' ? 'Fichier .pdf · max 10 Mo' : 'JPG, PNG, WebP · max 10 Mo'}</p>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>

          {error   && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-xs text-red-600">{error}</div>}
          {success && <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 text-xs text-emerald-700 font-medium">{success}</div>}

          <motion.button type="submit" disabled={!canGenerate() || generating || status?.remaining === 0}
            whileHover={{ opacity: 0.92 }} whileTap={{ scale: 0.98 }}
            className="w-full py-3 text-white rounded-xl text-sm font-bold transition disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
            {generating
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Génération en cours...</>
              : 'Générer la fiche'
            }
          </motion.button>
        </form>

        {sheetsLoading ? (
          <div className="flex justify-center py-6"><div className="w-7 h-7 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/></div>
        ) : sheets.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">Aucune fiche générée pour l'instant.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sheets.map(sheet => (
              sheet.content
                ? <RevisionSheetCard key={sheet._id} sheet={sheet} onDelete={handleDeleteSheet}/>
                : <div key={sheet._id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                    <p className="text-sm font-semibold text-slate-800">{sheet.title}</p>
                    <button onClick={() => handleDeleteSheet(sheet._id)} className="text-xs text-red-400 mt-2 hover:text-red-600 transition">Supprimer</button>
                  </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────────── */
export default function Cours() {
  const { user } = useAuth();
  const [tab, setTab] = useState('cours');
  const isPro = ['pro', 'premium'].includes(user?.subscription);

  const tabs = [
    { id: 'cours',  label: 'Cours',          icon: '' },
    { id: 'fiches', label: 'Fiches',          icon: '' },
    { id: 'perso',  label: isPro ? 'Fiches perso' : 'Fiches perso', icon: '' },
  ];

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto">

        {/* ── Hero ── */}
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0c4a6e 100%)' }} className="px-6 pt-8 pb-0">
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-white mb-1">Cours & Fiches</h1>
            <p className="text-blue-200/70 text-sm">Consultez les cours, révisez avec les fiches, créez vos fiches personnelles.</p>
          </div>

          {/* Tab bar */}
          <div className="flex gap-0">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
                  tab === t.id
                    ? 'border-white text-white'
                    : 'border-transparent text-blue-300/70 hover:text-blue-200'
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="p-6 bg-slate-50 min-h-full">
          <AnimatePresence mode="wait">
            <motion.div key={tab}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}>
              {tab === 'cours'  && <CoursTab/>}
              {tab === 'fiches' && <FichesTab/>}
              {tab === 'perso'  && <FichesPersoTab isPro={isPro}/>}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
