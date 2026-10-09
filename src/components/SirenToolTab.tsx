import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  VolumeX, 
  Volume2, 
  Sun, 
  AlertOctagon, 
  Radio, 
  ShieldAlert,
  Zap,
  Sparkles
} from 'lucide-react';
import { audioAlertService } from '../services/audioAlertService';

interface SirenToolTabProps {
  blackoutMode: boolean;
}

export const SirenToolTab: React.FC<SirenToolTabProps> = ({ blackoutMode }) => {
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [isStrobeActive, setIsStrobeActive] = useState(false);
  const [strobeColor, setStrobeColor] = useState<'red' | 'white'>('white');
  const [wakeLockActive, setWakeLockActive] = useState(false);

  // Strobe flashing effect
  useEffect(() => {
    let interval: number;
    if (isStrobeActive) {
      interval = window.setInterval(() => {
        setStrobeColor((prev) => (prev === 'white' ? 'red' : 'white'));
      }, 250);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isStrobeActive]);

  // Screen WakeLock to keep screen alive during rescue
  useEffect(() => {
    let wakeLock: any = null;
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator && (isSirenActive || isStrobeActive)) {
        try {
          wakeLock = await (navigator as any).wakeLock.request('screen');
          setWakeLockActive(true);
        } catch {
          // not supported or denied
        }
      }
    };

    if (isSirenActive || isStrobeActive) {
      requestWakeLock();
    } else {
      if (wakeLock) {
        wakeLock.release().catch(() => {});
        setWakeLockActive(false);
      }
    }

    return () => {
      if (wakeLock) wakeLock.release().catch(() => {});
    };
  }, [isSirenActive, isStrobeActive]);

  const toggleSiren = () => {
    if (isSirenActive) {
      audioAlertService.stop();
      setIsSirenActive(false);
    } else {
      audioAlertService.startSiren();
      setIsSirenActive(true);
    }
  };

  const handleWhistle = () => {
    audioAlertService.blastWhistle(1.5);
  };

  const handleMorseSOS = () => {
    audioAlertService.playMorseSOS();
  };

  const toggleStrobe = () => {
    setIsStrobeActive(!isStrobeActive);
  };

  const stopAll = () => {
    audioAlertService.stop();
    setIsSirenActive(false);
    setIsStrobeActive(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-5">
      {/* Visual Strobe Fullscreen Overlay if active */}
      {isStrobeActive && (
        <div 
          onClick={toggleStrobe}
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer transition-colors duration-100 ${
            strobeColor === 'white' ? 'bg-white text-black' : 'bg-red-600 text-white'
          }`}
        >
          <div className="text-center p-6 space-y-4">
            <h1 className="text-4xl sm:text-6xl font-black tracking-widest uppercase">
              S.O.S. RESCUE
            </h1>
            <p className="text-sm font-bold opacity-90">
              Pindutin kahit saan sa screen upang patayin ang strobe light.
            </p>
          </div>
        </div>
      )}

      {/* Advisory Header */}
      <div className={`p-4 rounded-2xl border ${
        blackoutMode 
          ? 'bg-zinc-950 border-red-950 text-white' 
          : 'bg-red-950/40 border-red-800 text-slate-100'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white">
              Panatag Emergency Rescue Siren & SOS Strobe
            </h2>
            <p className="text-xs text-red-300">
              100% Offline Web Audio Synthesizer para sa pagtawag ng tulong
            </p>
          </div>
        </div>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Continuous Siren */}
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
              Audio Rescue Alert
            </span>
            <h3 className="text-lg font-black text-white mt-0.5">
              Continuous High-Decibel Siren
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Mataas na tono (700Hz - 1200Hz) na madaling marinig ng mga rescue team sa gitna ng baha, ulan, o guho.
            </p>
          </div>

          <button
            onClick={toggleSiren}
            className={`w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 ${
              isSirenActive
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 ring-4 ring-amber-500/30 animate-pulse'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/50'
            }`}
          >
            {isSirenActive ? (
              <>
                <VolumeX className="w-5 h-5" />
                PATAYIN ANG SIREN
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5" />
                PA-TUNUGIN ANG SIREN
              </>
            )}
          </button>
        </div>

        {/* Visual Flash / Strobe */}
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Visual Beacon
            </span>
            <h3 className="text-lg font-black text-white mt-0.5">
              High-Visibility Screen Strobe
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Pinapailaw nang salit-salit (Puti at Pula) ang buong screen para makita ng mga rescue boat o helicopter sa dilim.
            </p>
          </div>

          <button
            onClick={toggleStrobe}
            className={`w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 ${
              isStrobeActive
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-400" />
            {isStrobeActive ? 'PATAYIN ANG STROBE' : 'BUKSAN ANG SOS STROBE'}
          </button>
        </div>

        {/* Single Whistle Blast */}
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
          <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-cyan-400" />
            Emergency Whistle Blast (Pito)
          </h4>
          <p className="text-xs text-slate-400">
            Mabilis na 2.85 kHz shrill whistle tone kung walang dalang totoong pito.
          </p>
          <button
            onClick={handleWhistle}
            className="w-full py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all"
          >
            <Volume2 className="w-4 h-4" />
            Pumito ng Isang Beses (Whistle)
          </button>
        </div>

        {/* Morse Code SOS */}
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
          <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-emerald-400" />
            Morse Code Audio S.O.S. (... --- ...)
          </h4>
          <p className="text-xs text-slate-400">
            Opisyal na international distress code na kinikilala ng search & rescue.
          </p>
          <button
            onClick={handleMorseSOS}
            className="w-full py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all"
          >
            <Radio className="w-4 h-4" />
            Patunugin ang S.O.S. Pattern
          </button>
        </div>
      </div>

      {/* Stop All Button */}
      {(isSirenActive || isStrobeActive) && (
        <button
          onClick={stopAll}
          className="w-full py-3 rounded-xl bg-zinc-900 border border-red-700 text-red-400 font-bold text-xs hover:bg-red-950 transition-colors"
        >
          Ihinto Lahat ng Tunog at Ilaw
        </button>
      )}

      {/* Survival Tip */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
        <strong className="text-slate-300 block">💡 Payo sa Paggamit:</strong>
        <span>
          Kung naipit sa ilalim ng guho, mas mainam na patunugin ang cellphone siren o pumito sa halip na sumigaw nang sumigaw upang maiwasan ang dehydration, pagkapos ng hangin, at pagkalanghap ng alikabok.
        </span>
      </div>
    </div>
  );
};
