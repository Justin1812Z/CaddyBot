/**
 * ============================================================================
 * API INTEGRATION GUIDE - CaddyBot
 * ============================================================================
 * 
 * This document explains how the frontend communicates with the backend API
 * to receive AI-generated responses.
 * 
 * 
 * ARCHITECTURE OVERVIEW:
 * =====================
 * 
 *   Frontend (React)          Backend (FastAPI)
 *   ┌─────────────┐           ┌──────────────┐
 *   │   App.tsx   │           │  server.py   │
 *   │             │           │              │
 *   │ addMessage()│──────────▶│ /chat POST   │
 *   │             │  HTTP     │              │
 *   │             │◀──────────│ returns JSON │
 *   └─────────────┘           └──────────────┘
 * 
 * 
 * COMPLETE MESSAGE FLOW WITH API:
 * ===============================
 * 
 * 1. USER TYPES MESSAGE
 *    └─▶ InputBox component captures text
 * 
 * 2. USER CLICKS SEND
 *    └─▶ InputBox creates Message object
 *        └─▶ Calls onSendMessage(newMessage)
 * 
 * 3. APP RECEIVES USER MESSAGE
 *    └─▶ addMessage() function in App.tsx
 *        ├─▶ STEP 1: Add user message to state immediately
 *        │   └─▶ setMessages([...messages, newMessage])
 *        │       └─▶ User sees their message appear instantly
 *        │
 *        └─▶ STEP 2: Call API for assistant response
 *            └─▶ sendChatMessage(messages, userText)
 * 
 * 4. API SERVICE (api.ts)
 *    └─▶ Sends POST request to http://localhost:8000/chat
 *        ├─▶ Request body:
 *        │   {
 *        │     "messages": [...],  // Full conversation history
 *        │     "current_message": "What club should I use?"
 *        │   }
 *        │
 *        └─▶ Waits for response...
 * 
 * 5. BACKEND PROCESSES (server.py)
 *    └─▶ /chat endpoint receives request
 *        ├─▶ Extracts user's message
 *        ├─▶ Processes with AI logic (currently simple rules)
 *        └─▶ Returns response:
 *            {
 *              "role": "assistant",
 *              "message": "I'd recommend a 7-iron for this shot.",
 *              "timestamp": "2025-12-04T22:15:21.000Z"
 *            }
 * 
 * 6. API SERVICE RECEIVES RESPONSE
 *    └─▶ Transforms JSON into Message object
 *        └─▶ Returns to App.tsx
 * 
 * 7. APP ADDS ASSISTANT MESSAGE
 *    └─▶ STEP 3: Add assistant message to state
 *        └─▶ setMessages([...updatedMessages, assistantResponse])
 *            └─▶ ChatHistory re-renders
 *                └─▶ User sees assistant's response appear
 * 
 * 
 * KEY FILES AND THEIR ROLES:
 * ==========================
 * 
 * FRONTEND:
 * ---------
 * 
 * 1. src/api.ts
 *    - Handles all HTTP communication with backend
 *    - sendChatMessage(): Sends user message, receives AI response
 *    - Error handling and fallback messages
 * 
 * 2. src/App.tsx
 *    - Manages messages state
 *    - addMessage(): Now async function that calls API
 *    - Coordinates user message + API response
 * 
 * 3. src/types.ts
 *    - Defines Message interface
 *    - Ensures type safety across frontend
 * 
 * BACKEND:
 * --------
 * 
 * 1. backend/server.py
 *    - FastAPI application
 *    - CORS middleware for cross-origin requests
 *    - /chat endpoint that processes messages
 *    - Returns AI-generated responses
 * 
 * 
 * API REQUEST/RESPONSE FORMAT:
 * ============================
 * 
 * REQUEST to POST /chat:
 * {
 *   "messages": [
 *     {
 *       "role": "user",
 *       "message": "Hello!",
 *       "timestamp": "2025-12-04T22:00:00.000Z"
 *     },
 *     {
 *       "role": "assistant",
 *       "message": "Hi! How can I help?",
 *       "timestamp": "2025-12-04T22:00:01.000Z"
 *     }
 *   ],
 *   "current_message": "What club should I use for 150 yards?"
 * }
 * 
 * RESPONSE from POST /chat:
 * {
 *   "role": "assistant",
 *   "message": "For 150 yards, I'd recommend a 7-iron.",
 *   "timestamp": "2025-12-04T22:00:05.000Z"
 * }
 * 
 * 
 * ERROR HANDLING:
 * ===============
 * 
 * The system handles errors at multiple levels:
 * 
 * 1. Network Errors (api.ts)
 *    - If fetch() fails (network down, server unreachable)
 *    - Returns fallback message: "Sorry, I encountered an error..."
 * 
 * 2. HTTP Errors (api.ts)
 *    - If response.ok is false (4xx, 5xx status codes)
 *    - Throws error, caught by try/catch
 * 
 * 3. App-level Errors (App.tsx)
 *    - Catches any errors from sendChatMessage()
 *    - Adds error message to chat history
 *    - User sees error message instead of app crashing
 * 
 * 
 * CORS CONFIGURATION:
 * ===================
 * 
 * The backend allows requests from the frontend:
 * 
 * - Frontend runs on: http://localhost:5173 (Vite default)
 * - Backend runs on: http://localhost:8000 (FastAPI default)
 * - CORS middleware in server.py allows cross-origin requests
 * 
 * 
 * ASYNC/AWAIT PATTERN:
 * ====================
 * 
 * The addMessage function is now async:
 * 
 * const addMessage = async (newMessage: Message) => {
 *   // Add user message immediately
 *   setMessages([...messages, newMessage]);
 *   
 *   // Wait for API response
 *   const response = await sendChatMessage(...);
 *   
 *   // Add assistant message when ready
 *   setMessages([...messages, newMessage, response]);
 * };
 * 
 * This allows the UI to remain responsive while waiting for the API.
 * 
 * 
 * TESTING THE API:
 * ================
 * 
 * 1. Start the backend:
 *    cd backend
 *    fastapi dev server.py
 *    (Should be running on http://localhost:8000)
 * 
 * 2. Start the frontend:
 *    cd caddybot
 *    npm run dev
 *    (Should be running on http://localhost:5173)
 * 
 * 3. Test in browser:
 *    - Type a message like "What club should I use?"
 *    - Click Send
 *    - Watch for:
 *      a) Your message appears immediately
 *      b) Brief pause while API processes
 *      c) Assistant's response appears
 * 
 * 4. Check browser console:
 *    - Should see no errors
 *    - May see logs from api.ts
 * 
 * 5. Test error handling:
 *    - Stop the backend server
 *    - Send a message
 *    - Should see error message in chat
 * 
 * 
 * UPGRADING TO REAL AI:
 * =====================
 * 
 * Currently, server.py uses simple if/else logic.
 * To add real AI (OpenAI, Anthropic, etc.):
 * 
 * 1. Install AI SDK in backend:
 *    pip install openai
 * 
 * 2. Update server.py /chat endpoint:
 *    from openai import OpenAI
 *    
 *    client = OpenAI(api_key="your-key")
 *    
 *    @app.post("/chat")
 *    async def chat(request: ChatRequest):
 *        response = client.chat.completions.create(
 *            model="gpt-4",
 *            messages=[
 *                {"role": m.role, "content": m.message}
 *                for m in request.messages
 *            ]
 *        )
 *        return ChatResponse(
 *            role="assistant",
 *            message=response.choices[0].message.content,
 *            timestamp=datetime.datetime.now().isoformat()
 *        )
 * 
 * 3. No frontend changes needed!
 *    The API contract stays the same.
 * 
 * 
 * PERFORMANCE CONSIDERATIONS:
 * ===========================
 * 
 * 1. User Message Appears Instantly
 *    - We add it to state before calling API
 *    - User gets immediate feedback
 * 
 * 2. Assistant Message May Take Time
 *    - Depends on API/AI processing speed
 *    - Consider adding loading indicator
 * 
 * 3. Conversation History Sent Each Time
 *    - Full messages array sent to backend
 *    - Backend can use context for better responses
 *    - May want to limit history length for large conversations
 * 
 * 
 * FUTURE ENHANCEMENTS:
 * ====================
 * 
 * - Add typing indicator while waiting for response
 * - Implement message streaming (show response as it's generated)
 * - Add retry logic for failed requests
 * - Cache responses for repeated questions
 * - Add rate limiting on backend
 * - Implement user authentication
 * - Store conversation history in database
 * 
 */
