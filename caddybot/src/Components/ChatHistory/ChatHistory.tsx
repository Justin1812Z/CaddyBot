import { useEffect, useRef } from 'react';
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
 * - The useEffect hook detects the change and scrolls to bottom
 * 
 * AUTO-SCROLL BEHAVIOR:
 * --------------------
 * This component automatically scrolls to the bottom whenever a new message is added.
 * This ensures users always see the latest message without manual scrolling.
 * 
 * @param messages - Array of Message objects from App's state
 */
function ChatHistory({ messages }: ChatHistoryProps) {
    /**
     * REF: messagesEndRef
     * 
     * A React ref that points to a DOM element at the bottom of the chat.
     * Refs allow us to directly access and manipulate DOM elements.
     * 
     * - useRef creates a mutable object that persists across re-renders
     * - We attach this ref to an invisible div at the bottom of the chat
     * - We can then call .scrollIntoView() on this element to scroll to it
     * 
     * The <HTMLDivElement> type tells TypeScript this ref will point to a div element
     * The (null) initializes the ref with null (no element attached yet)
     */
    const messagesEndRef = useRef<HTMLDivElement>(null);

    /**
     * EFFECT: Auto-scroll to bottom when messages change
     * 
     * useEffect runs side effects after the component renders.
     * In this case, we want to scroll to the bottom after new messages appear.
     * 
     * HOW IT WORKS:
     * ------------
     * 1. Component renders with new messages
     * 2. useEffect runs after the render is complete
     * 3. We call scrollToBottom() which scrolls the messagesEndRef into view
     * 
     * DEPENDENCY ARRAY [messages]:
     * ---------------------------
     * - This effect re-runs whenever the 'messages' array changes
     * - When a user sends a message → messages changes → effect runs → scroll to bottom
     * - When server responds → messages changes → effect runs → scroll to bottom
     * 
     * This ensures we scroll to bottom for BOTH user and server messages
     */
    useEffect(() => {
        scrollToBottom();
    }, [messages]);  // Re-run this effect whenever messages array changes

    /**
     * FUNCTION: scrollToBottom
     * 
     * Scrolls the chat container to show the bottom-most message.
     * 
     * HOW IT WORKS:
     * ------------
     * 1. Check if messagesEndRef.current exists (the div element is mounted)
     * 2. Call scrollIntoView() on that element to scroll it into the visible area
     * 
     * scrollIntoView() OPTIONS:
     * ------------------------
     * - behavior: 'smooth' → Creates a smooth animated scroll (vs instant jump)
     * - block: 'nearest' → Scrolls the minimum amount needed to show the element
     * 
     * WHY THE NULL CHECK?
     * ------------------
     * On the first render, the ref might not be attached yet, so we check
     * messagesEndRef.current exists before calling scrollIntoView()
     */
    const scrollToBottom = () => {
        // Only scroll if the ref is attached to a DOM element
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior: 'smooth',  // Smooth animated scroll
                block: 'nearest'     // Scroll minimum amount needed
            });
        }
    };

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

            {/*
              SCROLL ANCHOR: Invisible element at the bottom of the chat
              
              This div serves as a "scroll target" - we scroll this element into view
              to ensure the bottom of the chat is visible.
              
              - ref={messagesEndRef} → Attaches our ref to this DOM element
              - This div has no content and takes up no space
              - When we call scrollIntoView() on this element, the browser scrolls
                to show this element, which is at the very bottom of the chat
            */}
            <div ref={messagesEndRef} />
        </>
    );
}

export default ChatHistory;
