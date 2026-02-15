import { useEffect, useState } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import ChatPage from '@/pages/ChatPage';
import BrowsePsychologists from '@/pages/BrowsePsychologists';
import BookingPage from '@/pages/BookingPage';
import PsychologistDashboard from '@/pages/PsychologistDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import SuccessStories from '@/pages/SuccessStories';
import ToolkitPage from '@/pages/ToolkitPage';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import MedicalDisclaimer from '@/pages/MedicalDisclaimer';
import AuthCallback from '@/components/AuthCallback';
import ProtectedRoute from '@/components/ProtectedRoute';

function AppRouter() {
  const location = useLocation();
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/disclaimer" element={<MedicalDisclaimer />} />
      <Route path="/stories" element={<SuccessStories />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      <Route path="/psychologists" element={<ProtectedRoute><BrowsePsychologists /></ProtectedRoute>} />
      <Route path="/book/:psychologistId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
      <Route path="/toolkit" element={<ProtectedRoute><ToolkitPage /></ProtectedRoute>} />
      <Route path="/psychologist-dashboard" element={<ProtectedRoute><PsychologistDashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;