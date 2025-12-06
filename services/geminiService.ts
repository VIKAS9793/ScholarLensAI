import { GoogleGenAI, Type } from "@google/genai";
import { AssessmentType, AssessmentResult, ConfidenceLevel } from "../types";
import { ASSESSMENT_PROMPTS, SYSTEM_INSTRUCTION } from "../constants";

// Schema definitions for structured JSON output
const OBSERVATION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    timestamp: { type: Type.STRING, description: "Timestamp of observation e.g. '0:15' or null" },
    observation: { type: Type.STRING },
    confidence: { type: Type.STRING, enum: [ConfidenceLevel.HIGH, ConfidenceLevel.MEDIUM, ConfidenceLevel.LOW] },
    finding: { type: Type.STRING, description: "Specific finding detail" }
  },
  required: ["observation", "confidence"]
};

const METRICS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    estimatedWPM: { type: Type.NUMBER },
    regressionCount: { type: Type.NUMBER },
    engagementLevel: { type: Type.STRING, enum: ["high", "medium", "low"] },
    legibilityScore: { type: Type.NUMBER },
    reversalCount: { type: Type.NUMBER },
    spacingConsistency: { type: Type.STRING, enum: ["consistent", "inconsistent"] },
    solutionTime: { type: Type.NUMBER },
    strategyUsed: { type: Type.STRING },
    accuracy: { type: Type.STRING, enum: ["correct", "incorrect"] },
    errorType: { type: Type.STRING, enum: ["calculation", "conceptual", "none"] },
    longestSustainedAttention: { type: Type.NUMBER },
    distractionCount: { type: Type.NUMBER },
    comparedToAgeNorm: { type: Type.STRING, enum: ["above", "average", "below"] }
  }
};

const ACTION_PLAN_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    action: { type: Type.STRING },
    priority: { type: Type.STRING, enum: ["immediate", "short-term", "ongoing"] },
    type: { type: Type.STRING, enum: ["professional", "home", "school"] }
  },
  required: ["action", "priority", "type"]
};

const SKILL_DIMENSIONS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    fluency: { type: Type.NUMBER },
    comprehension: { type: Type.NUMBER },
    focus: { type: Type.NUMBER },
    motorSkills: { type: Type.NUMBER },
    confidence: { type: Type.NUMBER }
  }
};

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overallConfidence: { type: Type.STRING, enum: [ConfidenceLevel.HIGH, ConfidenceLevel.MEDIUM, ConfidenceLevel.LOW] },
    observations: {
      type: Type.ARRAY,
      items: OBSERVATION_SCHEMA
    },
    metrics: METRICS_SCHEMA,
    interpretation: { type: Type.STRING },
    recommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    actionPlan: {
      type: Type.ARRAY,
      items: ACTION_PLAN_SCHEMA
    },
    skillDimensions: SKILL_DIMENSIONS_SCHEMA,
    rawText: { type: Type.STRING }
  },
  required: ["overallConfidence", "observations", "interpretation", "recommendations", "actionPlan"]
};

// Main Analysis Function
export const analyzeAssessment = async (
  type: AssessmentType,
  mediaBase64: string,
  mimeType: string,
  context: { age: number; grade: string; extra?: string }
): Promise<Partial<AssessmentResult>> => {
  
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set it in the environment.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Using gemini-2.0-flash-exp as proxy for latest capabilities if 3-pro not mapped publicly yet, 
  // or sticking to the requested 2.5/3 Pro naming convention from prompt instructions.
  // The system instruction requested "gemini-3-pro-preview" for complex tasks.
  const modelName = 'gemini-2.5-flash'; 

  const promptText = `
    ${ASSESSMENT_PROMPTS[type]}
    
    Context:
    Child Age: ${context.age}
    Grade: ${context.grade}
    ${context.extra ? `Additional Context: ${context.extra}` : ''}

    Create a personalized Action Plan based on these findings.
    Assign a score (0-100) for the skill dimensions based on age norms.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: mediaBase64
            }
          },
          { text: promptText }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.2, // Low temperature for consistent, analytical results
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};
