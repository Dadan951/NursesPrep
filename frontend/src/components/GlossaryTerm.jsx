import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { GLOSSARY, GLOSSARY_RE } from '../data/medicalGlossary';

/* ─── Term — mot souligné en pointillés, définition au survol/tap ───────── */
export function Term({ word, definition, keyIndex }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const ref = useRef(null);
  const canHover = typeof window !== 'undefined' && window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onScroll = () => setOpen(false);
    document.addEventListener('click', onDocClick);
    document.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !ref.current) return;
    const margin = 10;
    const tipWidth = Math.min(240, window.innerWidth - 2 * margin);
    const r = ref.current.getBoundingClientRect();
    let left = r.left + r.width / 2 - tipWidth / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - margin - tipWidth));
    setPos({ top: r.bottom + 6, left, width: tipWidth });
  }, [open]);

  return (
    <span ref={ref} style={{ position:'relative', display:'inline-block' }}>
      <span
        onMouseEnter={canHover ? () => setOpen(true) : undefined}
        onMouseLeave={canHover ? () => setOpen(false) : undefined}
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
        style={{ borderBottom:'1.5px dotted #94a3b8', cursor:'help', fontWeight:600, color:'inherit' }}>
        {word}
      </span>
      {open && pos && createPortal(
        <AnimatePresence>
          <motion.div key={`tip-${keyIndex}`}
            initial={{ opacity:0, y:4, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:4, scale:0.97 }}
            transition={{ duration:0.15 }}
            style={{ position:'fixed', zIndex:9999, top:pos.top, left:pos.left, width:pos.width, textAlign:'left',
              background:'#0f172a', color:'#f1f5f9', fontSize:11.5, fontWeight:500, lineHeight:1.55,
              padding:'9px 12px', borderRadius:11, boxShadow:'0 10px 28px rgba(0,0,0,0.3)', pointerEvents:'none' }}>
            {definition}
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </span>
  );
}

/* ─── Applique le glossaire sur un fragment de texte brut ───────────────── */
export function glossaryize(str, keyPrefix) {
  if (!str) return [str];
  const out = [];
  let last = 0, m, idx = 0;
  GLOSSARY_RE.lastIndex = 0;
  while ((m = GLOSSARY_RE.exec(str)) !== null) {
    if (m.index > last) out.push(str.slice(last, m.index));
    const def = GLOSSARY[m[0].toLowerCase()];
    out.push(<Term key={`${keyPrefix}-g${idx++}`} word={m[0]} definition={def} keyIndex={`${keyPrefix}-g${idx}`}/>);
    last = m.index + m[0].length;
  }
  if (last < str.length) out.push(str.slice(last));
  return out;
}
