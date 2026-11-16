import React, { useState } from 'react';

const AUTH_KEY = 'meetingsense_authenticated';

export function getLoginRequired(): boolean {
  const password = import.meta.env.VITE_LOGIN_PASSWORD;
  return typeof password === 'string' && password.length > 0;
}

export function isAuthenticated(): boolean {
  try {
    return sessionStorage.getItem(AUTH_KEY) === '1';
  } catch {
    return false;
  }
}

export function setAuthenticated(): void {
  try {
    sessionStorage.setItem(AUTH_KEY, '1');
  } catch {
    // ignore
  }
}

export function clearAuthenticated(): void {
  try {
    sessionStorage.removeItem(AUTH_KEY);
  } catch {
    // ignore
  }
}

interface LoginProps {
  onSuccess: () => void;
}

export default function Login({ onSuccess }: LoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const expectedPassword = import.meta.env.VITE_LOGIN_PASSWORD || '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!password.trim()) {
      setError('Please enter the password.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (password === expectedPassword) {
        setAuthenticated();
        onSuccess();
      } else {
        setError('Incorrect password. Please try again.');
        setLoading(false);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 mb-6">
            <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">MeetingSense</h1>
          <p className="text-sm font-semibold text-indigo-500 uppercase tracking-widest mt-1">AI Intelligence</p>
          <p className="text-slate-500 text-sm mt-6">Sign in to access the meeting assistant</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
          <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter access password"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            autoFocus
            autoComplete="current-password"
            disabled={loading}
          />
          {error && (
            <p className="mt-3 text-sm text-red-600 font-medium">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold rounded-xl transition-colors shadow-md"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-slate-400 text-xs mt-8">
          Contact your admin if you don’t have access.
        </p>
      </div>
    </div>
  );
}
