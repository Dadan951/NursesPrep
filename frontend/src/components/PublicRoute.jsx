import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Redirige vers le dashboard si déjà connecté
export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (user) {
    // Admin → panel admin, étudiant → dashboard
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
}
