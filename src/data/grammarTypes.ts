import type { RootDerivation, GrammarCategorySummary } from '../types.ts';

export const GRAMMAR_TYPES: GrammarCategorySummary[] = [
  {
    id: 'verb-form-i',
    name: 'Verb (Form I)',
    nameArabic: 'الفعل الثلاثي المجرد',
    pattern: 'فَعَلَ / يَفْعَلُ / اِفْعَلْ',
    categoryGroup: 'verb',
    description: 'The basic, unaugmented triliteral root verb expressing the core, primary action or state.',
    totalDerivations: 1250,
    totalOccurrences: 9240
  },
  {
    id: 'verb-form-ii',
    name: 'Verb (Form II)',
    nameArabic: 'الفعل المزيد بالتضعيف (فَعَّلَ)',
    pattern: 'فَعَّلَ / يُفَعِّلُ / فَعِّلْ',
    categoryGroup: 'verb',
    description: 'Augmented with gemination (shaddah) on the second radical; indicates intensive, causative, or repeated action.',
    totalDerivations: 430,
    totalOccurrences: 1485
  },
  {
    id: 'verb-form-iii',
    name: 'Verb (Form III)',
    nameArabic: 'الفعل المزيد بالألف (فَاعَلَ)',
    pattern: 'فَاعَلَ / يُفَاعِلُ / فَاعِلْ',
    categoryGroup: 'verb',
    description: 'Augmented with an alif after the first radical; expresses mutual participation, reciprocal action, or effort.',
    totalDerivations: 175,
    totalOccurrences: 490
  },
  {
    id: 'verb-form-iv',
    name: 'Verb (Form IV)',
    nameArabic: 'الفعل المزيد بالهمزة (أَفْعَلَ)',
    pattern: 'أَفْعَلَ / يُفْعِلُ / أَفْعِلْ',
    categoryGroup: 'verb',
    description: 'Augmented with hamza prefix; highly productive causative form (to cause someone/something to do the base action).',
    totalDerivations: 560,
    totalOccurrences: 3820
  },
  {
    id: 'verb-form-v',
    name: 'Verb (Form V)',
    nameArabic: 'الفعل المزيد بالتاء والتضعيف (تَفَعَّلَ)',
    pattern: 'تَفَعَّلَ / يَتَفَعَّلُ / تَفَعَّلْ',
    categoryGroup: 'verb',
    description: 'Reflexive/passive counterpart to Form II; indicates gradual acquisition, deliberate effort, or self-transformation.',
    totalDerivations: 240,
    totalOccurrences: 760
  },
  {
    id: 'verb-form-vi',
    name: 'Verb (Form VI)',
    nameArabic: 'الفعل المزيد بالتاء والألف (تَفَاعَلَ)',
    pattern: 'تَفَاعَلَ / يَتَفَاعَلُ / تَفَاعَلْ',
    categoryGroup: 'verb',
    description: 'Reflexive counterpart of Form III; expresses reciprocal interaction between multiple parties or feigning a state.',
    totalDerivations: 85,
    totalOccurrences: 195
  },
  {
    id: 'verb-form-vii',
    name: 'Verb (Form VII)',
    nameArabic: 'الفعل المزيد بالنون (اِنْفَعَلَ)',
    pattern: 'اِنْفَعَلَ / يَنْفَعِلُ / اِنْفَعِلْ',
    categoryGroup: 'verb',
    description: 'Augmented with in- prefix; expresses passive-reflexive and spontaneous bodily or cosmic reactions.',
    totalDerivations: 60,
    totalOccurrences: 120
  },
  {
    id: 'verb-form-viii',
    name: 'Verb (Form VIII)',
    nameArabic: 'الفعل المزيد بالتاء (اِفْتَعَلَ)',
    pattern: 'اِفْتَعَلَ / يَفْتَعِلُ / اِفْتَعِلْ',
    categoryGroup: 'verb',
    description: 'Augmented with infixed ta; denotes deliberate personal exertion, adoption, or internal reflection for oneself.',
    totalDerivations: 380,
    totalOccurrences: 2140
  },
  {
    id: 'verb-form-x',
    name: 'Verb (Form X)',
    nameArabic: 'الفعل المزيد بالاستفعال (اِسْتَفْعَلَ)',
    pattern: 'اِسْتَفْعَلَ / يَسْتَفْعِلُ / اِسْتَفْعِلْ',
    categoryGroup: 'verb',
    description: 'Augmented with ista- prefix; expresses seeking, petitioning, asking for (e.g. asking for forgiveness), or deeming.',
    totalDerivations: 210,
    totalOccurrences: 840
  },
  {
    id: 'active-participle',
    name: 'Active Participle',
    nameArabic: 'اسم الفاعل',
    pattern: 'فَاعِل / مُفَعِّل / مُفْعِل',
    categoryGroup: 'participle',
    description: 'The verbal noun denoting the agent, subject, or doer of the action (e.g. kātib = writer, mu’min = believer).',
    totalDerivations: 740,
    totalOccurrences: 4620
  },
  {
    id: 'passive-participle',
    name: 'Passive Participle',
    nameArabic: 'اسم المفعول',
    pattern: 'مَفْعُول / مُفَعَّل / مُفْعَل',
    categoryGroup: 'participle',
    description: 'Denotes the patient, object, or entity upon which the action has been enacted (e.g. maktūb = written, decreed).',
    totalDerivations: 190,
    totalOccurrences: 580
  },
  {
    id: 'verbal-noun',
    name: 'Verbal Noun (Masdar)',
    nameArabic: 'المصدر الصريح',
    pattern: 'فَعْل / فُعُول / فِعَالَة / تَفْعِيل',
    categoryGroup: 'noun',
    description: 'The abstract noun expressing the nominal essence of the action itself, free from temporal constraint.',
    totalDerivations: 820,
    totalOccurrences: 3750
  },
  {
    id: 'noun',
    name: 'Noun / Substantive',
    nameArabic: 'اسم ذات / اسم جنس',
    pattern: 'اسم ثلاثي / رباعي',
    categoryGroup: 'noun',
    description: 'Substantive nouns referring to concrete creations, celestial bodies, anatomical parts, and physical entities.',
    totalDerivations: 1450,
    totalOccurrences: 8900
  },
  {
    id: 'proper-noun',
    name: 'Proper Noun',
    nameArabic: 'اسم العلم',
    pattern: 'علم مفرد / مركب',
    categoryGroup: 'noun',
    description: 'Names of God, prophets, messengers, sacred locations, angels, and specific historical personalities.',
    totalDerivations: 130,
    totalOccurrences: 4100
  },
  {
    id: 'adjective',
    name: 'Adjective & Intensive Epithet',
    nameArabic: 'الصفة المشبهة وصيغ المبالغة',
    pattern: 'فَعِيل / فَعُول / فَعَّال',
    categoryGroup: 'participle',
    description: 'Attributes denoting permanent, inherent, or highly emphasized qualities (e.g. ‘alīm = All-Knowing, raḥīm = Merciful).',
    totalDerivations: 390,
    totalOccurrences: 2850
  },
  {
    id: 'noun-place-time',
    name: 'Noun of Place & Time',
    nameArabic: 'اسم المكان والزمان',
    pattern: 'مَفْعَل / مَفْعِل',
    categoryGroup: 'noun',
    description: 'Derived nouns designating the specific venue, sanctuary, or epoch of the event (e.g. masjid = place of prostration).',
    totalDerivations: 95,
    totalOccurrences: 360
  },
  {
    id: 'particle',
    name: 'Particles & Prepositions',
    nameArabic: 'الحروف والأدوات',
    pattern: 'حرف جر / عطف / توكيد',
    categoryGroup: 'particle',
    description: 'Connective particles, prepositions, conjunctions, emphasis markers, and interrogatives.',
    totalDerivations: 80,
    totalOccurrences: 14500
  }
];

// Normalize any arbitrary grammar string from Corpus Quran into our standard grammar type ID
export function normalizeGrammarTypeId(categoryStr: string): string {
  const s = (categoryStr || '').toLowerCase().trim();

  // Verb forms
  if (s.includes('form i verb') || s === 'verb (form i)' || s.includes('form 1 verb') || s === 'verb i') return 'verb-form-i';
  if (s.includes('form ii verb') || s === 'verb (form ii)' || s.includes('form 2 verb') || s === 'verb ii') return 'verb-form-ii';
  if (s.includes('form iii verb') || s === 'verb (form iii)' || s.includes('form 3 verb') || s === 'verb iii') return 'verb-form-iii';
  if (s.includes('form iv verb') || s === 'verb (form iv)' || s.includes('form 4 verb') || s === 'verb iv') return 'verb-form-iv';
  if (s.includes('form v verb') || s === 'verb (form v)' || s.includes('form 5 verb') || s === 'verb v') return 'verb-form-v';
  if (s.includes('form vi verb') || s === 'verb (form vi)' || s.includes('form 6 verb') || s === 'verb vi') return 'verb-form-vi';
  if (s.includes('form vii verb') || s === 'verb (form vii)' || s.includes('form 7 verb') || s === 'verb vii') return 'verb-form-vii';
  if (s.includes('form viii verb') || s === 'verb (form viii)' || s.includes('form 8 verb') || s === 'verb viii') return 'verb-form-viii';
  if (s.includes('form x verb') || s === 'verb (form x)' || s.includes('form 10 verb') || s === 'verb x') return 'verb-form-x';

  // Participles & Verbal Nouns
  if (s.includes('active participle')) return 'active-participle';
  if (s.includes('passive participle')) return 'passive-participle';
  if (s.includes('verbal noun') || s.includes('masdar')) return 'verbal-noun';

  // Proper nouns, adjectives, nouns
  if (s.includes('proper noun')) return 'proper-noun';
  if (s.includes('adjective') || s.includes('epithet') || s.includes('intensive')) return 'adjective';
  if (s.includes('noun of place') || s.includes('noun of time') || s.includes('location')) return 'noun-place-time';
  if (s.includes('particle') || s.includes('preposition') || s.includes('conjunction')) return 'particle';
  if (s.includes('verb')) return 'verb-form-i';
  if (s.includes('noun')) return 'noun';

  return 'noun';
}

// Pre-indexed curated representative Quranic derivations across all grammar types
export const CURATED_GRAMMAR_DERIVATIONS: Record<string, RootDerivation[]> = {
  'verb-form-i': [
    {
      id: 'ktb_kataba_form1',
      root: 'ktb',
      rootArabic: 'ك ت ب',
      word: 'كَتَبَ',
      transliteration: 'kataba',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Verb (form I)',
      meaning: 'he wrote, ordained, decreed',
      frequency: 49,
      semanticRole: 'Action',
      examples: ['2:183:3', '2:187:24', '4:66:4'],
      occurrences: [
        {
          location: '2:183:3',
          chapter: 2,
          verse: 183,
          wordNumber: 3,
          surahName: 'Al-Baqarah',
          surahArabic: 'البقرة',
          targetWord: 'كُتِبَ',
          transliteration: 'kutiba',
          translation: 'is prescribed',
          ayahText: 'يَا أَيُّهَا الَّذِينَ آمَنُوا 【كُتِبَ】 عَلَيْكُمُ الصِّيَامُ',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002183.mp3',
          prefix: '—',
          suffix: '—',
          grammarCategory: 'Verb (form I)'
        },
        {
          location: '58:21:1',
          chapter: 58,
          verse: 21,
          wordNumber: 1,
          surahName: 'Al-Mujadila',
          surahArabic: 'المجادلة',
          targetWord: 'كَتَبَ',
          transliteration: 'kataba',
          translation: 'has decreed',
          ayahText: '【كَتَبَ】 اللَّهُ لَأَغْلِبَنَّ أَنَا وَرُسُلِي',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/058021.mp3',
          prefix: '—',
          suffix: '—',
          grammarCategory: 'Verb (form I)'
        }
      ]
    },
    {
      id: 'ktb_yaktubuna_form1',
      root: 'ktb',
      rootArabic: 'ك ت ب',
      word: 'يَكْتُبُونَ',
      transliteration: 'yaktubūna',
      prefix: '—',
      suffix: 'ـُونَ (-ūna)',
      grammarCategory: 'Verb (form I)',
      meaning: 'they write, record',
      frequency: 11,
      semanticRole: 'Action',
      examples: ['2:79:3', '21:94:10', '43:80:6'],
      occurrences: [
        {
          location: '2:79:3',
          chapter: 2,
          verse: 79,
          wordNumber: 3,
          surahName: 'Al-Baqarah',
          surahArabic: 'البقرة',
          targetWord: 'يَكْتُبُونَ',
          transliteration: 'yaktubūna',
          translation: 'write',
          ayahText: 'فَوَيْلٌ لِلَّذِينَ 【يَكْتُبُونَ】 الْكِتَابَ بِأَيْدِيهِمْ',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002079.mp3',
          prefix: '—',
          suffix: 'ـُونَ (-ūna)',
          grammarCategory: 'Verb (form I)'
        }
      ]
    },
    {
      id: 'qwl_qala_form1',
      root: 'qwl',
      rootArabic: 'ق و ل',
      word: 'قَالَ',
      transliteration: 'qāla',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Verb (form I)',
      meaning: 'he said, stated, spoke',
      frequency: 528,
      semanticRole: 'Action',
      examples: ['2:30:2', '2:33:1', '3:39:7'],
      occurrences: [
        {
          location: '2:30:2',
          chapter: 2,
          verse: 30,
          wordNumber: 2,
          surahName: 'Al-Baqarah',
          surahArabic: 'البقرة',
          targetWord: 'قَالَ',
          transliteration: 'qāla',
          translation: 'said',
          ayahText: 'وَإِذْ 【قَالَ】 رَبُّكَ لِلْمَلَائِكَةِ إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002030.mp3',
          prefix: '—',
          suffix: '—',
          grammarCategory: 'Verb (form I)'
        }
      ]
    },
    {
      id: 'Elm_alima_form1',
      root: 'Elm',
      rootArabic: 'ع ل م',
      word: 'عَلِمَ',
      transliteration: '‘alima',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Verb (form I)',
      meaning: 'he knew, learned, comprehended',
      frequency: 382,
      semanticRole: 'Action',
      examples: ['2:187:14', '2:235:1', '8:23:2'],
      occurrences: [
        {
          location: '2:187:14',
          chapter: 2,
          verse: 187,
          wordNumber: 14,
          surahName: 'Al-Baqarah',
          surahArabic: 'البقرة',
          targetWord: 'عَلِمَ',
          transliteration: '‘alima',
          translation: 'knows',
          ayahText: '【عَلِمَ】 اللَّهُ أَنَّكُمْ كُنْتُمْ تَخْتَانُونَ أَنْفُسَكُمْ',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002187.mp3',
          prefix: '—',
          suffix: '—',
          grammarCategory: 'Verb (form I)'
        }
      ]
    },
    {
      id: 'rHm_rahima_form1',
      root: 'rHm',
      rootArabic: 'ر ح م',
      word: 'رَحِمَ',
      transliteration: 'raḥima',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Verb (form I)',
      meaning: 'he bestowed mercy upon, had compassion',
      frequency: 148,
      semanticRole: 'Action',
      examples: ['11:43:16', '12:53:11', '17:54:5'],
      occurrences: [
        {
          location: '12:53:11',
          chapter: 12,
          verse: 53,
          wordNumber: 11,
          surahName: 'Yusuf',
          surahArabic: 'يوسف',
          targetWord: 'رَحِمَ',
          transliteration: 'raḥima',
          translation: 'bestows mercy',
          ayahText: 'إِلَّا مَا 【رَحِمَ】 رَبِّي إِنَّ رَبِّي غَفُورٌ رَحِيمٌ',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/012053.mp3',
          prefix: '—',
          suffix: '—',
          grammarCategory: 'Verb (form I)'
        }
      ]
    },
    {
      id: 'Ebd_abada_form1',
      root: 'Ebd',
      rootArabic: 'ع ب د',
      word: 'عَبَدَ',
      transliteration: '‘abada',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Verb (form I)',
      meaning: 'he worshipped, served devoutly',
      frequency: 143,
      semanticRole: 'Action',
      examples: ['1:5:1', '2:21:3', '109:2:2'],
      occurrences: [
        {
          location: '1:5:1',
          chapter: 1,
          verse: 5,
          wordNumber: 1,
          surahName: 'Al-Fatihah',
          surahArabic: 'الفاتحة',
          targetWord: 'نَعْبُدُ',
          transliteration: 'na‘budu',
          translation: 'we worship',
          ayahText: 'إِيَّاكَ 【نَعْبُدُ】 وَإِيَّاكَ نَسْتَعِينُ',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001005.mp3',
          prefix: '—',
          suffix: '—',
          grammarCategory: 'Verb (form I)'
        }
      ]
    }
  ],

  'verb-form-ii': [
    {
      id: 'nzl_nazzala_form2',
      root: 'nzl',
      rootArabic: 'ن ز ل',
      word: 'نَزَّلَ',
      transliteration: 'nazzala',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Verb (form II)',
      meaning: 'sent down piecemeal, revealed gradually',
      frequency: 62,
      semanticRole: 'Action',
      examples: ['2:97:8', '15:9:2', '25:1:3'],
      occurrences: [
        {
          location: '15:9:2',
          chapter: 15,
          verse: 9,
          wordNumber: 2,
          surahName: 'Al-Hijr',
          surahArabic: 'الحجر',
          targetWord: 'نَزَّلْنَا',
          transliteration: 'nazzalnā',
          translation: 'sent down',
          ayahText: 'إِنَّا نَحْنُ 【نَزَّلْنَا】 الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/015009.mp3',
          prefix: '—',
          suffix: 'ـنَا (-nā)',
          grammarCategory: 'Verb (form II)'
        }
      ]
    },
    {
      id: 'sbH_sabbaHa_form2',
      root: 'sbH',
      rootArabic: 'س ب ح',
      word: 'سَبَّحَ',
      transliteration: 'sabbaḥa',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Verb (form II)',
      meaning: 'glorified, exalted above imperfection',
      frequency: 44,
      semanticRole: 'Action',
      examples: ['57:1:1', '59:1:1', '61:1:1'],
      occurrences: [
        {
          location: '57:1:1',
          chapter: 57,
          verse: 1,
          wordNumber: 1,
          surahName: 'Al-Hadid',
          surahArabic: 'الحديد',
          targetWord: 'سَبَّحَ',
          transliteration: 'sabbaḥa',
          translation: 'glorifies',
          ayahText: '【سَبَّحَ】 لِلَّهِ مَا فِي السَّمَاوَاتِ وَالْأَرْضِ',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/057001.mp3',
          prefix: '—',
          suffix: '—',
          grammarCategory: 'Verb (form II)'
        }
      ]
    },
    {
      id: 'bdl_baddala_form2',
      root: 'bdl',
      rootArabic: 'ب د ل',
      word: 'بَدَّلَ',
      transliteration: 'baddala',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Verb (form II)',
      meaning: 'substituted, exchanged, altered',
      frequency: 18,
      semanticRole: 'Action',
      examples: ['2:59:2', '2:181:2', '4:56:9'],
      occurrences: [
        {
          location: '2:59:2',
          chapter: 2,
          verse: 59,
          wordNumber: 2,
          surahName: 'Al-Baqarah',
          surahArabic: 'البقرة',
          targetWord: 'فَبَدَّلَ',
          transliteration: 'fa-baddala',
          translation: 'but changed',
          ayahText: '【فَبَدَّلَ】 الَّذِينَ ظَلَمُوا قَوْلًا غَيْرَ الَّذِي قِيلَ لَهُمْ',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002059.mp3',
          prefix: 'فَـ (fa-)',
          suffix: '—',
          grammarCategory: 'Verb (form II)'
        }
      ]
    }
  ],

  'verb-form-iii': [
    {
      id: 'jhd_jahada_form3',
      root: 'jhd',
      rootArabic: 'ج ه د',
      word: 'جَاهَدَ',
      transliteration: 'jāhada',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Verb (form III)',
      meaning: 'strove, exerted earnest effort',
      frequency: 28,
      semanticRole: 'Action',
      examples: ['9:73:2', '22:78:2', '29:6:2'],
      occurrences: [
        {
          location: '22:78:2',
          chapter: 22,
          verse: 78,
          wordNumber: 2,
          surahName: 'Al-Hajj',
          surahArabic: 'الحج',
          targetWord: 'وَجَاهِدُوا',
          transliteration: 'wa-jāhidū',
          translation: 'and strive',
          ayahText: '【وَجَاهِدُوا】 فِي اللَّهِ حَقَّ جِهَادِهِ',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/022078.mp3',
          prefix: 'وَ (wa-)',
          suffix: 'ـوا (-ū)',
          grammarCategory: 'Verb (form III)'
        }
      ]
    },
    {
      id: 'ktb_katibu_form3',
      root: 'ktb',
      rootArabic: 'ك ت ب',
      word: 'فَكَاتِبُوهُمْ',
      transliteration: 'fa-kātibūhum',
      prefix: 'فَـ (fa-)',
      suffix: 'ـهُمْ (-hum)',
      grammarCategory: 'Verb (form III)',
      meaning: 'make contract of emancipation with them',
      frequency: 1,
      semanticRole: 'Action',
      examples: ['24:33:14'],
      occurrences: [
        {
          location: '24:33:14',
          chapter: 24,
          verse: 33,
          wordNumber: 14,
          surahName: 'An-Nur',
          surahArabic: 'النور',
          targetWord: 'فَكَاتِبُوهُمْ',
          transliteration: 'fa-kātibūhum',
          translation: 'contract with them',
          ayahText: 'فَالَّذِينَ يَبْتَغُونَ الْكِتَابَ مِمَّا مَلَكَتْ أَيْمَانُكُمْ 【فَكَاتِبُوهُمْ】',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/024033.mp3',
          prefix: 'فَـ (fa-)',
          suffix: 'ـهُمْ (-hum)',
          grammarCategory: 'Verb (form III)'
        }
      ]
    }
  ],

  'verb-form-iv': [
    {
      id: 'nzl_anzala_form4',
      root: 'nzl',
      rootArabic: 'ن ز ل',
      word: 'أَنْزَلَ',
      transliteration: 'anzala',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Verb (form IV)',
      meaning: 'sent down, bestowed revelation',
      frequency: 191,
      semanticRole: 'Action',
      examples: ['2:4:5', '2:23:6', '97:1:2'],
      occurrences: [
        {
          location: '97:1:2',
          chapter: 97,
          verse: 1,
          wordNumber: 2,
          surahName: 'Al-Qadr',
          surahArabic: 'القدر',
          targetWord: 'أَنْزَلْنَاهُ',
          transliteration: 'anzalnāhu',
          translation: 'sent it down',
          ayahText: 'إِنَّا 【أَنْزَلْنَاهُ】 فِي لَيْلَةِ الْقَدْرِ',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/097001.mp3',
          prefix: '—',
          suffix: 'ـهُ (-hu)',
          grammarCategory: 'Verb (form IV)'
        }
      ]
    },
    {
      id: 'rsl_arsala_form4',
      root: 'rsl',
      rootArabic: 'ر س ل',
      word: 'أَرْسَلَ',
      transliteration: 'arsala',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Verb (form IV)',
      meaning: 'sent forth messengers / winds',
      frequency: 143,
      semanticRole: 'Action',
      examples: ['7:73:2', '14:4:1', '48:28:2'],
      occurrences: [
        {
          location: '48:28:2',
          chapter: 48,
          verse: 28,
          wordNumber: 2,
          surahName: 'Al-Fath',
          surahArabic: 'الفتح',
          targetWord: 'أَرْسَلَ',
          transliteration: 'arsala',
          translation: 'sent',
          ayahText: 'هُوَ الَّذِي 【أَرْسَلَ】 رَسُولَهُ بِالْهُدَىٰ وَدِينِ الْحَقِّ',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/048028.mp3',
          prefix: '—',
          suffix: '—',
          grammarCategory: 'Verb (form IV)'
        }
      ]
    },
    {
      id: 'Hyy_ahyaya_form4',
      root: 'Hyy',
      rootArabic: 'ح ي ي',
      word: 'أَحْيَا',
      transliteration: 'aḥyā',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Verb (form IV)',
      meaning: 'brought to life, revived',
      frequency: 52,
      semanticRole: 'Action',
      examples: ['2:28:9', '2:73:10', '22:66:3'],
      occurrences: [
        {
          location: '2:28:9',
          chapter: 2,
          verse: 28,
          wordNumber: 9,
          surahName: 'Al-Baqarah',
          surahArabic: 'البقرة',
          targetWord: 'فَأَحْيَاكُمْ',
          transliteration: 'fa-aḥyākum',
          translation: 'then brought you to life',
          ayahText: 'كَيْفَ تَكْفُرُونَ بِاللَّهِ وَكُنْتُمْ أَمْوَاتًا 【فَأَحْيَاكُمْ】',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002028.mp3',
          prefix: 'فَـ (fa-)',
          suffix: 'ـكُمْ (-kum)',
          grammarCategory: 'Verb (form IV)'
        }
      ]
    }
  ],

  'verb-form-viii': [
    {
      id: 'tqy_ittaqa_form8',
      root: 'wqy',
      rootArabic: 'و ق ي',
      word: 'اتَّقَىٰ',
      transliteration: 'ittaqa',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Verb (form VIII)',
      meaning: 'feared God, was mindful, guarded against evil',
      frequency: 162,
      semanticRole: 'Action',
      examples: ['2:189:24', '3:102:4', '65:2:12'],
      occurrences: [
        {
          location: '3:102:4',
          chapter: 3,
          verse: 102,
          wordNumber: 4,
          surahName: 'Ali ‘Imran',
          surahArabic: 'آل عمران',
          targetWord: 'اتَّقُوا',
          transliteration: 'ittaqū',
          translation: 'fear Allah',
          ayahText: 'يَا أَيُّهَا الَّذِينَ آمَنُوا 【اتَّقُوا】 اللَّهَ حَقَّ تُقَاتِهِ',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/003102.mp3',
          prefix: '—',
          suffix: 'ـوا (-ū)',
          grammarCategory: 'Verb (form VIII)'
        }
      ]
    },
    {
      id: 'xlf_ikhtalafa_form8',
      root: 'xlf',
      rootArabic: 'خ ل ف',
      word: 'اخْتَلَفَ',
      transliteration: 'ikhtalafa',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Verb (form VIII)',
      meaning: 'differed, disputed, disagreed',
      frequency: 39,
      semanticRole: 'Action',
      examples: ['2:213:21', '3:19:12', '16:64:8'],
      occurrences: [
        {
          location: '3:19:12',
          chapter: 3,
          verse: 19,
          wordNumber: 12,
          surahName: 'Ali ‘Imran',
          surahArabic: 'آل عمران',
          targetWord: 'اخْتَلَفَ',
          transliteration: 'ikhtalafa',
          translation: 'differed',
          ayahText: 'وَمَا 【اخْتَلَفَ】 الَّذِينَ أُوتُوا الْكِتَابَ إِلَّا مِنْ بَعْدِ مَا جَاءَهُمُ الْعِلْمُ',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/003019.mp3',
          prefix: '—',
          suffix: '—',
          grammarCategory: 'Verb (form VIII)'
        }
      ]
    }
  ],

  'verb-form-x': [
    {
      id: 'gfr_istaghfara_form10',
      root: 'gfr',
      rootArabic: 'غ ف ر',
      word: 'اسْتَغْفَرَ',
      transliteration: 'istaghfara',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Verb (form X)',
      meaning: 'sought forgiveness, begged pardon',
      frequency: 42,
      semanticRole: 'Action',
      examples: ['4:64:12', '71:10:2', '110:3:3'],
      occurrences: [
        {
          location: '71:10:2',
          chapter: 71,
          verse: 10,
          wordNumber: 2,
          surahName: 'Nuh',
          surahArabic: 'نوح',
          targetWord: 'اسْتَغْفِرُوا',
          transliteration: 'istaghfirū',
          translation: 'ask forgiveness',
          ayahText: 'فَقُلْتُ 【اسْتَغْفِرُوا】 رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/071010.mp3',
          prefix: '—',
          suffix: 'ـوا (-ū)',
          grammarCategory: 'Verb (form X)'
        }
      ]
    },
    {
      id: 'kbr_istakbara_form10',
      root: 'kbr',
      rootArabic: 'ك ب ر',
      word: 'اسْتَكْبَرَ',
      transliteration: 'istakbara',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Verb (form X)',
      meaning: 'waxed proud, displayed arrogance',
      frequency: 40,
      semanticRole: 'Action',
      examples: ['2:34:9', '7:133:14', '38:74:2'],
      occurrences: [
        {
          location: '2:34:9',
          chapter: 2,
          verse: 34,
          wordNumber: 9,
          surahName: 'Al-Baqarah',
          surahArabic: 'البقرة',
          targetWord: 'وَاسْتَكْبَرَ',
          transliteration: 'wa-istakbara',
          translation: 'and was arrogant',
          ayahText: 'إِلَّا إِبْلِيسَ أَبَىٰ 【وَاسْتَكْبَرَ】 وَكَانَ مِنَ الْكَافِرِينَ',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002034.mp3',
          prefix: 'وَ (wa-)',
          suffix: '—',
          grammarCategory: 'Verb (form X)'
        }
      ]
    }
  ],

  'active-participle': [
    {
      id: 'ktb_katibun_ap',
      root: 'ktb',
      rootArabic: 'ك ت ب',
      word: 'كَاتِبٌ',
      transliteration: 'kātibun',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Active participle',
      meaning: 'a scribe, writer',
      frequency: 5,
      semanticRole: 'Agent',
      examples: ['2:282:9', '2:282:13', '2:282:39'],
      occurrences: [
        {
          location: '2:282:9',
          chapter: 2,
          verse: 282,
          wordNumber: 9,
          surahName: 'Al-Baqarah',
          surahArabic: 'البقرة',
          targetWord: 'كَاتِبٌ',
          transliteration: 'kātibun',
          translation: 'a scribe',
          ayahText: 'وَلْيَكْتُبْ بَيْنَكُمْ 【كَاتِبٌ】 بِالْعَدْلِ',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002282.mp3',
          prefix: '—',
          suffix: '—',
          grammarCategory: 'Active participle'
        }
      ]
    },
    {
      id: 'Amn_muminuna_ap',
      root: 'Amn',
      rootArabic: 'أ م ن',
      word: 'الْمُؤْمِنُونَ',
      transliteration: 'al-mu’minūna',
      prefix: 'الـ (al-)',
      suffix: 'ـُونَ (-ūna)',
      grammarCategory: 'Active participle',
      meaning: 'the believers, faithful doers',
      frequency: 181,
      semanticRole: 'Agent',
      examples: ['9:71:1', '23:1:2', '49:15:2'],
      occurrences: [
        {
          location: '23:1:2',
          chapter: 23,
          verse: 1,
          wordNumber: 2,
          surahName: 'Al-Mu’minun',
          surahArabic: 'المؤمنون',
          targetWord: 'الْمُؤْمِنُونَ',
          transliteration: 'al-mu’minūna',
          translation: 'the believers',
          ayahText: 'قَدْ أَفْلَحَ 【الْمُؤْمِنُونَ】',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/023001.mp3',
          prefix: 'الـ (al-)',
          suffix: 'ـُونَ (-ūna)',
          grammarCategory: 'Active participle'
        }
      ]
    },
    {
      id: 'Zlm_zalimina_ap',
      root: 'Zlm',
      rootArabic: 'ظ ل م',
      word: 'الظَّالِمِينَ',
      transliteration: 'al-ẓālimīna',
      prefix: 'الـ (al-)',
      suffix: 'ـِينَ (-īna)',
      grammarCategory: 'Active participle',
      meaning: 'the wrongdoers, unjust oppressors',
      frequency: 114,
      semanticRole: 'Agent',
      examples: ['2:35:15', '3:57:9', '7:44:17'],
      occurrences: [
        {
          location: '7:44:17',
          chapter: 7,
          verse: 44,
          wordNumber: 17,
          surahName: 'Al-A‘raf',
          surahArabic: 'الأعراف',
          targetWord: 'الظَّالِمِينَ',
          transliteration: 'al-ẓālimīna',
          translation: 'the wrongdoers',
          ayahText: 'أَلَا لَعْنَةُ اللَّهِ عَلَى 【الظَّالِمِينَ】',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/007044.mp3',
          prefix: 'الـ (al-)',
          suffix: 'ـِينَ (-īna)',
          grammarCategory: 'Active participle'
        }
      ]
    }
  ],

  'passive-participle': [
    {
      id: 'ktb_maktubun_pp',
      root: 'ktb',
      rootArabic: 'ك ت ب',
      word: 'مَكْتُوبًا',
      transliteration: 'maktūban',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Passive participle',
      meaning: 'written down, inscribed, recorded',
      frequency: 2,
      semanticRole: 'Object',
      examples: ['7:157:7', '17:58:14'],
      occurrences: [
        {
          location: '7:157:7',
          chapter: 7,
          verse: 157,
          wordNumber: 7,
          surahName: 'Al-A‘raf',
          surahArabic: 'الأعراف',
          targetWord: 'مَكْتُوبًا',
          transliteration: 'maktūban',
          translation: 'written down',
          ayahText: 'الَّذِي يَجِدُونَهُ 【مَكْتُوبًا】 عِنْدَهُمْ فِي التَّوْرَاةِ وَالْإِنْجِيلِ',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/007157.mp3',
          prefix: '—',
          suffix: '—',
          grammarCategory: 'Passive participle'
        }
      ]
    },
    {
      id: 'jnn_majnun_pp',
      root: 'jnn',
      rootArabic: 'ج ن ن',
      word: 'مَجْنُونٍ',
      transliteration: 'majnūnin',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Passive participle',
      meaning: 'possessed by jinn, madman',
      frequency: 11,
      semanticRole: 'Object',
      examples: ['15:6:7', '37:36:6', '68:2:5'],
      occurrences: [
        {
          location: '68:2:5',
          chapter: 68,
          verse: 2,
          wordNumber: 5,
          surahName: 'Al-Qalam',
          surahArabic: 'القلم',
          targetWord: 'بِمَجْنُونٍ',
          transliteration: 'bi-majnūnin',
          translation: 'possessed',
          ayahText: 'مَا أَنْتَ بِنِعْمَةِ رَبِّكَ 【بِمَجْنُونٍ】',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/068002.mp3',
          prefix: 'بِـ (bi-)',
          suffix: '—',
          grammarCategory: 'Passive participle'
        }
      ]
    }
  ],

  'verbal-noun': [
    {
      id: 'ktb_kitabah_vn',
      root: 'ktb',
      rootArabic: 'ك ت ب',
      word: 'كِتَابٌ',
      transliteration: 'kitābun',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Verbal noun',
      meaning: 'a book, scripture, written ordinance',
      frequency: 260,
      semanticRole: 'Attribute',
      examples: ['2:2:2', '2:78:8', '3:7:7'],
      occurrences: [
        {
          location: '2:2:2',
          chapter: 2,
          verse: 2,
          wordNumber: 2,
          surahName: 'Al-Baqarah',
          surahArabic: 'البقرة',
          targetWord: 'الْكِتَابُ',
          transliteration: 'al-kitābu',
          translation: 'the Book',
          ayahText: 'ذَٰلِكَ 【الْكِتَابُ】 لَا رَيْبَ فِيهِ هُدًى لِلْمُتَّقِينَ',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002002.mp3',
          prefix: 'الـ (al-)',
          suffix: '—',
          grammarCategory: 'Verbal noun'
        }
      ]
    },
    {
      id: 'rHm_rahmah_vn',
      root: 'rHm',
      rootArabic: 'ر ح م',
      word: 'رَحْمَةً',
      transliteration: 'raḥmatan',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Verbal noun',
      meaning: 'mercy, grace, divine compassion',
      frequency: 114,
      semanticRole: 'Attribute',
      examples: ['2:105:14', '7:56:11', '21:107:4'],
      occurrences: [
        {
          location: '21:107:4',
          chapter: 21,
          verse: 107,
          wordNumber: 4,
          surahName: 'Al-Anbiya',
          surahArabic: 'الأنبياء',
          targetWord: 'رَحْمَةً',
          transliteration: 'raḥmatan',
          translation: 'as a mercy',
          ayahText: 'وَمَا أَرْسَلْنَاكَ إِلَّا 【رَحْمَةً】 لِلْعَالَمِينَ',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/021107.mp3',
          prefix: '—',
          suffix: '—',
          grammarCategory: 'Verbal noun'
        }
      ]
    },
    {
      id: 'Elm_ilm_vn',
      root: 'Elm',
      rootArabic: 'ع ل م',
      word: 'عِلْمٌ',
      transliteration: '‘ilmun',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Verbal noun',
      meaning: 'knowledge, discernment, revelation',
      frequency: 105,
      semanticRole: 'Attribute',
      examples: ['2:120:17', '17:85:9', '20:114:14'],
      occurrences: [
        {
          location: '20:114:14',
          chapter: 20,
          verse: 114,
          wordNumber: 14,
          surahName: 'Ta-Ha',
          surahArabic: 'طه',
          targetWord: 'عِلْمًا',
          transliteration: '‘ilman',
          translation: 'in knowledge',
          ayahText: 'وَقُلْ رَبِّ زِدْنِي 【عِلْمًا】',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/020114.mp3',
          prefix: '—',
          suffix: '—',
          grammarCategory: 'Verbal noun'
        }
      ]
    },
    {
      id: 'Sbr_sabr_vn',
      root: 'Sbr',
      rootArabic: 'ص ب ر',
      word: 'صَبْرٌ',
      transliteration: 'ṣabrun',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Verbal noun',
      meaning: 'patient endurance, perseverance',
      frequency: 103,
      semanticRole: 'Attribute',
      examples: ['2:45:2', '2:153:4', '12:18:7'],
      occurrences: [
        {
          location: '2:153:4',
          chapter: 2,
          verse: 153,
          wordNumber: 4,
          surahName: 'Al-Baqarah',
          surahArabic: 'البقرة',
          targetWord: 'بِالصَّبْرِ',
          transliteration: 'bi-l-ṣabri',
          translation: 'through patience',
          ayahText: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا 【بِالصَّبْرِ】 وَالصَّلَاةِ',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002153.mp3',
          prefix: 'بِـ (bi-)',
          suffix: '—',
          grammarCategory: 'Verbal noun'
        }
      ]
    }
  ],

  'noun': [
    {
      id: 'ArD_ard_noun',
      root: 'ArD',
      rootArabic: 'أ ر ض',
      word: 'الْأَرْضُ',
      transliteration: 'al-arḍu',
      prefix: 'الـ (al-)',
      suffix: '—',
      grammarCategory: 'Noun',
      meaning: 'the earth, land, world',
      frequency: 461,
      semanticRole: 'Entity',
      examples: ['2:11:7', '2:22:2', '55:10:2'],
      occurrences: [
        {
          location: '2:22:2',
          chapter: 2,
          verse: 22,
          wordNumber: 2,
          surahName: 'Al-Baqarah',
          surahArabic: 'البقرة',
          targetWord: 'الْأَرْضَ',
          transliteration: 'al-arḍa',
          translation: 'the earth',
          ayahText: 'الَّذِي جَعَلَ لَكُمُ 【الْأَرْضَ】 فِرَاشًا وَالسَّمَاءَ بِنَاءً',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002022.mp3',
          prefix: 'الـ (al-)',
          suffix: '—',
          grammarCategory: 'Noun'
        }
      ]
    },
    {
      id: 'smw_sama_noun',
      root: 'smw',
      rootArabic: 'س م و',
      word: 'السَّمَاءُ',
      transliteration: 'al-samā’u',
      prefix: 'الـ (al-)',
      suffix: '—',
      grammarCategory: 'Noun',
      meaning: 'the sky, heaven, firmament',
      frequency: 310,
      semanticRole: 'Entity',
      examples: ['2:22:5', '2:29:10', '50:6:3'],
      occurrences: [
        {
          location: '50:6:3',
          chapter: 50,
          verse: 6,
          wordNumber: 3,
          surahName: 'Qaf',
          surahArabic: 'ق',
          targetWord: 'السَّمَاءِ',
          transliteration: 'al-samā’i',
          translation: 'the heaven',
          ayahText: 'أَفَلَمْ يَنْظُرُوا إِلَى 【السَّمَاءِ】 فَوْقَهُمْ كَيْفَ بَنَيْنَاهَا',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/050006.mp3',
          prefix: 'الـ (al-)',
          suffix: '—',
          grammarCategory: 'Noun'
        }
      ]
    },
    {
      id: 'qlb_qalb_noun',
      root: 'qlb',
      rootArabic: 'ق ل ب',
      word: 'قَلْبٌ',
      transliteration: 'qalbun',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Noun',
      meaning: 'heart, center of intellect and faith',
      frequency: 132,
      semanticRole: 'Entity',
      examples: ['2:10:2', '2:260:13', '26:89:3'],
      occurrences: [
        {
          location: '26:89:3',
          chapter: 26,
          verse: 89,
          wordNumber: 3,
          surahName: 'Ash-Shu‘ara',
          surahArabic: 'الشعراء',
          targetWord: 'بِقَلْبٍ',
          transliteration: 'bi-qalbin',
          translation: 'with a heart',
          ayahText: 'إِلَّا مَنْ أَتَى اللَّهَ 【بِقَلْبٍ】 سَلِيمٍ',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/026089.mp3',
          prefix: 'بِـ (bi-)',
          suffix: '—',
          grammarCategory: 'Noun'
        }
      ]
    }
  ],

  'proper-noun': [
    {
      id: 'Alh_allah_pn',
      root: 'Alh',
      rootArabic: 'إ ل ه',
      word: 'اللَّهُ',
      transliteration: 'Allāh',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Proper noun',
      meaning: 'Allah (The Almighty God)',
      frequency: 2699,
      semanticRole: 'Agent',
      examples: ['1:1:2', '2:255:1', '112:1:3'],
      occurrences: [
        {
          location: '112:1:3',
          chapter: 112,
          verse: 1,
          wordNumber: 3,
          surahName: 'Al-Ikhlas',
          surahArabic: 'الإخلاص',
          targetWord: 'اللَّهُ',
          transliteration: 'Allāhu',
          translation: 'Allah',
          ayahText: 'قُلْ هُوَ 【اللَّهُ】 أَحَدٌ',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/112001.mp3',
          prefix: '—',
          suffix: '—',
          grammarCategory: 'Proper noun'
        }
      ]
    },
    {
      id: 'mws_musa_pn',
      root: 'mws',
      rootArabic: 'م و س',
      word: 'مُوسَىٰ',
      transliteration: 'Mūsā',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Proper noun',
      meaning: 'Moses (Prophet)',
      frequency: 136,
      semanticRole: 'Agent',
      examples: ['2:51:2', '7:104:2', '20:9:2'],
      occurrences: [
        {
          location: '20:9:2',
          chapter: 20,
          verse: 9,
          wordNumber: 2,
          surahName: 'Ta-Ha',
          surahArabic: 'طه',
          targetWord: 'مُوسَىٰ',
          transliteration: 'Mūsā',
          translation: 'Moses',
          ayahText: 'وَهَلْ أَتَاكَ حَدِيثُ 【مُوسَىٰ】',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/020009.mp3',
          prefix: '—',
          suffix: '—',
          grammarCategory: 'Proper noun'
        }
      ]
    },
    {
      id: 'Ibrhm_ibrahim_pn',
      root: 'brhm',
      rootArabic: 'ب ر ه م',
      word: 'إِبْرَاهِيمُ',
      transliteration: 'Ibrāhīm',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Proper noun',
      meaning: 'Abraham (Prophet & Patriarch)',
      frequency: 69,
      semanticRole: 'Agent',
      examples: ['2:124:2', '2:125:11', '14:35:3'],
      occurrences: [
        {
          location: '2:124:2',
          chapter: 2,
          verse: 124,
          wordNumber: 2,
          surahName: 'Al-Baqarah',
          surahArabic: 'البقرة',
          targetWord: 'إِبْرَاهِيمَ',
          transliteration: 'Ibrāhīma',
          translation: 'Abraham',
          ayahText: 'وَإِذِ ابْتَلَىٰ 【إِبْرَاهِيمَ】 رَبُّهُ بِكَلِمَاتٍ فَأَتَمَّهُنَّ',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002124.mp3',
          prefix: '—',
          suffix: '—',
          grammarCategory: 'Proper noun'
        }
      ]
    }
  ],

  'adjective': [
    {
      id: 'Ezz_aziz_adj',
      root: 'Ezz',
      rootArabic: 'ع ز ز',
      word: 'الْعَزِيزُ',
      transliteration: 'al-‘Azīzu',
      prefix: 'الـ (al-)',
      suffix: '—',
      grammarCategory: 'Adjective',
      meaning: 'The Almighty, All-Mighty, Invulnerable',
      frequency: 99,
      semanticRole: 'Attribute',
      examples: ['2:129:10', '3:6:8', '59:23:13'],
      occurrences: [
        {
          location: '59:23:13',
          chapter: 59,
          verse: 23,
          wordNumber: 13,
          surahName: 'Al-Hashr',
          surahArabic: 'الحشر',
          targetWord: 'الْعَزِيزُ',
          transliteration: 'al-‘Azīzu',
          translation: 'the Exalted in Might',
          ayahText: 'الْمَلِكُ الْقُدُّوسُ السَّلَامُ الْمُؤْمِنُ الْمُهَيْمِنُ 【الْعَزِيزُ】 الْجَبَّارُ',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/059023.mp3',
          prefix: 'الـ (al-)',
          suffix: '—',
          grammarCategory: 'Adjective'
        }
      ]
    },
    {
      id: 'Hkm_hakim_adj',
      root: 'Hkm',
      rootArabic: 'ح ك م',
      word: 'الْحَكِيمُ',
      transliteration: 'al-Ḥakīmu',
      prefix: 'الـ (al-)',
      suffix: '—',
      grammarCategory: 'Adjective',
      meaning: 'The All-Wise, Sagacious',
      frequency: 97,
      semanticRole: 'Attribute',
      examples: ['2:32:10', '3:18:13', '62:1:11'],
      occurrences: [
        {
          location: '2:32:10',
          chapter: 2,
          verse: 32,
          wordNumber: 10,
          surahName: 'Al-Baqarah',
          surahArabic: 'البقرة',
          targetWord: 'الْحَكِيمُ',
          transliteration: 'al-Ḥakīmu',
          translation: 'the Wise',
          ayahText: 'قَالُوا سُبْحَانَكَ لَا عِلْمَ لَنَا إِلَّا مَا عَلَّمْتَنَا إِنَّكَ أَنْتَ الْعَلِيمُ 【الْحَكِيمُ】',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002032.mp3',
          prefix: 'الـ (al-)',
          suffix: '—',
          grammarCategory: 'Adjective'
        }
      ]
    },
    {
      id: 'krm_karim_adj',
      root: 'krm',
      rootArabic: 'ك ر م',
      word: 'كَرِيمٌ',
      transliteration: 'karīmun',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Adjective',
      meaning: 'noble, generous, honorable',
      frequency: 27,
      semanticRole: 'Attribute',
      examples: ['27:40:24', '56:77:2', '82:6:6'],
      occurrences: [
        {
          location: '56:77:2',
          chapter: 56,
          verse: 77,
          wordNumber: 2,
          surahName: 'Al-Waqi‘ah',
          surahArabic: 'الواقعة',
          targetWord: 'كَرِيمٌ',
          transliteration: 'karīmun',
          translation: 'noble',
          ayahText: 'إِنَّهُ لَقُرْآنٌ 【كَرِيمٌ】',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/056077.mp3',
          prefix: '—',
          suffix: '—',
          grammarCategory: 'Adjective'
        }
      ]
    }
  ],

  'noun-place-time': [
    {
      id: 'sjd_masjid_npt',
      root: 'sjd',
      rootArabic: 'س ج د',
      word: 'الْمَسْجِدُ',
      transliteration: 'al-masjidu',
      prefix: 'الـ (al-)',
      suffix: '—',
      grammarCategory: 'Noun of place',
      meaning: 'place of prostration, mosque, sanctuary',
      frequency: 28,
      semanticRole: 'Entity',
      examples: ['2:144:11', '9:17:4', '17:1:8'],
      occurrences: [
        {
          location: '17:1:8',
          chapter: 17,
          verse: 1,
          wordNumber: 8,
          surahName: 'Al-Isra',
          surahArabic: 'الإسراء',
          targetWord: 'الْمَسْجِدِ',
          transliteration: 'al-masjidi',
          translation: 'the Sacred Mosque',
          ayahText: 'سُبْحَانَ الَّذِي أَسْرَىٰ بِعَبْدِهِ لَيْلًا مِنَ 【الْمَسْجِدِ】 الْحَرَامِ إِلَى الْمَسْجِدِ الْأَقْصَى',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/017001.mp3',
          prefix: 'الـ (al-)',
          suffix: '—',
          grammarCategory: 'Noun of place'
        }
      ]
    },
    {
      id: 'qwm_mawqif_npt',
      root: 'qwm',
      rootArabic: 'ق و م',
      word: 'مَقَامُ',
      transliteration: 'maqāmu',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Noun of place',
      meaning: 'station, standing place, position',
      frequency: 14,
      semanticRole: 'Entity',
      examples: ['2:125:8', '3:97:4', '17:79:9'],
      occurrences: [
        {
          location: '2:125:8',
          chapter: 2,
          verse: 125,
          wordNumber: 8,
          surahName: 'Al-Baqarah',
          surahArabic: 'البقرة',
          targetWord: 'مَقَامِ',
          transliteration: 'maqāmi',
          translation: 'the standing place',
          ayahText: 'وَاتَّخِذُوا مِنْ 【مَقَامِ】 إِبْرَاهِيمَ مُصَلًّى',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002125.mp3',
          prefix: '—',
          suffix: '—',
          grammarCategory: 'Noun of place'
        }
      ]
    }
  ],

  'particle': [
    {
      id: 'fy_fi_particle',
      root: 'fy',
      rootArabic: 'ف ي',
      word: 'فِي',
      transliteration: 'fī',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Preposition',
      meaning: 'in, inside, within, concerning',
      frequency: 1701,
      semanticRole: 'Attribute',
      examples: ['2:2:4', '2:27:12', '57:1:4'],
      occurrences: [
        {
          location: '2:2:4',
          chapter: 2,
          verse: 2,
          wordNumber: 4,
          surahName: 'Al-Baqarah',
          surahArabic: 'البقرة',
          targetWord: 'فِيهِ',
          transliteration: 'fīhi',
          translation: 'therein',
          ayahText: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ 【فِيهِ】 هُدًى لِلْمُتَّقِينَ',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002002.mp3',
          prefix: '—',
          suffix: 'ـهِ (-hi)',
          grammarCategory: 'Preposition'
        }
      ]
    },
    {
      id: 'Ely_ala_particle',
      root: 'Ely',
      rootArabic: 'ع ل ى',
      word: 'عَلَىٰ',
      transliteration: '‘alā',
      prefix: '—',
      suffix: '—',
      grammarCategory: 'Preposition',
      meaning: 'upon, on, over, against',
      frequency: 1445,
      semanticRole: 'Attribute',
      examples: ['1:7:2', '2:5:1', '2:20:18'],
      occurrences: [
        {
          location: '2:5:1',
          chapter: 2,
          verse: 5,
          wordNumber: 1,
          surahName: 'Al-Baqarah',
          surahArabic: 'البقرة',
          targetWord: 'عَلَىٰ',
          transliteration: '‘alā',
          translation: 'upon',
          ayahText: 'أُولَٰئِكَ 【عَلَىٰ】 هُدًى مِنْ رَبِّهِمْ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ',
          audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002005.mp3',
          prefix: '—',
          suffix: '—',
          grammarCategory: 'Preposition'
        }
      ]
    }
  ]
};
