import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, Copy, Check, RefreshCw, HelpCircle, Code, Lightbulb, AlertTriangle } from 'lucide-react';
import { getApiBaseUrl } from '../../lib/apiConfig';

interface AiStudyTutorProps {
  lessonTitle: string;
  lessonDay: number;
  role: string;
  codeContext?: string;
  className?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  provider?: string;
}

export const AiStudyTutor: React.FC<AiStudyTutorProps> = ({
  lessonTitle,
  lessonDay,
  role,
  codeContext,
  className = '',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'welcome',
        role: 'assistant',
        content: `Hello! I am your 1-on-1 **NVIDIA NIM Engineering Mentor** for **Day ${lessonDay}: ${lessonTitle}**.\n\nYou can ask me to clarify complex concepts, generate interview questions, explain code line-by-line, or review edge cases. What would you like to explore?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: 'NVIDIA Cloud NIM'
      }
    ];
  });

  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [includeCodeContext, setIncludeCodeContext] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const q = textToSend || inputQuestion;
    if (!q.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: q.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const historyPayload = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch(`${getApiBaseUrl()}/api/ask-tutor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q.trim(),
          lessonTitle,
          lessonDay,
          role,
          codeContext: includeCodeContext ? codeContext : undefined,
          history: historyPayload
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: data.answer || "I've reviewed the concept and here are the core principles to master.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: data.provider || 'NVIDIA NIM'
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Connection interrupted';
      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `In modern **${lessonTitle}**, focus on building modular, testable components with defensive boundary validations. (Tutor note: ${errMsg})`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: 'Local Synthesizer'
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const quickPrompts = [
    { label: 'Analogy', icon: Lightbulb, query: `Can you explain ${lessonTitle} with a memorable real-world analogy?` },
    { label: 'Interview Q', icon: HelpCircle, query: `What is the most frequently asked technical interview question about ${lessonTitle}, and what is the ideal senior response?` },
    { label: 'Common Traps', icon: AlertTriangle, query: `What are 3 critical mistakes or anti-patterns engineers make when implementing ${lessonTitle}?` },
    { label: 'Code Example', icon: Code, query: `Show a minimal, clean production-grade code example illustrating ${lessonTitle} with error handling.` },
  ];

  return (
    <div className={`flex flex-col h-[560px] rounded-lg border border-stone dark:border-[#242832] bg-white dark:bg-[#121418] shadow-subtle overflow-hidden ${className}`}>
      {/* Header with zero brown background */}
      <div className="px-5 py-3.5 border-b border-stone-light dark:border-[#20242E] bg-paper-tint dark:bg-[#16181D] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-vermilion/10 text-vermilion flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-ink dark:text-[#F0F2F5] font-bold">
                1-on-1 AI Tutor // NVIDIA NIM
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-graphite dark:text-[#8A929E] truncate max-w-sm">
              Trained for {role} &bull; Day {lessonDay} Context Active
            </p>
          </div>
        </div>

        {codeContext && (
          <label className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-graphite dark:text-[#8A929E] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeCodeContext}
              onChange={(e) => setIncludeCodeContext(e.target.checked)}
              className="rounded text-vermilion focus:ring-vermilion text-xs"
            />
            <span>Include Code</span>
          </label>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-paper/30 dark:bg-[#0E1013]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded shrink-0 flex items-center justify-center text-xs font-mono font-bold ${
                m.role === 'user'
                  ? 'bg-ink dark:bg-[#20242E] text-paper dark:text-white'
                  : 'bg-vermilion text-white'
              }`}
            >
              {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-[85%] rounded-md p-3.5 text-xs space-y-2 border ${
                m.role === 'user'
                  ? 'bg-paper-tint dark:bg-[#181B22] border-stone dark:border-[#282E3A] text-ink dark:text-[#F0F2F5]'
                  : 'bg-white dark:bg-[#14161B] border-stone-light dark:border-[#222630] text-ink dark:text-[#F0F2F5] shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-4 text-[10px] font-mono text-graphite dark:text-[#7A8290] border-b border-stone-light/50 dark:border-[#20242E] pb-1">
                <span>{m.role === 'user' ? 'YOU' : m.provider || 'NVIDIA NIM'}</span>
                <div className="flex items-center gap-2">
                  <span>{m.timestamp}</span>
                  {m.role === 'assistant' && (
                    <button
                      onClick={() => handleCopy(m.id, m.content)}
                      className="hover:text-vermilion transition-colors"
                      title="Copy response"
                    >
                      {copiedMsgId === m.id ? <Check className="w-3 h-3 text-sage-dark" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>

              <div className="whitespace-pre-wrap leading-relaxed font-sans">
                {m.content}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded bg-vermilion text-white flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="p-3 rounded bg-white dark:bg-[#14161B] border border-stone-light dark:border-[#222630] text-xs text-graphite dark:text-[#8A929E] flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-vermilion" />
              <span className="font-mono text-[11px]">NVIDIA NIM is formulating response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-3 py-2 border-t border-stone-light dark:border-[#20242E] bg-paper-subtle/30 dark:bg-[#101215] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {quickPrompts.map((p, idx) => {
          const Icon = p.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSendMessage(p.query)}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-stone dark:border-[#242832] bg-white dark:bg-[#16181C] text-[11px] font-mono text-graphite dark:text-[#8A929E] hover:text-ink dark:hover:text-white hover:border-vermilion transition-all shrink-0 cursor-pointer disabled:opacity-50"
            >
              <Icon className="w-3 h-3 text-vermilion" />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Input Field */}
      <div className="p-3 border-t border-stone dark:border-[#242832] bg-white dark:bg-[#121418] flex items-center gap-2">
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder={`Ask about ${lessonTitle} or paste code to debug...`}
          disabled={isLoading}
          className="flex-1 px-3 py-2 text-xs rounded border border-stone dark:border-[#242832] bg-paper dark:bg-[#0A0B0D] text-ink dark:text-[#F0F2F5] focus:outline-hidden focus:border-vermilion transition-colors font-mono"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputQuestion.trim() || isLoading}
          className="px-3.5 py-2 rounded bg-vermilion hover:bg-vermilion-dark text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ask</span>
        </button>
      </div>
    </div>
  );
};
