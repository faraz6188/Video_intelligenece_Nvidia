import React from 'react';
import { RichText } from './RichText';

interface SummarySectionProps {
  summary: string | null;
}

export const SummarySection: React.FC<SummarySectionProps> = ({ summary }) => {
  if (!summary) return null;

  const cleanText = (text: string) => {
    return text
      // Aggressively remove headers like "1. SUMMARY:", "Summary:", "Narrative:", etc.
      .replace(/^(?:\d+\.|\*|-)?\s*(?:SUMMARY|Summary|NARRATIVE|Narrative|ANALYSIS|Analysis|PROTOCOL|INTEL)[:\s]*/gi, '')
      .replace(/```json[\s\S]*?```/gi, '')
      .replace(/```[\s\S]*?```/gi, '')
      .replace(/\{[\s\S]*?\}/g, '')
      .replace(/\[DETECTIONS\][\s\S]*?\[\/DETECTIONS\]/gi, '')
      .split('\n')
      .map(line => line.trim())
      .filter(l => l.length > 0 && !l.startsWith('{') && !l.startsWith('}') && !l.startsWith('"'))
      .slice(0, 5) 
      .join(' ');
  };

  const mainSummary = cleanText(summary);

  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="px-6 py-5 border-b border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-900/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center border border-green-500/20 shadow-inner">
            <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-black text-zinc-100 uppercase tracking-[0.3em]">Autonomous Intelligence Narrative</h2>
            <p className="text-[11px] text-zinc-500 font-mono mt-1">PIPELINE: GEMINI_3_FLASH_V2</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3 px-5 py-2 bg-zinc-950 rounded-xl border border-zinc-800 shadow-inner">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-mono text-zinc-400 font-black tracking-widest uppercase">Secured</span>
        </div>
      </div>

      <div className="p-8">
        <div className="relative p-7 bg-zinc-950/60 rounded-3xl border border-zinc-800/60 backdrop-blur-2xl shadow-inner group transition-all duration-500 hover:border-zinc-700/80">
          <div className="absolute -left-px top-12 bottom-12 w-[4px] bg-green-500/60 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.6)]" />
          <RichText 
            text={mainSummary || "Synchronizing intelligence data..."} 
            className="text-[18px] text-zinc-200 leading-[1.8] font-medium tracking-tight" 
          />
        </div>

        <div className="mt-8 pt-7 border-t border-zinc-800/40 flex items-center justify-between">
          <div className="flex gap-10">
            <div className="flex items-center gap-3 cursor-default group">
              <div className="w-3.5 h-3.5 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-transform group-hover:scale-125" />
              <span className="text-[11px] text-zinc-400 font-black uppercase tracking-[0.25em]">Optimal Performance</span>
            </div>
            <div className="flex items-center gap-3 cursor-default group">
              <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.7)] transition-transform group-hover:scale-125" />
              <span className="text-[11px] text-zinc-400 font-black uppercase tracking-[0.25em]">Anomaly Logic</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-4 w-[1px] bg-zinc-800" />
            <span className="text-[10px] text-zinc-600 font-mono font-black uppercase tracking-widest">ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
          </div>
        </div>
      </div>
    </section>
  );
};