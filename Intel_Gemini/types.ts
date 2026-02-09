
export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface Detection {
  id: string;
  label: string;
  timestamp: number; // in seconds
  box: [number, number, number, number]; // [ymin, xmin, ymax, xmax] normalized 0-1000
  sentiment: 'good' | 'bad';
}

export interface VideoState {
  file: File | null;
  base64: string | null;
  status: 'IDLE' | 'UPLOADING' | 'AUTONOMOUS_STUDY' | 'ENGINEERING_PROMPT' | 'DEEP_ANALYSIS' | 'ACTIVE' | 'ERROR';
  summary: string | null;
  detections: Detection[];
  customPrompt?: string;
  error?: string;
}

export interface ProcessingLog {
  id: string;
  message: string;
  timestamp: Date;
  status: 'info' | 'success' | 'error' | 'loading' | 'architect';
}

export type AgentType = 'TRAFFIC' | 'KEYNOTE' | 'WAREHOUSE' | 'DRONE' | 'SAFARI' | 'AUTO';

export interface AgentProfile {
  id: Exclude<AgentType, 'AUTO'>;
  title: string;
  badge: string;
  description: string;
  prompt: string;
}
