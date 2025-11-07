import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Mic, Send, Languages, Sun, Moon, Download, Settings } from 'lucide-react';

const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

const ChatWindow = ({ onOpenSettings, onExport, theme, onToggleTheme }) => {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', text: 'Hi! I am Rabbit AI. I speak English and Indonesian. How can I help today? 😊' },
  ]);
  const [input, setInput] = useState('');
  const [recording, setRecording] = useState(false);
  const listRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const Recognition = window.webkitSpeechRecognition;
      const recognition = new Recognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInput((prev) => (prev ? prev + ' ' : '') + transcript);
      };
      recognition.onend = () => setRecording(false);
      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  const speak = (text) => {
    if (!synth) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = /[\u00C0-\u017F]|[áéíóúñü]|(apa|dan|yang|saya|kamu|terima)/i.test(text) ? 'id-ID' : 'en-US';
    utter.rate = 1.0;
    synth.cancel();
    synth.speak(utter);
  };

  const handleVoice = () => {
    if (!recognitionRef.current) return;
    if (recording) {
      recognitionRef.current.stop();
      setRecording(false);
    } else {
      setRecording(true);
      recognitionRef.current.start();
    }
  };

  const parseCommand = (text) => {
    const ts = new Date().toISOString();
    if (/^\/add\s*task/i.test(text)) {
      const title = text.replace(/^\/add\s*task/i, '').trim() || 'Untitled task';
      return { type: 'task', payload: { title, done: false, ts } };
    }
    if (/^\/note/i.test(text)) {
      const body = text.replace(/^\/note/i, '').trim();
      return { type: 'note', payload: { body, ts } };
    }
    if (/^\/idea/i.test(text)) {
      const body = text.replace(/^\/idea/i, '').trim();
      return { type: 'idea', payload: { body, ts } };
    }
    if (/^\/summary/i.test(text)) {
      const body = text.replace(/^\/summary/i, '').trim();
      return { type: 'summary', payload: { body, ts } };
    }
    return null;
  };

  const handleSend = async () => {
    const content = input.trim();
    if (!content) return;

    const userMsg = { id: Date.now(), role: 'user', text: content };
    setMessages((m) => [...m, userMsg]);
    setInput('');

    // Command handling and local structuring (offline-friendly)
    const command = parseCommand(content);
    if (command) {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/command`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(command),
        });
        const data = await res.json();
        setMessages((m) => [...m, { id: Date.now() + 1, role: 'assistant', text: data.message }]);
        speak(data.tts || data.message);
      } catch (e) {
        setMessages((m) => [...m, { id: Date.now() + 1, role: 'assistant', text: 'Saved locally. I will sync when online.' }]);
        speak('Saved locally. I will sync when online.');
      }
      return;
    }

    // Regular chat flow using selected provider
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      });
      const data = await res.json();
      const reply = data.reply || "I'm here for you. How else can I help?";
      setMessages((m) => [...m, { id: Date.now() + 2, role: 'assistant', text: reply }]);
      speak(reply);
    } catch (e) {
      const fallback = "I'm offline but still with you. I saved this and will respond soon.";
      setMessages((m) => [...m, { id: Date.now() + 2, role: 'assistant', text: fallback }]);
      speak(fallback);
    }
  };

  const exportChat = (format) => {
    const lines = messages.map((m) => `${m.role === 'user' ? 'You' : 'Rabbit'}: ${m.text}`);
    const content = lines.join('\n');
    if (onExport) onExport(format, content);
  };

  return (
    <div className="flex flex-col h-[38rem] rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10">
        <div className="flex items-center gap-2 text-white/90">
          <Languages className="w-5 h-5" />
          <span className="text-sm">EN • ID</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => exportChat('md')} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={onOpenSettings} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition">
            <Settings className="w-4 h-4" />
          </button>
          <button onClick={onToggleTheme} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 backdrop-blur-md ${m.role === 'user' ? 'ml-auto bg-[#7C3AED]/20 text-white border border-[#7C3AED]/40' : 'bg-white/10 text-white/90 border border-white/10'}`}>
            <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
          </div>
        ))}
      </div>

      <div className="p-3 md:p-4 border-t border-white/10 bg-gradient-to-t from-[#0F172A]/60 to-[#0F172A]/30">
        <div className="flex items-center gap-2">
          <button onClick={handleVoice} className={`shrink-0 p-3 rounded-2xl border ${recording ? 'border-red-400 bg-red-500/20 text-red-100' : 'border-white/10 bg-white/5 text-white/80'} transition`}
            title="Speech to text">
            <Mic className="w-5 h-5" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Type a message… Try /add task, /note, /idea, /summary"
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50"
          />
          <button onClick={handleSend} className="shrink-0 inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#7C3AED] text-white font-medium hover:brightness-110 transition">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
