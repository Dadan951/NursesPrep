import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import { API_URL } from '../../context/AuthContext';
import NursesLogo from '../../components/NursesLogo';

/* ─── Shared primitives ─────────────────────────────────────────────────── */
function TiltCard({ children, className = '' }) {
  const x = useMotionValue(0), y = useMotionValue(0);
  const rotX = useSpring(useTransform(y, [-0.5,0.5],[5,-5]), {stiffness:300,damping:22});
  const rotY = useSpring(useTransform(x, [-0.5,0.5],[-5,5]), {stiffness:300,damping:22});
  const onMove = e => { const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX-r.left)/r.width-0.5); y.set((e.clientY-r.top)/r.height-0.5); };
  return (
    <div style={{perspective:900}}>
      <motion.div style={{rotateX:rotX,rotateY:rotY,transformStyle:'preserve-3d'}} onMouseMove={onMove} onMouseLeave={()=>{x.set(0);y.set(0);}} whileHover={{scale:1.02}} className={`rounded-2xl ${className}`}>{children}</motion.div>
    </div>
  );
}
function StatCard({ label, value, icon, gradient, delay }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const t = Number(value)||0; if (!t) return;
    let s=0; const id=setInterval(()=>{ s++; setCount(Math.round(t*s/40)); if(s>=40){setCount(t);clearInterval(id);} },18);
    return ()=>clearInterval(id);
  }, [value]);
  return (
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay,duration:0.5}}>
      <TiltCard><div className="relative rounded-2xl p-5 overflow-hidden text-white" style={{background:gradient}}>
        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10 blur-xl"/>
        <div className="text-2xl mb-1">{icon}</div>
        <div className="text-3xl font-bold">{count}</div>
        <div className="text-sm text-white/80 mt-0.5">{label}</div>
      </div></TiltCard>
    </motion.div>
  );
}

/* ─── Badges ────────────────────────────────────────────────────────────── */
const diffColors = { easy:'bg-emerald-100 text-emerald-700', medium:'bg-amber-100 text-amber-700', hard:'bg-red-100 text-red-700' };
const diffLabel  = { easy:'Facile', medium:'Moyen', hard:'Difficile' };

/* ─── Quiz Modal ─────────────────────────────────────────────────────────── */
const EMPTY_QUIZ = {
  title:'', description:'', semester:'', category:'', chapter:'', difficulty:'medium', duration:10, isPublished:true,
  questions:[{ text:'', explanation:'', options:[{text:'',isCorrect:true},{text:'',isCorrect:false},{text:'',isCorrect:false},{text:'',isCorrect:false}] }]
};

function QuizModal({ quiz, onClose, onSave, existingSemesters = [], existingCategories = [], existingChapters = [] }) {
  const [form,    setForm]    = useState(quiz ? JSON.parse(JSON.stringify(quiz)) : EMPTY_QUIZ);
  const [loading, setLoading] = useState(false);
  const [tab,     setTab]     = useState(0);

  const setQ = (qi,field,value) => { const qs=[...form.questions]; qs[qi]={...qs[qi],[field]:value}; setForm({...form,questions:qs}); };
  const setOpt = (qi,oi,field,value) => {
    const qs=[...form.questions]; const opts=[...qs[qi].options];
    if(field==='isCorrect'&&value) opts.forEach((_,i)=>{ opts[i]={...opts[i],isCorrect:i===oi}; });
    else opts[oi]={...opts[oi],[field]:value};
    qs[qi]={...qs[qi],options:opts}; setForm({...form,questions:qs});
  };
  const addQ = () => { setForm({...form,questions:[...form.questions,{text:'',explanation:'',options:[{text:'',isCorrect:true},{text:'',isCorrect:false},{text:'',isCorrect:false},{text:'',isCorrect:false}]}]}); setTab(form.questions.length); };
  const removeQ = qi => { const qs=form.questions.filter((_,i)=>i!==qi); setForm({...form,questions:qs}); setTab(Math.max(0,tab-1)); };
  const handleSave = async () => { setLoading(true); try{await onSave(form);onClose();}catch(e){alert(e.response?.data?.message||'Erreur');}finally{setLoading(false);} };

  const inputCls = "w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white";
  const labelCls = "block text-xs font-semibold text-slate-600 mb-1.5";

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}>
      <motion.div initial={{scale:0.92,y:16,opacity:0}} animate={{scale:1,y:0,opacity:1}} exit={{scale:0.92,opacity:0}} transition={{duration:0.25}}
        onClick={e=>e.stopPropagation()} className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between"
          style={{background:'linear-gradient(135deg,#0f172a,#1e3a5f)'}}>
          <div>
            <h3 className="text-base font-bold text-white">{quiz ? 'Modifier le quiz' : 'Nouveau quiz'}</h3>
            <p className="text-xs text-blue-200/60 mt-0.5">{form.questions.length} question{form.questions.length>1?'s':''}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-5">
          {/* General info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className={labelCls}>Titre *</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className={inputCls} placeholder="Titre du quiz"/></div>
            <div>
              <label className={labelCls}>Semestre</label>
              <input list="sem-list" value={form.semester||''} onChange={e=>setForm({...form,semester:e.target.value})} className={inputCls} placeholder="Ex: Semestre 1"/>
              <datalist id="sem-list">{existingSemesters.map(s=><option key={s} value={s}/>)}</datalist>
            </div>
            <div>
              <label className={labelCls}>Catégorie (UE) *</label>
              <input list="cat-list" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className={inputCls} placeholder="Ex: UE 2.2"/>
              <datalist id="cat-list">{existingCategories.map(c=><option key={c} value={c}/>)}</datalist>
            </div>
            <div>
              <label className={labelCls}>Chapitre</label>
              <input list="chap-list" value={form.chapter} onChange={e=>setForm({...form,chapter:e.target.value})} className={inputCls} placeholder="Ex: Système cardio-vasculaire"/>
              <datalist id="chap-list">{existingChapters.map(c=><option key={c} value={c}/>)}</datalist>
            </div>
            <div><label className={labelCls}>Difficulté</label>
              <select value={form.difficulty} onChange={e=>setForm({...form,difficulty:e.target.value})} className={inputCls}>
                <option value="easy">Facile</option><option value="medium">Moyen</option><option value="hard">Difficile</option>
              </select>
            </div>
            <div><label className={labelCls}>Durée (min)</label><input type="number" value={form.duration} onChange={e=>setForm({...form,duration:+e.target.value})} className={inputCls} min={1}/></div>
            <div className="col-span-2"><label className={labelCls}>Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={2} className={`${inputCls} resize-none`} placeholder="Description courte..."/></div>
            <div className="col-span-2 flex items-center gap-2.5">
              <button type="button" onClick={()=>setForm({...form,isPublished:!form.isPublished})}
                className="relative rounded-full flex-shrink-0 transition-colors" style={{width:40,height:22,backgroundColor:form.isPublished?'#2563eb':'#cbd5e1'}}>
                <span className="absolute rounded-full bg-white shadow transition-all" style={{width:18,height:18,top:2,left:form.isPublished?20:2}}/>
              </button>
              <span className="text-xs font-semibold text-slate-600">{form.isPublished ? 'Publié' : 'Brouillon'}</span>
            </div>
          </div>

          {/* Questions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Questions ({form.questions.length})</h4>
              <button onClick={addQ} className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:text-blue-800 transition">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Ajouter
              </button>
            </div>
            <div className="flex gap-1.5 mb-4 flex-wrap">
              {form.questions.map((_,i)=>(
                <button key={i} onClick={()=>setTab(i)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${tab===i?'bg-blue-600 text-white shadow-sm':'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  Q{i+1}
                </button>
              ))}
            </div>
            {form.questions[tab] && (
              <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                <div><label className={labelCls}>Question *</label><textarea value={form.questions[tab].text} onChange={e=>setQ(tab,'text',e.target.value)} rows={2} className={`${inputCls} resize-none`} placeholder="Texte de la question..."/></div>
                <div className="space-y-2">
                  <label className={labelCls}>Options (sélectionner la bonne réponse)</label>
                  {form.questions[tab].options.map((opt,oi)=>(
                    <div key={oi} className="flex items-center gap-2">
                      <input type="radio" checked={opt.isCorrect} onChange={()=>setOpt(tab,oi,'isCorrect',true)} className="accent-emerald-500 flex-shrink-0"/>
                      <input value={opt.text} onChange={e=>setOpt(tab,oi,'text',e.target.value)}
                        className={`flex-1 px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-blue-400 transition ${opt.isCorrect?'border-emerald-300 bg-emerald-50':'border-slate-200 bg-white'}`}
                        placeholder={`Option ${String.fromCharCode(65+oi)}`}/>
                    </div>
                  ))}
                </div>
                <div><label className={labelCls}>Explication (optionnelle)</label><textarea value={form.questions[tab].explanation} onChange={e=>setQ(tab,'explanation',e.target.value)} rows={2} className={`${inputCls} resize-none text-xs`} placeholder="Explication de la bonne réponse..."/></div>
                {form.questions.length>1&&<button onClick={()=>removeQ(tab)} className="text-xs text-red-400 hover:text-red-600 transition">Supprimer cette question</button>}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition">Annuler</button>
          <motion.button onClick={handleSave} disabled={loading} whileHover={{scale:1.02}} whileTap={{scale:0.98}}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-70 flex items-center justify-center gap-2"
            style={{background:'linear-gradient(135deg,#2563eb,#0891b2)'}}>
            {loading&&<span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>}
            {loading?'Enregistrement...':'✓ Enregistrer'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Delete modal ───────────────────────────────────────────────────────── */
function DelModal({ item, label, onClose, onConfirm }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}>
      <motion.div initial={{scale:0.9,y:12}} animate={{scale:1,y:0}} exit={{scale:0.9}} transition={{duration:0.22}}
        onClick={e=>e.stopPropagation()} className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm text-center">
        <div className="text-4xl mb-3"></div>
        <h3 className="font-bold text-slate-800 mb-1">Supprimer ce quiz ?</h3>
        <p className="text-sm text-slate-500 mb-5"><span className="font-semibold">"{label}"</span> sera définitivement supprimé.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition">Annuler</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition">Supprimer</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════ */
export default function AdminQuizzes() {
  const [quizzes,  setQuizzes]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [search,   setSearch]   = useState('');
  const [filterSem,  setFilterSem]  = useState('');
  const [filterDiff, setFilterDiff] = useState('');
  const [filterUE,   setFilterUE]   = useState('');
  const [filterChap, setFilterChap] = useState('');

  const load = () => {
    setLoading(true);
    axios.get(`${API_URL}/quizzes/admin`).then(r => setQuizzes(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleSave   = async data => { if (data._id) await axios.put(`${API_URL}/quizzes/${data._id}`, data); else await axios.post(`${API_URL}/quizzes`, data); load(); };
  const handleDelete = async id   => { await axios.delete(`${API_URL}/quizzes/${id}`); setDeleting(null); load(); };

  const semesters = [...new Set(quizzes.map(q => q.semester).filter(Boolean))].sort();
  const ues       = [...new Set(quizzes.map(q => q.category).filter(Boolean))].sort();
  const chapters  = [...new Set(
    quizzes.filter(q => !filterUE || q.category === filterUE).map(q => q.chapter).filter(Boolean)
  )].sort();

  const filtered = quizzes.filter(q => {
    const matchSearch = q.title.toLowerCase().includes(search.toLowerCase()) || (q.category||'').toLowerCase().includes(search.toLowerCase()) || (q.chapter||'').toLowerCase().includes(search.toLowerCase());
    const matchSem  = !filterSem  || q.semester  === filterSem;
    const matchDiff = !filterDiff || q.difficulty === filterDiff;
    const matchUE   = !filterUE   || q.category  === filterUE;
    const matchChap = !filterChap || q.chapter    === filterChap;
    return matchSearch && matchSem && matchDiff && matchUE && matchChap;
  });

  const published = quizzes.filter(q => q.isPublished).length;
  const totalQ    = quizzes.reduce((acc, q) => acc + (q.questions?.length || 0), 0);

  return (
    <DashboardLayout isAdmin>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');`}</style>

      {/* Conteneur principal — overflow-y-auto pour permettre le scroll */}
      <div className="flex-1 min-h-0 overflow-y-auto" style={{background:'linear-gradient(135deg,#0f172a 0%,#1e3a5f 40%,#0c4a6e 100%)'}}>

        {/* Header */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <NursesLogo size="sm" light/>
              <div className="h-6 w-px bg-white/20"/>
              <div>
                <h1 className="text-white font-bold text-lg">Quiz</h1>
                <p className="text-blue-200/60 text-xs">Gestion des questionnaires</p>
              </div>
            </div>
            <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={() => setModal('new')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-lg"
              style={{background:'linear-gradient(135deg,#2563eb,#0891b2)'}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Nouveau quiz
            </motion.button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Total quiz"      value={quizzes.length} icon="" gradient="linear-gradient(135deg,#2563eb,#1d4ed8)" delay={0}   />
            <StatCard label="Publiés"         value={published}      icon="" gradient="linear-gradient(135deg,#059669,#047857)" delay={0.1} />
            <StatCard label="Total questions" value={totalQ}         icon="" gradient="linear-gradient(135deg,#0891b2,#0e7490)" delay={0.2} />
          </div>
        </div>

        {/* Tableau */}
        <div className="px-6 pb-8">
          <div className="bg-white rounded-3xl shadow-2xl">

            {/* Barre filtres */}
            <div className="p-5 border-b border-slate-100 flex flex-wrap gap-3 items-center">
              {/* Recherche */}
              <div className="relative flex-1 min-w-[180px]">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un quiz..."
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"/>
              </div>

              {/* Filtre semestre */}
              <select value={filterSem} onChange={e => setFilterSem(e.target.value)}
                className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white">
                <option value="">Tous les semestres</option>
                {semesters.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              {/* Filtre difficulté */}
              <select value={filterDiff} onChange={e => setFilterDiff(e.target.value)}
                className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white">
                <option value="">Toutes les difficultés</option>
                <option value="easy">Facile</option>
                <option value="medium">Moyen</option>
                <option value="hard">Difficile</option>
              </select>

              {/* Filtre UE */}
              <select value={filterUE} onChange={e => { setFilterUE(e.target.value); setFilterChap(''); }}
                className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white max-w-[220px]">
                <option value="">Toutes les UE</option>
                {ues.map(u => <option key={u} value={u}>{u}</option>)}
              </select>

              {/* Filtre chapitre (cascade sur UE) */}
              <select value={filterChap} onChange={e => setFilterChap(e.target.value)}
                className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white max-w-[220px]">
                <option value="">Tous les chapitres</option>
                {chapters.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              {/* Compteur résultats */}
              <span className="text-xs text-slate-400 font-medium ml-auto">
                {filtered.length} / {quizzes.length} quiz
              </span>
            </div>

            {loading ? (
              <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <div className="text-5xl mb-3"></div>
                <p className="font-semibold">Aucun quiz trouvé</p>
                {(search || filterSem || filterDiff) && (
                  <button onClick={() => { setSearch(''); setFilterSem(''); setFilterDiff(''); setFilterUE(''); setFilterChap(''); }}
                    className="mt-3 text-xs text-blue-500 hover:text-blue-700 underline">
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      {['Titre', 'Semestre', 'Catégorie (UE)', 'Chapitre', 'Difficulté', 'Questions', 'Durée', 'Statut', ''].map(h => (
                        <th key={h} className="px-4 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((q, i) => (
                      <motion.tr key={q._id} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay: Math.min(i, 20) * 0.02}}
                        className="border-b border-slate-100 hover:bg-blue-50/30 transition-all group">
                        <td className="px-4 py-3.5 text-sm font-semibold text-slate-800">
                          <span className="block max-w-[200px] truncate" title={q.title}>{q.title}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          {q.semester
                            ? <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-medium whitespace-nowrap">{q.semester}</span>
                            : <span className="text-xs text-slate-300">—</span>
                          }
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium block max-w-[180px] truncate" title={q.category}>{q.category}</span>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-slate-500">
                          <span className="block max-w-[160px] truncate" title={q.chapter}>{q.chapter || '—'}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${diffColors[q.difficulty]}`}>{diffLabel[q.difficulty]}</span>
                        </td>
                        <td className="px-4 py-3.5 text-xs font-semibold text-slate-700 text-center">{q.questions?.length || 0}</td>
                        <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{q.duration} min</td>
                        <td className="px-4 py-3.5">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${q.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                            {q.isPublished ? 'Publié' : 'Brouillon'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setModal(q)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition" title="Modifier">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </button>
                            <button onClick={() => setDeleting(q)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition" title="Supprimer">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>{modal && <QuizModal
        quiz={modal === 'new' ? null : modal}
        onClose={() => setModal(null)}
        onSave={handleSave}
        existingSemesters={semesters}
        existingCategories={[...new Set(quizzes.map(q => q.category).filter(Boolean))].sort()}
        existingChapters={[...new Set(quizzes.map(q => q.chapter).filter(Boolean))].sort()}
      />}</AnimatePresence>
      <AnimatePresence>{deleting && <DelModal item={deleting} label={deleting.title} onClose={() => setDeleting(null)} onConfirm={() => handleDelete(deleting._id)}/>}</AnimatePresence>
    </DashboardLayout>
  );
}
