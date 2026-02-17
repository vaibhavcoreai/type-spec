
import React, { useState, useEffect, useRef } from 'react';

interface MechanicalKeyboardProps {
  activeChar?: string; // The character the user is supposed to type
  lastTypedChar?: string;
  isLastCorrect?: boolean | null;
  soundEnabled?: boolean;
}

const MechanicalKeyboard: React.FC<MechanicalKeyboardProps> = ({ 
  activeChar, 
  lastTypedChar, 
  isLastCorrect,
  soundEnabled = true
}) => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [isCapsLockActive, setIsCapsLockActive] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // Use a ref for soundEnabled to avoid re-attaching event listeners every time the toggle is clicked
  const soundEnabledRef = useRef(soundEnabled);
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  // High-fidelity mechanical click sound synthesis
  const playClick = () => {
    if (!soundEnabledRef.current) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const startTime = ctx.currentTime;

    // --- Layer 1: The Impact "Click" (High-pass Filtered Noise) ---
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(4500, startTime);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.12, startTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.012); // Slightly snappier

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    // --- Layer 2: The Body "Clack" (Low-Frequency Triangle) ---
    const clack = ctx.createOscillator();
    clack.type = 'triangle';
    clack.frequency.setValueAtTime(250, startTime);
    clack.frequency.exponentialRampToValueAtTime(80, startTime + 0.07);

    const clackGain = ctx.createGain();
    clackGain.gain.setValueAtTime(0.08, startTime);
    clackGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.09);

    clack.connect(clackGain);
    clackGain.connect(ctx.destination);

    // --- Layer 3: The Metallic "Ping" (High Sine Resonance) ---
    const ping = ctx.createOscillator();
    ping.type = 'sine';
    ping.frequency.setValueAtTime(3200, startTime);

    const pingGain = ctx.createGain();
    pingGain.gain.setValueAtTime(0.012, startTime);
    pingGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.035);

    ping.connect(pingGain);
    pingGain.connect(ctx.destination);

    // Start all components
    noiseSource.start(startTime);
    clack.start(startTime);
    ping.start(startTime);

    // Clean up
    clack.stop(startTime + 0.1);
    ping.stop(startTime + 0.05);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      // Update CapsLock state
      setIsCapsLockActive(e.getModifierState('CapsLock'));
      
      const normalizedKey = key === ' ' ? 'space' : key;
      if (!pressedKeys.has(normalizedKey)) {
        playClick();
        setPressedKeys(prev => new Set(prev).add(normalizedKey));
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      // Update CapsLock state
      setIsCapsLockActive(e.getModifierState('CapsLock'));
      
      const normalizedKey = key === ' ' ? 'space' : key;
      setPressedKeys(prev => {
        const next = new Set(prev);
        next.delete(normalizedKey);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []); // Empty dependency array ensures stability of listeners

  const rows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'backspace'],
    ['capslock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'enter'],
    ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',' , '.', '/'],
    ['space']
  ];

  const getKeyLabel = (key: string) => {
    if (key === 'backspace') return '⌫';
    if (key === 'enter') return '↵';
    if (key === 'shift') return '⇧';
    if (key === 'capslock') return 'CPS';
    if (key === 'space') return '';
    return key.toUpperCase();
  };

  const getKeyWidth = (key: string) => {
    if (key === 'space') return 'w-48 sm:w-64';
    if (key === 'backspace' || key === 'enter' || key === 'shift' || key === 'capslock') return 'w-16 sm:w-20';
    return 'w-8 h-8 sm:w-10 sm:h-10';
  };

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-2 select-none pointer-events-none animate-suspended">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex space-x-1 sm:space-x-2">
          {row.map((key) => {
            const isPressed = pressedKeys.has(key === ' ' ? 'space' : key);
            const isTarget = activeChar?.toLowerCase() === key;
            const isRecentHit = lastTypedChar?.toLowerCase() === key;
            const isCapsLockKey = key === 'capslock';
            
            let feedbackClass = "border-[var(--border)] text-[var(--muted)]";
            let glowClass = "";

            if (isRecentHit && isLastCorrect !== null) {
              if (isLastCorrect) {
                feedbackClass = "border-emerald-500 text-emerald-500 scale-[0.98]";
                glowClass = "shadow-[0_0_10px_rgba(16,185,129,0.2)]";
              } else {
                feedbackClass = "border-red-500 text-red-500 animate-shake";
                glowClass = "shadow-[0_0_10px_rgba(239,68,68,0.2)]";
              }
            } else if (isPressed) {
              feedbackClass = "border-[var(--accent)] text-[var(--accent)] bg-[var(--surface)] translate-y-[2px]";
            } else if (isTarget) {
              feedbackClass = "border-[var(--accent)]/40 text-[var(--accent)]/60 bg-[var(--accent)]/5";
            }

            return (
              <div
                key={key}
                className={`
                  ${getKeyWidth(key)}
                  h-8 sm:h-10
                  technical-border
                  flex items-center justify-center
                  text-[10px] font-bold uppercase tracking-tighter
                  transition-all duration-100 ease-out
                  bg-[var(--bg)]
                  float-shadow
                  ${feedbackClass}
                  ${glowClass}
                  relative
                `}
              >
                {/* Visual depth for mechanical feel */}
                <div className={`absolute inset-0 opacity-10 border-b border-r border-black/20 pointer-events-none`}></div>
                
                {getKeyLabel(key)}

                {/* Sub-label for technical feel */}
                <span className="absolute bottom-[1px] right-[2px] text-[6px] opacity-30 font-normal">
                  {key === 'space' ? 'SPC' : ''}
                </span>

                {/* CapsLock Indicator Light */}
                {isCapsLockKey && (
                  <div className="absolute top-[3px] left-[3px] flex items-center space-x-1">
                    <div className={`w-1 h-1 rounded-full ${isCapsLockActive ? 'bg-orange-500 shadow-[0_0_4px_rgba(249,115,22,0.6)]' : 'bg-[var(--border)]'}`}></div>
                    <span className={`text-[5px] font-bold tracking-tighter ${isCapsLockActive ? 'text-orange-500 opacity-100' : 'opacity-0'}`}>ACTIVE</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      <style>{`
        @keyframes drift {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-0.5px) rotate(0.05deg); }
        }
        .animate-suspended {
          animation: drift 8s ease-in-out infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-1px); }
          75% { transform: translateX(1px); }
        }
        .animate-shake {
          animation: shake 0.1s ease-in-out 2;
        }
      `}</style>
    </div>
  );
};

export default MechanicalKeyboard;
