
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import MainContent from './components/MainContent';
import FloatingAIButton from './components/FloatingAIButton';
import AIChatDrawer from './components/AIChatDrawer';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';

export type View = 'home' | 'dashboard' | 'browse-courses' | 'course-detail' | 'exam-player' | 'exam-result';
export type CourseFilter = { type: 'class' | 'subject'; value: string };


const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [view, setView] = useState<View>('home');
  const [currentCourseId, setCurrentCourseId] = useState<string | null>(null);
  const [currentAttemptId, setCurrentAttemptId] = useState<string | null>(null);
  const [courseFilter, setCourseFilter] = useState<CourseFilter | null>(null);

  const handleSetView = (newView: View) => {
    // Reset filters when navigating home or to dashboard
    if (newView === 'home' || newView === 'dashboard') {
      setCourseFilter(null);
      setCurrentCourseId(null);
    }
    setView(newView);
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }
  
  const MainComponent = useMemo(() => {
    // Student Role Guard
    if (user?.role === 'student') {
       return <StudentDashboard setView={handleSetView} setCurrentAttemptId={setCurrentAttemptId} />;
    }
    
    // Teacher & Admin Role Guard with view switching
    if (user?.role === 'teacher' || user?.role === 'admin') {
      switch (view) {
        case 'dashboard':
          return <TeacherDashboard />;
        case 'home':
        default:
          return <MainContent />;
      }
    }
    
    // Fallback for any unknown role or edge case
    return <MainContent />;
  }, [view, user]);


  return (
    <div className="min-h-screen font-sans">
      <Header setView={handleSetView} />
      <main className="pt-20">
        {MainComponent}
      </main>
      <FloatingAIButton onClick={() => setIsChatOpen(true)} />
      <AIChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
