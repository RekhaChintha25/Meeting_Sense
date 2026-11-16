from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import os
import shutil
import uuid

# Load .env from backend folder so AZURE_* vars are available
from dotenv import load_dotenv

_load_env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
load_dotenv(_load_env_path)

try:
    from .database import engine, Base, SessionLocal, MeetingRecord
    from .azure_service import process_meeting_audio as azure_process_meeting
except ImportError:
    from database import engine, Base, SessionLocal, MeetingRecord
    from azure_service import process_meeting_audio as azure_process_meeting

app = FastAPI()

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Database
Base.metadata.create_all(bind=engine)


@app.post("/process")
async def process_meeting(file: UploadFile = File(...)):
    # 1. Save temporary file
    temp_id = str(uuid.uuid4())
    temp_path = f"temp_{temp_id}_{file.filename}"

    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 2. Run Azure OpenAI (transcribe + analyze)
        result = azure_process_meeting(temp_path, file.content_type or "audio/mpeg")

        # 3. Store in SQLite (action_items stored as JSON string)
        db = SessionLocal()
        record = MeetingRecord(
            id=temp_id,
            filename=file.filename,
            transcript=result["transcript"],
            summary=result["summary"],
            action_items=json.dumps(result["actionItems"])
            if result.get("actionItems")
            else "",
            email=result["followUpEmail"],
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        db.close()

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
