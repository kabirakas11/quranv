import React, { useState } from 'react';
import { Search, BookOpen, Sparkles, ExternalLink, RefreshCw, Layers, Compass, HardDrive, Download } from 'lucide-react';
import { useLocalVocab } from '../utils/useLocalVocab.ts';
import { LocalVocabManagerModal } from './LocalVocabManagerModal.tsx';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalRootsCount: number;
  filteredRootsCount: number;
  onSelectRoot: (code: string) => void;
  isLoading: boolean;
  activeTab: 'roots' | 'frequency' | 'semantic' | 'grammar' | 'pos';
  onTabChange: (tab: 'roots' | 'frequency' | 'semantic' | 'grammar' | 'pos') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  totalRootsCount,
  filteredRootsCount,
  onSelectRoot,
  isLoading,
  activeTab,
  onTabChange
}) => {
  const [isVocabModalOpen, setIsVocabModalOpen] = useState(false);
  const { isStoredInIndexedDB, isReady, wordsCount } = useLocalVocab();

  const quickRoots = [
    { code: 'ktb', label: 'ك ت ب (Write)' },
    { code: 'rHm', label: 'ر ح م (Mercy)' },
    { code: 'Elm', label: 'ع ل م (Knowledge)' },
    { code: 'qwl', label: 'ق و ل (Say)' },
    { code: 'kwn', label: 'ك و ن (Be)' },
    { code: 'Amn', label: 'أ م ن (Belief)' }
  ];

  return (
    <header className="sticky top-0 z-30 bg-stone-900/95 backdrop-blur border-b border-stone-800 text-stone-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3 gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-stone-100 flex items-center gap-2">
                  <span>Quranic Roots & Lexicon</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-medium">
                    Corpus.Quran.com
                  </span>
                </h1>
              </div>
              <p className="text-xs text-stone-400 font-arabic text-amber-200/80">
                مُعْجَم جُذُور القُرْآن الكَرِيم ومُفْرَدَاتِهِ وتَصَارِيفِهَا
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search root (e.g. كتب, ktb), meaning (mercy, know), or code..."
                className="w-full pl-10 pr-10 py-2 rounded-xl bg-stone-800/90 border border-stone-700 text-sm text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all shadow-inner"
              />
              {isLoading && (
                <RefreshCw className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-amber-400 animate-spin" />
              )}
              {searchQuery && !isLoading && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-200 px-1.5 py-0.5 rounded bg-stone-700/60"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Stats & Links & Tabs */}
          <div className="flex items-center gap-2 justify-end text-xs">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-1 bg-stone-800/90 p-1 rounded-xl border border-stone-700 shrink-0">
              <button
                onClick={() => onTabChange('roots')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'roots'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-300 hover:text-white hover:bg-stone-750'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Roots (1,664)</span>
                <span className="sm:hidden">Roots</span>
              </button>
              <button
                onClick={() => onTabChange('frequency')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'frequency'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-300 hover:text-white hover:bg-stone-750'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Frequency List</span>
                <span className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-normal">
                  5,155 Words
                </span>
              </button>
              <button
                onClick={() => onTabChange('pos')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'pos' || activeTab === 'grammar'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-300 hover:text-white hover:bg-stone-750'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-amber-300" />
                <span>Parts of Speech</span>
                <span className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-normal">
                  أقسام الكلام
                </span>
              </button>
              <button
                onClick={() => onTabChange('semantic')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'semantic'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-300 hover:text-white hover:bg-stone-750'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-amber-300" />
                <span>Semantic Groups</span>
                <span className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-normal">
                  Thematic
                </span>
              </button>
            </div>

            {/* Local Storage & Download Button */}
            <button
              type="button"
              onClick={() => setIsVocabModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-800/90 hover:bg-stone-750 text-stone-200 border border-stone-700 hover:border-amber-500/50 transition-all shrink-0 cursor-pointer"
              title="Locally stored vocabulary (zero API latency) and offline download"
            >
              <HardDrive className={`w-3.5 h-3.5 ${isStoredInIndexedDB ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span className="hidden sm:inline font-medium">Local Vocab</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isStoredInIndexedDB
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-amber-500/20 text-amber-300'
              }`}>
                {wordsCount > 0 ? `${(wordsCount).toLocaleString()}` : '5,155'}
              </span>
            </button>

            <a
              href="https://corpus.quran.com/qurandictionary.jsp"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-750 text-stone-300 hover:text-amber-300 border border-stone-700 hover:border-amber-500/40 transition-colors shrink-0"
              title="Open Official Quranic Arabic Corpus Dictionary"
            >
              <span>Corpus Source</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* Quick Popular Root Pills */}
        <div className="py-2 border-t border-stone-800/80 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
          <span className="text-stone-400 whitespace-nowrap text-[11px] font-medium mr-1">Popular Roots:</span>
          {quickRoots.map((qr) => (
            <button
              key={qr.code}
              onClick={() => onSelectRoot(qr.code)}
              className="px-2.5 py-1 rounded-md bg-stone-800/80 hover:bg-amber-950/40 hover:text-amber-300 hover:border-amber-500/50 border border-stone-700/70 text-stone-300 transition-all whitespace-nowrap"
            >
              {qr.label}
            </button>
          ))}
        </div>
      </div>

      {/* Local Storage & Download Modal */}
      <LocalVocabManagerModal
        isOpen={isVocabModalOpen}
        onClose={() => setIsVocabModalOpen(false)}
      />
    </header>
  );
};
