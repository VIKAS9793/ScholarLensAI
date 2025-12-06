
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '../types';
import { Trophy, Star } from 'lucide-react';
import { sounds } from '../services/sound';

export const LevelProgress: React.FC<{ xp: number, level: number }> = ({ xp, level }) => {
  const xpForNextLevel = level * 100;
  const progress = Math.min((xp / xpForNextLevel) * 100, 100);

  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex items-center gap-3">
      <div className="relative">
        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold border-2 border-yellow-200">
          {level}
        </div>
        <div className="absolute -bottom-1 -right-1 bg-primary-600 text-white text-[10px] px-1.5 rounded-full">
          LVL
        </div>
      </div>
      <div className="flex-1">
        <div className="flex justify-between text-xs mb-1">
          <span className="font-semibold text-gray-700">Experience</span>
          <span className="text-gray-500">{xp} / {xpForNextLevel} XP</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary-400 to-primary-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>
    </div>
  );
};

export const AchievementNotification: React.FC<{ achievement: Achievement | null, onDismiss: () => void }> = ({ achievement, onDismiss }) => {
  useEffect(() => {
    if (achievement) {
      sounds.playAchievement();
    }
  }, [achievement]);

  if (!achievement) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 20, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      >
        <div className="bg-white rounded-xl shadow-2xl p-4 flex items-center gap-4 pointer-events-auto border-2 border-yellow-400 max-w-sm mx-4">
          <div className="bg-yellow-100 p-3 rounded-full text-2xl animate-bounce">
            {achievement.icon}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide text-yellow-600">Achievement Unlocked!</h4>
            <p className="font-bold text-lg">{achievement.title}</p>
            <p className="text-sm text-gray-500">{achievement.description}</p>
          </div>
          <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600">×</button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const BrainBreak: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = React.useState(15);

  React.useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-primary-600 z-50 flex flex-col items-center justify-center text-white p-6 text-center"
    >
      <motion.div 
        animate={{ scale: [1, 1.2, 1] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-6xl mb-8"
      >
        🧘
      </motion.div>
      <h2 className="text-3xl font-bold mb-4">Brain Break!</h2>
      <p className="text-xl mb-8 max-w-md">Take a deep breath. Look away from the screen. Stretch your arms up high!</p>
      
      <div className="w-24 h-24 rounded-full border-4 border-white/30 flex items-center justify-center text-3xl font-bold">
        {timeLeft}
      </div>
      <button 
        onClick={onComplete}
        className="mt-8 text-white/70 hover:text-white underline text-sm"
      >
        Skip Break
      </button>
    </motion.div>
  );
};
