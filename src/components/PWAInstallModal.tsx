import React from 'react';
import { Download, Smartphone, Share, CheckCircle, X, ShieldCheck, Zap } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isIOS, install } = usePWAInstall();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-900/50">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              Install Panatag on Your Device
            </h2>
            <p className="text-xs text-red-400 font-semibold">
              Zero Internet Required Once Installed
            </p>
          </div>
        </div>

        {/* Offline Guarantee Banner */}
        <div className="mb-5 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            Bakit kailangang i-install (Add to Home Screen)?
          </div>
          <p className="text-slate-300 leading-relaxed">
            Kapag tumama ang Bagyo o Lindol at mawalan ng signal ang mga cell towers, ang mga website ay hindi na magbubukas. Kapag naka-install ang Panatag, nakaimbak ito nang direkta sa memorya ng iyong telepono. Magagamit mo ang AI chatbot, hotlines, siren, at first aid nang **100% OFFLINE**.
          </p>
        </div>

        {/* Conditional Instructions */}
        {isInstallable ? (
          <div className="mb-6 space-y-3">
            <p className="text-sm text-slate-200">
              Handa nang i-install ang app sa iyong device sa isang pindot lamang:
            </p>
            <button
              onClick={async () => {
                await install();
                onClose();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 font-bold text-white text-sm shadow-lg shadow-red-700/40 flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <Zap className="w-5 h-5" />
              Pindutin para I-install Ngayon (Add to Home Screen)
            </button>
          </div>
        ) : isIOS ? (
          /* iOS Safari Guide */
          <div className="mb-6 space-y-4">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Paraan sa iPhone / iPad (Safari Browser):
            </h3>
            <ol className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-200 font-bold flex items-center justify-center shrink-0 text-[11px] border border-slate-700">1</span>
                <div>
                  Pindutin ang <strong>Share button</strong> sa ibaba ng Safari toolbar (icon na may kahon at pataas na arrow <Share className="w-3.5 h-3.5 inline mx-1 text-sky-400" />).
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-200 font-bold flex items-center justify-center shrink-0 text-[11px] border border-slate-700">2</span>
                <div>
                  Mag-scroll pababa sa options menu at piliin ang <strong>"Add to Home Screen"</strong> (o "Idagdag sa Home Screen").
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-200 font-bold flex items-center justify-center shrink-0 text-[11px] border border-slate-700">3</span>
                <div>
                  Pindutin ang <strong>"Add"</strong> sa kanang itaas. Makikita mo na ang pulang Panatag icon sa iyong home screen.
                </div>
              </li>
            </ol>
          </div>
        ) : (
          /* Android / Desktop Chrome Guide */
          <div className="mb-6 space-y-4">
            <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Paraan sa Android (Chrome / Brave / Edge):
            </h3>
            <ol className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-200 font-bold flex items-center justify-center shrink-0 text-[11px] border border-slate-700">1</span>
                <div>
                  Pindutin ang <strong>tatlong tuldok (⋮)</strong> sa kanang itaas ng browser menu.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-200 font-bold flex items-center justify-center shrink-0 text-[11px] border border-slate-700">2</span>
                <div>
                  Piliin ang <strong>"Install app"</strong> o <strong>"Add to Home screen"</strong>.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-200 font-bold flex items-center justify-center shrink-0 text-[11px] border border-slate-700">3</span>
                <div>
                  Kumpirmahin ang pag-install. Handa na itong buksan kahit naka-Airplane mode o walang WiFi!
                </div>
              </li>
            </ol>
          </div>
        )}

        {/* Benefits List */}
        <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Mabilis na mag-load</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Gumagana offline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Makatipid sa baterya</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Walang bayad</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
        >
          Naiintindihan ko / Isara
        </button>
      </div>
    </div>
  );
};
