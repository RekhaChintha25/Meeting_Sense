
import React from 'react';
import { AnalysisStatus } from '../types';

interface StatusIndicatorProps {
  status: AnalysisStatus;
  progressMessage: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, progressMessage }) => {
  if (status === AnalysisStatus.IDLE) return null;

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-indigo-500 rounded-full blur-[80px] opacity-10 animate-pulse"></div>
        <div className="relative w-40 h-40 bg-slate-900 rounded-[3rem] flex items-center justify-center shadow-[0_32px_64px_-16px_rgba(15,23,42,0.3)] animate-float">
          <div className="w-16 h-16 text-indigo-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="animate-spin-slow">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 11-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{progressMessage}</h3>
        <p className="text-slate-500 font-medium max-w-sm mx-auto">
          Our specialized audio pipeline is extracting high-fidelity metadata from your recording.
        </p>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default StatusIndicator;
