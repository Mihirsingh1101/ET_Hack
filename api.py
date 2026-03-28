from fastapi import FastAPI, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import uvicorn
import time

# Import your existing, working pipeline modules!
import retrieve
import generate

# ==========================================
# 1. API Initialization & Middleware
# ==========================================
app = FastAPI(
    title="Sentinel AI API",
    description="Event-Driven RAG Backend for Quantitative Market Insights",
    version="1.0.0"
)

# Crucial for Hackathons: Allow the frontend (React/Next.js) to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all origins (safe for local hackathon testing)
    allow_credentials=True,
    allow_methods=["*"], # Allows POST, GET, OPTIONS, etc.
    allow_headers=["*"],
)

# ==========================================
# 2. Root Redirect (Fixing the 404 Error)
# ==========================================
@app.get("/", include_in_schema=False)
def root_redirect():
    """Instantly redirects browser traffic to the interactive API docs."""
    return RedirectResponse(url="/docs")

# ==========================================
# 3. Data Models (The JSON Contracts)
# ==========================================
class InsightData(BaseModel):
    ticker: str
    sector: str
    insight_text: str
    timestamp: str

class ChatTurn(BaseModel):
    user: str
    ai: str

class ChatRequest(BaseModel):
    user_message: str
    insight_data: InsightData
    chat_history: List[ChatTurn] = []

class ChatResponse(BaseModel):
    ai_response: str
    latency_seconds: float
    snippets_procured: int

# ==========================================
# 4. API Endpoints
# ==========================================
@app.get("/health")
def health_check():
    """A simple ping endpoint to verify the server is alive."""
    return {"status": "Sentinel AI Backend is Online."}

@app.post("/chat", response_model=ChatResponse)
def process_chat(request: ChatRequest):
    """
    The core endpoint. Takes the frontend's JSON, runs the local RAG 
    procurement, and hits OpenRouter for the conversational response.
    """
    start_time = time.time()
    
    try:
        # 1. Procurement (Local ChromaDB)
        # We combine the ticker and insight text to find the most relevant news
        search_query = f"@{request.insight_data.ticker} {request.insight_data.insight_text}"
        snippets = retrieve.search_insight(search_query, top_k=7, max_distance=1.2)
        
        # 2. Format Chat History
        # Convert Pydantic models back to standard dictionaries for generate.py
        history_dicts = [{"user": turn.user, "ai": turn.ai} for turn in request.chat_history]
        
        # 3. Generation (Cloud LLM)
        # Convert Pydantic Insight model to a dictionary for generate.py
        insight_dict = request.insight_data.model_dump()
        
        ai_reply = generate.chat_about_insight(
            user_message=request.user_message,
            insight_data=insight_dict,
            news_snippets=snippets,
            chat_history=history_dicts
        )
        
        # 4. Return the Payload to Frontend
        exec_time = round(time.time() - start_time, 2)
        
        return ChatResponse(
            ai_response=ai_reply,
            latency_seconds=exec_time,
            snippets_procured=len(snippets)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline Error: {str(e)}")

# ==========================================
# 5. Server Execution
# ==========================================
if __name__ == "__main__":
    print("\n" + "="*50)
    print(" 🚀 Starting Sentinel AI API Server on Port 8000")
    print("="*50)
    uvicorn.run(app, host="0.0.0.0", port=8000)