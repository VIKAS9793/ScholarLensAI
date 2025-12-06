import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { TUTORIAL_STEPS } from '../constants';
import { ChevronRight, Check } from 'lucide-react';

interface TutorialProps {
  onComplete: () => void;
}

export const Tutorial: React.FC<TutorialProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < TUTORIAL_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring' }}
      >
        <div className="bg-primary-600 p-8 text-center relative overflow-hidden">
          <motion.div 
            key={step}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="text-6xl mb-2 relative z-10"
          >
            {TUTORIAL_STEPS[step].icon}
          </motion.div>
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="p-8">
          <div className="h-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{TUTORIAL_STEPS[step].title}</h3>
                <p className="text-gray-600 leading-relaxed">{TUTORIAL_STEPS[step].desc}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between mt-8">
            <div className="flex gap-2">
              {TUTORIAL_STEPS.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-primary-600' : 'w-2 bg-gray-200'}`} 
                />
              ))}
            </div>
            <Button onClick={handleNext} className="rounded-full px-6">
              {step === TUTORIAL_STEPS.length - 1 ? "Get Started" : "Next"} 
              {step === TUTORIAL_STEPS.length - 1 ? <Check className="ml-2 w-4 h-4" /> : <ChevronRight className="ml-2 w-4 h-4" />}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
