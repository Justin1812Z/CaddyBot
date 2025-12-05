import type { Message } from './types';

/**
 * API Service for CaddyBot
 * 
 * This module handles all communication with the backend API.
 * It provides a clean interface for sending messages and receiving responses.
 */

const API_BASE_URL = 'http://localhost:8000';

/**
 * Send a chat message to the backend and get an AI response
 * 
 * DATA FLOW:
 * ---------
 * 1. Frontend calls this function with user's message + conversation history
 * 2. Function sends POST request to /chat endpoint
 * 3. Backend processes the message and generates a response
 * 4. Function receives the response and returns it as a Message object
 * 
 * @param messages - Full conversation history (array of all messages)
 * @param currentMessage - The latest message from the user
 * @returns Promise<Message> - The assistant's response as a Message object
 */
export async function sendChatMessage(
    messages: Message[],
    currentMessage: string
): Promise<Message> {
    try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: messages,
                current_message: currentMessage,
            }),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        // Transform API response into Message object
        return {
            role: data.role,
            message: data.message,
            timestamp: data.timestamp,
        };
    } catch (error) {
        console.error('Error calling chat API:', error);

        // Return a fallback error message
        return {
            role: 'assistant',
            message: 'Sorry, I encountered an error. Please try again.',
            timestamp: new Date().toISOString(),
        };
    }
}

/**
 * Check if the API is available
 * 
 * @returns Promise<boolean> - True if API is reachable
 */
export async function checkApiHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/`);
        return response.ok;
    } catch (error) {
        console.error('API health check failed:', error);
        return false;
    }
}
