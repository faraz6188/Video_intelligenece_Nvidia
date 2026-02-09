
import React from 'react';
import { ProcessingLog } from '../types';

interface ProcessingStatusProps {
  status: string;
  logs: ProcessingLog[];
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ status, logs }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg h-[400px] flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700 overflow-hidden">
             {status !== 'ACTIVE' && status !== 'IDLE' ? (
                <div className="w-full h-full bg-green-500/10 flex items-center justify-center">
                   <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                </div>
             ) : (
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
             )}
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900 animate-pulse" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-widest">Autonomous Intelligence Agent</h2>
          <p className="text-[10px] text-zinc-500 font-mono tracking-tight">AI • PIPELINE: {status.replace('_', ' ')}</p>
        </div>
      </div>

      <div className="flex-1 bg-black/40 rounded-lg border border-zinc-800 p-4 font-mono text-xs overflow-y-auto space-y-3 custom-scrollbar">
        {logs.map(log => (
          <div key={log.id} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-zinc-600 shrink-0">[{log.timestamp.toLocaleTimeString([], { hour12: false })}]</span>
            <span className={`
              ${log.status === 'error' ? 'text-red-400 font-bold' : ''}
              ${log.status === 'success' ? 'text-green-400 font-bold' : ''}
              ${log.status === 'loading' ? 'text-blue-400 animate-pulse' : ''}
              ${log.status === 'architect' ? 'text-purple-400 font-bold italic' : ''}
              ${log.status === 'info' ? 'text-zinc-400' : ''}
            `}>
              {log.status === 'loading' && '➤ '}
              {log.status === 'success' && '✓ '}
              {log.status === 'architect' && '✧ '}
              {log.status === 'error' && '✕ '}
              {log.message}
            </span>
          </div>
        ))}
        {logs.length === 0 && <p className="text-zinc-700 italic">Starting autonomous session...</p>}
      </div>

      <div className="mt-6">
        <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-green-500 transition-all duration-1000 ease-out ${
              status === 'AUTONOMOUS_STUDY' ? 'w-1/4' : 
              status === 'ENGINEERING_PROMPT' ? 'w-1/2' : 
              status === 'DEEP_ANALYSIS' ? 'w-3/4' : 
              status === 'ACTIVE' ? 'w-full' : 'w-0'
            }`} 
          />
        </div>
      </div>
    </div>
  );
};
