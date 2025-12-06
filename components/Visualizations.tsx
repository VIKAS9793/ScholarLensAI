import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { AssessmentResult } from '../types';

interface SkillsRadarProps {
  result: AssessmentResult;
}

export const SkillsRadar: React.FC<SkillsRadarProps> = ({ result }) => {
  if (!result.skillDimensions) return null;

  const data = [
    { subject: 'Fluency', A: result.skillDimensions.fluency, fullMark: 100 },
    { subject: 'Comprehension', A: result.skillDimensions.comprehension, fullMark: 100 },
    { subject: 'Focus', A: result.skillDimensions.focus, fullMark: 100 },
    { subject: 'Motor Skills', A: result.skillDimensions.motorSkills, fullMark: 100 },
    { subject: 'Confidence', A: result.skillDimensions.confidence, fullMark: 100 },
  ];

  return (
    <div className="w-full h-64">
      <h4 className="text-center font-semibold text-gray-700 mb-2">Skill Dimensions Profile</h4>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
          <Radar
            name="Child Score"
            dataKey="A"
            stroke="#6366F1"
            strokeWidth={2}
            fill="#6366F1"
            fillOpacity={0.4}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
        </RadarChart>
      </ResponsiveContainer>
      <p className="text-xs text-center text-gray-500 mt-2 italic">
        Scores (0-100) are relative to age-appropriate norms observed by AI.
      </p>
    </div>
  );
};
