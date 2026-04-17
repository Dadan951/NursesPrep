import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/* ─── Alphabet anchor header ─────────────────────────────────────────────── */
function AlphaBar({ letters, active }) {
  return (
    <div className="flex flex-wrap gap-1 mb-6">
      {letters.map(l => (
        <a key={l} href={`#letter-${l}`}
          className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-all
            ${active === l ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600'}`}>
          {l}
        </a>
      ))}
    </div>
  );
}

/* ─── Drug card ──────────────────────────────────────────────────────────── */
function DrugCard({ drug, onClick }) {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full text-left bg-white border border-slate-200 rounded-2xl px-4 py-3.5 hover:border-blue-300 hover:shadow-md transition-all group"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors truncate">
            {drug.name}
          </p>
          {drug.genericName && (
            <p className="text-xs text-slate-400 mt-0.5 truncate italic">{drug.genericName}</p>
          )}
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0 group-hover:stroke-blue-500 transition-colors">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>
    </motion.button>
  );
}

/* ─── Drug class group ───────────────────────────────────────────────────── */
function ClassGroup({ cls, drugs, searchQuery, delay }) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const filtered = searchQuery
    ? drugs.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.genericName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : drugs;

  if (filtered.length === 0 && searchQuery) return null;

  return (
    <motion.div
      id={`letter-${cls.name[0].toUpperCase()}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="mb-6"
    >
      {/* Class header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 mb-3 group"
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 shadow-sm"
          style={{ backgroundColor: cls.color + '20', border: `1.5px solid ${cls.color}40` }}
        >
          {cls.icon || '💊'}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <h2 className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
            {cls.name}
          </h2>
          {cls.description && (
            <p className="text-xs text-slate-400 truncate">{cls.description}</p>
          )}
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 flex-shrink-0">
          {filtered.length}
        </span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"
          className={`flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* Separator line with class color */}
      <div className="h-px mb-3 rounded-full" style={{ background: `linear-gradient(90deg, ${cls.color}, transparent)` }} />

      {/* Drugs grid */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-2.5 pb-2">
              {filtered.map((drug, i) => (
                <motion.div
                  key={drug._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <DrugCard
                    drug={drug}
                    onClick={() => navigate(`/dashboard/medicaments/${drug._id}`)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   MEDICAMENTS PAGE
══════════════════════════════════════════════════════════════════════════════ */
export default function Medicaments() {
  const { token } = useAuth();
  const [classes, setClasses]   = useState([]);
  const [drugs,   setDrugs]     = useState([]);
  const [search,  setSearch]    = useState('');
  const [loading, setLoading]   = useState(true);
  const searchRef = useRef(null);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, dRes] = await Promise.all([
          axios.get(`${API}/api/drugs/classes`, { headers }),
          axios.get(`${API}/api/drugs`,         { headers }),
        ]);
        setClasses(cRes.data);
        setDrugs(dRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Group drugs by class, sorted alphabetically by class name
  const grouped = classes
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
    .map(cls => ({
      cls,
      drugs: drugs.filter(d => d.drugClass?._id === cls._id),
    }))
    .filter(g => g.drugs.length > 0 || !search);

  // Active letters for the alpha bar
  const activeLetters = [...new Set(
    grouped.map(g => g.cls.name[0].toUpperCase())
  )].sort();

  const totalDrugs   = drugs.length;
  const totalClasses = classes.length;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">

        {/* ── Hero header ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden mb-8 p-8"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0c4a6e 100%)' }}
        >
          {/* Bg orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl">
                💊
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Médicaments</h1>
                <p className="text-blue-200/70 text-sm">
                  {totalClasses} classes · {totalDrugs} médicaments
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="relative max-w-lg">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher un médicament, une classe..."
                className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-sm text-white placeholder-blue-300/60 focus:outline-none focus:border-cyan-400/60 focus:bg-white/15 transition-all backdrop-blur-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* ── Alphabet bar ─────────────────────────────────────── */}
            {!search && activeLetters.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <AlphaBar letters={activeLetters} />
              </motion.div>
            )}

            {/* ── Result count when searching ──────────────────────── */}
            {search && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-slate-500 mb-4"
              >
                {drugs.filter(d =>
                  d.name.toLowerCase().includes(search.toLowerCase()) ||
                  d.genericName?.toLowerCase().includes(search.toLowerCase())
                ).length} résultat(s) pour <span className="font-semibold text-blue-600">"{search}"</span>
              </motion.p>
            )}

            {/* ── Class groups ─────────────────────────────────────── */}
            {grouped.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 text-slate-400"
              >
                <div className="text-5xl mb-3">🔍</div>
                <p className="font-medium">Aucun médicament trouvé</p>
                <p className="text-sm mt-1">Essaie un autre terme de recherche</p>
              </motion.div>
            ) : (
              <div>
                {grouped.map(({ cls, drugs: clsDrugs }, i) => (
                  <ClassGroup
                    key={cls._id}
                    cls={cls}
                    drugs={clsDrugs}
                    searchQuery={search}
                    delay={i * 0.06}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
