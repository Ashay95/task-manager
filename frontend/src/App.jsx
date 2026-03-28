import { Navigate, Route, Routes } from 'react-router-dom';
import ThemeBulb from './components/ThemeBulb';
import { useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import AuthForms from './pages/AuthForms';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function PublicOnly({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function App() {
  return (
    <>
      <ThemeBulb />
    <Routes>
      <Route
        path="/register"
        element={
          <PublicOnly>
            <AuthForms />
          </PublicOnly>
        }
      />
      <Route
        path="/login"
        element={
          <PublicOnly>
            <AuthForms />
          </PublicOnly>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
    </>
  );
}
