
import React from 'react';

export default function Header() {
  return (
    <nav className="h-28 flex items-center justify-between px-16 bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-100/60">
      <div className="flex items-center gap-5 group cursor-pointer">
        <div className="w-14 h-14 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-indigo-200 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-black text-3xl tracking-tighter text-slate-900 leading-none">MeetingSense</span>
          <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-500 mt-1.5">Executive Intelligence</span>
        </div>
      </div>
      
      <div className="hidden lg:flex items-center gap-12">
        <div className="flex items-center gap-10 text-sm font-black uppercase tracking-widest text-slate-400">
          <a href="#" className="hover:text-indigo-600 transition-all hover:scale-105">Overview</a>
          <a href="#" className="hover:text-indigo-600 transition-all hover:scale-105">Insights</a>
          <a href="#" className="text-slate-900 border-b-4 border-indigo-600 pb-1">Assistant</a>
        </div>
        <div className="h-8 w-px bg-slate-200 mx-4"></div>
        <button className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-200 active:scale-95">
          Upgrade to Pro
        </button>
      </div>
    </nav>
  );
}
