import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import PublicRoute from './components/PublicRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Quiz from './pages/Quiz';
import QuizPlay from './pages/QuizPlay';
import Flashcards from './pages/Flashcards';
import Exercises from './pages/Exercises';
import Subscription from './pages/Subscription';
import Profile from './pages/Profile';
import Groups from './pages/Groups';
import GroupDetail from './pages/GroupDetail';
import Cours from './pages/Cours';
import Annales from './pages/Annales';
import Support from './pages/Support';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminQuizzes from './pages/admin/AdminQuizzes';
import AdminFlashcards from './pages/admin/AdminFlashcards';
import AdminExercises from './pages/admin/AdminExercises';
import AdminGroups from './pages/admin/AdminGroups';
import AdminLessons from './pages/admin/AdminLessons';
import Medicaments from './pages/Medicaments';
import MedicamentDetail from './pages/MedicamentDetail';
import AdminMedicaments from './pages/admin/AdminMedicaments';
import AdminAnnales from './pages/admin/AdminAnnales';
import AdminTickets from './pages/admin/AdminTickets';
import AdminLogs from './pages/admin/AdminLogs';
import GoogleAuthSuccess from './pages/GoogleAuthSuccess';
import History from './pages/History';

function App() {
  return (
    <AuthProvider>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public — redirige vers dashboard si déjà connecté */}
          <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

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

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
    </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
