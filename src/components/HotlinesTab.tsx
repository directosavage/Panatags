import React, { useState } from 'react';
import { 
  PhoneCall, 
  Search, 
  MessageSquare, 
  ShieldAlert, 
  Radio, 
  Clock, 
  ExternalLink,
  Flame,
  Ambulance,
  LifeBuoy,
  Shield
} from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../data/emergencyContacts';
import { Language } from '../types';

interface HotlinesTabProps {
  language: Language;
  blackoutMode: boolean;
}

export const HotlinesTab: React.FC<HotlinesTabProps> = ({ language, blackoutMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = EMERGENCY_CONTACTS.filter((contact) => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.tagalogName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.number.includes(searchTerm) ||
      contact.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || contact.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
      {/* Top Advisory Banner */}
      <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
        blackoutMode 
          ? 'bg-zinc-950 border-red-900 text-slate-200' 
          : 'bg-red-950/40 border-red-800/60 text-slate-200 shadow-md'
      }`}>
        <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-white text-sm">
            Tawag Nang Walang Internet (Offline Direct-Dial)
          </p>
          <p className="text-slate-300 leading-relaxed">
            Pindutin lamang ang <strong>"Tumawag"</strong> button para direktang mag-dial sa iyong cellphone network kahit walang WiFi o mobile data. Kung mahina ang signal o congested ang linya, magpadala ng <strong>SMS</strong> o makinig sa AM Radio (738 kHz Radyo Pilipinas).
          </p>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Hanapin ang ahensya, 911, Red Cross, BFP, Coast Guard..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          {[
            { id: 'all', label: 'Lahat' },
            { id: 'national', label: 'Pambansa' },
            { id: 'rescue', label: 'Rescue' },
            { id: 'fire', label: 'Sunog' },
            { id: 'health', label: 'Kalusugan' },
            { id: 'weather', label: 'Panahon' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hotlines Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((contact) => (
          <div
            key={contact.id}
            className={`p-4 rounded-2xl border transition-all ${
              blackoutMode
                ? 'bg-zinc-950 border-zinc-800 hover:border-red-800'
                : 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600 shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-700/60 text-slate-300">
                  {contact.agency}
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {contact.name}
                </h3>
                <p className="text-xs text-red-400 font-semibold">
                  {contact.number}
                </p>
              </div>

              <div className="w-9 h-9 rounded-xl bg-slate-700/60 flex items-center justify-center text-slate-300 shrink-0">
                {contact.category === 'fire' && <Flame className="w-5 h-5 text-amber-500" />}
                {contact.category === 'rescue' && <LifeBuoy className="w-5 h-5 text-rose-500" />}
                {contact.category === 'health' && <Ambulance className="w-5 h-5 text-emerald-400" />}
                {contact.category === 'national' && <Shield className="w-5 h-5 text-red-500" />}
                {contact.category === 'weather' && <Radio className="w-5 h-5 text-sky-400" />}
                {contact.category === 'police' && <Shield className="w-5 h-5 text-indigo-400" />}
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              {contact.description}
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {contact.availableHours}
              </span>
            </div>

            {/* Action Dial Buttons */}
            <div className="flex items-center gap-2">
              <a
                href={contact.tel}
                className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-red-900/40 active:scale-98 transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Tumawag ({contact.number.split('/')[0].trim()})
              </a>

              {contact.smsAvailable && contact.smsNumber && (
                <a
                  href={contact.smsNumber}
                  className="py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  title="Magpadala ng SMS"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  SMS
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* AM Radio Broadcast Frequencies Guide */}
      <div className="mt-6 p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Radio className="w-4 h-4 text-amber-400" />
          Mga Istasyon ng AM Radyo sa Pilipinas (Gumagana sa De-Bateryang Radyo)
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700">
            <span className="font-bold text-white block">Radyo Pilipinas</span>
            <span className="text-amber-400 font-mono text-[11px]">738 kHz AM</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Opisyal na pamahalaan</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700">
            <span className="font-bold text-white block">DZBB Super Radyo</span>
            <span className="text-amber-400 font-mono text-[11px]">594 kHz AM</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">GMA Network</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700">
            <span className="font-bold text-white block">DZRH Balita</span>
            <span className="text-amber-400 font-mono text-[11px]">666 kHz AM</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Nationwide coverage</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700">
            <span className="font-bold text-white block">DWIZ Alyansa</span>
            <span className="text-amber-400 font-mono text-[11px]">882 kHz AM</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Balita at rescue info</span>
          </div>
        </div>
      </div>
    </div>
  );
};
