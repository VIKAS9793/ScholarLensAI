import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-semantic-error-light border-l-4 border-semantic-error p-4 sticky top-0 z-50 shadow-md" role="alert" aria-live="polite">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-6 w-6 text-semantic-error" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-semantic-error-dark font-medium">
            <strong className="font-bold">⚠️ SCREENING TOOL ONLY:</strong> ScholarLens AI does <strong>NOT</strong> diagnose medical conditions, learning disabilities, or developmental disorders.
            All results <strong>MUST</strong> be reviewed by qualified healthcare professionals (pediatricians, occupational therapists, or educational psychologists).
          </p>
        </div>
      </div>
    </div>
  );
};