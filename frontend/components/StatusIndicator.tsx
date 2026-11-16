
import React from 'react';
import { AnalysisStatus } from '../../shared/types';

interface StatusIndicatorProps {
  status: AnalysisStatus;
  progressMessage: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, progressMessage }) => {
  if (status === AnalysisStatus.IDLE) return null;

  const steps = [
    { id: AnalysisStatus.UPLOADING, label: 'Uploading' },
    { id: AnalysisStatus.TRANSCRIBING, label: 'Transcribing' },
    { id: AnalysisStatus.ANALYZING, label: 'Analyzing Content' },
    { id: AnalysisStatus.COMPLETED, label: 'Done' }
  ];

  const getStepStatus = (stepId: AnalysisStatus) => {
    const statusIdx = steps.findIndex(s => s.id === status);
    const stepIdx = steps.findIndex(s => s.id === stepId);
    
    if (status === AnalysisStatus.ERROR) return 'error';
    if (statusIdx > stepIdx) return 'complete';
    if (statusIdx === stepIdx) return 'active';
    return 'pending';
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, idx) => {
          const s = getStepStatus(step.id);
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center relative z-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  s === 'complete' ? 'bg-green-500 text-white' :
                  s === 'active' ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                  s === 'error' ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-400'
                }`}>
                  {s === 'complete' ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm font-bold">{idx + 1}</span>
                  )}
                </div>
                <span className={`text-xs mt-2 font-medium ${
                  s === 'active' ? 'text-blue-600' : 'text-slate-400'
                }`}>
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 -mt-6 transition-all ${
                  getStepStatus(steps[idx+1].id) !== 'pending' ? 'bg-blue-600' : 'bg-slate-200'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      <div className="text-center animate-pulse">
        <p className="text-slate-600 font-medium">{progressMessage}</p>
        <p className="text-slate-400 text-xs mt-1">This may take a minute for longer meetings...</p>
      </div>
    </div>
  );
};

export default StatusIndicator;
