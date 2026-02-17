
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Layers, BarChart3, Settings as SettingsIcon, Terminal, LogOut, LogIn } from 'lucide-react';
import { KEYBOARD_SCHEMATIC } from '../constants';

const ManualBlock: React.FC<{
  refCode: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  cta: string;
}> = ({ refCode, title, description, icon, onClick, cta }) => (
  <div 
    onClick={onClick}
    className="technical-border p-6 cursor-pointer hover:bg-[var(--surface)] transition-all group relative overflow-hidden float-shadow hover:-translate-y-1"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex flex-col">
        <span className="text-[8px] font-bold text-[var(--accent)] mb-1 opacity-70">{refCode}</span>
        <h3 className="text-xs font-bold tracking-[0.2em] text-[var(--fg)] uppercase group-hover:text-[var(--accent)] transition-colors duration-300">
          {title}
        </h3>
      </div>
      <div className="text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors">
        {icon}
      </div>
    </div>
    <p className="text-[11px] text-[var(--muted)] leading-relaxed mb-6 min-h-[80px]">
      {description}
    </p>
    <div className="text-[10px] text-[var(--muted)] flex items-center group-hover:text-[var(--fg)] transition-colors border-t border-[var(--border)] pt-4 mt-auto">
      <span className="mr-2 text-[var(--accent)]">▶</span>
      <span className="tracking-[0.2em]">{cta}</span>
    </div>
  </div>
);

interface HomeProps {
  isAuthorized: boolean;
  onLogout: () => void;
}

const Home: React.FC<HomeProps> = ({ isAuthorized, onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl mb-4 manual-heading font-dos leading-none">
            TYPING PRACTICE REFERENCE
          </h1>
          <p className="text-sm text-[var(--muted)] max-w-md leading-relaxed">
            A precision instrument for developing typing speed. Developed for high-performance input optimization in mission-critical environments.
          </p>
          <div className="mt-8 flex space-x-4">
            <button 
              onClick={() => navigate('/test')}
              className="px-8 py-3 bg-transparent technical-border text-xs uppercase tracking-widest hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-all flex items-center space-x-3"
            >
              <Terminal size={14} />
              <span>Initialize System</span>
            </button>
            
            {isAuthorized ? (
              <button 
                onClick={onLogout}
                className="px-4 py-3 bg-transparent technical-border text-[var(--muted)] hover:text-red-500 hover:border-red-500 transition-all"
                title="Terminate Session"
              >
                <LogOut size={14} />
              </button>
            ) : (
              <button 
                onClick={() => navigate('/auth')}
                className="px-8 py-3 bg-transparent border border-[var(--accent)] text-[var(--accent)] text-xs uppercase tracking-widest hover:bg-[var(--accent)] hover:text-white transition-all flex items-center space-x-3"
              >
                <LogIn size={14} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
        <div className="hidden md:block text-[var(--accent)] opacity-90 drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.2)]">
          {KEYBOARD_SCHEMATIC}
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ManualBlock 
          refCode="REF_01_INIT"
          title="01. Start Test"
          description="Initiate a new diagnostic session to measure current input throughput and accuracy metrics. Real-time telemetry will be logged to the primary command buffer."
          icon={<Play size={18} strokeWidth={1} />}
          onClick={() => navigate('/test')}
          cta="EXEC_DIAGNOSTIC_SESSION"
        />
        <ManualBlock 
          refCode="REF_02_PROTO"
          title="02. Modes"
          description="Switch between time-based drills, word count objectives, or technical quote references. Custom protocols allow for targeted input training in specific technical domains."
          icon={<Layers size={18} strokeWidth={1} />}
          onClick={() => navigate('/modes')}
          cta="LOAD_INPUT_PROTOCOLS"
        />
        <ManualBlock 
          refCode="REF_03_DATA"
          title="03. Statistics"
          description="Review historical telemetry data, consistency graphs, and performance trending. Statistical analysis of input velocity (WPM) and precision metrics over multiple cycles."
          icon={<BarChart3 size={18} strokeWidth={1} />}
          onClick={() => navigate('/statistics')}
          cta="ANALYZE_MISSION_LOGS"
        />
        <ManualBlock 
          refCode="REF_04_CONF"
          title="04. Settings"
          description="Configure haptic feedback, audio cues, and interface visual parameters. Ensure environment variables are tuned for maximum operator efficiency and minimal cognitive load."
          icon={<SettingsIcon size={18} strokeWidth={1} />}
          onClick={() => navigate('/settings')}
          cta="MODIFY_ENV_PARAMETERS"
        />
      </section>
    </div>
  );
};

export default Home;
