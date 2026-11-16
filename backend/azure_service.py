"""
Azure OpenAI meeting audio processing: transcription + executive analysis.
- Transcription: Whisper (if WHISPER_API_URL + WHISPER_API_KEY set) or Azure OpenAI audio input.
- Analysis: Azure OpenAI (AZURE_* / AZURE_GPT_MINI_* env vars).
"""

import os
import base64
import json
from typing import Dict, Any

import requests

# Map file extension to audio format for API
AUDIO_FORMAT_MAP = {
    ".mp3": "mp3",
    ".mpeg": "mp3",
    ".wav": "wav",
    ".webm": "webm",
    ".m4a": "m4a",
    ".ogg": "ogg",
}


def _get_client():
    from openai import AzureOpenAI

    endpoint = os.getenv("AZURE_ENDPOINT") or os.getenv("AZURE_GPT_MINI_ENDPOINT")
    api_key = os.getenv("AZURE_OPENAI_API_KEY") or os.getenv(
        "AZURE_GPT_MINI_OPENAI_API_KEY"
    )
    if not endpoint or not api_key:
        raise ValueError(
            "Azure env vars are missing. Set AZURE_ENDPOINT + AZURE_OPENAI_API_KEY "
            "(or AZURE_GPT_MINI_ENDPOINT + AZURE_GPT_MINI_OPENAI_API_KEY)."
        )
    return AzureOpenAI(
        azure_endpoint=endpoint.rstrip("/"),
        api_key=api_key,
        api_version=(
            os.getenv("AZURE_API_VERSION")
            or os.getenv("AZURE_GPT_MINI_API_VERSION")
            or "2024-02-15-preview"
        ),
    )


def _audio_format_from_path(path: str) -> str:
    ext = os.path.splitext(path)[1].lower()
    return AUDIO_FORMAT_MAP.get(ext, "mp3")


def _transcribe_with_whisper(temp_path: str) -> str:
    """Transcribe audio using Azure Whisper API (WHISPER_API_URL + WHISPER_API_KEY)."""
    url = (os.getenv("WHISPER_API_URL") or "").strip().strip('"')
    key = (os.getenv("WHISPER_API_KEY") or "").strip().strip('"')
    if not url or not key:
        raise ValueError(
            "WHISPER_API_URL and WHISPER_API_KEY are required for Whisper transcription."
        )
    try:
        with open(temp_path, "rb") as f:
            files = {"file": (os.path.basename(temp_path), f, "audio/mpeg")}
            headers = {"api-key": key}
            r = requests.post(url, headers=headers, files=files, timeout=120)
        r.raise_for_status()
        raw = (r.text or "").strip()
        if not raw:
            return "No transcript generated."
        try:
            data = json.loads(raw)
            if isinstance(data, dict) and "text" in data:
                return (data["text"] or "").strip() or "No transcript generated."
        except (json.JSONDecodeError, TypeError):
            pass
        return raw
    except requests.exceptions.ConnectionError as e:
        raise ValueError(
            "Could not reach Whisper API. Use an Azure OpenAI Whisper URL like "
            "https://YOUR-RESOURCE.openai.azure.com/openai/deployments/whisper/audio/transcriptions?api-version=2024-06-01 "
            "(not cognitiveservices.azure.com). Check WHISPER_API_URL and network."
        ) from e


def process_meeting_audio(
    temp_path: str, mime_type: str = "audio/mpeg"
) -> Dict[str, Any]:
    """
    Phase 1: Transcribe with Whisper (if WHISPER_* set) or Azure OpenAI audio input.
    Phase 2: Analyze transcript with Azure OpenAI.
    Returns dict with keys: transcript, summary, actionItems, followUpEmail (frontend shape).
    """
    whisper_url = (os.getenv("WHISPER_API_URL") or "").strip().strip('"')
    whisper_key = (os.getenv("WHISPER_API_KEY") or "").strip().strip('"')
    use_whisper = bool(whisper_url and whisper_key)

    if use_whisper:
        raw_transcript = _transcribe_with_whisper(temp_path)
    else:
        # Phase 1: Transcribe with Azure OpenAI (Chat Completions with audio input)
        client = _get_client()
        deployment = (
            os.getenv("AZURE_DEPLOYMENT_NAME")
            or os.getenv("AZURE_GPT_MINI_DEPLOYMENT_NAME")
            or "gpt-4o"
        )
        audio_format = _audio_format_from_path(temp_path)
        with open(temp_path, "rb") as f:
            audio_b64 = base64.b64encode(f.read()).decode("utf-8")
        transcript_messages = [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Transcribe this meeting audio accurately. Identify speakers (e.g., John, Sarah). Provide ONLY the transcript text, no preamble.",
                    },
                    {
                        "type": "input_audio",
                        "input_audio": {"data": audio_b64, "format": audio_format},
                    },
                ],
            }
        ]
        try:
            transcript_response = client.chat.completions.create(
                model=deployment,
                messages=transcript_messages,
                temperature=0.1,
            )
        except Exception as e:
            err_msg = str(e).lower()
            if "input_audio" in err_msg or "audio" in err_msg or "modality" in err_msg:
                raise ValueError(
                    "Azure deployment does not support audio. Set WHISPER_API_URL and WHISPER_API_KEY for transcription."
                ) from e
            raise
        raw_transcript = (
            transcript_response.choices[0].message.content
            if transcript_response.choices
            else "No transcript generated."
        )
        raw_transcript = (raw_transcript or "").strip() or "No transcript generated."

    # Phase 2: Analyze transcript with Azure OpenAI
    client = _get_client()
    deployment = (
        os.getenv("AZURE_DEPLOYMENT_NAME")
        or os.getenv("AZURE_GPT_MINI_DEPLOYMENT_NAME")
        or "gpt-4o"
    )
    analysis_prompt = f"""You are a world-class Executive Chief of Staff. Analyze the following meeting transcript.

TRANSCRIPT:
\"\"\"
{raw_transcript}
\"\"\"

Produce a high-fidelity report in JSON format with these exact keys:
- "summary": A concise, sophisticated 2-3 paragraph executive summary of the meeting's goals, key discussions, and primary outcomes. Do NOT just list what people said; synthesize the meaning.
- "actionItems": An array of objects: {{ "task": string, "owner": string, "priority": "High" | "Medium" | "Low", "deadline": string }}.
- "email": A complete, professionally written follow-up email draft. For the signature: use the meeting organizer's or primary sender's name from the transcript when clearly identifiable (e.g. "Best regards, John Smith"); if no name is clear, end with only "Best regards," and do NOT include placeholders like [Your Name], [Your Position], or [Your Contact Information].

Return ONLY valid JSON, no markdown or extra text."""

    analysis_response = client.chat.completions.create(
        model=deployment,
        messages=[{"role": "user", "content": analysis_prompt}],
        temperature=0.2,
        response_format={"type": "json_object"},
    )
    analysis_text = (
        analysis_response.choices[0].message.content
        if analysis_response.choices
        else "{}"
    )
    analysis_text = (analysis_text or "").strip() or "{}"
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
