
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import Home from './pages/Home';
import Test from './pages/Test';
import Settings from './pages/Settings';
import Modes from './pages/Modes';
import Statistics from './pages/Statistics';
import Auth from './pages/Auth';
import MobileGate from './components/MobileGate';
import { AppSettings } from './types';


const Navigation: React.FC<{ user: User | null }> = ({ user }) => {

  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="flex flex-col space-y-4 py-6 mb-8 border-b border-[var(--border)]">
      <div className="flex items-center justify-between">
        <Link to="/" className="group">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 border border-[var(--accent)] flex items-center justify-center bg-[var(--accent)]/5 group-hover:bg-[var(--accent)] group-hover:text-white transition-all">
              <span className="text-[14px] font-bold font-dos">T</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold uppercase tracking-tighter leading-none font-dos">Type Spec</span>
              <span className="text-[9px] text-[var(--muted)] uppercase tracking-widest leading-none mt-0.5">Typing_Ref_V1.1</span>
            </div>
          </div>
        </Link>
        <div className="text-[10px] text-[var(--muted)] uppercase tracking-tighter hidden md:block tabular-nums">
          Status: <span className={user ? 'text-emerald-500' : 'text-orange-500'}>{user ? 'AUTHENTICATED' : 'GUEST_PROTO'}</span> // {user ? user.uid.slice(0, 8).toUpperCase() : `NODE_${Math.random().toString(16).slice(2, 6).toUpperCase()}`}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex space-x-6 text-[10px] font-bold tracking-[0.2em] uppercase">
          <Link to="/" className={`transition-colors py-1 border-b-2 ${isActive('/') ? 'border-[var(--accent)] text-[var(--fg)]' : 'border-transparent text-[var(--muted)] hover:text-[var(--fg)]'}`}>01_Home</Link>
          <Link to="/test" className={`transition-colors py-1 border-b-2 ${isActive('/test') ? 'border-[var(--accent)] text-[var(--fg)]' : 'border-transparent text-[var(--muted)] hover:text-[var(--fg)]'}`}>02_Diagnostic</Link>
          <Link to="/modes" className={`transition-colors py-1 border-b-2 ${isActive('/modes') ? 'border-[var(--accent)] text-[var(--fg)]' : 'border-transparent text-[var(--muted)] hover:text-[var(--fg)]'}`}>03_Protocols</Link>
          <Link to="/statistics" className={`transition-colors py-1 border-b-2 ${isActive('/statistics') ? 'border-[var(--accent)] text-[var(--fg)]' : 'border-transparent text-[var(--muted)] hover:text-[var(--fg)]'}`}>04_Telemetry</Link>
          <Link to="/settings" className={`transition-colors py-1 border-b-2 ${isActive('/settings') ? 'border-[var(--accent)] text-[var(--fg)]' : 'border-transparent text-[var(--muted)] hover:text-[var(--fg)]'}`}>05_Config</Link>
        </div>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const authMinTime = 1000;
    const startTime = Date.now();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const timeElapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, authMinTime - timeElapsed);

      setTimeout(() => {
        setUser(currentUser);
        setLoading(false);
      }, remainingTime);
    });


    const saved = localStorage.getItem('typing-ref-settings');
    if (saved) {
      applyTheme(JSON.parse(saved).theme);
    } else {
      applyTheme('light');
    }

    return () => {
      unsubscribe();
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    root.classList.remove('theme-default', 'theme-dark', 'theme-gray');
    if (theme === 'dark') root.classList.add('theme-dark');
    else if (theme === 'light') root.classList.add('theme-default');
    else if (theme === 'gray') root.classList.add('theme-gray');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-[var(--accent)] font-dos uppercase relative overflow-hidden">
        {/* Animated Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-40"></div>

        <div className="relative z-10 space-y-6 flex flex-col items-center max-w-xs w-full px-6">
          <div className="w-12 h-12 border-2 border-[var(--accent)] border-t-transparent animate-spin rounded-full mb-4"></div>

          <div className="space-y-2 w-full">
            <div className="flex justify-between items-center text-[10px] tracking-widest opacity-80">
              <span className="animate-pulse">INITIALIZING_CORE</span>
              <span className="tabular-nums">0x{Math.random().toString(16).slice(2, 6).toUpperCase()}</span>
            </div>

            <div className="h-1 w-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-[var(--accent)] w-1/3 animate-[loading-progress_2s_infinite_ease-in-out]"></div>
            </div>

            <div className="flex flex-col space-y-1">
              <p className="text-[8px] tracking-[0.3em] opacity-40 text-center animate-pulse">
                Establishing_Firebase_Link...
              </p>
              <p className="text-[8px] tracking-[0.3em] opacity-40 text-center">
                Telemetry_Sync_Pending
              </p>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes loading-progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
          }
        `}</style>
      </div>
    );
  }


  if (isMobile) {
    return <MobileGate />;
  }


  return (
    <BrowserRouter>
      <div className="max-w-[900px] mx-auto px-6 pb-20 min-h-screen selection:bg-[var(--accent)] selection:text-white animate-in fade-in duration-500">
        <Navigation user={user} />


        <main>
          <Routes>
            <Route path="/" element={<Home isAuthorized={!!user} onLogout={handleLogout} />} />
            <Route path="/test" element={<Test isAuthorized={!!user} />} />
            <Route path="/modes" element={<Modes />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="mt-20 pt-8 border-t border-[var(--border)] text-[9px] text-[var(--muted)] flex justify-between uppercase tracking-widest">
          <div className="font-dos">TYPE-SPEC // REV_1.1.0_STABLE</div>
          <div>© 2026 Vaibhav Manaji // ALL_SYSTEMS_GO</div>
        </footer>
      </div>
    </BrowserRouter>

  );
};

export default App;
