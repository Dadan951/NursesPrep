import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth, API_URL } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

/* ─── Sections spéciales (non numérotées comme "Partie N") ──────────────── */
const SPECIAL = new Set(['Médias', 'Source', 'Général']);

/* ─── TOC item ───────────────────────────────────────────────────────────── */
function TocItem({ label, sublabel, badge, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all group ${
        active
          ? 'bg-blue-600 text-white font-semibold shadow-sm'
          : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
      }`}
    >
      <span className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold mt-0.5
        ${active ? 'bg-white/25 text-white' : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'}`}>
        {badge}
      </span>
      <span className="leading-relaxed min-w-0">
        <span className="block font-semibold">{label}</span>
        {sublabel && <span className={`block text-[10px] truncate mt-0.5 ${active ? 'text-blue-100' : 'text-slate-400'}`}>{sublabel}</span>}
      </span>
    </button>
  );
}

/* ─── Section content block ──────────────────────────────────────────────── */
function PartieBlock({ partieNum, title, content, id, color }) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mb-12 scroll-mt-6"
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <div
          className="flex-shrink-0 w-12 h-12 rounded-2xl flex flex-col items-center justify-center shadow-md"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
        >
          <span className="text-[9px] text-white/80 font-semibold uppercase tracking-wider leading-none">Partie</span>
          <span className="text-xl font-black text-white leading-none">{partieNum}</span>
        </div>
        <div className="pt-1">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Partie {partieNum}</p>
          <h2 className="text-lg font-bold text-slate-800 leading-tight">{title}</h2>
        </div>
      </div>

      {/* Content with left border */}
      <div className="ml-16 pl-5 border-l-2 rounded-sm" style={{ borderColor: color + '40' }}>
        <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
          {content || <span className="italic text-slate-400">Contenu non renseigné</span>}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Attachment card ────────────────────────────────────────────────────── */
function AttachmentCard({ attachment }) {
  const icons = {
    image: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    pdf:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    video: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
    other: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  };
  const bgColors = { image: '#e0f7fa', pdf: '#fef2f2', video: '#f3e8ff', other: '#f1f5f9' };
  return (
    <a href={attachment.url} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: bgColors[attachment.type] || bgColors.other }}>
        {icons[attachment.type] || icons.other}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-700 group-hover:text-blue-700 truncate transition-colors">{attachment.name || 'Fichier'}</p>
        <p className="text-xs text-slate-400 uppercase">{attachment.type}</p>
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0 group-hover:stroke-blue-500 transition-colors">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   MEDICAMENT DETAIL PAGE
══════════════════════════════════════════════════════════════════════════════ */
export default function MedicamentDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { token } = useAuth();
  const [drug,    setDrug]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection,  setActiveSection]  = useState(0);
  const [mobileTocOpen,  setMobileTocOpen]  = useState(false);
  const sectionRefs = useRef([]);

  useEffect(() => {
    if (!token) return;
    axios.get(`${API_URL}/drugs/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setDrug(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, token]);

  /* Scroll spy */
  useEffect(() => {
    if (!drug) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const idx = sectionRefs.current.indexOf(e.target);
            if (idx !== -1) setActiveSection(idx);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    sectionRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, [drug]);

  const scrollTo = (sectionIndex) => {
    sectionRefs.current[sectionIndex]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileTocOpen(false);
  };

  if (loading) return (
    <DashboardLayout>
      <div className="flex justify-center items-center py-32">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    </DashboardLayout>
  );

  if (!drug) return (
    <DashboardLayout>
      <div className="text-center py-32 text-slate-500">
        <div className="text-5xl mb-4">💊</div>
        <p className="font-semibold">Médicament introuvable</p>
        <button onClick={() => navigate('/dashboard/medicaments')} className="mt-4 text-blue-500 text-sm hover:underline">
          ← Retour aux médicaments
        </button>
      </div>
    </DashboardLayout>
  );

  const classColor     = drug.drugClass?.color || '#0891b2';
  const sections       = drug.sections || [];

  /* ── Séparation des sections ── */
  const contentSections = sections.filter(s => !SPECIAL.has(s.title));
  const mediasSection   = sections.find(s => s.title === 'Médias');
  // Section "Général" = ancien format → on la traite comme un bloc unique si pas de contentSections
  const generalSection  = sections.find(s => s.title === 'Général');
  const displaySections = contentSections.length > 0 ? contentSections : (generalSection ? [generalSection] : []);

  const hasMindMap      = !!drug.mindMap?.url;
  const hasAttachments  = drug.attachments?.length > 0;
  const hasSources      = drug.sources?.length > 0;
  const hasMedias       = !!mediasSection;

  /* Palette de couleurs pour chaque partie */
  const PARTIE_COLORS = ['#2563eb', '#0891b2', '#7c3aed', '#059669', '#dc2626'];

  /* ── Construction du TOC ── */
  const tocItems = [
    { label: 'Introduction', sublabel: null,      badge: '·',   refIdx: 0 },
    ...displaySections.map((s, i) => ({
      label:    `Partie ${i + 1}`,
      sublabel: s.title,
      badge:    i + 1,
      refIdx:   i + 1,
    })),
    ...(hasMedias      ? [{ label: 'Médias',        sublabel: null, badge: '▶', refIdx: displaySections.length + 1 }] : []),
    ...(hasMindMap     ? [{ label: 'Carte mentale', sublabel: null, badge: '▶', refIdx: displaySections.length + (hasMedias ? 2 : 1) }] : []),
    ...(hasAttachments ? [{ label: 'Ressources',    sublabel: null, badge: '▶', refIdx: displaySections.length + (hasMedias ? 2 : 1) + (hasMindMap ? 1 : 0) }] : []),
    ...(hasSources     ? [{ label: 'Sources',       sublabel: null, badge: '§',  refIdx: displaySections.length + (hasMedias ? 2 : 1) + (hasMindMap ? 1 : 0) + (hasAttachments ? 1 : 0) }] : []),
  ];

  const TOC = (
    <div className="space-y-0.5">
      {tocItems.map((t, i) => (
        <TocItem key={i} {...t} active={activeSection === i} onClick={() => scrollTo(t.refIdx)} />
      ))}
    </div>
  );

  let refCounter = 0;
  const nextRef = () => refCounter++;

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto bg-slate-50/60">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">

        {/* ── Top bar ────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/dashboard/medicaments')}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            Médicaments
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg"
            style={{ backgroundColor: classColor + '20', color: classColor }}>
            {drug.drugClass?.icon} {drug.drugClass?.name}
          </span>
        </motion.div>

        {/* ── Hero ───────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden mb-8 p-8"
          style={{ background: `linear-gradient(135deg, #0f172a, ${classColor}60)` }}>
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none"
            style={{ backgroundColor: classColor + '30' }}/>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white mb-1">{drug.name}</h1>
            {drug.genericName && <p className="text-blue-200/70 italic text-sm mb-4">{drug.genericName}</p>}
            {drug.description && <p className="text-blue-100/80 text-sm leading-relaxed max-w-2xl">{drug.description}</p>}
            {drug.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {drug.tags.map(tag => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-blue-100 border border-white/10">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Mobile TOC ─────────────────────────────────────────────── */}
        <div className="lg:hidden mb-4">
          <button onClick={() => setMobileTocOpen(v => !v)}
            className="flex items-center gap-2 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-4 py-2.5 rounded-xl w-full">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="15" y2="18"/>
            </svg>
            Sommaire ({tocItems.length} sections)
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              className={`ml-auto transition-transform ${mobileTocOpen ? 'rotate-180' : ''}`}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <AnimatePresence>
            {mobileTocOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden bg-white border border-slate-200 rounded-2xl mt-2 p-3">
                {TOC}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Main layout ─────────────────────────────────────────────── */}
        <div className="flex gap-8">

          {/* ── Sidebar TOC ─────────────────────────────────────────── */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-6 bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">
                Sommaire
              </p>
              {TOC}
            </div>
          </aside>

          {/* ── Content ─────────────────────────────────────────────── */}
          <main className="flex-1 min-w-0">

            {/* Introduction */}
            <div
              ref={el => { sectionRefs.current[0] = el; }}
              className="scroll-mt-6 mb-12"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${classColor}30, ${classColor}15)`, border: `1.5px solid ${classColor}40` }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={classColor} strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-slate-800">Introduction</h2>
              </div>
              <div className="ml-14 pl-5 border-l-2 rounded-sm" style={{ borderColor: classColor + '40' }}>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {drug.description || <span className="italic text-slate-400">Aucune introduction disponible.</span>}
                </p>
              </div>
            </div>

            {/* Parties numérotées */}
            {displaySections.map((s, i) => (
              <div key={s._id || i} ref={el => { sectionRefs.current[i + 1] = el; }}>
                <PartieBlock
                  partieNum={i + 1}
                  title={s.title}
                  content={s.content}
                  id={`section-${i}`}
                  color={PARTIE_COLORS[i] || PARTIE_COLORS[0]}
                />
              </div>
            ))}

            {/* Médias (section texte) */}
            {hasMedias && (
              <div ref={el => { sectionRefs.current[displaySections.length + 1] = el; }}
                className="scroll-mt-6 mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Médias</h2>
                </div>
                <div className="ml-14 pl-5 border-l-2 border-purple-100 rounded-sm">
                  <p className="text-sm text-slate-600 leading-relaxed">{mediasSection.content}</p>
                </div>
              </div>
            )}

            {/* Carte mentale */}
            {hasMindMap && (
              <div ref={el => { sectionRefs.current[displaySections.length + (hasMedias ? 2 : 1)] = el; }}
                className="scroll-mt-6 mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M2 12h3M19 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/>
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Carte mentale</h2>
                </div>
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                  <img src={drug.mindMap.url} alt={drug.mindMap.caption || 'Carte mentale'} className="w-full"/>
                  {drug.mindMap.caption && (
                    <p className="text-xs text-slate-500 text-center py-2 bg-slate-50 border-t border-slate-100">{drug.mindMap.caption}</p>
                  )}
                </div>
              </div>
            )}

            {/* Ressources */}
            {hasAttachments && (
              <div ref={el => {
                const o = displaySections.length + (hasMedias ? 2 : 1) + (hasMindMap ? 1 : 0);
                sectionRefs.current[o] = el;
              }} className="scroll-mt-6 mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Ressources</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {drug.attachments.map((a, i) => <AttachmentCard key={i} attachment={a}/>)}
                </div>
              </div>
            )}

            {/* Sources */}
            {hasSources && (
              <div ref={el => {
                const o = displaySections.length + (hasMedias ? 2 : 1) + (hasMindMap ? 1 : 0) + (hasAttachments ? 1 : 0);
                sectionRefs.current[o] = el;
              }} className="scroll-mt-6 mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Sources</h2>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl divide-y divide-slate-200 overflow-hidden">
                  {drug.sources.map((src, i) => (
                    <div key={i} className="px-5 py-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800">
                            {src.url ? (
                              <a href={src.url} target="_blank" rel="noopener noreferrer"
                                className="hover:text-blue-600 hover:underline transition-colors">
                                {src.title || src.url}
                              </a>
                            ) : src.title || `Source ${i + 1}`}
                          </p>
                          {src.authors && <p className="text-xs text-slate-500 mt-0.5">{src.authors}</p>}
                        </div>
                        {src.year && (
                          <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-lg flex-shrink-0">
                            {src.year}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}
