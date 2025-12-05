import './ChatBubble.css';

interface ChatBubbleProps {
    role: 'user' | 'assistant';
    message: string;
    timestamp?: string;
}

function ChatBubble({ role, message, timestamp }: ChatBubbleProps) {
    return (
        <div className={`chat-bubble ${role}`}>
            <div className="message-content">
                {message}
            </div>
            {timestamp && (
                <div className="message-timestamp">
                    {timestamp}
                </div>
            )}
        </div>
    )
}

export default ChatBubble;
