import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function GoogleAuthSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      if (params.get('isNew') === '1') {
        localStorage.setItem('np-display-mode', 'detail');
      }
      window.location.href = '/dashboard';
    } else {
      navigate('/login?error=google');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="flex flex-col items-center gap-4 text-white">
        <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin"/>
        <p className="text-sm text-white/60">Connexion en cours…</p>
      </div>
    </div>
  );
}
