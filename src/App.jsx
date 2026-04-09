import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';

// Gentle chime sound using Web Audio API
const playChime = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5); // Drop to A4
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.5);
  } catch (e) {
    console.error("Audio playback failed:", e);
  }
};

// Character definitions for our cute companions
const CREATURE_TYPES = [
  { active: '( • ω • )', breakFace: '( u w u )', breakActivity: 'Zzz', wait: '( • _ • )' },
  { active: '( ◕ ▿ ◕ )', breakFace: '( ˘ ▽ ˘ )', breakActivity: '☕', wait: '( ◕ _ ◕ )' },
  { active: '( ^ ᴗ ^ )', breakFace: '( ᵕ ᴗ ᵕ )', breakActivity: '📖', wait: '( º _ º )' },
  { active: '( ˶ˆ꒳ˆ˵ )', breakFace: '( ˘ ᵕ ˘ )', breakActivity: '🎵', wait: '( ˶-.-˵ )' }
];

const Creature = ({ isRunning, isWork, index }) => {
  // Randomize their starting positions slightly
  const [pos, setPos] = useState({ 
    x: 15 + (index * 20) + Math.random() * 10, 
    y: 20 + Math.random() * 50 
  });
  
  const type = CREATURE_TYPES[index % CREATURE_TYPES.length];

  useEffect(() => {
    let interval;
    
    if (isWork && isRunning) {
      // Wander around randomly during work
      const move = () => {
        setPos({
          x: 10 + Math.random() * 80, // Keep within 10% to 90% of screen
          y: 10 + Math.random() * 80
        });
      };
      
      // Staggered initial movement
      const timeout = setTimeout(move, index * 800);
      
      // Continue wandering every few seconds
      interval = setInterval(move, 5000 + index * 1000);
      
      return () => {
         clearTimeout(timeout);
         clearInterval(interval);
      };
    } else if (!isWork) {
      // Go to the bottom of the screen to relax during breaks
      setPos({ x: 20 + index * 20, y: 88 });
    }
    // If !isRunning && isWork, they just stay exactly where they are (frozen)
  }, [isRunning, isWork, index]);

  // Determine what face and activity to show
  let face = type.active;
  let activity = '';

  if (!isWork) {
    face = type.breakFace;
    activity = type.breakActivity;
  } else if (!isRunning) {
    face = type.wait;
    activity = '...';
  }

  return (
    <div 
      className="absolute flex flex-col items-center pointer-events-none transition-all ease-in-out"
      style={{
        left: `${pos.x}vw`,
        top: `${pos.y}vh`,
        transitionDuration: (!isWork || !isRunning) ? '3s' : `${5000 + index * 1000}ms`,
        transform: `translate(-50%, -50%)`,
      }}
    >
       <div className={`h-6 text-sm mb-1 transition-opacity duration-500
         ${!isWork && isRunning ? 'animate-bounce text-sky-400 opacity-100' : 'text-rose-300 opacity-70'}
         ${isWork && isRunning ? 'opacity-0' : ''} 
       `}>
         {activity}
       </div>
       <div className={`px-4 py-2 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors duration-1000 shadow-sm
         ${isWork ? 'bg-rose-200/40 text-rose-500' : 'bg-sky-200/40 text-sky-600'}
       `}>
         <span className="text-sm font-bold tracking-widest whitespace-nowrap">{face}</span>
       </div>
    </div>
  );
};

export default function App() {
  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  // Handle timer countdown and automatic switching
  useEffect(() => {
    let interval = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      playChime();
      
      if (isWork) {
        setSessionsCompleted(prev => prev + 1);
        setIsWork(false);
        setTimeLeft(BREAK_TIME);
      } else {
        setIsWork(true);
        setTimeLeft(WORK_TIME);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isWork]);

  // Update document title with remaining time
  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.title = `${timeString} - ${isWork ? 'Focus' : 'Break'}`;
  }, [timeLeft, isWork]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isWork ? WORK_TIME : BREAK_TIME);
  };

  const skipSession = () => {
    if (isWork) {
      setSessionsCompleted(prev => prev + 1);
      setIsWork(false);
      setTimeLeft(BREAK_TIME);
    } else {
      setIsWork(true);
      setTimeLeft(WORK_TIME);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const theme = isWork 
    ? {
        bg: 'bg-rose-50',
        text: 'text-rose-400',
        buttonHover: 'hover:bg-rose-100',
        activePill: 'bg-rose-200 text-rose-600',
        inactivePill: 'text-rose-300'
      }
    : {
        bg: 'bg-sky-50',
        text: 'text-sky-400',
        buttonHover: 'hover:bg-sky-100',
        activePill: 'bg-sky-200 text-sky-600',
        inactivePill: 'text-sky-300'
      };

  return (
    <div className={`relative overflow-hidden min-h-screen flex flex-col items-center justify-center transition-colors duration-1000 ease-in-out ${theme.bg}`}>
      
      {/* Background Creatures */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[0, 1, 2, 3].map(index => (
          <Creature 
            key={index} 
            index={index} 
            isRunning={isRunning} 
            isWork={isWork} 
          />
        ))}
      </div>

      {/* Main Card */}
      <div className="relative z-10 flex flex-col items-center p-8 sm:p-12 rounded-3xl backdrop-blur-sm bg-white/10 shadow-[0_0_40px_rgba(0,0,0,0.02)]">
        
        {/* Mode Indicators */}
        <div className="flex space-x-4 mb-8 sm:mb-12 font-medium tracking-wide text-sm sm:text-base">
          <span className={`px-4 py-1.5 rounded-full transition-colors duration-500 ${isWork ? theme.activePill : theme.inactivePill}`}>
            focus
          </span>
          <span className={`px-4 py-1.5 rounded-full transition-colors duration-500 ${!isWork ? theme.activePill : theme.inactivePill}`}>
            break
          </span>
        </div>

        {/* Timer Display */}
        <div className={`text-8xl sm:text-9xl font-light tracking-tight mb-12 transition-colors duration-1000 ${theme.text}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
          {formatTime(timeLeft)}
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-6 sm:space-x-8">
          <button 
            onClick={resetTimer}
            className={`p-4 rounded-full transition-all duration-300 ${theme.text} ${theme.buttonHover} focus:outline-none focus:ring-2 focus:ring-opacity-50`}
            aria-label="Reset timer"
          >
            <RotateCcw size={28} strokeWidth={2} />
          </button>

          <button 
            onClick={toggleTimer}
            className={`p-6 rounded-full transition-all duration-300 transform hover:scale-105 ${theme.text} ${theme.buttonHover} focus:outline-none focus:ring-2 focus:ring-opacity-50`}
            aria-label={isRunning ? "Pause timer" : "Start timer"}
          >
            {isRunning ? (
              <Pause size={48} strokeWidth={1.5} fill="currentColor" />
            ) : (
              <Play size={48} strokeWidth={1.5} fill="currentColor" className="ml-2" />
            )}
          </button>

          <button 
            onClick={skipSession}
            className={`p-4 rounded-full transition-all duration-300 ${theme.text} ${theme.buttonHover} focus:outline-none focus:ring-2 focus:ring-opacity-50`}
            aria-label="Skip session"
          >
            <SkipForward size={28} strokeWidth={2} />
          </button>
        </div>

        {/* Session Counter */}
        <div className={`mt-16 text-sm sm:text-base font-medium transition-colors duration-1000 ${theme.inactivePill}`}>
          cycles completed: {sessionsCompleted}
        </div>

      </div>
    </div>
  );
}