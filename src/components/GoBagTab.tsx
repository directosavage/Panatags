import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Package, 
  Plus, 
  RotateCcw, 
  AlertCircle, 
  Info,
  Droplet,
  HeartPulse,
  Wrench,
  FileText,
  Sparkles,
  Shirt
} from 'lucide-react';
import { GoBagItem, Language } from '../types';
import { DEFAULT_GOBAG_ITEMS } from '../data/goBagChecklist';

interface GoBagTabProps {
  language: Language;
  blackoutMode: boolean;
}

const STORAGE_KEY = 'panatag_gobag_items_v1';

export const GoBagTab: React.FC<GoBagTabProps> = ({ language, blackoutMode }) => {
  const [items, setItems] = useState<GoBagItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_GOBAG_ITEMS;
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  };

  const resetChecklist = () => {
    if (window.confirm('I-reset ba ang lahat ng marka sa Go-Bag checklist?')) {
      setItems(DEFAULT_GOBAG_ITEMS.map((item) => ({ ...item, packed: false })));
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: GoBagItem = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      tagalogTitle: newTitle.trim(),
      category: 'special',
      essential: true,
      notes: 'Pansariling kailangan ng pamilya.',
      packed: true
    };

    setItems((prev) => [newItem, ...prev]);
    setNewTitle('');
    setIsAdding(false);
  };

  const packedCount = items.filter((i) => i.packed).length;
  const totalCount = items.length;
  const progressPercent = Math.round((packedCount / totalCount) * 100);

  const filteredItems = items.filter((item) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'unpacked') return !item.packed;
    return item.category === activeCategory;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
      {/* Top Readiness Scorecard */}
      <div className={`p-5 rounded-2xl border ${
        blackoutMode 
          ? 'bg-zinc-950 border-red-950 text-white' 
          : 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/80 shadow-lg'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                72-Hour Survival Go-Bag Tracker
              </h2>
              <p className="text-xs text-slate-300">
                Pang-3 araw na gamit sa bawat miyembro ng pamilya
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Magdagdag
            </button>
            <button
              onClick={resetChecklist}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white text-xs transition-colors"
              title="I-reset ang checklist"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-300">
              Antas ng Kahandaan: {packedCount} sa {totalCount} na gamit
            </span>
            <span className={progressPercent >= 80 ? 'text-emerald-400' : progressPercent >= 40 ? 'text-amber-400' : 'text-red-400'}>
              {progressPercent}% Handa
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-700">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                progressPercent >= 80
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : progressPercent >= 40
                  ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                  : 'bg-gradient-to-r from-red-600 to-rose-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Add Custom Item Modal / Inline */}
      {isAdding && (
        <form onSubmit={handleAddItem} className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700 flex gap-2 animate-fade-in">
          <input
            type="text"
            placeholder="Hal. Gatas ng sanggol, lampin, diaper, gamot sa aso..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
            autoFocus
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-500 shrink-0"
          >
            I-save
          </button>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
        {[
          { id: 'all', label: 'Lahat' },
          { id: 'unpacked', label: 'Kulang Pa' },
          { id: 'water_food', label: 'Tubig & Pagkain' },
          { id: 'first_aid', label: 'First Aid' },
          { id: 'tools_light', label: 'Ilaw & Tools' },
          { id: 'documents', label: 'Dokumento & Pera' },
          { id: 'hygiene', label: 'Kalinisan' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
              activeCategory === tab.id
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Checklist Grid */}
      <div className="space-y-2.5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
              item.packed
                ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-300 opacity-90'
                : blackoutMode
                ? 'bg-zinc-950 border-zinc-800 hover:border-red-800'
                : 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600 shadow-sm'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {item.packed ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : (
                <Circle className="w-5 h-5 text-slate-500 hover:text-slate-300" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-sm font-bold ${item.packed ? 'line-through text-slate-400' : 'text-white'}`}>
                  {item.tagalogTitle}
                </span>
                {item.essential && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-950 text-red-400 border border-red-900/60 uppercase">
                    Kritikal
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {item.notes}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
