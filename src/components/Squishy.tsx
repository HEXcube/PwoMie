import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { playPop } from '../utils/audio';
import { SQUISHY_TYPES, BLOB_SHAPES } from '../constants/squishies';

export interface SquishyProps {
  isRunning: boolean;
  isWork: boolean;
  index: number;
}

export const Squishy: React.FC<SquishyProps> = ({ isRunning, isWork, index }) => {
  const [pos, setPos] = useState({ 
    x: 15 + (index * 20) + Math.random() * 10, 
    y: 20 + Math.random() * 50 
  });
  
  const type = SQUISHY_TYPES[index % SQUISHY_TYPES.length];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isWork && isRunning) {
      const move = () => {
        setPos({
          x: 10 + Math.random() * 80,
          y: 10 + Math.random() * 80
        });
      };
      
      const timeout = setTimeout(move, index * 800);
      interval = setInterval(move, 5000 + index * 1000);
      
      return () => {
         clearTimeout(timeout);
         clearInterval(interval);
      };
    }
  }, [isRunning, isWork, index]);

  let eye = type.eye;
  let mouth = (isWork && isRunning) ? 'ᴗ' : '_';

  if (!isWork) {
    eye = '-';
    mouth = '_';
  }
  
  const face = `${eye} ${mouth} ${eye}`;

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
         whileTap={{ scale: 1.1, borderRadius: "45% 55% 45% 55% / 55% 45% 55% 45%" }}
         className={`w-20 h-20 flex items-center justify-center backdrop-blur-sm shadow-sm pointer-events-auto cursor-pointer
         ${isWork ? 'bg-rose-200/40 text-rose-500 hover:bg-rose-300/60' : 'bg-sky-200/40 text-sky-600 hover:bg-sky-300/60'}
       `}>
         <span className="text-sm font-bold tracking-widest whitespace-nowrap select-none">{face}</span>
       </motion.div>
    </motion.div>
  );
};
