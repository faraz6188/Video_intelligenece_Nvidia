
import { GoogleGenAI } from "@google/genai";
import { Message, Detection } from "../types";

const getClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * ULTRA-HIGH-SPEED Intelligence Extraction
 * Uses Gemini 3 Flash with optimized token output for minimum latency.
 */
export const runFastDeepAnalysis = async (
  base64Data: string, 
  mimeType: string
): Promise<{ summary: string, detections: Detection[] }> => {
  const ai = getClient();
  const model = 'gemini-3-flash-preview';

  // Optimized for speed: Reduced tracking density (every 1.0s instead of 0.5s) 
  // and more direct instructions to decrease token generation time.
  const systemInstruction = `You are an Ultra-Fast Video Analysis Engine.
  Analyze the stream and provide immediate intelligence.

  OUTPUT REQUIREMENTS:
  1. NARRATIVE: One concise, high-impact paragraph. Bold key entities.
  2. SPATIAL TRACKING: Tracking every 1.0s (maximum speed).
     - COORDS: [ymin, xmin, ymax, xmax] normalized 0-1000.
  3. SENTIMENT: "bad" for risk, "good" for normal.

  OUTPUT FORMAT (Strictly at the end):
  [DETECTIONS]
  {"label": "Car", "timestamp": 1.0, "box_2d": [ymin, xmin, ymax, xmax], "sentiment": "good"}
  [/DETECTIONS]`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: "FAST_EXTRACT: Summarize and track key objects. Minimize output tokens for speed." }
        ]
      },
      config: { 
        systemInstruction, 
        temperature: 0.1,
      }
    });

    const text = response.text || "";
    const detectionRegex = /\[DETECTIONS\]([\s\S]*?)\[\/DETECTIONS\]/i;
    const match = text.match(detectionRegex);
    
    let detections: Detection[] = [];
    let rawSummary = text.replace(detectionRegex, '').trim();

    const cleanSummary = rawSummary
      .replace(/^(?:\d+\.|\*|-)?\s*(?:SUMMARY|Summary|NARRATIVE|Narrative|ANALYSIS|Analysis|PROTOCOL|INTEL)[:\s]*/gi, '')
      .replace(/```json[\s\S]*?```/gi, '')
      .replace(/```[\s\S]*?```/gi, '')
      .replace(/\{[\s\S]*?\}/g, '')
      .replace(/\[\/?DETECTIONS\]/gi, '')
      .trim();

    if (match && match[1]) {
      const content = match[1].trim();
      const jsonObjects = content.match(/\{[\s\S]*?\}/g) || [];
      
      jsonObjects.forEach(objStr => {
        try {
          const json = JSON.parse(objStr.trim());
          const box = json.box_2d || json.box || json.bbox;
          if (json.label && box && Array.isArray(box)) {
            detections.push({
              id: Math.random().toString(36).substring(7),
              label: json.label,
              timestamp: parseFloat(json.timestamp) || 0,
              box: box as [number, number, number, number],
              sentiment: json.sentiment === 'bad' ? 'bad' : 'good'
            });
          }
        } catch (e) {}
      });
    }

    return { summary: cleanSummary, detections };
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
};

export const chatWithVideo = async (
  base64Data: string, 
  mimeType: string, 
  question: string,
  history: Message[]
): Promise<string> => {
  const ai = getClient();
  const historyContext = history.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: `Context: ${historyContext}\n\nQuestion: ${question}` }
        ]
      },
      config: {
        systemInstruction: "You are a video intelligence assistant. Provide insightful answers that are exactly between 30 and 40 words. Do not exceed 40 words, and do not provide less than 30 words. Be direct, technical, and professional."
      }
    });
    return response.text || "No analysis available.";
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
};

export const autonomousPromptEngineer = async () => "Optimized.";
export const executeDeepAnalysis = async (base64: string, mime: string) => runFastDeepAnalysis(base64, mime);
