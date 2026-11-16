"""
Gemini-based meeting audio processing: transcription + executive analysis.
Keeps API key on server (safe for production).
"""
import os
import base64
import json
from typing import Dict, Any

def get_client():
    from google import genai
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is required")
    return genai.Client(api_key=api_key)


def process_meeting_audio(temp_path: str, mime_type: str = "audio/mpeg") -> Dict[str, Any]:
    """
    Phase 1: Transcribe audio with Gemini Flash.
    Phase 2: Analyze transcript and produce report (summary, actionItems, email) with Gemini.
    Returns dict with keys: transcript, summary, actionItems, followUpEmail (frontend shape).
    """
    client = get_client()

    # Phase 1: Upload file and transcribe
    uploaded = client.files.upload(file=temp_path)
    transcript_response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[
            uploaded,
            "Transcribe this meeting audio accurately. Identify speakers (e.g., John, Sarah). Provide ONLY the transcript text."
        ]
    )
    raw_transcript = transcript_response.text or "No transcript generated."

    # Phase 2: Analyze transcript and get structured report
    analysis_prompt = f"""You are a world-class Executive Chief of Staff. Analyze the following meeting transcript.

TRANSCRIPT:
\"\"\"
{raw_transcript}
\"\"\"

Produce a high-fidelity report in JSON format with these exact keys:
- "summary": A concise, sophisticated 2-3 paragraph executive summary of the meeting's goals, key discussions, and primary outcomes. Do NOT just list what people said; synthesize the meaning.
- "actionItems": An array of objects: {{ "task": string, "owner": string, "priority": "High" | "Medium" | "Low", "deadline": string }}.
- "email": A complete, professionally written follow-up email draft.

Return ONLY valid JSON."""

    analysis_response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=analysis_prompt,
        config={
            "response_mime_type": "application/json",
            "temperature": 0.2,
        }
    )
    analysis_text = analysis_response.text or "{}"
    try:
        analysis_data = json.loads(analysis_text)
    except json.JSONDecodeError:
        analysis_data = {}

    return {
        "transcript": raw_transcript,
        "summary": analysis_data.get("summary", "Summary unavailable."),
        "actionItems": analysis_data.get("actionItems", []),
        "followUpEmail": analysis_data.get("email", "Email draft unavailable."),
    }
