import React from 'react';

export interface LetterStat {
  letterCode: string;
  arabic: string;
  name: string;
  count: number;
}

interface LetterSelectorProps {
  letters: LetterStat[];
  selectedLetter: string;
  onSelectLetter: (letter: string) => void;
  totalCount: number;
}

export const LetterSelector: React.FC<LetterSelectorProps> = ({
  letters,
  selectedLetter,
  onSelectLetter,
  totalCount
}) => {
  return (
    <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Index by Arabic Letter (حُرُوف الهِجَاء)
          </span>
          <span className="text-xs text-stone-400">
            Click any letter to filter roots
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {/* All Letters button */}
          <button
            onClick={() => onSelectLetter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
              selectedLetter === 'all'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            <span>All Roots</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                selectedLetter === 'all'
                  ? 'bg-amber-700 text-white'
                  : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-400'
              }`}
            >
              {totalCount}
            </span>
          </button>

          {/* 28 Arabic letters */}
          {letters.map((item) => {
            const isSelected = selectedLetter.toLowerCase() === item.letterCode.toLowerCase();
            return (
              <button
                key={item.letterCode}
                onClick={() => onSelectLetter(item.letterCode)}
                title={`${item.name} (${item.count} roots)`}
                className={`min-w-[44px] px-2.5 py-1.5 rounded-lg transition-all flex flex-col items-center justify-center shrink-0 border ${
                  isSelected
                    ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 text-amber-900 dark:text-amber-200 shadow-xs ring-1 ring-amber-500'
                    : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700/60 text-stone-700 dark:text-stone-300 hover:border-amber-400/50 hover:bg-amber-50/40'
                }`}
              >
                <span className="font-arabic text-base leading-none font-bold">
                  {item.arabic}
                </span>
                <span className="text-[9px] text-stone-400 dark:text-stone-500 mt-0.5 leading-none">
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
