
import { GoogleGenAI } from "@google/genai";

export interface MeetingReport {
  transcript: string;
  summary: string;
  actionItems: any[];
  followUpEmail: string;
}

export const processMeetingAudio = async (
  audioBase64: string,
  mimeType: string,
  onPhaseUpdate: (phase: 'transcribing' | 'analyzing', message: string) => void
): Promise<MeetingReport> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // PHASE 1: TRANSCRIPTION (High speed with Flash)
    onPhaseUpdate('transcribing', "Extracting transcription...");
    
    const transcriptionResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { inlineData: { mimeType, data: audioBase64 } },
            { text: "Transcribe this meeting audio accurately. Identify speakers (e.g., John, Sarah). Provide ONLY the transcript text." }
          ]
        }
      ],
      config: { temperature: 0.1 }
    });

    const rawTranscript = transcriptionResponse.text || "No transcript generated.";

    // PHASE 2: DEEP ANALYSIS (Higher reasoning with Pro)
    onPhaseUpdate('analyzing', "Synthesizing executive intelligence...");
    
    const analysisPrompt = `
      You are a world-class Executive Chief of Staff. Analyze the following meeting transcript.
      
      TRANSCRIPT:
      """
      ${rawTranscript}
      """

      Produce a high-fidelity report in JSON format with these exact keys:
      - "summary": A concise, sophisticated 2-3 paragraph executive summary of the meeting's goals, key discussions, and primary outcomes. Do NOT just list what people said; synthesize the meaning.
      - "actionItems": An array of objects: { "task": string, "owner": string, "priority": "High" | "Medium" | "Low", "deadline": string }.
      - "email": A complete, professionally written follow-up email draft.

      Return ONLY valid JSON.
    `;

    const analysisResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: analysisPrompt,
      config: { 
        responseMimeType: "application/json",
        temperature: 0.2 
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
    console.error("Processing Error:", error);
    throw new Error(error.message || "The AI encountered an error processing your request.");
  }
};
