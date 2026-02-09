
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { VideoPlayer } from './components/VideoPlayer';
import { ChatInterface } from './components/ChatInterface';
import { SummarySection } from './components/SummarySection';
import { ProcessingStatus } from './components/ProcessingStatus';
import { VideoState, Message, ProcessingLog } from './types';
import { runFastDeepAnalysis, chatWithVideo } from './services/geminiService';

const App: React.FC = () => {
  const [videoState, setVideoState] = useState<VideoState>({
    file: null,
    base64: null,
    status: 'IDLE',
    summary: null,
    detections: [],
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [logs, setLogs] = useState<ProcessingLog[]>([]);

  const addLog = useCallback((message: string, status: ProcessingLog['status'] = 'info') => {
    setLogs(prev => [
      { id: Math.random().toString(36), message, timestamp: new Date(), status },
      ...prev.slice(0, 14)
    ]);
  }, []);

  const handleFileUpload = async (file: File) => {
    setVideoState(prev => ({ ...prev, file, status: 'UPLOADING', detections: [] }));
    addLog(`Uploaded: ${file.name}. Initializing Ultra-Fast Analysis...`, 'loading');

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string).split(',')[1];
      setVideoState(prev => ({ ...prev, base64, status: 'DEEP_ANALYSIS' }));
      
      try {
        addLog('Optimized AI Pipeline: Performing high-speed narrative & spatial extraction...', 'loading');
        
        // Optimized call for speed
        const { summary, detections } = await runFastDeepAnalysis(base64, file.type);

        setVideoState(prev => ({ ...prev, status: 'ACTIVE', summary, detections }));
        addLog(`Intelligence extraction complete. Latency optimized.`, 'success');
      } catch (error: any) {
        addLog('Analysis failure: ' + error.message, 'error');
        setVideoState(prev => ({ ...prev, status: 'ERROR', error: error.message }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (content: string) => {
    if (!videoState.base64 || !videoState.file) return;

    const userMessage: Message = { role: 'user', content, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setIsChatLoading(true);

    try {
      const response = await chatWithVideo(
        videoState.base64, 
        videoState.file.type, 
        content,
        messages
      );
      const modelMessage: Message = { role: 'model', content: response, timestamp: new Date() };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error: any) {
      const errorMessage: Message = { role: 'model', content: `Error: ${error.message}`, timestamp: new Date() };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const resetSession = () => {
    setVideoState({ file: null, base64: null, status: 'IDLE', summary: null, detections: [] });
    setMessages([]);
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Header onReset={resetSession} />
      
      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8 overflow-hidden">
        {videoState.status === 'IDLE' ? (
          <div className="h-full flex items-center justify-center">
            <FileUpload onUpload={handleFileUpload} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            
            <div className="lg:col-span-7 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
                <VideoPlayer file={videoState.file} detections={videoState.detections} />
              </div>

              {videoState.status === 'ACTIVE' ? (
                <SummarySection summary={videoState.summary} />
              ) : (
                <ProcessingStatus status={videoState.status} logs={logs} />
              )}
            </div>

            <div className="lg:col-span-5 h-[calc(100vh-180px)] min-h-[500px]">
              <ChatInterface 
                messages={messages} 
                onSendMessage={handleSendMessage} 
                isLoading={isChatLoading}
                isReady={videoState.status === 'ACTIVE'}
              />
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default App;
