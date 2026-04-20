import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, RotateCcw, Info } from 'lucide-react';

export const SettingsModal = ({ 
  isOpen, 
  onClose, 
  initialWork, 
  initialBreak, 
  onSave, 
  onResetDefaults,
  playClick 
}) => {
  const [tempWork, setTempWork] = useState(initialWork);
  const [tempBreak, setTempBreak] = useState(initialBreak);

  // Sync temp state with props when opened
  useEffect(() => {
    if (isOpen) {
      setTempWork(initialWork);
      setTempBreak(initialBreak);
    }
  }, [isOpen, initialWork, initialBreak]);

  return (
    <AnimatePresence>
      {isOpen && (
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
              onClick={onClose}
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
              onClick={() => onSave(tempWork, tempBreak)}
              className="w-full py-3 bg-rose-900/70 hover:bg-rose-900/80 text-white rounded-full font-bold transition-colors shadow-sm mb-2 flex items-center justify-center space-x-2"
            >
              <Save size={20} strokeWidth={2.5} />
              <span className='mt-1'>Save</span>
            </button>
            
            <button 
              onClick={onResetDefaults}
              className="w-full py-3 text-rose-900/70 hover:text-rose-900/90 font-bold transition-colors flex items-center justify-center space-x-1.5 mb-2 bg-rose-50 rounded-full"
            >
              <RotateCcw size={16} strokeWidth={2.5} />
              <span className='mt-0.5'>Reset</span>
            </button>

            <button 
              onClick={onClose}
              className="w-full py-3 text-rose-900/70 hover:text-rose-900/90 font-bold transition-colors flex items-center justify-center space-x-1.5 bg-rose-50 rounded-full"
            >
              <X size={18} strokeWidth={2.5} />
              <span className='mt-0.5'>Discard</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
