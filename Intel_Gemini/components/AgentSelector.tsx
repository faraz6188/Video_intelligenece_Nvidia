
import React from 'react';
import { AgentType, AgentProfile } from '../types';

const AGENTS: AgentProfile[] = [
  {
    id: 'TRAFFIC',
    title: 'Traffic Camera',
    badge: 'with Object Tracking',
    description: 'Intelligent traffic monitoring. Monitor each vehicle ID and take note of traffic related events.',
    prompt: 'You are an intelligent traffic system...'
  },
  {
    id: 'KEYNOTE',
    title: 'Keynote',
    badge: 'with Audio',
    description: 'Clear dense captioning for presentations, focusing on technologies, products, and slide OCR.',
    prompt: 'Write a concise and clear dense caption for the provided presentation video...'
  },
  {
    id: 'WAREHOUSE',
    title: 'Warehouse',
    badge: 'with Object Tracking',
    description: 'Warehouse monitoring system. Identify workers, describe events, and look for safety anomalies.',
    prompt: 'You are a warehouse monitoring system. Describe the events and look for anomalies...'
  },
  {
    id: 'DRONE',
    title: 'Bridge Inspecting Drone',
    badge: '',
    description: 'Condition assessment and structural analysis. Start each description with precise timestamps.',
    prompt: 'You are a bridge inspection system. Describe the condition of the bridge...'
  },
  {
    id: 'SAFARI',
    title: 'Safari Animals',
    badge: '',
    description: 'Exotic animal enthusiast analysis. Describe animal behavior and social interactions in detail.',
    prompt: 'You are an exotic animal enthusiast. Describe the clips of the animals in detail...'
  }
];

interface AgentSelectorProps {
  selected: AgentType;
  onSelect: (type: AgentType) => void;
  disabled?: boolean;
}

export const AgentSelector: React.FC<AgentSelectorProps> = ({ selected, onSelect, disabled }) => {
  return (
    <div className="space-y-3 w-full max-w-2xl mx-auto overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
      <p className="text-zinc-400 text-sm mb-4">Select a video agent type from the examples below:</p>
      
      {AGENTS.map((agent) => (
        <button
          key={agent.id}
          disabled={disabled}
          onClick={() => onSelect(agent.id)}
          className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-start gap-4 
            ${selected === agent.id 
              ? 'bg-zinc-900 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.1)]' 
              : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <div className="w-24 h-16 bg-zinc-800 rounded-lg overflow-hidden shrink-0 border border-zinc-700">
            <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center">
              <span className="text-[10px] font-bold text-zinc-500">{agent.id}</span>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-zinc-100 text-sm">{agent.title}</h4>
              {agent.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded-sm border border-blue-500/20 uppercase tracking-tight">
                  {agent.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
              {agent.description}
            </p>
          </div>
          
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
            ${selected === agent.id ? 'border-green-500' : 'border-zinc-700'}
          `}>
            {selected === agent.id && <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />}
          </div>
        </button>
      ))}
      
      <button
        onClick={() => onSelect('AUTO')}
        disabled={disabled}
        className={`w-full p-3 rounded-xl border-2 border-dashed transition-all
          ${selected === 'AUTO' ? 'bg-green-500/5 border-green-500/50 text-green-500' : 'bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700'}
        `}
      >
        <span className="text-xs font-bold uppercase tracking-widest">Automatic Detection (AI Powered)</span>
      </button>
    </div>
  );
};
