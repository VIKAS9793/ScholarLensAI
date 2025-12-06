import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 sticky top-0 z-50 shadow-md">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            <strong>SCREENING TOOL ONLY:</strong> ScholarLens AI does not diagnose medical conditions. 
            Results should always be reviewed by qualified professionals.
          </p>
        </div>
      </div>
    </div>
  );
};