import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Landing } from './pages/Landing';
import { Join } from './pages/Join';
import { Matches } from './pages/Matches';
import { Auth } from './pages/Auth';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Find Your Buddy...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/matches" /> : <Landing />} />
          <Route path="/auth" element={user ? <Navigate to="/matches" /> : <Auth />} />
          <Route path="/join" element={user ? <Navigate to="/matches" /> : <Join />} />
          <Route
            path="/matches"
            element={
              <ProtectedRoute>
                <Matches />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;