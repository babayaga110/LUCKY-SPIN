
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WheelSegment, GameSettings } from './types';
import { DEFAULT_SEGMENTS, STORAGE_KEY } from './constants';
import SpinWheel from './components/SpinWheel';
import SettingsModal from './components/SettingsModal';
import ResultModal from './components/ResultModal';

const App: React.FC = () => {
  const [settings, setSettings] = useState<GameSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
    return {
      soundEnabled: true,
      segments: DEFAULT_SEGMENTS,
    };
  });

  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<WheelSegment | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize Audio Context on first interaction
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playSound = (type: 'tick' | 'win') => {
    if (!settings.soundEnabled || !audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'tick') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    }
  };

  // Save settings whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const handleSpin = useCallback(() => {
    if (isSpinning || settings.segments.length === 0) return;
    
    initAudio();
    setIsSpinning(true);
    setWinner(null);
    setShowResult(false);

    const extraRotations = 7 + Math.floor(Math.random() * 5);
    const randomDegrees = Math.floor(Math.random() * 360);
    const newRotation = rotation + (extraRotations * 360) + randomDegrees;
    
    setRotation(newRotation);

    // Simulated "tick" sound effect during spin
    let currentTickAngle = 0;
    const segmentAngle = 360 / settings.segments.length;
    const startTime = performance.now();
    const duration = 5000;

    const tickInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      if (elapsed >= duration) {
        clearInterval(tickInterval);
        return;
      }
      
      // Rough estimation of current rotation using ease-out cubic logic to match CSS transition
      const progress = elapsed / duration;
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const currentRotation = rotation + (newRotation - rotation) * easeOut;
      
      if (Math.abs(currentRotation - currentTickAngle) >= segmentAngle) {
        playSound('tick');
        currentTickAngle = currentRotation;
      }
    }, 50);

    setTimeout(() => {
      const normalizedRotation = newRotation % 360;
      const winningAngle = (360 - (normalizedRotation % 360)) % 360;
      const segmentCount = settings.segments.length;
      const step = 360 / segmentCount;
      const winningIndex = Math.floor(winningAngle / step);
      
      setWinner(settings.segments[winningIndex]);
      setIsSpinning(false);
      setShowResult(true);
      playSound('win');
    }, duration);
  }, [isSpinning, rotation, settings]);

  const updateSegments = (newSegments: WheelSegment[]) => {
    setSettings(prev => ({ ...prev, segments: newSegments }));
  };

  const toggleSound = () => {
    setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const resetToDefault = () => {
    if (window.confirm("Are you sure you want to reset everything to default?")) {
      setSettings({
        soundEnabled: true,
        segments: DEFAULT_SEGMENTS,
      });
      setRotation(0);
      setWinner(null);
      setShowResult(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 md:p-8 bg-[#0f172a] text-white overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
      </div>

      <header className="w-full max-w-4xl flex items-center justify-between mb-8 relative z-10">
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-5xl font-black pr-2 italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            LUCKY SPIN
          </h1>
          <p className="text-xs text-blue-400 font-bold uppercase tracking-widest ml-1">Powered by BizConnect Event</p>
        </div>
        <div className="flex gap-3">
           <button 
            onClick={() => setShowSettings(true)}
            className="p-3 glass-card rounded-2xl hover:bg-white/10 transition-all hover:scale-110 active:scale-95 shadow-lg border-white/20"
            title="Settings"
          >
            <SettingsIcon />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative w-full max-w-lg z-10">
        <div className="relative mb-12">
          {/* Enhanced Pointer */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
            <div className={`transition-transform duration-100 ${isSpinning ? 'animate-bounce' : ''}`}>
              <div className="w-10 h-12 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-t-full shadow-[0_0_20px_rgba(234,179,8,0.5)] border-2 border-white/30 relative">
                <div className="absolute top-full left-[-3px] w-0 h-0 border-l-[21px] border-l-transparent border-r-[21px] border-r-transparent border-t-[24px] border-t-yellow-500"></div>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl">
            <SpinWheel 
              segments={settings.segments} 
              rotation={rotation} 
              isSpinning={isSpinning}
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className={`group relative px-16 py-5 rounded-3xl text-2xl font-black tracking-widest shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 overflow-hidden ${
              isSpinning 
                ? 'bg-gray-800 cursor-not-allowed text-gray-500 border-gray-700' 
                : 'bg-white text-black border-4 border-transparent'
            }`}
          >
            {!isSpinning && (
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
            )}
            <span className="relative z-10">{isSpinning ? 'SPINNING...' : 'SPIN NOW'}</span>
          </button>

          <p className="text-sm text-white/40 font-medium">Click to try your luck!</p>
        </div>

        {/* List of prizes view for transparency */}
        <div className="mt-16 w-full glass-card p-6 rounded-3xl border-white/10">
          <h3 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-4 text-center">Available Rewards</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {settings.segments.map((s) => (
              <div key={s.id} className="text-xs flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 transition-colors hover:bg-white/10">
                <div className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: s.color, color: s.color }}></div>
                <span className="truncate font-semibold">{s.text}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {showSettings && (
        <SettingsModal 
          settings={settings}
          onClose={() => setShowSettings(false)}
          onUpdateSegments={updateSegments}
          onToggleSound={toggleSound}
          onReset={resetToDefault}
        />
      )}

      {showResult && winner && (
        <ResultModal 
          winner={winner} 
          onClose={() => setShowResult(false)} 
        />
      )}
    </div>
  );
};

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

export default App;
