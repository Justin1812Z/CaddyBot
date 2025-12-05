import { useState } from "react";
import type { Message } from "./types";
import { sendChatMessage } from "./api";
import "./App.css";
import ChatHistory from "./Components/ChatHistory/ChatHistory";
import InputBox from "./Components/InputBox/InputBox";

/**
 * App Component - The Root Component
 * 
 * This is the main component that manages the application's state.
 * It follows the "Lifting State Up" pattern in React.
 * 
 * DATA FLOW ARCHITECTURE:
 * ----------------------
 * 1. STATE LIVES HERE: The messages array is stored in this component's state
 * 2. DATA FLOWS DOWN: Messages are passed as props to child components
 * 3. CALLBACKS FLOW UP: Child components call functions to modify the state
 * 4. API INTEGRATION: When user sends message, we call backend API for response
 * 
 * This centralized approach ensures a single source of truth for all messages.
 */
function App() {
  // STATE: Central storage for all chat messages
  // This array contains Message objects with { role, message, timestamp }
  const [messages, setMessages] = useState<Array<Message>>([]);

  /**
   * CALLBACK FUNCTION: addMessage (with API Integration)
   * 
   * This function will be passed DOWN to the InputBox component as a prop.
   * When InputBox needs to add a new message, it calls this function.
   * 
   * NEW FLOW WITH API:
   * -----------------
   * 1. InputBox creates user Message object → calls addMessage()
   * 2. addMessage() adds user message to state
   * 3. addMessage() calls backend API with user's message + conversation history
   * 4. API returns assistant's response
   * 5. addMessage() adds assistant's response to state
   * 6. ChatHistory re-renders with both new messages
   * 
   * @param newMessage - A Message object created by InputBox component
   */
  const addMessage = async (newMessage: Message) => {
    // STEP 1: Add the user's message to state immediately
    // This creates a new array with the user's message
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    // STEP 2: Call the API to get assistant's response
    // We pass the full conversation history + the current message
    try {
      const assistantResponse = await sendChatMessage(
        updatedMessages,  // Full conversation history including the new user message
        newMessage.message  // The text of the user's message
      );

      // STEP 3: Add the assistant's response to state
      // This triggers another re-render with the assistant's message
      setMessages([...updatedMessages, assistantResponse]);

    } catch (error) {
      console.error('Error getting assistant response:', error);

      // If API fails, add an error message
      const errorMessage: Message = {
        role: 'assistant',
        message: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages([...updatedMessages, errorMessage]);
    }
  };

  return (
    <div className="app-container">
      <div className="chat-messages">
        {/* 
          PROP FLOW DOWN: Pass messages array to ChatHistory
          ChatHistory will receive this array and map over it to display ChatBubbles
          Every time messages state updates, ChatHistory automatically re-renders
        */}
        <ChatHistory messages={messages} />
      </div>

      {/* 
        CALLBACK FLOW UP: Pass addMessage function to InputBox
        InputBox will call this function when the user sends a message
        This allows InputBox to modify the state that lives in App
      */}
      <InputBox onSendMessage={addMessage} />
    </div>
  );
}

export default App;
