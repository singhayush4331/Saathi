import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Send, AlertTriangle, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [loading, setLoading] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);
  const [helplines, setHelplines] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/chat/history/${sessionId}`, {
          withCredentials: true
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    };
    loadHistory();
  }, [sessionId]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date().toISOString() }]);
    setLoading(true);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/chat`,
        { message: userMessage, session_id: sessionId },
        { withCredentials: true }
      );

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response.data.response, timestamp: new Date().toISOString() }
      ]);

      if (response.data.is_crisis) {
        setShowCrisis(true);
        setHelplines(response.data.helplines);
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistory = async () => {
    try {
      await axios.delete(`${BACKEND_URL}/api/chat/history/${sessionId}`, {
        withCredentials: true
      });
      setMessages([]);
      toast.success('Chat history deleted');
    } catch (error) {
      toast.error('Failed to delete history');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col">
      <nav className="bg-white border-b border-[#E6E6E6] sticky top-0 z-10" data-testid="chat-nav">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate('/dashboard')}
                variant="ghost"
                size="icon"
                className="rounded-full"
                data-testid="back-to-dashboard-btn"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg font-bold text-[#1A2E26]" style={{fontFamily: 'Nunito, sans-serif'}}>AI Support Chat</h1>
                <p className="text-xs text-[#8C9E96]">Confidential & Encrypted</p>
              </div>
            </div>
            <Button
              onClick={handleDeleteHistory}
              variant="ghost"
              size="icon"
              className="text-[#EF4444] hover:bg-[#FEE2E2] rounded-full"
              data-testid="delete-history-btn"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      {showCrisis && helplines && (
        <div className="bg-[#EF4444] text-white py-4 px-4 crisis-banner" data-testid="crisis-banner">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="font-bold mb-2">Please Reach Out for Immediate Help</p>
                <p className="text-sm mb-2">If you're experiencing thoughts of self-harm or suicide, please contact:</p>
                <div className="space-y-1 text-sm">
                  {Object.entries(helplines).map(([name, number]) => (
                    <div key={name}>
                      <span className="font-semibold">{name}:</span> <a href={`tel:${number}`} className="underline">{number}</a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pb-24" data-testid="chat-messages">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#E0F2F1] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#4A8B71]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#1A2E26] mb-2" style={{fontFamily: 'Nunito, sans-serif'}}>Start Your Conversation</h2>
              <p className="text-[#4A665A]">Share what's on your mind. We're here to listen and support you.</p>
            </div>
          )}

          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                data-testid={`message-${msg.role}-${idx}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-[#4A8B71] text-white'
                      : 'bg-white border border-[#E6E6E6] text-[#1A2E26]'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown className="prose prose-sm max-w-none">{msg.content}</ReactMarkdown>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start" data-testid="typing-indicator">
                <div className="bg-white border border-[#E6E6E6] rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#4A8B71] rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-[#4A8B71] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-[#4A8B71] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E6E6E6] p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="rounded-full border-gray-200 focus:border-[#4A8B71] focus:ring-[#4A8B71]/20 bg-gray-50/50 h-12"
              disabled={loading}
              data-testid="chat-input"
            />
            <Button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              className="bg-[#4A8B71] text-white hover:bg-[#3D745E] rounded-full h-12 px-6"
              data-testid="send-message-btn"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;