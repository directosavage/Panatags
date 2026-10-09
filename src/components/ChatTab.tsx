import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  ShieldAlert, 
  Trash2, 
  Download, 
  CheckCircle2, 
  Cpu, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  AlertCircle 
} from 'lucide-react';
import { ChatMessage, Language } from '../types';
import { queryPanatagAI } from '../services/panatagAiEngine';
import { 
  localModelService, 
  AVAILABLE_MODELS, 
  ModelStatus, 
  DownloadProgress 
} from '../services/localModelService';

interface ChatTabProps {
  language: Language;
  blackoutMode: boolean;
}

const INITIAL_MESSAGES: Record<Language, ChatMessage[]> = {
  fil: [
    {
      id: 'init-1',
      sender: 'panatag',
      text: `👋 **Kumusta! Ako si Panatag**, ang iyong offline Philippine Disaster Buddy.\n\nTumatakbo ako nang direkta sa iyong device nang walang internet. Maaari kang mag-type agad ng tanong, o i-download ang Local AI Model sa itaas upang direktang magpatakbo ng neural LLM sa iyong telepono o computer.`,
      timestamp: Date.now(),
      offlineGenerated: true,
      suggestedActions: [
        'Signal #3 ano ang dapat gawin?',
        'May lindol: Duck, Cover, and Hold',
        'Ano ang laman ng 72-Hour Go-Bag?',
        'Baha at Leptospirosis (Doxycycline)',
        'Kagat ng aso (Rabies First Aid)',
        'Sunog sa mantika (Bawal ang tubig)',
        'Emergency Hotlines sa Pilipinas',
        'Paano i-deploy sa Cloudflare Pages?'
      ]
    }
  ],
  en: [
    {
      id: 'init-1',
      sender: 'panatag',
      text: `👋 **Hello! I am Panatag**, your offline Philippine Disaster Buddy.\n\nI run directly on your device without internet. You can ask emergency questions right away, or download the Local AI Model above to run a neural LLM directly on your phone or computer.`,
      timestamp: Date.now(),
      offlineGenerated: true,
      suggestedActions: [
        'Typhoon Signal #3 protocols',
        'Earthquake Duck Cover and Hold',
        'What goes inside a 72-hr Go-Bag?',
        'How to stop severe bleeding',
        'Philippine Emergency Hotlines',
        'How to deploy to Cloudflare Pages?'
      ]
    }
  ],
  ceb: [
    {
      id: 'init-1',
      sender: 'panatag',
      text: `👋 **Maayong adlaw! Ako si Panatag**, imong offline Philippine Disaster Buddy.\n\nNagdagan ko direkta sa imong device nga walay internet. Pwede ka mangutana dayon o i-download ang Local AI Model sa ibabaw para magdagan ang neural LLM sa imong cellphone o computer.`,
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
  const [modelStatus, setModelStatus] = useState<ModelStatus>(localModelService.getStatus());
  const [modelProgress, setModelProgress] = useState<DownloadProgress>(localModelService.getProgress());
  const [selectedModel, setSelectedModel] = useState<string>(localModelService.getSelectedModelId());
  const [showModelDownloader, setShowModelDownloader] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Subscribe to local model updates
  useEffect(() => {
    const unsubscribe = localModelService.subscribe(() => {
      setModelStatus(localModelService.getStatus());
      setModelProgress(localModelService.getProgress());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(`panatag_chat_history_${language}`, JSON.stringify(messages));
    } catch {
      // ignore
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, language]);

  const handleDownloadModel = async () => {
    await localModelService.loadModel(selectedModel);
  };

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

    // If local in-browser LLM is ready, run on-device generation!
    if (modelStatus === 'ready') {
      const botMessageId = `bot-${Date.now()}`;
      const initialBotMessage: ChatMessage = {
        id: botMessageId,
        sender: 'panatag',
        text: '',
        timestamp: Date.now(),
        offlineGenerated: true
      };

      setMessages((prev) => [...prev, initialBotMessage]);

      try {
        let streamText = '';
        await localModelService.generate(textToSend, (tokens) => {
          streamText = tokens;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMessageId ? { ...m, text: tokens } : m
            )
          );
        });

        // If generation output was blank or short, ensure final content
        if (!streamText) {
          const fallbackResp = await queryPanatagAI(textToSend, language);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMessageId
                ? {
                    ...m,
                    text: fallbackResp.answer,
                    suggestedActions: fallbackResp.suggestedActions
                  }
                : m
            )
          );
        }
      } catch (err) {
        console.warn('Local LLM generation issue, using core reasoning engine:', err);
        const coreResp = await queryPanatagAI(textToSend, language);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMessageId
              ? {
                  ...m,
                  text: coreResp.answer,
                  suggestedActions: coreResp.suggestedActions
                }
              : m
          )
        );
      } finally {
        setIsTyping(false);
      }
    } else {
      // Use instant zero-download Panatag engine
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
        }, 150);
      } catch (err) {
        console.error(err);
        setIsTyping(false);
      }
    }
  };

  const handleClearHistory = () => {
    setMessages(INITIAL_MESSAGES[language]);
    try {
      localStorage.removeItem(`panatag_chat_history_${language}`);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-57px-64px)] max-w-4xl mx-auto overflow-hidden">
      {/* Top Status & Model Downloader Toggle Bar */}
      <div className={`shrink-0 px-4 py-2 flex items-center justify-between border-b text-xs ${
        blackoutMode 
          ? 'bg-black border-red-950 text-slate-300' 
          : 'bg-slate-900/90 border-slate-800 text-slate-400'
      }`}>
        <div className="flex items-center gap-2">
          {modelStatus === 'ready' ? (
            <span className="flex items-center gap-1.5 font-bold text-emerald-400 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Local AI Model Active ({localModelService.isUsingWebGPU() ? 'WebGPU' : 'WASM'})</span>
            </span>
          ) : modelStatus === 'downloading' ? (
            <span className="flex items-center gap-1.5 font-bold text-amber-400 text-[11px] animate-pulse">
              <Download className="w-3.5 h-3.5" />
              <span>Nagda-download ng Model: {modelProgress.progress ? `${modelProgress.progress}%` : 'Inihahanda...'}</span>
            </span>
          ) : (
            <button
              onClick={() => setShowModelDownloader(!showModelDownloader)}
              className="flex items-center gap-1.5 font-semibold text-cyan-400 hover:text-cyan-300 text-[11px] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>I-download ang Local AI sa Phone/PC</span>
              {showModelDownloader ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {modelStatus !== 'downloading' && (
            <button
              onClick={() => setShowModelDownloader(!showModelDownloader)}
              className="p-1 rounded text-slate-400 hover:text-slate-200"
              title="Toggle Model Downloader"
            >
              <Cpu className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-red-400 transition-colors"
            title="Clear chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>I-reset</span>
          </button>
        </div>
      </div>

      {/* Model Downloader Accordion Card */}
      {showModelDownloader && (
        <div className="shrink-0 p-4 bg-slate-900/95 border-b border-slate-800 text-xs text-slate-200 space-y-3 animate-fade-in shadow-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Local On-Device AI Model Runner (Browser IndexedDB)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                I-download ang AI model weights nang minsan lamang. Maiimbak ito sa browser cache ng iyong cellphone o laptop para tumakbo nang 100% offline nang walang koneksyon sa server o internet.
              </p>
            </div>
            <button
              onClick={() => setShowModelDownloader(false)}
              className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
            >
              Isara
            </button>
          </div>

          {/* Model Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 block">Pumili ng Model:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AVAILABLE_MODELS.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                    selectedModel === m.id
                      ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-sm'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span>{m.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{m.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Download Progress Bar */}
          {modelStatus === 'downloading' && (
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-amber-400 flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 animate-bounce" />
                  {modelProgress.status || 'Nagda-download ng model weights...'}
                </span>
                <span className="text-cyan-400">
                  {modelProgress.progress ? `${modelProgress.progress}%` : 'Inihahanda...'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300 rounded-full"
                  style={{ width: `${modelProgress.progress || 10}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500">
                File: {modelProgress.file || 'model.onnx'} • Sine-save sa local IndexedDB ng device
              </p>
            </div>
          )}

          {/* Action Button */}
          {modelStatus !== 'downloading' && modelStatus !== 'ready' && (
            <button
              onClick={handleDownloadModel}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/40 transition-all active:scale-98"
            >
              <Download className="w-4 h-4" />
              I-download ang Local AI sa Phone/PC Ngayon
            </button>
          )}

          {modelStatus === 'ready' && (
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Naka-cache na sa device! Tumatakbo nang 100% Offline via {localModelService.isUsingWebGPU() ? 'WebGPU' : 'WASM'}.
              </span>
            </div>
          )}
        </div>
      )}

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
              {/* Message Header */}
              {msg.sender === 'panatag' && (
                <div className="flex items-center justify-between gap-3 mb-2 border-b border-slate-700/50 pb-1.5 text-[11px]">
                  <div className="flex items-center gap-1.5 text-red-400 font-bold">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                    <span>PANATAG</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    {modelStatus === 'ready' && (
                      <span className="text-cyan-400 font-semibold flex items-center gap-0.5">
                        <Zap className="w-3 h-3" /> On-Device LLM
                      </span>
                    )}
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              )}

              {/* Message Content */}
              <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {msg.text || (isTyping && msg.sender === 'panatag' ? 'Nag-iisip...' : '')}
              </div>
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
                  ? 'I-type dito ang iyong tanong (hal. Signal 3, Lindol, Baha, First Aid)...'
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
