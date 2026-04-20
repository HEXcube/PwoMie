import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart } from 'lucide-react';
import { playPop } from '../utils/audio';
import { BLOB_SHAPES } from '../constants/squishies';

export interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
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
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-rose-900/30 hover:text-rose-900/60 transition-colors focus:outline-none"
              aria-label="Close about"
            >
              <X size={24} strokeWidth={2.5} />
            </button>

            <div className="flex flex-col items-center mb-6 mt-2">
              <motion.div 
                onClick={playPop} 
                animate={{ borderRadius: [BLOB_SHAPES[0], BLOB_SHAPES[1]] }}
                transition={{ borderRadius: { duration: 4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" } }}
                whileHover={{ scale: 1.1 }}
                className="w-20 h-20 flex items-center justify-center backdrop-blur-sm shadow-sm pointer-events-auto cursor-pointer bg-rose-200/40 text-rose-500 mb-4"
              >
                <span className="text-sm font-bold tracking-widest whitespace-nowrap select-none">• ᴗ •</span>
              </motion.div>
              <h2 className="text-2xl font-bold text-rose-950/80 font-sans tracking-tight">PwoMie</h2>
              <p className="text-sm font-semibold text-rose-900/50 mt-1 tracking-widest">v1.0.0</p>
            </div>

            <div className="bg-rose-50/70 rounded-3xl p-6 mb-8 text-center border border-rose-100/50">
              <p className="text-sm font-bold text-rose-950/70 leading-relaxed">
                A delightfully cute pomodoro companion.<br/>Stay focused without feeling lonely.
              </p>
              <div className="mt-5 pt-5 border-t border-rose-900/10 flex flex-col items-center">
                 <p className="text-xs font-bold text-rose-900/40 uppercase tracking-widest">Handcrafted By</p>
                 <p className="text-sm font-bold text-rose-950/60 mt-1">Rohan Villoth</p>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="w-full py-3 bg-rose-900/70 hover:bg-rose-900/80 text-white rounded-full font-bold transition-colors shadow-sm flex items-center justify-center space-x-2"
            >
              <Heart size={20} strokeWidth={2.5} />
              <span className="mt-1">Sweet!</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
