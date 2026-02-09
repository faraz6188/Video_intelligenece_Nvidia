
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { RichText } from './RichText';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  isReady: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  onSendMessage, 
  isLoading, 
  isReady 
}) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !isReady) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
      <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-widest">Active Intelligence Session</h3>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
            <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p className="text-sm">Inquire about temporal events,<br/>object counts, or slide details.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[90%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-green-500 text-black rounded-tr-none shadow-lg font-medium' 
                  : 'bg-zinc-800 text-zinc-100 rounded-tl-none border border-zinc-700'
              }`}>
              <RichText text={msg.content} />
            </div>
            <span className="text-[10px] mt-1 text-zinc-500 font-mono px-1">
              {msg.role === 'user' ? 'USER_ID_01' : 'INTEL_AGENT'} • {msg.timestamp.toLocaleTimeString([], { hour12: false, minute: '2-digit' })}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="flex flex-col items-start">
            <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl rounded-tl-none p-4 flex gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-zinc-950 border-t border-zinc-800">
        <div className="relative flex items-center">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!isReady || isLoading}
            placeholder={isReady ? "Ask about any moment in the video..." : "Analyzing..."}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-3 pr-12 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-green-500/50 transition-all disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading || !isReady}
            className="absolute right-2 p-2 text-zinc-400 hover:text-green-500 transition-colors disabled:opacity-0"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};
