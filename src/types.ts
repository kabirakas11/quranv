export interface RootSummary {
  code: string;
  arabic: string;
  letter: string;
  arabicLetter: string;
  cleanArabic: string;
  occurrences?: number;
  translitName?: string;
  primaryGloss?: string;
}

export interface DerivedFormSummary {
  text: string;
  count: number;
  countText: string;
  formType: string;
  arabicLemma: string;
  translitLemma: string;
}

export interface WordVariation {
  location: string;
  chapter: number;
  verse: number;
  wordNumber: number;
  surahName?: string;
  surahArabic?: string;
  revelationType?: 'Meccan' | 'Medinan';
  transliteration: string;
  translation: string;
  targetWord: string;
  ayahText: string;
  audioUrl?: string;
  prefix?: string;
  suffix?: string;
  grammarCategory?: string;
}

export interface RootDerivation {
  id: string;
  root?: string;            // Root Buckwalter code (e.g. "ktb")
  rootArabic?: string;      // Arabic root letters (e.g. "ك ت ب")
  word: string;             // Arabic word (e.g. "يَكْتُبُونَ")
  transliteration: string;  // Transliteration (e.g. "yaktubūna")
  prefix: string;           // Prefix e.g. "فَـ (fa-)" or "—"
  suffix: string;           // Suffix e.g. "ـُونَ (-ūna)" or "—"
  grammarCategory: string;  // Grammar category e.g. "Verb (form I)", "Noun", "Active participle"
  meaning: string;          // Meaning in English e.g. "write", "the book"
  frequency: number;        // Occurrence count in the Quran
  semanticRole?: 'Action' | 'Agent' | 'Object' | 'Entity' | 'Attribute';
  examples?: string[];      // Sample location citations e.g. ["2:79:3", "68:47:5"]
  occurrences: WordVariation[]; // All occurrences of this specific derivation in the Quran
}

export interface PartOfSpeechSummary {
  id: string;
  name: string;
  nameArabic: string;
  pattern: string;
  categoryGroup: 'verb' | 'noun' | 'participle' | 'particle' | 'all';
  primaryDivision?: 'noun' | 'verb' | 'particle'; // The 3 Classical Arabic divisions (اسم, فعل, حرف)
  description: string;
  totalDerivations: number;
  totalOccurrences: number;
}

export type GrammarCategorySummary = PartOfSpeechSummary;

export interface SemanticWordItem {
  id: string;
  word: string;             // Arabic word e.g. "ٱلرَّحْمَٰنِ"
  transliteration: string;  // e.g. "l-raḥmāni"
  cleanArabic: string;      // e.g. "الرحمن"
  root: string;             // Root code e.g. "rHm"
  rootArabic: string;       // e.g. "ر ح م"
  grammarCategory: string;  // e.g. "Noun", "Verb (form I)"
  meaning: string;          // e.g. "The Entirely Merciful"
  frequency: number;        // Quran occurrences
  semanticRole: 'Action' | 'Agent' | 'Object' | 'Entity' | 'Attribute';
  sampleVerse?: {
    location: string;
    text: string;
    translation: string;
    surahName?: string;
  };
}

export interface SemanticSubcategory {
  id: string;
  name: string;
  nameArabic: string;
  description: string;
  words: SemanticWordItem[];
}

export interface SemanticDomain {
  id: string;
  name: string;
  nameArabic: string;
  description: string;
  iconName: string;
  color: string;
  subcategories: SemanticSubcategory[];
  totalWordsCount: number;
  totalOccurrences: number;
}


export interface MorphologicalSection {
  heading: string;
  count: number;
  variations: WordVariation[];
}

export interface RootDetail {
  code: string;
  arabicRoot: string;
  rootTranslit: string;
  occurrences: number;
  formsCountDesc: string;
  derivedForms: DerivedFormSummary[];
  derivations: RootDerivation[];
  sections: MorphologicalSection[];
  totalWordVariations: number;
  sourceUrl: string;
}

export interface LinguisticInsight {
  root: string;
  coreSemanticMeaning: string;
  classicalLexicon: string;
  formEvolution: Array<{
    formName: string;
    pattern: string;
    meaningInContext: string;
  }>;
  thematicSignificance: string;
  famousVerses: Array<{
    citation: string;
    arabicSample: string;
    significance: string;
  }>;
}

export interface FluentQuranWord {
  id: string;
  rank: number;
  word: string;
  cleanArabic: string;
  frequency: number;
  percentage: number;
  pos: string;
  posCategory?: 'noun' | 'proper_noun' | 'adjective' | 'verb' | 'pronoun' | 'adverb' | 'particle';
  posArabic: string;
  posTitle: string;
  primaryDivision: 'noun' | 'verb' | 'particle';
  transliteration: string;
  meaning: string;
  semanticDomain?: string | null;
  semanticDomainName?: string | null;
  semanticDomainArabic?: string | null;
  semanticCluster?: string | null;
  semanticClusterName?: string | null;
  semanticClusterArabic?: string | null;
  semanticRole?: 'Action' | 'Agent' | 'Object' | 'Entity' | 'Attribute' | 'Connective';
  root?: string | null;
  sampleVerse?: {
    location: string;
    text: string;
    translation: string;
    surahName?: string;
  } | null;
}

export interface SemanticCategoryGroup {
  name: string;
  nameArabic: string;
  count: number;
  occurrences: number;
  words: FluentQuranWord[];
}

export interface SemanticClusterGroup {
  clusterId: string;
  clusterName: string;
  clusterArabic: string;
  count: number;
  occurrences: number;
  words: FluentQuranWord[];
}

export interface SemanticGroupWithCategories {
  domainId: string;
  domainName: string;
  domainArabic: string;
  description?: string;
  icon?: string;
  totalWords: number;
  totalOccurrences: number;
  clusters?: Record<string, SemanticClusterGroup>;
  categories: {
    noun: SemanticCategoryGroup;
    proper_noun: SemanticCategoryGroup;
    adjective: SemanticCategoryGroup;
    verb: SemanticCategoryGroup;
    particle?: SemanticCategoryGroup;
  };
  topWords: FluentQuranWord[];
}

export interface FluentFrequencyStats {
  totalWords: number;
  totalOccurrences: number;
  source: string;
  sourceSpreadsheet: string;
  milestones: Array<{
    label: string;
    count: number;
    coveragePercent: number;
    desc: string;
  }>;
  primaryDivisions: Array<{
    id: 'noun' | 'verb' | 'particle';
    name: string;
    nameArabic: string;
    count: number;
    occurrences: number;
  }>;
  posBreakdown: Array<{
    pos: string;
    posArabic: string;
    primaryDivision: 'noun' | 'verb' | 'particle';
    count: number;
    occurrences: number;
  }>;
  semanticBreakdown: Array<{
    id: string;
    name: string;
    nameArabic: string;
    count: number;
    occurrences: number;
  }>;
}
