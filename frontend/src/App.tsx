import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';

// A temporary placeholder for the protected Dashboard / Inventory area
const DashboardPlaceholder = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface">
    <div className="text-center space-y-4">
      <h1 className="font-headline-xl text-on-surface">Inventory Dashboard</h1>
      <p className="font-body-md text-on-surface-variant">Phase 5 implementation pending...</p>
      <div className="mt-8 pt-8 border-t border-outline-variant/20">
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.reload();
          }}
          className="text-primary hover:underline font-label-mono"
        >
          FORCE LOGOUT
        </button>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPlaceholder />
              </ProtectedRoute>
            }
          />
          
          {/* Catch all unmatched routes and send them to the root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
