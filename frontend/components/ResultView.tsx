
import React from 'react';

interface ResultViewProps {
  data: {
    transcript: string;
    summary: string;
    action_items: string;
    email: string;
    full_analysis: string;
  };
}

export default function ResultView({ data }: ResultViewProps) {
  return (
    <div className="space-y-12">
      {/* Executive Summary & Analysis */}
      <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Executive Analysis</h3>
        </div>
        <div className="prose prose-indigo max-w-none">
          <div className="whitespace-pre-wrap font-sans text-lg leading-relaxed text-slate-700">
            {data.full_analysis}
          </div>
        </div>
      </section>

      {/* Grid for Email and Transcription */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Email Draft */}
        <section className="bg-slate-900 rounded-[2.5rem] p-10 shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-indigo-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            Follow-up Email
          </h3>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 font-mono text-sm text-slate-300 leading-relaxed max-h-96 overflow-y-auto">
            {data.email}
          </div>
          <button className="mt-8 w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">
            Copy Email Text
          </button>
        </section>

        {/* Source Transcript */}
        <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
             <span className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </span>
            Raw Transcript
          </h3>
          <div className="flex-1 max-h-96 overflow-y-auto bg-slate-50/50 rounded-2xl p-6">
            <p className="text-sm leading-relaxed text-slate-600 font-mono italic">
              {data.transcript || "No transcript generated."}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
