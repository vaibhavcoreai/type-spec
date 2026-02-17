
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Share2, RefreshCw, Save, FileText, X, Lock, Loader2 } from 'lucide-react';
import { TestStats } from '../types';

interface ResultsModalProps {
  stats: TestStats;
  isAuthorized: boolean;
  isSaving?: boolean;
  onRestart: () => void;
  onSave: () => void;
  onClose: () => void;
}

const ResultsModal: React.FC<ResultsModalProps> = ({ stats, isAuthorized, isSaving, onRestart, onSave, onClose }) => {
  const data = Array.from({ length: 12 }).map((_, i) => ({
    time: i * 5,
    wpm: Math.max(0, stats.wpm + (Math.random() * 10 - 5)),
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 p-4">
      <div className="w-full max-w-2xl bg-[var(--bg)] text-[var(--fg)] technical-border float-shadow p-8 relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--accent)]"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--accent)]"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--accent)]"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--accent)]"></div>

        <div className="flex justify-between items-start mb-8 border-b border-[var(--border)] pb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 technical-border bg-[var(--surface)] text-[var(--muted)] hidden sm:block">
              <FileText size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tighter uppercase mb-1 font-dos">Diagnostic Report</h2>
              <p className="text-[10px] text-[var(--muted)] uppercase tracking-widest flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2"></span>
                System Hash: 0X_{Math.random().toString(16).slice(2, 6).toUpperCase()} // {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="group flex flex-col items-center">
            <div className="flex items-center space-x-2 px-3 py-2 technical-border bg-[var(--surface)] group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] transition-all">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Exit</span>
              <X size={14} />
            </div>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="technical-border p-4 bg-[var(--surface)]">
            <div className="text-[10px] uppercase text-[var(--muted)] mb-1">Speed / Net</div>
            <div className="text-2xl font-bold font-dos">{stats.wpm} <span className="text-xs text-[var(--muted)] font-normal uppercase">WPM</span></div>
          </div>
          <div className="technical-border p-4 bg-[var(--surface)]">
            <div className="text-[10px] uppercase text-[var(--muted)] mb-1">Accuracy</div>
            <div className="text-2xl font-bold font-dos">{stats.accuracy}<span className="text-xs text-[var(--muted)] font-normal">%</span></div>
          </div>
          <div className="technical-border p-4 bg-[var(--surface)]">
            <div className="text-[10px] uppercase text-[var(--muted)] mb-1">Errors</div>
            <div className="text-2xl font-bold font-dos text-red-500">{stats.errors}</div>
          </div>
          <div className="technical-border p-4 bg-[var(--surface)]">
            <div className="text-[10px] uppercase text-[var(--muted)] mb-1">Speed / Raw</div>
            <div className="text-2xl font-bold font-dos">{stats.rawWpm}</div>
          </div>
        </div>

        <div className="h-48 w-full mb-10 technical-border bg-[var(--surface)] p-2 relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="time" hide />
              <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', fontSize: '10px', fontFamily: 'IBM Plex Mono', color: 'var(--fg)' }} labelStyle={{ display: 'none' }} />
              <Line type="monotone" dataKey="wpm" stroke="var(--accent)" strokeWidth={1.5} dot={{ fill: 'var(--accent)', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap gap-4">
          <button onClick={onRestart} className="flex-1 min-w-[140px] px-6 py-4 bg-[var(--fg)] text-[var(--bg)] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[var(--accent)] hover:text-white transition-all flex items-center justify-center space-x-3">
            <RefreshCw size={14} />
            <span>Restart Protocol</span>
          </button>
          
          <button 
            onClick={onSave} 
            disabled={isSaving}
            className={`flex-1 min-w-[140px] px-6 py-4 technical-border text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-3 ${isAuthorized ? 'text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--surface)]' : 'text-[var(--accent)] border-[var(--accent)]/50 bg-[var(--accent)]/5 hover:bg-[var(--accent)] hover:text-white'}`}
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : (isAuthorized ? <Save size={14} /> : <Lock size={14} />)}
            <span>{isSaving ? 'COMMITTING...' : (isAuthorized ? 'Commit Record' : 'Sign In to Commit')}</span>
          </button>
        </div>
        
        {!isAuthorized && (
          <p className="mt-4 text-[9px] text-[var(--muted)] text-center uppercase tracking-widest opacity-60">
            Note: Committing records requires an authenticated telemetry session.
          </p>
        )}
      </div>
    </div>
  );
};

export default ResultsModal;
