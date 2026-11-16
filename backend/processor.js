
import { GoogleGenAI } from "@google/genai";

export const analyzeMeeting = async (audioBase64, mimeType) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Perform a professional executive analysis of this meeting audio:
    1. TRANSCRIPTION: Full accurate text with speaker names if identified.
    2. SUMMARY: High-level goals and key takeaways.
    3. ACTION ITEMS: A structured list of tasks with owners and estimated deadlines.
    4. RISKS: Any blockers or concerns mentioned.
    5. FOLLOW-UP: A professional email draft ready to send to participants.
    
    Use clear Markdown headers for each section. Be concise and professional.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: {
      parts: [
        { inlineData: { mimeType, data: audioBase64 } },
        { text: prompt }
      ]
    },
    config: {
      temperature: 0.2
    }
  });

  return response.text;
};
