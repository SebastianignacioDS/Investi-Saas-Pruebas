import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { MiniGames } from './components/MiniGames';
import { Learnings } from './components/Learnings';
import { Competitions } from './components/Competitions';
import { GoalsAndAchievements } from './components/GoalsAndAchievements';
import { Settings } from './components/Settings';
import { Profile } from './components/Profile';
import { Sidebar } from './components/Sidebar';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { InvestmentSimulator } from './components/InvestmentSimulator';
import { AntHunt } from './components/AntHunt';
import { BudgetOrganizer } from './components/BudgetOrganizer';
import { SupabaseTest } from './components/SupabaseTest';
import { auth } from '../utils/supabase';

export interface CompetencyResult {
  id: number;
  name: string;
  score: number;
  level: number;
  levelName: string;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [competencyResults, setCompetencyResults] = useState<CompetencyResult[]>([]);
  const [grade, setGrade] = useState('2do Medio');
  const [course, setCourse] = useState('A');
  const [name, setName] = useState('Sebastian');
  const [loading, setLoading] = useState(true);

  // Verificar si hay una sesión activa al cargar la app
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Verificar si venimos de un OAuth callback
        const urlParams = new URLSearchParams(window.location.search);
        const fromOAuth = urlParams.get('code') || window.location.hash.includes('access_token');

        if (fromOAuth) {
          // Manejar el callback de OAuth
          console.log('OAuth callback detectado, procesando...');
          const profile = await auth.handleOAuthCallback();
          if (profile) {
            setName(profile.name || 'Usuario');
            setGrade(profile.grade || null);
            setCourse(profile.course || null);
            setSelectedLevel(profile.selectedLevel || null);
            setIsLoggedIn(true);
            // Limpiar URL
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } else {
          // Verificar sesión normal
          const isAuth = auth.isAuthenticated();
          if (isAuth) {
            const profile = auth.getCurrentProfile();
            if (profile) {
              setName(profile.name || 'Usuario');
              setGrade(profile.grade || null);
              setCourse(profile.course || null);
              setSelectedLevel(profile.selectedLevel || null);
              setIsLoggedIn(true);
            }
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleLogin = (profile: any) => {
    setName(profile.name || 'Usuario');
    setGrade(profile.grade || '2do Medio');
    setCourse(profile.course || 'A');
    setSelectedLevel(profile.selectedLevel || null);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    auth.logout();
    setIsLoggedIn(false);
    setActiveView('dashboard');
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard selectedLevel={selectedLevel} setSelectedLevel={setSelectedLevel} setCompetencyResults={setCompetencyResults} />;
      case 'minigames':
        return <MiniGames selectedLevel={selectedLevel} setSelectedLevel={setSelectedLevel} />;
      case 'learnings':
        return <Learnings selectedLevel={selectedLevel} setSelectedLevel={setSelectedLevel} />;
      case 'competitions':
        return <Competitions selectedLevel={selectedLevel} setSelectedLevel={setSelectedLevel} />;
      case 'goals':
        return <GoalsAndAchievements selectedLevel={selectedLevel} />;
      case 'settings':
        return <Settings grade={grade} setGrade={setGrade} course={course} setCourse={setCourse} name={name} setName={setName} setActiveView={setActiveView} />;
      case 'profile':
        return <Profile selectedLevel={selectedLevel} setSelectedLevel={setSelectedLevel} competencyResults={competencyResults} setActiveView={setActiveView} grade={grade} course={course} name={name} />;
      case 'investment-simulator':
        return <InvestmentSimulator selectedLevel={selectedLevel} />;
      case 'ant-hunt':
        return <AntHunt selectedLevel={selectedLevel} />;
      case 'budget-organizer':
        return <BudgetOrganizer selectedLevel={selectedLevel} />;
      case 'supabase-test':
        return <SupabaseTest />;
      default:
        return <Dashboard selectedLevel={selectedLevel} setSelectedLevel={setSelectedLevel} setCompetencyResults={setCompetencyResults} />;
    }
  };

  // Show login screen if not logged in
  if (!isLoggedIn) {
    if (showRegister) {
      return (
        <Register 
          onRegister={handleLogin}
          onBackToLogin={() => setShowRegister(false)}
        />
      );
    }
    return <Login onLogin={handleLogin} onShowRegister={() => setShowRegister(true)} />;
  }

  // Show loading while checking session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#be9525] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView}
        onLogout={handleLogout}
        selectedLevel={selectedLevel}
        grade={grade}
        course={course}
        name={name}
      />
      <main className="flex-1 p-8 overflow-auto">
        {renderView()}
      </main>
    </div>
  );
}