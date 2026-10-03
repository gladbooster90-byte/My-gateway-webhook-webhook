import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, PhoneCall, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

export const ChatView: React.FC = () => {
  const { user, setActiveTab } = useWallet();

  const [messages, setMessages] = useState<
    Array<{ id: string; sender: 'user' | 'support'; text: string; time: string }>
  >([
    {
      id: 'm1',
      sender: 'support',
      text: `Hello ${user.name}! Welcome to VIP AI Wealth Support. How can we assist you with your account, MoMo payouts, or AI compute tasks today?`,
      time: 'Just now',
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickQuestions = [
    'Why is there a 20% withdrawal fee?',
    'What are the withdrawal operating hours?',
    'Can I change my registered MoMo number?',
    'How do I earn more AI Income daily?',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user' as const,
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = `Thank you for your question, ${user.name}. Our MoMo gateway is online and processing.`;

      const qLower = query.toLowerCase();
      if (qLower.includes('fee') || qLower.includes('20%')) {
        reply =
          'A standard 20% fee is deducted from every withdrawal. This covers Uganda telecom MoMo gateway settlement fees, server operational taxes, and network verification security.';
      } else if (qLower.includes('hour') || qLower.includes('time') || qLower.includes('when')) {
        reply =
          'Withdrawals are processed Sunday through Saturday from 09:00 to 20:00 (EAT). Processing time typically ranges between 2 minutes up to 24 hours depending on the MoMo network load.';
      } else if (qLower.includes('change') || qLower.includes('number') || qLower.includes('phone')) {
        reply =
          `Funds are sent exclusively to your registered MoMo number (${user.momoNumber}). For security against unauthorized access, only an admin can update your registered MoMo number.`;
      } else if (qLower.includes('ai') || qLower.includes('earn') || qLower.includes('vip')) {
        reply =
          'You can increase your daily AI Income by upgrading your VIP Tier in the Home or AI tab, running daily computational AI tasks, and inviting team members to earn 10% direct commissions!';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `s-${Date.now()}`,
          sender: 'support',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-20">
      {/* Chat Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 sticky top-0 z-20 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                <span>VIP 24/7 MoMo Support</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-[11px] text-slate-400">Average response: &lt; 1 min</div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('MyWithdraw')}
            className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20"
          >
            MyWithdraw
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 max-w-md mx-auto w-full px-4 py-4 space-y-3 overflow-y-auto">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-end gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'support' && (
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mb-1">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-amber-500 text-slate-950 font-semibold rounded-br-none shadow-md'
                  : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none shadow-sm'
              }`}
            >
              <p>{m.text}</p>
              <div
                className={`text-[9px] mt-1 text-right ${
                  m.sender === 'user' ? 'text-slate-800' : 'text-slate-500'
                }`}
              >
                {m.time}
              </div>
            </div>
            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mb-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs italic">
            <Bot className="w-4 h-4 text-amber-400 animate-spin" />
            <span>Support agent is typing response...</span>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="pt-2 space-y-1.5">
          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800 text-left transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="sticky bottom-14 bg-slate-900 border-t border-slate-800 px-4 py-2.5 z-20">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your question here..."
            className="flex-1 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold transition-all shadow-md active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
