import { AssessmentType, CharacterId } from "./types";

export const APP_NAME = "ScholarLens AI";

export const DISCLAIMER_TEXT = `
⚠️ IMPORTANT SAFETY NOTICE
ScholarLens AI is a SCREENING tool, NOT a diagnostic instrument.
This app does NOT diagnose learning disabilities.
Always consult with qualified professionals.
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
    title: "Screening Only",
    desc: "We help identify signs, but only a doctor can give a diagnosis. We're here to help you start the journey.",
    icon: "⚠️"
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

// System Instruction for Gemini
export const SYSTEM_INSTRUCTION = `
You are ScholarLens AI, an advanced screening assistant for early learning differences.
CRITICAL SAFETY PROTOCOLS:
1. You are a SCREENING tool only. NEVER diagnose.
2. Use uncertain language ("may indicate", "consistent with").
3. Assign confidence scores based on data quality.
4. Always recommend professional evaluation for concerning patterns.
5. Provide STRUCTURED output for data visualization.
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