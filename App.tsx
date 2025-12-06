
import React, { useState, useEffect } from 'react';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { Button } from './components/Button';
import { MediaCapture } from './components/MediaCapture';
import { Tutorial } from './components/Tutorial';
import { LiveHandwritingAnalysis } from './components/LiveHandwritingAnalysis';
import { AchievementNotification, BrainBreak } from './components/Gamification';
import { SkillsRadar } from './components/Visualizations';
import { Character } from './components/Characters';
import { MagicButton, QuestCard, SpeechBubble, MountainProgress } from './components/MagicalUI';
import { analyzeAssessment } from './services/geminiService';
import { storage } from './services/storage';
import { AssessmentType, ChildProfile, AssessmentResult, ConfidenceLevel, Achievement } from './types';
import { APP_NAME, SAMPLE_TEXTS, MATH_PROBLEMS, ACHIEVEMENTS, QUESTS, AGE_RANGES } from './constants';
import { sounds } from './services/sound';
import { 
  BookOpen, 
  Activity, 
  Calendar,
  Lock,
  Sparkles,
  Home,
  Camera,
  Edit3,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- SUB-COMPONENTS ---

const LoadingScreen = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-gradient-to-br from-magical-purple to-magical-pink z-50 flex flex-col items-center justify-center p-4"
  >
    <motion.div 
      animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="mb-8"
    >
      <Character id="buddy" mood="thinking" size={200} />
    </motion.div>
    <h2 className="font-display text-4xl font-bold text-white mb-4 text-shadow-magical">Preparing Adventure...</h2>
    <div className="flex gap-2">
       {[0, 1, 2].map(i => (
         <motion.div 
           key={i}
           className="w-4 h-4 bg-white rounded-full"
           animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
           transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
         />
       ))}
    </div>
  </motion.div>
);

const ResultCard = ({ result, onDismiss }: { result: AssessmentResult, onDismiss: () => void }) => {
  const confidenceColor = 
    result.overallConfidence === ConfidenceLevel.HIGH ? 'bg-green-100 text-green-800 border-green-200' :
    result.overallConfidence === ConfidenceLevel.MEDIUM ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
    'bg-red-100 text-red-800 border-red-200';

  useEffect(() => {
    sounds.playSuccess();
  }, []);

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 max-h-[90vh] overflow-y-auto"
    >
      <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-start sticky top-0 z-10 backdrop-blur-md bg-white/80">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 capitalize">{result.type} Report</h3>
          <p className="text-sm text-gray-500">{new Date(result.timestamp).toLocaleDateString()} • Powered by Gemini 3 Pro</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${confidenceColor}`}>
          {result.overallConfidence} CONFIDENCE
        </span>
      </div>
      
      <div className="p-6 space-y-8">
        {result.skillDimensions && (
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <SkillsRadar result={result} />
          </div>
        )}

        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h4 className="font-bold text-blue-900 mb-2 flex items-center text-lg">
            <Activity className="w-5 h-5 mr-2" /> AI Interpretation
          </h4>
          <p className="text-blue-800 leading-relaxed">{result.interpretation}</p>
        </div>

        {result.actionPlan && result.actionPlan.length > 0 && (
          <div>
             <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center">
               <Calendar className="w-5 h-5 mr-2 text-primary-600" /> Recommended Action Plan
             </h4>
             <div className="grid gap-3">
               {result.actionPlan.map((item, idx) => (
                 <div key={idx} className="flex items-start bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                   <div className={`mt-1 w-2 h-2 rounded-full mr-3 flex-shrink-0 ${
                     item.priority === 'immediate' ? 'bg-red-500' : 
                     item.priority === 'short-term' ? 'bg-yellow-500' : 'bg-green-500'
                   }`} />
                   <div>
                     <p className="font-semibold text-gray-800">{item.action}</p>
                     <div className="flex gap-2 mt-2">
                       <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">
                         {item.priority}
                       </span>
                       <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">
                         {item.type}
                       </span>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        <div>
          <h4 className="font-bold text-gray-900 mb-3">Key Observations</h4>
          <ul className="space-y-3">
            {result.observations.map((obs, idx) => (
              <li key={idx} className="flex items-start text-sm bg-gray-50 p-3 rounded-lg">
                <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700">
                  {obs.timestamp && <span className="font-mono text-primary-600 font-bold text-xs mr-2">[{obs.timestamp}]</span>}
                  {obs.observation}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 z-10 backdrop-blur-md bg-white/80">
        <Button variant="outline" onClick={() => window.print()}>Print Report</Button>
        <Button onClick={onDismiss}>Done</Button>
      </div>
    </motion.div>
  );
};

// --- MAIN APP ---

function App() {
  const [viewMode, setViewMode] = useState<'kid' | 'parent'>('kid');
  const [currentStep, setCurrentStep] = useState<'landing' | 'onboarding' | 'dashboard' | 'assessment' | 'results'>('landing');
  const [activeProfile, setActiveProfile] = useState<ChildProfile | null>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentType | null>(null);
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<AssessmentResult | null>(null);
  
  const [showTutorial, setShowTutorial] = useState(false);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);
  const [showBrainBreak, setShowBrainBreak] = useState(false);
  
  const [writingMode, setWritingMode] = useState<'digital' | 'camera'>('digital');

  useEffect(() => {
    const loadedProfiles = storage.getProfiles();
    setProfiles(loadedProfiles);
    
    // Auto-load profile if it exists to prevent blank screens on refresh
    if (loadedProfiles.length > 0 && !activeProfile) {
      setActiveProfile(loadedProfiles[0]);
    }
  }, []);

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    const formData = new FormData(e.target as HTMLFormElement);
    const newProfile: ChildProfile = {
      id: crypto.randomUUID(),
      name: formData.get('name') as string,
      age: Number(formData.get('age')),
      grade: formData.get('grade') as string,
      language: formData.get('language') as string,
      hasConsent: true,
      createdAt: Date.now(),
      xp: 0,
      level: 1,
      achievements: [],
      stars: {
        [AssessmentType.READING]: 0,
        [AssessmentType.WRITING]: 0,
        [AssessmentType.MATH]: 0,
        [AssessmentType.ATTENTION]: 0,
      }
    };
    storage.saveProfile(newProfile);
    setActiveProfile(newProfile);
    setProfiles(storage.getProfiles());
    setShowTutorial(true);
  };

  const finishTutorial = () => {
    sounds.playSuccess();
    setShowTutorial(false);
    setCurrentStep('dashboard');
    unlockAchievement('first_step');
  };

  const unlockAchievement = (id: string) => {
    if (!activeProfile) return;
    if (activeProfile.achievements.includes(id)) return;

    const achievement = ACHIEVEMENTS.find(a => a.id === id);
    if (achievement) {
      const updatedProfile = { 
        ...activeProfile, 
        achievements: [...activeProfile.achievements, id],
        xp: activeProfile.xp + 50 
      };
      
      setActiveProfile(updatedProfile);
      const allProfiles = storage.getProfiles().map(p => p.id === updatedProfile.id ? updatedProfile : p);
      localStorage.setItem('scholarLens_profiles', JSON.stringify(allProfiles));
      
      setShowAchievement(achievement);
      setTimeout(() => setShowAchievement(null), 5000);
    }
  };

  const startAssessment = (type: AssessmentType) => {
    if (!activeProfile) return;
    // QuestCard handles click sound
    setSelectedAssessment(type);
    setCurrentStep('assessment');
    if (type === AssessmentType.WRITING) setWritingMode('digital');
  };

  const processAssessment = async (file: File | Blob) => {
    if (!activeProfile || !selectedAssessment) return;
    
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const base64Content = base64data.split(',')[1];
        const mimeType = base64data.split(';')[0].split(':')[1];

        // Safe problem selection
        let mathProblem = MATH_PROBLEMS["K-1"];
        if (activeProfile.grade === '2' || activeProfile.grade === '3') mathProblem = MATH_PROBLEMS["2-3"];
        else if (['4','5','6'].includes(activeProfile.grade)) mathProblem = MATH_PROBLEMS["4-6"];

        const context = {
          age: activeProfile.age,
          grade: activeProfile.grade,
          extra: selectedAssessment === AssessmentType.MATH 
            ? `Problem: ${mathProblem}`
            : undefined
        };

        const analysis = await analyzeAssessment(selectedAssessment, base64Content, mimeType, context);

        const fullResult: AssessmentResult = {
          id: crypto.randomUUID(),
          childId: activeProfile.id,
          type: selectedAssessment,
          timestamp: Date.now(),
          overallConfidence: analysis.overallConfidence || ConfidenceLevel.LOW,
          observations: analysis.observations || [],
          metrics: analysis.metrics || {},
          interpretation: analysis.interpretation || "Analysis failed to generate interpretation.",
          recommendations: analysis.recommendations || [],
          actionPlan: analysis.actionPlan || [],
          skillDimensions: analysis.skillDimensions,
          rawText: analysis.rawText
        };

        storage.saveResult(fullResult);
        setLastResult(fullResult);
        setIsProcessing(false);
        setCurrentStep('results');

        const xpGain = 100;
        const newXp = activeProfile.xp + xpGain;
        const newLevel = Math.floor(newXp / 100) + 1;
        
        // Check for level up
        if (newLevel > activeProfile.level) {
            sounds.playLevelUp();
        }
        
        // Update Stars
        const newStars = { ...activeProfile.stars };
        newStars[selectedAssessment] = Math.min(3, newStars[selectedAssessment] + 1);

        const updatedProfile = { ...activeProfile, xp: newXp, level: newLevel, stars: newStars };
        setActiveProfile(updatedProfile);
        
        const allProfiles = storage.getProfiles().map(p => p.id === updatedProfile.id ? updatedProfile : p);
        localStorage.setItem('scholarLens_profiles', JSON.stringify(allProfiles));

        if (selectedAssessment === AssessmentType.READING) unlockAchievement('reading_star');
        if (selectedAssessment === AssessmentType.MATH) unlockAchievement('math_whiz');
        if (selectedAssessment === AssessmentType.ATTENTION) unlockAchievement('focus_master');
        if (selectedAssessment === AssessmentType.WRITING) unlockAchievement('artist');
        if (newLevel >= 3) unlockAchievement('dedicated');

        if (Math.random() > 0.7) setShowBrainBreak(true);
      };
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      alert("An error occurred during AI analysis. Please check your API key and internet connection.");
    }
  };

  // --- RENDER ROUTER ---

  const renderLanding = () => (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-gradient-to-b from-sky-300 via-sky-100 to-green-100">
      {/* Decorative Background Elements */}
      <motion.div animate={{ x: [0, 100, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute top-20 left-10 text-6xl opacity-50">☁️</motion.div>
      <motion.div animate={{ x: [0, -150, 0] }} transition={{ duration: 30, repeat: Infinity }} className="absolute top-40 right-10 text-6xl opacity-40">☁️</motion.div>
      <div className="absolute bottom-0 w-full h-32 bg-green-200 rounded-t-[50%] scale-150 translate-y-16"></div>

      <header className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6 border-4 border-magical-purple">
            <BookOpen className="text-magical-purple w-6 h-6" />
          </div>
          <span className="font-display font-bold text-2xl text-magical-purple drop-shadow-sm">{APP_NAME}</span>
        </div>
        <MagicButton variant="white" onClick={() => {
          const savedProfiles = storage.getProfiles();
          if (savedProfiles.length > 0) {
            setActiveProfile(savedProfiles[0]);
            setCurrentStep('dashboard');
          } else {
            setCurrentStep('onboarding');
          }
        }}>
          Login
        </MagicButton>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center max-w-4xl mx-auto pb-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center gap-4 mb-8">
            <Character id="buddy" mood="happy" size={100} />
            <Character id="pixel" mood="happy" size={100} />
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white text-shadow-magical mb-6">
            Early Detection,<br/> Brighter Futures
          </h1>
          <p className="font-story text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed font-bold">
            Join Buddy and friends on a magical learning adventure!
            We help parents understand how their children learn best.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto justify-center">
            <MagicButton onClick={() => {
              const savedProfiles = storage.getProfiles();
              if (savedProfiles.length > 0) {
                setActiveProfile(savedProfiles[0]);
                setCurrentStep('dashboard');
              } else {
                setCurrentStep('onboarding');
              }
            }}>
              Start Adventure <ChevronRight className="ml-2 w-6 h-6" />
            </MagicButton>
          </div>
        </motion.div>
      </main>
    </div>
  );

  const renderDashboard = () => {
    if (viewMode === 'parent') {
      // PRO MODE (Parent)
      return (
         <div className="max-w-6xl mx-auto px-6 py-8">
            <header className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
               <div>
                 <h1 className="text-2xl font-bold text-gray-900">ScholarLens Dashboard</h1>
                 <p className="text-gray-500">Professional Mode</p>
               </div>
               <div className="flex items-center gap-4">
                  <div className="text-sm bg-gray-100 px-3 py-1 rounded-full">{activeProfile?.name} ({activeProfile?.age}y)</div>
                  <Button variant="outline" size="sm" onClick={() => setActiveProfile(null)}>Switch Profile</Button>
               </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                 <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider mb-2">Assessments</h3>
                 <p className="text-3xl font-bold text-gray-900">{storage.getResults(activeProfile?.id || '').length}</p>
               </div>
               <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                 <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider mb-2">Level</h3>
                 <p className="text-3xl font-bold text-gray-900">{activeProfile?.level}</p>
               </div>
               <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                 <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider mb-2">Achievements</h3>
                 <p className="text-3xl font-bold text-gray-900">{activeProfile?.achievements.length}</p>
               </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-bold text-gray-900">History</h3>
               </div>
               {storage.getResults(activeProfile?.id || '').length === 0 ? (
                 <div className="p-8 text-center text-gray-500">No data available. Switch to Kid Mode to complete assessments.</div>
               ) : (
                 <table className="w-full">
                   <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                     <tr>
                       <th className="px-6 py-3 text-left">Date</th>
                       <th className="px-6 py-3 text-left">Type</th>
                       <th className="px-6 py-3 text-left">Confidence</th>
                       <th className="px-6 py-3 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-200">
                     {storage.getResults(activeProfile?.id || '').map(res => (
                       <tr key={res.id}>
                         <td className="px-6 py-4 text-sm text-gray-900">{new Date(res.timestamp).toLocaleDateString()}</td>
                         <td className="px-6 py-4 text-sm text-gray-900 capitalize">{res.type}</td>
                         <td className="px-6 py-4 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              res.overallConfidence === 'HIGH' ? 'bg-green-100 text-green-800' :
                              res.overallConfidence === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                            }`}>{res.overallConfidence}</span>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <Button variant="outline" size="sm" onClick={() => { setLastResult(res); setCurrentStep('results'); }}>View</Button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               )}
            </div>
         </div>
      );
    }

    // KID MODE (Castle)
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-200 to-green-100 relative overflow-hidden">
        {/* Animated Background */}
        <motion.div animate={{ x: [0, 50, 0], y: [0, -20, 0] }} transition={{ duration: 15, repeat: Infinity }} className="absolute top-20 right-20 text-8xl opacity-60">☁️</motion.div>
        <motion.div animate={{ x: [0, -50, 0], y: [0, 20, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute top-40 left-10 text-8xl opacity-50">☁️</motion.div>

        {/* Castle Illustration (Abstract SVG) */}
        <div className="absolute bottom-0 left-0 right-0 h-64 opacity-80 pointer-events-none">
           <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full">
              <path fill="#86EFAC" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
           </svg>
           {/* Simple Castle Silhouette */}
           <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-9xl">🏰</div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
           <motion.div 
             initial={{ y: -50, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className="flex flex-col items-center justify-center mb-12"
           >
              <div className="flex items-end gap-4 mb-6">
                 <Character id="buddy" mood="happy" size={150} />
                 <SpeechBubble message={`Welcome back, ${activeProfile?.name}! Ready for an adventure?`} />
              </div>

              {/* Level Badge */}
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="relative w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center border-8 border-yellow-200 shadow-xl"
              >
                 <div className="text-5xl font-display font-bold text-yellow-800">{activeProfile?.level}</div>
                 <div className="absolute -bottom-4 bg-magical-purple text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">LEVEL</div>
                 {/* Rotating sparkles */}
                 <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 border-4 border-dashed border-white rounded-full"></motion.div>
              </motion.div>
           </motion.div>

           {/* Quest Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              {QUESTS.map((quest) => (
                <QuestCard 
                  key={quest.id}
                  {...quest}
                  color={quest.color as 'green' | 'purple' | 'orange' | 'yellow'}
                  stars={activeProfile?.stars[quest.id as AssessmentType] || 0}
                  onClick={() => startAssessment(quest.id as AssessmentType)}
                />
              ))}
           </div>
        </div>
      </div>
    );
  };

  const renderAssessment = () => {
    if (!selectedAssessment || !activeProfile) return null;
    const quest = QUESTS.find(q => q.id === selectedAssessment);
    const characterId = quest?.character || 'buddy';

    // Thematic Backgrounds
    const getTheme = () => {
       switch(selectedAssessment) {
          case AssessmentType.READING: return "bg-gradient-to-br from-green-50 via-teal-50 to-white"; // Forest
          case AssessmentType.WRITING: return "bg-gradient-to-br from-purple-50 via-pink-50 to-white"; // Art Studio
          case AssessmentType.MATH: return "bg-gradient-to-br from-orange-50 via-yellow-50 to-white"; // Mountain
          case AssessmentType.ATTENTION: return "bg-gradient-to-br from-blue-50 via-sky-50 to-white"; // Falls
          default: return "bg-white";
       }
    };

    const getTextForReading = () => {
      const g = activeProfile.grade;
      if (g === 'K' || g === '1') return SAMPLE_TEXTS["K-1"];
      if (g === '2' || g === '3') return SAMPLE_TEXTS["2-3"];
      return SAMPLE_TEXTS["4-6"];
    };

    const getMathProblem = () => {
      const g = activeProfile.grade;
      if (g === 'K' || g === '1') return MATH_PROBLEMS["K-1"];
      if (g === '2' || g === '3') return MATH_PROBLEMS["2-3"];
      return MATH_PROBLEMS["4-6"];
    };

    return (
      <div className={`min-h-screen ${getTheme()} relative overflow-hidden pb-12`}>
        {/* Thematic Header */}
        <header className="px-6 py-6 flex justify-between items-center relative z-20">
           <button onClick={() => setCurrentStep('dashboard')} className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform text-gray-500">
              <Home size={24} />
           </button>
           <h2 className="font-display text-3xl font-bold text-gray-800">{quest?.title}</h2>
           <div className="w-12 h-12" /> {/* Spacer */}
        </header>

        {/* Character Guide */}
        <motion.div 
           initial={{ x: -100, opacity: 0 }}
           animate={{ x: 0, opacity: 1 }}
           className="absolute top-24 left-6 z-10 hidden lg:block"
        >
           <div className="flex flex-col items-center">
             <Character id={characterId} mood="encouraging" size={180} />
             <SpeechBubble 
                message={selectedAssessment === AssessmentType.READING ? "Read loud and clear!" : "You've got this!"} 
                position="left" 
             />
           </div>
        </motion.div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 pt-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             {/* Content/Instructions Card */}
             <div className="bg-white rounded-[2rem] p-8 shadow-float border-4 border-white/50 relative overflow-hidden">
                {selectedAssessment === AssessmentType.READING && (
                  <div className="text-center">
                     <h3 className="font-story font-bold text-xl text-green-600 mb-6 uppercase tracking-widest">Story Time</h3>
                     <p className="font-body text-2xl leading-loose text-gray-800">{getTextForReading()}</p>
                  </div>
                )}
                
                {selectedAssessment === AssessmentType.WRITING && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                       <h3 className="font-display text-2xl text-purple-600">Your Mission</h3>
                       {writingMode === 'digital' ? (
                          <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">Digital Mode</div>
                       ) : (
                          <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Camera Mode</div>
                       )}
                    </div>
                    
                    <div className="bg-purple-50 p-6 rounded-2xl border-2 border-dashed border-purple-200 mb-8 text-center">
                       <p className="font-story text-2xl text-purple-900">"The quick brown fox jumps over the lazy dog."</p>
                    </div>

                    <div className="flex gap-2 justify-center">
                       <button 
                         onClick={() => setWritingMode('digital')}
                         className={`p-4 rounded-2xl flex-1 flex flex-col items-center gap-2 transition-all ${writingMode === 'digital' ? 'bg-purple-500 text-white shadow-lg scale-105' : 'bg-gray-100 text-gray-500'}`}
                       >
                         <Edit3 size={24} />
                         <span className="font-bold text-sm">Draw Here</span>
                       </button>
                       <button 
                         onClick={() => setWritingMode('camera')}
                         className={`p-4 rounded-2xl flex-1 flex flex-col items-center gap-2 transition-all ${writingMode === 'camera' ? 'bg-blue-500 text-white shadow-lg scale-105' : 'bg-gray-100 text-gray-500'}`}
                       >
                         <Camera size={24} />
                         <span className="font-bold text-sm">Use Camera</span>
                       </button>
                    </div>
                  </div>
                )}

                {selectedAssessment === AssessmentType.MATH && (
                  <div className="text-center">
                     <h3 className="font-display text-2xl text-orange-600 mb-8">Solve This Puzzle</h3>
                     <div className="bg-orange-50 p-8 rounded-3xl border-4 border-orange-200 mb-6">
                        <p className="font-mono text-4xl text-gray-900">{getMathProblem()}</p>
                     </div>
                     <MountainProgress current={1} total={5} />
                  </div>
                )}

                {selectedAssessment === AssessmentType.ATTENTION && (
                  <div className="relative aspect-video bg-black rounded-2xl overflow-hidden group cursor-pointer shadow-inner">
                     <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/50">
                           <div className="ml-2 w-0 h-0 border-t-[15px] border-t-transparent border-l-[30px] border-l-white border-b-[15px] border-b-transparent"></div>
                        </div>
                     </div>
                     <p className="absolute bottom-4 left-0 right-0 text-center text-white/80 font-medium">Educational Video (2 min)</p>
                  </div>
                )}
             </div>

             {/* Capture Card */}
             <div className="bg-white rounded-[2rem] p-4 shadow-float border-4 border-white/50 flex flex-col">
                {selectedAssessment === AssessmentType.WRITING && writingMode === 'digital' ? (
                   <div className="flex-1 rounded-2xl overflow-hidden border-2 border-gray-100">
                      <LiveHandwritingAnalysis onCapture={processAssessment} />
                   </div>
                ) : (
                   <div className="flex-1 rounded-2xl overflow-hidden bg-gray-900 relative">
                      <MediaCapture 
                        mode={selectedAssessment === AssessmentType.WRITING ? 'image' : 'video'}
                        maxDuration={selectedAssessment === AssessmentType.ATTENTION ? 120 : 60}
                        onCapture={processAssessment}
                        instruction={`Record ${activeProfile.name}!`}
                        allowUpload={selectedAssessment === AssessmentType.WRITING}
                      />
                      {/* Decorative Frame Elements */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl opacity-50 m-4 pointer-events-none"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl opacity-50 m-4 pointer-events-none"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl opacity-50 m-4 pointer-events-none"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl opacity-50 m-4 pointer-events-none"></div>
                   </div>
                )}
             </div>
           </div>
        </div>
      </div>
    );
  };

  // --- ROOT RENDER ---

  return (
    <>
      <DisclaimerBanner />
      <AchievementNotification achievement={showAchievement} onDismiss={() => setShowAchievement(null)} />
      
      <AnimatePresence>
        {isProcessing && <LoadingScreen />}
        {showTutorial && <Tutorial onComplete={finishTutorial} />}
        {showBrainBreak && <BrainBreak onComplete={() => setShowBrainBreak(false)} />}
      </AnimatePresence>
      
      {currentStep === 'landing' && renderLanding()}
      
      {currentStep !== 'landing' && (
         <>
           {/* Mode Toggle (Fixed Bottom Right) */}
           {currentStep === 'dashboard' && (
              <button
                onClick={() => setViewMode(viewMode === 'kid' ? 'parent' : 'kid')}
                className="fixed bottom-6 right-6 w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 border-4 border-gray-100"
                aria-label={`Switch to ${viewMode === 'kid' ? 'parent' : 'kid'} mode`}
              >
                {viewMode === 'kid' ? (
                  <Lock size={24} className="text-gray-400" />
                ) : (
                  <Sparkles size={24} className="text-magical-purple" />
                )}
              </button>
           )}

           <main>
             {currentStep === 'onboarding' && (
                <div className="max-w-xl mx-auto px-4 py-10">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Create Profile</h2>
                  <form onSubmit={handleCreateProfile} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Child's Name</label>
                      <input required name="name" type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. Alex" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                        <select name="age" className="w-full px-4 py-2 border rounded-lg">
                          {Array.from({ length: AGE_RANGES.max - AGE_RANGES.min + 1 }, (_, i) => AGE_RANGES.min + i).map(age => (
                            <option key={age} value={age}>{age}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                        <select name="grade" className="w-full px-4 py-2 border rounded-lg">{['K', '1', '2', '3', '4', '5', '6'].map(g => <option key={g} value={g}>{g}</option>)}</select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                      <select name="language" className="w-full px-4 py-2 border rounded-lg"><option value="English">English</option><option value="Spanish">Spanish</option></select>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg text-sm text-yellow-800">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" required className="mt-1" />
                        <span>I acknowledge this is a screening tool only, NOT a diagnosis.</span>
                      </label>
                    </div>
                    <Button type="submit" className="w-full">Start Adventure</Button>
                  </form>
                </div>
             )}
             {currentStep === 'dashboard' && renderDashboard()}
             {currentStep === 'assessment' && renderAssessment()}
           </main>
           
           <AnimatePresence>
             {currentStep === 'results' && lastResult && (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm"
               >
                 <div className="max-w-2xl w-full my-8">
                   <ResultCard result={lastResult} onDismiss={() => setCurrentStep('dashboard')} />
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
         </>
      )}
    </>
  );
}

export default App;
