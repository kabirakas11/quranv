import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { RootDetail } from '../types.ts';
import { WordVariationItem } from './WordVariationItem.tsx';
import { DerivationsTable } from './DerivationsTable.tsx';
import { DerivationTree } from './DerivationTree.tsx';
import { LinguisticInsights } from './LinguisticInsights.tsx';
import {
  ExternalLink,
  Download,
  Filter,
  Search,
  BookOpen,
  GitFork,
  Sparkles,
  ArrowLeft,
  Share2,
  ChevronDown,
  Table
} from 'lucide-react';

interface RootDetailViewProps {
  rootDetail: RootDetail;
  onBack?: () => void;
  onSelectRoot?: (code: string) => void;
}

export const RootDetailView: React.FC<RootDetailViewProps> = ({
  rootDetail,
  onBack,
  onSelectRoot
}) => {
  const [activeTab, setActiveTab] = useState<'derivations' | 'variations' | 'tree' | 'linguistics'>('derivations');
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [variationSearch, setVariationSearch] = useState('');
  const [activeAudioUrl, setActiveAudioUrl] = useState<string | null>(null);
  const [displayLimit, setDisplayLimit] = useState(50);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop audio on unmount or root switch
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [rootDetail.code]);

  const handlePlayAudio = (url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(url);
    audioRef.current = audio;
    setActiveAudioUrl(url);

    audio.onended = () => {
      setActiveAudioUrl(null);
    };
    audio.onerror = () => {
      setActiveAudioUrl(null);
    };
    audio.play().catch(() => {
      setActiveAudioUrl(null);
    });
  };

  const handleStopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setActiveAudioUrl(null);
  };

  // Flatten all variations across all sections
  const allVariations = useMemo(() => {
    const list: Array<{ variation: any; sectionHeading: string }> = [];
    for (const sec of rootDetail.sections) {
      for (const v of sec.variations) {
        list.push({
          variation: v,
          sectionHeading: sec.heading
        });
      }
    }
    return list;
  }, [rootDetail]);

  // Filter variations based on selectedForm, selectedSection, and search
  const filteredVariations = useMemo(() => {
    return allVariations.filter(({ variation, sectionHeading }) => {
      // 1. Filter by section heading
      if (selectedSection && sectionHeading !== selectedSection) {
        return false;
      }

      // 2. Filter by selected derived form
      if (selectedForm) {
        const formNorm = selectedForm.toLowerCase();
        const headingNorm = sectionHeading.toLowerCase();
        // Check if section heading matches form or word matches
        const matchesHeading = headingNorm.includes(formNorm);
        const matchesWord =
          variation.transliteration.toLowerCase().includes(formNorm) ||
          variation.targetWord.includes(selectedForm);
        if (!matchesHeading && !matchesWord) {
          return false;
        }
      }

      // 3. Search query
      if (variationSearch.trim()) {
        const q = variationSearch.trim().toLowerCase();
        const matchLocation = variation.location.includes(q);
        const matchSurah = variation.surahName?.toLowerCase().includes(q);
        const matchTranslit = variation.transliteration.toLowerCase().includes(q);
        const matchTranslation = variation.translation.toLowerCase().includes(q);
        const matchArabic = variation.targetWord.includes(q) || variation.ayahText.includes(q);
        if (!matchLocation && !matchSurah && !matchTranslit && !matchTranslation && !matchArabic) {
          return false;
        }
      }

      return true;
    });
  }, [allVariations, selectedSection, selectedForm, variationSearch]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Location', 'Surah', 'Verse', 'WordNumber', 'TargetWordArabic', 'Transliteration', 'Translation', 'SectionHeading', 'AyahSnippet'];
    const rows = filteredVariations.map(({ variation, sectionHeading }) => [
      variation.location,
      `"${variation.surahName || variation.chapter}"`,
      variation.verse,
      variation.wordNumber,
      `"${variation.targetWord}"`,
      `"${variation.transliteration}"`,
      `"${variation.translation.replace(/"/g, '""')}"`,
      `"${sectionHeading.replace(/"/g, '""')}"`,
      `"${variation.ayahText.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `quran_root_${rootDetail.code}_variations.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(rootDetail, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `quran_root_${rootDetail.code}_complete.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* Back button for mobile / navigation */}
      {onBack && (
        <button
          onClick={onBack}
          className="md:hidden inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-amber-600"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Roots List</span>
        </button>
      )}

      {/* Hero Header Card */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-stone-100 rounded-2xl p-6 border border-stone-800 shadow-lg relative overflow-hidden">
        {/* Background Arabic Calligraphy Watermark */}
        <div className="absolute right-4 -bottom-6 font-arabic text-8xl md:text-9xl text-stone-800/40 select-none pointer-events-none">
          {rootDetail.arabicRoot}
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Root Typography & Transliteration */}
          <div>
            <div className="flex items-center gap-3">
              <span className="font-arabic text-4xl sm:text-5xl font-bold tracking-widest text-amber-400">
                {rootDetail.arabicRoot}
              </span>
              <div className="h-8 w-px bg-stone-700 hidden sm:block" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white capitalize">
                  {rootDetail.rootTranslit}
                </h2>
                <p className="text-xs text-stone-400 font-mono">
                  Buckwalter Code: <span className="text-amber-300 font-bold">{rootDetail.code}</span>
                </p>
              </div>
            </div>

            {/* Badges / Metrics */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                <span>{rootDetail.occurrences}</span>
                <span className="font-normal text-amber-200/80">Quran Occurrences</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-700/60 text-xs font-bold">
                <Table className="w-3.5 h-3.5 text-amber-400" />
                <span>{rootDetail.derivations?.length || 0}</span>
                <span className="font-normal text-amber-200/80">Derivations in Table</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-800 text-stone-300 border border-stone-700 text-xs font-medium">
                <span>{rootDetail.derivedForms.length}</span>
                <span>Derived Grammatical Forms</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-800 text-stone-300 border border-stone-700 text-xs font-medium">
                <span>{rootDetail.sections.length}</span>
                <span>Syntactic Categories</span>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap md:flex-col lg:flex-row items-center gap-2 shrink-0">
            <a
              href={rootDetail.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-colors shadow-xs"
            >
              <span>Corpus.Quran.com</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </a>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-colors shadow-xs cursor-pointer"
              title="Download all word variations as CSV"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-colors shadow-xs cursor-pointer"
              title="Download complete root tree data as JSON"
            >
              <span>JSON</span>
            </button>
          </div>

        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-stone-200 dark:border-stone-800 gap-4 overflow-x-auto no-scrollbar">
        {/* TAB 1 (DEFAULT): Derivations Table */}
        <button
          onClick={() => setActiveTab('derivations')}
          className={`pb-3 px-1 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'derivations'
              ? 'border-amber-600 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>Derivations Table</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-bold">
            {rootDetail.derivations?.length || 0}
          </span>
        </button>

        {/* TAB 2: All Verse Occurrences */}
        <button
          onClick={() => setActiveTab('variations')}
          className={`pb-3 px-1 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'variations'
              ? 'border-amber-600 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>All Verses Concordance</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 font-normal">
            {rootDetail.occurrences}
          </span>
        </button>

        {/* TAB 3: Hierarchy Tree */}
        <button
          onClick={() => setActiveTab('tree')}
          className={`pb-3 px-1 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'tree'
              ? 'border-amber-600 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <GitFork className="w-4 h-4" />
          <span>Derivation Hierarchy</span>
        </button>

        {/* TAB 4: Classical Lexicon */}
        <button
          onClick={() => setActiveTab('linguistics')}
          className={`pb-3 px-1 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'linguistics'
              ? 'border-amber-600 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Classical Lexicon (AI)</span>
        </button>
      </div>

      {/* TAB CONTENT 0: Derivations Table (Word, Prefix, Suffix, Category, Meaning, Frequency) */}
      {activeTab === 'derivations' && (
        <DerivationsTable
          derivations={rootDetail.derivations || []}
          rootArabic={rootDetail.arabicRoot}
          rootTranslit={rootDetail.rootTranslit}
          activeAudioUrl={activeAudioUrl}
          onPlayAudio={handlePlayAudio}
          onStopAudio={handleStopAudio}
          onSelectRoot={onSelectRoot}
        />
      )}

      {/* TAB CONTENT 1: Variations & Concordance */}
      {activeTab === 'variations' && (
        <div className="space-y-4">
          
          {/* Morphological Derived Forms Quick Filter Carousel */}
          {rootDetail.derivedForms.length > 0 && (
            <div className="bg-white dark:bg-stone-900 rounded-xl p-4 border border-stone-200 dark:border-stone-800 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="w-3 h-3" />
                  Filter by Derived Grammatical Form:
                </span>
                {selectedForm && (
                  <button
                    onClick={() => setSelectedForm(null)}
                    className="text-xs text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    Reset Filter
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {/* All */}
                <button
                  onClick={() => setSelectedForm(null)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 border ${
                    selectedForm === null
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                  }`}
                >
                  All Forms ({rootDetail.occurrences})
                </button>

                {/* Form Pills */}
                {rootDetail.derivedForms.map((df, idx) => {
                  const isSelected = selectedForm === df.formType;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedForm(isSelected ? null : df.formType)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 border flex items-center gap-2 ${
                        isSelected
                          ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 text-amber-900 dark:text-amber-200 shadow-xs ring-1 ring-amber-500'
                          : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                      }`}
                    >
                      {df.arabicLemma && (
                        <span className="font-arabic font-bold text-amber-700 dark:text-amber-400 text-sm">
                          {df.arabicLemma}
                        </span>
                      )}
                      <span>{df.formType}</span>
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                        {df.countText}x
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section Filter & In-Root Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-stone-900 rounded-xl p-3.5 border border-stone-200 dark:border-stone-800 shadow-xs">
            {/* Search within this root's variations */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={variationSearch}
                onChange={(e) => setVariationSearch(e.target.value)}
                placeholder="Search word, translation, or location (e.g. 2:282)..."
                className="w-full pl-9 pr-8 py-1.5 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              {variationSearch && (
                <button
                  onClick={() => setVariationSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
                >
                  ×
                </button>
              )}
            </div>

            {/* Sections Dropdown / Selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xs text-stone-500 shrink-0">
                Showing <strong className="text-stone-800 dark:text-stone-200">{filteredVariations.length}</strong> of {rootDetail.occurrences} occurrences
              </span>

              {rootDetail.sections.length > 1 && (
                <select
                  value={selectedSection || ''}
                  onChange={(e) => setSelectedSection(e.target.value || null)}
                  className="text-xs py-1.5 px-2.5 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="">All Categories ({rootDetail.sections.length})</option>
                  {rootDetail.sections.map((sec, i) => (
                    <option key={i} value={sec.heading}>
                      {sec.heading} ({sec.count})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* List of Variations */}
          {filteredVariations.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
              <BookOpen className="w-8 h-8 mx-auto text-stone-400 mb-2" />
              <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                No matching word variations found
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Try clearing your search query or form filter
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredVariations.slice(0, displayLimit).map(({ variation }, idx) => (
                <WordVariationItem
                  key={`${variation.location}-${idx}`}
                  variation={variation}
                  index={idx}
                  activeAudioUrl={activeAudioUrl}
                  onPlayAudio={handlePlayAudio}
                  onStopAudio={handleStopAudio}
                />
              ))}

              {/* Load more button if large occurrences list */}
              {filteredVariations.length > displayLimit && (
                <div className="text-center pt-4 pb-2">
                  <button
                    onClick={() => setDisplayLimit((prev) => prev + 50)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors"
                  >
                    <span>Load More Variations ({filteredVariations.length - displayLimit} remaining)</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* TAB CONTENT 2: Morphological Derivation Tree */}
      {activeTab === 'tree' && (
        <DerivationTree
          arabicRoot={rootDetail.arabicRoot}
          rootTranslit={rootDetail.rootTranslit}
          derivedForms={rootDetail.derivedForms}
          selectedForm={selectedForm}
          onSelectForm={(form) => {
            setSelectedForm(form);
            setActiveTab('variations');
          }}
        />
      )}

      {/* TAB CONTENT 3: AI Linguistic Insights */}
      {activeTab === 'linguistics' && (
        <LinguisticInsights rootDetail={rootDetail} />
      )}

    </div>
  );
};
