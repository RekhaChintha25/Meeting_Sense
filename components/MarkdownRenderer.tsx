
import React from 'react';
import { copyToClipboard } from '../utils/helpers';

interface MarkdownRendererProps {
  report: {
    transcript: string;
    summary: string;
    actionItems: any[];
    followUpEmail: string;
  };
}

/**
 * A robust text formatter that handles **bolding** and basic paragraphing
 * without showing the asterisks.
 */
const SmartText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  if (!text) return null;

  // Handle paragraphs first
  const paragraphs = text.split('\n\n');

  const parseBold = (input: string) => {
    const parts = input.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-extrabold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className={className}>
      {paragraphs.map((para, idx) => (
        <p key={idx} className="mb-3 last:mb-0">
          {parseBold(para)}
        </p>
      ))}
    </div>
  );
};

/** If transcript is JSON like {"text": "..."}, return just the text; otherwise return as-is. */
function getDisplayTranscript(transcript: string): string {
  if (!transcript || typeof transcript !== 'string') return transcript || '';
  const trimmed = transcript.trim();
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed.text === 'string') return parsed.text.trim();
    } catch {
      // not valid JSON, show as-is
    }
  }
  return transcript;
}

export default function MarkdownRenderer({ report }: MarkdownRendererProps) {
  const displayTranscript = getDisplayTranscript(report.transcript);

  const handleCopyEmail = () => {
    copyToClipboard(report.followUpEmail).then(() => alert('Draft copied to clipboard!'));
  };

  const handleCopyTranscript = () => {
    copyToClipboard(displayTranscript).then(() => alert('Full transcript copied!'));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start animate-in fade-in slide-in-from-bottom-8 duration-1000">

      {/* Left Column: Intelligence (Summary, Action Items, Email) */}
      <div className="lg:col-span-8 space-y-12">

        {/* Executive Summary Card */}
        <section className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 transition-transform group-hover:scale-105 duration-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-1">Primary Analysis</p>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Executive Summary</h3>
              </div>
            </div>

            <div className="max-w-none">
              <SmartText
                text={report.summary}
                className="text-sm md:text-base leading-relaxed text-slate-600 font-medium"
              />
            </div>
          </div>

          {/* Decorative element */}
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-indigo-50 rounded-full blur-[80px] opacity-50"></div>
        </section>

        {/* Action Items List */}
        <section className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Action Items</h3>
            </div>
            <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {report.actionItems.length} Identified
            </span>
          </div>

          <div className="grid gap-3">
            {report.actionItems.length > 0 ? (
              report.actionItems.map((item, i) => (
                <div key={i} className="group flex flex-col md:flex-row md:items-center justify-between p-4 md:p-5 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-white hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50/50 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-3 md:mb-0">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${item.priority === 'High' ? 'bg-red-100 text-red-600' :
                      item.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'
                      }`}>
                      {item.priority[0]}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm md:text-base group-hover:text-indigo-600 transition-colors">
                        <SmartText text={item.task} />
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-slate-100">Owner: {item.owner}</span>
                        {item.deadline && <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Due: {item.deadline}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 border-2 border-dashed border-slate-100 rounded-xl text-center">
                <p className="text-sm text-slate-400 font-bold">No actionable items were identified.</p>
              </div>
            )}
          </div>
        </section>

        {/* Email Draft Section */}
        <section className="bg-slate-900 rounded-[3.5rem] p-12 md:p-16 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-16 text-white/5 pointer-events-none group-hover:text-white/10 transition-colors duration-700">
            <svg className="w-72 h-72" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center text-white backdrop-blur-xl border border-white/10">
                <svg className="w-8 h-8 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-3xl font-black text-white tracking-tight">Executive Follow-up</h3>
            </div>
            <button
              onClick={handleCopyEmail}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-900/40 active:scale-95"
            >
              Copy Content
            </button>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-10 font-mono text-sm leading-relaxed text-slate-300 whitespace-pre-wrap max-h-[500px] overflow-y-auto relative z-10 custom-scrollbar">
            <SmartText text={report.followUpEmail} />
          </div>
        </section>
      </div>

      {/* Right Column: High-Density Reference Sidebar */}
      <div className="lg:col-span-4 sticky top-28">
        <section className="bg-white rounded-[3.5rem] p-10 border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col h-[calc(100vh-140px)]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Transcript</h3>
            <button
              onClick={handleCopyTranscript}
              className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-indigo-600 transition-colors"
              title="Copy raw transcript"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-4 space-y-8 custom-scrollbar text-slate-800">
            {displayTranscript.split('\n').map((line, i) => {
              if (!line.trim()) return null;

              const isSpeaker = line.includes(':');
              return (
                <div key={i} className={`text-sm leading-relaxed ${isSpeaker ? 'text-slate-800' : 'text-slate-600 pl-4 border-l-2 border-slate-200'}`}>
                  <SmartText text={line} />
                </div>
              );
            })}
          </div>

          <div className="mt-10 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              Intelligent Reference Sync
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
