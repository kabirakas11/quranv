import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { FluentQuranWord, FluentFrequencyStats } from '../types.ts';
import {
  Search,
  Filter,
  ArrowUpDown,
  BookOpen,
  Sparkles,
  Layers,
  Volume2,
  VolumeX,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Flame,
  Heart,
  Compass,
  Sun,
  Activity,
  Users,
  Scale,
  Brain,
  Landmark,
  Clock,
  RefreshCw,
  Hash,
  ListFilter,
  SlidersHorizontal,
  Table,
  LayoutGrid,
  CheckCircle2,
  ArrowRight,
  FileSpreadsheet,
  Crown,
  Zap,
  X,
  Tag,
  Maximize2,
  Shield,
  ShieldAlert,
  Coins,
  Footprints,
  Trees,
  Mountain,
  Smile,
  HardDrive
} from 'lucide-react';
import { localVocabStore } from '../utils/localVocabStore.ts';
import { LocalVocabManagerModal } from './LocalVocabManagerModal.tsx';

interface FluentFrequencyBrowserProps {
  onSelectRoot?: (rootCode: string) => void;
  initialMode?: 'pos' | 'semantic' | 'table';
}

interface PosGroup {
  pos: string;
  posArabic: string;
  posTitle: string;
  primaryDivision: 'noun' | 'verb' | 'particle';
  totalWords: number;
  totalOccurrences: number;
  topWords: FluentQuranWord[];
}

interface SemanticCategoryGroup {
  name: string;
  nameArabic: string;
  count: number;
  occurrences: number;
  words: FluentQuranWord[];
}

interface SemanticClusterGroup {
  clusterId: string;
  clusterName: string;
  clusterArabic: string;
  count: number;
  occurrences: number;
  words: FluentQuranWord[];
}

interface SemanticGroup {
  domainId: string;
  domainName: string;
  domainArabic: string;
  totalWords: number;
  totalOccurrences: number;
  clusters?: Record<string, SemanticClusterGroup>;
  categories?: {
    proper_noun: SemanticCategoryGroup;
    noun: SemanticCategoryGroup;
    adjective: SemanticCategoryGroup;
    verb: SemanticCategoryGroup;
    particle?: SemanticCategoryGroup;
  };
  topWords: FluentQuranWord[];
}

const DOMAIN_ICONS: Record<string, React.ReactNode> = {
  'divine-realm': <Sparkles className="w-5 h-5 text-amber-500" />,
  'prophethood-revelation': <BookOpen className="w-5 h-5 text-emerald-500" />,
  'afterlife-eschatology': <Flame className="w-5 h-5 text-rose-500" />,
  'worship-rituals': <Compass className="w-5 h-5 text-sky-500" />,
  'faith-virtues-ethics': <Heart className="w-5 h-5 text-teal-500" />,
  'faith-ethics': <Heart className="w-5 h-5 text-teal-500" />,
  'sin-corruption-hypocrisy': <ShieldAlert className="w-5 h-5 text-red-500" />,
  'intellect-knowledge-speech': <Brain className="w-5 h-5 text-blue-500" />,
  'intellect-communication': <Brain className="w-5 h-5 text-blue-500" />,
  'humanity-creation-stages': <Activity className="w-5 h-5 text-purple-500" />,
  'humanity-body': <Activity className="w-5 h-5 text-purple-500" />,
  'emotions-trials-inner-life': <Smile className="w-5 h-5 text-amber-600" />,
  'family-kinship-society': <Users className="w-5 h-5 text-indigo-500" />,
  'family-society': <Users className="w-5 h-5 text-indigo-500" />,
  'law-governance-justice': <Scale className="w-5 h-5 text-emerald-600" />,
  'law-governance-commerce': <Scale className="w-5 h-5 text-emerald-600" />,
  'commerce-wealth-property': <Coins className="w-5 h-5 text-amber-500" />,
  'struggle-defense-conflict': <Shield className="w-5 h-5 text-rose-600" />,
  'cosmology-astronomy-earth': <Sun className="w-5 h-5 text-amber-600" />,
  'cosmology-nature': <Sun className="w-5 h-5 text-amber-600" />,
  'nature-fauna-flora': <Trees className="w-5 h-5 text-emerald-600" />,
  'geography-places-dwellings': <Mountain className="w-5 h-5 text-stone-500" />,
  'history-civilizations-peoples': <Landmark className="w-5 h-5 text-violet-600" />,
  'history-civilizations': <Landmark className="w-5 h-5 text-violet-600" />,
  'movement-travel-physical': <Footprints className="w-5 h-5 text-cyan-600" />,
  'time-periods-cosmic-cycles': <Clock className="w-5 h-5 text-orange-500" />,
  'time-space-motion': <Clock className="w-5 h-5 text-orange-500" />
};

export const FluentFrequencyBrowser: React.FC<FluentFrequencyBrowserProps> = ({
  onSelectRoot,
  initialMode = 'pos'
}) => {
  const [viewMode, setViewMode] = useState<'pos' | 'semantic' | 'table'>(initialMode);
  const [stats, setStats] = useState<FluentFrequencyStats | null>(null);
  
  // Pos and Semantic groups from API
  const [posGroups, setPosGroups] = useState<PosGroup[]>([]);
  const [semanticGroups, setSemanticGroups] = useState<SemanticGroup[]>([]);
  const [loadingGroups, setLoadingGroups] = useState<boolean>(true);

  // Table list state
  const [words, setWords] = useState<FluentQuranWord[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalOccurrences, setTotalOccurrences] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loadingWords, setLoadingWords] = useState<boolean>(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDivision, setSelectedDivision] = useState<'all' | 'noun' | 'verb' | 'particle'>('all');
  const [selectedPos, setSelectedPos] = useState<string>('all');
  const [selectedPosCategory, setSelectedPosCategory] = useState<'all' | 'proper_noun' | 'noun' | 'adjective' | 'verb'>('all');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedCluster, setSelectedCluster] = useState<string>('all');
  const [selectedMilestone, setSelectedMilestone] = useState<number | 'all'>('all');
  const [sortField, setSortField] = useState<'rank' | 'frequency' | 'alphabetical' | 'pos'>('rank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Semantic card active tabs & modal state
  const [cardActiveTab, setCardActiveTab] = useState<Record<string, 'all' | 'proper_noun' | 'noun' | 'adjective' | 'verb' | 'clusters'>>({});
  const [selectedDomainDetail, setSelectedDomainDetail] = useState<SemanticGroup | null>(null);
  const [modalGroupMode, setModalGroupMode] = useState<'clusters' | 'pos'>('clusters');
  const [modalActiveCluster, setModalActiveCluster] = useState<string>('all');
  const [modalActivePos, setModalActivePos] = useState<'all' | 'proper_noun' | 'noun' | 'adjective' | 'verb'>('all');
  const [modalSearch, setModalSearch] = useState<string>('');

  // Active playing audio word
  const [playingWord, setPlayingWord] = useState<string | null>(null);
  const [isVocabModalOpen, setIsVocabModalOpen] = useState(false);

  // Load stats and subscribe to localVocabStore
  useEffect(() => {
    // 1. Instantly read local stats from memory
    const localStats = localVocabStore.getLocalStats();
    if (localStats) {
      setStats(localStats);
    }

    // 2. Fetch server stats/groups in background or as fallback
    fetch('/api/fluent-words/stats')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data && typeof data === 'object') {
          setStats(data);
        }
      })
      .catch(() => {
        // Try static JSON fallback (for Vercel or CDN static hosts)
        fetch('/data/fluentArabicStats.json')
          .then((r) => r.ok ? r.json() : null)
          .then((staticStats) => {
            if (staticStats) setStats(staticStats);
            else {
              const fallback = localVocabStore.getLocalStats();
              if (fallback) setStats(fallback);
            }
          })
          .catch(() => {
            const fallback = localVocabStore.getLocalStats();
            if (fallback) setStats(fallback);
          });
      });

    Promise.all([
      fetch('/api/fluent-words/by-pos').then((r) => r.ok ? r.json() : { groups: [] }).catch(() => ({ groups: [] })),
      fetch('/api/fluent-words/by-semantic').then((r) => r.ok ? r.json() : { domains: [] }).catch(() => ({ domains: [] }))
    ])
      .then(([posData, semData]) => {
        const pGroups = posData?.groups?.length ? posData.groups : localVocabStore.getLocalPosGroups();
        const sGroups = semData?.domains?.length ? semData.domains : localVocabStore.getLocalSemanticGroups();
        if (pGroups.length) setPosGroups(pGroups);
        if (sGroups.length) setSemanticGroups(sGroups);
      })
      .catch(() => {
        setPosGroups(localVocabStore.getLocalPosGroups());
        setSemanticGroups(localVocabStore.getLocalSemanticGroups());
      })
      .finally(() => setLoadingGroups(false));

    // 3. Subscribe to local store updates
    const unsubscribe = localVocabStore.subscribe(() => {
      fetchWords();
    });

    return unsubscribe;
  }, []);

  // Fetch words locally or via API with zero latency
  const fetchWords = useCallback(async () => {
    const storeStatus = localVocabStore.getStatus();

    // If local vocab is loaded in memory, query in <1ms without any API call!
    if (storeStatus.isReady) {
      const result = localVocabStore.queryFluentWords({
        q: searchQuery.trim(),
        primaryDivision: selectedDivision,
        pos: selectedPos,
        posCategory: selectedPosCategory,
        semanticDomain: selectedDomain,
        semanticCluster: selectedCluster,
        maxRank: selectedMilestone !== 'all' ? Number(selectedMilestone) : undefined,
        sort: sortField,
        direction: sortDirection as 'asc' | 'desc',
        page,
        limit: 50
      });

      setWords(result.words);
      setTotalCount(result.totalCount);
      setTotalOccurrences(result.totalOccurrences);
      setTotalPages(result.totalPages);
      setLoadingWords(false);
      return;
    }

    // Fallback while local cache initializes
    setLoadingWords(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('q', searchQuery.trim());
      if (selectedDivision !== 'all') params.append('primaryDivision', selectedDivision);
      if (selectedPos !== 'all') params.append('pos', selectedPos);
      if (selectedPosCategory !== 'all') params.append('posCategory', selectedPosCategory);
      if (selectedDomain !== 'all') params.append('semanticDomain', selectedDomain);
      if (selectedCluster !== 'all') params.append('semanticCluster', selectedCluster);
      if (selectedMilestone !== 'all') params.append('maxRank', String(selectedMilestone));
      params.append('sort', sortField);
      params.append('direction', sortDirection);
      params.append('page', String(page));
      params.append('limit', '50');

      const res = await fetch(`/api/fluent-words?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setWords(data.words || []);
      setTotalCount(data.totalCount || 0);
      setTotalOccurrences(data.totalOccurrences || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.warn('Error fetching words list from server, trying local cache:', err);
      const localResult = localVocabStore.queryFluentWords({
        q: searchQuery.trim(),
        primaryDivision: selectedDivision,
        pos: selectedPos,
        posCategory: selectedPosCategory,
        semanticDomain: selectedDomain,
        semanticCluster: selectedCluster,
        maxRank: selectedMilestone !== 'all' ? Number(selectedMilestone) : undefined,
        sort: sortField,
        direction: sortDirection as 'asc' | 'desc',
        page,
        limit: 50
      });
      if (localResult.words.length > 0) {
        setWords(localResult.words);
        setTotalCount(localResult.totalCount);
        setTotalOccurrences(localResult.totalOccurrences);
        setTotalPages(localResult.totalPages);
      }
    } finally {
      setLoadingWords(false);
    }
  }, [searchQuery, selectedDivision, selectedPos, selectedPosCategory, selectedDomain, selectedCluster, selectedMilestone, sortField, sortDirection, page]);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  // Reset page to 1 when filters change
  const handleFilterChange = (setter: React.Dispatch<any>, val: any) => {
    setter(val);
    setPage(1);
  };

  // Word audio playback via speech synthesis
  const handlePlayPronunciation = (arabicText: string) => {
    if (playingWord === arabicText) {
      window.speechSynthesis.cancel();
      setPlayingWord(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(arabicText);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85;
    utterance.onend = () => setPlayingWord(null);
    utterance.onerror = () => setPlayingWord(null);
    setPlayingWord(arabicText);
    window.speechSynthesis.speak(utterance);
  };

  // CSV Export - Instant local generation
  const handleExportCsv = async () => {
    try {
      const storeStatus = localVocabStore.getStatus();
      if (storeStatus.isReady) {
        // If all filters are default, export the entire database directly!
        if (
          !searchQuery.trim() &&
          selectedDivision === 'all' &&
          selectedPos === 'all' &&
          selectedDomain === 'all' &&
          selectedMilestone === 'all'
        ) {
          localVocabStore.exportVocabCsv();
          return;
        }

        // Otherwise export filtered results locally in 0ms!
        const result = localVocabStore.queryFluentWords({
          q: searchQuery.trim(),
          primaryDivision: selectedDivision,
          pos: selectedPos,
          semanticDomain: selectedDomain,
          maxRank: selectedMilestone !== 'all' ? Number(selectedMilestone) : undefined,
          limit: -1
        });

        const exportList = result.words;
        const headers = ['Rank', 'Word (Arabic)', 'Transliteration', 'Meaning', 'Part of Speech', 'POS Arabic', 'Semantic Domain', 'Frequency', 'Cumulative %'];
        const csvRows = [headers.join(',')];

        for (const w of exportList) {
          csvRows.push([
            w.rank,
            `"${w.word}"`,
            `"${w.transliteration.replace(/"/g, '""')}"`,
            `"${w.meaning.replace(/"/g, '""')}"`,
            `"${w.pos}"`,
            `"${w.posArabic}"`,
            `"${w.semanticDomainName || ''}"`,
            w.frequency,
            `${w.percentage}%`
          ].join(','));
        }

        const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `quran_frequency_words_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('q', searchQuery.trim());
      if (selectedDivision !== 'all') params.append('primaryDivision', selectedDivision);
      if (selectedPos !== 'all') params.append('pos', selectedPos);
      if (selectedDomain !== 'all') params.append('semanticDomain', selectedDomain);
      if (selectedMilestone !== 'all') params.append('maxRank', String(selectedMilestone));
      params.append('limit', '-1'); // all matches

      const res = await fetch(`/api/fluent-words?${params.toString()}`);
      const data = await res.json();
      const exportList: FluentQuranWord[] = data.words || [];

      const headers = ['Rank', 'Word (Arabic)', 'Transliteration', 'Meaning', 'Part of Speech', 'POS Arabic', 'Semantic Domain', 'Frequency', 'Cumulative %'];
      const csvRows = [headers.join(',')];

      for (const w of exportList) {
        csvRows.push([
          w.rank,
          `"${w.word}"`,
          `"${w.transliteration.replace(/"/g, '""')}"`,
          `"${w.meaning.replace(/"/g, '""')}"`,
          `"${w.pos}"`,
          `"${w.posArabic}"`,
          `"${w.semanticDomainName}"`,
          w.frequency,
          `${w.percentage}%`
        ].join(','));
      }

      const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `quran_frequency_words_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting CSV:', err);
    }
  };

  // Filtered pos groups
  const filteredPosGroups = useMemo(() => {
    return posGroups.filter((g) => {
      if (selectedDivision !== 'all' && g.primaryDivision !== selectedDivision) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = g.pos.toLowerCase().includes(q) || g.posArabic.includes(q) || g.posTitle.toLowerCase().includes(q);
        const matchesWords = g.topWords.some((w) => w.word.includes(q) || w.meaning.toLowerCase().includes(q) || w.transliteration.toLowerCase().includes(q));
        if (!matchesName && !matchesWords) return false;
      }
      return true;
    });
  }, [posGroups, selectedDivision, searchQuery]);

  // Filtered semantic groups
  const filteredSemanticGroups = useMemo(() => {
    return semanticGroups.filter((g) => {
      // Filter by selected POS Category if active
      if (selectedPosCategory !== 'all') {
        const catGroup = g.categories?.[selectedPosCategory];
        if (!catGroup || catGroup.count === 0) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = g.domainName.toLowerCase().includes(q) || g.domainArabic.includes(q);
        const matchesWords = g.topWords.some((w) => w.word.includes(q) || w.meaning.toLowerCase().includes(q) || w.transliteration.toLowerCase().includes(q));
        const matchesCategoryWords = g.categories && Object.values(g.categories).some((cat: SemanticCategoryGroup) => 
          cat.words.some((w) => w.word.includes(q) || w.meaning.toLowerCase().includes(q) || w.transliteration.toLowerCase().includes(q))
        );
        const matchesClusters = g.clusters && Object.values(g.clusters).some((cl: SemanticClusterGroup) =>
          cl.clusterName.toLowerCase().includes(q) ||
          cl.clusterArabic.includes(q) ||
          cl.words.some((w) => w.word.includes(q) || w.meaning.toLowerCase().includes(q) || w.transliteration.toLowerCase().includes(q))
        );
        if (!matchesName && !matchesWords && !matchesCategoryWords && !matchesClusters) return false;
      }
      return true;
    });
  }, [semanticGroups, selectedPosCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header Banner with Source Attribution & Stats */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 text-stone-100 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 translate-x-12 -translate-y-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -translate-x-12 translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Comprehensive Quran Vocabulary
              </span>
              <a
                href="https://fluentarabic.net/quran-frequency-list/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-300 border border-stone-700 text-xs font-medium inline-flex items-center gap-1.5 transition-all"
              >
                <span>Source: FluentArabic.net</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span>Quran Frequency List</span>
              <span className="text-base font-arabic font-normal text-amber-300/90">
                قَائِمَةُ كَلِمَاتِ القُرْآنِ الأَكْثَرِ تَكْرَارًا
              </span>
            </h1>

            <p className="text-sm text-stone-300 leading-relaxed">
              All <strong className="text-amber-300">5,155 unique words</strong> occurring <strong className="text-amber-300">74,122 times</strong> across the Holy Quran. 
              Organized by classical <strong className="text-stone-100">Parts of Speech (أقسام الكلام)</strong> and grouped into <strong className="text-stone-100">Semantic Thematic Domains (المجالات الدلالية)</strong>.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="bg-stone-800/80 backdrop-blur border border-stone-700/80 rounded-2xl p-3.5 text-center">
              <span className="text-xs text-stone-400 block font-medium">Unique Words</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">5,155</span>
              <span className="text-[11px] text-stone-400 block font-arabic">مفردة قرآنية</span>
            </div>
            <div className="bg-stone-800/80 backdrop-blur border border-stone-700/80 rounded-2xl p-3.5 text-center">
              <span className="text-xs text-stone-400 block font-medium">Total Occurrences</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">74,122</span>
              <span className="text-[11px] text-stone-400 block font-arabic">مجموع التكرار</span>
            </div>
            <div className="bg-stone-800/80 backdrop-blur border border-stone-700/80 rounded-2xl p-3.5 text-center col-span-2 sm:col-span-1">
              <span className="text-xs text-stone-400 block font-medium">Top 500 Coverage</span>
              <span className="text-xl sm:text-2xl font-black text-teal-300 font-mono">79.2%</span>
              <span className="text-[11px] text-stone-400 block font-arabic">نسبة التغطية</span>
            </div>
          </div>
        </div>

        {/* Quran Comprehension Milestones */}
        <div className="mt-6 pt-5 border-t border-stone-800/80">
          <div className="text-xs text-stone-400 font-medium mb-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ListFilter className="w-3.5 h-3.5 text-amber-400" />
              <span>Vocabulary Learning Milestones:</span>
            </span>
            <span className="text-[11px] text-stone-400">Click to filter words list</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { label: 'All 5,155 Words', count: 'all' as const, pct: '100%' },
              { label: 'Top 50 Words', count: 50, pct: '45.4%' },
              { label: 'Top 100 Words', count: 100, pct: '55.4%' },
              { label: 'Top 300 Words', count: 300, pct: '71.7%' },
              { label: 'Top 500 Words', count: 500, pct: '79.2%' },
              { label: 'Top 1,000 Words', count: 1000, pct: '86.5%' }
            ].map((m) => {
              const isActive = selectedMilestone === m.count;
              return (
                <button
                  key={String(m.count)}
                  onClick={() => handleFilterChange(setSelectedMilestone, m.count)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                      : 'bg-stone-800/90 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700'
                  }`}
                >
                  <span>{m.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-stone-950/20 text-stone-900 font-bold' : 'bg-stone-900 text-amber-300'}`}>
                    {m.pct}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Mode Switcher: Parts of Speech vs Semantic Groups vs Full Table */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-stone-900 p-3 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
        <div className="flex items-center gap-1.5 w-full sm:w-auto p-1 bg-stone-100 dark:bg-stone-800 rounded-xl">
          <button
            onClick={() => setViewMode('pos')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              viewMode === 'pos'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>List by Parts of Speech</span>
            <span className="text-[11px] font-arabic font-normal hidden md:inline">أقسام الكلام</span>
          </button>

          <button
            onClick={() => setViewMode('semantic')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              viewMode === 'semantic'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Group Semantically</span>
            <span className="text-[11px] font-arabic font-normal hidden md:inline">المجموعات الدلالية</span>
          </button>

          <button
            onClick={() => setViewMode('table')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              viewMode === 'table'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>All Words Table</span>
            <span className="text-[11px] font-arabic font-normal hidden md:inline">الجدول الشامل</span>
          </button>
        </div>

        {/* Global Search & Export */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
              placeholder="Search word, meaning, POS..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            />
            {searchQuery && (
              <button
                onClick={() => handleFilterChange(setSearchQuery, '')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={handleExportCsv}
            title="Download CSV of current frequency list"
            className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-stone-200 dark:border-stone-700 hover:border-amber-400 text-stone-700 dark:text-stone-300 hover:text-amber-700 dark:hover:text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {/* Local Vocab Storage Status & Download Manager */}
          <button
            type="button"
            onClick={() => setIsVocabModalOpen(true)}
            title="Locally stored vocabulary (instant zero-latency loads, offline storage & exports)"
            className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-300/80 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            <HardDrive className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Local Storage</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: LIST BY PARTS OF SPEECH */}
      {viewMode === 'pos' && (
        <div className="space-y-6">
          {/* Classical Primary Division Tabs: All, Ism (Noun), Fi'l (Verb), Harf (Particle) */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all' as const, label: 'All Parts of Speech', ar: 'جميع الأقسام', count: stats?.totalWords || 5155 },
              { id: 'noun' as const, label: 'Nouns (Ism)', ar: 'الاسم', count: stats?.primaryDivisions?.find((d) => d.id === 'noun')?.count ?? stats?.primaryDivisions?.[0]?.count ?? 3531, color: 'emerald' },
              { id: 'verb' as const, label: 'Verbs (Fi‘l)', ar: 'الفعل', count: stats?.primaryDivisions?.find((d) => d.id === 'verb')?.count ?? stats?.primaryDivisions?.[1]?.count ?? 1541, color: 'amber' },
              { id: 'particle' as const, label: 'Particles (Harf)', ar: 'الحرف', count: stats?.primaryDivisions?.find((d) => d.id === 'particle')?.count ?? stats?.primaryDivisions?.[2]?.count ?? 83, color: 'indigo' }
            ].map((div) => {
              const isSelected = selectedDivision === div.id;
              return (
                <button
                  key={div.id}
                  onClick={() => handleFilterChange(setSelectedDivision, div.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800'
                  }`}
                >
                  <span>{div.label}</span>
                  <span className="font-arabic font-normal text-xs opacity-80">({div.ar})</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-amber-800/60 text-amber-100' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'}`}>
                    {div.count.toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>

          {/* POS Category Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPosGroups.map((group) => (
              <div
                key={group.pos}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs hover:border-amber-400/80 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        group.primaryDivision === 'noun' ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' :
                        group.primaryDivision === 'verb' ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800' :
                        'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                      }`}>
                        {(group.primaryDivision || 'noun').toUpperCase()}
                      </span>
                      <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mt-1">
                        {group.posTitle || group.pos}
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="font-arabic text-lg font-bold text-amber-600 dark:text-amber-400">
                        {group.posArabic}
                      </span>
                      <span className="block text-[11px] text-stone-400 font-mono">
                        {group.totalWords.toLocaleString()} words
                      </span>
                    </div>
                  </div>

                  {/* Occurrence Stat Bar */}
                  <div className="bg-stone-50 dark:bg-stone-800/60 rounded-xl p-2.5 mb-3 flex items-center justify-between text-xs">
                    <span className="text-stone-500 dark:text-stone-400">Total Occurrences:</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100 font-mono">
                      {group.totalOccurrences.toLocaleString()} times
                    </span>
                  </div>

                  {/* Sample Words Pills */}
                  <div className="space-y-1.5 mb-4">
                    <span className="text-[11px] font-semibold text-stone-400 block uppercase tracking-wider">
                      Most Frequent Examples:
                    </span>
                    <div className="space-y-1">
                      {group.topWords.slice(0, 4).map((tw, twIdx) => (
                        <div
                          key={tw.id || `pos-top-${group.pos}-${tw.rank || twIdx}-${tw.word}`}
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-stone-50 dark:bg-stone-800/40 hover:bg-amber-50/60 dark:hover:bg-amber-950/30 text-xs transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePlayPronunciation(tw.word);
                              }}
                              className="text-stone-400 hover:text-amber-600 transition-colors"
                              title="Listen pronunciation"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-arabic text-base font-bold text-stone-900 dark:text-stone-100">
                              {tw.word}
                            </span>
                            <span className="text-[11px] text-stone-400 italic">
                              ({tw.transliteration})
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-stone-600 dark:text-stone-300 text-[11px] truncate max-w-[110px]" title={tw.meaning}>
                              {tw.meaning}
                            </span>
                            <span className="font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800/50">
                              {tw.frequency.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Drilldown button */}
                <button
                  onClick={() => {
                    handleFilterChange(setSelectedPos, group.pos);
                    setViewMode('table');
                  }}
                  className="w-full mt-2 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-700 dark:text-stone-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>View All {group.totalWords.toLocaleString()} {group.posTitle} Words</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: GROUP SEMANTICALLY */}
      {viewMode === 'semantic' && (
        <div className="space-y-6">
          {/* Top Banner explaining the Semantic POS hierarchy */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Thematic Ontology & Grammar Classes
                </span>
                <span className="text-xs text-stone-500 font-mono">
                  {filteredSemanticGroups.length} Active Domains
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                Quranic Semantic Domains & Parts of Speech
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                Semantically organized exclusively for content classes: <strong className="text-stone-900 dark:text-stone-100">Proper Nouns (أسماء الأعلام)</strong>, <strong className="text-stone-900 dark:text-stone-100">Nouns (الأسماء)</strong>, <strong className="text-stone-900 dark:text-stone-100">Adjectives (الصفات والنعوت)</strong>, and <strong className="text-stone-900 dark:text-stone-100">Verbs (الأفعال)</strong>. Pronouns, particles, and adverbs remain in the grammatical Part-of-Speech directory.
              </p>
            </div>

            {/* Quick POS Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 shrink-0 bg-stone-100 dark:bg-stone-800 p-1.5 rounded-xl border border-stone-200 dark:border-stone-700">
              <span className="text-[11px] font-bold text-stone-500 px-2 uppercase tracking-wider">
                Filter POS:
              </span>
              {[
                { id: 'all' as const, label: 'All Semantics', count: (stats as any)?.semanticStats?.groupedWordsCount || 4990 },
                { id: 'proper_noun' as const, label: 'Proper Nouns', count: (stats as any)?.posTotals?.proper_noun?.count || 107 },
                { id: 'noun' as const, label: 'Nouns', count: (stats as any)?.posTotals?.noun?.count || 2973 },
                { id: 'adjective' as const, label: 'Adjectives', count: (stats as any)?.posTotals?.adjective?.count || 435 },
                { id: 'verb' as const, label: 'Verbs', count: (stats as any)?.posTotals?.verb?.count || 1475 }
              ].map((pos) => {
                const isActive = selectedPosCategory === pos.id;
                return (
                  <button
                    key={pos.id}
                    onClick={() => handleFilterChange(setSelectedPosCategory, pos.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-stone-700'
                    }`}
                  >
                    <span>{pos.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-amber-700 text-amber-100' : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                    }`}>
                      {pos.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSemanticGroups.map((domain) => {
              const icon = DOMAIN_ICONS[domain.domainId] || <Sparkles className="w-5 h-5 text-amber-500" />;
              const activeTab = cardActiveTab[domain.domainId] || (selectedPosCategory !== 'all' ? selectedPosCategory : 'all');
              
              // Determine which words to show in the card
              let displayWords: FluentQuranWord[] = [];
              if (activeTab === 'all') {
                displayWords = domain.topWords.slice(0, 5);
              } else if (activeTab === 'clusters') {
                displayWords = [];
              } else if (domain.categories && domain.categories[activeTab]) {
                displayWords = domain.categories[activeTab].words.slice(0, 5);
              }

              const properCount = domain.categories?.proper_noun?.count || 0;
              const nounCount = domain.categories?.noun?.count || 0;
              const adjCount = domain.categories?.adjective?.count || 0;
              const verbCount = domain.categories?.verb?.count || 0;
              const clusterCount = domain.clusters ? Object.keys(domain.clusters).length : 0;

              return (
                <div
                  key={domain.domainId}
                  className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs hover:border-amber-400/80 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Domain Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0 border border-stone-200 dark:border-stone-700">
                          {icon}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 leading-tight">
                            {domain.domainName}
                          </h3>
                          <span className="font-arabic text-xs font-medium text-amber-600 dark:text-amber-400">
                            {domain.domainArabic}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="block text-xs font-mono font-bold text-stone-900 dark:text-stone-100">
                          {domain.totalWords.toLocaleString()} words
                        </span>
                        <span className="text-[11px] text-stone-400 font-mono">
                          {domain.totalOccurrences.toLocaleString()}x total
                        </span>
                      </div>
                    </div>

                    {/* 4 Part-of-Speech Summary Metrics */}
                    <div className="grid grid-cols-4 gap-1.5 p-2 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-center mb-2.5">
                      <div className="p-1">
                        <span className="text-[10px] text-stone-500 font-semibold block uppercase">Proper</span>
                        <span className="text-xs font-bold font-mono text-amber-600 dark:text-amber-400">{properCount}</span>
                      </div>
                      <div className="p-1">
                        <span className="text-[10px] text-stone-500 font-semibold block uppercase">Nouns</span>
                        <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">{nounCount}</span>
                      </div>
                      <div className="p-1">
                        <span className="text-[10px] text-stone-500 font-semibold block uppercase">Adjectives</span>
                        <span className="text-xs font-bold font-mono text-rose-600 dark:text-rose-400">{adjCount}</span>
                      </div>
                      <div className="p-1">
                        <span className="text-[10px] text-stone-500 font-semibold block uppercase">Verbs</span>
                        <span className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400">{verbCount}</span>
                      </div>
                    </div>

                    {/* Semantically Close Clusters preview */}
                    {domain.clusters && clusterCount > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1.5">
                          <span className="flex items-center gap-1 font-semibold text-stone-700 dark:text-stone-300">
                            <Layers className="w-3 h-3 text-amber-500" />
                            Close Semantic Clusters
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {clusterCount} clusters
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(Object.values(domain.clusters) as SemanticClusterGroup[]).slice(0, 3).map((cl) => (
                            <button
                              key={cl.clusterId}
                              onClick={() => {
                                setSelectedDomainDetail(domain);
                                setModalGroupMode('clusters');
                                setModalActiveCluster(cl.clusterId);
                                setModalSearch('');
                              }}
                              className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200/60 dark:border-amber-800/60 text-[11px] font-medium text-amber-800 dark:text-amber-300 transition-colors cursor-pointer flex items-center gap-1"
                              title={`Explore ${cl.clusterName} (${cl.count} words)`}
                            >
                              <span>{cl.clusterName}</span>
                              <span className="text-[10px] font-mono opacity-70">({cl.count})</span>
                            </button>
                          ))}
                          {clusterCount > 3 && (
                            <button
                              onClick={() => {
                                setSelectedDomainDetail(domain);
                                setModalGroupMode('clusters');
                                setModalActiveCluster('all');
                                setModalSearch('');
                              }}
                              className="px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-[10px] font-semibold text-stone-600 dark:text-stone-400 transition-colors cursor-pointer"
                            >
                              +{clusterCount - 3} more
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Interactive Tab Switcher within the card */}
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 mb-2.5">
                      {[
                        { id: 'all' as const, label: 'Core Top' },
                        ...(clusterCount > 0 ? [{ id: 'clusters' as const, label: `Clusters (${clusterCount})` }] : []),
                        { id: 'proper_noun' as const, label: `Proper (${properCount})` },
                        { id: 'noun' as const, label: `Nouns (${nounCount})` },
                        { id: 'adjective' as const, label: `Adj (${adjCount})` },
                        { id: 'verb' as const, label: `Verbs (${verbCount})` }
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setCardActiveTab((prev) => ({ ...prev, [domain.domainId]: t.id }))}
                          className={`px-2 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                            activeTab === t.id
                              ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    {/* Card Body: Clusters list OR Words list */}
                    {activeTab === 'clusters' && domain.clusters ? (
                      <div className="space-y-1.5 mb-4 max-h-60 overflow-y-auto pr-1">
                        {(Object.values(domain.clusters) as SemanticClusterGroup[]).map((cl) => (
                          <div
                            key={cl.clusterId}
                            onClick={() => {
                              setSelectedDomainDetail(domain);
                              setModalGroupMode('clusters');
                              setModalActiveCluster(cl.clusterId);
                              setModalSearch('');
                            }}
                            className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/50 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-stone-200/70 dark:border-stone-800 transition-colors cursor-pointer flex items-center justify-between gap-2"
                          >
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                                  {cl.clusterName}
                                </span>
                                <span className="font-arabic text-xs text-amber-600 dark:text-amber-400">
                                  {cl.clusterArabic}
                                </span>
                              </div>
                              <span className="text-[10px] text-stone-400">
                                {cl.words.slice(0, 3).map((w) => w.word).join(' • ')}
                              </span>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                                {cl.count} words
                              </span>
                              <span className="block text-[10px] font-mono text-stone-400">
                                {cl.occurrences.toLocaleString()}x
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Words in active tab with English meanings */
                      <div className="space-y-1.5 mb-4">
                        {displayWords.length === 0 ? (
                          <div className="py-4 text-center text-xs text-stone-400">
                            No {activeTab.replace('_', ' ')}s in this domain.
                          </div>
                        ) : (
                          displayWords.map((tw, twIdx) => (
                            <div
                              key={tw.id || `dom-card-${domain.domainId}-${tw.rank || twIdx}-${tw.word}`}
                              className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 hover:bg-amber-50/70 dark:hover:bg-amber-950/30 border border-stone-200/70 dark:border-stone-800 transition-colors"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePlayPronunciation(tw.word);
                                    }}
                                    className="text-stone-400 hover:text-amber-600 transition-colors cursor-pointer"
                                    title="Pronounce word"
                                  >
                                    <Volume2 className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="font-arabic text-lg font-bold text-stone-900 dark:text-stone-100 leading-none">
                                    {tw.word}
                                  </span>
                                  <span className="text-[11px] text-stone-500 dark:text-stone-400 italic">
                                    {tw.transliteration}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  <span className="font-mono text-[10px] text-stone-400">
                                    #{tw.rank}
                                  </span>
                                  <span className="font-mono text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/70 px-1.5 py-0.5 rounded border border-amber-300/50 dark:border-amber-800/50">
                                    {tw.frequency.toLocaleString()}x
                                  </span>
                                </div>
                              </div>

                              {/* English Meaning - prominent & clear */}
                              <div className="mt-1 flex items-start justify-between gap-2">
                                <p className="text-xs font-medium text-stone-800 dark:text-stone-200 leading-snug">
                                  {tw.meaning}
                                </p>
                                {tw.root && onSelectRoot && (
                                  <button
                                    onClick={() => onSelectRoot(tw.root!)}
                                    className="text-[10px] font-arabic px-1.5 py-0.5 rounded bg-stone-200/80 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-amber-500 hover:text-stone-950 transition-colors shrink-0 cursor-pointer"
                                    title={`Inspect root ${tw.root}`}
                                  >
                                    جذر: {tw.root}
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 mt-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                    <button
                      onClick={() => {
                        setSelectedDomainDetail(domain);
                        setModalGroupMode('clusters');
                        setModalActiveCluster('all');
                        setModalActivePos(selectedPosCategory !== 'all' ? selectedPosCategory : 'all');
                        setModalSearch('');
                      }}
                      className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Browse Close Clusters & Words ({domain.totalWords.toLocaleString()})</span>
                    </button>

                    <button
                      onClick={() => {
                        handleFilterChange(setSelectedDomain, domain.domainId);
                        handleFilterChange(setSelectedCluster, 'all');
                        if (selectedPosCategory !== 'all') {
                          handleFilterChange(setSelectedPosCategory, selectedPosCategory);
                        }
                        setViewMode('table');
                      }}
                      className="w-full py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-400 text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Open in Full Table</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: FULL DOMAIN DETAILED CATEGORIZED VIEW */}
      {selectedDomainDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20 shrink-0">
                  {DOMAIN_ICONS[selectedDomainDetail.domainId] || <Sparkles className="w-6 h-6" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                      {selectedDomainDetail.domainName}
                    </h3>
                    <span className="font-arabic text-lg text-amber-600 dark:text-amber-400">
                      {selectedDomainDetail.domainArabic}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    {selectedDomainDetail.totalWords.toLocaleString()} total words • {selectedDomainDetail.totalOccurrences.toLocaleString()} Quranic occurrences
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDomainDetail(null)}
                className="p-2 rounded-xl bg-stone-200/60 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Mode Switcher */}
            <div className="px-5 pt-3 pb-0 bg-stone-100/70 dark:bg-stone-850/70 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModalGroupMode('clusters')}
                  className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                    modalGroupMode === 'clusters'
                      ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-extrabold'
                      : 'border-transparent text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Close Semantic Clusters ({selectedDomainDetail.clusters ? Object.keys(selectedDomainDetail.clusters).length : 0})</span>
                </button>

                <button
                  onClick={() => setModalGroupMode('pos')}
                  className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                    modalGroupMode === 'pos'
                      ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-extrabold'
                      : 'border-transparent text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>By Part of Speech</span>
                </button>
              </div>
            </div>

            {/* Modal Toolbar: Clusters or POS tabs & search */}
            <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              {modalGroupMode === 'clusters' ? (
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
                  <button
                    onClick={() => setModalActiveCluster('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                      modalActiveCluster === 'all'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                    }`}
                  >
                    <span>All Clusters</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      modalActiveCluster === 'all' ? 'bg-amber-700 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-500'
                    }`}>
                      {selectedDomainDetail.totalWords}
                    </span>
                  </button>

                  {selectedDomainDetail.clusters && (Object.values(selectedDomainDetail.clusters) as SemanticClusterGroup[]).map((cl) => (
                    <button
                      key={cl.clusterId}
                      onClick={() => setModalActiveCluster(cl.clusterId)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                        modalActiveCluster === cl.clusterId
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                      }`}
                    >
                      <span>{cl.clusterName}</span>
                      <span className="font-arabic text-[11px] opacity-80">({cl.clusterArabic})</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                        modalActiveCluster === cl.clusterId ? 'bg-amber-700 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-500'
                      }`}>
                        {cl.count}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
                  {[
                    { id: 'all' as const, label: 'All Words', count: selectedDomainDetail.totalWords },
                    { id: 'proper_noun' as const, label: 'Proper Nouns', ar: 'أعلام', count: selectedDomainDetail.categories?.proper_noun?.count || 0 },
                    { id: 'noun' as const, label: 'Nouns', ar: 'أسماء', count: selectedDomainDetail.categories?.noun?.count || 0 },
                    { id: 'adjective' as const, label: 'Adjectives', ar: 'صفات', count: selectedDomainDetail.categories?.adjective?.count || 0 },
                    { id: 'verb' as const, label: 'Verbs', ar: 'أفعال', count: selectedDomainDetail.categories?.verb?.count || 0 }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setModalActivePos(tab.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                        modalActivePos === tab.id
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                        modalActivePos === tab.id ? 'bg-amber-700 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-500'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                <input
                  type="text"
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  placeholder="Filter words inside domain..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Modal Words Grid */}
            <div className="p-5 overflow-y-auto flex-1 max-h-[60vh]">
              {(() => {
                const ms = modalSearch.toLowerCase().trim();

                // Helper to render an individual word card in modal
                const renderWordCard = (w: FluentQuranWord, idx: number, prefix: string = 'word') => (
                  <div
                    key={`${prefix}-${w.id || w.rank || idx}-${w.word}`}
                    className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 hover:border-amber-400/80 transition-all flex flex-col justify-between gap-2.5"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePlayPronunciation(w.word)}
                            className="text-stone-400 hover:text-amber-600 transition-colors cursor-pointer"
                            title="Pronounce word"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-arabic text-xl font-bold text-stone-900 dark:text-stone-100">
                            {w.word}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] text-stone-400">#{w.rank}</span>
                          <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-300/40">
                            {w.frequency.toLocaleString()}x
                          </span>
                        </div>
                      </div>

                      <span className="text-xs text-stone-400 italic block mt-0.5">
                        {w.transliteration}
                      </span>

                      {/* English meaning */}
                      <p className="text-xs font-semibold text-stone-800 dark:text-stone-100 mt-1.5 leading-snug">
                        {w.meaning}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-200/60 dark:border-stone-700/60 flex flex-col gap-1 text-[11px]">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                          w.posCategory === 'proper_noun'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200'
                            : w.posCategory === 'noun'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200'
                            : w.posCategory === 'adjective'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200'
                            : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200'
                        }`}>
                          {w.posCategory ? w.posCategory.replace('_', ' ') : w.posTitle}
                        </span>

                        {w.root && onSelectRoot && (
                          <button
                            onClick={() => {
                              setSelectedDomainDetail(null);
                              onSelectRoot(w.root!);
                            }}
                            className="font-arabic text-stone-600 dark:text-stone-300 hover:text-amber-600 text-xs cursor-pointer"
                          >
                            جذر: {w.root}
                          </button>
                        )}
                      </div>

                      {w.semanticClusterName && modalGroupMode === 'pos' && (
                        <div className="flex items-center gap-1 text-[10px] text-stone-400">
                          <Layers className="w-3 h-3 text-amber-500 shrink-0" />
                          <span className="truncate">{w.semanticClusterName} ({w.semanticClusterArabic})</span>
                        </div>
                      )}
                    </div>
                  </div>
                );

                // If in CLUSTER MODE
                if (modalGroupMode === 'clusters') {
                  if (!selectedDomainDetail.clusters || Object.keys(selectedDomainDetail.clusters).length === 0) {
                    return (
                      <div className="py-12 text-center text-stone-400 text-xs">
                        No semantic clusters available for this domain.
                      </div>
                    );
                  }

                  // Determine clusters to display
                  const clustersToDisplay: SemanticClusterGroup[] = modalActiveCluster === 'all'
                    ? (Object.values(selectedDomainDetail.clusters) as SemanticClusterGroup[])
                    : selectedDomainDetail.clusters[modalActiveCluster]
                    ? [selectedDomainDetail.clusters[modalActiveCluster]]
                    : [];

                  return (
                    <div className="space-y-6">
                      {clustersToDisplay.map((cl) => {
                        let clWords = cl.words;
                        if (ms) {
                          clWords = clWords.filter((w) =>
                            w.word.includes(ms) ||
                            w.transliteration.toLowerCase().includes(ms) ||
                            w.meaning.toLowerCase().includes(ms) ||
                            (w.root && w.root.includes(ms))
                          );
                        }

                        if (clWords.length === 0 && ms) return null;

                        return (
                          <div key={cl.clusterId} className="space-y-2.5">
                            {/* Cluster Section Header */}
                            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                                  {cl.clusterName}
                                </h4>
                                <span className="font-arabic text-sm text-amber-600 dark:text-amber-400">
                                  {cl.clusterArabic}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-900">
                                  {cl.count} words • {cl.occurrences.toLocaleString()}x
                                </span>

                                <button
                                  onClick={() => {
                                    const dId = selectedDomainDetail.domainId;
                                    const cId = cl.clusterId;
                                    setSelectedDomainDetail(null);
                                    handleFilterChange(setSelectedDomain, dId);
                                    handleFilterChange(setSelectedCluster, cId);
                                    setViewMode('table');
                                  }}
                                  className="text-[11px] text-stone-500 hover:text-amber-600 dark:hover:text-amber-400 font-medium cursor-pointer underline ml-1"
                                >
                                  Table
                                </button>
                              </div>
                            </div>

                            {/* Words in this cluster */}
                            {clWords.length === 0 ? (
                              <div className="py-4 text-center text-xs text-stone-400">
                                No words in this cluster match "{modalSearch}".
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {clWords.map((w, wIdx) => renderWordCard(w, wIdx, `modal-cl-${cl.clusterId}`))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                }

                // If in POS MODE
                let list: FluentQuranWord[] = [];
                if (modalActivePos === 'all') {
                  list = [
                    ...(selectedDomainDetail.categories?.proper_noun?.words || []),
                    ...(selectedDomainDetail.categories?.noun?.words || []),
                    ...(selectedDomainDetail.categories?.adjective?.words || []),
                    ...(selectedDomainDetail.categories?.verb?.words || [])
                  ];
                  const seen = new Set(list.map((w) => w.rank || w.word));
                  for (const tw of selectedDomainDetail.topWords) {
                    const twKey = tw.rank || tw.word;
                    if (!seen.has(twKey)) {
                      list.push(tw);
                      seen.add(twKey);
                    }
                  }
                  list.sort((a, b) => a.rank - b.rank);
                } else if (selectedDomainDetail.categories?.[modalActivePos]) {
                  list = selectedDomainDetail.categories[modalActivePos].words;
                }

                if (ms) {
                  list = list.filter((w) => 
                    w.word.includes(ms) ||
                    w.transliteration.toLowerCase().includes(ms) ||
                    w.meaning.toLowerCase().includes(ms) ||
                    (w.root && w.root.includes(ms))
                  );
                }

                if (list.length === 0) {
                  return (
                    <div className="py-12 text-center text-stone-400 text-xs">
                      No words match the selected category or search in this domain.
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {list.map((w, wIdx) => renderWordCard(w, wIdx, `modal-pos-${modalActivePos}`))}
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 flex items-center justify-between">
              <button
                onClick={() => {
                  const dId = selectedDomainDetail.domainId;
                  const pCat = modalActivePos !== 'all' ? modalActivePos : 'all';
                  const cId = modalGroupMode === 'clusters' && modalActiveCluster !== 'all' ? modalActiveCluster : 'all';
                  setSelectedDomainDetail(null);
                  handleFilterChange(setSelectedDomain, dId);
                  handleFilterChange(setSelectedCluster, cId);
                  if (pCat !== 'all') {
                    handleFilterChange(setSelectedPosCategory, pCat);
                  }
                  setViewMode('table');
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View Filtered in All Words Table</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setSelectedDomainDetail(null)}
                className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-300 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: ALL WORDS DATA TABLE */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden">
          {/* Active Filter Summary Bar */}
          <div className="p-4 bg-stone-50 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-stone-700 dark:text-stone-200">
                Filtered Results:
              </span>
              <span className="px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 font-mono font-bold">
                {totalCount.toLocaleString()} words ({totalOccurrences.toLocaleString()} total occurrences)
              </span>

              {selectedPosCategory !== 'all' && (
                <span className="px-2.5 py-0.5 rounded-md bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 flex items-center gap-1 font-semibold">
                  Class: <strong>{selectedPosCategory.replace('_', ' ')}</strong>
                  <button onClick={() => handleFilterChange(setSelectedPosCategory, 'all')} className="hover:text-red-500 ml-1">✕</button>
                </span>
              )}

              {selectedDivision !== 'all' && (
                <span className="px-2.5 py-0.5 rounded-md bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center gap-1">
                  Division: <strong>{selectedDivision}</strong>
                  <button onClick={() => handleFilterChange(setSelectedDivision, 'all')} className="hover:text-red-500 ml-1">✕</button>
                </span>
              )}

              {selectedPos !== 'all' && (
                <span className="px-2.5 py-0.5 rounded-md bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center gap-1">
                  POS: <strong>{selectedPos}</strong>
                  <button onClick={() => handleFilterChange(setSelectedPos, 'all')} className="hover:text-red-500 ml-1">✕</button>
                </span>
              )}

              {selectedDomain !== 'all' && (
                <span className="px-2.5 py-0.5 rounded-md bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center gap-1">
                  Domain: <strong>{selectedDomain}</strong>
                  <button onClick={() => handleFilterChange(setSelectedDomain, 'all')} className="hover:text-red-500 ml-1">✕</button>
                </span>
              )}

              {selectedCluster !== 'all' && (
                <span className="px-2.5 py-0.5 rounded-md bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 flex items-center gap-1 font-semibold">
                  Cluster: <strong>{selectedCluster}</strong>
                  <button onClick={() => handleFilterChange(setSelectedCluster, 'all')} className="hover:text-red-500 ml-1">✕</button>
                </span>
              )}

              {selectedMilestone !== 'all' && (
                <span className="px-2.5 py-0.5 rounded-md bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center gap-1">
                  Top: <strong>{selectedMilestone}</strong>
                  <button onClick={() => handleFilterChange(setSelectedMilestone, 'all')} className="hover:text-red-500 ml-1">✕</button>
                </span>
              )}

              {(selectedDivision !== 'all' || selectedPosCategory !== 'all' || selectedPos !== 'all' || selectedDomain !== 'all' || selectedCluster !== 'all' || selectedMilestone !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedDivision('all');
                    setSelectedPosCategory('all');
                    setSelectedPos('all');
                    setSelectedDomain('all');
                    setSelectedCluster('all');
                    setSelectedMilestone('all');
                    setSearchQuery('');
                    setPage(1);
                  }}
                  className="text-amber-600 dark:text-amber-400 hover:underline font-medium ml-2 cursor-pointer"
                >
                  Reset All Filters
                </button>
              )}
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <span className="text-stone-400">Sort By:</span>
              <select
                value={sortField}
                onChange={(e) => handleFilterChange(setSortField, e.target.value as any)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-medium text-stone-700 dark:text-stone-200 focus:outline-none"
              >
                <option value="rank">Rank (#1 to #5155)</option>
                <option value="frequency">Frequency (High to Low)</option>
                <option value="alphabetical">Arabic Alphabetical</option>
                <option value="pos">Part of Speech</option>
              </select>
              <button
                onClick={() => handleFilterChange(setSortDirection, sortDirection === 'asc' ? 'desc' : 'asc')}
                className="p-1 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white cursor-pointer"
                title={`Direction: ${sortDirection}`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* POS Category Selection Bar */}
          <div className="px-4 py-2.5 bg-stone-100/80 dark:bg-stone-850/80 border-b border-stone-200 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mr-1 shrink-0">Grammar Class:</span>
            {[
              { id: 'all' as const, label: 'All Classes' },
              { id: 'proper_noun' as const, label: '👑 Proper Nouns (107)' },
              { id: 'noun' as const, label: '📖 Nouns (2,989)' },
              { id: 'adjective' as const, label: '✨ Adjectives (435)' },
              { id: 'verb' as const, label: '⚡ Verbs (1,541)' },
              { id: 'particle' as const, label: '🔗 Particles (83)' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleFilterChange(setSelectedPosCategory, cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedPosCategory === cat.id
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-100 dark:bg-stone-850 text-stone-600 dark:text-stone-400 font-semibold border-b border-stone-200 dark:border-stone-800">
                  <th className="py-3 px-4 w-16 text-center">Rank</th>
                  <th className="py-3 px-4">Arabic Word</th>
                  <th className="py-3 px-4">Transliteration</th>
                  <th className="py-3 px-4">English Meaning</th>
                  <th className="py-3 px-4">Part of Speech (POS)</th>
                  <th className="py-3 px-4">Semantic Domain & Cluster</th>
                  <th className="py-3 px-4 text-right">Occurrences</th>
                  <th className="py-3 px-4 text-right w-24">Quran %</th>
                  <th className="py-3 px-4 text-center w-16">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-800 dark:text-stone-200">
                {loadingWords ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-stone-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
                      <span>Loading Quranic frequency words...</span>
                    </td>
                  </tr>
                ) : words.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-stone-400">
                      No words match the selected filters or search query.
                    </td>
                  </tr>
                ) : (
                  words.map((w, wIdx) => (
                    <tr
                      key={w.id || `table-word-${w.rank || wIdx}-${w.word}`}
                      className="hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-center text-stone-400">
                        #{w.rank}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePlayPronunciation(w.word)}
                            className={`p-1 rounded-md transition-colors ${
                              playingWord === w.word
                                ? 'bg-amber-500 text-stone-950'
                                : 'text-stone-400 hover:text-amber-600 hover:bg-stone-100 dark:hover:bg-stone-800'
                            }`}
                            title="Pronounce word"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-arabic text-xl font-bold text-stone-900 dark:text-stone-100">
                            {w.word}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-serif italic text-stone-600 dark:text-stone-300">
                        {w.transliteration}
                      </td>

                      <td className="py-3 px-4 max-w-xs sm:max-w-sm font-medium text-stone-900 dark:text-stone-100 leading-snug">
                        {w.meaning}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                              w.posCategory === 'proper_noun'
                                ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300/40'
                                : w.posCategory === 'noun'
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300/40'
                                : w.posCategory === 'adjective'
                                ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border border-rose-300/40'
                                : w.posCategory === 'verb'
                                ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border border-blue-300/40'
                                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                            }`}>
                              {w.posCategory ? w.posCategory.replace('_', ' ') : w.primaryDivision}
                            </span>
                            <span className="font-medium text-stone-800 dark:text-stone-200">
                              {w.posTitle}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-arabic text-[11px] text-amber-600 dark:text-amber-400">
                              {w.posArabic}
                            </span>
                            {w.root && onSelectRoot && (
                              <button
                                onClick={() => onSelectRoot(w.root!)}
                                className="text-[10px] font-arabic px-1.5 py-0.2 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-amber-500 hover:text-stone-950 transition-colors cursor-pointer"
                                title={`Explore root ${w.root}`}
                              >
                                جذر: {w.root}
                              </button>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-[11px] font-medium text-stone-700 dark:text-stone-300">
                            {w.semanticDomainName}
                          </span>
                          {w.semanticClusterName && (
                            <button
                              onClick={() => {
                                if (w.semanticDomain) handleFilterChange(setSelectedDomain, w.semanticDomain);
                                handleFilterChange(setSelectedCluster, w.semanticCluster!);
                              }}
                              className="text-[10px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 px-2 py-0.5 rounded border border-amber-200/60 dark:border-amber-800/60 font-medium cursor-pointer transition-colors flex items-center gap-1"
                              title={`Filter table by cluster: ${w.semanticClusterName}`}
                            >
                              <Layers className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                              <span>{w.semanticClusterName}</span>
                              <span className="font-arabic font-normal">({w.semanticClusterArabic})</span>
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">
                        {w.frequency.toLocaleString()}
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-stone-500 text-[11px]">
                        {w.percentage}%
                      </td>

                      <td className="py-3 px-4 text-center">
                        {onSelectRoot && (
                          <button
                            onClick={() => onSelectRoot(w.root || w.cleanArabic)}
                            title={`Search root concordance for ${w.root || w.cleanArabic}`}
                            className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-500 transition-all cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 bg-stone-50 dark:bg-stone-850 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
            <span className="text-stone-500 dark:text-stone-400 font-mono">
              Page {page} of {totalPages} ({totalCount.toLocaleString()} words total)
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-semibold text-stone-700 dark:text-stone-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 dark:hover:bg-stone-750 transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-semibold text-stone-700 dark:text-stone-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 dark:hover:bg-stone-750 transition-colors flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Local Storage & Vocab Download Modal */}
      <LocalVocabManagerModal
        isOpen={isVocabModalOpen}
        onClose={() => setIsVocabModalOpen(false)}
      />
    </div>
  );
};
