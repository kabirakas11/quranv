import React from 'react';
import type { DerivedFormSummary } from '../types.ts';
import { GitFork, Layers, BookmarkCheck, ArrowRight } from 'lucide-react';

interface DerivationTreeProps {
  arabicRoot: string;
  rootTranslit: string;
  derivedForms: DerivedFormSummary[];
  selectedForm: string | null;
  onSelectForm: (formType: string | null) => void;
}

export const DerivationTree: React.FC<DerivationTreeProps> = ({
  arabicRoot,
  rootTranslit,
  derivedForms,
  selectedForm,
  onSelectForm
}) => {
  // Group derived forms by category (Verbs, Nouns/Nominals, Participles, Other)
  const categories = {
    verbs: derivedForms.filter((f) => f.formType.toLowerCase().includes('verb') || f.text.toLowerCase().includes('verb')),
    nouns: derivedForms.filter((f) => (f.formType.toLowerCase().includes('noun') || f.formType.toLowerCase().includes('nominal')) && !f.formType.toLowerCase().includes('participle')),
    participles: derivedForms.filter((f) => f.formType.toLowerCase().includes('participle')),
    other: derivedForms.filter(
      (f) =>
        !f.formType.toLowerCase().includes('verb') &&
        !f.text.toLowerCase().includes('verb') &&
        !f.formType.toLowerCase().includes('noun') &&
        !f.formType.toLowerCase().includes('nominal') &&
        !f.formType.toLowerCase().includes('participle')
    )
  };

  const totalForms = derivedForms.length;

  return (
    <div className="bg-stone-900 text-stone-100 rounded-2xl p-5 border border-stone-800 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <GitFork className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-100">
              Morphological Derivation Hierarchy (شَجَرَة الاشْتِقَاق)
            </h3>
            <p className="text-xs text-stone-400">
              How root <span className="font-arabic text-amber-300 font-bold px-1">{arabicRoot}</span> branches into {totalForms} distinct Quranic grammatical variations
            </p>
          </div>
        </div>

        {selectedForm && (
          <button
            onClick={() => onSelectForm(null)}
            className="self-start sm:self-auto text-xs px-2.5 py-1 rounded-md bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 transition-colors"
          >
            Clear Filter (Show All)
          </button>
        )}
      </div>

      {/* Visual Derivation Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Verbs Column */}
        <div className="bg-stone-950/60 rounded-xl p-3.5 border border-stone-800/80">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-800">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Verbal Forms (الأَفْعَال)
            </span>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
              {categories.verbs.length}
            </span>
          </div>

          {categories.verbs.length === 0 ? (
            <p className="text-xs text-stone-500 italic py-2">No verbal derivations</p>
          ) : (
            <div className="space-y-2">
              {categories.verbs.map((f, i) => {
                const isSelected = selectedForm === f.formType || selectedForm === f.text;
                return (
                  <button
                    key={i}
                    onClick={() => onSelectForm(isSelected ? null : f.formType || f.text)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-emerald-950/50 border-emerald-500 shadow-xs ring-1 ring-emerald-500'
                        : 'bg-stone-900/80 hover:bg-stone-850 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-arabic text-base text-emerald-300 font-bold">
                        {f.arabicLemma || arabicRoot}
                      </span>
                      <span className="text-xs font-mono font-bold text-stone-300 px-1.5 py-0.5 rounded bg-stone-800">
                        {f.countText}x
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-300 font-medium mt-1 truncate">
                      {f.formType}
                    </div>
                    {f.translitLemma && (
                      <div className="text-[10px] text-stone-400 italic">
                        {f.translitLemma}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Nouns Column */}
        <div className="bg-stone-950/60 rounded-xl p-3.5 border border-stone-800/80">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-800">
            <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
              <BookmarkCheck className="w-3.5 h-3.5" />
              Nouns & Nominals (الأَسْمَاء)
            </span>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60">
              {categories.nouns.length}
            </span>
          </div>

          {categories.nouns.length === 0 ? (
            <p className="text-xs text-stone-500 italic py-2">No nominal derivations</p>
          ) : (
            <div className="space-y-2">
              {categories.nouns.map((f, i) => {
                const isSelected = selectedForm === f.formType || selectedForm === f.text;
                return (
                  <button
                    key={i}
                    onClick={() => onSelectForm(isSelected ? null : f.formType || f.text)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-amber-950/50 border-amber-500 shadow-xs ring-1 ring-amber-500'
                        : 'bg-stone-900/80 hover:bg-stone-850 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-arabic text-base text-amber-300 font-bold">
                        {f.arabicLemma || arabicRoot}
                      </span>
                      <span className="text-xs font-mono font-bold text-stone-300 px-1.5 py-0.5 rounded bg-stone-800">
                        {f.countText}x
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-300 font-medium mt-1 truncate">
                      {f.formType}
                    </div>
                    {f.translitLemma && (
                      <div className="text-[10px] text-stone-400 italic">
                        {f.translitLemma}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Participles & Others Column */}
        <div className="bg-stone-950/60 rounded-xl p-3.5 border border-stone-800/80">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-800">
            <span className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Participles & Derived (المُشْتَقَّات)
            </span>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/60">
              {categories.participles.length + categories.other.length}
            </span>
          </div>

          {categories.participles.length === 0 && categories.other.length === 0 ? (
            <p className="text-xs text-stone-500 italic py-2">No participle derivations</p>
          ) : (
            <div className="space-y-2">
              {[...categories.participles, ...categories.other].map((f, i) => {
                const isSelected = selectedForm === f.formType || selectedForm === f.text;
                return (
                  <button
                    key={i}
                    onClick={() => onSelectForm(isSelected ? null : f.formType || f.text)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-blue-950/50 border-blue-500 shadow-xs ring-1 ring-blue-500'
                        : 'bg-stone-900/80 hover:bg-stone-850 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-arabic text-base text-blue-300 font-bold">
                        {f.arabicLemma || arabicRoot}
                      </span>
                      <span className="text-xs font-mono font-bold text-stone-300 px-1.5 py-0.5 rounded bg-stone-800">
                        {f.countText}x
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-300 font-medium mt-1 truncate">
                      {f.formType}
                    </div>
                    {f.translitLemma && (
                      <div className="text-[10px] text-stone-400 italic">
                        {f.translitLemma}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
