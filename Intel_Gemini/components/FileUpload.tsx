
import React, { useState, useRef } from 'react';

interface FileUploadProps {
  onUpload: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      onUpload(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="w-full max-w-2xl px-4">
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-12 transition-all duration-300 flex flex-col items-center text-center
          ${isDragging ? 'border-green-500 bg-green-500/10 scale-[1.02]' : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900'}
        `}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <svg className="w-10 h-10 text-zinc-400 group-hover:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-zinc-100 mb-2">Upload Video to Analyze</h2>
        <p className="text-zinc-400 max-w-sm mx-auto mb-8">
          Drag and drop your MP4 file here, or click to browse. Let Gemini extract deep insights, searchable events, and highlights.
        </p>

        <button className="px-8 py-3 bg-zinc-100 text-zinc-950 rounded-lg font-semibold hover:bg-white transition-colors">
          Select Video File
        </button>
        
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="video/mp4,video/x-m4v,video/*"
          className="hidden"
        />

        <div className="mt-12 flex items-center gap-8 opacity-40">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
            <span className="text-xs">Quick Search</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
            <span className="text-xs">Automatic Summary</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm10 3h-9v-2h9v2zm0-4h-9v-2h9v2z"/></svg>
            <span className="text-xs">Video Chat</span>
          </div>
        </div>
      </div>
    </div>
  );
};
