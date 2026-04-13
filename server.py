"""DWJBA — Ask CAYMC Voice Backend (FastAPI + ElevenLabs TTS)"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
from generate_audio import generate_audio

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

class TTSRequest(BaseModel):
    text: str
    voice: str = "rachel"   # ElevenLabs voice — professional female

@app.post("/api/tts")
async def tts(req: TTSRequest):
    # Truncate very long texts for TTS (keep it conversational)
    text = req.text[:800] if len(req.text) > 800 else req.text
    audio_bytes = await generate_audio(text, voice=req.voice, model="elevenlabs_tts_v3")
    return Response(content=audio_bytes, media_type="audio/mpeg")

@app.get("/health")
async def health():
    return {"status": "ok"}
