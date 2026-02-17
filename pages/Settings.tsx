
import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Eye, ShieldAlert, Cpu, Hash, Quote, Clock } from 'lucide-react';
import { AppSettings, TestMode } from '../types';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('typing-ref-settings');
    if (saved) return JSON.parse(saved);
    return {
      difficulty: 'normal',
      sound: true,
      theme: 'light',
      includeNumbers: false,
      includePunctuation: false,
      defaultTestMode: 'time'
    };
  });

  useEffect(() => {
    localStorage.setItem('typing-ref-settings', JSON.stringify(settings));
    applyTheme(settings.theme as string);
  }, [settings]);

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    root.classList.remove('theme-default', 'theme-dark', 'theme-gray');
    if (theme === 'dark') root.classList.add('theme-dark');
    else if (theme === 'light') root.classList.add('theme-default');
    else if (theme === 'gray') root.classList.add('theme-gray');
  };

  const updateSetting = (key: keyof AppSettings, value: any) => {
    setSettings(s => ({ ...s, [key]: value }));
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <section>
        <h1 className="text-3xl font-bold tracking-tighter mb-4 manual-heading">System Parameters</h1>
        <p className="text-xs text-[var(--muted)] uppercase tracking-widest">Configuring environment variables for optimal throughput.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="technical-border p-6 float-shadow bg-[var(--surface)] flex flex-col justify-between">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-[var(--bg)] technical-border">
              {settings.sound ? <Volume2 size={20} className="text-[var(--accent)]" /> : <VolumeX size={20} className="text-[var(--muted)]" />}
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-1">Acoustic Feedback</h3>
              <p className="text-[10px] text-[var(--muted)] uppercase">Key actuation simulations</p>
            </div>
          </div>
          <button 
            onClick={() => updateSetting('sound', !settings.sound)}
            className={`w-full py-2 text-[10px] uppercase tracking-widest border transition-all ${settings.sound ? 'bg-[var(--accent)]/10 border-[var(--accent)] text-[var(--accent)]' : 'bg-transparent border-[var(--border)] text-[var(--muted)]'}`}
          >
            {settings.sound ? 'ENABLED' : 'DISABLED'}
          </button>
        </div>

        <div className="technical-border p-6 float-shadow bg-[var(--surface)]">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-[var(--bg)] technical-border">
              <ShieldAlert size={20} className="text-orange-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-1">Operational Rigor</h3>
              <p className="text-[10px] text-[var(--muted)] uppercase">Input matching strictness</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={() => updateSetting('difficulty', 'normal')}
              className={`flex-1 py-3 text-[10px] uppercase tracking-widest border transition-all ${settings.difficulty === 'normal' ? 'bg-[var(--fg)] border-[var(--fg)] text-[var(--bg)]' : 'bg-transparent border-[var(--border)] text-[var(--muted)]'}`}
            >
              Normal
            </button>
            <button 
              onClick={() => updateSetting('difficulty', 'expert')}
              className={`flex-1 py-3 text-[10px] uppercase tracking-widest border transition-all ${settings.difficulty === 'expert' ? 'bg-[var(--fg)] border-red-900/50 text-red-400' : 'bg-transparent border-[var(--border)] text-[var(--muted)]'}`}
            >
              Expert
            </button>
          </div>
        </div>

        <div className="technical-border p-6 float-shadow bg-[var(--surface)]">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-[var(--bg)] technical-border">
              <Clock size={20} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-1">Test Protocol</h3>
              <p className="text-[10px] text-[var(--muted)] uppercase">Default diagnostic mode</p>
            </div>
          </div>
          <div className="flex space-x-4">
            {(['time', 'words'] as TestMode[]).map(mode => (
              <button 
                key={mode}
                onClick={() => updateSetting('defaultTestMode', mode)}
                className={`flex-1 py-3 text-[10px] uppercase tracking-widest border transition-all ${settings.defaultTestMode === mode ? 'bg-[var(--fg)] border-[var(--fg)] text-[var(--bg)]' : 'bg-transparent border-[var(--border)] text-[var(--muted)]'}`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="technical-border p-6 float-shadow bg-[var(--surface)]">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-[var(--bg)] technical-border">
              <Hash size={20} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-1">Data Complexity</h3>
              <p className="text-[10px] text-[var(--muted)] uppercase">Inject numeric and punctuation chars</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={() => updateSetting('includeNumbers', !settings.includeNumbers)}
              className={`flex-1 py-3 text-[10px] uppercase tracking-widest border transition-all ${settings.includeNumbers ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-[var(--border)] text-[var(--muted)]'}`}
            >
              Numbers: {settings.includeNumbers ? 'ON' : 'OFF'}
            </button>
            <button 
              onClick={() => updateSetting('includePunctuation', !settings.includePunctuation)}
              className={`flex-1 py-3 text-[10px] uppercase tracking-widest border transition-all ${settings.includePunctuation ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-[var(--border)] text-[var(--muted)]'}`}
            >
              Punct: {settings.includePunctuation ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        <div className="technical-border p-6 float-shadow flex items-center justify-between bg-[var(--surface)] md:col-span-2">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[var(--bg)] technical-border">
              <Eye size={20} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-1">Visual Protocol</h3>
              <p className="text-[10px] text-[var(--muted)] uppercase">Interface luminance mapping</p>
            </div>
          </div>
          <div className="flex space-x-4">
             <div 
               onClick={() => updateSetting('theme', 'light')}
               className={`w-10 h-10 bg-white border cursor-pointer transition-all hover:scale-110 ${settings.theme === 'light' ? 'ring-2 ring-blue-500 border-transparent' : 'border-gray-300'}`}
             ></div>
             <div 
               onClick={() => updateSetting('theme', 'dark')}
               className={`w-10 h-10 bg-[#0a0a0a] border cursor-pointer transition-all hover:scale-110 ${settings.theme === 'dark' ? 'ring-2 ring-blue-400 border-transparent' : 'border-gray-700'}`}
             ></div>
             <div 
               onClick={() => updateSetting('theme', 'gray')}
               className={`w-10 h-10 bg-[#1f2937] border cursor-pointer transition-all hover:scale-110 ${settings.theme === 'gray' ? 'ring-2 ring-emerald-500 border-transparent' : 'border-gray-600'}`}
             ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
