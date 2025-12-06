import React from 'react';
import { motion, TargetAndTransition } from 'framer-motion';
import { CharacterId, CharacterMood } from '../types';

interface CharacterProps {
  id: CharacterId;
  mood?: CharacterMood;
  size?: number;
}

export const Character: React.FC<CharacterProps> = ({ id, mood = 'idle', size = 150 }) => {
  // Animation Variants
  const bounce: TargetAndTransition = {
    y: [0, -10, 0],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  };
  
  const pulse: TargetAndTransition = {
    scale: [1, 1.05, 1],
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
  };
  
  const shake: TargetAndTransition = {
    rotate: [0, -5, 5, 0],
    transition: { duration: 0.5, repeat: Infinity, repeatDelay: 3 }
  };
  
  const celebrate: TargetAndTransition = {
    y: [0, -20, 0],
    rotate: [0, 360, 0],
    scale: [1, 1.2, 1],
    transition: { duration: 1, repeat: Infinity, repeatDelay: 1 }
  };

  const getAnimation = () => {
    switch (mood) {
      case 'happy': return pulse;
      case 'encouraging': return bounce;
      case 'thinking': return shake;
      case 'celebrating': return celebrate;
      default: return bounce;
    }
  };

  // Simple SVG representations for characters
  const renderSVG = () => {
    switch (id) {
      case 'buddy': // Owl
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="#60A5FA" />
            <circle cx="35" cy="40" r="12" fill="white" />
            <circle cx="65" cy="40" r="12" fill="white" />
            <circle cx="35" cy="40" r="5" fill="black" />
            <circle cx="65" cy="40" r="5" fill="black" />
            <path d="M 45 55 L 50 65 L 55 55 Z" fill="#FBBF24" />
            <path d="M 30 20 L 20 10 M 70 20 L 80 10" stroke="#60A5FA" strokeWidth="5" strokeLinecap="round" />
            <path d="M 30 70 Q 50 85 70 70" fill="none" stroke="#1E3A8A" strokeWidth="3" />
          </svg>
        );
      case 'luna': // Cat
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="55" r="40" fill="#C084FC" />
            <path d="M 15 25 L 30 50 L 45 25 Z" fill="#C084FC" />
            <path d="M 55 25 L 70 50 L 85 25 Z" fill="#C084FC" />
            <circle cx="35" cy="50" r="5" fill="white" />
            <circle cx="65" cy="50" r="5" fill="white" />
            <circle cx="35" cy="50" r="2" fill="black" />
            <circle cx="65" cy="50" r="2" fill="black" />
            <circle cx="50" cy="65" r="3" fill="pink" />
            <path d="M 20 60 L 5 55 M 20 65 L 5 65 M 20 70 L 5 75" stroke="white" strokeWidth="2" />
            <path d="M 80 60 L 95 55 M 80 65 L 95 65 M 80 70 L 95 75" stroke="white" strokeWidth="2" />
          </svg>
        );
      case 'pixel': // Dragon
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M 50 15 Q 85 15 85 50 Q 85 85 50 85 Q 15 85 15 50 Q 15 15 50 15" fill="#34D399" />
            <path d="M 30 15 L 40 30 L 50 15" fill="#059669" />
            <path d="M 50 15 L 60 30 L 70 15" fill="#059669" />
            <circle cx="35" cy="45" r="6" fill="white" />
            <circle cx="65" cy="45" r="6" fill="white" />
            <circle cx="35" cy="45" r="3" fill="black" />
            <circle cx="65" cy="45" r="3" fill="black" />
            <rect x="30" y="65" width="40" height="10" rx="5" fill="white" />
            <path d="M 35 65 L 35 75 M 45 65 L 45 75 M 55 65 L 55 75 M 65 65 L 65 75" stroke="#34D399" strokeWidth="2" />
          </svg>
        );
      case 'sunny': // Fox
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M 50 90 L 10 30 L 30 10 L 50 30 L 70 10 L 90 30 Z" fill="#FB923C" stroke="#F97316" strokeWidth="2" />
            <circle cx="35" cy="40" r="5" fill="black" />
            <circle cx="65" cy="40" r="5" fill="black" />
            <circle cx="50" cy="55" r="4" fill="#1F2937" />
            <path d="M 50 90 L 40 70 L 60 70 Z" fill="white" />
          </svg>
        );
      default: return null;
    }
  };

  return (
    <motion.div 
      style={{ width: size, height: size }}
      animate={getAnimation()}
    >
      {renderSVG()}
    </motion.div>
  );
};