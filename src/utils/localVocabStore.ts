import type { FluentQuranWord, FluentFrequencyStats, RootSummary, RootDerivation, PartOfSpeechSummary } from '../types.ts';
import { GRAMMAR_TYPES, CURATED_GRAMMAR_DERIVATIONS } from '../data/grammarTypes.ts';
import { PARTS_OF_SPEECH, normalizePartOfSpeechId, getWordsForPartOfSpeech } from '../data/partsOfSpeech.ts';
import { QURAN_PARTICLES } from '../data/quranParticles.ts';
import { SEMANTIC_DOMAINS } from '../data/semanticDomains.ts';
import allRootsData from '../data/allRoots.json';

// IndexedDB configuration
const DB_NAME = 'QuranLexiconLocalDB_v1';
const STORE_NAME = 'vocab_cache';
const DB_VERSION = 1;

export interface VocabCacheMeta {
  timestamp: number;
  version: string;
  wordsCount: number;
  rootsCount: number;
  storageEstimateMb?: string;
}

export interface FluentQueryOptions {
  q?: string;
  search?: string;
  primaryDivision?: string;
  pos?: string;
  posCategory?: string;
  semanticDomain?: string;
  semanticCluster?: string;
  minRank?: number;
  maxRank?: number;
  minFreq?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface FluentQueryResult {
  words: FluentQuranWord[];
  totalCount: number;
  totalOccurrences: number;
  totalPages: number;
  page: number;
  limit: number;
}

// In-memory runtime cache
class LocalVocabStore {
  private fluentWords: FluentQuranWord[] = [];
  private fluentStats: FluentFrequencyStats | null = null;
  private roots: RootSummary[] = allRootsData as RootSummary[];
  private isLoadedInMemory = false;
  private isStoredInIndexedDB = false;
  private isSyncing = false;
  private syncProgress = 0;
  private listeners: Set<() => void> = new Set();
  private dbPromise: Promise<IDBDatabase> | null = null;

  constructor() {
    // Automatically attempt to load from IndexedDB on startup
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  // Subscribe to changes
  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify() {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error('Error in localVocabStore listener:', err);
      }
    });
  }

  // Open IndexedDB
  private getDb(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        return reject(new Error('IndexedDB not supported in this environment'));
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  // Get item from IndexedDB
  private async idbGet<T>(key: string): Promise<T | null> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn(`IDB read failed for key ${key}:`, err);
      return null;
    }
  }

  // Set item in IndexedDB
  private async idbSet(key: string, val: any): Promise<void> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(val, key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn(`IDB write failed for key ${key}:`, err);
    }
  }

  // Initialize and check local storage
  public async init(): Promise<boolean> {
    try {
      // 1. Check if we have cached vocabulary in IndexedDB
      const cachedWords = await this.idbGet<FluentQuranWord[]>('fluent_words');
      const cachedStats = await this.idbGet<FluentFrequencyStats>('fluent_stats');

      if (cachedWords && Array.isArray(cachedWords) && cachedWords.length >= 5000) {
        this.fluentWords = cachedWords;
        this.fluentStats = cachedStats;
        this.isLoadedInMemory = true;
        this.isStoredInIndexedDB = true;
        this.notify();
        return true;
      }

      // If not cached yet, download and store locally in background
      this.syncFromBackend();
      return false;
    } catch (err) {
      console.error('Failed to initialize local vocab store from IndexedDB:', err);
      this.syncFromBackend();
      return false;
    }
  }

  // Download vocab bundle from backend and store in IndexedDB
  public async syncFromBackend(forceRefresh = false): Promise<boolean> {
    if (this.isSyncing) return false;
    this.isSyncing = true;
    this.syncProgress = 10;
    this.notify();

    try {
      // Fetch the full bundle or words endpoint
      this.syncProgress = 30;
      this.notify();

      const [wordsRes, statsRes] = await Promise.all([
        fetch('/api/vocab/download').catch(() => fetch('/api/fluent-words?limit=-1')),
        fetch('/api/fluent-words/stats')
      ]);

      this.syncProgress = 60;
      this.notify();

      if (!wordsRes.ok) {
        throw new Error(`Failed to fetch vocabulary: HTTP ${wordsRes.status}`);
      }

      const wordsData = await wordsRes.json();
      const rawWords: FluentQuranWord[] = wordsData.words || wordsData.fluentWords || (Array.isArray(wordsData) ? wordsData : []);

      let statsData: FluentFrequencyStats | null = null;
      if (statsRes.ok) {
        statsData = await statsRes.json();
      }

      if (rawWords.length > 0) {
        this.fluentWords = rawWords;
        this.fluentStats = statsData;
        this.isLoadedInMemory = true;

        this.syncProgress = 85;
        this.notify();

        // Save persistently into browser IndexedDB
        await this.idbSet('fluent_words', rawWords);
        if (statsData) {
          await this.idbSet('fluent_stats', statsData);
        }
        await this.idbSet('cache_meta', {
          timestamp: Date.now(),
          version: '1.0.0',
          wordsCount: rawWords.length,
          rootsCount: this.roots.length
        });

        this.isStoredInIndexedDB = true;
        this.syncProgress = 100;
        this.isSyncing = false;
        this.notify();
        return true;
      }
    } catch (err) {
      console.error('Error syncing vocabulary to local store:', err);
    } finally {
      this.isSyncing = false;
      this.notify();
    }

    return false;
  }

  // Query fluent words completely locally in browser memory (0ms latency!)
  public queryFluentWords(options: FluentQueryOptions): FluentQueryResult {
    let results = [...this.fluentWords];

    // 1. Text Search across Arabic, cleanArabic, transliteration, meaning
    const queryStr = ((options.q || options.search || '') as string).trim().toLowerCase();
    if (queryStr) {
      results = results.filter((w) =>
        w.word.includes(queryStr) ||
        (w.cleanArabic && w.cleanArabic.includes(queryStr)) ||
        w.transliteration.toLowerCase().includes(queryStr) ||
        w.meaning.toLowerCase().includes(queryStr) ||
        w.pos.toLowerCase().includes(queryStr) ||
        (w.posArabic && w.posArabic.includes(queryStr))
      );
    }

    // 2. Primary Division (noun, verb, particle)
    if (options.primaryDivision && options.primaryDivision !== 'all') {
      results = results.filter((w) => w.primaryDivision === options.primaryDivision);
    }

    // 3. Specific Part of Speech
    if (options.pos && options.pos !== 'all') {
      const posLower = options.pos.toLowerCase();
      results = results.filter((w) => w.pos.toLowerCase() === posLower || w.posArabic === options.pos);
    }

    // 3b. Specific POS Category
    if (options.posCategory && options.posCategory !== 'all') {
      const catLower = options.posCategory.toLowerCase().replace('-', '_');
      results = results.filter((w) => w.posCategory === catLower);
    }

    // 4. Semantic Domain
    if (options.semanticDomain && options.semanticDomain !== 'all') {
      results = results.filter((w) => w.semanticDomain === options.semanticDomain);
    }

    // 4b. Semantic Cluster
    if (options.semanticCluster && options.semanticCluster !== 'all') {
      results = results.filter((w) => w.semanticCluster === options.semanticCluster);
    }

    // 5. Rank filters
    if (options.maxRank && options.maxRank > 0) {
      results = results.filter((w) => w.rank <= options.maxRank!);
    }
    if (options.minRank && options.minRank > 0) {
      results = results.filter((w) => w.rank >= options.minRank!);
    }

    // 6. Minimum frequency
    if (options.minFreq && options.minFreq > 0) {
      results = results.filter((w) => w.frequency >= options.minFreq!);
    }

    // 7. Sorting
    const sortField = options.sort || 'rank';
    const direction = options.direction === 'desc' ? -1 : 1;

    results.sort((a, b) => {
      if (sortField === 'frequency') {
        return (a.frequency - b.frequency) * direction;
      }
      if (sortField === 'alphabetical') {
        const cleanA = a.cleanArabic || a.word;
        const cleanB = b.cleanArabic || b.word;
        return cleanA.localeCompare(cleanB, 'ar') * direction;
      }
      if (sortField === 'pos') {
        return a.pos.localeCompare(b.pos) * direction;
      }
      // default: rank
      return (a.rank - b.rank) * direction;
    });

    const totalCount = results.length;
    const totalOccurrences = results.reduce((acc, w) => acc + (w.frequency || 0), 0);

    // 8. Pagination
    const limit = options.limit !== undefined ? options.limit : 50;
    const page = options.page && options.page > 0 ? options.page : 1;

    let paginatedWords = results;
    let totalPages = 1;

    if (limit > 0) {
      totalPages = Math.max(1, Math.ceil(totalCount / limit));
      const startIdx = (page - 1) * limit;
      paginatedWords = results.slice(startIdx, startIdx + limit);
    }

    return {
      words: paginatedWords,
      totalCount,
      totalOccurrences,
      totalPages,
      page,
      limit
    };
  }

  // Get aggregated stats locally
  public getLocalStats(): FluentFrequencyStats {
    if (this.fluentStats) {
      return this.fluentStats;
    }

    const nounCount = this.fluentWords.filter((w) => w.primaryDivision === 'noun').length;
    const nounOccurrences = this.fluentWords.filter((w) => w.primaryDivision === 'noun').reduce((acc, w) => acc + w.frequency, 0);
    const verbCount = this.fluentWords.filter((w) => w.primaryDivision === 'verb').length;
    const verbOccurrences = this.fluentWords.filter((w) => w.primaryDivision === 'verb').reduce((acc, w) => acc + w.frequency, 0);
    const particleCount = this.fluentWords.filter((w) => w.primaryDivision === 'particle').length;
    const particleOccurrences = this.fluentWords.filter((w) => w.primaryDivision === 'particle').reduce((acc, w) => acc + w.frequency, 0);
    const totalOccurrences = this.fluentWords.reduce((acc, w) => acc + w.frequency, 0);

    return {
      totalWords: this.fluentWords.length || 5155,
      totalOccurrences,
      primaryDivisions: [
        { id: 'noun', name: 'Nouns (Ism)', nameArabic: 'الاسم', count: nounCount || 3531, occurrences: nounOccurrences },
        { id: 'verb', name: 'Verbs (Fi‘l)', nameArabic: 'الفعل', count: verbCount || 1541, occurrences: verbOccurrences },
        { id: 'particle', name: 'Particles (Harf)', nameArabic: 'الحرف', count: particleCount || 83, occurrences: particleOccurrences }
      ],
      posBreakdown: [],
      semanticBreakdown: [],
      milestones: [
        { label: 'Top 500', count: 500, coveragePercent: 78.4, desc: 'Covers ~78% of Quranic text' },
        { label: 'Top 1000', count: 1000, coveragePercent: 86.8, desc: 'Covers ~87% of Quranic text' },
        { label: 'Top 2000', count: 2000, coveragePercent: 93.5, desc: 'Covers ~94% of Quranic text' },
        { label: 'All 5,155', count: this.fluentWords.length || 5155, coveragePercent: 100.0, desc: '100% complete vocabulary' }
      ],
      source: 'Fluent Arabic Quran Frequency List & Corpus Quran Morphology',
      sourceSpreadsheet: 'Quran-All-Words.xlsx'
    };
  }

  // Get all roots filtered locally
  public getRoots(letter?: string, query?: string): RootSummary[] {
    let filtered = [...this.roots];

    if (letter && letter !== 'all') {
      filtered = filtered.filter((r) => r.letter === letter);
    }

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      filtered = filtered.filter((r) =>
        r.code.toLowerCase().includes(q) ||
        r.arabic.includes(q) ||
        (r.cleanArabic && r.cleanArabic.includes(q)) ||
        (r.translitName && r.translitName.toLowerCase().includes(q)) ||
        (r.primaryGloss && r.primaryGloss.toLowerCase().includes(q))
      );
    }

    return filtered;
  }

  // Get parts of speech derivations locally
  public getLocalPosWords(posId: string, query?: string, root?: string): {
    partOfSpeech: PartOfSpeechSummary | null;
    derivations: RootDerivation[];
    totalCount: number;
    totalFrequency: number;
  } {
    const norm = normalizePartOfSpeechId(posId);
    const category = PARTS_OF_SPEECH.find((p) => p.id === norm || normalizePartOfSpeechId(p.name) === norm);
    let words = getWordsForPartOfSpeech(norm);

    if (root && root.trim() && root !== 'all') {
      const rootQuery = root.trim().toLowerCase();
      words = words.filter((w) => (w.root && w.root.toLowerCase() === rootQuery) || (w.rootArabic && w.rootArabic.includes(rootQuery)));
    }

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      words = words.filter((w) =>
        w.word.includes(q) ||
        w.transliteration.toLowerCase().includes(q) ||
        w.meaning.toLowerCase().includes(q) ||
        (w.root && w.root.toLowerCase().includes(q)) ||
        (w.rootArabic && w.rootArabic.includes(q))
      );
    }

    words.sort((a, b) => b.frequency - a.frequency);

    return {
      partOfSpeech: category || null,
      derivations: words,
      totalCount: words.length,
      totalFrequency: words.reduce((acc, w) => acc + w.frequency, 0)
    };
  }

  // Trigger browser download of complete vocabulary JSON
  public exportCompleteVocabJson(): void {
    const dataToExport = {
      title: 'Complete Quranic Arabic Vocabulary & Frequency Lexicon',
      source: 'Fluent Arabic & Corpus Quran',
      exportedAt: new Date().toISOString(),
      totalWords: this.fluentWords.length,
      totalRoots: this.roots.length,
      totalParticles: QURAN_PARTICLES.length,
      stats: this.getLocalStats(),
      words: this.fluentWords,
      roots: this.roots,
      particles: QURAN_PARTICLES
    };

    const jsonStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `quran-vocabulary-complete-${this.fluentWords.length}-words.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Trigger browser download of vocabulary CSV with UTF-8 BOM
  public exportVocabCsv(): void {
    const headers = [
      'Rank',
      'Word (Arabic)',
      'Clean Arabic',
      'Transliteration',
      'English Meaning',
      'Part of Speech',
      'Primary Division',
      'Frequency',
      'Percentage',
      'Root',
      'Semantic Domain',
      'Sample Verse Location',
      'Sample Verse Ayah Text',
      'Sample Verse Translation'
    ];

    const rows = [headers.join(',')];

    for (const w of this.fluentWords) {
      rows.push([
        w.rank,
        `"${(w.word || '').replace(/"/g, '""')}"`,
        `"${(w.cleanArabic || '').replace(/"/g, '""')}"`,
        `"${(w.transliteration || '').replace(/"/g, '""')}"`,
        `"${(w.meaning || '').replace(/"/g, '""')}"`,
        `"${(w.pos || '').replace(/"/g, '""')}"`,
        `"${(w.primaryDivision || '').replace(/"/g, '""')}"`,
        w.frequency || 0,
        `${w.percentage || 0}%`,
        `"${(w.root || '').replace(/"/g, '""')}"`,
        `"${(w.semanticDomainName || '').replace(/"/g, '""')}"`,
        `"${(w.sampleVerse?.location || '').replace(/"/g, '""')}"`,
        `"${(w.sampleVerse?.text || '').replace(/"/g, '""')}"`,
        `"${(w.sampleVerse?.translation || '').replace(/"/g, '""')}"`
      ].join(','));
    }

    const blob = new Blob(['\uFEFF' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `quran-vocabulary-5155-words.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Clear local cache
  public async clearLocalCache(): Promise<void> {
    try {
      const db = await this.getDb();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).clear();
      this.isStoredInIndexedDB = false;
      this.notify();
    } catch (err) {
      console.error('Error clearing local cache:', err);
    }
  }

  // Status getters
  public getStatus() {
    return {
      isLoadedInMemory: this.isLoadedInMemory,
      isStoredInIndexedDB: this.isStoredInIndexedDB,
      isSyncing: this.isSyncing,
      syncProgress: this.syncProgress,
      wordsCount: this.fluentWords.length,
      rootsCount: this.roots.length,
      particlesCount: QURAN_PARTICLES.length,
      isReady: this.isLoadedInMemory && this.fluentWords.length > 0
    };
  }
}

// Export singleton instance
export const localVocabStore = new LocalVocabStore();
