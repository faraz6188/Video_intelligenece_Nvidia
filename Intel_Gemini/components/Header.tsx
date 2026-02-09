
import React from 'react';

interface HeaderProps {
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 7L9 19L3.5 13.5L4.91 12.09L9 16.17L19.59 5.59L21 7Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">
              Video<span className="text-green-500">Intell</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">NVIDIA Blueprint Simulation</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <button 
            onClick={onReset}
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset Session
          </button>
          <div className="h-4 w-[1px] bg-zinc-800" />
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-mono text-zinc-400">AI Chat</span>
          </div>
        </nav>
      </div>
    </header>
  );
};
