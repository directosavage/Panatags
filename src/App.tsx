import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  PhoneCall, 
  PackageCheck, 
  BookOpen, 
  Megaphone,
  WifiOff
} from 'lucide-react';
import { Language } from './types';
import { Header } from './components/Header';
import { ChatTab } from './components/ChatTab';
import { HotlinesTab } from './components/HotlinesTab';
import { GoBagTab } from './components/GoBagTab';
import { DisasterGuidesTab } from './components/DisasterGuidesTab';
import { SirenToolTab } from './components/SirenToolTab';
import { PWAInstallModal } from './components/PWAInstallModal';
import { IceCardModal } from './components/IceCardModal';
import { useOnlineStatus } from './hooks/useOnlineStatus';

type TabType = 'chat' | 'hotlines' | 'gobag' | 'guides' | 'siren';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [language, setLanguage] = useState<Language>(() => {
    try {
      return (localStorage.getItem('panatag_lang') as Language) || 'fil';
    } catch {
      return 'fil';
    }
  });

  const [blackoutMode, setBlackoutMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('panatag_blackout') === 'true';
    } catch {
      return false;
    }
  });

  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isIceModalOpen, setIsIceModalOpen] = useState(false);

  const isOnline = useOnlineStatus();

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    try {
      localStorage.setItem('panatag_lang', newLang);
    } catch {
      // ignore
    }
  };

  const handleToggleBlackout = () => {
    setBlackoutMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('panatag_blackout', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <div className={`min-h-[100dvh] flex flex-col font-sans transition-colors duration-200 ${
      blackoutMode 
        ? 'bg-black text-white selection:bg-red-900 selection:text-white' 
        : 'bg-slate-950 text-slate-100 selection:bg-red-600 selection:text-white'
    }`}>
      {/* Header */}
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        blackoutMode={blackoutMode}
        onToggleBlackoutMode={handleToggleBlackout}
        onOpenIceModal={() => setIsIceModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

      {/* Main Content Area: Chat is flex-1 overflow-hidden, other tabs scroll with bottom padding */}
      <main className={`flex-1 ${activeTab === 'chat' ? 'overflow-hidden flex flex-col' : 'pb-24 overflow-y-auto'}`}>
        {activeTab === 'chat' && (
          <ChatTab language={language} blackoutMode={blackoutMode} />
        )}
        {activeTab === 'hotlines' && (
          <HotlinesTab language={language} blackoutMode={blackoutMode} />
        )}
        {activeTab === 'gobag' && (
          <GoBagTab language={language} blackoutMode={blackoutMode} />
        )}
        {activeTab === 'guides' && (
          <DisasterGuidesTab language={language} blackoutMode={blackoutMode} />
        )}
        {activeTab === 'siren' && (
          <SirenToolTab blackoutMode={blackoutMode} />
        )}
      </main>

      {/* Floating Offline Notification (if offline) */}
      {!isOnline && activeTab !== 'chat' && (
        <div className="fixed bottom-20 left-4 z-30 flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xl shadow-amber-950/50">
          <WifiOff className="w-4 h-4" />
          <span>Naka-Offline Ka — Gumagana ang Panatag nang Walang Internet</span>
        </div>
      )}

      {/* Bottom Sticky Navigation */}
      <nav className={`fixed bottom-0 inset-x-0 z-40 h-16 border-t transition-colors ${
        blackoutMode 
          ? 'bg-black border-red-950/80 text-slate-400' 
          : 'bg-slate-900/95 backdrop-blur-md border-slate-800 text-slate-400'
      }`}>
        <div className="max-w-md mx-auto grid grid-cols-5 h-full">
          {/* Chat Tab */}
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center justify-center gap-1 transition-all ${
              activeTab === 'chat' 
                ? 'text-red-500 font-bold scale-105' 
                : 'hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">Chatbot</span>
          </button>

          {/* Hotlines Tab */}
          <button
            onClick={() => setActiveTab('hotlines')}
            className={`flex flex-col items-center justify-center gap-1 transition-all ${
              activeTab === 'hotlines' 
                ? 'text-red-500 font-bold scale-105' 
                : 'hover:text-slate-200'
            }`}
          >
            <PhoneCall className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">Hotlines</span>
          </button>

          {/* Go-Bag Tab */}
          <button
            onClick={() => setActiveTab('gobag')}
            className={`flex flex-col items-center justify-center gap-1 transition-all ${
              activeTab === 'gobag' 
                ? 'text-red-500 font-bold scale-105' 
                : 'hover:text-slate-200'
            }`}
          >
            <PackageCheck className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">Go-Bag</span>
          </button>

          {/* Disaster Guides Tab */}
          <button
            onClick={() => setActiveTab('guides')}
            className={`flex flex-col items-center justify-center gap-1 transition-all ${
              activeTab === 'guides' 
                ? 'text-red-500 font-bold scale-105' 
                : 'hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">Gabay</span>
          </button>

          {/* Siren / SOS Tab */}
          <button
            onClick={() => setActiveTab('siren')}
            className={`flex flex-col items-center justify-center gap-1 transition-all ${
              activeTab === 'siren' 
                ? 'text-red-500 font-bold scale-105' 
                : 'hover:text-slate-200'
            }`}
          >
            <Megaphone className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">Siren / SOS</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      <IceCardModal
        isOpen={isIceModalOpen}
        onClose={() => setIsIceModalOpen(false)}
      />
    </div>
  );
}
