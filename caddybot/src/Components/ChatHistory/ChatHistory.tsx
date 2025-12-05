import type { Message } from '../../types';
import './ChatHistory.css';
import ChatBubble from '../ChatBubble/ChatBubble';

/**
 * ChatHistoryProps Interface
 * 
 * Defines what props this component expects to receive from its parent (App)
 */
interface ChatHistoryProps {
    messages: Array<Message>;  // Array of Message objects passed down from App
}

/**
 * ChatHistory Component - Message Display Container
 * 
 * RECEIVES DATA FROM: App component (parent)
 * SENDS DATA TO: ChatBubble components (children)
 * 
 * DATA FLOW:
 * ---------
 * 1. App passes messages array as a prop → ChatHistory receives it
 * 2. ChatHistory maps over the array → Creates a ChatBubble for each message
 * 3. Each Message object is destructured and passed to ChatBubble as individual props
 * 
 * REACTIVITY:
 * ----------
 * When App's messages state updates (new message added), React automatically:
 * - Re-renders this component with the new messages array
 * - The .map() runs again with the updated array
 * - New ChatBubbles are created for new messages
 * 
 * @param messages - Array of Message objects from App's state
 */
function ChatHistory({ messages }: ChatHistoryProps) {
    return (
        <>
            {/* 
              ARRAY MAPPING: Transform each Message object into a ChatBubble component
              
              For each message in the array:
              - 'msg' is the current Message object { role, message, timestamp }
              - 'index' is the position in the array (0, 1, 2, ...)
              
              The key prop helps React identify which items changed/added/removed
            */}
            {messages.map((msg, index) => (
                <ChatBubble
                    key={index}  // Unique identifier for React's reconciliation algorithm
                    role={msg.role}  // Extract 'role' from Message object ('user' or 'assistant')
                    message={msg.message}  // Extract 'message' text from Message object
                    timestamp={msg.timestamp}  // Extract 'timestamp' from Message object
                />
            ))}
        </>
    );
}

export default ChatHistory;
