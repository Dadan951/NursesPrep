import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth, API_URL } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { getCache, setCache } from '../utils/cache';

/* ─── Design tokens ─────────────────────────────────────────────────────────── */
const C = {
  bg:     'var(--theme-bg)',
  card:   '#FFFFFF',
  text:   'var(--theme-text)',
  border: 'var(--theme-border)',
  indigo: 'var(--theme-primary)',
  violet: 'var(--theme-secondary)',
  sub:    '#64748b',
};
const clay = {
  card: '0 2px 0 var(--theme-shadow), 0 4px 24px rgba(var(--theme-primary-rgb),0.10), 0 1px 0 rgba(255,255,255,0.9) inset',
  sm:   '0 2px 0 var(--theme-shadow), 0 2px 8px rgba(var(--theme-primary-rgb),0.10)',
  btn:  (hex, dark) => hex
    ? `0 4px 0 ${dark}, 0 8px 24px ${hex}40, 0 1px 0 rgba(255,255,255,0.4) inset`
    : `0 4px 0 var(--theme-dark), 0 8px 24px rgba(var(--theme-primary-rgb),0.25), 0 1px 0 rgba(255,255,255,0.4) inset`,
};

/* ─── AlphaBar ───────────────────────────────────────────────────────────── */
function AlphaBar({ letters }) {
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:20 }}>
      {letters.map(l => (
        <a key={l} href={`#letter-${l}`}
          style={{ width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center',
            borderRadius:8, fontSize:12, fontWeight:700, textDecoration:'none',
            background:C.card, border:`1.5px solid ${C.border}`, color:C.sub,
            boxShadow:clay.sm, transition:'all 0.18s' }}
          onMouseEnter={e => {
            e.currentTarget.style.background = `${C.indigo}14`;
            e.currentTarget.style.color = C.indigo;
            e.currentTarget.style.borderColor = C.indigo;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = C.card;
            e.currentTarget.style.color = C.sub;
            e.currentTarget.style.borderColor = C.border;
          }}>
          {l}
        </a>
      ))}
    </div>
  );
}

/* ─── DrugCard ───────────────────────────────────────────────────────────── */
function DrugCard({ drug, onClick, clsColor }) {
  const [hov, setHov] = useState(false);
  const [tap, setTap] = useState(false);
  const shadow = tap
    ? `0 0 0 ${clsColor}50, 0 1px 0 rgba(255,255,255,0.4) inset`
    : hov
    ? `0 2px 0 ${clsColor}60, 0 8px 24px ${clsColor}20, 0 1px 0 rgba(255,255,255,0.9) inset`
    : clay.card;
  return (
    <motion.button
      onHoverStart={() => setHov(true)} onHoverEnd={() => setHov(false)}
      onTapStart={() => setTap(true)} onTap={() => setTap(false)} onTapCancel={() => setTap(false)}
      whileTap={{ scale:0.97 }}
      onClick={onClick}
      style={{ width:'100%', textAlign:'left', background:C.card, border:`1.5px solid ${hov ? clsColor+'40' : C.border}`,
        borderRadius:16, padding:'12px 14px', cursor:'pointer',
        boxShadow:shadow, transition:'border-color 0.18s, box-shadow 0.18s',
        display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>
      <div style={{ minWidth:0 }}>
        <p style={{ fontSize:13, fontWeight:700, color: hov ? C.indigo : C.text, transition:'color 0.18s',
          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{drug.name}</p>
        {drug.genericName && (
          <p style={{ fontSize:11, color:C.sub, marginTop:2, fontStyle:'italic',
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{drug.genericName}</p>
        )}
      </div>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={hov ? C.indigo : '#94a3b8'} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink:0, transition:'stroke 0.18s' }}>
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </motion.button>
  );
}

/* ─── ClassGroup ─────────────────────────────────────────────────────────── */
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

  const clsColor = cls.color || C.indigo;

  return (
    <motion.div
      id={`letter-${cls.name[0].toUpperCase()}`}
      initial={{ opacity:0, y:20 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay, duration:0.45, ease:[0.16,1,0.3,1] }}
      style={{ marginBottom:20 }}>

      {/* Header */}
      <motion.button whileHover={{ scale:1.005 }} whileTap={{ scale:0.995 }}
        onClick={() => setOpen(o => !o)}
        style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'14px 18px',
          background:C.card, borderRadius:18, border:`1.5px solid ${C.border}`,
          boxShadow:clay.card, cursor:'pointer', textAlign:'left', marginBottom: open ? 10 : 0,
          transition:'margin-bottom 0.25s' }}>
        {/* Icon */}
        <div style={{ width:42, height:42, borderRadius:13, display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:20, flexShrink:0,
          background:`linear-gradient(135deg,${clsColor}25,${clsColor}12)`,
          border:`1.5px solid ${clsColor}35` }}>
          {cls.icon || '💊'}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <h2 style={{ fontSize:14, fontWeight:800, color:C.text,
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{cls.name}</h2>
          {cls.description && (
            <p style={{ fontSize:11, color:C.sub, marginTop:2,
              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{cls.description}</p>
          )}
        </div>
        <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20, flexShrink:0,
          background:`${clsColor}14`, color:clsColor }}>
          {filtered.length}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration:0.22 }}
          style={{ flexShrink:0, color:C.sub }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </motion.div>
      </motion.button>

      {/* Divider */}
      {open && <div style={{ height:2, borderRadius:2, marginBottom:10, background:`linear-gradient(90deg,${clsColor},transparent)` }}/>}

      {/* Drug grid */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, height:0 }}
            animate={{ opacity:1, height:'auto' }}
            exit={{ opacity:0, height:0 }}
            transition={{ duration:0.25 }}
            style={{ overflow:'hidden' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:10, paddingBottom:4 }}>
              {filtered.map((drug, i) => (
                <motion.div key={drug._id}
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay:i*0.035, duration:0.3 }}>
                  <DrugCard
                    drug={drug}
                    clsColor={clsColor}
                    onClick={() => navigate(`/dashboard/medicaments/${drug._id}`)}/>
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
  const [classes, setClasses] = useState([]);
  const [drugs,   setDrugs]   = useState([]);
  const [search,  setSearch]  = useState('');
  const [loading, setLoading] = useState(true);
  const searchRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    const cachedClasses = getCache('drugs_classes');
    const cachedDrugs   = getCache('drugs_list');
    if (cachedClasses && cachedDrugs) {
      setClasses(cachedClasses); setDrugs(cachedDrugs); setLoading(false);
    }
    const load = async () => {
      try {
        const [cRes, dRes] = await Promise.all([
          axios.get(`${API_URL}/drugs/classes`, { headers }),
          axios.get(`${API_URL}/drugs`,         { headers }),
        ]);
        setClasses(cRes.data); setCache('drugs_classes', cRes.data);
        setDrugs(dRes.data);   setCache('drugs_list',    dRes.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [token]);

  const grouped = classes
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
    .map(cls => ({ cls, drugs: drugs.filter(d => d.drugClass?._id === cls._id) }))
    .filter(g => g.drugs.length > 0 || !search);

  const activeLetters = [...new Set(grouped.map(g => g.cls.name[0].toUpperCase()))].sort();
  const matchCount = drugs.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.genericName?.toLowerCase().includes(search.toLowerCase())
  ).length;

  return (
    <DashboardLayout>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
      <div style={{ flex:1, overflowY:'auto', background:C.bg }}>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <div style={{ background:'var(--theme-hero)', position:'relative', overflow:'hidden', minHeight:'200px' }}>
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle,rgba(255,255,255,0.06) 1px,transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }} aria-hidden/>
          <div style={{ position:'absolute', top:-40, right:-32, width:220, height:220, borderRadius:'50%', background:'radial-gradient(circle,rgba(255,255,255,0.12),transparent)', filter:'blur(40px)', pointerEvents:'none' }} aria-hidden/>
          <div style={{ position:'absolute', bottom:-20, left:80, width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle,rgba(255,255,255,0.08),transparent)', filter:'blur(32px)', pointerEvents:'none' }} aria-hidden/>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 80% 20%,rgba(255,255,255,0.15),transparent 55%)', pointerEvents:'none' }} aria-hidden/>

          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}
            style={{ position:'relative', padding:'28px 24px 24px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:10 }}>
              <div style={{ width:44, height:44, borderRadius:16, background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.3)', flexShrink:0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
              </div>
              <div>
                <h1 className="nunito" style={{ fontSize:24, fontWeight:900, color:'#fff', lineHeight:1.1 }}>Médicaments</h1>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.7)', marginTop:2 }}>Classes et molécules pour les examens IFSI</p>
              </div>
            </div>

            <div style={{ display:'flex', gap:20, marginBottom:18 }}>
              {[
                { n:classes.length, l:'Classes', c:'#c4b5fd' },
                { n:drugs.length,   l:'Médicaments', c:'#fff' },
              ].map(s => (
                <motion.div key={s.l} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay:0.1 }}>
                  <p className="nunito" style={{ fontSize:22, fontWeight:900, color:s.c, lineHeight:1 }}>{s.n}</p>
                  <p style={{ fontSize:11, color:'rgba(255,255,255,0.5)', marginTop:2 }}>{s.l}</p>
                </motion.div>
              ))}
            </div>

            {/* Search */}
            <div style={{ position:'relative', maxWidth:520 }}>
              <svg style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'rgba(196,181,253,0.8)', pointerEvents:'none' }}
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher un médicament, une classe…"
                style={{ width:'100%', paddingLeft:44, paddingRight: search ? 40 : 16, paddingTop:12, paddingBottom:12,
                  borderRadius:16, border:'1.5px solid rgba(255,255,255,0.2)', outline:'none',
                  background:'rgba(255,255,255,0.12)', backdropFilter:'blur(8px)',
                  color:'#fff', fontSize:13, boxSizing:'border-box' }}
              />
              {search && (
                <button onClick={() => setSearch('')}
                  style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                    background:'transparent', border:'none', cursor:'pointer', color:'rgba(196,181,253,0.8)', padding:4 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── CONTENT ──────────────────────────────────────────────────────── */}
        <div style={{ padding:'24px 16px' }}>

          {loading ? (
            <div style={{ display:'flex', justifyContent:'center', padding:'80px 0' }}>
              <div style={{ width:32, height:32, border:`4px solid ${C.indigo}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/>
            </div>
          ) : (
            <>
              {/* AlphaBar */}
              {!search && activeLetters.length > 0 && (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}>
                  <AlphaBar letters={activeLetters}/>
                </motion.div>
              )}

              {/* Count quand recherche active */}
              {search && (
                <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }}
                  style={{ fontSize:12, color:C.sub, marginBottom:14 }}>
                  {matchCount} résultat{matchCount > 1 ? 's' : ''} pour{' '}
                  <span style={{ fontWeight:700, color:C.indigo }}>"{search}"</span>
                </motion.p>
              )}

              {/* Groups */}
              {grouped.length === 0 ? (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                  style={{ textAlign:'center', padding:'80px 24px' }}>
                  <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
                  <p style={{ fontWeight:700, color:C.text, fontSize:15 }}>Aucun médicament trouvé</p>
                  <p style={{ fontSize:13, color:C.sub, marginTop:4 }}>Essaie un autre terme de recherche</p>
                </motion.div>
              ) : (
                <div>
                  {grouped.map(({ cls, drugs: clsDrugs }, i) => (
                    <ClassGroup
                      key={cls._id}
                      cls={cls}
                      drugs={clsDrugs}
                      searchQuery={search}
                      delay={i * 0.05}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
