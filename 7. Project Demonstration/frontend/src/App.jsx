import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import MyAppointments from './pages/MyAppointments';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';

function ProtectedRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem('bad_user') || 'null');
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const user = JSON.parse(localStorage.getItem('bad_user') || 'null');

  return (
    <BrowserRouter>
      {user && <Navbar />}
      <Routes>
        {/* Public */}
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />

        {/* Smart root redirect */}
        <Route
          path="/"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : user.role === 'admin' ? (
              <Navigate to="/admin" replace />
            ) : user.role === 'doctor' ? (
              <Navigate to="/doctor" replace />
            ) : (
              <ProtectedRoute allowedRoles={['patient']}>
                <HomePage />
              </ProtectedRoute>
            )
          }
        />

        {/* Patient Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:doctorId"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-appointments"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <MyAppointments />
            </ProtectedRoute>
          }
        />

        {/* Doctor Routes */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
