import React, { useState } from 'react';
import { 
  CloudRain, 
  Activity, 
  Droplet, 
  HeartHandshake, 
  Flame, 
  AlertTriangle, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Wind
} from 'lucide-react';
import { STORM_SIGNALS, EARTHQUAKE_INTENSITIES, FIRST_AID_TOPICS } from '../data/disasterGuides';
import { Language } from '../types';

interface DisasterGuidesTabProps {
  language: Language;
  blackoutMode: boolean;
}

export const DisasterGuidesTab: React.FC<DisasterGuidesTabProps> = ({ language, blackoutMode }) => {
  const [guideType, setGuideType] = useState<'typhoon' | 'earthquake' | 'water' | 'firstaid' | 'volcano'>('typhoon');
  const [selectedSignal, setSelectedSignal] = useState<number>(3);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
      {/* Category Selection Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
        {[
          { id: 'typhoon', label: 'Bagyo (Signals 1-5)', icon: CloudRain },
          { id: 'earthquake', label: 'Lindol (PEIS)', icon: Activity },
          { id: 'water', label: 'Tubig-Inumin', icon: Droplet },
          { id: 'firstaid', label: 'First Aid Triage', icon: HeartHandshake },
          { id: 'volcano', label: 'Bulkan at Ashfall', icon: Flame }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setGuideType(tab.id as typeof guideType)}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
                guideType === tab.id
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. TYPHOON SIGNALS GUIDE */}
      {guideType === 'typhoon' && (
        <div className="space-y-4">
          {/* Signal Selector Pills */}
          <div className="grid grid-cols-5 gap-1.5">
            {STORM_SIGNALS.map((s) => (
              <button
                key={s.signal}
                onClick={() => setSelectedSignal(s.signal)}
                className={`py-2 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-0.5 border ${
                  selectedSignal === s.signal
                    ? 'border-white text-white shadow-lg scale-102 ring-2 ring-red-500'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                }`}
                style={{
                  backgroundColor: selectedSignal === s.signal ? s.color : undefined
                }}
              >
                <span className="text-[10px] opacity-80 uppercase">Signal</span>
                <span className="text-base font-black">#{s.signal}</span>
              </button>
            ))}
          </div>

          {/* Selected Signal Detail Card */}
          {(() => {
            const current = STORM_SIGNALS.find((s) => s.signal === selectedSignal) || STORM_SIGNALS[2];
            return (
              <div className={`p-5 rounded-2xl border ${
                blackoutMode ? 'bg-zinc-950 border-red-900' : 'bg-slate-800/90 border-slate-700 shadow-xl'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-3 mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-red-400 border border-red-950">
                      PAGASA Tropical Cyclone Wind Signal
                    </span>
                    <h3 className="text-xl font-black text-white mt-1 flex items-center gap-2">
                      <Wind className="w-5 h-5 text-red-400" />
                      Signal No. {current.signal}: {current.threatLevel}
                    </h3>
                  </div>

                  <div className="text-xs sm:text-right font-mono text-slate-300">
                    <span className="block text-red-400 font-bold">{current.windSpeed}</span>
                    <span className="text-[11px] text-slate-400">{current.leadTime}</span>
                  </div>
                </div>

                <div className="space-y-4 text-xs leading-relaxed">
                  <div>
                    <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Inaasahang Pinsala at Panganib:
                    </h4>
                    <ul className="space-y-1.5">
                      {current.impacts.map((imp, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-300">
                          <span className="text-red-400 font-bold shrink-0">•</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-slate-700/60">
                    <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Mandatory na Aksyon at Paglikas:
                    </h4>
                    <ul className="space-y-1.5">
                      {current.actions.map((act, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-200 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 2. EARTHQUAKE PEIS GUIDE */}
      {guideType === 'earthquake' && (
        <div className="space-y-4">
          {/* Duck Cover Hold Callout */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950 to-slate-900 border border-red-800 text-white space-y-2">
            <h3 className="font-black text-sm flex items-center gap-2 text-red-400">
              <Activity className="w-4 h-4" />
              DUCK, COVER, AND HOLD ON (Ginintuang Alituntunin sa Lindol)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Habang lumilindol, huwag tumakbo sa labas dahil delikado ang mga nahuhulog na debris. Dumapa (Duck), sumilong sa ilalim ng matibay na mesa (Cover), at kumapit sa paa ng mesa (Hold On) hanggang matapos ang pagyanig.
            </p>
          </div>

          {/* PEIS Intensity Scale */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              PHIVOLCS Earthquake Intensity Scale (PEIS I to X)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {EARTHQUAKE_INTENSITIES.map((ei) => (
                <div
                  key={ei.scale}
                  className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span 
                      className="px-2 py-0.5 rounded text-[11px] font-black text-slate-950"
                      style={{ backgroundColor: ei.color }}
                    >
                      {ei.scale}
                    </span>
                    <span className="text-white font-bold">{ei.tagalogName}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {ei.description}
                  </p>
                  <div className="text-red-400 font-semibold text-[11px] pt-1 border-t border-slate-700/60">
                    Aksyon: {ei.safetyAction}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. WATER PURIFICATION */}
      {guideType === 'water' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800 text-slate-200 text-xs space-y-2">
            <h3 className="font-black text-white text-sm flex items-center gap-2">
              <Droplet className="w-4 h-4 text-cyan-400" />
              Ligtas na Tubig-Inumin Habang Kalamidad
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Ang maruming tubig ang pangunahing sanhi ng cholera, diarrhea, at leptospirosis sa mga evacuation center. Piliin ang isa sa mga sumusunod na paraan:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Boiling */}
            <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                Paraan 1 (Pinakamainam)
              </span>
              <h4 className="font-bold text-white text-sm">Pakuluan (Rolling Boil)</h4>
              <p className="text-slate-300 leading-relaxed">
                1. Salain ang tubig sa malinis na tela kung may putik.<br />
                2. Pakuluan nang rumaragasa sa loob ng <strong>3 buong minuto</strong>.<br />
                3. Palamigin at itago sa saradong lalagyan.
              </p>
            </div>

            {/* Bleach */}
            <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                Paraan 2 (Walang Apoy)
              </span>
              <h4 className="font-bold text-white text-sm">Regular Household Bleach</h4>
              <p className="text-slate-300 leading-relaxed">
                1. Gumamit ng <strong>unscented</strong> plain bleach (5%-6% sodium hypochlorite).<br />
                2. <strong>Rasyo:</strong> 2 patak bawat 1 litro ng tubig (8 patak bawat galon).<br />
                3. Haluin at patagalin nang <strong>30 minuto</strong> bago inumin.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. FIRST AID TRIAGE */}
      {guideType === 'firstaid' && (
        <div className="space-y-3">
          {FIRST_AID_TOPICS.map((topic) => (
            <div
              key={topic.id}
              className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs space-y-2"
            >
              <h4 className="font-black text-white text-sm flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-rose-400" />
                {topic.title}
              </h4>
              <ol className="space-y-1.5 list-decimal list-inside text-slate-300 leading-relaxed">
                {topic.steps.map((st, i) => (
                  <li key={i}>{st}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}

      {/* 5. VOLCANO & ASHFALL */}
      {guideType === 'volcano' && (
        <div className="space-y-3 text-xs leading-relaxed">
          <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-2">
            <h4 className="font-black text-white text-sm flex items-center gap-2 text-amber-400">
              <Flame className="w-4 h-4" />
              Proteksyon sa Baga at Mata Laban sa Ashfall (Taal, Mayon, Kanlaon)
            </h4>
            <p className="text-slate-300">
              Ang abo ng bulkan ay hindi abo ng kahoy; ito ay pinong durog na bato at bubog na sumusugat sa baga at kornea ng mata.
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pt-1">
              <li>Laging magsuot ng <strong>N95 mask</strong> o basang tela.</li>
              <li>Alisin ang contact lenses at magsuot ng safety goggles.</li>
              <li>Takpan ang ilalim ng pinto at mga bintana ng basang tuwalya.</li>
              <li>Walisin ang abo sa bubong habang tuyo pa upang hindi gumuho ang bahay.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
