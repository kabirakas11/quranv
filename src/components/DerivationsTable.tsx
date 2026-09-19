import React, { useState, useMemo } from 'react';
import type { RootDerivation, WordVariation } from '../types.ts';
import { WordVariationItem } from './WordVariationItem.tsx';
import { PartsOfSpeechWordsTable } from './PartsOfSpeechWordsTable.tsx';
import {
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  ChevronRight,
  ChevronDown,
  Layers,
  Sparkles,
  BookOpen,
  Volume2,
  ArrowLeft
} from 'lucide-react';

interface DerivationsTableProps {
  derivations: RootDerivation[];
  rootArabic: string;
  rootTranslit: string;
  activeAudioUrl: string | null;
  onPlayAudio: (url: string) => void;
  onStopAudio: () => void;
  onSelectRoot?: (code: string) => void;
}

type SortField = 'root' | 'word' | 'transliteration' | 'prefix' | 'suffix' | 'grammarCategory' | 'meaning' | 'frequency';
type SortDirection = 'asc' | 'desc';

export const DerivationsTable: React.FC<DerivationsTableProps> = ({
  derivations,
  rootArabic,
  rootTranslit,
  activeAudioUrl,
  onPlayAudio,
  onStopAudio,
  onSelectRoot
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [affixFilter, setAffixFilter] = useState<'all' | 'prefix' | 'suffix' | 'bare'>('all');
  const [sortField, setSortField] = useState<SortField>('frequency');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'semantic'>('table');
  const [activeGrammarModal, setActiveGrammarModal] = useState<string | null>(null);

  // Distinct grammar categories for filter pills
  const categories = useMemo(() => {
    const set = new Set<string>();
    derivations.forEach((d) => {
      if (d.grammarCategory) set.add(d.grammarCategory);
    });
    return Array.from(set).sort();
  }, [derivations]);

  // Handle column header sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      // Default to desc for frequency, asc for text fields
      setSortDirection(field === 'frequency' ? 'desc' : 'asc');
    }
  };

  // Filter derivations
  const filteredDerivations = useMemo(() => {
    return derivations.filter((d) => {
      // 1. Category filter
      if (selectedCategory !== 'all' && d.grammarCategory !== selectedCategory) {
        return false;
      }

      // 2. Affix filter
      if (affixFilter === 'prefix' && d.prefix === '—') return false;
      if (affixFilter === 'suffix' && d.suffix === '—') return false;
      if (affixFilter === 'bare' && (d.prefix !== '—' || d.suffix !== '—')) return false;

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchWord = d.word.includes(q);
        const matchTranslit = d.transliteration.toLowerCase().includes(q);
        const matchPrefix = d.prefix.toLowerCase().includes(q);
        const matchSuffix = d.suffix.toLowerCase().includes(q);
        const matchCat = d.grammarCategory.toLowerCase().includes(q);
        const matchMeaning = d.meaning.toLowerCase().includes(q);
        if (!matchWord && !matchTranslit && !matchPrefix && !matchSuffix && !matchCat && !matchMeaning) {
          return false;
        }
      }

      return true;
    });
  }, [derivations, selectedCategory, affixFilter, searchQuery]);

  // Sort filtered derivations
  const sortedDerivations = useMemo(() => {
    const list = [...filteredDerivations];
    list.sort((a, b) => {
      let comp = 0;
      if (sortField === 'frequency') {
        comp = a.frequency - b.frequency;
      } else if (sortField === 'root') {
        const rootA = a.rootArabic || rootArabic;
        const rootB = b.rootArabic || rootArabic;
        comp = rootA.localeCompare(rootB, 'ar');
      } else if (sortField === 'word') {
        comp = a.word.localeCompare(b.word, 'ar');
      } else if (sortField === 'transliteration') {
        comp = a.transliteration.localeCompare(b.transliteration);
      } else if (sortField === 'prefix') {
        comp = a.prefix.localeCompare(b.prefix);
      } else if (sortField === 'suffix') {
        comp = a.suffix.localeCompare(b.suffix);
      } else if (sortField === 'grammarCategory') {
        comp = a.grammarCategory.localeCompare(b.grammarCategory);
      } else if (sortField === 'meaning') {
        comp = a.meaning.localeCompare(b.meaning);
      }
      return sortDirection === 'asc' ? comp : -comp;
    });
    return list;
  }, [filteredDerivations, sortField, sortDirection]);

  // Total frequency in filtered results
  const totalFilteredOccurrences = useMemo(() => {
    return filteredDerivations.reduce((sum, d) => sum + d.frequency, 0);
  }, [filteredDerivations]);

  // Semantic grouping of derivations based on sorted results
  const semanticGroups = useMemo(() => {
    const groups: {
      role: 'Action' | 'Agent' | 'Object' | 'Entity' | 'Attribute';
      title: string;
      titleArabic: string;
      desc: string;
      color: string;
      items: RootDerivation[];
      totalOccurrences: number;
    }[] = [
      {
        role: 'Action',
        title: 'Actions & Verbs',
        titleArabic: 'الأفعال والعمليات والحدث',
        desc: 'Verb forms (past, present, imperative, derived verbal stems)',
        color: 'amber',
        items: [],
        totalOccurrences: 0
      },
      {
        role: 'Agent',
        title: 'Agents & Subjects',
        titleArabic: 'الفاعلون وأصحاب الصفة',
        desc: 'Active participles, doers, agents, and proper names',
        color: 'emerald',
        items: [],
        totalOccurrences: 0
      },
      {
        role: 'Object',
        title: 'Objects & Recipients',
        titleArabic: 'المفعول به والمستقبلات',
        desc: 'Passive participles, direct objects, and patient nouns',
        color: 'purple',
        items: [],
        totalOccurrences: 0
      },
      {
        role: 'Entity',
        title: 'Concrete Entities & Instruments',
        titleArabic: 'الذوات والأدوات والمسميات',
        desc: 'Nouns of place, instrument, time, and concrete creations',
        color: 'sky',
        items: [],
        totalOccurrences: 0
      },
      {
        role: 'Attribute',
        title: 'Abstract Attributes & States',
        titleArabic: 'المعاني والصفات والمصادر',
        desc: 'Verbal nouns (masdars), qualitative attributes, and moral qualities',
        color: 'teal',
        items: [],
        totalOccurrences: 0
      }
    ];

    sortedDerivations.forEach((d) => {
      const role = d.semanticRole || 'Attribute';
      const targetGroup = groups.find((g) => g.role === role) || groups[4];
      targetGroup.items.push(d);
      targetGroup.totalOccurrences += d.frequency;
    });

    return groups.filter((g) => g.items.length > 0);
  }, [sortedDerivations]);

  // Export Derivations Table as CSV
  const handleExportCSV = () => {
    const headers = ['#', 'Word (Arabic)', 'Transliteration', 'Prefix', 'Suffix', 'Grammar Category', 'Meaning in English', 'Frequency', 'Sample Verses'];
    const rows = sortedDerivations.map((d, index) => [
      index + 1,
      `"${d.word}"`,
      `"${d.transliteration}"`,
      `"${d.prefix}"`,
      `"${d.suffix}"`,
      `"${d.grammarCategory}"`,
      `"${d.meaning.replace(/"/g, '""')}"`,
      d.frequency,
      `"${(d.examples || []).join(', ')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `quran_root_${rootArabic}_derivations_table.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
    );
  };

  // Helper color for grammar categories
  const getCategoryBadgeClass = (cat: string) => {
    const lower = cat.toLowerCase();
    if (lower.includes('verb')) {
      return 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/80';
    }
    if (lower.includes('noun')) {
      return 'bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800/80';
    }
    if (lower.includes('active participle')) {
      return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80';
    }
    if (lower.includes('passive participle')) {
      return 'bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/80';
    }
    if (lower.includes('nominal')) {
      return 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800/80';
    }
    return 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700';
  };

  if (activeGrammarModal) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 shadow-xs">
          <button
            onClick={() => setActiveGrammarModal(null)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-200 text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-all cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Back to Root {rootArabic} ({rootTranslit}) Derivations</span>
          </button>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-400">Words Table:</span>
            <span className="font-semibold text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 px-2.5 py-0.5 rounded-md border border-stone-200 dark:border-stone-700">
              Part of Speech: {activeGrammarModal}
            </span>
          </div>
        </div>

        <PartsOfSpeechWordsTable
          partOfSpeech={activeGrammarModal}
          words={derivations}
          currentRootCode={rootTranslit}
          currentRootArabic={rootArabic}
          onSelectRoot={onSelectRoot}
          activeAudioUrl={activeAudioUrl}
          onPlayAudio={onPlayAudio}
          onStopAudio={onStopAudio}
          onClose={() => setActiveGrammarModal(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Header Controls & Filters */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
        
        {/* Top bar: Summary & Search & Export */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Morphological Derivations Table</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                {derivations.length} distinct word forms
              </span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Breakdown of word stems, prefixes, suffixes, grammatical categories, and Quranic frequencies for root{' '}
              <strong className="font-arabic text-amber-700 dark:text-amber-400">{rootArabic}</strong> ({rootTranslit}).
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search word, meaning, prefix..."
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

            {/* Export CSV button */}
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-200 text-xs font-semibold border border-stone-200 dark:border-stone-700 transition-colors shrink-0 cursor-pointer"
              title="Export Derivations Table as CSV"
            >
              <Download className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">Export Table CSV</span>
            </button>

            {/* View Mode Toggle: Table vs Semantic Grouping */}
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-0.5 rounded-xl border border-stone-200 dark:border-stone-700 shrink-0">
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('semantic')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  viewMode === 'semantic'
                    ? 'bg-white dark:bg-stone-700 text-amber-700 dark:text-amber-400 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Semantic Roles</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Badges Row: Categories & Affix Filter */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 dark:border-stone-800/80 text-xs">
          
          {/* Grammar Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full py-0.5">
            <span className="text-stone-400 font-medium shrink-0 flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" /> Category:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-750'
              }`}
            >
              All ({derivations.length})
            </button>
            {categories.map((cat) => {
              const count = derivations.filter((d) => d.grammarCategory === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? 'all' : cat)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all shrink-0 border ${
                    selectedCategory === cat
                      ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-500 text-amber-900 dark:text-amber-200 font-semibold'
                      : 'bg-stone-50 dark:bg-stone-800/70 border-stone-200 dark:border-stone-750 text-stone-600 dark:text-stone-400 hover:border-amber-400'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}

            {selectedCategory !== 'all' && (
              <button
                type="button"
                onClick={() => setActiveGrammarModal(selectedCategory)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white transition-all shadow-xs flex items-center gap-1 shrink-0 cursor-pointer"
                title={`Open all words of "${selectedCategory}" with word, meaning, and frequency`}
              >
                <Layers className="w-3 h-3" />
                <span>Open "{selectedCategory}" Words Table &rarr;</span>
              </button>
            )}
          </div>

          {/* Affix Filter (Prefix, Suffix, or Bare Stem) */}
          <div className="flex items-center gap-1 shrink-0 bg-stone-100 dark:bg-stone-800 p-0.5 rounded-lg border border-stone-200 dark:border-stone-700">
            <button
              onClick={() => setAffixFilter('all')}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                affixFilter === 'all'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
              }`}
            >
              All Words
            </button>
            <button
              onClick={() => setAffixFilter('prefix')}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                affixFilter === 'prefix'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
              }`}
            >
              Has Prefix
            </button>
            <button
              onClick={() => setAffixFilter('suffix')}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                affixFilter === 'suffix'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
              }`}
            >
              Has Suffix
            </button>
            <button
              onClick={() => setAffixFilter('bare')}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                affixFilter === 'bare'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
              }`}
            >
              Stem Only
            </button>
          </div>

        </div>

      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden">
        
        {/* Table summary row */}
        <div className="px-4 py-2.5 bg-stone-50/80 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500">
          <div>
            Showing <strong className="text-stone-800 dark:text-stone-200">{sortedDerivations.length}</strong> derivations
            ({totalFilteredOccurrences} total Quranic occurrences)
          </div>
          <div className="text-[11px] text-stone-400 hidden sm:block">
            Tip: Click any row to view verse occurrences & hear audio
          </div>
        </div>

        {/* Content: Semantic Groups vs Flat Table View */}
        {viewMode === 'semantic' ? (
          <div className="p-4 space-y-6">
            <div className="bg-amber-50/60 dark:bg-amber-950/20 p-3.5 rounded-xl border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200">
              <span className="font-bold">Semantic Roles Breakdown:</span> Words derived from root{' '}
              <strong className="font-arabic font-bold text-amber-700 dark:text-amber-400">{rootArabic}</strong> categorized by linguistic functional role (action, agent, patient object, concrete entity, or qualitative attribute).
            </div>

            {semanticGroups.map((group) => (
              <div
                key={group.role}
                className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-850/40 overflow-hidden shadow-xs"
              >
                {/* Group Header */}
                <div className="px-5 py-3.5 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                        {group.title}
                      </h4>
                      <span className="text-xs font-arabic text-amber-700 dark:text-amber-400 font-semibold">
                        ({group.titleArabic})
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">{group.desc}</p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-medium text-stone-600 dark:text-stone-300">
                      {group.items.length} derivations &bull; {group.totalOccurrences} occurrences
                    </span>
                  </div>
                </div>

                {/* Cards for Words in this Semantic Group */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.items.map((d) => {
                    const isExpanded = expandedId === d.id;
                    return (
                      <div
                        key={d.id}
                        onClick={() => setExpandedId(isExpanded ? null : d.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                          isExpanded
                            ? 'border-amber-500 bg-amber-50/70 dark:bg-stone-800 shadow-xs'
                            : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-amber-400 dark:hover:border-amber-600'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="font-arabic text-2xl font-bold text-amber-800 dark:text-amber-300 leading-snug">
                              {d.word}
                            </div>
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              {d.frequency}×
                            </span>
                          </div>
                          <div className="text-xs text-stone-500 italic mt-0.5 font-serif">
                            {d.transliteration}
                          </div>
                          <div className="text-xs font-semibold text-stone-800 dark:text-stone-200 mt-2 line-clamp-2">
                            "{d.meaning}"
                          </div>
                        </div>

                        <div>
                          {/* Prefix / Suffix tags if present */}
                          {(d.prefix !== '—' || d.suffix !== '—') && (
                            <div className="flex items-center gap-2 text-[10px] text-stone-500 py-1 mb-1">
                              {d.prefix !== '—' && (
                                <span className="bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 px-1.5 py-0.5 rounded border border-sky-200 dark:border-sky-800">
                                  Prefix: {d.prefix}
                                </span>
                              )}
                              {d.suffix !== '—' && (
                                <span className="bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                                  Suffix: {d.suffix}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800">
                            <span className="truncate max-w-[140px]">{d.grammarCategory}</span>
                            <span className="text-amber-600 dark:text-amber-400 font-medium shrink-0">
                              {d.occurrences.length} verses {isExpanded ? '▲' : '▼'}
                            </span>
                          </div>

                          {/* Expanded occurrences inside card */}
                          {isExpanded && (
                            <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-750 space-y-2 max-h-60 overflow-y-auto">
                              <div className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                                Verse Occurrences:
                              </div>
                              {d.occurrences.map((variation, vIdx) => (
                                <WordVariationItem
                                  key={`${variation.location}-${vIdx}`}
                                  variation={variation}
                                  index={vIdx}
                                  activeAudioUrl={activeAudioUrl}
                                  onPlayAudio={onPlayAudio}
                                  onStopAudio={onStopAudio}
                                />
                              ))}
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Responsive Table Container */
          <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider select-none">
                
                {/* Index & Expand Toggle */}
                <th className="py-3 px-3 w-12 text-center">#</th>

                {/* 0. Root */}
                <th
                  onClick={() => handleSort('root')}
                  className="py-3 px-3 cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Root</span>
                    {getSortIcon('root')}
                  </div>
                </th>

                {/* 1. Word (Arabic + transliteration) */}
                <th
                  onClick={() => handleSort('word')}
                  className="py-3 px-4 cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Word (Arabic)</span>
                    {getSortIcon('word')}
                  </div>
                </th>

                {/* 2. Prefix */}
                <th
                  onClick={() => handleSort('prefix')}
                  className="py-3 px-3 cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Prefix</span>
                    {getSortIcon('prefix')}
                  </div>
                </th>

                {/* 3. Suffix */}
                <th
                  onClick={() => handleSort('suffix')}
                  className="py-3 px-3 cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Suffix</span>
                    {getSortIcon('suffix')}
                  </div>
                </th>

                {/* 4. Part of Speech */}
                <th
                  onClick={() => handleSort('grammarCategory')}
                  className="py-3 px-3 cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Part of Speech (قسم الكلام)</span>
                    {getSortIcon('grammarCategory')}
                  </div>
                </th>

                {/* 5. Meaning in English */}
                <th
                  onClick={() => handleSort('meaning')}
                  className="py-3 px-4 cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Meaning in English</span>
                    {getSortIcon('meaning')}
                  </div>
                </th>

                {/* 6. Frequency */}
                <th
                  onClick={() => handleSort('frequency')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors group"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Frequency</span>
                    {getSortIcon('frequency')}
                  </div>
                </th>

                {/* Action / Occurrences */}
                <th className="py-3 px-3 text-center w-16">Verses</th>

              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 text-xs">
              {sortedDerivations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-stone-500 dark:text-stone-400">
                    <BookOpen className="w-8 h-8 mx-auto text-stone-300 dark:text-stone-600 mb-2" />
                    <p className="font-semibold text-sm">No derivations found</p>
                    <p className="text-xs mt-1">Try adjusting your category filter or search query.</p>
                  </td>
                </tr>
              ) : (
                sortedDerivations.map((d, index) => {
                  const isExpanded = expandedId === d.id;
                  const maxFrequency = sortedDerivations[0]?.frequency || 1;
                  const freqPercent = Math.min(100, Math.round((d.frequency / maxFrequency) * 100));

                  return (
                    <React.Fragment key={d.id}>
                      {/* Derivation Row */}
                      <tr
                        onClick={() => setExpandedId(isExpanded ? null : d.id)}
                        className={`hover:bg-amber-50/50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer ${
                          isExpanded ? 'bg-amber-50/70 dark:bg-stone-800/70 border-l-4 border-l-amber-500' : ''
                        }`}
                      >
                        {/* Index */}
                        <td className="py-3.5 px-3 text-center text-stone-400 font-mono text-[11px]">
                          {index + 1}
                        </td>

                        {/* 0. Root */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-arabic text-base font-bold text-amber-800 dark:text-amber-300 leading-tight">
                              {d.rootArabic || rootArabic}
                            </span>
                            <span className="text-[10px] text-stone-500 dark:text-stone-400 font-mono">
                              {d.root || rootTranslit}
                            </span>
                          </div>
                        </td>

                        {/* 1. Word (Arabic + Transliteration) */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col items-start gap-0.5">
                            <span className="font-arabic text-xl sm:text-2xl font-bold text-amber-800 dark:text-amber-300 leading-snug">
                              {d.word}
                            </span>
                            <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 italic">
                              {d.transliteration}
                            </span>
                          </div>
                        </td>

                        {/* 2. Prefix */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          {d.prefix !== '—' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80 text-[11px] font-medium font-arabic">
                              {d.prefix}
                            </span>
                          ) : (
                            <span className="text-stone-300 dark:text-stone-600 font-mono text-xs">—</span>
                          )}
                        </td>

                        {/* 3. Suffix */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          {d.suffix !== '—' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 text-[11px] font-medium font-arabic">
                              {d.suffix}
                            </span>
                          ) : (
                            <span className="text-stone-300 dark:text-stone-600 font-mono text-xs">—</span>
                          )}
                        </td>

                        {/* 4. Grammar Category */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveGrammarModal(d.grammarCategory);
                            }}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-2xs group/btn ${getCategoryBadgeClass(
                              d.grammarCategory
                            )}`}
                            title={`Click to view all derivations of "${d.grammarCategory}" in a table`}
                          >
                            <span>{d.grammarCategory}</span>
                            <Layers className="w-2.5 h-2.5 opacity-60 group-hover/btn:opacity-100 transition-opacity" />
                          </button>
                        </td>

                        {/* 5. Meaning in English */}
                        <td className="py-3.5 px-4 text-stone-800 dark:text-stone-200">
                          <span className="font-medium">"{d.meaning}"</span>
                        </td>

                        {/* 6. Frequency */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex flex-col items-end gap-1">
                            <span className="inline-flex items-center gap-1 font-mono font-bold text-xs px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
                              <span>{d.frequency}</span>
                              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-normal">
                                {d.frequency === 1 ? 'time' : 'times'}
                              </span>
                            </span>
                            {/* Visual frequency indicator bar */}
                            <div className="w-16 h-1 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-500 rounded-full"
                                style={{ width: `${Math.max(8, freqPercent)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Expand Toggle */}
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
                            title={isExpanded ? 'Collapse occurrences' : 'Expand all verse occurrences'}
                          >
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </button>
                        </td>

                      </tr>

                      {/* Expanded Occurrences Panel */}
                      {isExpanded && (
                        <tr className="bg-stone-50 dark:bg-stone-850/80 border-b border-stone-200 dark:border-stone-800">
                          <td colSpan={8} className="p-4">
                            <div className="space-y-3">
                              
                              {/* Panel Header */}
                              <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
                                <div className="flex items-center gap-2">
                                  <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                                    All {d.occurrences.length} Occurrences of{' '}
                                    <span className="font-arabic font-bold text-sm text-amber-700 dark:text-amber-400">
                                      {d.word}
                                    </span>{' '}
                                    in the Quran
                                  </span>
                                </div>
                                <span className="text-[11px] text-stone-500 font-mono">
                                  Locations: {d.occurrences.map((o) => o.location).slice(0, 6).join(', ')}
                                  {d.occurrences.length > 6 ? ` +${d.occurrences.length - 6} more` : ''}
                                </span>
                              </div>

                              {/* Occurrences Items */}
                              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                                {d.occurrences.map((variation, vIdx) => (
                                  <WordVariationItem
                                    key={`${variation.location}-${vIdx}`}
                                    variation={variation}
                                    index={vIdx}
                                    activeAudioUrl={activeAudioUrl}
                                    onPlayAudio={onPlayAudio}
                                    onStopAudio={onStopAudio}
                                  />
                                ))}
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

        {/* Table Footer with Summary */}
        <div className="px-4 py-3 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-2">
          <div className="flex items-center gap-2">
            <span>
              Total Derivations: <strong>{derivations.length}</strong>
            </span>
            <span>•</span>
            <span>
              Filtered: <strong>{sortedDerivations.length}</strong>
            </span>
            <span>•</span>
            <span>
              Total Quranic Occurrences: <strong>{totalFilteredOccurrences}</strong>
            </span>
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-amber-600 dark:text-amber-400 hover:underline text-xs"
          >
            Back to Top ↑
          </button>
        </div>

      </div>
    </div>
  );
};
