/**
 * Calls the backend (e.g. Render) to process meeting audio with Azure OpenAI.
 * Use VITE_BACKEND_URL in env (e.g. https://your-app.onrender.com).
 */

export interface MeetingReport {
  transcript: string;
  summary: string;
  actionItems: any[];
  followUpEmail: string;
}

const getBackendUrl = (): string => {
  const url = import.meta.env.VITE_BACKEND_URL;
  if (!url || typeof url !== "string") return "";
  return url.replace(/\/$/, "");
};

export async function uploadMeetingAudio(
  file: File,
  onProgress?: (message: string) => void
): Promise<MeetingReport> {
  const base = getBackendUrl();
  if (!base) {
    throw new Error("VITE_BACKEND_URL is not set. Set it to your backend URL (e.g. https://your-app.onrender.com).");
  }
  const url = `${base}/process`;
  onProgress?.("Uploading and processing...");
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text();
    let detail = text;
    try {
      const j = JSON.parse(text);
      if (j.detail) detail = typeof j.detail === "string" ? j.detail : JSON.stringify(j.detail);
    } catch {
      // use text as-is
    }
    throw new Error(detail || `Request failed: ${res.status}`);
  }
  const data = await res.json();
  return {
    transcript: data.transcript ?? "",
    summary: data.summary ?? "",
    actionItems: Array.isArray(data.actionItems) ? data.actionItems : [],
    followUpEmail: data.followUpEmail ?? "",
  };
}

export function isBackendConfigured(): boolean {
  return Boolean(getBackendUrl());
}
