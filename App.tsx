
import React, { useState } from 'react';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import StatusIndicator from './components/StatusIndicator';
import MarkdownRenderer from './components/MarkdownRenderer';
import { AnalysisStatus } from './types';
import { uploadMeetingAudio, MeetingReport, isBackendConfigured } from './services/backendApi';

interface AppProps {
  onLogout?: () => void;
}

export default function App({ onLogout }: AppProps) {
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
      setProgressMessage('Uploading audio...');

      if (!isBackendConfigured()) {
        throw new Error(
          'Backend not configured. Set VITE_BACKEND_URL in .env.local (e.g. http://localhost:8000) and restart the dev server.'
        );
      }

      setStatus(AnalysisStatus.ANALYZING);
      setProgressMessage('Processing with Azure OpenAI...');
      const result = await uploadMeetingAudio(file, (msg) => setProgressMessage(msg));

      setReport(result);
      setStatus(AnalysisStatus.COMPLETED);
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please try a different audio format.');
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
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans flex flex-col selection:bg-indigo-100 selection:text-indigo-700">
      <Header onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        {status === AnalysisStatus.IDLE && (
          <div className="py-6 md:py-10 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="text-center mb-6 md:mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-100 mb-4 shadow-sm">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                Intelligence Reimagined
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-3 md:mb-4 leading-tight">
                Unlock the value of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">every conversation.</span>
              </h1>
              <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto font-medium">
                Experience executive-grade meeting intelligence. Upload any recording and let Azure OpenAI extract the signal from the noise.
              </p>
            </div>

            {!isBackendConfigured() && (
              <div className="max-w-xl mx-auto mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
                Set <code className="bg-amber-100 px-1 rounded">VITE_BACKEND_URL</code> in <code className="bg-amber-100 px-1 rounded">.env.local</code> (e.g. <code className="bg-amber-100 px-1 rounded">http://localhost:8000</code>) and restart the dev server to use Azure OpenAI.
              </div>
            )}
            <div className="max-w-2xl mx-auto relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-[3.5rem] opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-1000"></div>
              <FileUploader onFileSelect={handleFileSelect} disabled={!isBackendConfigured()} />
            </div>

            <div className="mt-6 md:mt-8 flex justify-center items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Enterprise Ready Pipeline</span>
            </div>
          </div>
        )}

        {(status !== AnalysisStatus.IDLE && status !== AnalysisStatus.COMPLETED && status !== AnalysisStatus.ERROR) && (
          <div className="py-32">
            <StatusIndicator status={status} progressMessage={progressMessage} />
            {currentPhase && (
              <div className="max-w-md mx-auto mt-12">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-1">
                  <span>{currentPhase === 'transcribing' ? 'Processing Audio' : 'Done'}</span>
                  <span>{currentPhase === 'analyzing' ? 'Synthesizing' : 'Next: Analysis'}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
                  <div className={`h-full bg-indigo-600 transition-all duration-1000 shadow-[0_0_10px_rgba(79,70,229,0.5)] ${currentPhase === 'transcribing' ? 'w-1/2' : 'w-full'}`}></div>
                </div>
              </div>
            )}
          </div>
        )}

        {status === AnalysisStatus.ERROR && (
          <div className="max-w-xl mx-auto py-24 text-center animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-100">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">Processing Incident</h3>
            <p className="text-slate-500 mb-10 font-medium leading-relaxed">{error}</p>
            <button onClick={reset} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl active:scale-95">
              Try another recording
            </button>
          </div>
        )}

        {status === AnalysisStatus.COMPLETED && report && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
              <div className="space-y-4">
                <button onClick={reset} className="group flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                  <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  New Meeting
                </button>
                <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none">Intelligence Report</h2>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[11px] font-bold text-slate-600 flex items-center gap-2.5 shadow-sm">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    {fileName}
                  </span>
                  <span className="text-slate-300 mx-1">•</span>
                  <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[11px] font-bold uppercase tracking-widest border border-indigo-100">
                    Azure OpenAI
                  </span>
                </div>
              </div>
            </div>

            <MarkdownRenderer report={report} />
          </div>
        )}
      </main>

      <footer className="py-12 border-t border-slate-100 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-200 rounded-md"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">MeetingSense v2.5</span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Privacy Guaranteed • Encrypted Pipeline • Executive Grade
          </p>
        </div>
      </footer>
    </div>
  );
}
