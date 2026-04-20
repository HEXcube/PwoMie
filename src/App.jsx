import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings, Info, SkipForward } from 'lucide-react';
import { motion } from 'motion/react';

// Import newly refactored modular components
import { playChime, playClick } from './utils/audio';
import { Squishy } from './components/Squishy';
import { AboutModal } from './components/AboutModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);

  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWork, setIsWork] = useState(true);

  // Settings and Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

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
    setIsSettingsOpen(true);
  };

  const closeSettings = () => {
    playClick();
    setIsSettingsOpen(false);
  };

  const openAbout = () => {
    playClick();
    setIsAboutOpen(true);
  };

  const closeAbout = () => {
    playClick();
    setIsAboutOpen(false);
  };

  const saveSettings = (newWork, newBreak) => {
    playClick();
    setWorkMinutes(newWork);
    setBreakMinutes(newBreak);
    setIsSettingsOpen(false);
    setIsRunning(false);
    setTimeLeft(isWork ? newWork * 60 : newBreak * 60);
  };

  const resetDefaults = () => {
    playClick();
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
        text: 'text-rose-900/70',
        buttonBg: 'bg-rose-900/60',
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
      
      {/* Utility Icons */}
      <div className="absolute top-3 right-3 sm:top-6 sm:right-6 z-20 flex items-center space-x-2">
        <button
          onClick={openAbout}
          className={`p-2 rounded-full transition-colors duration-300 ${theme.resetIcon} focus:outline-none`}
          aria-label="About"
        >
          <Info size={28} strokeWidth={2} />
        </button>
        <button
          onClick={openSettings}
          className={`p-2 rounded-full transition-colors duration-300 ${theme.resetIcon} focus:outline-none`}
          aria-label="Settings"
        >
          <Settings size={28} strokeWidth={2} />
        </button>
      </div>

      <AboutModal isOpen={isAboutOpen} onClose={closeAbout} />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={closeSettings} 
        initialWork={workMinutes} 
        initialBreak={breakMinutes}
        onSave={saveSettings}
        onResetDefaults={resetDefaults}
        playClick={playClick}
      />

      {/* Background Squishies */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[0, 1, 2, 3].map(index => (
          <Squishy 
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