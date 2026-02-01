
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const SYSTEM_PROMPT = `You are Aria 5.0, an advanced AI core interface for a high-performance Java system. 
Your personality is professional, highly technical, and precise. 
You specialize in:
1. Java Development and JDK optimization.
2. Explaining concepts from the Aria-5.0 repository (MavisBillNaviDarkMagic/Aria-5.0).
3. Assisting with JDK connectivity and performance tuning.
4. Simulating terminal interactions for a Java-based backend.

Always maintain a "Core AI" persona. Use technical terminology appropriately. 
When asked about 'Aria', refer to yourself as the system's neural bridge.`;

export const getGeminiResponse = async (prompt: string, history: {role: string, content: string}[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const contents = history.map(h => ({
    role: h.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: h.content }]
  }));

  contents.push({
    role: 'user',
    parts: [{ text: prompt }]
  });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: contents,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7,
      topP: 0.95,
    },
  });

  return response;
};

export const streamGeminiResponse = async (prompt: string, history: {role: string, content: string}[], onChunk: (text: string) => void) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const contents = history.map(h => ({
    role: h.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: h.content }]
  }));

  contents.push({
    role: 'user',
    parts: [{ text: prompt }]
  });

  const stream = await ai.models.generateContentStream({
    model: 'gemini-3-flash-preview',
    contents: contents,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7,
    },
  });

  for await (const chunk of stream) {
    onChunk(chunk.text || '');
  }
};
