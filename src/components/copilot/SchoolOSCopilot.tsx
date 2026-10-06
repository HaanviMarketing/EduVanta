import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, AlertCircle, RefreshCw, UserCheck, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { askCopilot } from '../../services/aiService';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
}

interface SchoolOSCopilotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SchoolOSCopilot: React.FC<SchoolOSCopilotProps> = ({ isOpen, onClose }) => {
  const { currentTenant, currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello ${currentUser?.name || 'Administrator'}. I am **SchoolOS Copilot**.\n\nI monitor attendance trends, academic performance, fee collection, and daily operations for **${currentTenant?.name || 'your school'}**.\n\nWhat can I assist you with today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'SchoolOS Engine',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Show students below 75% attendance',
    'Which teachers are on leave today?',
    'How much fee is outstanding?',
    'Generate today’s principal report',
    'Explain Grade 10 academic risk factors',
  ];

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || input;
    if (!prompt.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: prompt.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askCopilot({
        prompt: prompt.trim(),
        tenantName: currentTenant?.name || 'Delhi Public Academy',
        userRole: currentUser?.role || 'principal',
        userName: currentUser?.name || 'Principal',
        contextSummary: `Board: ${currentTenant?.board || 'CBSE'}, Minimum Attendance: ${currentTenant?.settings.minAttendancePercent || 75}%`,
      });

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: response.source,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ **Unable to process query**: ${err.message || 'Server connection error'}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm flex items-center gap-1.5">
              <span>SchoolOS Copilot</span>
              <span className="text-[10px] bg-teal-900/60 text-teal-300 px-1.5 py-0.5 rounded border border-teal-700/50">
                AI Native
              </span>
            </div>
            <div className="text-xs text-slate-400">
              {currentTenant?.name} · {currentUser?.role?.replace('_', ' ')}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              setMessages([
                {
                  id: 'welcome-reset',
                  sender: 'assistant',
                  text: `Session reset for ${currentTenant?.name}. How can I assist you?`,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ])
            }
            title="Reset Chat"
            className="p-1.5 text-slate-400 hover:text-white rounded"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Safety Model Banner */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
        <span className="flex items-center gap-1 font-medium text-slate-700">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          AI Safety Model:
        </span>
        <span className="font-mono text-slate-500">
          READ → ANALYZE → RECOMMEND
        </span>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-xl p-3.5 text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-teal-700 text-white rounded-br-none'
                  : 'bg-slate-100 text-slate-900 border border-slate-200/60 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>
            </div>
            <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-400">
              <span>{m.timestamp}</span>
              {m.source && <span>· {m.source}</span>}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
            <Sparkles className="w-4 h-4 animate-spin text-teal-600" />
            <span>Analyzing school data across tenant boundaries...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="text-[11px] font-medium text-slate-500 mb-2">Suggested queries:</div>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.slice(0, 3).map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-xs text-left bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-800 px-2.5 py-1 rounded-md transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask Copilot about students, fees, attendance..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-teal-600 focus:bg-white"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="mt-1 text-[10px] text-center text-slate-400">
          Executions like marks or fee modifications require human sign-off.
        </div>
      </div>
    </div>
  );
};
