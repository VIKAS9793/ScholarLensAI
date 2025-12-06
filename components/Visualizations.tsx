import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { AssessmentResult } from '../types';

interface SkillsRadarProps {
  result: AssessmentResult;
}

// H0-8: Skill descriptions for tooltips
const skillDescriptions: Record<string, string> = {
  'Fluency': 'Speed and smoothness of reading, writing, or processing',
  'Comprehension': 'Understanding and interpretation of content',
  'Focus': 'Ability to maintain attention and concentration',
  'Motor Skills': 'Fine motor control and physical coordination',
  'Confidence': 'Self-assurance and willingness to attempt tasks',
};

export const SkillsRadar: React.FC<SkillsRadarProps> = ({ result }) => {
  if (!result.skillDimensions) return null;

  const data = [
    { subject: 'Fluency', A: result.skillDimensions.fluency, fullMark: 100, description: skillDescriptions['Fluency'] },
    { subject: 'Comprehension', A: result.skillDimensions.comprehension, fullMark: 100, description: skillDescriptions['Comprehension'] },
    { subject: 'Focus', A: result.skillDimensions.focus, fullMark: 100, description: skillDescriptions['Focus'] },
    { subject: 'Motor Skills', A: result.skillDimensions.motorSkills, fullMark: 100, description: skillDescriptions['Motor Skills'] },
    { subject: 'Confidence', A: result.skillDimensions.confidence, fullMark: 100, description: skillDescriptions['Confidence'] },
  ];

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100 max-w-xs">
          <p className="font-bold text-gray-900">{item.subject}: {item.A}/100</p>
          <p className="text-xs text-gray-600 mt-1">{item.description}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <h4 className="text-center font-semibold text-gray-700 mb-2">Skill Dimensions Profile</h4>

      {/* H0-8: Legend explaining the axis */}
      <div className="flex justify-center gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-primary-500"></div>
          <span className="text-gray-600">Child's Score (0-100)</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full border-2 border-gray-300"></div>
          <span className="text-gray-600">Age-Appropriate Benchmark</span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#E5E7EB" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#4B5563', fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#9CA3AF', fontSize: 10 }}
              tickCount={5}
            />
            <Radar
              name="Child Score"
              dataKey="A"
              stroke="#6366F1"
              strokeWidth={2}
              fill="#6366F1"
              fillOpacity={0.4}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={(value: string) => <span className="text-sm text-gray-700">{value}</span>}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* H0-8: Scoring guide */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-center">
        <div className="p-2 bg-semantic-success-light rounded-lg">
          <span className="font-bold text-semantic-success-dark">70-100</span>
          <p className="text-gray-600">Strong</p>
        </div>
        <div className="p-2 bg-semantic-warning-light rounded-lg">
          <span className="font-bold text-semantic-warning-dark">40-69</span>
          <p className="text-gray-600">Developing</p>
        </div>
        <div className="p-2 bg-semantic-error-light rounded-lg">
          <span className="font-bold text-semantic-error-dark">0-39</span>
          <p className="text-gray-600">Needs Support</p>
        </div>
      </div>

      <p className="text-xs text-center text-gray-500 mt-3 italic">
        Scores are relative to age-appropriate norms observed by AI. Hover over each axis for details.
      </p>
    </div>
  );
};

