
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Terminal, ShieldCheck, Mail, Lock, Chrome, MoveRight, AlertCircle } from 'lucide-react';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsVerifying(true);
    setError(null);
    
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/', { replace: true });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'AUTHENTICATION_FAILED: ACCESS_DENIED');
      setIsVerifying(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsVerifying(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/', { replace: true });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'GOOGLE_FEDERATION_ERROR');
      setIsVerifying(false);
    }
  };

  const handleSkip = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 transition-colors duration-300">
      <div className="w-full max-w-md border border-[var(--border)] p-8 relative overflow-hidden bg-[var(--bg)] float-shadow technical-border">
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[var(--accent)]"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[var(--accent)]"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[var(--accent)]"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[var(--accent)]"></div>

        <div className="flex flex-col items-center mb-8">
          <div className="p-4 border border-[var(--border)] mb-4 bg-[var(--surface)]">
            <Terminal size={32} className={isVerifying ? 'animate-pulse text-[var(--accent)]' : 'text-[var(--fg)]'} />
          </div>
          <h1 className="font-dos text-2xl tracking-widest mb-1 uppercase text-[var(--fg)]">
            {mode === 'login' ? 'Terminal Access' : 'Create Operator'}
          </h1>
          <p className="text-[9px] text-[var(--muted)] tracking-[0.3em] uppercase">User Authentication Protocol Required</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 text-red-500 flex items-start space-x-3 animate-in fade-in zoom-in-95">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase tracking-widest">CRITICAL_AUTH_FAULT</span>
              <span className="text-[8px] uppercase leading-tight mt-1 opacity-80">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">
              <Mail size={10} />
              <span>Operator_ID [Email]</span>
            </div>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isVerifying}
              placeholder="operator@space-ops.ref"
              className="w-full bg-[var(--surface)] border border-[var(--border)] p-3 text-xs focus:outline-none focus:border-[var(--accent)] transition-all placeholder:text-[var(--muted)]/30 text-[var(--fg)]"
              required
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">
              <Lock size={10} />
              <span>Access_Code [Password]</span>
            </div>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isVerifying}
              placeholder="••••••••"
              className="w-full bg-[var(--surface)] border border-[var(--border)] p-3 text-xs focus:outline-none focus:border-[var(--accent)] transition-all placeholder:text-[var(--muted)]/30 text-[var(--fg)]"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isVerifying || !email || !password}
            className="w-full border border-[var(--fg)] py-4 mt-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-all flex items-center justify-center space-x-2 disabled:opacity-20 text-[var(--fg)]"
          >
            <ShieldCheck size={14} />
            <span>{isVerifying ? 'Authenticating...' : mode === 'login' ? 'Secure_Login' : 'Initialize_Account'}</span>
          </button>
        </form>

        <div className="mt-4 flex justify-center">
          <button 
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-[9px] text-[var(--muted)] hover:text-[var(--accent)] uppercase tracking-widest transition-colors"
          >
            {mode === 'login' ? 'Create new protocol access' : 'Use existing credentials'}
          </button>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border)]"></div>
          </div>
          <div className="relative flex justify-center text-[9px] uppercase tracking-widest">
            <span className="bg-[var(--bg)] px-4 text-[var(--muted)]">Alternative_Auth</span>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={handleGoogleLogin}
            disabled={isVerifying}
            className="w-full border border-[var(--border)] py-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:border-[var(--fg)] hover:bg-[var(--surface)] transition-all flex items-center justify-center space-x-2 disabled:opacity-20 text-[var(--fg)]"
          >
            <Chrome size={14} />
            <span>G_Suite_Federation</span>
          </button>

          <button 
            onClick={handleSkip}
            disabled={isVerifying}
            className="w-full border border-dashed border-[var(--border)] py-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:border-[var(--muted)] hover:bg-[var(--surface)] transition-all flex items-center justify-center space-x-2 disabled:opacity-20 text-[var(--muted)]"
          >
            <MoveRight size={14} />
            <span>Proceed_As_Guest</span>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--border)] flex justify-between items-center text-[9px] text-[var(--muted)] uppercase tracking-tighter">
          <span>Encrypted_TLS_1.3</span>
          <span className="tabular-nums">Node: {Math.random().toString(16).slice(2, 6).toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
