import React, { useState, useEffect, useCallback } from 'react';
import type { RootSummary, RootDetail } from './types.ts';
import { Navbar } from './components/Navbar.tsx';
import { LetterSelector, type LetterStat } from './components/LetterSelector.tsx';
import { RootListSidebar } from './components/RootListSidebar.tsx';
import { RootDetailView } from './components/RootDetailView.tsx';
import { SemanticBrowser } from './components/SemanticBrowser.tsx';
import { PartsOfSpeechBrowser } from './components/PartsOfSpeechBrowser.tsx';
import { FluentFrequencyBrowser } from './components/FluentFrequencyBrowser.tsx';
import { Loader2, AlertCircle, BookOpen, Sparkles, RefreshCw } from 'lucide-react';
import { localVocabStore } from './utils/localVocabStore.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<'roots' | 'frequency' | 'semantic' | 'grammar' | 'pos'>('frequency');
  const [roots, setRoots] = useState<RootSummary[]>([]);
  const [letters, setLetters] = useState<LetterStat[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRootCode, setSelectedRootCode] = useState<string>('ktb');
  const [rootDetail, setRootDetail] = useState<RootDetail | null>(null);
  const [loadingRoots, setLoadingRoots] = useState<boolean>(true);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('detail');

  // Load letters list once
  useEffect(() => {
    fetch('/api/letters')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLetters(data);
        }
      })
      .catch((err) => console.error('Failed to load letters:', err));
  }, []);

  // Fetch roots with letter filter & search
  const fetchRoots = useCallback(async (letter: string, query: string) => {
    // 1. Try local storage first for 0ms instant display
    const localRoots = localVocabStore.getRoots(letter, query);
    if (localRoots.length > 0) {
      setRoots(localRoots);
      setLoadingRoots(false);
      return;
    }

    setLoadingRoots(true);
    try {
      const params = new URLSearchParams();
      if (letter && letter !== 'all') params.append('letter', letter);
      if (query) params.append('q', query);

      const res = await fetch(`/api/roots?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRoots(data.roots || []);
    } catch (err) {
      console.error('Failed to fetch roots:', err);
    } finally {
      setLoadingRoots(false);
    }
  }, []);

  useEffect(() => {
    fetchRoots(selectedLetter, searchQuery);
  }, [selectedLetter, searchQuery, fetchRoots]);

  // Subscribe to localVocabStore to refresh roots when local storage updates
  useEffect(() => {
    const unsubscribe = localVocabStore.subscribe(() => {
      const localRoots = localVocabStore.getRoots(selectedLetter, searchQuery);
      if (localRoots.length > 0) {
        setRoots(localRoots);
      }
    });
    return unsubscribe;
  }, [selectedLetter, searchQuery]);

  // Fetch single root details and all variations
  const fetchRootDetail = useCallback(async (code: string) => {
    setLoadingDetail(true);
    setDetailError(null);
    try {
      const res = await fetch(`/api/root/${encodeURIComponent(code)}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      const data: RootDetail = await res.json();
      setRootDetail(data);
    } catch (err: any) {
      console.error('Failed to fetch root details for', code, err);
      setDetailError(err.message || 'Failed to fetch root details');
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  // Fetch selected root details whenever selectedRootCode changes
  useEffect(() => {
    if (selectedRootCode) {
      fetchRootDetail(selectedRootCode);
    }
  }, [selectedRootCode, fetchRootDetail]);

  const handleSelectRoot = (code: string) => {
    setSelectedRootCode(code);
    setActiveTab('roots');
    setMobileView('detail');
  };

  const handleSelectLetter = (letter: string) => {
    setSelectedLetter(letter);
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-950">
      
      {/* Top Navigation */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalRootsCount={1664}
        filteredRootsCount={roots.length}
        onSelectRoot={handleSelectRoot}
        isLoading={loadingRoots}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'frequency' ? (
        /* Fluent Arabic Quran Frequency List (5,155 words by POS & Semantic Domains) */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <FluentFrequencyBrowser onSelectRoot={handleSelectRoot} />
        </main>
      ) : activeTab === 'semantic' ? (
        /* Semantic Words Explorer View */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SemanticBrowser onSelectRoot={handleSelectRoot} />
        </main>
      ) : activeTab === 'pos' || activeTab === 'grammar' ? (
        /* Parts of Speech (أقسام الكلام) & Words Table Explorer */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <PartsOfSpeechBrowser onSelectRoot={handleSelectRoot} />
        </main>
      ) : (
        <>
          {/* 28 Arabic Letters Alphabetical Index */}
          <LetterSelector
            letters={letters}
            selectedLetter={selectedLetter}
            onSelectLetter={handleSelectLetter}
            totalCount={1664}
          />

          {/* Mobile Switcher (List vs Detail) */}
          <div className="md:hidden flex border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 py-2 gap-2 sticky top-[108px] z-20">
            <button
              onClick={() => setMobileView('list')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold text-center transition-colors ${
                mobileView === 'list'
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              Roots Index ({roots.length})
            </button>
            <button
              onClick={() => setMobileView('detail')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold text-center transition-colors ${
                mobileView === 'detail'
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              {rootDetail ? `${rootDetail.arabicRoot} Details` : 'Root Details'}
            </button>
          </div>

          {/* Main Content Workspace */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              
              {/* Left Column: Roots Registry Sidebar */}
              <div
                className={`w-full md:w-72 lg:w-80 shrink-0 ${
                  mobileView === 'detail' ? 'hidden md:block' : 'block'
                }`}
              >
                <RootListSidebar
                  roots={roots}
                  selectedRootCode={selectedRootCode}
                  onSelectRoot={handleSelectRoot}
                  isLoading={loadingRoots}
                />
              </div>

              {/* Right Column: Root Concordance & Word Variations */}
              <div
                className={`flex-1 w-full min-w-0 ${
                  mobileView === 'list' ? 'hidden md:block' : 'block'
                }`}
              >
                {loadingDetail ? (
                  <div className="bg-white dark:bg-stone-900 rounded-2xl p-12 border border-stone-200 dark:border-stone-800 text-center shadow-xs flex flex-col items-center justify-center min-h-[420px]">
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-500/30 flex items-center justify-center mb-4">
                      <RefreshCw className="w-7 h-7 text-amber-500 animate-spin" />
                    </div>
                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                      Retrieving Quranic Root & Word Variations
                    </h3>
                    <p className="text-xs text-stone-500 max-w-md mt-1">
                      Parsing morphological concordance and occurrences from corpus.quran.com for root{' '}
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                        {selectedRootCode}
                      </span>
                      ...
                    </p>
                  </div>
                ) : detailError ? (
                  <div className="bg-white dark:bg-stone-900 rounded-2xl p-8 border border-red-200 dark:border-red-900/60 shadow-xs">
                    <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-3">
                      <AlertCircle className="w-6 h-6 shrink-0" />
                      <h3 className="text-base font-bold">Failed to load root details</h3>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300 mb-4">
                      {detailError}
                    </p>
                    <button
                      onClick={() => fetchRootDetail(selectedRootCode)}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-colors inline-flex items-center gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry Fetching</span>
                    </button>
                  </div>
                ) : rootDetail ? (
                  <RootDetailView
                    rootDetail={rootDetail}
                    onBack={() => setMobileView('list')}
                    onSelectRoot={handleSelectRoot}
                  />
                ) : (
                  <div className="bg-white dark:bg-stone-900 rounded-2xl p-12 border border-stone-200 dark:border-stone-800 text-center shadow-xs">
                    <BookOpen className="w-12 h-12 text-stone-400 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
                      Select a Quranic Root
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      Choose any root from the sidebar or search by Arabic letters, English meaning, or code
                    </p>
                  </div>
                )}
              </div>

            </div>
          </main>
        </>
      )}

      {/* Footer */}
      <footer className="bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 py-4 mt-12 text-xs text-stone-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            Quranic Arabic Corpus Concordance & Dictionary &bull; 1,664 Roots &bull; Word-by-Word Variations
          </p>
          <p className="font-arabic text-stone-400">
            سُبْحَانَكَ لَا عِلْمَ لَنَا إِلَّا مَا عَلَّمْتَنَا
          </p>
        </div>
      </footer>

    </div>
  );
}
