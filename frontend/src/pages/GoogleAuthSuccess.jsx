import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';
import { clearCache } from '../utils/cache';

// Réforme UE 2026 — garde cette constante synchronisée avec CURRENT_ACADEMIC_YEAR dans backend/controllers/authController.js
const CURRENT_ACADEMIC_YEAR = '2026-2027';
const STUDY_YEAR_OPTIONS = [
  { value: '1ere', label: `${CURRENT_ACADEMIC_YEAR} — 1ère année` },
  { value: '2eme', label: `${CURRENT_ACADEMIC_YEAR} — 2ème année` },
  { value: '3eme', label: `${CURRENT_ACADEMIC_YEAR} — 3ème année` },
];

export default function GoogleAuthSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState('loading'); // 'loading' | 'choose'
  const [studyYear, setStudyYear] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = params.get('token');
    if (!token) return navigate('/login?error=google');
    localStorage.setItem('token', token);
    if (params.get('isNew') === '1') {
      localStorage.setItem('np-display-mode', 'detail');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setStep('choose');
    } else {
      window.location.href = '/dashboard';
    }
  }, []); // eslint-disable-line

  const confirmStudyYear = async () => {
    if (!studyYear) return setError("Choisis ton année d'études");
    setSaving(true);
    try {
      await axios.put(`${API_URL}/auth/profile`, { studyYear });
      ['quizzes_list', 'flashcards_list', 'lessons_cours', 'lessons_fiches', 'exercises_list', 'annales_list']
        .forEach(clearCache);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur');
      setSaving(false);
    }
  };

  if (step === 'choose') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        <div className="w-full max-w-sm bg-white rounded-3xl p-6 flex flex-col gap-4">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Bienvenue !</h1>
            <p className="text-sm text-slate-500 mt-1">Encore une étape : indique ton année d'études pour qu'on t'affiche le bon contenu.</p>
          </div>
          <div className="flex flex-col gap-2">
            {STUDY_YEAR_OPTIONS.map(opt => {
              const active = studyYear === opt.value;
              return (
                <button key={opt.value} type="button" onClick={() => { setStudyYear(opt.value); setError(''); }}
                  className={`py-3 px-4 rounded-2xl border text-sm font-semibold text-left transition-all duration-200 ${
                    active ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-500'
                  }`}>
                  {opt.label}
                </button>
              );
            })}
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button type="button" onClick={confirmStudyYear} disabled={saving || !studyYear}
            className="w-full py-3 rounded-2xl text-sm font-bold text-white bg-blue-600 disabled:opacity-50">
            {saving ? 'Enregistrement…' : 'Continuer'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="flex flex-col items-center gap-4 text-white">
        <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin"/>
        <p className="text-sm text-white/60">Connexion en cours…</p>
      </div>
    </div>
  );
}
