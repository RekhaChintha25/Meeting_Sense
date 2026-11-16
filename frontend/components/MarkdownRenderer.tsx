
import React from 'react';
import { copyToClipboard } from '../../shared/utils/helpers';

interface MarkdownRendererProps {
  report: {
    transcript: string;
    summary: string;
    actionItems: any[];
    followUpEmail: string;
  };
}

const SmartText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  if (!text) return null;
  const paragraphs = text.split('\n').filter(p => p.trim() !== '');
  return (
    <div className={className}>
      {paragraphs.map((para, idx) => {
        // Handle bullet points
        if (para.trim().startsWith('- ') || para.trim().startsWith('* ')) {
          const content = para.trim().substring(2);
          return (
            <div key={idx} className="flex gap-2.5 mb-2.5 pl-3">
              <span className="text-indigo-500 font-bold text-sm">•</span>
              <p className="text-slate-600 leading-relaxed flex-1 text-sm">
                <BoldParser text={content} />
              </p>
            </div>
          );
        }
        return (
          <p key={idx} className="mb-3 text-slate-600 leading-relaxed last:mb-0 text-sm">
            <BoldParser text={para} />
          </p>
        );
      })}
    </div>
  );
};

const BoldParser: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-semibold text-slate-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      })}
    </>
  );
};

export default function MarkdownRenderer({ report }: MarkdownRendererProps) {
  const handleCopyEmail = () => {
    copyToClipboard(report.followUpEmail).then(() => alert('Draft copied!'));
  };

  const handleCopyTranscript = () => {
    copyToClipboard(report.transcript).then(() => alert('Full transcript copied!'));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Primary Content Column */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Summary Card */}
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 group">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-[8px] font-bold uppercase tracking-widest text-indigo-500 mb-0.5">Executive Analysis</p>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Executive Summary</h3>
            </div>
          </div>
          
          <SmartText text={report.summary} className="max-w-2xl font-medium text-slate-700 leading-relaxed" />
        </section>

        {/* Action Items */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Action Items</h3>
            </div>
            <div className="bg-slate-50 text-slate-400 px-3 py-1 rounded-full text-[8px] font-bold border border-slate-100 uppercase tracking-widest">
              {report.actionItems.length} Key Deliverables
            </div>
          </div>
          
          <div className="grid gap-3">
            {report.actionItems.map((item, i) => (
              <div key={i} className="group flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-white hover:border-indigo-200 transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-[9px] shadow-sm ${
                    item.priority === 'High' ? 'bg-red-100 text-red-600' :
                    item.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'
                  }`}>
                    {item.priority[0]}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                      <BoldParser text={item.task} />
                    </h4>
                    <div className="flex items-center gap-3">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Owner: {item.owner}</p>
                      {item.deadline && <p className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest">Due: {item.deadline}</p>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Email Draft */}
        <section className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white relative group shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
               <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-md border border-white/10">
                <svg className="w-4 h-4 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
               </div>
               <h3 className="text-lg font-bold tracking-tight">Email Follow-up</h3>
            </div>
            <button 
              onClick={handleCopyEmail}
              className="px-4 py-1.5 bg-white text-slate-900 rounded-md text-[8px] font-bold uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-sm active:scale-95"
            >
              Copy Draft
            </button>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 font-mono text-[11px] leading-relaxed text-slate-300 whitespace-pre-wrap max-h-[250px] overflow-y-auto custom-scrollbar relative z-10">
            <BoldParser text={report.followUpEmail} />
          </div>
        </section>
      </div>

      {/* Sidebar: Transcript */}
      <div className="lg:col-span-4 lg:sticky lg:top-32">
        <section className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col h-[500px] lg:h-[calc(100vh-180px)]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Full Transcript</h3>
            <button 
              onClick={handleCopyTranscript}
              className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-indigo-600 transition-all"
              title="Copy Full Transcript"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar text-[11px]">
            {report.transcript.split('\n').map((line, i) => {
              if (!line.trim()) return null;
              const isSpeaker = line.includes(':');
              return (
                <div key={i} className={`leading-relaxed ${isSpeaker ? 'font-bold text-slate-900' : 'text-slate-500 pl-2.5 border-l border-slate-100'}`}>
                  <BoldParser text={line} />
                </div>
              );
            })}
          </div>
          
          <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between">
            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
              Reference Audio
            </span>
          </div>
        </section>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e2e8f0; }
      `}</style>
    </div>
  );
}
