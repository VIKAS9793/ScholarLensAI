
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Star, Trophy, Sparkles } from 'lucide-react';
import { CharacterId } from '../types';
import { sounds } from '../services/sound';

// --- Magic Button ---
interface MagicButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'success' | 'warning' | 'white';
  children: React.ReactNode;
}

export const MagicButton: React.FC<MagicButtonProps> = ({ children, variant = 'primary', className = '', onClick, ...props }) => {
  const variants = {
    primary: "bg-gradient-to-r from-magical-purple to-magical-pink text-white",
    success: "bg-gradient-to-r from-magical-green to-teal-400 text-white",
    warning: "bg-gradient-to-r from-magical-yellow to-magical-orange text-white",
    white: "bg-white text-magical-purple border-4 border-magical-purple"
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    sounds.playClick();
    if (onClick) onClick(e);
  };

  const handleMouseEnter = () => {
    sounds.playHover();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      className={`relative px-8 py-4 rounded-full font-display font-bold text-xl shadow-float transition-all overflow-hidden ${variants[variant]} ${className}`}
      {...props}
    >
      <motion.div
        className="absolute inset-0 bg-white opacity-20"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        style={{ width: '50%', background: 'linear-gradient(90deg, transparent, white, transparent)' }}
      />
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
};

// --- Quest Card ---
interface QuestCardProps {
  title: string;
  description: string;
  icon: string;
  color: 'green' | 'purple' | 'orange' | 'yellow';
  stars: number;
  totalStars?: number;
  onClick: () => void;
  isNew?: boolean;
  isComplete?: boolean;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  title, description, icon, color, stars, totalStars = 3, onClick, isNew, isComplete
}) => {
  const gradients = {
    green: "from-magical-green to-teal-500",
    purple: "from-magical-purple to-magical-pink",
    orange: "from-magical-orange to-red-400",
    yellow: "from-magical-yellow to-magical-orange"
  };

  const handleClick = () => {
    sounds.playClick();
    onClick();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, rotate: 1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      onMouseEnter={() => sounds.playHover()}
      className={`relative p-6 rounded-[2rem] cursor-pointer bg-gradient-to-br ${gradients[color]} shadow-float text-white overflow-hidden text-left w-full min-h-touch focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-2`}
      aria-label={`${title} activity. ${description}. ${stars} of ${totalStars} stars earned.${isNew ? ' New activity!' : ''}${isComplete ? ' Completed!' : ''}`}
      role="link"
    >
      {/* Background Decor */}
      <div className="absolute -right-4 -bottom-4 opacity-20 text-9xl" aria-hidden="true">{icon}</div>

      {isNew && (
        <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce shadow-lg" aria-hidden="true">
          NEW!
        </div>
      )}

      {isComplete && (
        <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 p-2 rounded-full shadow-lg" aria-hidden="true">
          <Trophy size={20} />
        </div>
      )}

      <div className="relative z-10">
        <div className="text-5xl mb-4" aria-hidden="true">{icon}</div>
        <h3 className="font-display text-3xl font-bold mb-2 leading-tight">{title}</h3>
        <p className="font-story text-lg opacity-90 mb-4">{description}</p>

        {/* Star Progress with semantic meaning */}
        <div className="flex gap-2" role="img" aria-label={`Progress: ${stars} of ${totalStars} stars earned`}>
          {Array.from({ length: totalStars }).map((_, i) => (
            <Star
              key={i}
              size={24}
              fill={i < stars ? "#FDE047" : "rgba(255,255,255,0.3)"}
              stroke="none"
              aria-hidden="true"
            />
          ))}
        </div>
        {/* Screen reader only text */}
        <span className="sr-only">{stars} of {totalStars} stars earned</span>
      </div>
    </motion.button>
  );
};

// --- Speech Bubble (M0-4: Enhanced with persistence) ---
interface SpeechBubbleProps {
  message: string;
  position?: 'left' | 'right';
  persistent?: boolean; // M0-4: Allow bubble to stay visible
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({ message, position = 'left', persistent = true }) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const [tipIndex, setTipIndex] = React.useState(0);

  // M0-4: Rotating tips for encouragement
  const tips = [
    message,
    "You're doing great! 🌟",
    "Take your time, there's no rush!",
    "Remember: small steps lead to big achievements!",
  ];

  // Cycle tips every 8 seconds if persistent
  React.useEffect(() => {
    if (!persistent) return;
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [persistent, tips.length]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`bg-white p-4 rounded-2xl shadow-lg relative max-w-xs ${position === 'left' ? 'rounded-bl-none' : 'rounded-br-none'}`}
    >
      <p className="font-story text-lg text-gray-800 pr-6">{persistent ? tips[tipIndex] : message}</p>
      {/* M0-4: Close button for dismissible speech */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-sm font-bold"
        aria-label="Dismiss message"
      >
        ✕
      </button>
      <div className={`absolute -bottom-2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-transparent border-t-white ${position === 'left' ? 'left-4' : 'right-4'}`} />
    </motion.div>
  );
};

// --- Mountain Progress ---
export const MountainProgress: React.FC<{ current: number; total: number }> = ({ current, total }) => {
  return (
    <div className="relative w-full h-32 mt-8">
      <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible">
        {/* Path */}
        <path d="M 0,100 L 100,60 L 200,80 L 300,40 L 400,10" fill="none" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
        <motion.path
          d="M 0,100 L 100,60 L 200,80 L 300,40 L 400,10"
          fill="none"
          stroke="#10B981"
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: current / total }}
        />

        {/* Checkpoints */}
        {[0, 1, 2, 3, 4].map((i) => {
          const percent = i / 4;
          // Approximate points based on path
          const points = [{ x: 0, y: 100 }, { x: 100, y: 60 }, { x: 200, y: 80 }, { x: 300, y: 40 }, { x: 400, y: 10 }];
          const pt = points[i];
          const isActive = i <= (current / total) * 4;

          return (
            <g key={i}>
              <circle cx={pt.x} cy={pt.y} r={isActive ? 12 : 8} fill={isActive ? "#10B981" : "#E5E7EB"} stroke="white" strokeWidth="3" />
              {isActive && i === Math.floor((current / total) * 4) && (
                <text x={pt.x} y={pt.y - 20} textAnchor="middle" fontSize="20">🧗</text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
