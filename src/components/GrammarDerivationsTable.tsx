import React, { useState, useMemo } from 'react';
import type { RootDerivation, GrammarCategorySummary } from '../types.ts';
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
  Filter
} from 'lucide-react';
import { GRAMMAR_TYPES, normalizeGrammarTypeId } from '../data/grammarTypes.ts';

interface GrammarDerivationsTableProps {
  grammarType: string;                          // Grammar category name or id (e.g. "Verb (form I)", "Active participle")
  derivations?: RootDerivation[];              // Optional pre-filtered derivations (e.g. from current root)
  currentRootCode?: string;                    // If opened from a specific root
  currentRootArabic?: string;                  // e.g. "ك ت ب"
  onSelectRoot?: (rootCode: string) => void;   // Callback when clicking a root to jump to it
  onClose?: () => void;                        // If in modal/overlay mode
  activeAudioUrl?: string | null;
  onPlayAudio?: (url: string) => void;
  onStopAudio?: () => void;
}

type SortField = 'root' | 'word' | 'prefix' | 'suffix' | 'meaning' | 'frequency';
type SortDirection = 'asc' | 'desc';

export const GrammarDerivationsTable: React.FC<GrammarDerivationsTableProps> = ({
  grammarType,
  derivations: propDerivations,
  currentRootCode,
  currentRootArabic,
  onSelectRoot,
  onClose,
  activeAudioUrl,
  onPlayAudio,
  onStopAudio
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [affixFilter, setAffixFilter] = useState<'all' | 'prefix' | 'suffix' | 'bare'>('all');
  const [sortField, setSortField] = useState<SortField>('frequency');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [scope, setScope] = useState<'root' | 'all'>(currentRootCode && propDerivations && propDerivations.length > 0 ? 'root' : 'all');
  const [globalDerivations, setGlobalDerivations] = useState<RootDerivation[]>([]);
  const [isLoadingGlobal, setIsLoadingGlobal] = useState(false);

  // Normalize current grammar type
  const normalizedId = useMemo(() => normalizeGrammarTypeId(grammarType), [grammarType]);
  
  const typeMeta: GrammarCategorySummary = useMemo(() => {
    return (
      GRAMMAR_TYPES.find((g) => g.id === normalizedId) || {
        id: normalizedId,
        name: grammarType,
        nameArabic: 'التصنيف الصرفي والنحوي',
        pattern: 'صيغة اشتقاقية',
        categoryGroup: 'verb',
        description: 'Derivations sharing this grammatical category across the Quranic corpus.',
        totalDerivations: 0,
        totalOccurrences: 0
      }
    );
  }, [normalizedId, grammarType]);

  // Fetch global derivations when switching to "all" scope or if propDerivations not provided
  React.useEffect(() => {
    let isMounted = true;
    if (scope === 'all' || !propDerivations) {
      setIsLoadingGlobal(true);
      fetch(`/api/grammar-derivations?type=${encodeURIComponent(normalizedId)}`)
        .then((res) => res.json())
        .then((data) => {
          if (isMounted && data.derivations) {
            setGlobalDerivations(data.derivations);
          }
        })
        .catch((err) => console.error('Failed to load grammar derivations:', err))
        .finally(() => {
          if (isMounted) setIsLoadingGlobal(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [normalizedId, scope, propDerivations]);

  // Determine active source derivations
  const sourceDerivations = useMemo(() => {
    if (scope === 'root' && propDerivations) {
      // Filter propDerivations matching this grammar type
      return propDerivations.filter((d) => normalizeGrammarTypeId(d.grammarCategory) === normalizedId);
    }
    return globalDerivations.length > 0 ? globalDerivations : (propDerivations || []);
  }, [scope, propDerivations, globalDerivations, normalizedId]);

  // Filtered derivations based on search & affix
  const filteredDerivations = useMemo(() => {
    return sourceDerivations.filter((d) => {
      // Affix filter
      if (affixFilter === 'prefix' && d.prefix === '—') return false;
      if (affixFilter === 'suffix' && d.suffix === '—') return false;
      if (affixFilter === 'bare' && (d.prefix !== '—' || d.suffix !== '—')) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchWord = d.word.includes(q);
        const matchTranslit = d.transliteration.toLowerCase().includes(q);
        const matchMeaning = d.meaning.toLowerCase().includes(q);
        const matchPrefix = d.prefix.toLowerCase().includes(q);
        const matchSuffix = d.suffix.toLowerCase().includes(q);
        const matchRoot = (d.root && d.root.toLowerCase().includes(q)) || (d.rootArabic && d.rootArabic.includes(q));

        if (!matchWord && !matchTranslit && !matchMeaning && !matchPrefix && !matchSuffix && !matchRoot) {
          return false;
        }
      }

      return true;
    });
  }, [sourceDerivations, affixFilter, searchQuery]);

  // Sort derivations
  const sortedDerivations = useMemo(() => {
    const list = [...filteredDerivations];
    list.sort((a, b) => {
      let comp = 0;
      if (sortField === 'root') {
        const rootA = a.rootArabic || a.root || '';
        const rootB = b.rootArabic || b.root || '';
        comp = rootA.localeCompare(rootB, 'ar');
      } else if (sortField === 'word') {
        comp = a.word.localeCompare(b.word, 'ar');
      } else if (sortField === 'prefix') {
        comp = a.prefix.localeCompare(b.prefix);
      } else if (sortField === 'suffix') {
        comp = a.suffix.localeCompare(b.suffix);
      } else if (sortField === 'meaning') {
        comp = a.meaning.localeCompare(b.meaning);
      } else if (sortField === 'frequency') {
        comp = a.frequency - b.frequency;
      }
      return sortDirection === 'asc' ? comp : -comp;
    });
    return list;
  }, [filteredDerivations, sortField, sortDirection]);

  // Total occurrences
  const totalFilteredOccurrences = useMemo(() => {
    return filteredDerivations.reduce((sum, d) => sum + d.frequency, 0);
  }, [filteredDerivations]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'frequency' ? 'desc' : 'asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 opacity-60 group-hover:opacity-100" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 font-bold" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 font-bold" />
    );
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['#', 'Root', 'Word (Arabic)', 'Transliteration', 'Prefix', 'Suffix', 'Meaning in English', 'Frequency', 'Sample Verses'];
    const rows = sortedDerivations.map((d, index) => [
      index + 1,
      `"${d.rootArabic || d.root || '—'}"`,
      `"${d.word}"`,
      `"${d.transliteration}"`,
      `"${d.prefix}"`,
      `"${d.suffix}"`,
      `"${d.meaning.replace(/"/g, '""')}"`,
      d.frequency,
      `"${(d.examples || []).join('; ')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `quran_${normalizedId}_derivations_table.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Header Banner: Grammar Type Profile & Scope Selector */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-stone-100 rounded-2xl p-5 border border-stone-800 shadow-md relative overflow-hidden">
        {/* Decorative Arabic Calligraphy Watermark */}
        <div className="absolute right-4 -bottom-6 font-arabic text-7xl md:text-8xl text-stone-800/40 select-none pointer-events-none">
          {typeMeta.nameArabic}
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
                Grammar Category Table
              </span>
              {typeMeta.pattern && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 border border-stone-700 text-xs font-mono">
                  Weight (وزن): <strong className="ml-1 text-amber-300 font-arabic">{typeMeta.pattern}</strong>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mt-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>{typeMeta.name}</span>
                <span className="text-amber-400 font-arabic text-lg sm:text-xl font-medium">
                  ({typeMeta.nameArabic})
                </span>
              </h2>
            </div>

            <p className="text-xs text-stone-400 mt-1 max-w-2xl leading-relaxed">
              {typeMeta.description}
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Scope Toggle if root is available */}
            {currentRootCode && (
              <div className="flex items-center bg-stone-800 p-1 rounded-xl border border-stone-700">
                <button
                  onClick={() => setScope('root')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    scope === 'root'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Root {currentRootArabic || currentRootCode}
                </button>
                <button
                  onClick={() => setScope('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    scope === 'all'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  All Quran Roots
                </button>
              </div>
            )}

            {/* Close Button if rendered inside a modal/drawer */}
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition-colors"
                title="Close Grammar Derivations Table"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Summary metrics */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>{sortedDerivations.length} Derivations Found</span>
            </span>
            <span className="h-3.5 w-px bg-stone-300 dark:bg-stone-700" />
            <span className="text-xs text-stone-500 dark:text-stone-400">
              {totalFilteredOccurrences.toLocaleString()} total occurrences
            </span>
          </div>

          {/* Search and Action Bar */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search root, word, meaning, affix..."
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
                >
                  ×
                </button>
              )}
            </div>

            {/* Affix Quick Filters */}
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-0.5 rounded-xl border border-stone-200 dark:border-stone-700">
              <button
                onClick={() => setAffixFilter('all')}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                  affixFilter === 'all'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setAffixFilter('prefix')}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                  affixFilter === 'prefix'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                With Prefix
              </button>
              <button
                onClick={() => setAffixFilter('suffix')}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                  affixFilter === 'suffix'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                With Suffix
              </button>
              <button
                onClick={() => setAffixFilter('bare')}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                  affixFilter === 'bare'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                Bare Root
              </button>
            </div>

            {/* Export CSV button */}
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-200 text-xs font-semibold border border-stone-200 dark:border-stone-700 transition-colors shrink-0 cursor-pointer"
              title="Download Derivations Table as CSV"
            >
              <Download className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* THE DERIVATIONS TABLE WITH REQUESTED COLUMNS:
          1. root
          2. word
          3. prefix
          4. suffix
          5. meaning in english
          6. frequency
      */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            
            {/* Table Header */}
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/75 dark:bg-stone-850/50 text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider select-none">
                
                {/* Index */}
                <th className="py-3 px-3 text-center w-12">#</th>

                {/* 1. ROOT (Requested Column 1) */}
                <th
                  onClick={() => handleSort('root')}
                  className="py-3 px-4 cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Root (الجذر)</span>
                    {getSortIcon('root')}
                  </div>
                </th>

                {/* 2. WORD (Requested Column 2) */}
                <th
                  onClick={() => handleSort('word')}
                  className="py-3 px-4 cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Word (الكلمة)</span>
                    {getSortIcon('word')}
                  </div>
                </th>

                {/* 3. PREFIX (Requested Column 3) */}
                <th
                  onClick={() => handleSort('prefix')}
                  className="py-3 px-3 cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Prefix (السابقة)</span>
                    {getSortIcon('prefix')}
                  </div>
                </th>

                {/* 4. SUFFIX (Requested Column 4) */}
                <th
                  onClick={() => handleSort('suffix')}
                  className="py-3 px-3 cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Suffix (اللاحقة)</span>
                    {getSortIcon('suffix')}
                  </div>
                </th>

                {/* 5. MEANING IN ENGLISH (Requested Column 5) */}
                <th
                  onClick={() => handleSort('meaning')}
                  className="py-3 px-4 cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Meaning in English</span>
                    {getSortIcon('meaning')}
                  </div>
                </th>

                {/* 6. FREQUENCY (Requested Column 6) */}
                <th
                  onClick={() => handleSort('frequency')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors group"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Frequency</span>
                    {getSortIcon('frequency')}
                  </div>
                </th>

                {/* Verse Occurrences Action */}
                <th className="py-3 px-3 text-center w-16">Verses</th>

              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 text-xs">
              {isLoadingGlobal ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-500 dark:text-stone-400">
                    <div className="inline-block w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mb-2" />
                    <p className="font-semibold text-sm">Loading grammar derivations...</p>
                  </td>
                </tr>
              ) : sortedDerivations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-500 dark:text-stone-400">
                    <BookOpen className="w-8 h-8 mx-auto text-stone-300 dark:text-stone-600 mb-2" />
                    <p className="font-semibold text-sm">No derivations found for this grammar type</p>
                    <p className="text-xs mt-1">Try switching to "All Quran Roots" or adjusting your search filters.</p>
                  </td>
                </tr>
              ) : (
                sortedDerivations.map((d, index) => {
                  const isExpanded = expandedId === d.id;
                  const maxFrequency = sortedDerivations[0]?.frequency || 1;
                  const freqPercent = Math.min(100, Math.round((d.frequency / maxFrequency) * 100));

                  return (
                    <React.Fragment key={d.id || `${d.word}-${index}`}>
                      
                      {/* Derivation Row */}
                      <tr
                        onClick={() => setExpandedId(isExpanded ? null : d.id)}
                        className={`hover:bg-amber-50/50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer ${
                          isExpanded ? 'bg-amber-50/70 dark:bg-stone-800/70 border-l-4 border-l-amber-500' : ''
                        }`}
                      >
                        {/* # Index */}
                        <td className="py-3.5 px-3 text-center text-stone-400 font-mono text-[11px]">
                          {index + 1}
                        </td>

                        {/* COLUMN 1: ROOT */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {d.root ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onSelectRoot && d.root) {
                                  onSelectRoot(d.root);
                                }
                              }}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 hover:bg-amber-100 hover:border-amber-400 transition-all font-semibold group/root cursor-pointer"
                              title={`View full root concordance for ${d.root}`}
                            >
                              <span className="font-arabic text-base font-bold text-amber-700 dark:text-amber-400 group-hover/root:underline">
                                {d.rootArabic || d.root}
                              </span>
                              <span className="font-mono text-[10px] text-stone-500 dark:text-stone-400">
                                ({d.root})
                              </span>
                              <ExternalLink className="w-3 h-3 text-amber-600 dark:text-amber-400 opacity-60 group-hover/root:opacity-100" />
                            </button>
                          ) : (
                            <span className="text-stone-400 font-mono text-xs">—</span>
                          )}
                        </td>

                        {/* COLUMN 2: WORD (Arabic + Transliteration + Pronunciation) */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="flex flex-col items-start gap-0.5">
                              <span className="font-arabic text-xl sm:text-2xl font-bold text-amber-800 dark:text-amber-300 leading-snug">
                                {d.word}
                              </span>
                              <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 italic">
                                {d.transliteration}
                              </span>
                            </div>

                            {/* Audio Play Button if occurrence has audio */}
                            {d.occurrences?.[0]?.audioUrl && onPlayAudio && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const url = d.occurrences?.[0]?.audioUrl;
                                  if (!url) return;
                                  if (activeAudioUrl === url && onStopAudio) {
                                    onStopAudio();
                                  } else {
                                    onPlayAudio(url);
                                  }
                                }}
                                className="p-1 rounded-md text-amber-600 hover:bg-amber-100 dark:hover:bg-stone-800 transition-colors ml-1"
                                title="Play pronunciation recitation"
                              >
                                {activeAudioUrl === d.occurrences?.[0]?.audioUrl ? (
                                  <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                                ) : (
                                  <Volume2 className="w-3.5 h-3.5 text-stone-400 hover:text-amber-600" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>

                        {/* COLUMN 3: PREFIX */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          {d.prefix !== '—' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80 text-[11px] font-medium font-arabic">
                              {d.prefix}
                            </span>
                          ) : (
                            <span className="text-stone-300 dark:text-stone-600 font-mono text-xs">—</span>
                          )}
                        </td>

                        {/* COLUMN 4: SUFFIX */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          {d.suffix !== '—' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 text-[11px] font-medium font-arabic">
                              {d.suffix}
                            </span>
                          ) : (
                            <span className="text-stone-300 dark:text-stone-600 font-mono text-xs">—</span>
                          )}
                        </td>

                        {/* COLUMN 5: MEANING IN ENGLISH */}
                        <td className="py-3.5 px-4 text-stone-800 dark:text-stone-200">
                          <span className="font-medium">"{d.meaning}"</span>
                        </td>

                        {/* COLUMN 6: FREQUENCY */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex flex-col items-end gap-1">
                            <span className="inline-flex items-center gap-1 font-mono font-bold text-xs px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
                              <span>{d.frequency}</span>
                              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-normal">
                                {d.frequency === 1 ? 'time' : 'times'}
                              </span>
                            </span>
                            <div className="w-16 h-1 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-500 rounded-full"
                                style={{ width: `${Math.max(8, freqPercent)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Expand Toggle Column */}
                        <td className="py-3.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedId(isExpanded ? null : d.id);
                            }}
                            className={`p-1.5 rounded-lg text-stone-400 hover:text-amber-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors ${
                              isExpanded ? 'bg-amber-100 dark:bg-amber-950 text-amber-600' : ''
                            }`}
                            title={isExpanded ? 'Collapse occurrences' : 'Expand verse occurrences'}
                          >
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </button>
                        </td>

                      </tr>

                      {/* Expandable Verse Occurrences Drawer */}
                      {isExpanded && (
                        <tr className="bg-amber-50/30 dark:bg-stone-850/70 border-b border-amber-200/60 dark:border-amber-900/40">
                          <td colSpan={8} className="p-4 sm:p-5">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between border-b border-amber-200/50 dark:border-stone-700 pb-2">
                                <div className="flex items-center gap-2">
                                  <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                  <span className="font-bold text-xs text-stone-800 dark:text-stone-200">
                                    Quranic Verses for derivation:
                                  </span>
                                  <span className="font-arabic font-bold text-base text-amber-700 dark:text-amber-400">
                                    {d.word}
                                  </span>
                                  <span className="text-xs text-stone-500">
                                    ({d.occurrences?.length || d.examples?.length || 0} citations available)
                                  </span>
                                </div>
                              </div>

                              {/* Occurrences list */}
                              {d.occurrences && d.occurrences.length > 0 ? (
                                <div className="grid grid-cols-1 gap-2.5 max-h-72 overflow-y-auto pr-1">
                                  {d.occurrences.slice(0, 10).map((v, vIdx) => (
                                    <div
                                      key={vIdx}
                                      className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs space-y-1.5 shadow-2xs"
                                    >
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                                            [{v.location}]
                                          </span>
                                          <span className="font-semibold text-stone-700 dark:text-stone-300">
                                            Surah {v.surahName || v.chapter}:{v.verse}
                                          </span>
                                        </div>

                                        {v.audioUrl && onPlayAudio && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              if (activeAudioUrl === v.audioUrl && onStopAudio) {
                                                onStopAudio();
                                              } else {
                                                onPlayAudio(v.audioUrl!);
                                              }
                                            }}
                                            className="p-1 rounded text-amber-600 hover:bg-stone-100 dark:hover:bg-stone-800"
                                            title="Listen to ayah"
                                          >
                                            {activeAudioUrl === v.audioUrl ? (
                                              <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                                            ) : (
                                              <Volume2 className="w-3.5 h-3.5 text-stone-400 hover:text-amber-600" />
                                            )}
                                          </button>
                                        )}
                                      </div>

                                      {/* Arabic Ayah snippet */}
                                      <p className="font-arabic text-base text-stone-900 dark:text-stone-100 text-right leading-loose pt-1">
                                        {v.ayahText}
                                      </p>

                                      {/* English translation */}
                                      <p className="text-stone-600 dark:text-stone-300 text-[11px] italic">
                                        "{v.translation}"
                                      </p>
                                    </div>
                                  ))}
                                  {d.occurrences.length > 10 && (
                                    <p className="text-center text-[11px] text-stone-400 py-1">
                                      Showing first 10 of {d.occurrences.length} verses.
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <p className="text-xs text-stone-400 italic">
                                  Citations in Quran: {(d.examples || []).join(', ') || 'Available in full concordance.'}
                                </p>
                              )}
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
      </div>
    </div>
  );
};
