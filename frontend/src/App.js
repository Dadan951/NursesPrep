import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import PublicRoute from './components/PublicRoute';

// Chargement à la demande : chaque page devient un "chunk" séparé,
// téléchargé uniquement quand l'utilisateur visite la route correspondante.
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Quiz = lazy(() => import('./pages/Quiz'));
const QuizPlay = lazy(() => import('./pages/QuizPlay'));
const Flashcards = lazy(() => import('./pages/Flashcards'));
const Exercises = lazy(() => import('./pages/Exercises'));
const Subscription = lazy(() => import('./pages/Subscription'));
const Profile = lazy(() => import('./pages/Profile'));
const Groups = lazy(() => import('./pages/Groups'));
const GroupDetail = lazy(() => import('./pages/GroupDetail'));
const Cours = lazy(() => import('./pages/Cours'));
const Annales = lazy(() => import('./pages/Annales'));
const Support = lazy(() => import('./pages/Support'));

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminQuizzes = lazy(() => import('./pages/admin/AdminQuizzes'));
const AdminFlashcards = lazy(() => import('./pages/admin/AdminFlashcards'));
const AdminExercises = lazy(() => import('./pages/admin/AdminExercises'));
const AdminGroups = lazy(() => import('./pages/admin/AdminGroups'));
const AdminLessons = lazy(() => import('./pages/admin/AdminLessons'));
const Medicaments = lazy(() => import('./pages/Medicaments'));
const MedicamentDetail = lazy(() => import('./pages/MedicamentDetail'));
const AdminMedicaments = lazy(() => import('./pages/admin/AdminMedicaments'));
const AdminAnnales = lazy(() => import('./pages/admin/AdminAnnales'));
const AdminTickets = lazy(() => import('./pages/admin/AdminTickets'));
const AdminLogs = lazy(() => import('./pages/admin/AdminLogs'));
const GoogleAuthSuccess = lazy(() => import('./pages/GoogleAuthSuccess'));
const History = lazy(() => import('./pages/History'));
const CGU = lazy(() => import('./pages/CGU'));
const Confidentialite = lazy(() => import('./pages/Confidentialite'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Affiché brièvement le temps que le chunk d'une page se télécharge
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
    <ThemeProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public — redirige vers dashboard si déjà connecté */}
          <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/cgu" element={<CGU />} />
          <Route path="/confidentialite" element={<Confidentialite />} />

          {/* Student */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
          <Route path="/dashboard/quiz/:id" element={<ProtectedRoute><QuizPlay /></ProtectedRoute>} />
          <Route path="/dashboard/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/dashboard/flashcards" element={<ProtectedRoute><Flashcards /></ProtectedRoute>} />
          <Route path="/dashboard/exercises" element={<ProtectedRoute><Exercises /></ProtectedRoute>} />
          <Route path="/dashboard/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
          <Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/dashboard/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
          <Route path="/dashboard/groups/:id" element={<ProtectedRoute><GroupDetail /></ProtectedRoute>} />
          <Route path="/dashboard/cours" element={<ProtectedRoute><Cours /></ProtectedRoute>} />
          <Route path="/dashboard/medicaments" element={<ProtectedRoute><Medicaments /></ProtectedRoute>} />
          <Route path="/dashboard/medicaments/:id" element={<ProtectedRoute><MedicamentDetail /></ProtectedRoute>} />
          <Route path="/dashboard/annales" element={<ProtectedRoute><Annales /></ProtectedRoute>} />
          <Route path="/dashboard/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/quizzes" element={<AdminRoute><AdminQuizzes /></AdminRoute>} />
          <Route path="/admin/flashcards" element={<AdminRoute><AdminFlashcards /></AdminRoute>} />
          <Route path="/admin/exercises" element={<AdminRoute><AdminExercises /></AdminRoute>} />
          <Route path="/admin/groups" element={<AdminRoute><AdminGroups /></AdminRoute>} />
          <Route path="/admin/lessons" element={<AdminRoute><AdminLessons /></AdminRoute>} />
          <Route path="/admin/medicaments" element={<AdminRoute><AdminMedicaments /></AdminRoute>} />
          <Route path="/admin/annales" element={<AdminRoute><AdminAnnales /></AdminRoute>} />
          <Route path="/admin/tickets" element={<AdminRoute><AdminTickets /></AdminRoute>} />
          <Route path="/admin/logs" element={<AdminRoute><AdminLogs /></AdminRoute>} />

          {/* Google OAuth callback */}
          <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />

          {/* 404 — page inconnue */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
      <Analytics />
    </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
