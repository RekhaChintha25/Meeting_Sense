# MeetingSense AI | Executive Intelligence

Upload meeting audio and get an executive summary, action items, and a follow-up email draft—powered by **Azure OpenAI** (transcription via Whisper, analysis via GPT) and an optional **login gate**.

---

## Features

- **Audio upload** — Record or upload meeting audio (MP3, WAV, etc.)
- **Transcription** — Azure Whisper (or Azure OpenAI audio input)
- **Analysis** — Executive summary, action items with owner/deadline, follow-up email draft
- **Login (optional)** — Shared-password gate via `VITE_LOGIN_PASSWORD`
- **Deploy** — Backend on Render, frontend on Vercel

---

## Prerequisites

- **Frontend:** Node.js 14.18+
- **Backend:** Python 3.10+

---

## Run locally

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
```

Copy `backend/.env.example` to `backend/.env` and set:

| Variable | Description |
|----------|-------------|
| `AZURE_GPT_MINI_ENDPOINT` | Azure OpenAI endpoint (e.g. `https://YOUR-RESOURCE.openai.azure.com/`) |
| `AZURE_GPT_MINI_OPENAI_API_KEY` | Azure OpenAI API key |
| `AZURE_GPT_MINI_DEPLOYMENT_NAME` | Deployment name (e.g. `gpt-4o-mini`) |
| `AZURE_GPT_MINI_API_VERSION` | API version (e.g. `2024-12-01-preview`) |
| `WHISPER_API_URL` | Azure Whisper endpoint for transcription |
| `WHISPER_API_KEY` | Key for Whisper (can be same as OpenAI key if same resource) |

Start the API:

```bash
# From backend/
python main.py
# or
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at **http://localhost:8000**.

### 2. Frontend

```bash
npm install
```

Create `.env.local` in the **project root** (same folder as `package.json`):

| Variable | Description |
|----------|-------------|
| `VITE_BACKEND_URL` | Backend URL (e.g. `http://localhost:8000`) — **required** for upload/analysis |
| `VITE_LOGIN_PASSWORD` | Optional. If set, users must enter this password to access the app. |

Then:

```bash
npm run dev
```

Frontend runs at **http://localhost:3000**. Open it, upload an audio file; the app will call the backend and show transcript, summary, action items, and email draft.

---

## Project structure

```
├── backend/                 # FastAPI (Render)
│   ├── main.py              # API entry, /process
│   ├── azure_service.py     # Whisper + Azure OpenAI
│   ├── database.py          # SQLite (optional storage)
│   ├── requirements.txt
│   └── .env.example         # Env template (no real keys)
├── components/              # React UI (Header, Login, FileUploader, etc.)
├── services/
│   └── backendApi.ts         # Frontend → backend /process
├── App.tsx                  # Main app
├── index.html, index.tsx    # Entry
├── package.json             # Frontend deps + scripts
├── vite.config.ts
└── .env.example             # Frontend env template
```

- **Frontend** (root): Vite + React; uses `VITE_BACKEND_URL` to call the backend.
- **Backend** (`backend/`): FastAPI; uses Azure + Whisper env vars. No Google/Gemini.

---

## Deploy: Render (backend) + Vercel (frontend)

### 1. Backend on Render

1. [Render](https://render.com) → **New** → **Web Service**.
2. Connect your GitHub repo (the repo **root** must contain a folder named `backend`).
3. **Root Directory:** `backend`
4. **Build Command:** `pip install -r requirements.txt`
5. **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. **Environment:** Add the same variables as in `backend/.env` (see table above). **Do not commit real keys.**
7. Deploy and copy the service URL (e.g. `https://your-app.onrender.com`).

**Optional:** Use the repo’s `render.yaml` (Blueprint): **New** → **Blueprint** and connect the same repo. Render will create the service with `rootDir: backend` and the commands above.

**If you see “Root directory backend does not exist”:**  
Render expects a folder named `backend` at the **root** of your GitHub repo. Ensure the `backend` folder (with `main.py`, `requirements.txt`, etc.) is committed and pushed. From your repo root, run `git status` and `ls backend`; if `backend` is missing, add and push it:  
`git add backend && git commit -m "Add backend for Render" && git push`.

### 2. Frontend on Vercel

1. [Vercel](https://vercel.com) → **Add New** → **Project** → import the same repo.
2. **Root Directory:** leave default (repo root).
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`
5. **Environment Variables:**
   - **`VITE_BACKEND_URL`** = your Render URL (e.g. `https://your-app.onrender.com`) — no trailing slash.
   - **`VITE_LOGIN_PASSWORD`** (optional) = shared password for the login page.
6. Deploy. If you change env vars later, **redeploy** so the build picks them up.

### 3. Verify

- Open the Vercel URL. If `VITE_LOGIN_PASSWORD` is set, you’ll see the login page; otherwise the upload screen.
- Upload an audio file. You should get transcript, summary, action items, and email. If you see “Backend not configured,” check `VITE_BACKEND_URL` on Vercel and redeploy.

---

## Security notes

- Never commit `.env` or real API keys. Use `.env.example` with placeholders only.
- Regenerate any key that was ever committed or shared.
- `VITE_LOGIN_PASSWORD` is a single shared password (no user accounts). For real auth, add a proper backend auth layer.

---

