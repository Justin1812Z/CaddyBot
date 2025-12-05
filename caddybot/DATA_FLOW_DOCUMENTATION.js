/**
 * ============================================================================
 * CADDYBOT DATA FLOW ARCHITECTURE
 * ============================================================================
 * 
 * This document explains how Message objects flow through the application.
 * 
 * 
 * COMPONENT HIERARCHY:
 * ===================
 * 
 *     App (Root Component)
 *      ├── ChatHistory (Display Component)
 *      │    └── ChatBubble (x N) (Presentation Component)
 *      └── InputBox (Input Component)
 * 
 * 
 * STATE MANAGEMENT PATTERN: "Lifting State Up"
 * ============================================
 * 
 * The messages array lives in App, not in the child components.
 * This creates a "single source of truth" for all chat messages.
 * 
 * 
 * DATA FLOW DIAGRAM:
 * ==================
 * 
 * DOWNWARD FLOW (Props):
 * ----------------------
 * 
 *   App.tsx
 *   │
 *   │ messages: Message[]  ──────────────┐
 *   │                                    │
 *   ├─────────────────────────────────┐  │
 *   │                                 │  │
 *   ▼                                 ▼  ▼
 *   ChatHistory                    InputBox
 *   │                                 │
 *   │ Receives:                       │ Receives:
 *   │ - messages array                │ - onSendMessage callback
 *   │                                 │
 *   │ maps over messages              │
 *   │                                 │
 *   ▼                                 │
 *   ChatBubble (for each message)     │
 *   │                                 │
 *   │ Receives:                       │
 *   │ - role                          │
 *   │ - message                       │
 *   │ - timestamp                     │
 *   │                                 │
 *   └─ Displays message               │
 *                                     │
 * 
 * UPWARD FLOW (Callbacks):
 * ------------------------
 * 
 *   InputBox
 *   │
 *   │ User types: "What club should I use?"
 *   │
 *   ▼
 *   handleSend() triggered
 *   │
 *   │ Creates Message object:
 *   │ {
 *   │   role: 'user',
 *   │   message: 'What club should I use?',
 *   │   timestamp: '2025-12-03T22:13:27.000Z'
 *   │ }
 *   │
 *   ▼
 *   onSendMessage(newMessage)  ──────────┐
 *                                        │
 *                                        │ Callback invoked
 *                                        │
 *                                        ▼
 *                                      App.tsx
 *                                        │
 *                                        │ addMessage() receives Message
 *                                        │
 *                                        ▼
 *                                      setMessages([...messages, newMessage])
 *                                        │
 *                                        │ State updated!
 *                                        │
 *                                        ▼
 *                                      React re-renders
 *                                        │
 *                                        ├─► ChatHistory gets new messages array
 *                                        │   │
 *                                        │   └─► Maps and creates new ChatBubble
 *                                        │
 *                                        └─► InputBox re-renders (no visible change)
 * 
 * 
 * COMPLETE MESSAGE LIFECYCLE:
 * ===========================
 * 
 * 1. CREATION (InputBox.tsx)
 *    - User types text → stored in inputValue state
 *    - User clicks Send or presses Enter
 *    - handleSend() creates a Message object:
 *      {
 *        role: 'user',
 *        message: <user's text>,
 *        timestamp: <current ISO datetime>
 *      }
 * 
 * 2. TRANSMISSION (InputBox → App)
 *    - InputBox calls onSendMessage(newMessage)
 *    - This callback was passed down from App as a prop
 *    - The Message object travels UP to App
 * 
 * 3. STORAGE (App.tsx)
 *    - App's addMessage() function receives the Message
 *    - setMessages([...messages, newMessage]) adds it to state
 *    - The messages array now contains the new Message
 * 
 * 4. DISTRIBUTION (App → ChatHistory)
 *    - React detects state change in App
 *    - App re-renders and passes updated messages array to ChatHistory
 *    - ChatHistory receives the new messages array as a prop
 * 
 * 5. RENDERING (ChatHistory → ChatBubble)
 *    - ChatHistory.map() iterates over messages array
 *    - For each Message object, creates a ChatBubble component
 *    - Passes role, message, and timestamp as individual props
 * 
 * 6. DISPLAY (ChatBubble.tsx)
 *    - ChatBubble receives the props
 *    - Renders the message in the UI
 *    - User sees their message appear on screen
 * 
 * 
 * KEY CONCEPTS:
 * =============
 * 
 * 1. SINGLE SOURCE OF TRUTH
 *    - Only App.tsx stores the messages array
 *    - All components read from or write to this one source
 *    - Prevents data inconsistencies
 * 
 * 2. UNIDIRECTIONAL DATA FLOW
 *    - Data flows DOWN through props
 *    - Events flow UP through callbacks
 *    - Never flows sideways between siblings
 * 
 * 3. CONTROLLED COMPONENTS
 *    - InputBox's input field is "controlled" by React state
 *    - value={inputValue} makes React the source of truth
 *    - onChange updates state, which updates the input
 * 
 * 4. IMMUTABILITY
 *    - setMessages([...messages, newMessage]) creates a NEW array
 *    - Never mutate state directly (e.g., messages.push())
 *    - React detects changes by comparing references
 * 
 * 5. COMPONENT RESPONSIBILITIES
 *    - App: Manages state, orchestrates data flow
 *    - ChatHistory: Transforms array into components
 *    - InputBox: Handles user input, creates Messages
 *    - ChatBubble: Displays a single message
 * 
 * 
 * TYPESCRIPT TYPES:
 * =================
 * 
 * Message Interface (from types.ts):
 * 
 *   interface Message {
 *     role: 'user' | 'assistant';
 *     message: string;
 *     timestamp?: string;
 *   }
 * 
 * This ensures type safety throughout the application.
 * Every Message object must have these properties.
 * 
 * 
 * FUTURE ENHANCEMENTS:
 * ====================
 * 
 * - Add assistant responses (AI integration)
 * - Persist messages to localStorage or backend
 * - Add message IDs for better React keys
 * - Implement message editing/deletion
 * - Add typing indicators
 * - Support rich media (images, files)
 * 
 */
