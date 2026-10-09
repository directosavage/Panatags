import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  ShieldAlert, 
  Trash2,
  HelpCircle
} from 'lucide-react';
import { ChatMessage, Language } from '../types';
import { queryPanatagAI, speakOfflineText, stopSpeaking } from '../services/panatagAiEngine';

interface ChatTabProps {
  language: Language;
  blackoutMode: boolean;
}

const INITIAL_MESSAGES: Record<Language, ChatMessage[]> = {
  fil: [
    {
      id: 'init-1',
      sender: 'panatag',
      text: `👋 **Kumusta! Ako si Panatag**, ang iyong offline Philippine Disaster Buddy.\n\nKahit mawalan ng internet o kuryente sa gitna ng bagyo o lindol, naririto ako upang magbigay ng agarang gabay sa kaligtasan, first aid, evacuation, at mga numero ng saklolo.\n\nI-type sa ibaba ang iyong tanong o sitwasyon para sa agarang tulong.`,
      timestamp: Date.now(),
      offlineGenerated: true,
      suggestedActions: [
        'Signal #3 ano ang dapat gawin?',
        'May lindol: Duck, Cover, and Hold',
        'Ano ang laman ng 72-Hour Go-Bag?',
        'Baha at Leptospirosis (Doxycycline)',
        'Kagat ng aso (Rabies First Aid)',
        'Sunog sa mantika (Bawal ang tubig)',
        'Paano i-deploy sa Cloudflare Pages?',
        'Gemma 4-E2B LiteRT-LM model info'
      ]
    }
  ],
  en: [
    {
      id: 'init-1',
      sender: 'panatag',
      text: `👋 **Hello! I am Panatag**, your offline Philippine Disaster Buddy.\n\nEven without internet or cellular connectivity, I provide instant emergency guidance, first aid steps, evacuation protocols, and emergency hotlines.\n\nType your question in the chatbox below to get immediate safety advice.`,
      timestamp: Date.now(),
      offlineGenerated: true,
      suggestedActions: [
        'Typhoon Signal #3 protocols',
        'Earthquake Duck Cover and Hold',
        'What goes inside a 72-hr Go-Bag?',
        'How to stop severe bleeding',
        'Philippine Emergency Hotlines',
        'Volcano Ashfall respiratory safety'
      ]
    }
  ],
  ceb: [
    {
      id: 'init-1',
      sender: 'panatag',
      text: `👋 **Maayong adlaw! Ako si Panatag**, imong offline Philippine Disaster Buddy.\n\nBisan mawad-an ug internet o signal samtang nagbagyo o linog, ania ko para mohatag ug dali nga giya sa kaluwasan, first aid, pagbakwit, ug mga numero sa rescue.\n\nI-type ang imong pangutana sa ubos para sa dinalian nga tabang.`,
      timestamp: Date.now(),
      offlineGenerated: true,
      suggestedActions: [
        'Signal #3 unsaon pag-andam?',
        'Linog: Duck, Cover, and Hold',
        'Unsay sulod sa Go-Bag?',
        'First aid sa pagdugo',
        'Emergency hotlines sa Pilipinas'
      ]
    }
  ]
};

export const ChatTab: React.FC<ChatTabProps> = ({ language, blackoutMode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem(`panatag_chat_history_${language}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return INITIAL_MESSAGES[language];
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(`panatag_chat_history_${language}`, JSON.stringify(messages));
    } catch {
      // storage quota or error
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, language]);

  const handleSend = async (customQuery?: string) => {
    const textToSend = (customQuery || input).trim();
    if (!textToSend || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customQuery) setInput('');
    setIsTyping(true);

    try {
      const response = await queryPanatagAI(textToSend, language);

      setTimeout(() => {
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'panatag',
          text: response.answer,
          timestamp: Date.now(),
          category: response.category,
          suggestedActions: response.suggestedActions,
          isEmergencyAlert: response.isHighAlert,
          offlineGenerated: true
        };

        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }, 250);
    } catch (err) {
      console.error(err);
      setIsTyping(false);
    }
  };

  const handleSpeak = (msg: ChatMessage) => {
    if (speakingId === msg.id) {
      stopSpeaking();
      setSpeakingId(null);
    } else {
      const success = speakOfflineText(msg.text, language);
      if (success) {
        setSpeakingId(msg.id);
      }
    }
  };

  const handleCopy = (msg: ChatMessage) => {
    navigator.clipboard?.writeText(msg.text);
    setCopiedId(msg.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    stopSpeaking();
    setSpeakingId(null);
    setMessages(INITIAL_MESSAGES[language]);
    try {
      localStorage.removeItem(`panatag_chat_history_${language}`);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-57px-64px)] max-w-4xl mx-auto overflow-hidden">
      {/* Top Emergency Status Bar */}
      <div className={`shrink-0 px-4 py-2 flex items-center justify-between border-b text-xs ${
        blackoutMode 
          ? 'bg-black border-red-950 text-slate-300' 
          : 'bg-slate-900/80 border-slate-800 text-slate-400'
      }`}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-semibold text-emerald-400 text-[11px]">
            {language === 'fil' ? 'Handang Tumulong • Hindi Kailangan ng Internet' : language === 'ceb' ? 'Andam Motabang • Walay Internet Gikinahanglan' : 'Ready to Assist • No Internet Needed'}
          </span>
        </div>
        <button
          onClick={handleClearHistory}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-red-400 transition-colors"
          title="Clear chat"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>I-reset</span>
        </button>
      </div>

      {/* Messages List Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-4 shadow-sm transition-all ${
                msg.sender === 'user'
                  ? 'bg-red-600 text-white rounded-br-none shadow-red-900/20'
                  : blackoutMode
                  ? 'bg-zinc-950 border border-red-900 text-slate-100 rounded-bl-none'
                  : 'bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-bl-none'
              } ${msg.isEmergencyAlert ? 'ring-1 ring-amber-500/50' : ''}`}
            >
              {/* Message Header for Panatag */}
              {msg.sender === 'panatag' && (
                <div className="flex items-center justify-between gap-3 mb-2 border-b border-slate-700/50 pb-1.5 text-[11px]">
                  <div className="flex items-center gap-1.5 text-red-400 font-bold">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                    <span>PANATAG</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}

              {/* Message Content */}
              <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {msg.text}
              </div>

              {/* Audio playback and copy buttons */}
              {msg.sender === 'panatag' && (
                <div className="mt-3 pt-2 border-t border-slate-700/50 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSpeak(msg)}
                      className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                      title="Pakinggan nang offline"
                    >
                      {speakingId === msg.id ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                          <span className="text-[10px] text-amber-300">Ihinto</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="text-[10px]">Pakinggan</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleCopy(msg)}
                      className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                      title="Kopyahin"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[10px] text-emerald-300">Na-kopya</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[10px]">Kopyahin</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Chips */}
            {msg.suggestedActions && msg.suggestedActions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5 max-w-[92%] sm:max-w-[85%]">
                {msg.suggestedActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(action)}
                    className="px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-red-950/80 border border-slate-700 hover:border-red-600 text-[11px] text-slate-300 hover:text-red-200 transition-all text-left flex items-center gap-1 active:scale-95 shadow-sm"
                  >
                    <span className="text-red-400 font-bold">›</span>
                    <span>{action}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 max-w-[90px]">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse [animation-delay:0.2s]" />
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse [animation-delay:0.4s]" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Prominent Docked Chatbox Input */}
      <div className={`shrink-0 p-3 border-t z-20 ${
        blackoutMode ? 'bg-black border-red-950' : 'bg-slate-900 border-slate-800'
      }`}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 max-w-4xl mx-auto"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                language === 'fil'
                  ? 'I-type dito ang iyong tanong (hal. Signal 3, Lindol, First Aid, Baha)...'
                  : language === 'ceb'
                  ? 'I-type dinhi ang imong pangutana (hal. Signal 3, Linog, First Aid)...'
                  : 'Type your emergency question here (e.g., Signal 3, Earthquake, First Aid)...'
              }
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border-2 border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-4 py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md shadow-red-900/40 transition-all active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
            aria-label="Send question"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ipadala</span>
          </button>
        </form>
      </div>
    </div>
  );
};
