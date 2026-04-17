import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/* ─── Table of contents item ─────────────────────────────────────────────── */
function TocItem({ num, title, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-start gap-2.5 px-3 py-2 rounded-xl text-xs transition-all group ${
        active
          ? 'bg-blue-600 text-white font-semibold shadow-sm'
          : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
      }`}
    >
      <span className={`flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold mt-0.5
        ${active ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'}`}>
        {num}
      </span>
      <span className="leading-relaxed">{title}</span>
    </button>
  );
}

/* ─── Section block ──────────────────────────────────────────────────────── */
function SectionBlock({ num, title, content, id }) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mb-10 scroll-mt-24"
    >
      {/* Section number + title */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md"
          style={{ background: 'linear-gradient(135deg, #2563eb, #0891b2)' }}>
          {num}
        </div>
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      </div>

      {/* Colored left border + content */}
      <div className="ml-14 pl-4 border-l-2 border-blue-100">
        <div
          className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: 'inherit' }}
        >
          {content || <span className="italic text-slate-400">Contenu non renseigné</span>}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Attachment card ────────────────────────────────────────────────────── */
function AttachmentCard({ attachment }) {
  const icons = {
    image: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    ),
    pdf: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
    ),
    video: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round">
        <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
      </svg>
    ),
    other: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
    ),
  };
  const bgColors = { image: '#e0f7fa', pdf: '#fef2f2', video: '#f3e8ff', other: '#f1f5f9' };

  return (
    <a
      href={attachment.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group"
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: bgColors[attachment.type] || bgColors.other }}>
        {icons[attachment.type] || icons.other}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-700 group-hover:text-blue-700 truncate transition-colors">
          {attachment.name || 'Fichier'}
        </p>
        <p className="text-xs text-slate-400 uppercase">{attachment.type}</p>
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"
        className="flex-shrink-0 group-hover:stroke-blue-500 transition-colors">
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
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { token }  = useAuth();
  const [drug,    setDrug]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const sectionRefs = useRef([]);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/api/drugs/${id}`, { headers });
        setDrug(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  /* Track active section via scroll */
  useEffect(() => {
    if (!drug) return;
    const allSections = ['intro', ...drug.sections.map((_, i) => `section-${i}`)];
    if (drug.mindMap?.url)      allSections.push('mindmap');
    if (drug.attachments?.length) allSections.push('attachments');
    if (drug.sources?.length)   allSections.push('sources');

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const idx = allSections.indexOf(e.target.id);
            if (idx !== -1) setActiveSection(idx);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    sectionRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, [drug]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileTocOpen(false);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-32">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!drug) {
    return (
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
  }

  const sections = drug.sections || [];
  const hasMindMap     = !!drug.mindMap?.url;
  const hasAttachments = drug.attachments?.length > 0;
  const hasSources     = drug.sources?.length > 0;

  /* Build TOC entries */
  const tocEntries = [
    { id: 'intro', label: 'Introduction', num: '·' },
    ...sections.map((s, i) => ({ id: `section-${i}`, label: s.title, num: i + 1 })),
    ...(hasMindMap     ? [{ id: 'mindmap',     label: 'Carte mentale', num: '🧠' }] : []),
    ...(hasAttachments ? [{ id: 'attachments', label: 'Ressources',    num: '📎' }] : []),
    ...(hasSources     ? [{ id: 'sources',     label: 'Sources',       num: '📚' }] : []),
  ];

  const classColor = drug.drugClass?.color || '#0891b2';

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">

        {/* ── Top bar ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <button
            onClick={() => navigate('/dashboard/medicaments')}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            Médicaments
          </button>
          <span className="text-slate-300">/</span>
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-lg"
            style={{ backgroundColor: classColor + '20', color: classColor }}
          >
            {drug.drugClass?.icon} {drug.drugClass?.name}
          </span>
        </motion.div>

        {/* ── Drug hero ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden mb-8 p-8"
          style={{ background: `linear-gradient(135deg, #0f172a, ${classColor}60)` }}
        >
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none"
            style={{ backgroundColor: classColor + '30' }} />
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white mb-1">{drug.name}</h1>
            {drug.genericName && (
              <p className="text-blue-200/70 italic text-sm mb-4">{drug.genericName}</p>
            )}
            {drug.description && (
              <p className="text-blue-100/80 text-sm leading-relaxed max-w-2xl">{drug.description}</p>
            )}
            {drug.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {drug.tags.map(tag => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-blue-100 border border-white/10">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Mobile TOC toggle ─────────────────────────────────────── */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileTocOpen(v => !v)}
            className="flex items-center gap-2 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-4 py-2.5 rounded-xl w-full"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="15" y2="18"/>
            </svg>
            Sommaire ({tocEntries.length} parties)
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              className={`ml-auto transition-transform ${mobileTocOpen ? 'rotate-180' : ''}`}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <AnimatePresence>
            {mobileTocOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden bg-white border border-slate-200 rounded-2xl mt-2 p-3 space-y-0.5"
              >
                {tocEntries.map((e, i) => (
                  <TocItem key={e.id} num={e.num} title={e.label}
                    active={activeSection === i}
                    onClick={() => scrollTo(e.id)} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Main layout ──────────────────────────────────────────── */}
        <div className="flex gap-8">

          {/* ── TOC sidebar (desktop sticky) ─────────────────────── */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-6 bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
                Sommaire
              </p>
              <div className="space-y-0.5">
                {tocEntries.map((e, i) => (
                  <TocItem key={e.id} num={e.num} title={e.label}
                    active={activeSection === i}
                    onClick={() => scrollTo(e.id)} />
                ))}
              </div>
            </div>
          </aside>

          {/* ── Content ──────────────────────────────────────────── */}
          <main className="flex-1 min-w-0">

            {/* Intro section */}
            <div id="intro" ref={el => sectionRefs.current[0] = el} className="scroll-mt-6 mb-10">
              {drug.description ? (
                <p className="text-slate-600 text-sm leading-relaxed">{drug.description}</p>
              ) : (
                <p className="text-slate-400 text-sm italic">
                  Sélectionne une section dans le sommaire pour naviguer dans le cours.
                </p>
              )}
            </div>

            {/* Numbered sections */}
            {sections.map((s, i) => (
              <div
                key={s._id || i}
                id={`section-${i}`}
                ref={el => sectionRefs.current[i + 1] = el}
              >
                <SectionBlock num={i + 1} title={s.title} content={s.content} id={`section-${i}`} />
              </div>
            ))}

            {/* Mind map */}
            {hasMindMap && (
              <motion.div
                id="mindmap"
                ref={el => sectionRefs.current[sections.length + 1] = el}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-10 scroll-mt-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-xl flex-shrink-0">
                    🧠
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Carte mentale</h2>
                </div>
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                  <img src={drug.mindMap.url} alt={drug.mindMap.caption || 'Carte mentale'} className="w-full" />
                  {drug.mindMap.caption && (
                    <p className="text-xs text-slate-500 text-center py-2 bg-slate-50 border-t border-slate-100">
                      {drug.mindMap.caption}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Attachments */}
            {hasAttachments && (
              <motion.div
                id="attachments"
                ref={el => sectionRefs.current[sections.length + (hasMindMap ? 2 : 1)] = el}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-10 scroll-mt-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-teal-100 flex items-center justify-center text-xl flex-shrink-0">
                    📎
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Ressources</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {drug.attachments.map((a, i) => (
                    <AttachmentCard key={i} attachment={a} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Sources */}
            {hasSources && (
              <motion.div
                id="sources"
                ref={el => {
                  const offset = sections.length + 1 + (hasMindMap ? 1 : 0) + (hasAttachments ? 1 : 0);
                  sectionRefs.current[offset] = el;
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-10 scroll-mt-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-xl flex-shrink-0">
                    📚
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Sources</h2>
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
                            ) : (
                              src.title || `Source ${i + 1}`
                            )}
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
              </motion.div>
            )}

          </main>
        </div>
      </div>
    </DashboardLayout>
  );
}
