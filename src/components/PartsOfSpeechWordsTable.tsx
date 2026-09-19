import React, { useState, useMemo } from 'react';
import type { RootDerivation, PartOfSpeechSummary } from '../types.ts';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Volume2,
  VolumeX,
  Download,
  BookOpen,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Layers,
  X,
  Hash,
  FileText
} from 'lucide-react';
import { PARTS_OF_SPEECH, PRIMARY_DIVISIONS, normalizePartOfSpeechId, QURAN_PARTICLES, type QuranParticle } from '../data/partsOfSpeech.ts';
import { localVocabStore } from '../utils/localVocabStore.ts';

interface PartsOfSpeechWordsTableProps {
  partOfSpeech: string;                        // e.g. "noun", "verb", "verb-form-i", "Active Participle"
  words?: RootDerivation[];                    // Optional pre-filtered words (e.g. from current root)
  currentRootCode?: string;                    // If opened from a specific root
  currentRootArabic?: string;                  // e.g. "ك ت ب"
  onSelectRoot?: (rootCode: string) => void;   // Callback when clicking a root
  onClose?: () => void;                        // Callback to close/go back
  activeAudioUrl?: string | null;
  onPlayAudio?: (url: string) => void;
  onStopAudio?: () => void;
}

type SortField = 'word' | 'meaning' | 'frequency' | 'root';
type SortDirection = 'asc' | 'desc';

export const PartsOfSpeechWordsTable: React.FC<PartsOfSpeechWordsTableProps> = ({
  partOfSpeech,
  words: propWords,
  currentRootCode,
  currentRootArabic,
  onSelectRoot,
  onClose,
  activeAudioUrl,
  onPlayAudio,
  onStopAudio
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('frequency');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [scope, setScope] = useState<'root' | 'all'>(currentRootCode && propWords && propWords.length > 0 ? 'root' : 'all');
  const [globalWords, setGlobalWords] = useState<RootDerivation[]>([]);
  const [isLoadingGlobal, setIsLoadingGlobal] = useState(false);

  // Normalized ID
  const normalizedId = useMemo(() => normalizePartOfSpeechId(partOfSpeech), [partOfSpeech]);

  // Part of speech metadata
  const posMeta = useMemo(() => {
    const primary = PRIMARY_DIVISIONS.find((d) => d.id === normalizedId);
    if (primary) {
      return {
        id: primary.id,
        name: primary.name,
        nameArabic: primary.nameArabic,
        pattern: 'القسم الرئيسي',
        categoryGroup: primary.id as any,
        primaryDivision: primary.id,
        description: primary.description,
        totalDerivations: primary.totalWordsEst,
        totalOccurrences: primary.totalOccurrencesEst
      };
    }
    const found = PARTS_OF_SPEECH.find((p) => p.id === normalizedId);
    if (found) return found;

    return {
      id: normalizedId,
      name: partOfSpeech,
      nameArabic: 'قسم الكلام',
      pattern: 'صيغة لغوية',
      categoryGroup: 'noun' as any,
      description: 'Words sharing this part of speech classification in the Quranic corpus.',
      totalDerivations: 0,
      totalOccurrences: 0
    };
  }, [normalizedId, partOfSpeech]);

  // Load words instantly from local store if available, or fetch from server API
  React.useEffect(() => {
    let isMounted = true;
    if (scope === 'all' || !propWords) {
      // 1. Try localVocabStore for instantaneous 0ms display
      const localRes = localVocabStore.getLocalPosWords(normalizedId);
      if (localRes.derivations && localRes.derivations.length > 0) {
        setGlobalWords(localRes.derivations);
        setIsLoadingGlobal(false);
        return;
      }

      // 2. Fallback to API if not yet in memory
      setIsLoadingGlobal(true);
      fetch(`/api/pos-words?pos=${encodeURIComponent(normalizedId)}`)
        .then((res) => res.json())
        .then((data) => {
          if (isMounted && data.words) {
            setGlobalWords(data.words);
          }
        })
        .catch((err) => console.error('Failed to load words for part of speech:', err))
        .finally(() => {
          if (isMounted) setIsLoadingGlobal(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [normalizedId, scope, propWords]);

  // Source words based on scope
  const sourceWords = useMemo(() => {
    if (scope === 'root' && propWords) {
      return propWords.filter((w) => {
        const wNorm = normalizePartOfSpeechId(w.grammarCategory);
        if (normalizedId === 'noun') {
          return ['noun', 'proper-noun', 'verbal-noun', 'active-participle', 'passive-participle', 'adjective', 'noun-place-time'].includes(wNorm);
        }
        if (normalizedId === 'verb') {
          return wNorm.startsWith('verb');
        }
        if (normalizedId === 'particle') {
          return wNorm === 'particle';
        }
        return wNorm === normalizedId;
      });
    }
    return globalWords;
  }, [scope, propWords, globalWords, normalizedId]);

  // Filter words by search query
  const filteredWords = useMemo(() => {
    return sourceWords.filter((item) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchWord = item.word.includes(q);
      const matchTranslit = item.transliteration.toLowerCase().includes(q);
      const matchMeaning = item.meaning.toLowerCase().includes(q);
      const matchRoot = item.root ? item.root.toLowerCase().includes(q) : false;
      const matchRootAr = item.rootArabic ? item.rootArabic.includes(q) : false;
      return matchWord || matchTranslit || matchMeaning || matchRoot || matchRootAr;
    });
  }, [sourceWords, searchQuery]);

  // Sort words
  const sortedWords = useMemo(() => {
    return [...filteredWords].sort((a, b) => {
      let comp = 0;
      if (sortField === 'frequency') {
        comp = a.frequency - b.frequency;
      } else if (sortField === 'word') {
        comp = a.word.localeCompare(b.word, 'ar');
      } else if (sortField === 'meaning') {
        comp = a.meaning.localeCompare(b.meaning, 'en');
      } else if (sortField === 'root') {
        const rA = a.rootArabic || a.root || '';
        const rB = b.rootArabic || b.root || '';
        comp = rA.localeCompare(rB, 'ar');
      }
      return sortDirection === 'asc' ? comp : -comp;
    });
  }, [filteredWords, sortField, sortDirection]);

  // Frequency statistics
  const maxFreq = useMemo(() => {
    return Math.max(...sortedWords.map((w) => w.frequency), 1);
  }, [sortedWords]);

  const totalOccurrencesCount = useMemo(() => {
    return sortedWords.reduce((sum, w) => sum + w.frequency, 0);
  }, [sortedWords]);

  // Lookup map for Quranic particles to display usage rules & syntax
  const particlesMap = useMemo(() => {
    const map = new Map<string, QuranParticle>();
    for (const p of QURAN_PARTICLES) {
      map.set(p.id, p);
      map.set(p.word, p);
    }
    return map;
  }, []);

  // Sort toggle handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection(field === 'meaning' || field === 'word' ? 'asc' : 'desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-stone-400 opacity-60 group-hover:opacity-100" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 font-bold" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 font-bold" />
    );
  };

  // CSV Export
  const handleExportCsv = () => {
    const headers = ['Word (Arabic)', 'Transliteration', 'Meaning in English', 'Frequency', 'Root', 'Part of Speech'];
    const rows = sortedWords.map((w) => [
      `"${w.word}"`,
      `"${w.transliteration}"`,
      `"${w.meaning.replace(/"/g, '""')}"`,
      w.frequency,
      `"${w.rootArabic || w.root || ''}"`,
      `"${w.grammarCategory}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `quran_words_${posMeta.id}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80">
                Part of Speech
              </span>
              {posMeta.primaryDivision && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                  {posMeta.primaryDivision === 'noun' ? 'اسم (Noun)' : posMeta.primaryDivision === 'verb' ? 'فعل (Verb)' : 'حرف (Particle)'}
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                {posMeta.name}
              </h2>
              <span className="font-arabic text-xl sm:text-2xl font-bold text-amber-700 dark:text-amber-400">
                {posMeta.nameArabic}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {posMeta.description}
            </p>
          </div>

          {/* Quick Stats Summary */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-center min-w-[100px]">
              <div className="text-xl font-bold text-amber-900 dark:text-amber-200">
                {sortedWords.length}
              </div>
              <div className="text-[11px] font-medium text-amber-700 dark:text-amber-400">
                Listed Words
              </div>
            </div>

            <div className="px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-center min-w-[110px]">
              <div className="text-xl font-bold text-stone-900 dark:text-stone-100">
                {totalOccurrencesCount.toLocaleString()}
              </div>
              <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                Occurrences
              </div>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all cursor-pointer"
                title="Close table"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Scope selector if opened from a specific root */}
        {currentRootCode && propWords && (
          <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2">
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Scope:</span>
            <button
              onClick={() => setScope('root')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                scope === 'root'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              This Root Only ({currentRootArabic || currentRootCode})
            </button>
            <button
              onClick={() => setScope('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                scope === 'all'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              All Words in Quran ({posMeta.name})
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-stone-900 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search words by Arabic, English meaning, transliteration, or root..."
            className="w-full pl-9 pr-8 py-2 rounded-xl text-xs sm:text-sm bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-stone-800 dark:text-stone-100 transition-all placeholder:text-stone-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 transition-all cursor-pointer shadow-2xs"
            title="Download CSV of words with meaning and frequency"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Words Table */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden">
        {isLoadingGlobal ? (
          <div className="py-16 text-center text-stone-500 space-y-3">
            <div className="w-7 h-7 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-medium">Loading words for {posMeta.name}...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-850/60 text-[11px] font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider select-none">
                  {/* # */}
                  <th className="py-3 px-3 w-12 text-center">#</th>

                  {/* 1. WORD (Arabic + Transliteration) */}
                  <th
                    onClick={() => handleSort('word')}
                    className="py-3 px-4 cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors group min-w-[180px]"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Word (الكلمة)</span>
                      {getSortIcon('word')}
                    </div>
                  </th>

                  {/* 2. MEANING IN ENGLISH */}
                  <th
                    onClick={() => handleSort('meaning')}
                    className="py-3 px-4 cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors group min-w-[220px]"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Meaning in English</span>
                      {getSortIcon('meaning')}
                    </div>
                  </th>

                  {/* 3. FREQUENCY (Occurrences) */}
                  <th
                    onClick={() => handleSort('frequency')}
                    className="py-3 px-4 cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors group min-w-[140px]"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Frequency</span>
                      {getSortIcon('frequency')}
                    </div>
                  </th>

                  {/* 4. ROOT */}
                  <th
                    onClick={() => handleSort('root')}
                    className="py-3 px-3 cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors group"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Root</span>
                      {getSortIcon('root')}
                    </div>
                  </th>

                  {/* 5. AUDIO & ACTIONS */}
                  <th className="py-3 px-3 w-20 text-center">Audio</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 text-xs">
                {sortedWords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-14 text-center text-stone-500 dark:text-stone-400">
                      <BookOpen className="w-8 h-8 mx-auto text-stone-300 dark:text-stone-600 mb-2" />
                      <p className="font-semibold text-sm">No words found</p>
                      <p className="text-xs mt-1">Try adjusting your search query.</p>
                    </td>
                  </tr>
                ) : (
                  sortedWords.map((item, index) => {
                    const isExpanded = expandedId === item.id;
                    const sampleAyah = item.occurrences?.[0];
                    const isPlaying = activeAudioUrl && sampleAyah?.audioUrl === activeAudioUrl;
                    const matchedParticle = particlesMap.get(item.id) || particlesMap.get(item.word);

                    return (
                      <React.Fragment key={item.id || index}>
                        <tr
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className={`transition-colors cursor-pointer group hover:bg-amber-50/40 dark:hover:bg-amber-950/20 ${
                            isExpanded ? 'bg-amber-50/60 dark:bg-amber-950/30' : ''
                          }`}
                        >
                          {/* # */}
                          <td className="py-3.5 px-3 text-center text-stone-400 font-mono text-[11px]">
                            {index + 1}
                          </td>

                          {/* 1. WORD */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col items-start gap-0.5">
                              <span className="font-arabic text-xl font-bold text-stone-900 dark:text-stone-100 leading-normal tracking-wide">
                                {item.word}
                              </span>
                              <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                                {item.transliteration}
                              </span>
                            </div>
                          </td>

                          {/* 2. MEANING IN ENGLISH */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col gap-1">
                              <span className="font-medium text-stone-800 dark:text-stone-200 text-sm">
                                {item.meaning}
                              </span>
                              {matchedParticle && (
                                <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                                  {matchedParticle.categoryArabic} • {matchedParticle.categoryTitle}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* 3. FREQUENCY */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              <span className="inline-flex items-center justify-center font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 text-xs border border-amber-200 dark:border-amber-800/80 min-w-[42px]">
                                {item.frequency.toLocaleString()}
                              </span>
                              <div className="w-16 h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden hidden sm:block">
                                <div
                                  className="h-full bg-amber-600 rounded-full transition-all"
                                  style={{
                                    width: `${Math.max((item.frequency / maxFreq) * 100, 4)}%`
                                  }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* 4. ROOT */}
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            {item.root && item.root !== 'hrf' ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onSelectRoot && item.root) {
                                    onSelectRoot(item.root);
                                  }
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-stone-700 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-200 transition-all font-mono text-xs border border-stone-200 dark:border-stone-700"
                                title={`Open root dictionary for ${item.rootArabic || item.root}`}
                              >
                                <span className="font-arabic font-bold text-sm text-amber-700 dark:text-amber-400">
                                  {item.rootArabic || item.root}
                                </span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                              </button>
                            ) : (
                              <span className="text-stone-400 text-xs italic">حرف أصيل</span>
                            )}
                          </td>

                          {/* 5. AUDIO */}
                          <td className="py-3.5 px-3 text-center whitespace-nowrap">
                            {sampleAyah?.audioUrl && onPlayAudio && onStopAudio ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isPlaying) {
                                    onStopAudio();
                                  } else {
                                    onPlayAudio(sampleAyah.audioUrl!);
                                  }
                                }}
                                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                                  isPlaying
                                    ? 'bg-amber-600 text-white animate-pulse'
                                    : 'text-stone-400 hover:text-amber-600 hover:bg-stone-100 dark:hover:bg-stone-800'
                                }`}
                                title={isPlaying ? 'Pause audio' : 'Listen to word in recitation'}
                              >
                                {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                              </button>
                            ) : (
                              <span className="text-stone-300 dark:text-stone-700">—</span>
                            )}
                          </td>
                        </tr>

                        {/* Expandable row: Quranic verse context & morphological details */}
                        {isExpanded && (
                          <tr className="bg-stone-50/80 dark:bg-stone-850/80 border-b border-stone-200 dark:border-stone-800">
                            <td colSpan={6} className="py-4 px-6">
                              <div className="space-y-4">
                                {/* Header Info Bar */}
                                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-semibold text-stone-700 dark:text-stone-200">
                                      Part of Speech:
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-md bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-medium text-stone-800 dark:text-stone-200">
                                      {item.grammarCategory}
                                    </span>
                                    {item.semanticRole && (
                                      <span className="px-2.5 py-0.5 rounded-md bg-stone-200/70 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                                        {item.semanticRole}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 text-stone-500">
                                    {item.prefix !== '—' && (
                                      <span>Prefix: <strong>{item.prefix}</strong></span>
                                    )}
                                    {item.suffix !== '—' && (
                                      <span>Suffix: <strong>{item.suffix}</strong></span>
                                    )}
                                    <span className="text-stone-400">Total {item.frequency.toLocaleString()} Quranic occurrences</span>
                                  </div>
                                </div>

                                {/* Special Quranic Particle Grammatical Rule and Syntactic Effect */}
                                {matchedParticle && (
                                  <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 space-y-2.5">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                        <span className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                                          Quranic Usage & Syntactic Governance (قاعدة الاستعمال القرآني والأثر الإعرابي)
                                        </span>
                                      </div>
                                      <span className="font-arabic font-bold text-sm text-amber-800 dark:text-amber-300">
                                        {matchedParticle.categoryArabic}
                                      </span>
                                    </div>

                                    <div className="space-y-1.5 text-xs text-stone-800 dark:text-stone-200">
                                      <p className="leading-relaxed">
                                        <strong className="text-stone-900 dark:text-stone-100">Syntactic Governance:</strong>{' '}
                                        <span className="text-amber-900 dark:text-amber-300 font-mono bg-amber-100/60 dark:bg-amber-900/40 px-1.5 py-0.5 rounded">
                                          {matchedParticle.syntacticEffect}
                                        </span>
                                      </p>
                                      <p className="leading-relaxed text-stone-700 dark:text-stone-300">
                                        <strong className="text-stone-900 dark:text-stone-100">Rhetorical Meaning & Rules:</strong>{' '}
                                        {matchedParticle.usageRule}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {/* Quranic Occurrences and Audio Recitation */}
                                <div className="space-y-2">
                                  <div className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                                    <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                    <span>
                                      Quranic Citations & Recitation Examples ({matchedParticle ? matchedParticle.examples.length : item.occurrences?.length || 0})
                                    </span>
                                  </div>

                                  <div className="space-y-2">
                                    {(matchedParticle?.examples || item.occurrences || []).map((ayah, aIdx) => {
                                      const isAyahPlaying = activeAudioUrl && ayah.audioUrl === activeAudioUrl;
                                      return (
                                        <div
                                          key={aIdx}
                                          className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-2"
                                        >
                                          <div className="flex items-center justify-between text-xs text-stone-400">
                                            <span className="font-medium text-stone-600 dark:text-stone-300">
                                              {ayah.surahName || `Surah ${ayah.chapter}`} ({ayah.location})
                                            </span>
                                            {ayah.audioUrl && onPlayAudio && onStopAudio && (
                                              <button
                                                type="button"
                                                onClick={() => isAyahPlaying ? onStopAudio() : onPlayAudio(ayah.audioUrl!)}
                                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                                  isAyahPlaying
                                                    ? 'bg-amber-600 text-white animate-pulse'
                                                    : 'bg-stone-100 dark:bg-stone-800 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40'
                                                }`}
                                              >
                                                {isAyahPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                                                <span>{isAyahPlaying ? 'Stop Recitation' : 'Play Ayah Recitation'}</span>
                                              </button>
                                            )}
                                          </div>
                                          <p className="font-arabic text-lg sm:text-xl text-stone-900 dark:text-stone-100 text-right leading-loose">
                                            {ayah.ayahText}
                                          </p>
                                          <p className="text-xs text-stone-600 dark:text-stone-400 italic">
                                            "{ayah.translation}"
                                          </p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer info */}
        <div className="py-3 px-4 bg-stone-50 dark:bg-stone-850 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <span>
            Showing <strong>{sortedWords.length}</strong> words of <strong>{posMeta.name}</strong>
          </span>
          <span>
            Sorted by <strong>{sortField}</strong> ({sortDirection === 'asc' ? 'ascending' : 'descending'})
          </span>
        </div>
      </div>
    </div>
  );
};
