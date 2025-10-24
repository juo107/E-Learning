import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { askAssistant, askRecommend, chat, type AssistantResponse, type ChatTurn } from '../../services/assistant';

type ChatMessage = { role: 'user' | 'assistant'; text: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: 'Xin chào! Tôi có thể giúp bạn tìm khóa học phù hợp.' },
  ]);
  const listRef = useRef<HTMLDivElement | null>(null);
  // Robot illustration background for the chat box
  const robotBg = `url("data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 320'>
      <defs>
        <linearGradient id='g' x1='0' x2='0' y1='0' y2='1'>
          <stop offset='0%' stop-color='%232a2a72'/>
          <stop offset='100%' stop-color='%238100ff'/>
        </linearGradient>
      </defs>
      <rect x='40' y='60' width='160' height='200' rx='24' fill='url(#g)'/>
      <rect x='70' y='10' width='100' height='70' rx='16' fill='#3b82f6'/>
      <rect x='85' y='30' width='20' height='20' rx='4' fill='white'/>
      <rect x='135' y='30' width='20' height='20' rx='4' fill='white'/>
      <rect x='110' y='55' width='20' height='6' rx='3' fill='#0ea5e9'/>
      <rect x='15' y='90' width='25' height='100' rx='12' fill='#64748b' opacity='0.9'/>
      <rect x='200' y='90' width='25' height='100' rx='12' fill='#64748b' opacity='0.9'/>
      <rect x='65' y='105' width='110' height='70' rx='10' fill='white' opacity='0.12'/>
      <rect x='117' y='0' width='6' height='14' rx='3' fill='#94a3b8'/>
      <circle cx='120' cy='-2' r='6' fill='#f59e0b'/>
    </svg>`)}")`;

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');
    setLoading(true);
    try {
      // Decide if user explicitly asked for recommendations
      const isRecommendIntent = (() => {
        const t = text.toLowerCase();
        const keywords = [
          'gợi ý', 'đề xuất', 'tư vấn khóa học', 'tìm khóa học', 'recommend',
          'suggest course', 'recommend course', 'khóa học phù hợp', 'tìm giúp khóa học'
        ];
        // also allow slash command
        if (t.startsWith('/recommend') || t.startsWith('/goi-y') || t.startsWith('/de-xuat')) return true;
        return keywords.some(k => t.includes(k));
      })();

      if (isRecommendIntent) {
        // Only call recommend when explicitly asked
        const rec = await askRecommend(text, 3);
        const suggestions = Array.isArray(rec?.data) ? rec.data : [];
        const reply = suggestions.length
          ? `Gợi ý: ${suggestions.map((c: any) => c.Title || c.title).join(' | ')}`
          : 'Chưa có gợi ý phù hợp. Bạn có thể mô tả mục tiêu học hoặc chủ đề cụ thể?';
        setMessages((m) => [...m, { role: 'assistant', text: reply }]);
      } else {
        // Normal chat: ask general assistant, do not auto-suggest courses
        // Friendly reply for greetings
        const t = text.toLowerCase();
        const isGreeting = ['xin chào', 'chào', 'hello', 'hi', 'hey', 'hola', 'alo', 'chao']
          .some(k => t === k || t.startsWith(k + ' ') || t.endsWith(' ' + k));
        if (isGreeting) {
          setMessages((m) => [...m, { role: 'assistant', text: 'Xin chào! Tôi có thể giúp bạn tìm khóa học, trả lời câu hỏi, hoặc gợi ý lộ trình học. Nhập "/recommend Chủ đề" nếu bạn muốn tôi đề xuất khóa học nhé.' }]);
          return;
        }
        // Use AIService /chat for normal conversation
        try {
          const history: ChatTurn[] = messages.map(m => ({ role: m.role, text: m.text })).slice(-6);
          const r = await chat(text, history);
          const reply = r?.text || 'Đã nhận tin nhắn.';
          setMessages((m) => [...m, { role: 'assistant', text: reply }]);
        } catch {
          setMessages((m) => [...m, { role: 'assistant', text: 'Đã nhận tin nhắn. Bạn có thể nhập "/recommend Python cho người mới" để nhận gợi ý khóa học.' }]);
        }
      }
    } catch (e: any) {
      setMessages((m) => [...m, { role: 'assistant', text: 'Xin lỗi, hiện tôi không thể trả lời. Vui lòng thử lại sau.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        aria-label="Assistant"
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-4 z-40 h-14 w-14 rounded-full shadow-lg text-white bg-gradient-to-br from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 flex items-center justify-center"
      >
        <svg viewBox="0 0 64 64" className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="rb_g" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#e9d5ff" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <rect x="16" y="8" width="32" height="22" rx="6" fill="url(#rb_g)" />
          <rect x="12" y="28" width="40" height="24" rx="8" fill="#ffffff" fillOpacity="0.9" />
          <rect x="22" y="16" width="6" height="6" rx="2" fill="#111827" />
          <rect x="36" y="16" width="6" height="6" rx="2" fill="#111827" />
          <rect x="28" y="23" width="8" height="3" rx="1.5" fill="#4f46e5" />
          <rect x="31" y="4" width="2" height="6" rx="1" fill="#e5e7eb" />
          <circle cx="32" cy="2.5" r="2.5" fill="#f59e0b" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed right-4 bottom-20 z-40 w-80 sm:w-96 max-h-[70vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          style={{
            backgroundImage: robotBg,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            border: '1px solid rgba(148,163,184,0.25)'
          }}
        >
          <div className="h-12 flex items-center justify-between px-3 bg-white/70 dark:bg-gray-900/70 backdrop-blur border-b border-white/20 dark:border-gray-800/40">
            <div className="flex items-center gap-2">
              <div className="relative h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
                <span className="absolute -right-0.5 -bottom-0.5 block h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-gray-950" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold">EduBot</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Online</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-900">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-2 bg-white/55 dark:bg-gray-950/55 backdrop-blur-sm">
            {messages.map((m, idx) => (
              <div key={idx} className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${m.role === 'user' ? 'ml-auto bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'}`}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="text-xs text-gray-500">Assistant is typing...</div>
            )}
          </div>
          <div className="p-2 flex items-center gap-2 bg-white/70 dark:bg-gray-900/70 backdrop-blur border-t border-white/20 dark:border-gray-800/40">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
              placeholder="Nhập câu hỏi..."
              className="flex-1 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm outline-none"
            />
            <button onClick={send} disabled={loading} className="inline-flex items-center gap-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-3 py-2 disabled:opacity-50">
              <Send className="w-4 h-4" />
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
}


