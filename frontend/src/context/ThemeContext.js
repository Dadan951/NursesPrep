import { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { API_URL } from './AuthContext';

const ThemeContext = createContext();

export const THEMES = {
  violet: {
    label:'Violet', primary:'#4F46E5', secondary:'#7C3AED',
    bg:'#EEF2FF', border:'#e0e7ff', text:'#1e1b4b', card:'#FFFFFF',
    shadow:'#c7d2fe', primaryRgb:'99,102,241', dark:'#3730a3',
    hero:'linear-gradient(135deg,#1e1b4b,#312e81,#4338ca,#7C3AED)',
    darkMode: { bg:'#0e0b24', card:'#181433', border:'#332c66', text:'#ede9fe', shadow:'#08061a' },
  },
  blue: {
    label:'Bleu', primary:'#2563EB', secondary:'#0891B2',
    bg:'#EFF6FF', border:'#dbeafe', text:'#1e3a5f', card:'#FFFFFF',
    shadow:'#bfdbfe', primaryRgb:'37,99,235', dark:'#1d4ed8',
    hero:'linear-gradient(135deg,#0c1a4b,#1e3a8a,#1d4ed8,#0891B2)',
    darkMode: { bg:'#071426', card:'#0f2038', border:'#1e3a5f', text:'#dbeafe', shadow:'#040c18' },
  },
  green: {
    label:'Vert', primary:'#16A34A', secondary:'#059669',
    bg:'#F0FDF4', border:'#dcfce7', text:'#14532d', card:'#FFFFFF',
    shadow:'#bbf7d0', primaryRgb:'22,163,74', dark:'#166534',
    hero:'linear-gradient(135deg,#052e16,#14532d,#166534,#059669)',
    darkMode: { bg:'#071a10', card:'#0f2a1a', border:'#1e4a30', text:'#dcfce7', shadow:'#040f0a' },
  },
  orange: {
    label:'Orange', primary:'#EA580C', secondary:'#F97316',
    bg:'#FFF7ED', border:'#fed7aa', text:'#431407', card:'#FFFFFF',
    shadow:'#fdba74', primaryRgb:'234,88,12', dark:'#c2410c',
    hero:'linear-gradient(135deg,#431407,#7c2d12,#c2410c,#F97316)',
    darkMode: { bg:'#1f0f04', card:'#301907', border:'#5c2f0e', text:'#ffedd5', shadow:'#120800' },
  },
  red: {
    label:'Rouge', primary:'#DC2626', secondary:'#B91C1C',
    bg:'#FEF2F2', border:'#fecaca', text:'#450a0a', card:'#FFFFFF',
    shadow:'#fca5a5', primaryRgb:'220,38,38', dark:'#991b1b',
    hero:'linear-gradient(135deg,#450a0a,#7f1d1d,#991b1b,#B91C1C)',
    darkMode: { bg:'#1f0808', card:'#2f0e0e', border:'#5c1e1e', text:'#fee2e2', shadow:'#120404' },
  },
  yellow: {
    label:'Jaune', primary:'#D97706', secondary:'#CA8A04',
    bg:'#FFFBEB', border:'#fde68a', text:'#451a03', card:'#FFFFFF',
    shadow:'#fcd34d', primaryRgb:'217,119,6', dark:'#a16207',
    hero:'linear-gradient(135deg,#451a03,#78350f,#a16207,#CA8A04)',
    darkMode: { bg:'#1a1204', card:'#2a1e07', border:'#4d3a0e', text:'#fef3c7', shadow:'#0f0a02' },
  },
};

function applyColorTheme(key, isDark) {
  const t = THEMES[key] || THEMES.violet;
  const d = isDark ? t.darkMode : null;
  const r = document.documentElement;
  r.style.setProperty('--theme-primary',     t.primary);
  r.style.setProperty('--theme-secondary',   t.secondary);
  r.style.setProperty('--theme-bg',          d ? d.bg     : t.bg);
  r.style.setProperty('--theme-card',        d ? d.card   : t.card);
  r.style.setProperty('--theme-border',      d ? d.border : t.border);
  r.style.setProperty('--theme-text',        d ? d.text   : t.text);
  r.style.setProperty('--theme-shadow',      d ? d.shadow : t.shadow);
  r.style.setProperty('--theme-primary-rgb', t.primaryRgb);
  r.style.setProperty('--theme-dark',        t.dark);
  r.style.setProperty('--theme-hero',        t.hero);
}

export function ThemeProvider({ children }) {
  const { user, token } = useAuth();

  const [theme, setTheme] = useState(() => localStorage.getItem('nurseprep-theme') || 'light');
  const [colorTheme, setColorTheme] = useState(() => localStorage.getItem('nurseprep-color') || 'violet');
  const isDark = theme === 'dark' && !!user;

  // readyToSave becomes true only after server prefs have been loaded.
  // This prevents the save effects from firing (and overwriting the server)
  // when user changes from null→object before the GET /preferences completes.
  const readyToSave = useRef(false);

  /* ── Load preferences from server on login ─────────────────────────────── */
  useEffect(() => {
    if (!user || !token) {
      readyToSave.current = false;
      return;
    }
    readyToSave.current = false;
    axios.get(`${API_URL}/auth/preferences`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        const ct       = res.data.colorTheme || 'violet';
        const darkMode = typeof res.data.darkMode === 'boolean' ? res.data.darkMode : false;

        if (THEMES[ct]) {
          setColorTheme(ct);
          localStorage.setItem('nurseprep-color', ct);
        }
        const newTheme = darkMode ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('nurseprep-theme', newTheme);
      })
      .catch(() => {})
      .finally(() => {
        // Delay slightly so React effects triggered by the setState calls above
        // fire first (with readyToSave=false), then we allow future user saves.
        setTimeout(() => { readyToSave.current = true; }, 100);
      });
  }, [user?._id]); // eslint-disable-line

  /* ── Dark mode class + persist ─────────────────────────────────────────── */
  useEffect(() => {
    const root = document.documentElement;
    if (user && theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('nurseprep-theme', theme);

    if (readyToSave.current && token) {
      axios.put(`${API_URL}/auth/preferences`, { darkMode: theme === 'dark' }, {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
  }, [theme, user, token]);

  /* ── Color theme (+ dark variant) + persist ─────────────────────────────── */
  useEffect(() => {
    applyColorTheme(colorTheme, isDark);
    localStorage.setItem('nurseprep-color', colorTheme);

    if (readyToSave.current && token) {
      axios.put(`${API_URL}/auth/preferences`, { colorTheme }, {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
  }, [colorTheme, isDark, token]); // eslint-disable-line

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{
      theme, toggleTheme, isDark,
      colorTheme, setColorTheme, THEMES,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
