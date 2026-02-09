import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Detection } from '../types';

interface VideoPlayerProps {
  file: File | null;
  detections: Detection[];
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ file, detections }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const videoUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  // Sync detections with sub-second precision
  const activeDetections = useMemo(() => {
    return detections.filter(d => Math.abs(d.timestamp - currentTime) < 0.5);
  }, [detections, currentTime]);

  const uniqueLabels = useMemo(() => {
    return new Set(detections.map(d => d.label.toLowerCase())).size;
  }, [detections]);

  const getSentimentColor = (label: string, sentiment: 'good' | 'bad') => {
    if (sentiment === 'bad') return 'rgb(239, 68, 68)'; // Alert Red
    
    const l = label.toLowerCase();
    if (l.includes('car') || l.includes('vehicle')) return 'rgb(56, 189, 248)'; // Sky Blue
    if (l.includes('person') || l.includes('man') || l.includes('woman')) return 'rgb(168, 85, 247)'; // Purple
    return 'rgb(34, 197, 94)'; // Emerald Green
  };

  if (!videoUrl) return null;

  return (
    <div className="relative aspect-video bg-black overflow-hidden group rounded-xl shadow-[0_0_80px_rgba(0,0,0,0.9)] border border-white/5">
      <style>{`
        @keyframes float-tag {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(-8px); opacity: 0.85; }
        }
        @keyframes glow-bad {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(239,68,68,0.5)); }
          50% { filter: drop-shadow(0 0 25px rgba(239,68,68,0.9)); }
        }
        .animate-float-tag { animation: float-tag 1.5s infinite ease-in-out; }
        .animate-glow-bad { animation: glow-bad 0.8s infinite ease-in-out; }
      `}</style>

      <video 
        ref={videoRef}
        src={videoUrl} 
        className="w-full h-full object-contain"
        controls
        autoPlay={false}
      />
      
      {/* 
          SPATIAL INTELLIGENCE TAGS
          Floating labels without boxes for a clean, professional overlay.
      */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          {activeDetections.map((d) => {
            const [ymin, xmin] = d.box;
            const isBad = d.sentiment === 'bad';
            const color = getSentimentColor(d.label, d.sentiment);
            
            return (
              <g key={d.id} className={`animate-in fade-in zoom-in duration-300 animate-float-tag ${isBad ? 'animate-glow-bad' : ''}`}>
                {/* Floating Shadow/Backdrop for tag readability */}
                <rect
                  x={xmin}
                  y={ymin - 60}
                  width={Math.min(500, (d.label.length * 28) + (isBad ? 120 : 60))}
                  height="60"
                  fill="rgba(0,0,0,0.8)"
                  className="rounded-sm"
                />
                {/* Sentiment Indicator Bar */}
                <rect
                  x={xmin}
                  y={ymin - 60}
                  width="8"
                  height="60"
                  fill={color}
                />
                {/* Label Text */}
                <text
                  x={xmin + 20}
                  y={ymin - 16}
                  fill={color}
                  fontSize="42"
                  fontWeight="900"
                  className="uppercase font-mono tracking-tighter"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                >
                  {isBad ? '⚠️ ' : ''}{d.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Analytics Status Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500 z-20">
        <div className="flex items-center gap-3 px-6 py-3.5 bg-black/90 backdrop-blur-3xl rounded-full border border-white/20 shadow-2xl">
          <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse shadow-[0_0_20px_rgba(34,197,94,1)]" />
          <span className="text-xs font-mono font-black text-white uppercase tracking-[0.4em]">
            SENTIMENT_SYNC_ACTIVE
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-10 px-10 py-3.5 bg-black/90 backdrop-blur-3xl rounded-full border border-white/20 shadow-2xl">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-[0.2em]">Safety</span>
              <span className={`text-xl font-black mt-1 ${activeDetections.some(d => d.sentiment === 'bad') ? 'text-red-500' : 'text-green-400'}`}>
                {activeDetections.some(d => d.sentiment === 'bad') ? 'ANOMALY' : 'NOMINAL'}
              </span>
            </div>
            <div className="w-[1px] h-10 bg-zinc-800" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-[0.2em]">Entities</span>
              <span className="text-xl text-zinc-200 font-black tabular-nums mt-1">
                {uniqueLabels}
              </span>
            </div>
          </div>
          
          <div className="text-sm font-mono font-black text-white bg-zinc-800 px-6 py-3.5 rounded-full shadow-2xl border border-white/10 backdrop-blur-md">
            T+{currentTime.toFixed(2)}s
          </div>
        </div>
      </div>

      {detections.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/70 pointer-events-none">
          <div className="px-12 py-6 bg-black/90 backdrop-blur-3xl border border-zinc-800 rounded-3xl text-center shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            <div className="w-10 h-10 border-4 border-zinc-700 border-t-green-500 rounded-full animate-spin mx-auto mb-5" />
            <p className="text-sm font-mono font-bold text-zinc-400 animate-pulse uppercase tracking-[0.4em]">Optimizing Sentiment Analysis...</p>
          </div>
        </div>
      )}
    </div>
  );
};