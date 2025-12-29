from typing import List
from pydantic import BaseModel


# Request/Response Models
class Message(BaseModel):
    role: str  # 'user' or 'assistant'
    message: str
    timestamp: str

class ChatRequest(BaseModel):
    messages: List[Message]  # Full conversation history
    current_message: str  # The latest user message

class ChatResponse(BaseModel):
    role: str
    message: str
    timestamp: str

class contact(BaseModel):
    toe: int
    heel: int
    top: int
    chunk: int

class result(BaseModel):
    right: int
    left: int
    long: int
    short: int

class shotResult(BaseModel):
    id: int
    intendedDistance: int
    club: str    
    contact: contact
    result: result

class lie(BaseModel):
    cut: int
    xAxis: int
    zAxis: int

class wind(BaseModel):
    hurt: int
    help: int
    left: int
    right: int

class swing(BaseModel):
    size: str
    grip: str
    feel: str
    intangibles: str
    

class shotInput(BaseModel):
    id: int
    distance: int
    club: str    
    lie: lie
    wind: wind
    swing: swing
