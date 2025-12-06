import { AssessmentType, CharacterId } from "./types";

export const APP_NAME = "ScholarLens AI";

export const DISCLAIMER_TEXT = `
⚠️ IMPORTANT NOTICE
ScholarLens AI observes how children engage with learning activities.
This is NOT a test, assessment, or diagnostic tool.
Always consult qualified professionals for evaluations.
`;

export const AGE_RANGES = {
  min: 5,
  max: 12
};

export const LANGUAGES = [
  "English", "Spanish", "Mandarin", "Hindi", "French",
  "Arabic", "Portuguese", "Bengali", "Russian", "Japanese"
];

export const ACHIEVEMENTS = [
  { id: 'first_step', title: 'First Step', description: 'Complete your first adventure', icon: '🚀' },
  { id: 'reading_star', title: 'Reading Star', description: 'Read a story with Buddy', icon: '📖' },
  { id: 'math_whiz', title: 'Math Whiz', description: 'Solve puzzles with Pixel', icon: '🧮' },
  { id: 'focus_master', title: 'Focus Master', description: 'Stay focused with Sunny', icon: '🧘' },
  { id: 'artist', title: 'Artist', description: 'Create art with Luna', icon: '✍️' },
  { id: 'dedicated', title: 'Dedicated', description: 'Reach Level 3', icon: '🏆' },
];

export const TUTORIAL_STEPS = [
  {
    title: "Welcome to ScholarLens AI",
    desc: "A magical learning companion that helps parents understand how their children learn best.",
    icon: "👋"
  },
  {
    title: "Meet Your Friends",
    desc: "Buddy, Luna, Pixel, and Sunny are here to guide you through fun activities!",
    icon: "🦉"
  },
  {
    title: "Private & Safe",
    desc: "We analyze learning patterns on your device. Videos are processed securely and never stored.",
    icon: "🔒"
  },
  {
    title: "Observations Only",
    desc: "We observe engagement patterns — no tests, no labels. Share insights with educators if you'd like.",
    icon: "💡"
  }
];

export const CHARACTERS: Record<CharacterId, { name: string, role: string, color: string, icon: string }> = {
  buddy: { name: "Buddy", role: "Reading Guide", color: "blue", icon: "🦉" },
  luna: { name: "Luna", role: "Writing Coach", color: "purple", icon: "🐱" },
  pixel: { name: "Pixel", role: "Math Adventurer", color: "green", icon: "🐲" },
  sunny: { name: "Sunny", role: "Focus Friend", color: "orange", icon: "🦊" }
};

export const QUESTS = [
  {
    id: AssessmentType.READING,
    title: "Reading Forest",
    character: 'buddy' as CharacterId,
    description: "Join Buddy to read magical stories!",
    icon: "📚",
    color: "green"
  },
  {
    id: AssessmentType.WRITING,
    title: "Luna's Art Studio",
    character: 'luna' as CharacterId,
    description: "Help Luna create beautiful letters!",
    icon: "✍️",
    color: "purple"
  },
  {
    id: AssessmentType.MATH,
    title: "Pixel's Mountain",
    character: 'pixel' as CharacterId,
    description: "Climb the mountain with math puzzles!",
    icon: "🧮",
    color: "orange"
  },
  {
    id: AssessmentType.ATTENTION,
    title: "Focus Falls",
    character: 'sunny' as CharacterId,
    description: "Race with Sunny to stay focused!",
    icon: "🎯",
    color: "yellow"
  }
];

// System Instruction for Gemini - CRITICAL SAFETY & ETHICS GUARDRAILS
export const SYSTEM_INSTRUCTION = `
You are ScholarLens AI, an educational observation assistant that helps parents and educators understand how children engage with learning activities.

🚨 CRITICAL ETHICAL PROTOCOLS - YOU MUST FOLLOW THESE:

1. YOU ARE NOT ASSESSING THE CHILD'S ABILITY OR INTELLIGENCE
   - Never say a child "can't" or "failed" at something
   - Never compare children to "normal" or "average"
   - Never suggest a child has a deficit or disability
   - You observe ENGAGEMENT PATTERNS, not ability

2. ANTI-BIAS & ANTI-LABELING REQUIREMENTS
   - Never label children (e.g., "slow learner", "struggling", "behind")
   - Never use deficit-based language
   - Always use growth-oriented, strengths-based framing
   - Acknowledge that learning varies and all patterns are valid

3. UNCERTAINTY & HUMILITY
   - Use hedging language: "may indicate", "appears to", "one observation suggests"
   - Explicitly state confidence percentages and their limitations
   - Never make definitive statements about a child's capabilities
   - Acknowledge that brief observations cannot capture a child's full potential

4. SCREENING DISCLAIMER (MANDATORY IN EVERY RESPONSE)
   - State: "This is a screening observation, NOT a diagnosis or ability assessment"
   - Always recommend professional consultation for any concerns
   - Never suggest treatment or intervention

5. EXPLAINABILITY REQUIREMENTS
   - Explain what specific behaviors led to each observation
   - Provide timestamps or specific examples when possible
   - Distinguish between observation (fact) and interpretation (inference)
   - Allow for alternative explanations (child was tired, distracted, etc.)

6. OUTPUT FORMAT
   - Provide scores for ENGAGEMENT dimensions (not ability): Focus, Engagement, Comfort, Motor Coordination, Confidence
   - Include "Alternative Explanations" section for each observation
   - Include "What This Does NOT Tell Us" section
   - Include "Consult a Professional If" section

REMEMBER: A 2-minute observation cannot and should not define a child. You are helping parents notice patterns, not judge capabilities.
`;

export const ASSESSMENT_PROMPTS: Record<AssessmentType, string> = {
  [AssessmentType.READING]: `
    Analyze this video of a child reading. Focus on:
    1. Eye Tracking: Saccades, regressions.
    2. Fluency: Est. WPM, hesitations.
    3. Engagement: Frustration, body language.
    
    Provide timestamped observations and scores (0-100) for skill dimensions: Fluency, Comprehension (implied by prosody), Focus, Motor Skills (posture), Confidence.
  `,
  [AssessmentType.WRITING]: `
    Analyze this handwriting image. Use document derendering to extract text.
    Analyze:
    1. Formation: Stroke order, reversals (b/d).
    2. Spacing: Words/letters.
    3. Size/Consistency.
    
    Provide scores (0-100) for: Fluency (flow), Comprehension (legibility), Focus (consistency), Motor Skills (fine motor), Confidence (pressure).
  `,
  [AssessmentType.MATH]: `
    Analyze this video of a child solving a math problem.
    Analyze:
    1. Strategy: Fingers, mental math, visual aids.
    2. Number Sense.
    3. Error Patterns.
    
    Provide scores (0-100) for: Fluency (speed), Comprehension (concept), Focus, Motor Skills (manipulatives use), Confidence.
  `,
  [AssessmentType.ATTENTION]: `
    Analyze this video of a child watching educational content.
    Analyze:
    1. Sustained Attention duration.
    2. Distraction frequency/triggers.
    3. Engagement markers.
    
    Provide scores (0-100) for: Fluency (processing), Comprehension (reaction), Focus (sustained), Motor Skills (stillness), Confidence.
  `
};

export const SAMPLE_TEXTS = {
  "K-1": "The cat sat on the mat. The dog ran to the cat. They are friends.",
  "2-3": "Once upon a time, there was a little bird who wanted to fly high. She flapped her wings very fast and soared into the blue sky.",
  "4-6": "Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar."
};

export const MATH_PROBLEMS = {
  "K-1": "Count these apples: 🍎 🍎 🍎 + 🍎 🍎 = ?",
  "2-3": "What is 15 + 27?",
  "4-6": "If Sarah has 3 bags with 8 cookies each, how many cookies total?"
};

// Activity Instructions for user engagement - CHILD-FRIENDLY, NON-JUDGMENTAL
export const ACTIVITY_INSTRUCTIONS: Record<AssessmentType, { title: string; steps: string[]; tip: string; parentNote: string }> = {
  [AssessmentType.READING]: {
    title: "📖 Story Time Adventure",
    steps: [
      "1️⃣ Look at the fun story on the left",
      "2️⃣ Press 'Start Camera' when you're ready",
      "3️⃣ Read the story out loud - just have fun with it!",
      "4️⃣ Press 'Done' whenever you're finished"
    ],
    tip: "💡 There's no right or wrong way to read! Just enjoy the story 📚",
    parentNote: "⚠️ This activity observes reading engagement patterns - NOT reading ability or level."
  },
  [AssessmentType.WRITING]: {
    title: "✍️ Drawing Letters Game",
    steps: [
      "1️⃣ Look at the letters above",
      "2️⃣ Use your finger to draw on the canvas - like finger painting!",
      "3️⃣ Try copying the letters - it's okay if they look different!",
      "4️⃣ Press the arrows if you want to try again"
    ],
    tip: "💡 Every artist draws differently - your letters are unique to you! 🎨",
    parentNote: "⚠️ This activity observes writing comfort patterns - NOT handwriting quality or skill."
  },
  [AssessmentType.MATH]: {
    title: "🧮 Number Puzzle Fun",
    steps: [
      "1️⃣ Look at the fun number puzzle",
      "2️⃣ Use your fingers, toys, or anything to help you think!",
      "3️⃣ Type your answer when you're ready",
      "4️⃣ It's okay to guess - this is just for fun!"
    ],
    tip: "💡 Real mathematicians make guesses too! There's no wrong answer 🌟",
    parentNote: "⚠️ This activity observes problem-solving approach - NOT math ability or intelligence."
  },
  [AssessmentType.ATTENTION]: {
    title: "🎯 Watch & Wonder",
    steps: [
      "1️⃣ Get comfy and watch the video",
      "2️⃣ Look at whatever interests you on the screen",
      "3️⃣ It's totally fine to look around or move!",
      "4️⃣ Just watch until it's done"
    ],
    tip: "💡 Everyone pays attention differently - that's what makes us unique! 🦋",
    parentNote: "⚠️ This activity observes engagement patterns - NOT attention capacity or focus ability."
  }
};

// AI Safety Guardrails for UI display
export const AI_SAFETY_MESSAGES = {
  notAnAssessment: "This is NOT an ability assessment or test. We observe how your child engages with activities.",
  noJudgment: "Every child is unique. These observations do not measure intelligence, capability, or potential.",
  limitedData: "A few minutes of activity cannot define a child. These are patterns, not conclusions.",
  professionalOnly: "Only qualified professionals can diagnose learning differences. We provide observations for discussion.",
  alternativeExplanations: "Many factors affect engagement: tiredness, hunger, mood, environment, or simply not being interested today.",
  strengthsBased: "We focus on HOW children engage, not whether they're 'good' or 'bad' at something."
};