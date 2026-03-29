import React, { useState, useRef, useEffect } from 'react';
import { ChatService } from '../services/ChatService';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: 'Hello! I\'m Sentinel AI. Share a market ticker and insight, and I\'ll analyze it using live news data.',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const messagesEndRef = useRef(null);

  // Check if backend is online when component mounts and every 5 seconds
  useEffect(() => {
    const checkBackend = async () => {
      console.log("[ChatBot] Checking backend health...");
      const isOnline = await ChatService.healthCheck();
      setBackendOnline(isOnline);
      console.log("[ChatBot] Backend status updated:", isOnline);
    };
    
    // Check immediately
    checkBackend();
    
    // Re-check every 5 seconds
    const interval = setInterval(checkBackend, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !backendOnline) return;

    // Add user message to chat
    const userMessageId = Date.now();
    const userMessage = inputValue.trim();
    setMessages((prev) => [
      ...prev,
      {
        id: userMessageId,
        type: 'user',
        text: userMessage,
      },
    ]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Sample insight data - in production, this would come from external source
      const insightData = {
        ticker: extractTicker(userMessage) || 'RELIANCE.NS',
        sector: 'Technology',
        insight_text: userMessage,
        timestamp: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
      };

      // Convert existing messages to chat history format
      const chatHistory = messages
        .filter((msg) => msg.type !== 'ai' || msg.text.includes(':')) // Filter out system messages
        .map((msg) => ({
          user: msg.type === 'user' ? msg.text : '',
          ai: msg.type === 'ai' ? msg.text : '',
        }))
        .filter((turn) => turn.user || turn.ai);

      // Call the backend
      const response = await ChatService.sendMessage(
        userMessage,
        insightData,
        chatHistory
      );

      // Add AI response to chat
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: 'ai',
          text: response.ai_response,
          metadata: `📊 Latency: ${response.latency_seconds}s | 📰 Articles: ${response.snippets_procured}`,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: 'ai',
          text: `❌ Error: ${error.message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Extract ticker from message (e.g., "AAPL", "TCS.NS")
  const extractTicker = (text) => {
    const match = text.match(/([A-Z]{1,5}\.?[A-Z]{0,2})/);
    return match ? match[1] : null;
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-110 flex items-center justify-center z-40 border border-blue-400/30"
        title="Open Sentinel AI Chat"
      >
        <svg
          className="w-7 h-7 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
        {isOpen && (
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
            ×
          </span>
        )}
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl z-50 flex flex-col border border-slate-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              Sentinel AI
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1 rounded transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-700 text-slate-100 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  {msg.metadata && (
                    <p className="text-xs opacity-70 mt-1">{msg.metadata}</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 text-slate-100 px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Backend Status */}
          {!backendOnline && (
            <div className="px-4 py-2 bg-red-900/30 border-t border-red-800 text-red-300 text-xs text-center">
              ⚠️ Backend offline. Start: python -m uvicorn api:app --reload
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-slate-700 p-4 bg-slate-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about a stock move..."
                disabled={isLoading || !backendOnline}
                className="flex-1 bg-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim() || !backendOnline}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition font-medium"
              >
                {isLoading ? '...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
