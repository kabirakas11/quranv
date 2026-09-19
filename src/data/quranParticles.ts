import type { RootDerivation, WordVariation } from '../types.ts';

export type ParticleCategory =
  | 'preposition'       // حروف الجر
  | 'interjection'      // حروف النداء وأسماء الأفعال
  | 'negative'          // حروف النفي والنهي
  | 'conjunction'       // حروف العطف
  | 'conditional'       // أدوات الشرط
  | 'inna_sister'       // إن وأخواتها (الحروف الناسخة)
  | 'emphasis'          // حروف التوكيد والتحقيق
  | 'interrogative'     // أدوات الاستفهام
  | 'exception'         // أدوات الاستثناء
  | 'futurity'          // حروف الاستقبال
  | 'subjunctive'       // حروف النصب للمضارع
  | 'inceptive';        // حروف الاستفتاح والتنبيه والردع

export interface QuranParticle {
  id: string;
  word: string;
  transliteration: string;
  root?: string;
  rootArabic?: string;
  category: ParticleCategory;
  categoryTitle: string;
  categoryArabic: string;
  meaning: string;
  frequency: number;
  usageRule: string;
  syntacticEffect: string; // What grammatical case or mood it causes (Jarr, Jazm, Nasb, etc.)
  examples: WordVariation[];
}

export const QURAN_PARTICLES: QuranParticle[] = [
  // ==========================================
  // 1. PREPOSITIONS (حُرُوفُ الْجَرِّ)
  // ==========================================
  {
    id: 'prep_min',
    word: 'مِنْ',
    transliteration: 'min',
    category: 'preposition',
    categoryTitle: 'Preposition',
    categoryArabic: 'حرف جر',
    meaning: 'from, of, out of, among, on account of',
    frequency: 3226,
    usageRule: 'Primary preposition of departure and origin. Conveys: 1) ابتداء الغاية (spatial/temporal beginning), 2) التبعيض (partitive "some of"), 3) بيان الجنس (clarification of substance, e.g., "of stone"), 4) السببية (cause/origin).',
    syntacticEffect: 'Governs the subsequent noun or pronoun into the Genitive case (مجرور).',
    examples: [
      {
        location: '2:22:9',
        chapter: 2,
        verse: 22,
        wordNumber: 9,
        surahName: 'Al-Baqarah',
        surahArabic: 'البقرة',
        targetWord: 'مِنَ',
        transliteration: 'mina',
        translation: 'from',
        ayahText: 'وَأَنْزَلَ 【مِنَ】 السَّمَاءِ مَاءً فَأَخْرَجَ بِهِ مِنَ الثَّمَرَاتِ رِزْقًا لَكُمْ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002022.mp3',
        grammarCategory: 'Preposition'
      },
      {
        location: '1:1:1',
        chapter: 2,
        verse: 267,
        wordNumber: 4,
        surahName: 'Al-Baqarah',
        surahArabic: 'البقرة',
        targetWord: 'مِنْ',
        transliteration: 'min',
        translation: 'from',
        ayahText: 'أَنْفِقُوا 【مِنْ】 طَيِّبَاتِ مَا كَسَبْتُمْ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002267.mp3',
        grammarCategory: 'Preposition'
      }
    ]
  },
  {
    id: 'prep_ila',
    word: 'إِلَىٰ',
    transliteration: 'ilā',
    category: 'preposition',
    categoryTitle: 'Preposition',
    categoryArabic: 'حرف جر',
    meaning: 'to, toward, up to, until, into',
    frequency: 742,
    usageRule: 'Preposition of termination and destination. Conveys: 1) انتهاء الغاية المكانية أو الزمانية (spatial or temporal end-point), 2) المعية (together with, e.g., "do not add their wealth to yours").',
    syntacticEffect: 'Governs the subsequent noun into the Genitive case (مجرور).',
    examples: [
      {
        location: '2:43:1',
        chapter: 2,
        verse: 156,
        wordNumber: 7,
        surahName: 'Al-Baqarah',
        surahArabic: 'البقرة',
        targetWord: 'إِلَيْهِ',
        transliteration: 'ilayhi',
        translation: 'to Him',
        ayahText: 'إِنَّا لِلَّهِ وَإِنَّا 【إِلَيْهِ】 رَاجِعُونَ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002156.mp3',
        grammarCategory: 'Preposition'
      },
      {
        location: '17:1:8',
        chapter: 17,
        verse: 1,
        wordNumber: 8,
        surahName: 'Al-Isra',
        surahArabic: 'الإسراء',
        targetWord: 'إِلَى',
        transliteration: 'ilā',
        translation: 'to',
        ayahText: 'سُبْحَانَ الَّذِي أَسْرَىٰ بِعَبْدِهِ لَيْلًا مِّنَ الْمَسْجِدِ الْحَرَامِ 【إِلَى】 الْمَسْجِدِ الْأَقْصَى',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/017001.mp3',
        grammarCategory: 'Preposition'
      }
    ]
  },
  {
    id: 'prep_fi',
    word: 'فِي',
    transliteration: 'fī',
    category: 'preposition',
    categoryTitle: 'Preposition',
    categoryArabic: 'حرف جر',
    meaning: 'in, inside, within, concerning, into',
    frequency: 1701,
    usageRule: 'Preposition of container / containment. Conveys: 1) الظرفية المكانية أو الزمانية (spatial or temporal vessel), 2) السببية (on account of), 3) الاستعلاء (upon, e.g., crucify on palm trunks: فِي جُذُوعِ النَّخْلِ).',
    syntacticEffect: 'Governs the subsequent noun into the Genitive case (مجرور).',
    examples: [
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
        grammarCategory: 'Preposition'
      },
      {
        location: '112:1:1',
        chapter: 20,
        verse: 71,
        wordNumber: 15,
        surahName: 'Taha',
        surahArabic: 'طه',
        targetWord: 'فِي',
        transliteration: 'fī',
        translation: 'on / upon',
        ayahText: 'وَلَأُصَلِّبَنَّكُمْ 【فِي】 جُذُوعِ النَّخْلِ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/020071.mp3',
        grammarCategory: 'Preposition'
      }
    ]
  },
  {
    id: 'prep_ala',
    word: 'عَلَىٰ',
    transliteration: '‘alā',
    category: 'preposition',
    categoryTitle: 'Preposition',
    categoryArabic: 'حرف جر',
    meaning: 'on, upon, against, over, incumbent upon',
    frequency: 1445,
    usageRule: 'Preposition of elevation and duty. Conveys: 1) الاستعلاء الحقيقي أو المجازي (physical or conceptual elevation/dominion), 2) الوجوب والإلزام (moral/legal duty/incumbency), 3) المجاورة والظرفية (over/at).',
    syntacticEffect: 'Governs the subsequent noun into the Genitive case (مجرور).',
    examples: [
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
        grammarCategory: 'Preposition'
      }
    ]
  },
  {
    id: 'prep_an',
    word: 'عَنْ',
    transliteration: '‘an',
    category: 'preposition',
    categoryTitle: 'Preposition',
    categoryArabic: 'حرف جر',
    meaning: 'from, away from, about, concerning, in place of',
    frequency: 465,
    usageRule: 'Preposition of passing beyond and departure. Conveys: 1) المجاوزة والابتعاد (passing beyond/distance), 2) البدل والعوض (substitution / on behalf of, e.g. 2:48), 3) التعليل (reason / about).',
    syntacticEffect: 'Governs the subsequent noun into the Genitive case (مجرور).',
    examples: [
      {
        location: '2:48:4',
        chapter: 2,
        verse: 48,
        wordNumber: 4,
        surahName: 'Al-Baqarah',
        surahArabic: 'البقرة',
        targetWord: 'عَنْ',
        transliteration: '‘an',
        translation: 'for / on behalf of',
        ayahText: 'وَاتَّقُوا يَوْمًا لَا تَجْزِي نَفْسٌ 【عَنْ】 نَفْسٍ شَيْئًا',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002048.mp3',
        grammarCategory: 'Preposition'
      },
      {
        location: '107:5:2',
        chapter: 107,
        verse: 5,
        wordNumber: 2,
        surahName: 'Al-Maun',
        surahArabic: 'الماعون',
        targetWord: 'عَنْ',
        transliteration: '‘an',
        translation: 'of / heedless from',
        ayahText: 'الَّذِينَ هُمْ 【عَنْ】 صَلَاتِهِمْ سَاهُونَ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/107005.mp3',
        grammarCategory: 'Preposition'
      }
    ]
  },
  {
    id: 'prep_bi',
    word: 'بِـ',
    transliteration: 'bi-',
    category: 'preposition',
    categoryTitle: 'Preposition',
    categoryArabic: 'حرف جر',
    meaning: 'with, by, through, in, at, because of',
    frequency: 2150,
    usageRule: 'Inseparable preposition. Conveys: 1) الإلصاق الحقيقي أو المجازي (attachment/adhesion), 2) الاستعانة (instrumentality/means), 3) السببية (cause/agency), 4) التعدية (making intransitive verbs transitive), 5) القسم (oath).',
    syntacticEffect: 'Governs the attached noun into the Genitive case (مجرور).',
    examples: [
      {
        location: '1:1:1',
        chapter: 1,
        verse: 1,
        wordNumber: 1,
        surahName: 'Al-Fatihah',
        surahArabic: 'الفاتحة',
        targetWord: 'بِسْمِ',
        transliteration: 'bismi',
        translation: 'In the name of',
        ayahText: '【بِسْمِ】 اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001001.mp3',
        grammarCategory: 'Preposition'
      },
      {
        location: '2:20:7',
        chapter: 2,
        verse: 20,
        wordNumber: 7,
        surahName: 'Al-Baqarah',
        surahArabic: 'البقرة',
        targetWord: 'بِسَمْعِهِمْ',
        transliteration: 'bi-sam‘ihim',
        translation: 'their hearing',
        ayahText: 'وَلَوْ شَاءَ اللَّهُ لَذَهَبَ 【بِسَمْعِهِمْ】 وَأَبْصَارِهِمْ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002020.mp3',
        grammarCategory: 'Preposition'
      }
    ]
  },
  {
    id: 'prep_li',
    word: 'لِـ',
    transliteration: 'li-',
    category: 'preposition',
    categoryTitle: 'Preposition',
    categoryArabic: 'حرف جر',
    meaning: 'for, to, belonging to, because of, in order to',
    frequency: 2640,
    usageRule: 'Inseparable preposition. Conveys: 1) الملك والاختصاص والاستحقاق (ownership, specificity, entitlement: "To Allah belongs..."), 2) التعليل والغرض (causation/purpose: لام التعليل), 3) انتهاء الغاية.',
    syntacticEffect: 'Governs nouns into Genitive (مجرور), or precedes imperfect verbs with implicit أَنْ to cause Subjunctive (منصوب).',
    examples: [
      {
        location: '1:2:1',
        chapter: 1,
        verse: 2,
        wordNumber: 1,
        surahName: 'Al-Fatihah',
        surahArabic: 'الفاتحة',
        targetWord: 'لِلَّهِ',
        transliteration: 'lillāhi',
        translation: '[be] to Allah',
        ayahText: 'الْحَمْدُ 【لِلَّهِ】 رَبِّ الْعَالَمِينَ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001002.mp3',
        grammarCategory: 'Preposition'
      }
    ]
  },
  {
    id: 'prep_ka',
    word: 'كَـ',
    transliteration: 'ka-',
    category: 'preposition',
    categoryTitle: 'Preposition',
    categoryArabic: 'حرف جر',
    meaning: 'like, as, resembling',
    frequency: 385,
    usageRule: 'Inseparable preposition of analogy and resemblance (التشبيه). Occasionally functions for absolute emphasis (التأكيد والزيادة, as in لَيْسَ كَمِثْلِهِ شَيْءٌ in Surah Ash-Shura 42:11).',
    syntacticEffect: 'Governs the attached noun into the Genitive case (مجرور).',
    examples: [
      {
        location: '42:11:10',
        chapter: 42,
        verse: 11,
        wordNumber: 10,
        surahName: 'Ash-Shura',
        surahArabic: 'الشورى',
        targetWord: 'كَمِثْلِهِ',
        transliteration: 'ka-mithlihi',
        translation: 'like unto Him',
        ayahText: 'لَيْسَ 【كَمِثْلِهِ】 شَيْءٌ ۖ وَهُوَ السَّمِيعُ الْبَصِيرُ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/042011.mp3',
        grammarCategory: 'Preposition'
      },
      {
        location: '2:17:2',
        chapter: 2,
        verse: 17,
        wordNumber: 2,
        surahName: 'Al-Baqarah',
        surahArabic: 'البقرة',
        targetWord: 'كَمَثَلِ',
        transliteration: 'ka-mathali',
        translation: 'is like the example',
        ayahText: 'مَثَلُهُمْ 【كَمَثَلِ】 الَّذِي اسْتَوْقَدَ نَارًا',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002017.mp3',
        grammarCategory: 'Preposition'
      }
    ]
  },
  {
    id: 'prep_hatta',
    word: 'حَتَّىٰ',
    transliteration: 'ḥattā',
    category: 'preposition',
    categoryTitle: 'Preposition',
    categoryArabic: 'حرف جر وغاية',
    meaning: 'until, up to, as far as, so that',
    frequency: 142,
    usageRule: 'Preposition indicating the ultimate temporal or spatial destination (انتهاء الغاية). Can govern a noun directly in the genitive, or precede a subjunctive clause via hidden أَنْ.',
    syntacticEffect: 'Governs genitive case (مجرور) when followed directly by a noun.',
    examples: [
      {
        location: '97:5:4',
        chapter: 97,
        verse: 5,
        wordNumber: 4,
        surahName: 'Al-Qadr',
        surahArabic: 'القدر',
        targetWord: 'حَتَّىٰ',
        transliteration: 'ḥattā',
        translation: 'until',
        ayahText: 'سَلَامٌ هِيَ 【حَتَّىٰ】 مَطْلَعِ الْفَجْرِ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/097005.mp3',
        grammarCategory: 'Preposition'
      }
    ]
  },
  {
    id: 'prep_waw_qasam',
    word: 'وَ (وَاوُ الْقَسَمِ)',
    transliteration: 'wa- (al-qasam)',
    category: 'preposition',
    categoryTitle: 'Preposition',
    categoryArabic: 'حرف جر وقسم',
    meaning: 'By... (particle of divine oath)',
    frequency: 120,
    usageRule: 'Preposition used exclusively for oaths (القسم). Precedes solemn declarations swearing by cosmic phenomena, scripture, or divine signs.',
    syntacticEffect: 'Governs the sworn entity into the Genitive case (مجرور).',
    examples: [
      {
        location: '103:1:1',
        chapter: 103,
        verse: 1,
        wordNumber: 1,
        surahName: 'Al-Asr',
        surahArabic: 'العصر',
        targetWord: 'وَالْعَصْرِ',
        transliteration: 'wal-‘aṣr',
        translation: 'By time',
        ayahText: '【وَالْعَصْرِ】 * إِنَّ الْإِنسَانَ لَفِي خُسْرٍ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/103001.mp3',
        grammarCategory: 'Preposition'
      },
      {
        location: '95:1:1',
        chapter: 95,
        verse: 1,
        wordNumber: 1,
        surahName: 'At-Tin',
        surahArabic: 'التين',
        targetWord: 'وَالتِّينِ',
        transliteration: 'wat-tīn',
        translation: 'By the fig',
        ayahText: '【وَالتِّينِ】 وَالزَّيْتُونِ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/095001.mp3',
        grammarCategory: 'Preposition'
      }
    ]
  },
  {
    id: 'prep_ta_qasam',
    word: 'تَـ (تَاءُ الْقَسَمِ)',
    transliteration: 'ta- (Allāhi)',
    category: 'preposition',
    categoryTitle: 'Preposition',
    categoryArabic: 'حرف جر وقسم',
    meaning: 'By Allah! (solemn oath restricted to the divine name)',
    frequency: 9,
    usageRule: 'Rare and solemn preposition of oath applied exclusively to the sacred name of Allah (تَاللَّهِ). Conveys strong wonder, conviction, and decisive certainty.',
    syntacticEffect: 'Governs "Allāh" in the Genitive case (تَاللَّهِ).',
    examples: [
      {
        location: '12:73:2',
        chapter: 12,
        verse: 73,
        wordNumber: 2,
        surahName: 'Yusuf',
        surahArabic: 'يوسف',
        targetWord: 'تَاللَّهِ',
        transliteration: 'ta-Allāhi',
        translation: 'By Allah',
        ayahText: 'قَالُوا 【تَاللَّهِ】 لَقَدْ عَلِمْتُم مَّا جِئْنَا لِنُفْسِدَ فِي الْأَرْضِ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/012073.mp3',
        grammarCategory: 'Preposition'
      },
      {
        location: '21:57:1',
        chapter: 21,
        verse: 57,
        wordNumber: 1,
        surahName: 'Al-Anbiya',
        surahArabic: 'الأنبياء',
        targetWord: 'وَتَاللَّهِ',
        transliteration: 'wa-ta-Allāhi',
        translation: 'And by Allah',
        ayahText: '【وَتَاللَّهِ】 لَأَكِيدَنَّ أَصْنَامَكُم بَعْدَ أَن تُوَلُّوا مُدْبِرِينَ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/021057.mp3',
        grammarCategory: 'Preposition'
      }
    ]
  },
  {
    id: 'prep_rubama',
    word: 'رُبَّ / رُبَمَا',
    transliteration: 'rubba / rubamā',
    category: 'preposition',
    categoryTitle: 'Preposition',
    categoryArabic: 'حرف شبيه بالزائد',
    meaning: 'perhaps, many a time, often, sometimes',
    frequency: 1,
    usageRule: 'Quasi-preposition (حرف شبيه بالزائد) conveying either frequency (التكثير) or rarity (التقليل). When coupled with the preventing particle مَا (الكافة), it precedes verbal sentences.',
    syntacticEffect: 'Precedes verbal sentences when attached to "mā" without changing case (كافة ومكفوفة).',
    examples: [
      {
        location: '15:2:1',
        chapter: 15,
        verse: 2,
        wordNumber: 1,
        surahName: 'Al-Hijr',
        surahArabic: 'الحجر',
        targetWord: 'رُّبَمَا',
        transliteration: 'rubamā',
        translation: 'Perhaps',
        ayahText: '【رُّبَمَا】 يَوَدُّ الَّذِينَ كَفَرُوا لَوْ كَانُوا مُسْلِمِينَ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/015002.mp3',
        grammarCategory: 'Preposition'
      }
    ]
  },
  {
    id: 'prep_hasha',
    word: 'حَاشَا',
    transliteration: 'ḥāshā',
    category: 'preposition',
    categoryTitle: 'Preposition / Particle of Exoneration',
    categoryArabic: 'حرف تنزيه وبراءة',
    meaning: 'far be it from, God forbid, immaculate purity',
    frequency: 2,
    usageRule: 'Particle of exemption and divine veneration/exoneration (التنزيه والبراءة), sanctifying someone utterly from any trace of sin or defect.',
    syntacticEffect: 'Functions as preposition governing genitive, or verbal particle of praise.',
    examples: [
      {
        location: '12:31:26',
        chapter: 12,
        verse: 31,
        wordNumber: 26,
        surahName: 'Yusuf',
        surahArabic: 'يوسف',
        targetWord: 'حَاشَ',
        transliteration: 'ḥāsha',
        translation: 'God forbid! / Perfect is Allah!',
        ayahText: 'وَقُلْنَ 【حَاشَ】 لِلَّهِ مَا هَٰذَا بَشَرًا إِنْ هَٰذَا إِلَّا مَلَكٌ كَرِيمٌ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/012031.mp3',
        grammarCategory: 'Preposition'
      }
    ]
  },

  // ==========================================
  // 2. INTERJECTIONS & VOCATIVES & VERBAL NOUNS (حُرُوفُ النِّدَاءِ وَأَسْمَاءُ الْأَفْعَالِ)
  // ==========================================
  {
    id: 'interj_ya',
    word: 'يَا',
    transliteration: 'yā',
    category: 'interjection',
    categoryTitle: 'Vocative Interjection',
    categoryArabic: 'حرف نداء',
    meaning: 'O...! Oh...! (vocative call / exclamation)',
    frequency: 361,
    usageRule: 'Primary vocative particle of Arabic grammar (أمّ الباب في النداء). Used for calling near or distant addressees (e.g. يَا رَبِّ, يَا قَوْمِ). Can also be prefixed to exclamative particles (e.g. يَا لَيْتَنِي).',
    syntacticEffect: 'Places single definite nouns on ḍammah (مبني على الضم في محل نصب), and mudaf nouns into accusative (منصوب).',
    examples: [
      {
        location: '2:21:1',
        chapter: 2,
        verse: 21,
        wordNumber: 1,
        surahName: 'Al-Baqarah',
        surahArabic: 'البقرة',
        targetWord: 'يَا',
        transliteration: 'yā',
        translation: 'O',
        ayahText: '【يَا】 أَيُّهَا النَّاسُ اعْبُدُوا رَبَّكُمُ الَّذِي خَلَقَكُمْ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002021.mp3',
        grammarCategory: 'Interjection'
      },
      {
        location: '89:27:1',
        chapter: 89,
        verse: 27,
        wordNumber: 1,
        surahName: 'Al-Fajr',
        surahArabic: 'الفجر',
        targetWord: 'يَا',
        transliteration: 'yā',
        translation: 'O',
        ayahText: '【يَا】 أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ * ارْجِعِي إِلَىٰ رَبِّكِ رَاضِيَةً مَّرْضِيَّةً',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/089027.mp3',
        grammarCategory: 'Interjection'
      }
    ]
  },
  {
    id: 'interj_ayyuhan',
    word: 'أَيُّهَا / أَيَّتُهَا',
    transliteration: 'ayyuhā / ayyatuhā',
    category: 'interjection',
    categoryTitle: 'Vocative Particle',
    categoryArabic: 'وصلة النداء والتنبيه',
    meaning: 'O you who...! O...! (vocative liaison)',
    frequency: 153,
    usageRule: 'Compound vocative intermediary (أيّ + هَا التنبيه). Used to smoothly address nouns bearing the definite article (الـ), which cannot follow يَا directly.',
    syntacticEffect: 'أَيُّ is مبني على الضم في محل نصب منادى, and the following noun acts as badal or na‘t (مرفوع).',
    examples: [
      {
        location: '2:153:1',
        chapter: 2,
        verse: 153,
        wordNumber: 2,
        surahName: 'Al-Baqarah',
        surahArabic: 'البقرة',
        targetWord: 'أَيُّهَا',
        transliteration: 'ayyuhā',
        translation: 'you who',
        ayahText: 'يَا 【أَيُّهَا】 الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002153.mp3',
        grammarCategory: 'Interjection'
      }
    ]
  },
  {
    id: 'interj_hayhat',
    word: 'هَيْهَاتَ',
    transliteration: 'hayhāta',
    category: 'interjection',
    categoryTitle: 'Verbal Noun Interjection',
    categoryArabic: 'اسم فعل ماضٍ',
    meaning: 'How far! / Far, far away is...! / Utterly impossible!',
    frequency: 2,
    usageRule: 'Verbal interjection acting as past-tense verb meaning "بَعُدَ جِدًّا" (it is extremely far-fetched and impossible to occur). Repeated in Surah Al-Mu’minun for intense dramatic emphasis.',
    syntacticEffect: 'اسم فعل ماض مبني على الفتح لا محل له من الإعراب, raises a doer (فاعل) directly or through an explicative lām.',
    examples: [
      {
        location: '23:36:1',
        chapter: 23,
        verse: 36,
        wordNumber: 1,
        surahName: 'Al-Mu’minun',
        surahArabic: 'المؤمنون',
        targetWord: 'هَيْهَاتَ هَيْهَاتَ',
        transliteration: 'hayhāta hayhāt',
        translation: 'Far, far away',
        ayahText: '【هَيْهَاتَ هَيْهَاتَ】 لِمَا تُوعَدُونَ * إِنْ هِيَ إِلَّا حَيَاتُنَا الدُّنْيَا',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/023036.mp3',
        grammarCategory: 'Interjection'
      }
    ]
  },
  {
    id: 'interj_hayta',
    word: 'هَيْتَ لَكَ',
    transliteration: 'hayta laka',
    category: 'interjection',
    categoryTitle: 'Verbal Imperative Interjection',
    categoryArabic: 'اسم فعل أمر',
    meaning: 'Come hither! / I am ready for you! / Come forward!',
    frequency: 1,
    usageRule: 'Verbal interjection functioning as an urgent command meaning "هَلُمَّ / أَقْبِلْ" (come to me immediately). Uttered by the Governor\'s wife to Prophet Yusuf.',
    syntacticEffect: 'اسم فعل أمر مبني على الفتح, containing an implicit subject (أنت).',
    examples: [
      {
        location: '12:23:10',
        chapter: 12,
        verse: 23,
        wordNumber: 10,
        surahName: 'Yusuf',
        surahArabic: 'يوسف',
        targetWord: 'هَيْتَ لَكَ',
        transliteration: 'hayta laka',
        translation: 'Come on! / I am ready for you!',
        ayahText: 'وَغَلَّقَتِ الْأَبْوَابَ وَقَالَتْ 【هَيْتَ لَكَ】 ۚ قَالَ مَعَاذَ اللَّهِ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/012023.mp3',
        grammarCategory: 'Interjection'
      }
    ]
  },
  {
    id: 'interj_uff',
    word: 'أُفٍّ',
    transliteration: 'uffin',
    category: 'interjection',
    categoryTitle: 'Interjection of Disgust / Vexation',
    categoryArabic: 'اسم فعل مضارع',
    meaning: 'Fie! / Uff! / Sigh of disdain, exasperation, or disrespect',
    frequency: 3,
    usageRule: 'Verbal interjection of present tense meaning "أَتَضَجَّرُ" (I express exasperation / irritation). The Quran forbids even breathing this minuscule sound of contempt toward parents.',
    syntacticEffect: 'اسم فعل مضارع مبني على الكسر مع التنوين لا محل له من الإعراب.',
    examples: [
      {
        location: '17:23:16',
        chapter: 17,
        verse: 23,
        wordNumber: 16,
        surahName: 'Al-Isra',
        surahArabic: 'الإسراء',
        targetWord: 'أُفٍّ',
        transliteration: 'uffin',
        translation: 'a word of irritation (Uff)',
        ayahText: 'إِمَّا يَبْلُغَنَّ عِندَكَ الْكِبَرَ أَحَدُهُمَا أَوْ كِلَاهُمَا فَلَا تَقُل لَّهُمَا 【أُفٍّ】 وَلَا تَنْهَرْهُمَا',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/017023.mp3',
        grammarCategory: 'Interjection'
      },
      {
        location: '21:67:1',
        chapter: 21,
        verse: 67,
        wordNumber: 1,
        surahName: 'Al-Anbiya',
        surahArabic: 'الأنبياء',
        targetWord: 'أُفٍّ',
        transliteration: 'uffin',
        translation: 'Fie upon you',
        ayahText: '【أُفٍّ】 لَّكُمْ وَلِمَا تَعْبُدُونَ مِن دُونِ اللَّهِ ۖ أَفَلَا تَعْقِلُونَ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/021067.mp3',
        grammarCategory: 'Interjection'
      }
    ]
  },
  {
    id: 'interj_way',
    word: 'وَيْ / وَيْكَأَنَّ',
    transliteration: 'way / wayka’anna',
    category: 'interjection',
    categoryTitle: 'Interjection of Wonder & Awe',
    categoryArabic: 'اسم فعل تعجب وتنبيه',
    meaning: 'Ah! / Lo! / Woe! / Know well that... / Remarkable is...',
    frequency: 2,
    usageRule: 'Exclamative composite interjection conveying amazement paired with sobering realization (التعجب والتنبه). Spoken by Qarun\'s people when observing his sudden ruin.',
    syntacticEffect: 'اسم فعل تعجب مبني على السكون, and كَأَنَّ introduces a following nominal clause.',
    examples: [
      {
        location: '28:82:10',
        chapter: 28,
        verse: 82,
        wordNumber: 10,
        surahName: 'Al-Qasas',
        surahArabic: 'القصص',
        targetWord: 'وَيْكَأَنَّ',
        transliteration: 'way-ka’anna',
        translation: 'Ah! / Do you not see that...',
        ayahText: 'يَقُولُونَ 【وَيْكَأَنَّ】 اللَّهَ يَبْسُطُ الرِّزْقَ لِمَن يَشَاءُ مِنْ عِبَادِهِ وَيَقْدِرُ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/028082.mp3',
        grammarCategory: 'Interjection'
      }
    ]
  },
  {
    id: 'interj_haumu',
    word: 'هَاؤُمُ',
    transliteration: 'hā’umu',
    category: 'interjection',
    categoryTitle: 'Verbal Imperative Interjection',
    categoryArabic: 'اسم فعل أمر',
    meaning: 'Here! Take ye! Come, read!',
    frequency: 1,
    usageRule: 'Verbal imperative interjection meaning "خُذُوا وَتَعَالَوْا" (take hold of and come look!). Exclaimed on the Day of Judgment by the triumphant believer receiving the record in the right hand.',
    syntacticEffect: 'اسم فعل أمر مبني على الضم لاتصاله بميم الجمع لا محل له من الإعراب.',
    examples: [
      {
        location: '69:19:6',
        chapter: 69,
        verse: 19,
        wordNumber: 6,
        surahName: 'Al-Haqqah',
        surahArabic: 'الحاقة',
        targetWord: 'هَاؤُمُ',
        transliteration: 'hā’umu',
        translation: 'Here! / Take you!',
        ayahText: 'فَأَمَّا مَنْ أُوتِيَ كِتَابَهُ بِيَمِينِهِ فَيَقُولُ 【هَاؤُمُ】 اقْرَءُوا كِتَابِيَهْ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/069019.mp3',
        grammarCategory: 'Interjection'
      }
    ]
  },
  {
    id: 'interj_layta',
    word: 'لَيْتَ / يَا لَيْتَنِي',
    transliteration: 'layta / yā laytanī',
    category: 'interjection',
    categoryTitle: 'Particle of Yearning & Lament',
    categoryArabic: 'حرف تمنٍّ ونصب',
    meaning: 'Oh, would that I...! / If only...! / I wish that...',
    frequency: 14,
    usageRule: 'Particle of passionate yearning and regret (التمني), wishing for an impossible or irrevocably lost circumstance. Often conjoined with the vocative interjection (يَا لَيْتَنِي).',
    syntacticEffect: 'Part of Inna sisters: makes noun accusative (تنصب الاسم وترفع الخبر).',
    examples: [
      {
        location: '78:40:17',
        chapter: 78,
        verse: 40,
        wordNumber: 17,
        surahName: 'An-Naba',
        surahArabic: 'النبأ',
        targetWord: 'يَا لَيْتَنِي',
        transliteration: 'yā laytanī',
        translation: 'Oh, I wish that I',
        ayahText: 'وَيَقُولُ الْكَافِرُ 【يَا لَيْتَنِي】 كُنتُ تُرَابًا',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/078040.mp3',
        grammarCategory: 'Interjection'
      },
      {
        location: '25:27:7',
        chapter: 25,
        verse: 27,
        wordNumber: 7,
        surahName: 'Al-Furqan',
        surahArabic: 'الفرقان',
        targetWord: 'يَا لَيْتَنِي',
        transliteration: 'yā laytanī',
        translation: 'Oh, would that I had',
        ayahText: 'يَوْمَ يَعَضُّ الظَّالِمُ عَلَىٰ يَدَيْهِ يَقُولُ 【يَا لَيْتَنِي】 اتَّخَذْتُ مَعَ الرَّسُولِ سَبِيلًا',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/025027.mp3',
        grammarCategory: 'Interjection'
      }
    ]
  },
  {
    id: 'interj_kalla',
    word: 'كَلَّا',
    transliteration: 'kallā',
    category: 'interjection',
    categoryTitle: 'Particle of Deterrence & Rebuke',
    categoryArabic: 'حرف ردع وزجر',
    meaning: 'Nay! Never! By no means! Most certainly not!',
    frequency: 33,
    usageRule: 'Forceful particle of deterrence, reprimand, and categorical rebuttal (الردع والزجر). Rejects the invalid pretenses of the disbelievers and establishes undisputed reality.',
    syntacticEffect: 'حرف ردع وزجر مبني على السكون لا محل له من الإعراب.',
    examples: [
      {
        location: '102:3:1',
        chapter: 102,
        verse: 3,
        wordNumber: 1,
        surahName: 'At-Takathur',
        surahArabic: 'التكاثر',
        targetWord: 'كَلَّا',
        transliteration: 'kallā',
        translation: 'No! / By no means!',
        ayahText: '【كَلَّا】 سَوْفَ تَعْلَمُونَ * ثُمَّ كَلَّا سَوْفَ تَعْلَمُونَ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/102003.mp3',
        grammarCategory: 'Interjection'
      },
      {
        location: '96:6:1',
        chapter: 96,
        verse: 6,
        wordNumber: 1,
        surahName: 'Al-Alaq',
        surahArabic: 'العلق',
        targetWord: 'كَلَّا',
        transliteration: 'kallā',
        translation: 'Nay!',
        ayahText: '【كَلَّا】 إِنَّ الْإِنسَانَ لَيَطْغَىٰ * أَن رَّآهُ اسْتَغْنَىٰ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/096006.mp3',
        grammarCategory: 'Interjection'
      }
    ]
  },
  {
    id: 'interj_bala',
    word: 'بَلَىٰ',
    transliteration: 'balā',
    category: 'interjection',
    categoryTitle: 'Affirmative Response Particle',
    categoryArabic: 'حرف جواب وإيجاب',
    meaning: 'Yes indeed! / Nay, but on the contrary! / Yea, surely!',
    frequency: 22,
    usageRule: 'Affirmative answer particle used specifically to negate a negative question or proposition (إبطال النفي وتحقيق ضده), vigorously affirming the positive reality.',
    syntacticEffect: 'حرف جواب مبني على السكون لا محل له من الإعراب.',
    examples: [
      {
        location: '7:172:14',
        chapter: 7,
        verse: 172,
        wordNumber: 14,
        surahName: 'Al-A’raf',
        surahArabic: 'الأعراف',
        targetWord: 'بَلَىٰ',
        transliteration: 'balā',
        translation: 'Yes indeed!',
        ayahText: 'أَلَسْتُ بِرَبِّكُمْ ۖ قَالُوا 【بَلَىٰ】 ۛ شَهِدْنَا',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/007172.mp3',
        grammarCategory: 'Interjection'
      },
      {
        location: '67:9:2',
        chapter: 67,
        verse: 9,
        wordNumber: 2,
        surahName: 'Al-Mulk',
        surahArabic: 'الملك',
        targetWord: 'بَلَىٰ',
        transliteration: 'balā',
        translation: 'Yes indeed',
        ayahText: 'قَالُوا 【بَلَىٰ】 قَدْ جَاءَنَا نَذِيرٌ فَكَذَّبْنَا',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/067009.mp3',
        grammarCategory: 'Interjection'
      }
    ]
  },
  {
    id: 'interj_ala',
    word: 'أَلَا',
    transliteration: 'alā',
    category: 'interjection',
    categoryTitle: 'Inceptive Particle of Awakening',
    categoryArabic: 'حرف استفتاح وتنبيه',
    meaning: 'Hearken! / Verily! / Unquestionably! / Lo! / Behold!',
    frequency: 140,
    usageRule: 'Opening interjection of alert and awakening (الاستفتاح والتنبيه). Positioned at the inauguration of a statement to command rapt, undivided attention from the listener.',
    syntacticEffect: 'حرف استفتاح وتنبيه مبني على السكون لا محل له من الإعراب.',
    examples: [
      {
        location: '10:62:1',
        chapter: 10,
        verse: 62,
        wordNumber: 1,
        surahName: 'Yunus',
        surahArabic: 'يونس',
        targetWord: 'أَلَا',
        transliteration: 'alā',
        translation: 'Unquestionably!',
        ayahText: '【أَلَا】 إِنَّ أَوْلِيَاءَ اللَّهِ لَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/010062.mp3',
        grammarCategory: 'Interjection'
      },
      {
        location: '2:13:1',
        chapter: 2,
        verse: 13,
        wordNumber: 13,
        surahName: 'Al-Baqarah',
        surahArabic: 'البقرة',
        targetWord: 'أَلَا',
        transliteration: 'alā',
        translation: 'Unquestionably',
        ayahText: '【أَلَا】 إِنَّهُمْ هُمُ السُّفَهَاءُ وَلَٰكِن لَّا يَعْلَمُونَ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002013.mp3',
        grammarCategory: 'Interjection'
      }
    ]
  },

  // ==========================================
  // 3. NEGATIVE & PROHIBITIVE PARTICLES (حُرُوفُ النَّفْيِ وَالنَّهْيِ)
  // ==========================================
  {
    id: 'part_ma_nafiyah',
    word: 'مَا (النَّافِيَة)',
    transliteration: 'mā (al-nāfiyah)',
    category: 'negative',
    categoryTitle: 'Negative Particle',
    categoryArabic: 'حرف نفي',
    meaning: 'not, no, neither',
    frequency: 850,
    usageRule: 'Primary particle of negation. Enters upon past verbs (مَا كَانَ), present verbs (مَا يَعْلَمُونَ), or nominal sentences acting as Mā of Hijaz (ما الحجازية العاملة عمل ليس).',
    syntacticEffect: 'Negates without inflection, or raises subject and makes predicate accusative (عمل ليس).',
    examples: [
      {
        location: '2:102:14',
        chapter: 2,
        verse: 102,
        wordNumber: 14,
        surahName: 'Al-Baqarah',
        surahArabic: 'البقرة',
        targetWord: 'وَمَا',
        transliteration: 'wa-mā',
        translation: 'and not did',
        ayahText: '【وَمَا】 كَفَرَ سُلَيْمَانُ وَلَٰكِنَّ الشَّيَاطِينَ كَفَرُوا',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002102.mp3',
        grammarCategory: 'Negative Particle'
      }
    ]
  },
  {
    id: 'part_la_nafiyah',
    word: 'لَا (النَّافِيَة)',
    transliteration: 'lā (al-nāfiyah)',
    category: 'negative',
    categoryTitle: 'Negative Particle',
    categoryArabic: 'حرف نفي',
    meaning: 'not, no, there is no',
    frequency: 812,
    usageRule: 'General negative particle for present verbs (negating habitual or future action), or negating an entire genus (لا النافية للجنس) as in the Shahadah.',
    syntacticEffect: 'No effect on regular verbs (imperfect remains مرفوع), or makes indefinite singular noun مبني على الفتح (لا إله إلا الله).',
    examples: [
      {
        location: '2:255:4',
        chapter: 2,
        verse: 255,
        wordNumber: 4,
        surahName: 'Al-Baqarah',
        surahArabic: 'البقرة',
        targetWord: 'لَا إِلَٰهَ',
        transliteration: 'lā ilāha',
        translation: 'there is no deity',
        ayahText: 'اللَّهُ 【لَا إِلَٰهَ】 إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002255.mp3',
        grammarCategory: 'Negative Particle'
      }
    ]
  },
  {
    id: 'part_lam',
    word: 'لَمْ',
    transliteration: 'lam',
    category: 'negative',
    categoryTitle: 'Jussive Negative Particle',
    categoryArabic: 'حرف نفي وجزم وقلب',
    meaning: 'did not, had not (past negation of imperfect verb)',
    frequency: 380,
    usageRule: 'Tri-functional particle: 1) نفي (negates), 2) جزم (forces jussive mood), 3) قلب (flips temporal meaning of present tense into the past).',
    syntacticEffect: 'Governs the imperfect verb into the Jussive mood (مجزوم).',
    examples: [
      {
        location: '112:3:1',
        chapter: 112,
        verse: 3,
        wordNumber: 1,
        surahName: 'Al-Ikhlas',
        surahArabic: 'الإخلاص',
        targetWord: 'لَمْ يَلِدْ',
        transliteration: 'lam yalid',
        translation: 'He neither begets',
        ayahText: '【لَمْ يَلِدْ】 وَلَمْ يُولَدْ * وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/112003.mp3',
        grammarCategory: 'Negative Particle'
      }
    ]
  },
  {
    id: 'part_lan',
    word: 'لَنْ',
    transliteration: 'lan',
    category: 'negative',
    categoryTitle: 'Subjunctive Negative Particle',
    categoryArabic: 'حرف نفي ونصب واستقبال',
    meaning: 'will never, will not (emphatic future negation)',
    frequency: 106,
    usageRule: 'Emphatic futurity negator. Enters upon imperfect verbs to assert that the action will decidedly not transpire in the future (لتأكيد نفي المستقبل).',
    syntacticEffect: 'Governs the imperfect verb into the Subjunctive mood (منصوب بالفتحة).',
    examples: [
      {
        location: '3:92:1',
        chapter: 3,
        verse: 92,
        wordNumber: 1,
        surahName: 'Ali ‘Imran',
        surahArabic: 'آل عمران',
        targetWord: 'لَن تَنَالُوا',
        transliteration: 'lan tanālū',
        translation: 'Never will you attain',
        ayahText: '【لَن تَنَالُوا】 الْبِرَّ حَتَّىٰ تُنفِقُوا مِمَّا تُحِبُّونَ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/003092.mp3',
        grammarCategory: 'Negative Particle'
      },
      {
        location: '2:24:2',
        chapter: 2,
        verse: 24,
        wordNumber: 2,
        surahName: 'Al-Baqarah',
        surahArabic: 'البقرة',
        targetWord: 'وَلَن تَفْعَلُوا',
        transliteration: 'wa-lan taf‘alū',
        translation: 'and never will you be able to',
        ayahText: 'فَإِن لَّمْ تَفْعَلُوا 【وَلَن تَفْعَلُوا】 فَاتَّقُوا النَّارَ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002024.mp3',
        grammarCategory: 'Negative Particle'
      }
    ]
  },
  {
    id: 'part_lamma_jazimah',
    word: 'لَمَّا (الْجَازِمَة)',
    transliteration: 'lammā (al-jāzimah)',
    category: 'negative',
    categoryTitle: 'Jussive Particle of Anticipated Negation',
    categoryArabic: 'حرف نفي وجزم وقلب لتوقع الثبوت',
    meaning: 'not yet (negates action expecting its future occurrence)',
    frequency: 16,
    usageRule: 'Similar to لَمْ, but specifically carries the meaning "not yet" up to the present moment with anticipation that it will happen later (نفي مستمر مع توقع الحصول).',
    syntacticEffect: 'Governs the imperfect verb into the Jussive mood (مجزوم).',
    examples: [
      {
        location: '49:14:11',
        chapter: 49,
        verse: 14,
        wordNumber: 11,
        surahName: 'Al-Hujurat',
        surahArabic: 'الحجرات',
        targetWord: 'وَلَمَّا يَدْخُلِ',
        transliteration: 'wa-lammā yadkhul',
        translation: 'for has not yet entered',
        ayahText: 'قُولُوا أَسْلَمْنَا 【وَلَمَّا يَدْخُلِ】 الْإِيمَانُ فِي قُلُوبِكُمْ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/049014.mp3',
        grammarCategory: 'Negative Particle'
      }
    ]
  },
  {
    id: 'part_la_nahiyah',
    word: 'لَا (النَّاهِيَة)',
    transliteration: 'lā (al-nāhiyah)',
    category: 'negative',
    categoryTitle: 'Prohibitive Particle',
    categoryArabic: 'حرف نهي وجزم',
    meaning: 'Do not...! (prohibitive command of cessation)',
    frequency: 410,
    usageRule: 'Prohibitive command particle demanding that an action not be performed. Directly addresses the 2nd person (or 3rd person) with jussive verbal form.',
    syntacticEffect: 'Governs the imperfect verb into the Jussive mood (مجزوم بالسكون أو بحذف النون/حرف العلة).',
    examples: [
      {
        location: '9:40:10',
        chapter: 9,
        verse: 40,
        wordNumber: 10,
        surahName: 'At-Tawbah',
        surahArabic: 'التوبة',
        targetWord: 'لَا تَحْزَنْ',
        transliteration: 'lā taḥzan',
        translation: 'Do not grieve',
        ayahText: 'إِذْ يَقُولُ لِصَاحِبِهِ 【لَا تَحْزَنْ】 إِنَّ اللَّهَ مَعَنَا',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/009040.mp3',
        grammarCategory: 'Prohibitive Particle'
      },
      {
        location: '31:13:8',
        chapter: 31,
        verse: 13,
        wordNumber: 8,
        surahName: 'Luqman',
        surahArabic: 'لقمان',
        targetWord: 'لَا تُشْرِكْ',
        transliteration: 'lā tushrik',
        translation: 'do not associate [anything]',
        ayahText: 'يَا بُنَيَّ 【لَا تُشْرِكْ】 بِاللَّهِ ۖ إِنَّ الشِّرْكَ لَظُلْمٌ عَظِيمٌ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/031013.mp3',
        grammarCategory: 'Prohibitive Particle'
      }
    ]
  },

  // ==========================================
  // 4. CONJUNCTIONS (حُرُوفُ الْعَطْفِ)
  // ==========================================
  {
    id: 'conj_waw',
    word: 'وَ (وَاوُ الْعَطْفِ)',
    transliteration: 'wa- (al-‘aṭf)',
    category: 'conjunction',
    categoryTitle: 'Conjunction',
    categoryArabic: 'حرف عطف',
    meaning: 'and (absolute pairing / association)',
    frequency: 9200,
    usageRule: 'Most frequent coordinator in Arabic. Denotes absolute association and joining (لمطلق الجمع) without necessarily imposing chronological sequence or delay.',
    syntacticEffect: 'Causes the conjoined word (المعطوف) to follow the grammatical case of the antecedent (المعطوف عليه).',
    examples: [
      {
        location: '1:1:1',
        chapter: 2,
        verse: 3,
        wordNumber: 2,
        surahName: 'Al-Baqarah',
        surahArabic: 'البقرة',
        targetWord: 'وَيُقِيمُونَ',
        transliteration: 'wa-yuqīmūna',
        translation: 'and establish',
        ayahText: 'الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ 【وَيُقِيمُونَ】 الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002003.mp3',
        grammarCategory: 'Conjunction'
      }
    ]
  },
  {
    id: 'conj_fa',
    word: 'فَـ',
    transliteration: 'fa-',
    category: 'conjunction',
    categoryTitle: 'Conjunction of Consequence & Immediate Succession',
    categoryArabic: 'حرف عطف وترتيب وتعقيب وسببية',
    meaning: 'and so, then, thereupon, consequently',
    frequency: 3000,
    usageRule: 'Conjunction conveying: 1) الترتيب والتعقيب (sequence with direct immediacy, no lapse of time), 2) السببية (cause and effect / consequence).',
    syntacticEffect: 'Transfers grammatical inflection, or acts as fā’ al-sababiyyah / fā’ al-jazā’.',
    examples: [
      {
        location: '2:36:1',
        chapter: 2,
        verse: 36,
        wordNumber: 1,
        surahName: 'Al-Baqarah',
        surahArabic: 'البقرة',
        targetWord: 'فَأَزَلَّهُمَا',
        transliteration: 'fa-azallahumā',
        translation: 'Then made them slip',
        ayahText: '【فَأَزَلَّهُمَا】 الشَّيْطَانُ عَنْهَا فَأَخْرَجَهُمَا مِمَّا كَانَا فِيهِ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002036.mp3',
        grammarCategory: 'Conjunction'
      }
    ]
  },
  {
    id: 'conj_thumma',
    word: 'ثُمَّ',
    transliteration: 'thumma',
    category: 'conjunction',
    categoryTitle: 'Conjunction of Succession with Delay',
    categoryArabic: 'حرف عطف وترتيب وتراخٍ',
    meaning: 'then, thereafter, subsequently',
    frequency: 338,
    usageRule: 'Conjunction denoting orderly succession accompanied by a span of time or gradual progression (الترتيب مع التراخي). Frequently used in stages of embryonic creation and resurrection.',
    syntacticEffect: 'Assigns the case and mood of the preceding term onto the following term.',
    examples: [
      {
        location: '23:14:1',
        chapter: 23,
        verse: 14,
        wordNumber: 1,
        surahName: 'Al-Mu’minun',
        surahArabic: 'المؤمنون',
        targetWord: 'ثُمَّ',
        transliteration: 'thumma',
        translation: 'Then',
        ayahText: '【ثُمَّ】 خَلَقْنَا النُّطْفَةَ عَلَقَةً فَخَلَقْنَا الْعَلَقَةَ مُضْغَةً',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/023014.mp3',
        grammarCategory: 'Conjunction'
      }
    ]
  },
  {
    id: 'conj_aw',
    word: 'أَوْ',
    transliteration: 'aw',
    category: 'conjunction',
    categoryTitle: 'Alternative Conjunction',
    categoryArabic: 'حرف عطف وتخيير وإباحة وشك',
    meaning: 'or, either, whether (choice / doubt / alternative)',
    frequency: 280,
    usageRule: 'Conjunction indicating: 1) التخيير (choice between options), 2) الإباحة (permissibility of either/both), 3) الشك والتردد (uncertainty/doubt from human perspective).',
    syntacticEffect: 'Conjoins nouns or sentences into equivalent inflection.',
    examples: [
      {
        location: '2:19:1',
        chapter: 2,
        verse: 19,
        wordNumber: 1,
        surahName: 'Al-Baqarah',
        surahArabic: 'البقرة',
        targetWord: 'أَوْ',
        transliteration: 'aw',
        translation: 'Or',
        ayahText: '【أَوْ】 كَصَيِّبٍ مِّنَ السَّمَاءِ فِيهِ ظُلُمَاتٌ وَرَعْدٌ وَبَرْقٌ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002019.mp3',
        grammarCategory: 'Conjunction'
      }
    ]
  },
  {
    id: 'conj_bal',
    word: 'بَلْ',
    transliteration: 'bal',
    category: 'conjunction',
    categoryTitle: 'Conjunction of Retraction & Transition',
    categoryArabic: 'حرف إضراب وعطف',
    meaning: 'nay, rather, on the contrary, but',
    frequency: 126,
    usageRule: 'Particle of transition and retraction (الإضراب). Dismisses or moves beyond the preceding clause to strongly emphasize the ensuing declaration.',
    syntacticEffect: 'Acts as coordinating conjunction or sentence transition marker.',
    examples: [
      {
        location: '2:154:7',
        chapter: 2,
        verse: 154,
        wordNumber: 7,
        surahName: 'Al-Baqarah',
        surahArabic: 'البقرة',
        targetWord: 'بَلْ أَحْيَاءٌ',
        transliteration: 'bal aḥyā’un',
        translation: 'Rather, they are alive',
        ayahText: 'وَلَا تَقُولُوا لِمَن يُقْتَلُ فِي سَبِيلِ اللَّهِ أَمْوَاتٌ ۚ 【بَلْ أَحْيَاءٌ】 وَلَٰكِن لَّا تَشْعُرُونَ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002154.mp3',
        grammarCategory: 'Conjunction'
      }
    ]
  },

  // ==========================================
  // 5. INNA & SISTERS (إِنَّ وَأَخَوَاتُهَا - الْحُرُوفُ النَّاسِخَةُ)
  // ==========================================
  {
    id: 'inna_inna',
    word: 'إِنَّ',
    transliteration: 'inna',
    category: 'inna_sister',
    categoryTitle: 'Emphatic Resemblance Particle',
    categoryArabic: 'حرف توكيد ونصب ناسخ',
    meaning: 'Indeed, truly, verily, surely',
    frequency: 1680,
    usageRule: 'Primary particle of affirmation and certainty (التوكيد). Begins nominal sentences, or follows verbs of speech (قَالَ إِنَّهُ). Emphatically confirms the predication.',
    syntacticEffect: 'Makes its subject Accusative (تنصب الاسم) and keeps its predicate Nominative (ترفع الخبر).',
    examples: [
      {
        location: '2:20:17',
        chapter: 2,
        verse: 20,
        wordNumber: 17,
        surahName: 'Al-Baqarah',
        surahArabic: 'البقرة',
        targetWord: 'إِنَّ اللَّهَ',
        transliteration: 'inna Allāha',
        translation: 'Indeed Allah is',
        ayahText: '【إِنَّ اللَّهَ】 عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002020.mp3',
        grammarCategory: 'Inna Sister'
      },
      {
        location: '110:3:4',
        chapter: 110,
        verse: 3,
        wordNumber: 4,
        surahName: 'An-Nasr',
        surahArabic: 'النصر',
        targetWord: 'إِنَّهُ كَانَ',
        transliteration: 'innahu kāna',
        translation: 'Indeed He is',
        ayahText: 'فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ 【إِنَّهُ كَانَ】 تَوَّابًا',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/110003.mp3',
        grammarCategory: 'Inna Sister'
      }
    ]
  },
  {
    id: 'inna_anna',
    word: 'أَنَّ',
    transliteration: 'anna',
    category: 'inna_sister',
    categoryTitle: 'Subordinate Complementizer Particle',
    categoryArabic: 'حرف توكيد ومصدري ونصب',
    meaning: 'that (with emphasis / certainty)',
    frequency: 550,
    usageRule: 'Emphatic complementizer opening in the middle of sentences. Forms with its noun and predicate an interpreted infinitive noun phrase (مصدر مؤول).',
    syntacticEffect: 'Governs its noun into Accusative (اسم أن منصوب), and predicate into Nominative.',
    examples: [
      {
        location: '2:260:22',
        chapter: 2,
        verse: 260,
        wordNumber: 22,
        surahName: 'Al-Baqarah',
        surahArabic: 'البقرة',
        targetWord: 'أَنَّ اللَّهَ',
        transliteration: 'anna Allāha',
        translation: 'that Allah is',
        ayahText: 'وَاعْلَمْ 【أَنَّ اللَّهَ】 عَزِيزٌ حَكِيمٌ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002260.mp3',
        grammarCategory: 'Inna Sister'
      }
    ]
  },
  {
    id: 'inna_kaanna',
    word: 'كَأَنَّ',
    transliteration: 'ka’anna',
    category: 'inna_sister',
    categoryTitle: 'Comparative Resemblance Particle',
    categoryArabic: 'حرف تشبيه وتوكيد ونصب',
    meaning: 'as if, as though (vivid metaphorical likeness)',
    frequency: 83,
    usageRule: 'Compound particle (كَـ + أَنَّ) expressing heightened comparison and analogy (التشبيه المؤكد) with vivid presence.',
    syntacticEffect: 'Acts as Inna: noun is Accusative (منصوب) and predicate is Nominative (مرفوع).',
    examples: [
      {
        location: '24:35:19',
        chapter: 24,
        verse: 35,
        wordNumber: 19,
        surahName: 'An-Nur',
        surahArabic: 'النور',
        targetWord: 'كَأَنَّهَا كَوْكَبٌ',
        transliteration: 'ka-annahā kawkabun',
        translation: 'as if it were a star',
        ayahText: 'الزُّجَاجَةُ 【كَأَنَّهَا كَوْكَبٌ】 دُرِّيٌّ يُوقَدُ مِن شَجَرَةٍ مُّبَارَكَةٍ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/024035.mp3',
        grammarCategory: 'Inna Sister'
      }
    ]
  },
  {
    id: 'inna_laalla',
    word: 'لَعَلَّ',
    transliteration: 'la‘alla',
    category: 'inna_sister',
    categoryTitle: 'Particle of Hope, Anticipation & Purpose',
    categoryArabic: 'حرف ترجٍّ وإشفاق وتوقع وتعليل',
    meaning: 'perhaps, that you may, so that, lest',
    frequency: 129,
    usageRule: 'Particle of anticipation. Expresses: 1) الترجي (hope for a desired outcome), 2) الإشفاق (apprehension of an unwanted outcome), 3) التعليل (purpose: "so that you may become righteous").',
    syntacticEffect: 'Part of Inna sisters: noun is Accusative (منصوب) and predicate Nominative (مرفوع).',
    examples: [
      {
        location: '2:21:8',
        chapter: 2,
        verse: 21,
        wordNumber: 8,
        surahName: 'Al-Baqarah',
        surahArabic: 'البقرة',
        targetWord: 'لَعَلَّكُمْ تَتَّقُونَ',
        transliteration: 'la‘allakum tattaqūna',
        translation: 'that you may become righteous',
        ayahText: 'اعْبُدُوا رَبَّكُمُ الَّذِي خَلَقَكُمْ وَالَّذِينَ مِن قَبْلِكُمْ 【لَعَلَّكُمْ تَتَّقُونَ】',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002021.mp3',
        grammarCategory: 'Inna Sister'
      }
    ]
  },

  // ==========================================
  // 6. CONDITIONAL PARTICLES (أَدَوَاتُ الشَّرْطِ)
  // ==========================================
  {
    id: 'cond_in',
    word: 'إِنْ (الشَّرْطِيَّة)',
    transliteration: 'in (al-sharṭiyyah)',
    category: 'conditional',
    categoryTitle: 'Conditional Particle',
    categoryArabic: 'حرف شرط وجزم',
    meaning: 'if, in case that',
    frequency: 580,
    usageRule: 'Fundamental particle of hypothetical condition (أمّ الباب في الشرط). Enters upon two verbs: the condition verb (فعل الشرط) and the response verb (جواب الشرط).',
    syntacticEffect: 'Governs both the condition and response verbs into the Jussive mood (تجزم فعلين مضارعين).',
    examples: [
      {
        location: '2:284:11',
        chapter: 2,
        verse: 284,
        wordNumber: 11,
        surahName: 'Al-Baqarah',
        surahArabic: 'البقرة',
        targetWord: 'وَإِن تُبْدُوا',
        transliteration: 'wa-in tubdū',
        translation: 'And whether you reveal',
        ayahText: '【وَإِن تُبْدُوا】 مَا فِي أَنفُسِكُمْ أَوْ تُخْفُوهُ يُحَاسِبْكُم بِهِ اللَّهُ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002284.mp3',
        grammarCategory: 'Conditional'
      }
    ]
  },
  {
    id: 'cond_idha',
    word: 'إِذَا (الشَّرْطِيَّة)',
    transliteration: 'idhā (al-sharṭiyyah)',
    category: 'conditional',
    categoryTitle: 'Temporal Conditional Particle',
    categoryArabic: 'ظرف لما يستقبل من الزمان خافض لشرطه منصوب بجوابه',
    meaning: 'when, whenever, if (certain future event)',
    frequency: 414,
    usageRule: 'Conditional time adverb referring to the future (لما يستقبل من الزمان). Implies high certainty of occurrence compared to "in" (e.g., when the victory of Allah comes: إِذَا جَاءَ نَصْرُ اللَّهِ).',
    syntacticEffect: 'Non-jussive: its condition sentence is in the Genitive position (في محل جر مضاف إليه).',
    examples: [
      {
        location: '110:1:1',
        chapter: 110,
        verse: 1,
        wordNumber: 1,
        surahName: 'An-Nasr',
        surahArabic: 'النصر',
        targetWord: 'إِذَا جَاءَ',
        transliteration: 'idhā jā’a',
        translation: 'When comes',
        ayahText: '【إِذَا جَاءَ】 نَصْرُ اللَّهِ وَالْفَتْحُ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/110001.mp3',
        grammarCategory: 'Conditional'
      }
    ]
  },
  {
    id: 'cond_law',
    word: 'لَوْ',
    transliteration: 'law',
    category: 'conditional',
    categoryTitle: 'Counterfactual Conditional Particle',
    categoryArabic: 'حرف امتناع لامتناع',
    meaning: 'if, had (hypothetical counterfactual condition)',
    frequency: 200,
    usageRule: 'Counterfactual conditional particle denoting impossibility due to impossibility (حرف امتناع لامتناع): the consequence was prevented because the condition was unfulfilled.',
    syntacticEffect: 'Non-jussive particle; often accompanied in its response with lām (لَفَسَدَتَا).',
    examples: [
      {
        location: '21:22:1',
        chapter: 21,
        verse: 22,
        wordNumber: 1,
        surahName: 'Al-Anbiya',
        surahArabic: 'الأنبياء',
        targetWord: 'لَوْ كَانَ',
        transliteration: 'law kāna',
        translation: 'Had there been',
        ayahText: '【لَوْ كَانَ】 فِيهِمَا آلِهَةٌ إِلَّا اللَّهُ لَفَسَدَتَا',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/021022.mp3',
        grammarCategory: 'Conditional'
      }
    ]
  },
  {
    id: 'cond_lawla',
    word: 'لَوْلَا',
    transliteration: 'lawlā',
    category: 'conditional',
    categoryTitle: 'Particle of Prevention Due to Existence',
    categoryArabic: 'حرف امتناع لوجود / حرف تحضيض',
    meaning: 'if not for, why not, had it not been that',
    frequency: 169,
    usageRule: 'Conditional particle of withholding (امتناع لوجود): the consequence was withheld solely because the condition existed. Can also function for urging and incitement (التحضيض).',
    syntacticEffect: 'Followed by an elevated subject whose predicate is obligatorily omitted (مبتدأ خبره محذوف وجوبا تقديره موجود).',
    examples: [
      {
        location: '2:64:5',
        chapter: 2,
        verse: 64,
        wordNumber: 5,
        surahName: 'Al-Baqarah',
        surahArabic: 'البقرة',
        targetWord: 'فَلَوْلَا فَضْلُ',
        transliteration: 'fa-lawlā faḍlu',
        translation: 'And if not for the favor of',
        ayahText: '【فَلَوْلَا فَضْلُ】 اللَّهِ عَلَيْكُمْ وَرَحْمَتُهُ لَكُنتُم مِّنَ الْخَاسِرِينَ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002064.mp3',
        grammarCategory: 'Conditional'
      }
    ]
  },

  // ==========================================
  // 7. EMPHASIS & CERTAINTY (حُرُوفُ التَّوْكِيدِ وَالتَّحْقِيقِ)
  // ==========================================
  {
    id: 'emph_qad',
    word: 'قَدْ',
    transliteration: 'qad',
    category: 'emphasis',
    categoryTitle: 'Particle of Certainty & Realization',
    categoryArabic: 'حرف تحقيق وتوقع وتوكيد',
    meaning: 'already, certainly, indeed, verily',
    frequency: 406,
    usageRule: 'Particle preceding verbs. With past verbs (الماضي), it denotes absolute realization and certainty (التحقيق). With imperfect verbs (المضارع), it signifies anticipation or certainty (قد يعلم الله).',
    syntacticEffect: 'Particle of inflectional neutrality (حرف مبني على السكون).',
    examples: [
      {
        location: '23:1:1',
        chapter: 23,
        verse: 1,
        wordNumber: 1,
        surahName: 'Al-Mu’minun',
        surahArabic: 'المؤمنون',
        targetWord: 'قَدْ أَفْلَحَ',
        transliteration: 'qad aflaḥa',
        translation: 'Certainly will succeed',
        ayahText: '【قَدْ أَفْلَحَ】 الْمُؤْمِنُونَ * الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/023001.mp3',
        grammarCategory: 'Emphasis'
      },
      {
        location: '2:144:1',
        chapter: 2,
        verse: 144,
        wordNumber: 1,
        surahName: 'Al-Baqarah',
        surahArabic: 'البقرة',
        targetWord: 'قَدْ نَرَىٰ',
        transliteration: 'qad narā',
        translation: 'We have certainly seen',
        ayahText: '【قَدْ نَرَىٰ】 تَقَلُّبَ وَجْهِكَ فِي السَّمَاءِ ۖ فَلَنُوَلِّيَنَّكَ قِبْلَةً تَرْضَاهَا',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002144.mp3',
        grammarCategory: 'Emphasis'
      }
    ]
  },
  {
    id: 'emph_lam',
    word: 'لَـ (لَامُ التَّوْكِيدِ)',
    transliteration: 'la- (al-tawkīd)',
    category: 'emphasis',
    categoryTitle: 'Inseparable Particle of Affirmation',
    categoryArabic: 'لام الابتداء والمزحلقة والتوكيد',
    meaning: 'surely, truly, most definitely',
    frequency: 1800,
    usageRule: 'Inseparable prefix lām with fat-ḥah. Attaches to the subject (لام الابتداء), or slips onto the predicate in clauses beginning with Inna (اللام المزحلقة: إِنَّ رَبَّكَ لَذُو مَغْفِرَةٍ), confirming unequivocal truth.',
    syntacticEffect: 'Has no inflectional alteration on the case of the word.',
    examples: [
      {
        location: '103:2:2',
        chapter: 103,
        verse: 2,
        wordNumber: 2,
        surahName: 'Al-Asr',
        surahArabic: 'العصر',
        targetWord: 'لَفِي خُسْرٍ',
        transliteration: 'la-fī khusr',
        translation: 'is surely in loss',
        ayahText: 'إِنَّ الْإِنسَانَ 【لَفِي خُسْرٍ】',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/103002.mp3',
        grammarCategory: 'Emphasis'
      },
      {
        location: '12:3:1',
        chapter: 12,
        verse: 3,
        wordNumber: 1,
        surahName: 'Yusuf',
        surahArabic: 'يوسف',
        targetWord: 'لَقَدْ كَانَ',
        transliteration: 'la-qad kāna',
        translation: 'There was certainly',
        ayahText: '【لَقَدْ كَانَ】 فِي يُوسُفَ وَإِخْوَتِهِ آيَاتٌ لِّلسَّائِلِينَ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/012007.mp3',
        grammarCategory: 'Emphasis'
      }
    ]
  },

  // ==========================================
  // 8. INTERROGATIVE PARTICLES (أَدَوَاتُ الِاسْتِفْهَامِ)
  // ==========================================
  {
    id: 'interrog_hamza',
    word: 'أَ (هَمْزَةُ الِاسْتِفْهَامِ)',
    transliteration: 'a- (interrogative hamza)',
    category: 'interrogative',
    categoryTitle: 'Interrogative Particle',
    categoryArabic: 'همزة الاستفهام',
    meaning: 'Is it? Are? Did? (direct inquiry / rhetorical question)',
    frequency: 580,
    usageRule: 'Primary interrogative particle. Has priority of word-order (لها صدر الكلام). Used for real questions, rhetorical negation (أَلَمْ تَرَ), or equalization paired with am (أَأَنذَرْتَهُمْ أَمْ لَمْ تُنذِرْهُمْ).',
    syntacticEffect: 'Particle of inquiry without inflectional consequence.',
    examples: [
      {
        location: '2:6:2',
        chapter: 2,
        verse: 6,
        wordNumber: 2,
        surahName: 'Al-Baqarah',
        surahArabic: 'البقرة',
        targetWord: 'أَأَنذَرْتَهُمْ',
        transliteration: 'a-andhartahum',
        translation: 'whether you warn them',
        ayahText: 'سَوَاءٌ عَلَيْهِمْ 【أَأَنذَرْتَهُمْ】 أَمْ لَمْ تُنذِرْهُمْ لَا يُؤْمِنُونَ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002006.mp3',
        grammarCategory: 'Interrogative'
      },
      {
        location: '105:1:1',
        chapter: 105,
        verse: 1,
        wordNumber: 1,
        surahName: 'Al-Fil',
        surahArabic: 'الفيل',
        targetWord: 'أَلَمْ تَرَ',
        transliteration: 'a-lam tara',
        translation: 'Have you not seen',
        ayahText: '【أَلَمْ تَرَ】 كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/105001.mp3',
        grammarCategory: 'Interrogative'
      }
    ]
  },
  {
    id: 'interrog_hal',
    word: 'هَلْ',
    transliteration: 'hal',
    category: 'interrogative',
    categoryTitle: 'Interrogative Particle',
    categoryArabic: 'حرف استفهام',
    meaning: 'Is? Are? Did? Has? Can?',
    frequency: 93,
    usageRule: 'Particle of inquiry seeking positive or negative ratification (طلب التصديق الإيجابي). In the Quran, frequently functions rhetorically to induce contemplation or eager readiness (فَهَلْ أَنتُم مُّنتَهُونَ).',
    syntacticEffect: 'حرف استفهام مبني على السكون لا محل له من الإعراب.',
    examples: [
      {
        location: '88:1:1',
        chapter: 88,
        verse: 1,
        wordNumber: 1,
        surahName: 'Al-Ghashiyah',
        surahArabic: 'الغاشية',
        targetWord: 'هَلْ أَتَاكَ',
        transliteration: 'hal atāka',
        translation: 'Has there reached you',
        ayahText: '【هَلْ أَتَاكَ】 حَدِيثُ الْغَاشِيَةِ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/088001.mp3',
        grammarCategory: 'Interrogative'
      },
      {
        location: '5:91:16',
        chapter: 5,
        verse: 91,
        wordNumber: 16,
        surahName: 'Al-Ma’idah',
        surahArabic: 'المائدة',
        targetWord: 'فَهَلْ أَنتُم',
        transliteration: 'fa-hal antum',
        translation: 'So will you',
        ayahText: 'فَهَلْ أَنتُم مُّنتَهُونَ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/005091.mp3',
        grammarCategory: 'Interrogative'
      }
    ]
  },

  // ==========================================
  // 9. EXCEPTION PARTICLES (أَدَوَاتُ الِاسْتِثْنَاءِ)
  // ==========================================
  {
    id: 'except_illa',
    word: 'إِلَّا',
    transliteration: 'illā',
    category: 'exception',
    categoryTitle: 'Particle of Exception & Restriction',
    categoryArabic: 'أداة استثناء وحصر',
    meaning: 'except, unless, but, save, only',
    frequency: 660,
    usageRule: 'Primary particle of exception (أمّ الباب في الاستثناء). In positive affirmative statements, it denotes pure exclusion. In negated sentences (الاستثناء المفرغ), it functions as a particle of exclusivity / restriction (أداة حصر: "there is no deity except Allah").',
    syntacticEffect: 'Governs the excepted noun into Accusative (مستثنى منصوب), or takes the required grammatical position in restrictive context (إعراب حسب العوامل).',
    examples: [
      {
        location: '103:3:1',
        chapter: 103,
        verse: 3,
        wordNumber: 1,
        surahName: 'Al-Asr',
        surahArabic: 'العصر',
        targetWord: 'إِلَّا الَّذِينَ',
        transliteration: 'illā al-ladhīna',
        translation: 'Except those who',
        ayahText: 'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ * 【إِلَّا الَّذِينَ】 آمَنُوا وَعَمِلُوا الصَّالِحَاتِ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/103003.mp3',
        grammarCategory: 'Exception'
      },
      {
        location: '38:87:3',
        chapter: 38,
        verse: 87,
        wordNumber: 3,
        surahName: 'Sad',
        surahArabic: 'ص',
        targetWord: 'إِلَّا ذِكْرٌ',
        transliteration: 'illā dhikrun',
        translation: 'except a reminder',
        ayahText: 'إِنْ هُوَ 【إِلَّا ذِكْرٌ】 لِّلْعَالَمِينَ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/038087.mp3',
        grammarCategory: 'Exception'
      }
    ]
  },

  // ==========================================
  // 10. FUTURITY PARTICLES (حُرُوفُ الِاسْتِقْبَالِ وَالتَّنْفِيسِ)
  // ==========================================
  {
    id: 'fut_sin',
    word: 'سَـ (سِينُ التَّنْفِيسِ)',
    transliteration: 'sa- (al-tanfīs)',
    category: 'futurity',
    categoryTitle: 'Near Futurity Prefix',
    categoryArabic: 'حرف استقبال وتنفيس',
    meaning: 'will, soon shall (near future)',
    frequency: 140,
    usageRule: 'Inseparable prefix attaching to imperfect verbs to dedicate their temporal focus to the near future (الاستقبال القريب). Expresses divine promise, warning, or assurance.',
    syntacticEffect: 'Causes no change to the verbal mood; imperfect verb remains in Indicative (مرفوع).',
    examples: [
      {
        location: '2:142:1',
        chapter: 2,
        verse: 142,
        wordNumber: 1,
        surahName: 'Al-Baqarah',
        surahArabic: 'البقرة',
        targetWord: 'سَيَقُولُ',
        transliteration: 'sa-yaqūlu',
        translation: 'Soon will say',
        ayahText: '【سَيَقُولُ】 السُّفَهَاءُ مِنَ النَّاسِ مَا وَلَّاهُمْ عَن قِبْلَتِهِمُ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002142.mp3',
        grammarCategory: 'Futurity'
      }
    ]
  },
  {
    id: 'fut_sawfa',
    word: 'سَوْفَ',
    transliteration: 'sawfa',
    category: 'futurity',
    categoryTitle: 'Distant Futurity Particle',
    categoryArabic: 'حرف تسويف واستقبال',
    meaning: 'shall, will (distant future horizon)',
    frequency: 42,
    usageRule: 'Independent particle of futurity indicating an event situated over a greater temporal horizon (الاستقبال البعيد) compared to سَـ. Frequently conveys solemn eschatological warnings.',
    syntacticEffect: 'حرف تسويف واستقبال مبني على الفتح لا محل له من الإعراب.',
    examples: [
      {
        location: '93:5:1',
        chapter: 93,
        verse: 5,
        wordNumber: 1,
        surahName: 'Ad-Duha',
        surahArabic: 'الضحى',
        targetWord: 'وَلَسَوْفَ يُعْطِيكَ',
        transliteration: 'wa-la-sawfa yu‘ṭīka',
        translation: 'And your Lord will surely give you',
        ayahText: '【وَلَسَوْفَ يُعْطِيكَ】 رَبُّكَ فَتَرْضَىٰ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/093005.mp3',
        grammarCategory: 'Futurity'
      },
      {
        location: '102:3:2',
        chapter: 102,
        verse: 3,
        wordNumber: 2,
        surahName: 'At-Takathur',
        surahArabic: 'التكاثر',
        targetWord: 'سَوْفَ تَعْلَمُونَ',
        transliteration: 'sawfa ta‘lamūna',
        translation: 'you will know',
        ayahText: 'كَلَّا 【سَوْفَ تَعْلَمُونَ】 * ثُمَّ كَلَّا سَوْفَ تَعْلَمُونَ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/102003.mp3',
        grammarCategory: 'Futurity'
      }
    ]
  },

  // ==========================================
  // 11. SUBJUNCTIVE PARTICLES (حُرُوفُ النَّصْبِ لِلْمُضَارِعِ)
  // ==========================================
  {
    id: 'subj_an',
    word: 'أَنْ (الْمَصْدَرِيَّة)',
    transliteration: 'an (al-maṣdariyyah)',
    category: 'subjunctive',
    categoryTitle: 'Infinitive Subjunctive Particle',
    categoryArabic: 'حرف مصدري ونصب واستقبال',
    meaning: 'that, to (forming an infinitive verbal concept)',
    frequency: 570,
    usageRule: 'Primary particle of verbal infinitive subordination. Blends with its verb into a conceptual abstract noun (مصدر مؤول) that can serve as subject, object, or genitive object.',
    syntacticEffect: 'Governs the imperfect verb into the Subjunctive mood (منصوب بالفتحة أو بحذف النون).',
    examples: [
      {
        location: '2:184:18',
        chapter: 2,
        verse: 184,
        wordNumber: 18,
        surahName: 'Al-Baqarah',
        surahArabic: 'البقرة',
        targetWord: 'وَأَن تَصُومُوا',
        transliteration: 'wa-an taṣūmū',
        translation: 'And that you fast',
        ayahText: '【وَأَن تَصُومُوا】 خَيْرٌ لَّكُمْ ۖ إِن كُنتُمْ تَعْلَمُونَ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002184.mp3',
        grammarCategory: 'Subjunctive'
      }
    ]
  },
  {
    id: 'subj_kay',
    word: 'كَيْ / لِكَيْ',
    transliteration: 'kay / likay',
    category: 'subjunctive',
    categoryTitle: 'Purposive Subjunctive Particle',
    categoryArabic: 'حرف مصدري ونصب وتعليل',
    meaning: 'so that, in order that, to the end that',
    frequency: 21,
    usageRule: 'Subjunctive particle indicating deliberate rationale, purpose, and teleology (التعليل والغرض). Identifies the ultimate goal of the preceding divine instruction or action.',
    syntacticEffect: 'Governs the imperfect verb into the Subjunctive mood (منصوب بالفتحة).',
    examples: [
      {
        location: '20:33:1',
        chapter: 20,
        verse: 33,
        wordNumber: 1,
        surahName: 'Taha',
        surahArabic: 'طه',
        targetWord: 'كَيْ نُسَبِّحَكَ',
        transliteration: 'kay nusabbiḥaka',
        translation: 'That we may glorify You',
        ayahText: '【كَيْ نُسَبِّحَكَ】 كَثِيرًا * وَنَذْكُرَكَ كَثِيرًا',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/020033.mp3',
        grammarCategory: 'Subjunctive'
      },
      {
        location: '59:7:18',
        chapter: 59,
        verse: 7,
        wordNumber: 18,
        surahName: 'Al-Hashr',
        surahArabic: 'الحشر',
        targetWord: 'كَيْ لَا يَكُونَ',
        transliteration: 'kay lā yakūna',
        translation: 'so that it will not be',
        ayahText: '【كَيْ لَا يَكُونَ】 دُولَةً بَيْنَ الْأَغْنِيَاءِ مِنكُمْ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/059007.mp3',
        grammarCategory: 'Subjunctive'
      }
    ]
  },

  // ==========================================
  // 12. SURPRISE & SUDDENNESS (حَرْفُ الْمُفَاجَأَةِ)
  // ==========================================
  {
    id: 'incept_idha_fujaiyyah',
    word: 'إِذَا (الْفُجَائِيَّة)',
    transliteration: 'idhā (al-fujā’iyyah)',
    category: 'inceptive',
    categoryTitle: 'Particle of Suddenness & Wonder',
    categoryArabic: 'حرف فجاءة',
    meaning: 'behold! suddenly! lo and behold!',
    frequency: 45,
    usageRule: 'Special particle indicating unexpected, dramatic suddenness (الفجاءة). Unlike the conditional إِذَا, it is followed directly by a nominal sentence (e.g., Musa throwing his staff: فَإِذَا هِيَ حَيَّةٌ تَسْعَىٰ).',
    syntacticEffect: 'حرف فجاءة مبني على السكون لا عمل له، يليه مبتدأ وخبر مرفوعان.',
    examples: [
      {
        location: '20:20:4',
        chapter: 20,
        verse: 20,
        wordNumber: 4,
        surahName: 'Taha',
        surahArabic: 'طه',
        targetWord: 'فَإِذَا هِيَ حَيَّةٌ',
        transliteration: 'fa-idhā hiya ḥayyatun',
        translation: 'and suddenly it was a serpent',
        ayahText: 'فَأَلْقَاهَا 【فَإِذَا هِيَ حَيَّةٌ】 تَسْعَىٰ',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/020020.mp3',
        grammarCategory: 'Interjection'
      }
    ]
  }
];

// Adapter function to convert QuranParticle to RootDerivation format
export function convertParticleToDerivation(p: QuranParticle): RootDerivation {
  return {
    id: p.id,
    root: p.root || p.id.split('_')[1] || 'hrf',
    rootArabic: p.rootArabic || p.categoryArabic,
    word: p.word,
    transliteration: p.transliteration,
    prefix: '—',
    suffix: '—',
    grammarCategory: p.categoryTitle,
    meaning: p.meaning,
    frequency: p.frequency,
    semanticRole: 'Attribute',
    examples: p.examples.map((e) => e.location),
    occurrences: p.examples
  };
}

// Pre-converted collections
export const ALL_PARTICLE_DERIVATIONS: RootDerivation[] = QURAN_PARTICLES.map(convertParticleToDerivation);

export const PREPOSITION_DERIVATIONS: RootDerivation[] = QURAN_PARTICLES
  .filter((p) => p.category === 'preposition')
  .map(convertParticleToDerivation);

export const INTERJECTION_DERIVATIONS: RootDerivation[] = QURAN_PARTICLES
  .filter((p) => p.category === 'interjection')
  .map(convertParticleToDerivation);
