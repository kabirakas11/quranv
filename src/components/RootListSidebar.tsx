import React, { useState, useMemo } from 'react';
import type { RootSummary } from '../types.ts';
import { Search, ArrowUpDown, Flame, BookMarked } from 'lucide-react';

interface RootListSidebarProps {
  roots: RootSummary[];
  selectedRootCode: string;
  onSelectRoot: (code: string) => void;
  isLoading: boolean;
}

export const RootListSidebar: React.FC<RootListSidebarProps> = ({
  roots,
  selectedRootCode,
  onSelectRoot,
  isLoading
}) => {
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'occurrences' | 'arabic'>('occurrences');
  const [displayCount, setDisplayCount] = useState(80);

  const filtered = useMemo(() => {
    let result = [...roots];

    if (filterText.trim()) {
      const q = filterText.trim().toLowerCase();
      result = result.filter(
        (r) =>
          r.cleanArabic.includes(q) ||
          r.arabic.includes(q) ||
          r.code.toLowerCase().includes(q) ||
          (r.translitName && r.translitName.toLowerCase().includes(q)) ||
          (r.primaryGloss && r.primaryGloss.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'occurrences') {
      result.sort((a, b) => (b.occurrences || 0) - (a.occurrences || 0));
    } else if (sortBy === 'arabic') {
      result.sort((a, b) => a.cleanArabic.localeCompare(b.cleanArabic, 'ar'));
    }

    return result;
  }, [roots, filterText, sortBy]);

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col h-[calc(100vh-180px)] min-h-[500px] sticky top-28">
      
      {/* Header & Controls */}
      <div className="p-3.5 border-b border-stone-200 dark:border-stone-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-xs text-stone-900 dark:text-stone-100 uppercase tracking-wider">
              Roots Registry
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-mono font-medium">
              {filtered.length}
            </span>
          </div>

          {/* Sort Switcher */}
          <div className="flex items-center gap-1 text-[11px]">
            <button
              onClick={() => setSortBy('occurrences')}
              title="Sort by Quranic Occurrences Frequency"
              className={`p-1.5 rounded-md flex items-center gap-1 ${
                sortBy === 'occurrences'
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <Flame className="w-3 h-3" />
              <span>Freq</span>
            </button>

            <button
              onClick={() => setSortBy('arabic')}
              title="Sort Alphabetically by Arabic Root"
              className={`p-1.5 rounded-md flex items-center gap-1 ${
                sortBy === 'arabic'
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <span className="font-arabic font-bold text-xs">أ-ي</span>
            </button>
          </div>
        </div>

        {/* In-sidebar search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filter list..."
            className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          {filterText && (
            <button
              onClick={() => setFilterText('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Roots List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-stone-100 dark:divide-stone-850">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-stone-400 text-xs">
            No roots matching filter
          </div>
        ) : (
          filtered.slice(0, displayCount).map((root) => {
            const isSelected = selectedRootCode === root.code;
            return (
              <button
                key={root.code}
                onClick={() => onSelectRoot(root.code)}
                className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between gap-2 border ${
                  isSelected
                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-950 dark:text-amber-100 shadow-xs ring-1 ring-amber-500'
                    : 'bg-transparent border-transparent hover:bg-stone-50 dark:hover:bg-stone-800/60 text-stone-800 dark:text-stone-200'
                }`}
              >
                {/* Left: Arabic Letters with generous tracking */}
                <div className="flex items-center gap-2.5">
                  <span className="font-arabic text-xl font-bold tracking-widest text-stone-900 dark:text-stone-100">
                    {root.arabic}
                  </span>
                  <div>
                    <span className="text-xs font-mono font-medium text-stone-500 dark:text-stone-400 block">
                      {root.code}
                    </span>
                    {root.primaryGloss && (
                      <span className="text-[10px] text-stone-400 dark:text-stone-500 truncate max-w-[120px] block">
                        {root.primaryGloss}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Occurrences or Letter badge */}
                <div className="text-right shrink-0">
                  {root.occurrences ? (
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
                      <span>{root.occurrences}</span>
                    </span>
                  ) : (
                    <span className="font-arabic text-xs text-stone-400 px-1">
                      {root.arabicLetter}
                    </span>
                  )}
                </div>
              </button>
            );
          })
        )}

        {filtered.length > displayCount && (
          <div className="pt-2 text-center">
            <button
              onClick={() => setDisplayCount((prev) => prev + 80)}
              className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline py-1.5 w-full text-center"
            >
              Show More ({filtered.length - displayCount} remaining)
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
