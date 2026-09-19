import React, { useState, useMemo } from 'react';
import type { PartOfSpeechSummary } from '../types.ts';
import { PARTS_OF_SPEECH, PRIMARY_DIVISIONS } from '../data/partsOfSpeech.ts';
import { PartsOfSpeechWordsTable } from './PartsOfSpeechWordsTable.tsx';
import {
  Layers,
  Search,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Filter,
  CheckCircle2,
  Table,
  Shapes,
  Compass
} from 'lucide-react';

interface PartsOfSpeechBrowserProps {
  onSelectRoot?: (rootCode: string) => void;
  activeAudioUrl?: string | null;
  onPlayAudio?: (url: string) => void;
  onStopAudio?: () => void;
  initialPartOfSpeech?: string | null;
}

export const PartsOfSpeechBrowser: React.FC<PartsOfSpeechBrowserProps> = ({
  onSelectRoot,
  activeAudioUrl,
  onPlayAudio,
  onStopAudio,
  initialPartOfSpeech
}) => {
  const [selectedPartOfSpeech, setSelectedPartOfSpeech] = useState<string | null>(initialPartOfSpeech || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<'all' | 'noun' | 'verb' | 'particle'>('all');

  // Filtered categories
  const filteredPartsOfSpeech = useMemo(() => {
    return PARTS_OF_SPEECH.filter((item) => {
      // Division filter
      if (selectedDivision !== 'all' && item.primaryDivision !== selectedDivision) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchArabic = item.nameArabic.includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchPattern = item.pattern.toLowerCase().includes(q);
        if (!matchName && !matchArabic && !matchDesc && !matchPattern) {
          return false;
        }
      }

      return true;
    });
  }, [selectedDivision, searchQuery]);

  // When a Part of Speech is clicked, display the words table with word, meaning in English, frequency
  if (selectedPartOfSpeech) {
    return (
      <div className="space-y-4">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 shadow-xs">
          <button
            onClick={() => setSelectedPartOfSpeech(null)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-200 text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-all cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Back to All Parts of Speech</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-400">Selected Part of Speech:</span>
            <span className="font-semibold text-stone-800 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-md border border-stone-200 dark:border-stone-700">
              {selectedPartOfSpeech}
            </span>
          </div>
        </div>

        {/* The Words Table listing word, meaning in English, frequency */}
        <PartsOfSpeechWordsTable
          partOfSpeech={selectedPartOfSpeech}
          onSelectRoot={onSelectRoot}
          activeAudioUrl={activeAudioUrl}
          onPlayAudio={onPlayAudio}
          onStopAudio={onStopAudio}
          onClose={() => setSelectedPartOfSpeech(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-stone-100 rounded-2xl p-6 border border-stone-800 shadow-lg relative overflow-hidden">
        <div className="absolute right-4 -bottom-6 font-arabic text-8xl text-stone-800/40 select-none pointer-events-none">
          أقسام الكلام
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-3">
            <Shapes className="w-3.5 h-3.5" />
            <span>Quranic Arabic Parts of Speech (أقسام الكلام)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Explore Quranic Words by Parts of Speech
          </h1>

          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            Click on any Part of Speech below to list all words belonging to it with their exact <strong>Word</strong> in Arabic, <strong>Meaning in English</strong>, and Quranic <strong>Frequency</strong>.
          </p>
        </div>
      </div>

      {/* Primary 3 Divisions of Classical Arabic: Ism, Fi'l, Harf */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>The 3 Foundational Divisions (أقسام الكلام الثلاثة)</span>
          </h2>
          <span className="text-xs text-stone-400">Click to view all words in that division</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRIMARY_DIVISIONS.map((div) => {
            return (
              <div
                key={div.id}
                onClick={() => setSelectedPartOfSpeech(div.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-xs group hover:shadow-md hover:scale-[1.01] ${div.bgLight} ${div.borderLight}`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      Primary Division
                    </span>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                      {div.name}
                    </h3>
                  </div>
                  <span className="font-arabic text-2xl font-bold text-amber-700 dark:text-amber-400">
                    {div.nameArabic}
                  </span>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-4 line-clamp-2">
                  {div.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-stone-200/60 dark:border-stone-800/60 text-xs">
                  <span className="font-medium text-stone-500 dark:text-stone-400">
                    {div.countSubtypes} Sub-categories
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform">
                    <span>View all {div.name} words</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar for Specific Parts of Speech */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
        {/* Division Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedDivision('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedDivision === 'all'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            All Parts of Speech ({PARTS_OF_SPEECH.length})
          </button>
          <button
            onClick={() => setSelectedDivision('noun')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedDivision === 'noun'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            Nouns & Nominals (الاسم)
          </button>
          <button
            onClick={() => setSelectedDivision('verb')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedDivision === 'verb'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            Verbs & Stems (الفعل)
          </button>
          <button
            onClick={() => setSelectedDivision('particle')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedDivision === 'particle'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            Particles & Connectives (الحرف)
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search part of speech..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 text-stone-800 dark:text-stone-100 placeholder:text-stone-400"
          />
        </div>
      </div>

      {/* Grid of Parts of Speech */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPartsOfSpeech.map((pos) => {
          return (
            <div
              key={pos.id}
              onClick={() => setSelectedPartOfSpeech(pos.id)}
              className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400">
                      {pos.primaryDivision === 'noun' ? 'اسم (Noun)' : pos.primaryDivision === 'verb' ? 'فعل (Verb)' : 'حرف (Particle)'}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mt-1">
                      {pos.name}
                    </h3>
                  </div>
                  <span className="font-arabic text-xl font-bold text-amber-700 dark:text-amber-400 shrink-0">
                    {pos.nameArabic}
                  </span>
                </div>

                <div className="text-[11px] font-mono bg-stone-50 dark:bg-stone-800/80 px-2.5 py-1 rounded-lg border border-stone-100 dark:border-stone-800 text-amber-800 dark:text-amber-300">
                  {pos.pattern}
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-2">
                  {pos.description}
                </p>
              </div>

              {/* Card Footer Call to Action */}
              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <span className="text-stone-400">
                  ~{pos.totalOccurrences.toLocaleString()} Quranic occurrences
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                  <span>List words &rarr;</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
