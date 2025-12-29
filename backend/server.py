from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from models import *
from pydantic_ai import Agent
import datetime
from dotenv import load_dotenv

load_dotenv()

agent = Agent(
    # FIX: 'gemini-2.5-pro' does not exist. Using 'gemini-1.5-flash' which is the current fast model.
    # Ensure GOOGLE_API_KEY is set in .env
    model="google-gla:gemini-flash-latest",
    system_prompt="You are a golf caddy that helps players improve their game."
)


app = FastAPI()

shots = []

# CORS Configuration - Allows frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
    
    
    
    

@app.get("/")
async def root():
    return {"message": "CaddyBot API is running"}

@app.post("/chat")
async def chat(request: ChatRequest) -> ChatResponse:
    """
    Chat endpoint that receives user messages and returns AI responses.
    
    Flow:
    1. Frontend sends user's message + conversation history
    2. Backend processes the message (add your AI logic here)
    3. Backend returns assistant's response
    """
    
    # TODO: Add your AI/LLM integration here
    # For now, we'll return a simple response based on the message
    user_message = request.current_message.lower()


    
    # Simple golf caddy responses (replace with actual AI later)
    if "club" in user_message:
        response_text = "Based on the distance and conditions, I'd recommend using a 7-iron for this shot."
    elif "distance" in user_message or "yards" in user_message:
        response_text = "Could you tell me the distance to the pin and any obstacles in your way?"
    elif "wind" in user_message:
        response_text = "Wind is a crucial factor. For a headwind, club up. For a tailwind, club down."
    elif "hello" in user_message or "hi" in user_message:
        response_text = "Hello! I'm your AI golf caddy. How can I help improve your game today?"
    else:
        response_text = f"I understand you're asking about: '{request.current_message}'. Let me help you with that shot selection."
    
    return ChatResponse(
        role="assistant",
        message=response_text,
        timestamp=datetime.datetime.now().isoformat()
    )

@app.post("/save")
async def save(request: shotResult) -> List[shotResult]:
    shots.append(request)
    return shots

@app.post("/smart")
async def smart(string: str) -> str:
    # FIX: agent.run is an async method and must be awaited
    try:
        response = await agent.run(string)
        # FIX: response is a result object, return the data (text) content
        return response.output
    except Exception as e:
        # detailed error logging
        print(f"Error in smart endpoint: {e}")
        return f"Error processing request: {str(e)}"

