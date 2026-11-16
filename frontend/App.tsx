
import React, { useState } from 'react';
import Header from './components/Header.tsx';
import FileUploader from './components/FileUploader.tsx';
import StatusIndicator from './components/StatusIndicator.tsx';
import MarkdownRenderer from './components/MarkdownRenderer.tsx';
import { AnalysisStatus } from '../shared/types';
import { processMeetingAudio, MeetingReport } from '../backend/services/geminiService';
import { fileToBase64 } from '../shared/utils/helpers';

export default function App() {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [currentPhase, setCurrentPhase] = useState<'transcribing' | 'analyzing' | null>(null);
  const [progressMessage, setProgressMessage] = useState('');
  const [report, setReport] = useState<MeetingReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');

  const handleFileSelect = async (file: File) => {
    try {
      setError(null);
      setReport(null);
      setFileName(file.name);
      setStatus(AnalysisStatus.UPLOADING);
      setProgressMessage('Initializing Executive Pipeline...');

      const base64 = await fileToBase64(file);
      setStatus(AnalysisStatus.ANALYZING);
      
      const result = await processMeetingAudio(
        base64,
        file.type || 'audio/mpeg',
        (phase, msg) => {
          setCurrentPhase(phase);
          setProgressMessage(msg);
        }
      );

      setReport(result);
      setStatus(AnalysisStatus.COMPLETED);
    } catch (err: any) {
      setError(err.message || 'The AI pipeline encountered a high-level error.');
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const reset = () => {
    setReport(null);
    setError(null);
    setStatus(AnalysisStatus.IDLE);
    setFileName('');
  };

  return (
    <div className="min-h-screen bg-[#FDFDFE] text-slate-900 font-sans flex flex-col selection:bg-indigo-100 selection:text-indigo-700">
      <Header />
      
      <main className="max-w-[1100px] mx-auto px-6 py-4 flex-1 w-full">
        {status === AnalysisStatus.IDLE && (
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 py-12">
            <div className="text-center mb-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50/50 text-indigo-600 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border border-indigo-100/50 mb-1">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                Intelligence Reimagined
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-2">
                Unlock the value of <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-700">every conversation.</span>
              </h1>
              
              <p className="text-base text-slate-500 max-w-lg mx-auto font-medium leading-relaxed tracking-tight px-4">
                Experience executive-grade meeting intelligence. <br className="hidden md:block"/>
                Extract the signal from the noise with Gemini 3.
              </p>
            </div>
            
            <div className="max-w-xl mx-auto mb-10">
              <FileUploader onFileSelect={handleFileSelect} disabled={false} />
            </div>

            <div className="flex flex-col items-center gap-3 pt-2 opacity-30">
               <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-slate-400">Enterprise AI Protocol v3.0</span>
               <div className="flex items-center gap-4">
                  <div className="h-px w-8 bg-slate-200"></div>
                  <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                  <div className="h-px w-8 bg-slate-200"></div>
               </div>
            </div>
          </div>
        )}

        {(status !== AnalysisStatus.IDLE && status !== AnalysisStatus.COMPLETED && status !== AnalysisStatus.ERROR) && (
          <div className="py-16">
            <StatusIndicator status={status} progressMessage={progressMessage} />
            {currentPhase && (
              <div className="max-w-sm mx-auto mt-10">
                 <div className="flex justify-between text-[8px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2 px-1">
                  <span>{currentPhase === 'transcribing' ? 'Processing' : 'Analyzing'}</span>
                  <span>Neural Engine</span>
                 </div>
                 <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                   <div className={`h-full bg-indigo-600 rounded-full transition-all duration-1000 ${currentPhase === 'transcribing' ? 'w-1/2' : 'w-full'}`}></div>
                 </div>
              </div>
            )}
          </div>
        )}

        {status === AnalysisStatus.ERROR && (
          <div className="max-w-lg mx-auto py-16 text-center space-y-6">
             <div className="w-20 h-20 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
             </div>
             <div className="space-y-1">
                <h3 className="text-2xl font-bold tracking-tight">System Incident</h3>
                <p className="text-base text-slate-500 font-medium px-4">{error}</p>
             </div>
             <button onClick={reset} className="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm hover:bg-indigo-600 transition-all active:scale-95">
               Reset Pipeline
             </button>
          </div>
        )}

        {status === AnalysisStatus.COMPLETED && report && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 border-b border-slate-100 pb-6 gap-4">
              <div className="space-y-2">
                <button onClick={reset} className="group flex items-center gap-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-all">
                  <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  New Analysis
                </button>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Intelligence Report</h2>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-700 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    {fileName}
                  </span>
                  <div className="h-4 w-px bg-slate-200"></div>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[8px] font-bold uppercase tracking-widest border border-indigo-100">
                    Gemini 3 Pro Augmented
                  </span>
                </div>
              </div>
            </div>
            
            <MarkdownRenderer report={report} />
          </div>
        )}
      </main>
    </div>
  );
}
