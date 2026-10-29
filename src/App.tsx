import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LearningProvider, useLearning } from './context/LearningContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { AuthModal } from './components/auth/AuthModal';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CareerSetupPage } from './pages/CareerSetupPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { DailyLessonPage } from './pages/DailyLessonPage';
import { QuizPage } from './pages/QuizPage';
import { WeeklyAssessmentPage } from './pages/WeeklyAssessmentPage';
import { ProgressPage } from './pages/ProgressPage';
import { SavedRoadmapsPage } from './pages/SavedRoadmapsPage';
import { SettingsPage } from './pages/SettingsPage';

function AppLayout({ onOpenAuth }: { onOpenAuth: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // On the landing page (/), render the standalone landing layout
  if (location.pathname === '/') {
    return <LandingPage onOpenAuth={onOpenAuth} />;
  }

  return (
    <div className="min-h-screen bg-paper dark:bg-dark-bg text-ink dark:text-dark-ink flex flex-col antialiased selection:bg-vermilion/15 selection:text-ink transition-colors duration-200">
      {/* Narrow editorial sidebar */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <Header
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenAuth={onOpenAuth}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/setup" element={<CareerSetupPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/lesson" element={<LessonRedirect />} />
            <Route path="/lesson/:id" element={<DailyLessonPage />} />
            <Route path="/quiz" element={<QuizRedirect />} />
            <Route path="/quiz/:id" element={<QuizPage />} />
            <Route path="/assessment" element={<WeeklyAssessmentPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/roadmaps" element={<SavedRoadmapsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function LessonRedirect() {
  const { activeDayNumber } = useLearning();
  return <Navigate to={`/lesson/${activeDayNumber}`} replace />;
}

function QuizRedirect() {
  const { activeDayNumber } = useLearning();
  return <Navigate to={`/quiz/${activeDayNumber}`} replace />;
}

export default function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        <LearningProvider>
          <BrowserRouter>
            <AppLayout onOpenAuth={() => setAuthModalOpen(true)} />
            <AuthModal
              isOpen={authModalOpen}
              onClose={() => setAuthModalOpen(false)}
            />
          </BrowserRouter>
        </LearningProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
