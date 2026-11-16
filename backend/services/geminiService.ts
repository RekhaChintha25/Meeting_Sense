
import { GoogleGenAI, Type } from "@google/genai";

// Export MeetingReport interface for use in frontend
export interface MeetingReport {
  transcript: string;
  summary: string;
  actionItems: any[];
  followUpEmail: string;
}

/**
 * Processes meeting audio in two phases:
 * 1. Transcription using gemini-3-flash-preview.
 * 2. Executive analysis and report generation using gemini-3-pro-preview with JSON response.
 */
export const processMeetingAudio = async (
  audioBase64: string,
  mimeType: string,
  onPhaseUpdate: (phase: 'transcribing' | 'analyzing', message: string) => void
): Promise<MeetingReport> => {
  try {
    // Correctly initialize GoogleGenAI using process.env.API_KEY directly as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // PHASE 1: Transcription - High speed with Flash
    onPhaseUpdate('transcribing', "Extracting transcript with Gemini Flash...");

    const transcriptionResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: audioBase64
            }
          },
          { text: "Transcribe this meeting audio accurately. Identify speakers (e.g., John, Sarah). Provide ONLY the transcript text." }
        ]
      }
    });

    const rawTranscript = transcriptionResponse.text || "No transcript generated.";

    // PHASE 2: Deep Analysis - High reasoning with Pro
    onPhaseUpdate('analyzing', "Generating executive intelligence with Gemini Pro...");

    const analysisResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `You are a world-class Executive AI Meeting Assistant. Analyze the following meeting transcript and produce a high-fidelity report.
      
TRANSCRIPT:
"""
${rawTranscript}
"""

Produce the report in JSON format with the following structure:
- "summary": A concise, sophisticated 2-3 paragraph executive summary.
- "actionItems": An array of tasks, each with "task", "owner", "priority" (High, Medium, or Low), and "deadline".
- "email": A professional follow-up email draft.

Return ONLY valid JSON.`,
      config: {
        temperature: 0.1,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            actionItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  task: { type: Type.STRING },
                  owner: { type: Type.STRING },
                  priority: { type: Type.STRING },
                  deadline: { type: Type.STRING }
                },
                required: ["task", "owner", "priority"]
              }
            },
            email: { type: Type.STRING }
          },
          required: ["summary", "actionItems", "email"]
        }
      }
    });

    const analysisData = JSON.parse(analysisResponse.text || "{}");

    return {
      transcript: rawTranscript,
      summary: analysisData.summary || "Summary unavailable.",
      actionItems: analysisData.actionItems || [],
      followUpEmail: analysisData.email || "Email draft unavailable."
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "The AI encountered an error processing your request.");
  }
};
