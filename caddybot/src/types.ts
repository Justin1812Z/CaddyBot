export interface Message {
    role: 'user' | 'assistant';
    message: string;
    timestamp?: string;
}
