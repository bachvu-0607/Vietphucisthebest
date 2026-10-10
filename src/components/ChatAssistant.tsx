import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { Costume } from '../types';

interface ChatAssistantProps {
  currentCostume?: Costume | null;
  userId?: string;
}

type Message = { role: 'user' | 'model'; text: string };

// Gemini answers in light Markdown: render bullets and **bold** without injecting HTML.
function renderInline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : <React.Fragment key={i}>{part}</React.Fragment>
  );
}
function renderReply(text: string) {
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];
  const flush = () => {
    if (bullets.length) blocks.push(<ul key={blocks.length} className="list-disc pl-5 space-y-1">{bullets.map((b, i) => <li key={i}>{renderInline(b)}</li>)}</ul>);
    bullets = [];
  };
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    const bullet = /^[*-]\s+(.*)$/.exec(line);
    if (bullet) { bullets.push(bullet[1]); continue; }
    flush();
    if (line) blocks.push(<p key={blocks.length}>{renderInline(line.replace(/^#+\s*/, ''))}</p>);
  }
  flush();
  return blocks;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ currentCostume, userId }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [enabled, setEnabled] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Quota differs between guests and accounts, so refresh it when the session changes.
  useEffect(() => {
    if (!open) return;
    api.getChatUsage().then(usage => {
      if (!usage) return;
      setEnabled(usage.enabled);
      setRemaining(usage.remaining);
    });
  }, [open, userId]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  const suggestions = [
    currentCostume ? `${currentCostume.name} nên phối với gì?` : 'Đi chụp ảnh Tết nên mặc bộ nào?',
    'Cách dùng Studio phối đồ?',
    'Phân biệt áo giao lĩnh và áo đối khâm',
    'Làm sao tạo ảnh AI?',
  ];

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || busy) return;
    const next: Message[] = [...messages, { role: 'user', text: question }];
    setMessages(next);
    setInput('');
    setError(null);
    setBusy(true);
    try {
      const { reply, remaining: left } = await api.sendChat(next.slice(-12), currentCostume?.id);
      setMessages([...next, { role: 'model', text: reply }]);
      setRemaining(left);
    } catch (err: any) {
      setError(err.message);
      // Keep the unanswered question in the box so it can be retried.
      setMessages(messages);
      setInput(question);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {open && (
        <section
          role="dialog"
          aria-label="Trợ lý Việt Phục"
          className="fixed z-50 bottom-20 right-4 left-4 sm:left-auto sm:w-[380px] h-[min(560px,calc(100vh-112px))] flex flex-col rounded-2xl border border-[#F4C2CE] bg-white shadow-xl overflow-hidden"
          onKeyDown={e => { if (e.key === 'Escape') setOpen(false); }}
        >
          <header className="flex items-start justify-between gap-3 px-4 py-3 border-b border-[#F7D6DE] bg-[#FFF5F7]">
            <div>
              <h2 className="font-serif font-bold text-[#1C1917] text-base">Trợ lý Việt Phục</h2>
              <p className="text-[11px] text-[#78716C] leading-snug">
                Hỏi về trang phục, cách phối và cách dùng ứng dụng.
                {remaining !== null && enabled && <> Còn <strong className="text-[#C84B69]">{remaining}</strong> lượt hôm nay.</>}
              </p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Đóng trợ lý"
              className="p-1.5 rounded-lg text-[#78716C] hover:text-[#C84B69] hover:bg-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </header>

          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm" aria-live="polite">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-[#57534E]">
                  Xin chào! Mình có thể giúp bạn chọn trang phục theo dịp, gợi ý phối đồ hoặc hướng dẫn dùng các chức năng của ứng dụng.
                </p>
                <div className="flex flex-col gap-2">
                  {suggestions.map(s => (
                    <button key={s} type="button" disabled={!enabled} onClick={() => send(s)}
                      className="text-left text-xs px-3 py-2 rounded-xl border border-[#F4C2CE] text-[#6E2E3E] hover:bg-[#FFF0F4] disabled:opacity-50 cursor-pointer">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div className={m.role === 'user'
                  ? 'max-w-[85%] rounded-2xl rounded-br-sm bg-[#C84B69] text-white px-3 py-2 whitespace-pre-wrap'
                  : 'max-w-[90%] rounded-2xl rounded-bl-sm bg-[#FFF5F7] border border-[#F7D6DE] text-[#1C1917] px-3 py-2 space-y-2'}>
                  {m.role === 'user' ? m.text : renderReply(m.text)}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex items-center gap-2 text-xs text-[#78716C]">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang soạn câu trả lời…
              </div>
            )}
            {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
            {!enabled && <p className="text-xs text-[#78716C]">Trợ lý hiện chưa được bật trên máy chủ.</p>}
          </div>

          <form className="border-t border-[#F7D6DE] p-3 space-y-2" onSubmit={e => { e.preventDefault(); send(input); }}>
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
                rows={2}
                maxLength={1500}
                disabled={!enabled}
                placeholder="Nhập câu hỏi…"
                aria-label="Câu hỏi cho trợ lý"
                className="flex-1 resize-none rounded-xl border border-[#F4C2CE] px-3 py-2 text-sm focus:outline-none focus:border-[#C84B69] disabled:bg-gray-50"
              />
              <button type="submit" disabled={busy || !input.trim() || !enabled} aria-label="Gửi"
                className="p-2.5 rounded-xl bg-[#C84B69] hover:bg-[#B33B58] text-white disabled:opacity-40 cursor-pointer">
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-[#A8A29E] leading-snug">
              Câu trả lời do AI tạo, có thể chưa chính xác. Không nhập thông tin cá nhân. Lịch sử trò chuyện mất khi tải lại trang.
            </p>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Đóng trợ lý' : 'Mở trợ lý Việt Phục'}
        aria-expanded={open}
        className="fixed z-50 bottom-4 right-4 flex items-center gap-2 rounded-full bg-[#C84B69] hover:bg-[#B33B58] text-white shadow-lg px-4 py-3 text-sm font-semibold cursor-pointer"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        <span className="hidden sm:inline">{open ? 'Đóng' : 'Hỏi trợ lý'}</span>
      </button>
    </>
  );
};
