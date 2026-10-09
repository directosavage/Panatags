import React from 'react';
import { 
  ShieldAlert, 
  Wifi, 
  WifiOff, 
  Moon, 
  Sun, 
  UserPlus, 
  Download
} from 'lucide-react';
import { Language } from '../types';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  blackoutMode: boolean;
  onToggleBlackoutMode: () => void;
  onOpenIceModal: () => void;
  onOpenInstallModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  blackoutMode,
  onToggleBlackoutMode,
  onOpenIceModal,
  onOpenInstallModal
}) => {
  const isOnline = useOnlineStatus();
  const { isInstallable, isInstalled, install } = usePWAInstall();

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      onOpenInstallModal();
    }
  };

  return (
    <header className={`border-b sticky top-0 z-40 transition-colors ${
      blackoutMode 
        ? 'bg-black border-red-950 text-white' 
        : 'bg-slate-900/95 backdrop-blur-md border-slate-800 text-slate-100'
    }`}>
      {/* Top Banner: Emergency Status */}
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-900/40 ring-1 ring-red-400/30">
            <ShieldAlert className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black tracking-wider text-lg sm:text-xl text-white">
                PANATAG
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/60">
                DISASTER BUDDY
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Offline Emergency & Disaster Companion
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Online/Offline Status Badge */}
          <div 
            title={isOnline ? 'Connected' : 'Offline Mode (No Internet Required)'}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
              isOnline
                ? 'bg-emerald-950/50 border-emerald-800/60 text-emerald-300'
                : 'bg-amber-950/70 border-amber-600/70 text-amber-300 ring-1 ring-amber-500/30'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span>OFFLINE READY</span>
              </>
            )}
          </div>

          {/* PWA Install Button (If not yet installed) */}
          {!isInstalled && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-500 text-white shadow-sm hover:shadow-red-600/30 transition-all active:scale-95"
              title="Add Panatag to Home Screen for Offline Access"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install App</span>
              <span className="sm:hidden">Install</span>
            </button>
          )}

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            className="bg-slate-800 border border-slate-700 text-xs font-semibold rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer"
            aria-label="Language selection"
          >
            <option value="fil">🇵🇭 Tagalog</option>
            <option value="en">🇺🇸 English</option>
            <option value="ceb">🇵🇭 Bisaya</option>
          </select>

          {/* Blackout / AMOLED Battery Saver Mode */}
          <button
            onClick={onToggleBlackoutMode}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              blackoutMode
                ? 'bg-red-950/60 border-red-700 text-red-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title={blackoutMode ? 'Disable Blackout Mode' : 'Enable Blackout AMOLED Battery Saver (For power brownouts)'}
            aria-label="Toggle Blackout Mode"
          >
            {blackoutMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* ICE (In Case of Emergency) Card */}
          <button
            onClick={onOpenIceModal}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
            title="Open Emergency Profile / ICE Card"
            aria-label="Open ICE Profile"
          >
            <UserPlus className="w-4 h-4 text-rose-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
