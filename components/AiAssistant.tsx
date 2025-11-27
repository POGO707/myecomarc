import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Minimize2, Loader2, Sparkles } from 'lucide-react';
import { getProductRecommendation } from '../services/geminiService';
import { ChatMessage } from '../types';

const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello! I'm PantherBot. Looking for something specific or need a gift idea?" }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Format history for context (simplified)
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await getProductRecommendation(input, history);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-panther-accent hover:bg-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-purple-500/30 transition-all z-40 animate-bounce-slow"
        >
          <Sparkles size={24} />
        </button>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-panther-800 border border-panther-700 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-slide-up h-[500px]">
          {/* Header */}
          <div className="bg-panther-accent p-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-white">
              <Sparkles size={20} />
              <h3 className="font-bold">PantherBot AI</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <Minimize2 size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-panther-900/50">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    msg.role === 'user' 
                      ? 'bg-panther-accent text-white rounded-br-none' 
                      : 'bg-panther-700 text-gray-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-panther-700 p-3 rounded-lg rounded-bl-none flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-panther-accent" />
                  <span className="text-gray-400 text-xs">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-panther-800 border-t border-panther-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me anything..."
              className="flex-1 bg-panther-900 text-white text-sm rounded-lg px-4 py-2 border border-panther-700 focus:outline-none focus:border-panther-accent"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-panther-accent disabled:opacity-50 text-white p-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AiAssistant;
