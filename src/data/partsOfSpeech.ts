import type { RootDerivation, PartOfSpeechSummary } from '../types.ts';
import { GRAMMAR_TYPES, CURATED_GRAMMAR_DERIVATIONS, normalizeGrammarTypeId } from './grammarTypes.ts';
import {
  QURAN_PARTICLES,
  ALL_PARTICLE_DERIVATIONS,
  PREPOSITION_DERIVATIONS,
  INTERJECTION_DERIVATIONS,
  type QuranParticle
} from './quranParticles.ts';

// The 3 Classical Arabic Foundational Parts of Speech (أقسام الكلام الثلاثة)
export interface PrimaryDivisionInfo {
  id: 'noun' | 'verb' | 'particle';
  name: string;
  nameArabic: string;
  description: string;
  countSubtypes: number;
  totalWordsEst: number;
  totalOccurrencesEst: number;
  color: string;
  bgLight: string;
  borderLight: string;
}

export const PRIMARY_DIVISIONS: PrimaryDivisionInfo[] = [
  {
    id: 'noun',
    name: 'Noun (Ism)',
    nameArabic: 'الاسم',
    description: 'Words indicating a person, entity, quality, attribute, place, time, or abstract verbal concept (Masdar), independent of tense.',
    countSubtypes: 7,
    totalWordsEst: 3800,
    totalOccurrencesEst: 25000,
    color: 'emerald',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderLight: 'border-emerald-200 dark:border-emerald-800/60'
  },
  {
    id: 'verb',
    name: 'Verb (Fi‘l)',
    nameArabic: 'الفعل',
    description: 'Words denoting an action, event, or state coupled with a specific tense (past, present/imperfect, or imperative).',
    countSubtypes: 9,
    totalWordsEst: 3300,
    totalOccurrencesEst: 19000,
    color: 'amber',
    bgLight: 'bg-amber-50 dark:bg-amber-950/30',
    borderLight: 'border-amber-200 dark:border-amber-800/60'
  },
  {
    id: 'particle',
    name: 'Particle & Connectives (Harf)',
    nameArabic: 'الحرف وأدوات المعاني',
    description: 'Connective words that convey grammatical meaning when conjoined: prepositions (حروف الجر), interjections & vocatives (حروف النداء وأسماء الأفعال), conjunctions, negatives, conditionals, and emphasis markers.',
    countSubtypes: 3,
    totalWordsEst: QURAN_PARTICLES.length,
    totalOccurrencesEst: 24500,
    color: 'indigo',
    bgLight: 'bg-indigo-50 dark:bg-indigo-950/30',
    borderLight: 'border-indigo-200 dark:border-indigo-800/60'
  }
];

// Special dedicated particle summaries
export const PARTICLE_SPECIFIC_CATEGORIES: PartOfSpeechSummary[] = [
  {
    id: 'preposition',
    name: 'Prepositions (Harf Jarr)',
    nameArabic: 'حروف الجر والقسم',
    pattern: 'حَرْف جَرّ',
    categoryGroup: 'particle',
    primaryDivision: 'particle',
    description: 'Prepositions governing the Genitive case (مجرور) signifying departure (مِنْ), terminus (إِلَىٰ), containment (فِي), elevation & obligation (عَلَىٰ), attachment & agency (بِـ), ownership (لِـ), comparison (كَـ), and solemn oaths (وَ، تَـ).',
    totalDerivations: PREPOSITION_DERIVATIONS.length,
    totalOccurrences: 12500
  },
  {
    id: 'interjection',
    name: 'Interjections & Vocatives (Nidā & Asmā al-Af‘āl)',
    nameArabic: 'حروف النداء وأسماء الأفعال والتنبيه',
    pattern: 'حَرْف نِدَاء / اسْم فِعْل',
    categoryGroup: 'particle',
    primaryDivision: 'particle',
    description: 'Interjections, vocative particles (يَا, أَيُّهَا), verbal nouns of distance (هَيْهَاتَ), invitation (هَيْتَ لَكَ), disgust (أُفٍّ), awe (وَيْكَأَنَّ), command (هَاؤُمُ), regret (يَا لَيْتَنِي), deterrence (كَلَّا), and affirmation (بَلَىٰ).',
    totalDerivations: INTERJECTION_DERIVATIONS.length,
    totalOccurrences: 1100
  },
  {
    id: 'particle',
    name: 'All Particles (Hurūf al-Ma‘ānī)',
    nameArabic: 'جميع حروف المعاني وأدوات النحو',
    pattern: 'حَرْف مَعْنًى',
    categoryGroup: 'particle',
    primaryDivision: 'particle',
    description: 'The complete repertoire of Quranic particles: prepositions, interjections, negative & prohibitive particles, coordinating conjunctions, conditionals, Inna and its sisters, and emphasis markers.',
    totalDerivations: ALL_PARTICLE_DERIVATIONS.length,
    totalOccurrences: 24500
  }
];

// Enrich all categories with primary division mapping
export const PARTS_OF_SPEECH: PartOfSpeechSummary[] = [
  ...GRAMMAR_TYPES.filter((g) => g.id !== 'particle').map((g) => {
    let primaryDivision: 'noun' | 'verb' | 'particle' = 'noun';
    if (g.categoryGroup === 'verb') {
      primaryDivision = 'verb';
    } else if (g.categoryGroup === 'particle') {
      primaryDivision = 'particle';
    } else {
      primaryDivision = 'noun';
    }

    return {
      ...g,
      primaryDivision
    };
  }),
  ...PARTICLE_SPECIFIC_CATEGORIES
];

// Normalize any Part of Speech query or string to a canonical ID
export function normalizePartOfSpeechId(pos: string): string {
  const s = (pos || '').toLowerCase().trim();
  if (s === 'noun' || s === 'nouns' || s === 'ism' || s === 'اسم' || s === 'الاسم') return 'noun';
  if (s === 'verb' || s === 'verbs' || s === 'fil' || s === 'fi\'l' || s === 'فعل' || s === 'الفعل') return 'verb';
  if (s.includes('preposition') || s.includes('jarr') || s.includes('جر') || s === 'prep') return 'preposition';
  if (s.includes('interjection') || s.includes('nida') || s.includes('نداء') || s.includes('asma al-afal') || s.includes('اسم فعل')) return 'interjection';
  if (s === 'particle' || s === 'particles' || s === 'harf' || s === 'حرف' || s === 'الحرف' || s.includes('معاني')) return 'particle';
  return normalizeGrammarTypeId(s);
}

// Get all words for a given Part of Speech
export function getWordsForPartOfSpeech(posId: string): RootDerivation[] {
  const norm = normalizePartOfSpeechId(posId);

  // Prepositions specific
  if (norm === 'preposition') {
    return PREPOSITION_DERIVATIONS.sort((a, b) => b.frequency - a.frequency);
  }

  // Interjections specific
  if (norm === 'interjection') {
    return INTERJECTION_DERIVATIONS.sort((a, b) => b.frequency - a.frequency);
  }

  // If requesting the broad "particle" division or all particles:
  if (norm === 'particle') {
    return ALL_PARTICLE_DERIVATIONS.sort((a, b) => b.frequency - a.frequency);
  }

  // If requesting the broad "noun" division: aggregate all noun subtypes
  if (norm === 'noun') {
    const nounIds = ['noun', 'proper-noun', 'verbal-noun', 'active-participle', 'passive-participle', 'adjective', 'noun-place-time'];
    const results: RootDerivation[] = [];
    const seenIds = new Set<string>();

    for (const subId of nounIds) {
      const words = CURATED_GRAMMAR_DERIVATIONS[subId] || [];
      for (const w of words) {
        if (!seenIds.has(w.id)) {
          results.push(w);
          seenIds.add(w.id);
        }
      }
    }
    return results.sort((a, b) => b.frequency - a.frequency);
  }

  // If requesting the broad "verb" division: aggregate all verb forms
  if (norm === 'verb') {
    const verbIds = ['verb-form-i', 'verb-form-ii', 'verb-form-iii', 'verb-form-iv', 'verb-form-v', 'verb-form-vi', 'verb-form-vii', 'verb-form-viii', 'verb-form-x'];
    const results: RootDerivation[] = [];
    const seenIds = new Set<string>();

    for (const subId of verbIds) {
      const words = CURATED_GRAMMAR_DERIVATIONS[subId] || [];
      for (const w of words) {
        if (!seenIds.has(w.id)) {
          results.push(w);
          seenIds.add(w.id);
        }
      }
    }
    return results.sort((a, b) => b.frequency - a.frequency);
  }

  // Specific part of speech (e.g. "active-participle", "verb-form-i", "verbal-noun")
  return (CURATED_GRAMMAR_DERIVATIONS[norm] || []).sort((a, b) => b.frequency - a.frequency);
}

// Re-export original references and particles for full compatibility
export {
  CURATED_GRAMMAR_DERIVATIONS,
  normalizeGrammarTypeId
} from './grammarTypes.ts';
export {
  QURAN_PARTICLES,
  ALL_PARTICLE_DERIVATIONS,
  PREPOSITION_DERIVATIONS,
  INTERJECTION_DERIVATIONS,
  type QuranParticle
} from './quranParticles.ts';

