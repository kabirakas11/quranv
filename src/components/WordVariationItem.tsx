import React, { useState } from 'react';
import type { WordVariation } from '../types.ts';
import { Volume2, VolumeX, Copy, Check, ExternalLink } from 'lucide-react';

interface WordVariationItemProps {
  variation: WordVariation;
  index: number;
  activeAudioUrl: string | null;
  onPlayAudio: (url: string) => void;
  onStopAudio: () => void;
}

export const WordVariationItem: React.FC<WordVariationItemProps> = ({
  variation,
  index,
  activeAudioUrl,
  onPlayAudio,
  onStopAudio
}) => {
  const [copied, setCopied] = useState(false);

  const isPlaying = activeAudioUrl === variation.audioUrl;

  const handleCopy = () => {
    const textToCopy = `${variation.targetWord} (${variation.transliteration} - "${variation.translation}")\n${variation.ayahText}\n[Quran ${variation.location} - ${variation.surahName || 'Surah ' + variation.chapter}]`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAudioToggle = () => {
    if (!variation.audioUrl) return;
    if (isPlaying) {
      onStopAudio();
    } else {
      onPlayAudio(variation.audioUrl);
    }
  };

  // Highlight the target word in the ayah
  // The ayahText has brackets 【word】 as parsed from corpus
  const renderHighlightedAyah = (text: string) => {
    const parts = text.split(/(【[^】]+】)/g);
    return parts.map((part, i) => {
      if (part.startsWith('【') && part.endsWith('】')) {
        const cleanWord = part.slice(1, -1);
        return (
          <span
            key={i}
            className="inline-block mx-1 px-1.5 py-0.5 rounded-md bg-amber-200 dark:bg-amber-900/60 text-amber-950 dark:text-amber-100 font-bold border border-amber-300 dark:border-amber-700/80 shadow-xs"
          >
            {cleanWord}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl p-4 border border-stone-200 dark:border-stone-800 hover:border-amber-400/60 dark:hover:border-amber-500/40 transition-all shadow-xs group">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
        
        {/* Left Column: Metadata, Target Word & Meaning */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {/* Location Badge */}
            <span className="inline-flex items-center gap-1 font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700">
              <span>{variation.location}</span>
            </span>

            {/* Surah Name */}
            <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              {variation.surahName ? `Surah ${variation.surahName}` : `Surah ${variation.chapter}`}: {variation.verse}
            </span>

            {variation.surahArabic && (
              <span className="font-arabic text-xs text-stone-400">
                ({variation.surahArabic})
              </span>
            )}

            {variation.revelationType && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                  variation.revelationType === 'Meccan'
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                    : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                }`}
              >
                {variation.revelationType}
              </span>
            )}

            {variation.grammarCategory && (
              <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                {variation.grammarCategory}
              </span>
            )}

            {variation.prefix && variation.prefix !== '—' && (
              <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                Prefix: {variation.prefix}
              </span>
            )}

            {variation.suffix && variation.suffix !== '—' && (
              <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Suffix: {variation.suffix}
              </span>
            )}
          </div>

          {/* Word Form with Transliteration & Gloss */}
          <div className="flex items-baseline gap-3 my-1">
            <span className="font-arabic text-2xl font-bold text-amber-700 dark:text-amber-400">
              {variation.targetWord}
            </span>
            <span className="text-sm font-semibold text-stone-900 dark:text-stone-100 italic">
              {variation.transliteration}
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
              "{variation.translation}"
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 self-end md:self-start shrink-0">
          {variation.audioUrl && (
            <button
              onClick={handleAudioToggle}
              title={isPlaying ? 'Stop Recitation' : 'Play Ayah Recitation (Mishary Alafasy)'}
              className={`p-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                isPlaying
                  ? 'bg-amber-600 text-white border-amber-600 animate-pulse'
                  : 'bg-stone-100 dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:text-amber-600'
              }`}
            >
              {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isPlaying ? 'Playing' : 'Listen'}</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            title="Copy Arabic Ayah & Citation"
            className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 border border-stone-200 dark:border-stone-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <a
            href={`https://corpus.quran.com/wordmorphology.jsp?location=(${variation.location})`}
            target="_blank"
            rel="noopener noreferrer"
            title="View Detailed Morphology on corpus.quran.com"
            className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 text-stone-600 dark:text-stone-400 hover:text-amber-500 border border-stone-200 dark:border-stone-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

      {/* Ayah Snippet with target word highlighted */}
      <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800/80">
        <p
          dir="rtl"
          className="font-arabic text-lg sm:text-xl text-stone-800 dark:text-stone-200 leading-loose text-right"
        >
          {renderHighlightedAyah(variation.ayahText)}
        </p>
      </div>
    </div>
  );
};
