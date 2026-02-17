
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { RotateCcw, Timer as TimerIcon, Zap, AlertTriangle, Activity, Target, Hash, Quote, FileText, Volume2, VolumeX } from 'lucide-react';
import { TECHNICAL_DICTIONARY, NUMBERS, PUNCTUATION, KEYBOARD_SCHEMATIC } from '../constants';
import ResultsModal from '../components/ResultsModal';
import MechanicalKeyboard from '../components/MechanicalKeyboard';
import { TestStats, AppSettings, TextCategory, TestMode } from '../types';

interface TestProps {
  isAuthorized: boolean;
}

const Test: React.FC<TestProps> = ({ isAuthorized }) => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [lastTypedChar, setLastTypedChar] = useState<string | undefined>();
  const [isLastCorrect, setIsLastCorrect] = useState<boolean | null>(null);
  
  const [testMode, setTestMode] = useState<TestMode>('time');
  const [duration, setDuration] = useState(30);
  const [wordCountTarget, setWordCountTarget] = useState(25);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [includePunctuation, setIncludePunctuation] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [isFinished, setIsFinished] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [stats, setStats] = useState<TestStats | null>(null);
  const [difficulty, setDifficulty] = useState<'normal' | 'expert'>('normal');
  const [category, setCategory] = useState<TextCategory>('avionics');
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedSettings = localStorage.getItem('typing-ref-settings');
    if (savedSettings) {
      const parsed: AppSettings = JSON.parse(savedSettings);
      setDifficulty(parsed.difficulty);
      setIncludeNumbers(parsed.includeNumbers ?? false);
      setIncludePunctuation(parsed.includePunctuation ?? false);
      setSoundEnabled(parsed.sound ?? true);
    }
    const savedCat = localStorage.getItem('typing-ref-category') as TextCategory;
    if (savedCat) setCategory(savedCat);
  }, []);

  const toggleSound = (e: React.MouseEvent) => {
    e.preventDefault();
    const newSoundState = !soundEnabled;
    setSoundEnabled(newSoundState);
    const savedSettings = localStorage.getItem('typing-ref-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      localStorage.setItem('typing-ref-settings', JSON.stringify({ ...parsed, sound: newSoundState }));
    }
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const generateText = useCallback(() => {
    const dictionary = TECHNICAL_DICTIONARY[category] || TECHNICAL_DICTIONARY['avionics'];
    
    let count = wordCountTarget;
    if (testMode === 'time') {
      switch (duration) {
        case 15: count = 30; break;
        case 30: count = 45; break;
        case 60: count = 60; break;
        case 120: count = 75; break;
        default: count = 50;
      }
    }

    let words = [];
    for (let i = 0; i < count; i++) {
      let word = dictionary[Math.floor(Math.random() * dictionary.length)];
      if (includeNumbers && Math.random() > 0.8) word += NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
      if (includePunctuation && Math.random() > 0.8) word += PUNCTUATION[Math.floor(Math.random() * PUNCTUATION.length)];
      words.push(word);
    }
    return words.join(" ");
  }, [category, includeNumbers, includePunctuation, wordCountTarget, testMode, duration]);

  const resetTest = useCallback(() => {
    const newText = generateText();
    setText(newText);
    setInput("");
    setStartTime(null);
    setTimeLeft(duration);
    setIsFinished(false);
    setShowResults(false);
    setIsFailed(false);
    setStats(null);
    setLastTypedChar(undefined);
    setIsLastCorrect(null);
    setScrollProgress(0);
    setIsSaving(false);
    setTimeout(() => inputRef.current?.focus(), 10);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [duration, generateText]);

  useEffect(() => {
    resetTest();
  }, [category, testMode, duration, wordCountTarget, includeNumbers, includePunctuation]);

  useEffect(() => {
    const handleGlobalScroll = () => {
      const winScroll = window.pageYOffset || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = winScroll / (height || 1);
      setScrollProgress(Math.min(1, Math.max(0, scrolled)));
    };

    window.addEventListener('scroll', handleGlobalScroll);
    return () => window.removeEventListener('scroll', handleGlobalScroll);
  }, []);

  useEffect(() => {
    let interval: any;
    if (startTime && testMode === 'time' && timeLeft > 0 && !isFinished && !isFailed) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, timeLeft, isFinished, isFailed, testMode]);

  const calculateStats = useCallback((): TestStats => {
    const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
    const actualMinutes = elapsed / 60;
    
    const totalChars = input.length;
    let errors = 0;
    const targetChars = text.split('');
    const inputChars = input.split('');
    inputChars.forEach((char, i) => {
      if (char !== targetChars[i]) errors++;
    });

    const correctChars = totalChars - errors;
    const wpm = Math.max(0, Math.round((correctChars / 5) / (actualMinutes || 0.0001)));
    const rawWpm = Math.max(0, Math.round((totalChars / 5) / (actualMinutes || 0.0001)));
    const accuracy = Math.round((correctChars / (totalChars || 1)) * 100) || 0;
    
    return {
      wpm,
      accuracy,
      consistency: 85,
      rawWpm,
      timeTaken: Math.round(elapsed),
      errors
    };
  }, [input, text, startTime]);

  const saveToHistory = async (s: TestStats) => {
    if (!isAuthorized || !auth.currentUser) {
      navigate('/auth');
      return;
    }
    
    setIsSaving(true);
    try {
      const historyRef = collection(db, 'users', auth.currentUser.uid, 'history');
      await addDoc(historyRef, {
        ...s,
        date: new Date().toISOString(),
        mode: testMode,
        category: category,
        timestamp: Date.now()
      });
      setIsSaving(false);
      setShowResults(false);
    } catch (error) {
      console.error('Error committing record:', error);
      setIsSaving(false);
    }
  };

  const finishTest = () => {
    setIsFinished(true);
    setShowResults(true);
    const finalStats = calculateStats();
    setStats(finalStats);
  };

  const failTest = () => {
    setIsFailed(true);
    setIsFinished(false);
    setShowResults(false);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished || isFailed) return;
    const val = e.target.value;
    if (val.length < input.length) {
      setInput(val);
      setLastTypedChar(undefined);
      setIsLastCorrect(null);
      return;
    }
    if (!startTime) setStartTime(Date.now());
    const typedChar = val.charAt(val.length - 1);
    const expectedChar = text.charAt(val.length - 1);
    const correct = typedChar === expectedChar;
    setLastTypedChar(typedChar);
    setIsLastCorrect(correct);
    if (difficulty === 'expert' && val.length > 0 && !correct) {
      failTest();
      return;
    }
    setInput(val);
    if (val.length >= text.length) finishTest();
  };

  const currentStats = calculateStats();

  const renderText = () => {
    return text.split('').map((char, i) => {
      let color = "text-[var(--muted)]";
      let underline = "";
      if (i < input.length) {
        color = input[i] === text[i] ? "text-emerald-500" : "text-red-500";
      }
      if (i === input.length && !isFailed) {
        underline = "border-b-2 border-[var(--accent)] cursor-blink";
      }
      return (
        <span key={i} className={`${color} ${underline} transition-colors duration-75`}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 technical-border p-3 bg-[var(--surface)] float-shadow">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-6">
            <div className="flex space-x-1 border-r border-[var(--border)] pr-4">
              <button onClick={() => setTestMode('time')} className={`text-[9px] px-3 py-1 uppercase tracking-widest transition-all ${testMode === 'time' ? 'text-[var(--accent)] font-bold' : 'text-[var(--muted)] hover:text-[var(--fg)]'}`}>Time</button>
              <button onClick={() => setTestMode('words')} className={`text-[9px] px-3 py-1 uppercase tracking-widest transition-all ${testMode === 'words' ? 'text-[var(--accent)] font-bold' : 'text-[var(--muted)] hover:text-[var(--fg)]'}`}>Words</button>
            </div>
            <div className="flex space-x-1">
              {testMode === 'time' ? (
                [15, 30, 60, 120].map((t) => (
                  <button key={t} onClick={() => setDuration(t)} className={`text-[9px] px-3 py-1 border border-transparent hover:border-[var(--border)] uppercase tracking-widest transition-all ${duration === t ? 'text-[var(--accent)] border-[var(--accent)]/30 bg-[var(--accent)]/5' : 'text-[var(--muted)]'}`}>{t}s</button>
                ))
              ) : (
                [10, 25, 50, 100].map((w) => (
                  <button key={w} onClick={() => setWordCountTarget(w)} className={`text-[9px] px-3 py-1 border border-transparent hover:border-[var(--border)] uppercase tracking-widest transition-all ${wordCountTarget === w ? 'text-[var(--accent)] border-[var(--accent)]/30 bg-[var(--accent)]/5' : 'text-[var(--muted)]'}`}>{w}w</button>
                ))
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 border-r border-[var(--border)] pr-4">
              <button onClick={() => setIncludeNumbers(!includeNumbers)} className={`flex items-center space-x-1 text-[9px] uppercase tracking-widest transition-all ${includeNumbers ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`}><Hash size={10} /><span>Numbers</span></button>
              <button onClick={() => setIncludePunctuation(!includePunctuation)} className={`flex items-center space-x-1 text-[9px] uppercase tracking-widest transition-all ${includePunctuation ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`}><Quote size={10} /><span>Punct</span></button>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={toggleSound} className={`transition-colors p-1 outline-none ${soundEnabled ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`}>{soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}</button>
              <button onClick={() => resetTest()} className="text-[var(--muted)] hover:text-[var(--fg)] transition-colors p-1"><RotateCcw size={14} /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="technical-border bg-[var(--surface)] p-3 float-shadow flex flex-col justify-center">
          <div className="flex items-center space-x-2 mb-1"><TimerIcon size={12} className="text-[var(--accent)]" /><span className="text-[9px] uppercase tracking-widest text-[var(--muted)]">{testMode === 'time' ? 'Time / Rem' : 'Progress'}</span></div>
          <div className="text-xl font-bold tabular-nums font-dos">{testMode === 'time' ? `${timeLeft}s` : `${input.length}/${text.length}`}</div>
        </div>
        <div className="technical-border bg-[var(--surface)] p-3 float-shadow flex flex-col justify-center">
          <div className="flex items-center space-x-2 mb-1"><Zap size={12} className="text-emerald-500" /><span className="text-[9px] uppercase tracking-widest text-[var(--muted)]">Velocity / Cur</span></div>
          <div className="text-xl font-bold tabular-nums font-dos">{currentStats.wpm} <span className="text-[10px] text-[var(--muted)] font-normal uppercase">Wpm</span></div>
        </div>
        <div className="technical-border bg-[var(--surface)] p-3 float-shadow flex flex-col justify-center">
          <div className="flex items-center space-x-2 mb-1"><Target size={12} className="text-blue-400" /><span className="text-[9px] uppercase tracking-widest text-[var(--muted)]">Accuracy / Tot</span></div>
          <div className="text-xl font-bold tabular-nums font-dos">{currentStats.accuracy}%</div>
        </div>
        <div className="technical-border bg-[var(--surface)] p-3 float-shadow flex flex-col justify-center">
          <div className="flex items-center space-x-2 mb-1"><Activity size={12} className="text-[var(--muted)]" /><span className="text-[9px] uppercase tracking-widest text-[var(--muted)]">Protocol</span></div>
          <div className="text-xs font-bold font-dos text-[var(--accent)] truncate uppercase">{category}</div>
        </div>
      </div>

      <div className={`relative z-0 p-8 sm:p-10 technical-border float-shadow transition-colors duration-300 min-h-[400px] ${isFailed ? 'bg-red-500/5' : 'bg-[var(--bg)]'}`}>
        {isFailed && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[var(--bg)]/80 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300">
             <AlertTriangle size={48} className="text-red-500 mb-4" />
             <h2 className="text-2xl font-bold text-red-500 tracking-tighter uppercase mb-2 font-dos">TERMINAL ERROR</h2>
             <button onClick={() => resetTest()} className="px-8 py-3 bg-[var(--bg)] technical-border border-red-800 text-red-500 text-xs uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all">[ REINITIALIZE_CORE ]</button>
          </div>
        )}
        <div className="relative select-none font-medium text-left whitespace-pre-wrap break-words text-2xl leading-relaxed tracking-wide max-w-[800px] mx-auto">
          {renderText()}
        </div>
        <input 
          ref={inputRef} 
          type="text" 
          autoFocus 
          className="fixed top-[-100px] left-[-100px] w-1 h-1 opacity-0 pointer-events-none" 
          value={input} 
          onChange={handleInput} 
          autoComplete="off" 
          disabled={isFinished || isFailed} 
        />
        {!isFinished && !isFailed && <div className="absolute inset-0 cursor-text z-10 pointer-events-auto bg-transparent" onClick={() => inputRef.current?.focus()} />}
      </div>

      <div className="flex flex-col items-center py-12 space-y-12">
        <MechanicalKeyboard activeChar={text[input.length]} lastTypedChar={lastTypedChar} isLastCorrect={isLastCorrect} soundEnabled={soundEnabled} />
        <div className="opacity-10 hover:opacity-25 transition-opacity duration-1000 text-[var(--accent)]"><div className="w-full max-w-md">{KEYBOARD_SCHEMATIC}</div></div>
      </div>

      {showResults && stats && (
        <ResultsModal 
          stats={stats} 
          isAuthorized={isAuthorized}
          isSaving={isSaving}
          onRestart={() => resetTest()} 
          onSave={() => saveToHistory(stats)}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
};

export default Test;
