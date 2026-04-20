import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings, Info, SkipForward, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

const playPop = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {}
};

const playClick = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05);
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {}
};

// Character definitions for our cute companions
// Names: Sqiggly, Wiggly, Jiggly, and Miggly!
const CREATURE_TYPES = [
  { name: 'Sqiggly', eye: '•' }, // Small dot
  { name: 'Wiggly', eye: '◕' },  // Highlighted circle
  { name: 'Jiggly', eye: 'o' },  // Hollow circle
  { name: 'Miggly', eye: '°' }   // Tiny upper circle (slightly different)
];

// Subtle, water-balloon/mochi shapes for gentle animation
// Added more variation so characters look distinct
const BLOB_SHAPES = [
  // Shape 0: Slightly bottom-heavy
  "48% 52% 51% 49% / 50% 48% 55% 45%",
  // Shape 1: Slightly wider
  "55% 45% 49% 51% / 48% 52% 50% 52%",
  // Shape 2: Slightly taller
  "50% 50% 52% 48% / 55% 45% 48% 52%",
  // Shape 3: Slightly top-heavy
  "49% 51% 48% 52% / 45% 55% 51% 49%",
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
    }
    // Note: Removed the reset to bottom. Now they stay exactly where they are during a break!
  }, [isRunning, isWork, index]);

  // Determine what face to show based on state
  let eye = type.eye;
  let mouth = (isWork && isRunning) ? 'ᴗ' : '_';

  if (!isWork) {
    eye = '-';   // Sleepy eyes for break
    mouth = '_'; // Straight mouth while sleeping
  }
  
  const face = `${eye} ${mouth} ${eye}`;

  // Create a gentle A-to-B animation for each creature
  const shapeA = BLOB_SHAPES[index % BLOB_SHAPES.length];
  const shapeB = BLOB_SHAPES[(index + 1) % BLOB_SHAPES.length];

  return (
    <motion.div 
      className="absolute flex flex-col items-center pointer-events-none"
      animate={{
        left: `${pos.x}vw`,
        top: `${pos.y}vh`,
      }}
      transition={{
        duration: (!isWork || !isRunning) ? 3 : 5 + index,
        ease: "easeInOut"
      }}
      style={{ transform: `translate(-50%, -50%)` }}
    >
       <div className={`h-6 text-sm mb-1 font-bold tracking-widest transition-opacity duration-500 text-sky-500
         ${!isWork ? 'opacity-100' : 'opacity-0'}
         ${!isWork && isRunning ? 'animate-bounce' : ''} 
       `}>
         Zzz
       </div>
       <motion.div 
         onClick={playPop}
         animate={{ borderRadius: [shapeA, shapeB] }}
         transition={{ 
           borderRadius: { duration: 4 + index * 0.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
           scale: { type: "spring", stiffness: 400, damping: 15 },
           scaleX: { type: "spring", stiffness: 400, damping: 15 },
           scaleY: { type: "spring", stiffness: 400, damping: 15 }
         }}
         whileHover={{ scale: 1.05 }}
         // Pressing inward (Z-axis feel) - gets slightly larger and more circular as it squishes against the screen
         whileTap={{ scale: 1.1, borderRadius: "45% 55% 45% 55% / 55% 45% 55% 45%" }}
         className={`w-20 h-20 flex items-center justify-center backdrop-blur-sm shadow-sm pointer-events-auto cursor-pointer
         ${isWork ? 'bg-rose-200/40 text-rose-500 hover:bg-rose-300/60' : 'bg-sky-200/40 text-sky-600 hover:bg-sky-300/60'}
       `}>
         <span className="text-sm font-bold tracking-widest whitespace-nowrap select-none">{face}</span>
       </motion.div>
    </motion.div>
  );
};

export default function App() {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);

  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWork, setIsWork] = useState(true);

  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempWork, setTempWork] = useState(25);
  const [tempBreak, setTempBreak] = useState(5);

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
        setIsWork(false);
        setTimeLeft(breakMinutes * 60);
      } else {
        setIsWork(true);
        setTimeLeft(workMinutes * 60);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, isWork, workMinutes, breakMinutes]);

  // Update document title with remaining time
  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.title = `${timeString} - ${isWork ? 'Focus' : 'Break'}`;
  }, [timeLeft, isWork]);

  const toggleTimer = () => {
    playClick();
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    playClick();
    setIsRunning(false);
    setTimeLeft(isWork ? workMinutes * 60 : breakMinutes * 60);
  };

  const skipSession = () => {
    playClick();
    if (isWork) {
      setIsWork(false);
      setTimeLeft(breakMinutes * 60);
    } else {
      setIsWork(true);
      setTimeLeft(workMinutes * 60);
    }
  };

  const switchMode = (toWork) => {
    if (isWork === toWork) return;
    playClick();
    setIsWork(toWork);
    setIsRunning(false);
    setTimeLeft(toWork ? workMinutes * 60 : breakMinutes * 60);
  };

  const openSettings = () => {
    playClick();
    setTempWork(workMinutes);
    setTempBreak(breakMinutes);
    setIsSettingsOpen(true);
  };

  const closeSettings = () => {
    playClick();
    setIsSettingsOpen(false);
  };

  const saveSettings = () => {
    playClick();
    setWorkMinutes(tempWork);
    setBreakMinutes(tempBreak);
    setIsSettingsOpen(false);
    setIsRunning(false);
    setTimeLeft(isWork ? tempWork * 60 : tempBreak * 60);
  };

  const resetSettings = () => {
    playClick();
    setTempWork(25);
    setTempBreak(5);
    setWorkMinutes(25);
    setBreakMinutes(5);
    setIsSettingsOpen(false);
    setIsRunning(false);
    setTimeLeft(isWork ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const theme = isWork 
    ? {
        bg: 'bg-rose-50',
        text: 'text-rose-900/70', // Darker, muted text for the timer
        buttonBg: 'bg-rose-900/60', // Darker button background
        buttonText: 'text-white',
        buttonHover: 'hover:bg-rose-900/70',
        activePill: 'bg-rose-200/80 text-rose-900/80',
        inactivePill: 'text-rose-900/40 hover:text-rose-900/60 cursor-pointer',
        pillContainer: 'bg-rose-100/50',
        ringColor: 'focus:ring-rose-400',
        resetIcon: 'text-rose-900/40 hover:text-rose-900/60'
      }
    : {
        bg: 'bg-sky-50',
        text: 'text-sky-900/70',
        buttonBg: 'bg-sky-900/70',
        buttonText: 'text-white',
        buttonHover: 'hover:bg-sky-900/80',
        activePill: 'bg-sky-200/80 text-sky-900/80',
        inactivePill: 'text-sky-900/40 hover:text-sky-900/60 cursor-pointer',
        pillContainer: 'bg-sky-100/50',
        ringColor: 'focus:ring-sky-400',
        resetIcon: 'text-sky-900/40 hover:text-sky-900/60'
      };

  return (
    <div className={`relative overflow-hidden min-h-screen flex flex-col items-center justify-center transition-colors duration-1000 ease-in-out ${theme.bg}`}>
      
      {/* Settings Icon */}
      <button
        onClick={openSettings}
        className={`absolute top-8 right-8 sm:top-12 sm:right-12 z-20 p-2 rounded-full transition-colors duration-300 ${theme.resetIcon} focus:outline-none`}
        aria-label="Settings"
      >
        <Settings size={28} strokeWidth={2} />
      </button>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="relative bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 w-full max-w-sm shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white"
            >
              {/* Close Button Top Right */}
              <button 
                onClick={closeSettings}
                className="absolute top-6 right-6 text-rose-900/30 hover:text-rose-900/60 transition-colors focus:outline-none"
                aria-label="Close settings"
              >
                <X size={24} strokeWidth={2.5} />
              </button>

              <h2 className="text-xl font-bold text-center text-rose-950/80 mb-8 font-sans mt-2">Timer Settings</h2>

              {/* Pomodoro Slider */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-rose-950/70">Pomodoro Duration</span>
                  <span className="text-lg font-bold text-rose-950/80">{tempWork}m</span>
                </div>
                <div className="relative w-full pb-2">
                  <input 
                    type="range" 
                    min="1" max="60" 
                    value={tempWork} 
                    onChange={(e) => setTempWork(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-rose-100 accent-rose-900/60 relative z-10"
                  />
                  {/* Default Marker for 25m */}
                  <div className="absolute top-2 transform -translate-x-1/2 pointer-events-none" style={{ left: '40.67%' }}>
                    <div className="w-[3px] h-2 bg-white rounded-full mt-0.5"></div>
                    <div className="w-[1px] h-2 bg-rose-300 absolute top-0 left-[1px] rounded-full mt-0.5"></div>
                  </div>
                </div>
              </div>

              {/* Break Slider */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-sky-950/70">Break Duration</span>
                  <span className="text-lg font-bold text-sky-950/80">{tempBreak}m</span>
                </div>
                <div className="relative w-full pb-2">
                  <input 
                    type="range" 
                    min="1" max="30" 
                    value={tempBreak} 
                    onChange={(e) => setTempBreak(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-sky-100 accent-sky-700/60 relative z-10"
                  />
                  {/* Default Marker for 5m */}
                  <div className="absolute top-2 transform -translate-x-1/2 pointer-events-none" style={{ left: '13.79%' }}>
                    <div className="w-[3px] h-2 bg-white rounded-full mt-0.5"></div>
                    <div className="w-[1px] h-2 bg-sky-300 absolute top-0 left-[1px] rounded-full mt-0.5"></div>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="flex items-start bg-rose-50/70 rounded-2xl p-4 mb-8">
                <Info size={18} strokeWidth={2.5} className="text-rose-900/40 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-xs font-medium text-rose-900/60 leading-relaxed">
                  Adjusting your intervals helps maintain high cognitive focus throughout the day.
                </p>
              </div>

              {/* Buttons */}
              <button 
                onClick={saveSettings}
                className="w-full py-3 bg-rose-900/70 hover:bg-rose-900/80 text-white rounded-full font-bold transition-colors shadow-sm mb-2 flex items-center justify-center space-x-2"
              >
                <Save size={20} strokeWidth={2.5} />
                <span className='mt-1'>Save</span>
              </button>
              
              <button 
                onClick={resetSettings}
                className="w-full py-3 text-rose-900/70 hover:text-rose-900/90 font-bold transition-colors flex items-center justify-center space-x-1.5 mb-2 bg-rose-50 rounded-full"
              >
                <RotateCcw size={16} strokeWidth={2.5} />
                <span className='mt-1'>Reset</span>
              </button>

              <button 
                onClick={closeSettings}
                className="w-full py-3 text-rose-900/70 hover:text-rose-900/90 font-bold transition-colors flex items-center justify-center space-x-1.5 bg-rose-50 rounded-full"
              >
                <X size={18} strokeWidth={2.5} />
                <span className='mt-0.5'>Discard</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Main Minimal UI */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        
        {/* Mode Indicators (Pill Container) */}
        <div className={`flex items-center p-1.5 rounded-full mb-12 transition-colors duration-1000 ${theme.pillContainer}`}>
          <motion.button 
            onClick={() => switchMode(true)}
            className={`px-6 py-2 rounded-full text-sm font-bold tracking-wide transition-colors duration-500 ${isWork ? theme.activePill : theme.inactivePill}`}
          >
            Focus
          </motion.button>
          <motion.button 
            onClick={() => switchMode(false)}
            className={`px-6 py-2 rounded-full text-sm font-bold tracking-wide transition-colors duration-500 ${!isWork ? theme.activePill : theme.inactivePill}`}
          >
            Break
          </motion.button>
        </div>

        {/* Timer Display */}
        <div className={`text-[140px] leading-none font-bold tracking-tighter mb-16 transition-colors duration-1000 ${theme.text}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
          {formatTime(timeLeft)}
        </div>

        {/* Controls Container */}
        <div className="flex items-center justify-center space-x-8">
          {/* Reset Button */}
          <motion.button 
            onClick={resetTimer}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-4 rounded-full transition-colors duration-300 ${theme.resetIcon} focus:outline-none`}
            aria-label="Reset timer"
          >
            <RotateCcw size={28} strokeWidth={2.5} />
          </motion.button>

          {/* Play/Pause Button */}
          <motion.button 
            onClick={toggleTimer}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-colors duration-300 ${theme.buttonBg} ${theme.buttonText} ${theme.buttonHover} focus:outline-none focus:ring-4 focus:ring-opacity-30 ${theme.ringColor}`}
            aria-label={isRunning ? "Pause timer" : "Start timer"}
          >
            {isRunning ? (
              <Pause size={40} strokeWidth={2} fill="currentColor" />
            ) : (
              <Play size={40} strokeWidth={2} fill="currentColor" className="ml-2" />
            )}
          </motion.button>

          {/* Skip Button */}
          <motion.button 
            onClick={skipSession}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-4 rounded-full transition-colors duration-300 ${theme.resetIcon} focus:outline-none`}
            aria-label="Skip session"
          >
            <SkipForward size={28} strokeWidth={2.5} />
          </motion.button>
        </div>

      </div>
    </div>
  );
}