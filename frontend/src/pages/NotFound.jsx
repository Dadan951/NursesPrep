import { Link } from 'react-router-dom';
import NursesLogo from '../components/NursesLogo';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-6 text-center">
      <div className="mb-8">
        <NursesLogo size="lg" />
      </div>

      {/* Grand 404 en dégradé */}
      <h1
        className="font-extrabold tracking-tight leading-none"
        style={{
          fontSize: 'clamp(88px, 22vw, 160px)',
          backgroundImage: 'linear-gradient(135deg,#164e8a,#1d6fba,#0891b2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        404
      </h1>

      <h2 className="mt-2 text-xl sm:text-2xl font-bold text-slate-800">
        Cette page n'existe pas
      </h2>
      <p className="mt-3 max-w-md text-sm sm:text-base text-slate-500 leading-relaxed">
        Le lien est peut-être cassé ou la page a été déplacée. Pas de panique,
        on te ramène en terrain connu.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 active:scale-[0.98] transition"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12l9-9 9 9" /><path d="M9 21V12h6v9" />
          </svg>
          Retour à l'accueil
        </Link>
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-slate-700 text-sm font-semibold border border-slate-200 shadow-sm hover:border-blue-300 hover:text-blue-600 active:scale-[0.98] transition"
        >
          Mon tableau de bord
        </Link>
      </div>
    </div>
  );
}
