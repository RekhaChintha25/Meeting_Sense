
import React from 'react';

interface HeaderProps {
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="glass border-b border-slate-200/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 transition-transform group-hover:scale-110">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">MeetingSense</span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">AI Intelligence</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-8 text-base font-semibold text-slate-500">
            <a href="#" className="hover:text-indigo-600 transition-colors">Overview</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Insights</a>
            <a href="#" className="text-indigo-600">Assistant</a>
          </nav>
          <div className="h-8 w-[1px] bg-slate-200 hidden md:block" />
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-2 text-slate-500 hover:text-slate-700 text-sm font-semibold"
            >
              Log out
            </button>
          )}
          <button className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95">
            Upgrade Pro
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
