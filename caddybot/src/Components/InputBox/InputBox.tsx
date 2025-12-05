import { useState } from 'react';
import type { Message } from '../../types';
import './InputBox.css';

/**
 * InputBoxProps Interface
 * 
 * Defines what props this component expects to receive from its parent (App)
 */
interface InputBoxProps {
    onSendMessage: (message: Message) => void;  // Callback function from App to add messages
}

/**
 * InputBox Component - User Input Handler
 * 
 * RECEIVES FROM PARENT: onSendMessage callback function
 * SENDS TO PARENT: Message objects (via callback)
 * 
 * DATA FLOW (UPWARD):
 * ------------------
 * 1. User types text → stored in local inputValue state
 * 2. User clicks Send → handleSend() is triggered
 * 3. handleSend() creates a Message object with user's text
 * 4. handleSend() calls onSendMessage(newMessage) → sends data UP to App
 * 5. App receives the Message and adds it to its messages state
 * 6. App's state update triggers re-render of ChatHistory
 * 
 * This component does NOT store messages - it only creates them and sends them up!
 * 
 * @param onSendMessage - Callback function from App to handle new messages
 */
function InputBox({ onSendMessage }: InputBoxProps) {
    // LOCAL STATE: Only stores the current input text (not the full messages array)
    const [inputValue, setInputValue] = useState('');

    /**
     * handleSend Function
     * 
     * This is where the Message object is CREATED and sent UP to the parent.
     * 
     * OBJECT CREATION FLOW:
     * --------------------
     * 1. Validate: Check if input is not empty
     * 2. Create: Build a new Message object with:
     *    - role: 'user' (hardcoded, since this is user input)
     *    - message: the text from inputValue state
     *    - timestamp: current datetime in ISO format
     * 3. Send UP: Call onSendMessage() to pass the Message to App
     * 4. Reset: Clear the input field for next message
     */
    const handleSend = () => {
        // Guard clause: Don't send empty messages
        if (inputValue.trim() === '') return;

        // CREATE MESSAGE OBJECT: This is where the Message is born!
        const newMessage: Message = {
            role: 'user',  // Always 'user' for messages from this input
            message: inputValue,  // The text the user typed
            timestamp: new Date().toISOString()  // Current time in ISO format
        };

        // SEND MESSAGE UP: Call the callback function from App
        // This passes the Message object UP the component tree to App
        // App will then add it to the messages state array
        onSendMessage(newMessage);

        setInputValue(''); // Clear input after sending
    };

    /**
     * handleKeyPress Function
     * 
     * Allows users to send messages by pressing Enter key
     * Provides better UX than requiring mouse clicks
     */
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();  // Trigger the same send logic as the button
        }
    };

    return (
        <div className="input-box">
            <input
                type="text"
                placeholder="Type your message..."
                value={inputValue}  // Controlled input: value comes from state
                onChange={(e) => setInputValue(e.target.value)}  // Update state on every keystroke
                onKeyPress={handleKeyPress}  // Handle Enter key
            />
            <button onClick={handleSend}>Send</button>  {/* Trigger message creation and sending */}
        </div>
    );
}

export default InputBox;
