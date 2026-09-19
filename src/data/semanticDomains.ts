import type { SemanticDomain } from '../types.ts';

export const SEMANTIC_DOMAINS: SemanticDomain[] = [
  {
    id: 'divine-realm',
    name: 'Divine Realm & Theology',
    nameArabic: 'الإلهيات والعقيدة والتوحيد',
    description: 'The Nature of God (Allah), His 99 Sublime Names & Attributes, Divine Will, Celestial Throne, and Unseen Realities.',
    iconName: 'Sparkles',
    color: 'amber',
    totalWordsCount: 28,
    totalOccurrences: 6850,
    subcategories: [
      {
        id: 'asma-al-husna',
        name: 'Divine Names & Attributes (Asma al-Husna)',
        nameArabic: 'أسماء الله الحسنى والصفات الإلهية العلى',
        description: 'The Most Beautiful Names describing the infinite Majesty, Mercy, Wisdom, and Omnipotence of Allah.',
        words: [
          {
            id: 'allah',
            word: 'اللَّهُ',
            transliteration: 'Allāh',
            cleanArabic: 'الله',
            root: 'Alh',
            rootArabic: 'إ ل ه',
            grammarCategory: 'Proper noun',
            meaning: 'Allah (The One and Only True God)',
            frequency: 2699,
            semanticRole: 'Agent',
            sampleVerse: {
              location: '1:1:2',
              text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
              translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
              surahName: 'Al-Fatihah'
            }
          },
          {
            id: 'al-rahman',
            word: 'الرَّحْمَٰنُ',
            transliteration: 'al-Raḥmān',
            cleanArabic: 'الرحمن',
            root: 'rHm',
            rootArabic: 'ر ح م',
            grammarCategory: 'Noun (Attribute)',
            meaning: 'The Entirely Merciful, All-Gracious',
            frequency: 57,
            semanticRole: 'Attribute',
            sampleVerse: {
              location: '55:1:1',
              text: 'الرَّحْمَٰنُ عَلَّمَ الْقُرْآنَ',
              translation: 'The Most Gracious (Allah) taught the Quran.',
              surahName: 'Ar-Rahman'
            }
          },
          {
            id: 'al-rahim',
            word: 'الرَّحِيمُ',
            transliteration: 'al-Raḥīm',
            cleanArabic: 'الرحيم',
            root: 'rHm',
            rootArabic: 'ر ح م',
            grammarCategory: 'Noun (Attribute)',
            meaning: 'The Especially Merciful, Bestower of Mercy',
            frequency: 115,
            semanticRole: 'Attribute',
            sampleVerse: {
              location: '1:3:2',
              text: 'الرَّحْمَٰنِ الرَّحِيمِ',
              translation: 'The Entirely Merciful, the Especially Merciful.',
              surahName: 'Al-Fatihah'
            }
          },
          {
            id: 'al-rabb',
            word: 'الرَّبُّ',
            transliteration: 'al-Rabb',
            cleanArabic: 'الرب',
            root: 'rbb',
            rootArabic: 'ر ب ب',
            grammarCategory: 'Noun',
            meaning: 'The Lord, Cherisher, Sustainer of all existence',
            frequency: 970,
            semanticRole: 'Agent',
            sampleVerse: {
              location: '1:2:2',
              text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
              translation: 'All praise is due to Allah, Lord of all the worlds.',
              surahName: 'Al-Fatihah'
            }
          },
          {
            id: 'al-malik',
            word: 'الْمَلِكُ',
            transliteration: 'al-Malik',
            cleanArabic: 'الملك',
            root: 'mlk',
            rootArabic: 'م ل ك',
            grammarCategory: 'Noun (Attribute)',
            meaning: 'The Sovereign King, Absolute Monarch',
            frequency: 5,
            semanticRole: 'Agent',
            sampleVerse: {
              location: '59:23:4',
              text: 'هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ',
              translation: 'He is Allah, other than whom there is no deity, the Sovereign, the Holy...',
              surahName: 'Al-Hashr'
            }
          },
          {
            id: 'al-alim',
            word: 'الْعَلِيمُ',
            transliteration: 'al-ʿAlīm',
            cleanArabic: 'العليم',
            root: 'Elm',
            rootArabic: 'ع ل م',
            grammarCategory: 'Noun (Attribute)',
            meaning: 'The All-Knowing, Omniscient',
            frequency: 157,
            semanticRole: 'Attribute',
            sampleVerse: {
              location: '2:32:8',
              text: 'إِنَّكَ أَنْتَ الْعَلِيمُ الْحَكِيمُ',
              translation: 'Indeed, it is You who is the Knowing, the Wise.',
              surahName: 'Al-Baqarah'
            }
          },
          {
            id: 'al-hakim',
            word: 'الْحَكِيمُ',
            transliteration: 'al-Ḥakīm',
            cleanArabic: 'الحكيم',
            root: 'Hkm',
            rootArabic: 'ح ك م',
            grammarCategory: 'Noun (Attribute)',
            meaning: 'The All-Wise, Perfect in Judgment',
            frequency: 97,
            semanticRole: 'Attribute',
            sampleVerse: {
              location: '2:129:13',
              text: 'إِنَّكَ أَنْتَ الْعَزِيزُ الْحَكِيمُ',
              translation: 'Indeed, You are the Exalted in Might, the Wise.',
              surahName: 'Al-Baqarah'
            }
          },
          {
            id: 'al-aziz',
            word: 'الْعَزِيزُ',
            transliteration: 'al-ʿAzīz',
            cleanArabic: 'العزيز',
            root: 'Ezz',
            rootArabic: 'ع ز ز',
            grammarCategory: 'Noun (Attribute)',
            meaning: 'The Almighty, Exalted in Power & Honor',
            frequency: 92,
            semanticRole: 'Attribute',
            sampleVerse: {
              location: '3:6:9',
              text: 'لَا إِلَٰهَ إِلَّا هُوَ الْعَزِيزُ الْحَكِيمُ',
              translation: 'There is no deity except Him, the Exalted in Might, the Wise.',
              surahName: 'Ali Imran'
            }
          },
          {
            id: 'al-khaliq',
            word: 'الْخَالِقُ',
            transliteration: 'al-Khāliq',
            cleanArabic: 'الخالق',
            root: 'xlq',
            rootArabic: 'خ ل ق',
            grammarCategory: 'Active participle',
            meaning: 'The Creator, Originator from nothingness',
            frequency: 8,
            semanticRole: 'Agent',
            sampleVerse: {
              location: '59:24:2',
              text: 'هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ',
              translation: 'He is Allah, the Creator, the Inventor, the Fashioner.',
              surahName: 'Al-Hashr'
            }
          },
          {
            id: 'al-qadir',
            word: 'الْقَدِيرُ',
            transliteration: 'al-Qadīr',
            cleanArabic: 'القدير',
            root: 'qdr',
            rootArabic: 'ق د ر',
            grammarCategory: 'Noun (Attribute)',
            meaning: 'The All-Powerful, Omnipotent',
            frequency: 45,
            semanticRole: 'Attribute',
            sampleVerse: {
              location: '2:20:23',
              text: 'إِنَّ اللَّهَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
              translation: 'Indeed, Allah is over all things competent.',
              surahName: 'Al-Baqarah'
            }
          }
        ]
      },
      {
        id: 'divine-actions',
        name: 'Divine Actions & Creative Will',
        nameArabic: 'الأفعال والقدرة الإلهية والمشيئة',
        description: 'Verbal actions executed by the Divine Power across the cosmos and human destiny.',
        words: [
          {
            id: 'khalaqa',
            word: 'خَلَقَ',
            transliteration: 'khalaqa',
            cleanArabic: 'خلق',
            root: 'xlq',
            rootArabic: 'خ ل ق',
            grammarCategory: 'Verb (form I)',
            meaning: 'He created, brought into being',
            frequency: 184,
            semanticRole: 'Action',
            sampleVerse: {
              location: '96:1:4',
              text: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
              translation: 'Recite in the name of your Lord who created.',
              surahName: 'Al-Alaq'
            }
          },
          {
            id: 'anzala',
            word: 'أَنْزَلَ',
            transliteration: 'anzala',
            cleanArabic: 'أنزل',
            root: 'nzl',
            rootArabic: 'ن ز ل',
            grammarCategory: 'Verb (form IV)',
            meaning: 'He sent down, revealed from on high',
            frequency: 191,
            semanticRole: 'Action',
            sampleVerse: {
              location: '2:4:5',
              text: 'وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنْزِلَ إِلَيْكَ',
              translation: 'And who believe in what has been revealed to you...',
              surahName: 'Al-Baqarah'
            }
          },
          {
            id: 'hada',
            word: 'هَدَىٰ',
            transliteration: 'hadā',
            cleanArabic: 'هدى',
            root: 'hdy',
            rootArabic: 'ه د ي',
            grammarCategory: 'Verb (form I)',
            meaning: 'He guided, showed the path',
            frequency: 88,
            semanticRole: 'Action',
            sampleVerse: {
              location: '20:50:8',
              text: 'أَعْطَىٰ كُلَّ شَيْءٍ خَلْقَهُ ثُمَّ هَدَىٰ',
              translation: 'He gave each thing its form and then guided it.',
              surahName: 'Taha'
            }
          },
          {
            id: 'razaqa',
            word: 'رَزَقَ',
            transliteration: 'razaqa',
            cleanArabic: 'رزق',
            root: 'rzq',
            rootArabic: 'ر ز ق',
            grammarCategory: 'Verb (form I)',
            meaning: 'He provided sustenance, bestowed bounty',
            frequency: 58,
            semanticRole: 'Action',
            sampleVerse: {
              location: '2:3:6',
              text: 'وَمِمَّا رَزَقْنَاهُمْ يُنْفِقُونَ',
              translation: 'And out of what We have provided for them they spend.',
              surahName: 'Al-Baqarah'
            }
          },
          {
            id: 'ghafara',
            word: 'غَفَرَ',
            transliteration: 'ghafara',
            cleanArabic: 'غفر',
            root: 'gfr',
            rootArabic: 'غ ف ر',
            grammarCategory: 'Verb (form I)',
            meaning: 'He forgave, pardoned, covered sins',
            frequency: 47,
            semanticRole: 'Action',
            sampleVerse: {
              location: '39:53:15',
              text: 'إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا',
              translation: 'Indeed, Allah forgives all sins.',
              surahName: 'Az-Zumar'
            }
          }
        ]
      },
      {
        id: 'angels-throne',
        name: 'Angels & The Unseen Realm',
        nameArabic: 'الملائكة والعرش والكرسي وعالم الغيب',
        description: 'Celestial entities, archangels, and the transcendental Throne of Majesty.',
        words: [
          {
            id: 'malaikah',
            word: 'مَلَائِكَة',
            transliteration: 'malāʾikah',
            cleanArabic: 'ملائكة',
            root: 'Alk',
            rootArabic: 'أ ل ك',
            grammarCategory: 'Noun',
            meaning: 'Angels (celestial messengers of light)',
            frequency: 68,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '2:30:6',
              text: 'وَإِذْ قَالَ رَبُّكَ لِلْمَلَائِكَةِ إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً',
              translation: 'And when your Lord said to the angels: Indeed, I will make upon the earth a successor.',
              surahName: 'Al-Baqarah'
            }
          },
          {
            id: 'jibril',
            word: 'جِبْرِيل',
            transliteration: 'Jibrīl',
            cleanArabic: 'جبريل',
            root: 'jbrl',
            rootArabic: 'ج ب ر ل',
            grammarCategory: 'Proper noun',
            meaning: 'Gabriel (Archangel of Revelation)',
            frequency: 3,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '2:97:4',
              text: 'مَنْ كَانَ عَدُوًّا لِجِبْرِيلَ فَإِنَّهُ نَزَّلَهُ عَلَىٰ قَلْبِكَ',
              translation: 'Whoever is an enemy to Gabriel - it is he who has brought the Quran down upon your heart...',
              surahName: 'Al-Baqarah'
            }
          },
          {
            id: 'al-arsh',
            word: 'الْعَرْش',
            transliteration: 'al-ʿArsh',
            cleanArabic: 'العرش',
            root: 'Er$',
            rootArabic: 'ع ر ش',
            grammarCategory: 'Noun',
            meaning: 'The Throne of Supreme Majesty',
            frequency: 26,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '20:5:3',
              text: 'الرَّحْمَٰنُ عَلَى الْعَرْشِ اسْتَوَىٰ',
              translation: 'The Most Merciful rose above the Throne.',
              surahName: 'Taha'
            }
          },
          {
            id: 'al-ghayb',
            word: 'الْغَيْب',
            transliteration: 'al-Ghayb',
            cleanArabic: 'الغيب',
            root: 'gyb',
            rootArabic: 'غ ي ب',
            grammarCategory: 'Noun',
            meaning: 'The Unseen, Transcendental Reality',
            frequency: 49,
            semanticRole: 'Attribute',
            sampleVerse: {
              location: '2:3:2',
              text: 'الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ',
              translation: 'Who believe in the unseen...',
              surahName: 'Al-Baqarah'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'prophethood-revelation',
    name: 'Prophethood & Sacred Scriptures',
    nameArabic: 'النبوة والرسالة والكتب والوحي',
    description: 'The lineage of Prophets, divine revelations, the Holy Quran, and prophetic missions across ages.',
    iconName: 'BookOpen',
    color: 'emerald',
    totalWordsCount: 26,
    totalOccurrences: 3410,
    subcategories: [
      {
        id: 'prophets-messengers',
        name: 'Prophets & Messengers (Anbiya & Rusul)',
        nameArabic: 'الأنبياء والمرسلون وأولو العزم',
        description: 'Names of the chosen emissaries sent by Allah to guide humankind.',
        words: [
          {
            id: 'muhammad',
            word: 'مُحَمَّد',
            transliteration: 'Muḥammad',
            cleanArabic: 'محمد',
            root: 'Hmd',
            rootArabic: 'ح م د',
            grammarCategory: 'Proper noun',
            meaning: 'Muhammad (The Praised One, Seal of the Prophets)',
            frequency: 4,
            semanticRole: 'Agent',
            sampleVerse: {
              location: '33:40:2',
              text: 'مَا كَانَ مُحَمَّدٌ أَبَا أَحَدٍ مِنْ رِجَالِكُمْ وَلَٰكِنْ رَسُولَ اللَّهِ',
              translation: 'Muhammad is not the father of [any] one of your men, but [he is] the Messenger of Allah...',
              surahName: 'Al-Ahzab'
            }
          },
          {
            id: 'ibrahim',
            word: 'إِبْرَاهِيم',
            transliteration: 'Ibrāhīm',
            cleanArabic: 'إبراهيم',
            root: '%3CiboraAhiym',
            rootArabic: 'إ ب ر ا هـ ي م',
            grammarCategory: 'Proper noun',
            meaning: 'Abraham (Friend of Allah, Patriarch of Monotheism)',
            frequency: 69,
            semanticRole: 'Agent',
            sampleVerse: {
              location: '2:124:4',
              text: 'وَإِذِ ابْتَلَىٰ إِبْرَاهِيمَ رَبُّهُ بِكَلِمَاتٍ فَأَتَمَّهُنَّ',
              translation: 'And remember when Abraham was tried by his Lord with commands and he fulfilled them.',
              surahName: 'Al-Baqarah'
            }
          },
          {
            id: 'musa',
            word: 'مُوسَىٰ',
            transliteration: 'Mūsā',
            cleanArabic: 'موسى',
            root: 'mwsy',
            rootArabic: 'م و س ى',
            grammarCategory: 'Proper noun',
            meaning: 'Moses (Speaker with Allah, Messenger of the Torah)',
            frequency: 136,
            semanticRole: 'Agent',
            sampleVerse: {
              location: '20:9:4',
              text: 'وَهَلْ أَتَاكَ حَدِيثُ مُوسَىٰ',
              translation: 'And has there reached you the story of Moses?',
              surahName: 'Taha'
            }
          },
          {
            id: 'isa',
            word: 'عِيسَىٰ',
            transliteration: 'ʿĪsā',
            cleanArabic: 'عيسى',
            root: 'Eysy',
            rootArabic: 'ع ي س ى',
            grammarCategory: 'Proper noun',
            meaning: 'Jesus (Son of Mary, Messenger and Spirit from Allah)',
            frequency: 25,
            semanticRole: 'Agent',
            sampleVerse: {
              location: '3:45:6',
              text: 'إِذْ قَالَتِ الْمَلَائِكَةُ يَا مَرْيَمُ إِنَّ اللَّهَ يُبَشِّرُكِ بِكَلِمَةٍ مِنْهُ اسْمُهُ الْمَسِيحُ عِيسَى ابْنُ مَرْيَمَ',
              translation: 'The angels said: O Mary! Allah gives you glad tidings of a Word from Him, whose name will be the Messiah, Jesus, son of Mary.',
              surahName: 'Ali Imran'
            }
          },
          {
            id: 'nuh',
            word: 'نُوح',
            transliteration: 'Nūḥ',
            cleanArabic: 'نوح',
            root: 'nwH',
            rootArabic: 'ن و ح',
            grammarCategory: 'Proper noun',
            meaning: 'Noah (First Messenger of Resolve)',
            frequency: 43,
            semanticRole: 'Agent',
            sampleVerse: {
              location: '71:1:3',
              text: 'إِنَّا أَرْسَلْنَا نُوحًا إِلَىٰ قَوْمِهِ',
              translation: 'Indeed, We sent Noah to his people.',
              surahName: 'Nuh'
            }
          },
          {
            id: 'yusuf',
            word: 'يُوسُف',
            transliteration: 'Yūsuf',
            cleanArabic: 'يوسف',
            root: 'ywsf',
            rootArabic: 'ي و س ف',
            grammarCategory: 'Proper noun',
            meaning: 'Joseph (The Truthful Prophet of Beauty and Patience)',
            frequency: 27,
            semanticRole: 'Agent',
            sampleVerse: {
              location: '12:4:4',
              text: 'إِذْ قَالَ يُوسُفُ لِأَبِيهِ يَا أَبَتِ',
              translation: 'When Joseph said to his father: O my father!',
              surahName: 'Yusuf'
            }
          }
        ]
      },
      {
        id: 'divine-scriptures',
        name: 'Sacred Books & Revelation Terms',
        nameArabic: 'الكتب السماوية والآيات والوحي',
        description: 'Scriptures, the Quran, verses, proof-signs, and inspirational speech from God.',
        words: [
          {
            id: 'al-quran',
            word: 'الْقُرْآن',
            transliteration: 'al-Qurʾān',
            cleanArabic: 'القرآن',
            root: 'qrA',
            rootArabic: 'ق ر أ',
            grammarCategory: 'Proper noun',
            meaning: 'The Quran (The Recited Word of Allah)',
            frequency: 70,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '2:185:5',
              text: 'شَهْرُ رَمَضَانَ الَّذِي أُنْزِلَ فِيهِ الْقُرْآنُ',
              translation: 'The month of Ramadan in which was revealed the Quran...',
              surahName: 'Al-Baqarah'
            }
          },
          {
            id: 'al-kitab',
            word: 'الْكِتَاب',
            transliteration: 'al-Kitāb',
            cleanArabic: 'الكتاب',
            root: 'ktb',
            rootArabic: 'ك ت ب',
            grammarCategory: 'Noun',
            meaning: 'The Book, Divine Scripture, Decreed Record',
            frequency: 230,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '2:2:2',
              text: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ',
              translation: 'This is the Book about which there is no doubt.',
              surahName: 'Al-Baqarah'
            }
          },
          {
            id: 'al-tawrah',
            word: 'التَّوْرَاة',
            transliteration: 'al-Tawrāt',
            cleanArabic: 'التوراة',
            root: 'twry',
            rootArabic: 'ت و ر ى',
            grammarCategory: 'Proper noun',
            meaning: 'The Torah (Revelation given to Moses)',
            frequency: 18,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '5:44:2',
              text: 'إِنَّا أَنْزَلْنَا التَّوْرَاةَ فِيهَا هُدًى وَنُورٌ',
              translation: 'Indeed, We revealed the Torah, wherein was guidance and light.',
              surahName: 'Al-Ma\'idah'
            }
          },
          {
            id: 'al-injil',
            word: 'الْإِنْجِيل',
            transliteration: 'al-Injīl',
            cleanArabic: 'الإنجيل',
            root: 'njl',
            rootArabic: 'ن ج ل',
            grammarCategory: 'Proper noun',
            meaning: 'The Gospel (Revelation given to Jesus)',
            frequency: 12,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '5:46:11',
              text: 'وَآتَيْنَاهُ الْإِنْجِيلَ فِيهِ هُدًى وَنُورٌ',
              translation: 'And We gave him the Gospel, in which was guidance and light...',
              surahName: 'Al-Ma\'idah'
            }
          },
          {
            id: 'ayah',
            word: 'آيَة',
            transliteration: 'āyah',
            cleanArabic: 'آية',
            root: 'Ayy',
            rootArabic: 'أ ي ي',
            grammarCategory: 'Noun',
            meaning: 'Verse, Miraculous Sign, Divine Evidence',
            frequency: 382,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '2:106:3',
              text: 'مَا نَنْسَخْ مِنْ آيَةٍ أَوْ نُنْسِهَا نَأْتِ بِخَيْرٍ مِنْهَا',
              translation: 'We do not abrogate a verse or cause it to be forgotten except that We bring [one] better than it...',
              surahName: 'Al-Baqarah'
            }
          },
          {
            id: 'al-wahy',
            word: 'الْوَحْي',
            transliteration: 'al-Waḥy',
            cleanArabic: 'الوحي',
            root: 'wHy',
            rootArabic: 'و ح ي',
            grammarCategory: 'Verbal noun',
            meaning: 'Divine Inspiration, Revelation',
            frequency: 78,
            semanticRole: 'Action',
            sampleVerse: {
              location: '53:4:3',
              text: 'إِنْ هُوَ إِلَّا وَحْيٌ يُوحَىٰ',
              translation: 'It is not but a revelation revealed.',
              surahName: 'An-Najm'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'afterlife-eschatology',
    name: 'Eschatology & The Hereafter',
    nameArabic: 'الغيبيات واليوم الآخر والجنة والنار',
    description: 'The Day of Resurrection, Final Judgment, Scales of Justice, Eternal Gardens of Paradise, and the Hellfire.',
    iconName: 'Flame',
    color: 'rose',
    totalWordsCount: 27,
    totalOccurrences: 2840,
    subcategories: [
      {
        id: 'resurrection-judgment',
        name: 'The Hour & Resurrection',
        nameArabic: 'يوم القيامة والساعة والبعث والحساب',
        description: 'Cosmic upheaval, the blowing of the Trumpet, bodily resurrection, and standing before Allah.',
        words: [
          {
            id: 'al-qiyamah',
            word: 'الْقِيَامَة',
            transliteration: 'al-Qiyāmah',
            cleanArabic: 'القيامة',
            root: 'qwm',
            rootArabic: 'ق و م',
            grammarCategory: 'Noun',
            meaning: 'The Resurrection, Standing before God',
            frequency: 70,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '75:1:3',
              text: 'لَا أُقْسِمُ بِيَوْمِ الْقِيَامَةِ',
              translation: 'I swear by the Day of Resurrection!',
              surahName: 'Al-Qiyamah'
            }
          },
          {
            id: 'al-saah',
            word: 'السَّاعَة',
            transliteration: 'al-Sāʿah',
            cleanArabic: 'الساعة',
            root: 'swE',
            rootArabic: 'س و ع',
            grammarCategory: 'Noun',
            meaning: 'The Inevitable Hour of Reckoning',
            frequency: 48,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '20:15:2',
              text: 'إِنَّ السَّاعَةَ آتِيَةٌ أَكَادُ أُخْفِيهَا',
              translation: 'Indeed, the Hour is coming - I almost hide it...',
              surahName: 'Taha'
            }
          },
          {
            id: 'al-hisab',
            word: 'الْحِسَاب',
            transliteration: 'al-Ḥisāb',
            cleanArabic: 'الحساب',
            root: 'Hsb',
            rootArabic: 'ح س ب',
            grammarCategory: 'Noun',
            meaning: 'The Final Reckoning, Account of deeds',
            frequency: 39,
            semanticRole: 'Action',
            sampleVerse: {
              location: '14:41:8',
              text: 'رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ',
              translation: 'Our Lord, forgive me and my parents and the believers the Day the account is established.',
              surahName: 'Ibrahim'
            }
          },
          {
            id: 'al-mizan',
            word: 'الْمِيزَان',
            transliteration: 'al-Mīzān',
            cleanArabic: 'الميزان',
            root: 'wzn',
            rootArabic: 'و ز ن',
            grammarCategory: 'Noun of instrument',
            meaning: 'The Scales of Absolute Justice',
            frequency: 9,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '21:47:2',
              text: 'وَنَضَعُ الْمَوَازِينَ الْقِسْطَ لِيَوْمِ الْقِيَامَةِ',
              translation: 'And We place the scales of justice for the Day of Resurrection...',
              surahName: 'Al-Anbiya'
            }
          }
        ]
      },
      {
        id: 'paradise-bliss',
        name: 'Paradise & Eternal Bliss (Jannah)',
        nameArabic: 'الجنة والنعيم والخلود ورضوان الله',
        description: 'The Abode of Peace, lush flowing gardens, pure companions, and the beatific vision.',
        words: [
          {
            id: 'al-jannah',
            word: 'الْجَنَّة',
            transliteration: 'al-Jannah',
            cleanArabic: 'الجنة',
            root: 'jnn',
            rootArabic: 'ج ن ن',
            grammarCategory: 'Noun',
            meaning: 'The Garden, Paradise, Abode of Eternal Peace',
            frequency: 147,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '2:35:5',
              text: 'يَا آدَمُ اسْكُنْ أَنْتَ وَزَوْجُكَ الْجَنَّةَ',
              translation: 'O Adam, dwell, you and your wife, in Paradise...',
              surahName: 'Al-Baqarah'
            }
          },
          {
            id: 'al-firdaws',
            word: 'الْفِرْدَوْس',
            transliteration: 'al-Firdaws',
            cleanArabic: 'الفردوس',
            root: 'frds',
            rootArabic: 'ف ر د س',
            grammarCategory: 'Proper noun',
            meaning: 'Firdaus (The Highest Pinnacle of Paradise)',
            frequency: 2,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '18:107:7',
              text: 'كَانَتْ لَهُمْ جَنَّاتُ الْفِرْدَوْسِ نُزُلًا',
              translation: '...will have the Gardens of Paradise as a lodging.',
              surahName: 'Al-Kahf'
            }
          },
          {
            id: 'al-naim',
            word: 'النَّعِيم',
            transliteration: 'al-Naʿīm',
            cleanArabic: 'النعيم',
            root: 'nEm',
            rootArabic: 'ن ع م',
            grammarCategory: 'Noun',
            meaning: 'Supreme Bliss, Perpetual Delight',
            frequency: 33,
            semanticRole: 'Attribute',
            sampleVerse: {
              location: '83:22:3',
              text: 'إِنَّ الْأَبْرَارَ لَفِي نَعِيمٍ',
              translation: 'Indeed, the righteous will be in pleasure.',
              surahName: 'Al-Mutaffifin'
            }
          },
          {
            id: 'al-kawthar',
            word: 'الْكَوْثَر',
            transliteration: 'al-Kawthar',
            cleanArabic: 'الكوثر',
            root: 'kvr',
            rootArabic: 'ك ث ر',
            grammarCategory: 'Noun',
            meaning: 'Abundance, River of Paradise given to the Prophet',
            frequency: 1,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '108:1:3',
              text: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
              translation: 'Indeed, We have granted you, [O Muhammad], al-Kawthar.',
              surahName: 'Al-Kawthar'
            }
          }
        ]
      },
      {
        id: 'hellfire-punishment',
        name: 'Hellfire & Retribution (Jahannam)',
        nameArabic: 'النار وجهنم والجحيم والعذاب',
        description: 'The Blazing Abyss, torment of the unrepentant, searing winds, and chains of retribution.',
        words: [
          {
            id: 'jahannam',
            word: 'جَهَنَّم',
            transliteration: 'Jahannam',
            cleanArabic: 'جهنم',
            root: 'jhnm',
            rootArabic: 'ج هـ ن م',
            grammarCategory: 'Proper noun',
            meaning: 'Hell, The Gehenna Abyss',
            frequency: 77,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '2:206:8',
              text: 'فَحَسْبُهُ جَهَنَّمُ وَلَبِئْسَ الْمِهَادُ',
              translation: 'Then Hell is sufficient for him, and how wretched is the resting place!',
              surahName: 'Al-Baqarah'
            }
          },
          {
            id: 'al-nar',
            word: 'النَّار',
            transliteration: 'al-Nār',
            cleanArabic: 'النار',
            root: 'nwr',
            rootArabic: 'ن و ر',
            grammarCategory: 'Noun',
            meaning: 'The Fire, Blazing Torment',
            frequency: 145,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '2:24:10',
              text: 'فَاتَّقُوا النَّارَ الَّتِي وَقُودُهَا النَّاسُ وَالْحِجَارَةُ',
              translation: 'Then fear the Fire, whose fuel is men and stones...',
              surahName: 'Al-Baqarah'
            }
          },
          {
            id: 'al-adhab',
            word: 'الْعَذَاب',
            transliteration: 'al-ʿAdhāb',
            cleanArabic: 'العذاب',
            root: 'E*b',
            rootArabic: 'ع ذ ب',
            grammarCategory: 'Noun',
            meaning: 'Punishment, Penalty, Torment',
            frequency: 322,
            semanticRole: 'Attribute',
            sampleVerse: {
              location: '2:7:12',
              text: 'وَلَهُمْ عَذَابٌ عَظِيمٌ',
              translation: 'And for them is a great punishment.',
              surahName: 'Al-Baqarah'
            }
          },
          {
            id: 'al-zaqqum',
            word: 'الزَّقُّوم',
            transliteration: 'al-Zaqqūm',
            cleanArabic: 'الزقوم',
            root: 'zqm',
            rootArabic: 'ز ق م',
            grammarCategory: 'Noun',
            meaning: 'Tree of Zaqqum (Bitter tree of Hell)',
            frequency: 3,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '44:43:3',
              text: 'إِنَّ شَجَرَتَ الزَّقُّومِ طَعَامُ الْأَثِيمِ',
              translation: 'Indeed, the tree of Zaqqum is food for the sinful.',
              surahName: 'Ad-Dukhan'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'faith-ethics',
    name: 'Faith, Ethics & Spirituality',
    nameArabic: 'الإيمان والأخلاق والتزكية والفضائل',
    description: 'Spiritual consciousness (Taqwa), patience (Sabr), gratitude (Shukr), truthfulness, repentance, and the purification of the heart.',
    iconName: 'Heart',
    color: 'teal',
    totalWordsCount: 25,
    totalOccurrences: 3890,
    subcategories: [
      {
        id: 'virtues-spirituality',
        name: 'Noble Virtues & Spiritual States',
        nameArabic: 'الفضائل والتقوى والإحسان واليقين',
        description: 'Heart-felt virtues that define the righteous character in the sight of Allah.',
        words: [
          {
            id: 'al-iman',
            word: 'الْإِيمَان',
            transliteration: 'al-Īmān',
            cleanArabic: 'الإيمان',
            root: 'Amn',
            rootArabic: 'أ م ن',
            grammarCategory: 'Verbal noun',
            meaning: 'True Faith, Belief, Inner Security in God',
            frequency: 45,
            semanticRole: 'Attribute',
            sampleVerse: {
              location: '49:14:14',
              text: 'وَلَمَّا يَدْخُلِ الْإِيمَانُ فِي قُلُوبِكُمْ',
              translation: '...for faith has not yet entered your hearts.',
              surahName: 'Al-Hujurat'
            }
          },
          {
            id: 'al-taqwa',
            word: 'التَّقْوَىٰ',
            transliteration: 'al-Taqwā',
            cleanArabic: 'التقوى',
            root: 'wqy',
            rootArabic: 'و ق ي',
            grammarCategory: 'Noun',
            meaning: 'God-consciousness, Piety, Reverent Awe',
            frequency: 17,
            semanticRole: 'Attribute',
            sampleVerse: {
              location: '2:197:23',
              text: 'وَتَزَوَّدُوا فَإِنَّ خَيْرَ الزَّادِ التَّقْوَىٰ',
              translation: 'And take provisions, but indeed, the best provision is fear of Allah.',
              surahName: 'Al-Baqarah'
            }
          },
          {
            id: 'al-sabr',
            word: 'الصَّبْر',
            transliteration: 'al-Ṣabr',
            cleanArabic: 'الصبر',
            root: 'Sbr',
            rootArabic: 'ص ب ر',
            grammarCategory: 'Noun',
            meaning: 'Patience, Steadfast Perseverance, Endurance',
            frequency: 103,
            semanticRole: 'Attribute',
            sampleVerse: {
              location: '2:153:4',
              text: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ',
              translation: 'O you who have believed, seek help through patience and prayer.',
              surahName: 'Al-Baqarah'
            }
          },
          {
            id: 'al-shukr',
            word: 'الشُّكْر',
            transliteration: 'al-Shukr',
            cleanArabic: 'الشكر',
            root: '$kr',
            rootArabic: 'ش ك ر',
            grammarCategory: 'Noun',
            meaning: 'Gratitude, Thankfulness to God and people',
            frequency: 75,
            semanticRole: 'Attribute',
            sampleVerse: {
              location: '14:7:5',
              text: 'لَئِنْ شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
              translation: 'If you are grateful, I will surely increase you [in favor]...',
              surahName: 'Ibrahim'
            }
          },
          {
            id: 'al-ihsan',
            word: 'الْإِحْسَان',
            transliteration: 'al-Iḥsān',
            cleanArabic: 'الإحسان',
            root: 'Hsn',
            rootArabic: 'ح س ن',
            grammarCategory: 'Verbal noun',
            meaning: 'Spiritual Excellence, Beneficence, Beautiful Conduct',
            frequency: 12,
            semanticRole: 'Attribute',
            sampleVerse: {
              location: '16:90:5',
              text: 'إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ',
              translation: 'Indeed, Allah orders justice and good conduct...',
              surahName: 'An-Nahl'
            }
          },
          {
            id: 'al-sidq',
            word: 'الصِّدْق',
            transliteration: 'al-Ṣidq',
            cleanArabic: 'الصدق',
            root: 'Sdq',
            rootArabic: 'ص د ق',
            grammarCategory: 'Noun',
            meaning: 'Truthfulness, Sincerity, Integrity',
            frequency: 155,
            semanticRole: 'Attribute',
            sampleVerse: {
              location: '9:119:7',
              text: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَكُونُوا مَعَ الصَّادِقِينَ',
              translation: 'O you who have believed, fear Allah and be with those who are true.',
              surahName: 'At-Tawbah'
            }
          },
          {
            id: 'al-tawbah',
            word: 'التَّوْبَة',
            transliteration: 'al-Tawbah',
            cleanArabic: 'التوبة',
            root: 'twb',
            rootArabic: 'ت و ب',
            grammarCategory: 'Noun',
            meaning: 'Sincere Repentance, Turning back to God',
            frequency: 87,
            semanticRole: 'Action',
            sampleVerse: {
              location: '66:8:6',
              text: 'تُوبُوا إِلَى اللَّهِ تَوْبَةً نَصُوحًا',
              translation: 'Repent to Allah with sincere repentance.',
              surahName: 'At-Tahrim'
            }
          }
        ]
      },
      {
        id: 'vices-sins',
        name: 'Vices, Sins & Heart Diseases',
        nameArabic: 'الرذائل والكبائر وأمراض القلوب',
        description: 'Spiritual afflictions that corrupt the soul, such as hypocrisy, arrogance, and transgression.',
        words: [
          {
            id: 'al-kufr',
            word: 'الْكُفْر',
            transliteration: 'al-Kufr',
            cleanArabic: 'الكفر',
            root: 'kfr',
            rootArabic: 'ك ف ر',
            grammarCategory: 'Noun',
            meaning: 'Disbelief, Ingratitude, Covering truth',
            frequency: 525,
            semanticRole: 'Attribute',
            sampleVerse: {
              location: '2:6:4',
              text: 'إِنَّ الَّذِينَ كَفَرُوا سَوَاءٌ عَلَيْهِمْ',
              translation: 'Indeed, those who disbelieve - it is all the same for them...',
              surahName: 'Al-Baqarah'
            }
          },
          {
            id: 'al-nifaq',
            word: 'النِّفَاق',
            transliteration: 'al-Nifāq',
            cleanArabic: 'النفاق',
            root: 'nfq',
            rootArabic: 'ن ف ق',
            grammarCategory: 'Noun',
            meaning: 'Hypocrisy, Two-faced deception',
            frequency: 37,
            semanticRole: 'Attribute',
            sampleVerse: {
              location: '4:145:3',
              text: 'إِنَّ الْمُنَافِقِينَ فِي الدَّرْكِ الْأَسْفَلِ مِنَ النَّارِ',
              translation: 'Indeed, the hypocrites will be in the lowest depths of the Fire...',
              surahName: 'An-Nisa'
            }
          },
          {
            id: 'al-kibr',
            word: 'الْكِبْر',
            transliteration: 'al-Kibr',
            cleanArabic: 'الكبر',
            root: 'kbr',
            rootArabic: 'ك ب ر',
            grammarCategory: 'Noun',
            meaning: 'Arrogance, Pride, Looking down on others',
            frequency: 161,
            semanticRole: 'Attribute',
            sampleVerse: {
              location: '40:56:11',
              text: 'إِنْ فِي صُدُورِهِمْ إِلَّا كِبْرٌ',
              translation: 'There is nothing in their breasts except pride...',
              surahName: 'Ghafir'
            }
          },
          {
            id: 'al-zulm',
            word: 'الظُّلْم',
            transliteration: 'al-Ẓulm',
            cleanArabic: 'الظلم',
            root: 'Zlm',
            rootArabic: 'ظ ل م',
            grammarCategory: 'Noun',
            meaning: 'Injustice, Oppression, Transgression',
            frequency: 315,
            semanticRole: 'Action',
            sampleVerse: {
              location: '31:13:12',
              text: 'إِنَّ الشِّرْكَ لَظُلْمٌ عَظِيمٌ',
              translation: 'Indeed, association [with Allah] is great injustice.',
              surahName: 'Luqman'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'worship-rituals',
    name: 'Worship, Rituals & Devotion',
    nameArabic: 'العبادات والشعائر والصلاة والزكاة والحج',
    description: 'The Pillars of Islam, physical and financial acts of devotion, pilgrimage rites, and sacred sanctuaries.',
    iconName: 'Compass',
    color: 'sky',
    totalWordsCount: 24,
    totalOccurrences: 2150,
    subcategories: [
      {
        id: 'prayer-prostration',
        name: 'Prayer, Prostration & Mosques',
        nameArabic: 'الصلاة والركوع والسجود والمساجد',
        description: 'Terms concerning ritual prayer, bowing, touching foreheads to the ground, and houses of worship.',
        words: [
          {
            id: 'al-salah',
            word: 'الصَّلَاة',
            transliteration: 'al-Ṣalāh',
            cleanArabic: 'الصلاة',
            root: 'Slw',
            rootArabic: 'ص ل و',
            grammarCategory: 'Noun',
            meaning: 'The Prescribed Ritual Prayer',
            frequency: 83,
            semanticRole: 'Action',
            sampleVerse: {
              location: '2:43:2',
              text: 'وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ',
              translation: 'And establish prayer and give zakah and bow with those who bow.',
              surahName: 'Al-Baqarah'
            }
          },
          {
            id: 'al-sujud',
            word: 'السُّجُود',
            transliteration: 'al-Sujūd',
            cleanArabic: 'السجود',
            root: 'sjd',
            rootArabic: 'س ج د',
            grammarCategory: 'Verbal noun',
            meaning: 'Prostration, Utmost Humility before Allah',
            frequency: 92,
            semanticRole: 'Action',
            sampleVerse: {
              location: '96:19:6',
              text: 'كَلَّا لَا تُطِعْهُ وَاسْجُدْ وَاقْتَرِبْ',
              translation: 'No! Do not obey him. But prostrate and draw near [to Allah].',
              surahName: 'Al-Alaq'
            }
          },
          {
            id: 'al-ruku',
            word: 'الرُّكُوع',
            transliteration: 'al-Rukūʿ',
            cleanArabic: 'الركوع',
            root: 'rkE',
            rootArabic: 'ر ك ع',
            grammarCategory: 'Verbal noun',
            meaning: 'Bowing down reverently in worship',
            frequency: 13,
            semanticRole: 'Action',
            sampleVerse: {
              location: '22:77:4',
              text: 'يَا أَيُّهَا الَّذِينَ آمَنُوا ارْكَعُوا وَاسْجُدُوا',
              translation: 'O you who have believed, bow and prostrate...',
              surahName: 'Al-Hajj'
            }
          },
          {
            id: 'al-masjid',
            word: 'الْمَسْجِد',
            transliteration: 'al-Masjid',
            cleanArabic: 'المسجد',
            root: 'sjd',
            rootArabic: 'س ج د',
            grammarCategory: 'Noun of place',
            meaning: 'Mosque, Place of Prostration',
            frequency: 28,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '9:18:3',
              text: 'إِنَّمَا يَعْمُرُ مَسَاجِدَ اللَّهِ مَنْ آمَنَ بِاللَّهِ وَالْيَوْمِ الْآخِرِ',
              translation: 'The mosques of Allah are only to be maintained by those who believe in Allah and the Last Day...',
              surahName: 'At-Tawbah'
            }
          },
          {
            id: 'al-qiblah',
            word: 'الْقِبْلَة',
            transliteration: 'al-Qiblah',
            cleanArabic: 'القبلة',
            root: 'qbl',
            rootArabic: 'ق ب ل',
            grammarCategory: 'Noun',
            meaning: 'Direction of Prayer towards the Kaaba',
            frequency: 7,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '2:142:15',
              text: 'مَا وَلَّاهُمْ عَنْ قِبْلَتِهِمُ الَّتِي كَانُوا عَلَيْهَا',
              translation: 'What has turned them from their qiblah toward which they used to face?',
              surahName: 'Al-Baqarah'
            }
          }
        ]
      },
      {
        id: 'zakah-hajj-fasting',
        name: 'Zakah, Fasting & Pilgrimage',
        nameArabic: 'الزكاة والصدقة والصوم والحج والعمرة',
        description: 'Almsgiving, Ramadan fast, and pilgrimage rites at Mecca.',
        words: [
          {
            id: 'al-zakah',
            word: 'الزَّكَاة',
            transliteration: 'al-Zakāh',
            cleanArabic: 'الزكاة',
            root: 'zkw',
            rootArabic: 'ز ك و',
            grammarCategory: 'Noun',
            meaning: 'Purifying Alms, Obligatory Charity',
            frequency: 32,
            semanticRole: 'Action',
            sampleVerse: {
              location: '24:56:3',
              text: 'وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَأَطِيعُوا الرَّسُولَ',
              translation: 'And establish prayer and give zakah and obey the Messenger...',
              surahName: 'An-Nur'
            }
          },
          {
            id: 'al-sawm',
            word: 'الصَّوْم',
            transliteration: 'al-Ṣawm',
            cleanArabic: 'الصوم',
            root: 'Swm',
            rootArabic: 'ص و م',
            grammarCategory: 'Noun',
            meaning: 'Fasting, Abstaining from dawn till dusk',
            frequency: 14,
            semanticRole: 'Action',
            sampleVerse: {
              location: '2:183:4',
              text: 'كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِنْ قَبْلِكُمْ',
              translation: 'Decreed upon you is fasting as it was decreed upon those before you...',
              surahName: 'Al-Baqarah'
            }
          },
          {
            id: 'al-hajj',
            word: 'الْحَجّ',
            transliteration: 'al-Ḥajj',
            cleanArabic: 'الحج',
            root: 'Hjj',
            rootArabic: 'ح ج ج',
            grammarCategory: 'Noun',
            meaning: 'The Sacred Pilgrimage to Mecca',
            frequency: 12,
            semanticRole: 'Action',
            sampleVerse: {
              location: '3:97:8',
              text: 'وَلِلَّهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ مَنِ اسْتَطَاعَ إِلَيْهِ سَبِيلًا',
              translation: 'And [due] to Allah from the people is a pilgrimage to the House...',
              surahName: 'Ali Imran'
            }
          },
          {
            id: 'al-kabah',
            word: 'الْكَعْبَة',
            transliteration: 'al-Kaʿbah',
            cleanArabic: 'الكعبة',
            root: 'kEb',
            rootArabic: 'ك ع ب',
            grammarCategory: 'Proper noun',
            meaning: 'The Kaaba, The Primordial Sacred House',
            frequency: 2,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '5:97:3',
              text: 'جَعَلَ اللَّهُ الْكَعْبَةَ الْبَيْتَ الْحَرَامَ قِيَامًا لِلنَّاسِ',
              translation: 'Allah has made the Kaaba, the Sacred House, an asylum of security for people...',
              surahName: 'Al-Ma\'idah'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'cosmology-nature',
    name: 'Cosmology, Nature & Creation',
    nameArabic: 'الكون والطبيعة والآفاق والمخلوقات',
    description: 'The heavens and earth, celestial orbits, water cycles, plants, animals, and the cosmic order.',
    iconName: 'Sun',
    color: 'amber',
    totalWordsCount: 29,
    totalOccurrences: 3120,
    subcategories: [
      {
        id: 'sky-celestial',
        name: 'Heavens, Stars & Planetary Orbits',
        nameArabic: 'السماوات والشمس والقمر والنجوم',
        description: 'Cosmic bodies and celestial mechanics pointing to Divine Design.',
        words: [
          {
            id: 'al-sama',
            word: 'السَّمَاء',
            transliteration: 'al-Samāʾ',
            cleanArabic: 'السماء',
            root: 'smw',
            rootArabic: 'س م و',
            grammarCategory: 'Noun',
            meaning: 'The Sky, The Seven Heavens',
            frequency: 310,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '2:22:5',
              text: 'الَّذِي جَعَلَ لَكُمُ الْأَرْضَ فِرَاشًا وَالسَّمَاءَ بِنَاءً',
              translation: '[He] who made for you the earth a bed [spread out] and the sky a ceiling...',
              surahName: 'Al-Baqarah'
            }
          },
          {
            id: 'al-shams',
            word: 'الشَّمْس',
            transliteration: 'al-Shams',
            cleanArabic: 'الشمس',
            root: '$ms',
            rootArabic: 'ش م س',
            grammarCategory: 'Noun',
            meaning: 'The Sun, Radiating lamp of the cosmos',
            frequency: 33,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '91:1:1',
              text: 'وَالشَّمْسِ وَضُحَاهَا',
              translation: 'By the sun and its brightness!',
              surahName: 'Ash-Shams'
            }
          },
          {
            id: 'al-qamar',
            word: 'الْقَمَر',
            transliteration: 'al-Qamar',
            cleanArabic: 'القمر',
            root: 'qmr',
            rootArabic: 'ق م ر',
            grammarCategory: 'Noun',
            meaning: 'The Moon, Reflecting light with calibrated phases',
            frequency: 27,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '54:1:3',
              text: 'اقْتَرَبَتِ السَّاعَةُ وَانْشَقَّ الْقَمَرُ',
              translation: 'The Hour has come near, and the moon has split [in two].',
              surahName: 'Al-Qamar'
            }
          },
          {
            id: 'al-najm',
            word: 'النَّجْم',
            transliteration: 'al-Najm',
            cleanArabic: 'النجم',
            root: 'njm',
            rootArabic: 'ن ج م',
            grammarCategory: 'Noun',
            meaning: 'The Star, Celestial navigator in darkness',
            frequency: 13,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '53:1:1',
              text: 'وَالنَّجْمِ إِذَا هَوَىٰ',
              translation: 'By the star when it descends!',
              surahName: 'An-Najm'
            }
          },
          {
            id: 'al-layl-al-nahar',
            word: 'اللَّيْل وَالنَّهَار',
            transliteration: 'al-Layl wa-l-Nahār',
            cleanArabic: 'الليل والنهار',
            root: 'lyl',
            rootArabic: 'ل ي ل',
            grammarCategory: 'Noun phrase',
            meaning: 'Night and Day, The Perpetual Cosmic Cycle',
            frequency: 149,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '3:190:4',
              text: 'إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ وَاخْتِلَافِ اللَّيْلِ وَالنَّهَارِ لَآيَاتٍ لِأُولِي الْأَلْبَابِ',
              translation: 'Indeed, in the creation of the heavens and earth and the alternation of night and day are signs for those of understanding.',
              surahName: 'Ali Imran'
            }
          }
        ]
      },
      {
        id: 'earth-water-elements',
        name: 'Earth, Oceans & Water Life',
        nameArabic: 'الأرض والبحار والأنهار والجبال والماء',
        description: 'Terrestrial wonders, oceans, mountains like stabilizing pegs, and life-giving rainfall.',
        words: [
          {
            id: 'al-ard',
            word: 'الْأَرْض',
            transliteration: 'al-Arḍ',
            cleanArabic: 'الأرض',
            root: 'ArD',
            rootArabic: 'أ ر ض',
            grammarCategory: 'Noun',
            meaning: 'The Earth, Habitation for humankind',
            frequency: 461,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '2:29:4',
              text: 'هُوَ الَّذِي خَلَقَ لَكُمْ مَا فِي الْأَرْضِ جَمِيعًا',
              translation: 'It is He who created for you all of that which is on the earth.',
              surahName: 'Al-Baqarah'
            }
          },
          {
            id: 'al-jibal',
            word: 'الْجِبَال',
            transliteration: 'al-Jibāl',
            cleanArabic: 'الجبال',
            root: 'jbl',
            rootArabic: 'ج ب ل',
            grammarCategory: 'Noun',
            meaning: 'The Mountains, Firm anchors of the crust',
            frequency: 39,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '78:7:2',
              text: 'وَالْجِبَالَ أَوْتَادًا',
              translation: 'And the mountains as pegs?',
              surahName: 'An-Naba'
            }
          },
          {
            id: 'al-bahr',
            word: 'الْبَحْر',
            transliteration: 'al-Baḥr',
            cleanArabic: 'البحر',
            root: 'bHr',
            rootArabic: 'ب ح ر',
            grammarCategory: 'Noun',
            meaning: 'The Sea, Vast Ocean',
            frequency: 41,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '24:40:4',
              text: 'أَوْ كَظُلُمَاتٍ فِي بَحْرٍ لُجِّيٍّ يَغْشَاهُ مَوْجٌ',
              translation: 'Or [they are] like darknesses within an unfathomable sea which is covered by waves...',
              surahName: 'An-Nur'
            }
          },
          {
            id: 'al-ma',
            word: 'الْمَاء',
            transliteration: 'al-Māʾ',
            cleanArabic: 'الماء',
            root: 'mwh',
            rootArabic: 'م و هـ',
            grammarCategory: 'Noun',
            meaning: 'Water, The Origin of all biological life',
            frequency: 63,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '21:30:17',
              text: 'وَجَعَلْنَا مِنَ الْمَاءِ كُلَّ شَيْءٍ حَيٍّ',
              translation: '...and made from water every living thing? Then will they not believe?',
              surahName: 'Al-Anbiya'
            }
          }
        ]
      },
      {
        id: 'flora-fauna',
        name: 'Flora & Fauna (Living Creatures & Plants)',
        nameArabic: 'الحيوان والدواب والطيور والنبات والأشجار',
        description: 'Animals, insects, trees, dates, olives, and bees mentioned throughout the Quran.',
        words: [
          {
            id: 'al-nahl',
            word: 'النَّحْل',
            transliteration: 'al-Naḥl',
            cleanArabic: 'النحل',
            root: 'nHl',
            rootArabic: 'ن ح ل',
            grammarCategory: 'Noun',
            meaning: 'The Bee (Inspired architect of sweet healing)',
            frequency: 1,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '16:68:3',
              text: 'وَأَوْحَىٰ رَبُّكَ إِلَى النَّحْلِ أَنِ اتَّخِذِي مِنَ الْجِبَالِ بُيُوتًا',
              translation: 'And your Lord inspired to the bee: Take for yourself among the mountains, houses...',
              surahName: 'An-Nahl'
            }
          },
          {
            id: 'al-naml',
            word: 'النَّمْل',
            transliteration: 'al-Naml',
            cleanArabic: 'النمل',
            root: 'nml',
            rootArabic: 'ن م ل',
            grammarCategory: 'Noun',
            meaning: 'The Ant (Vocal organized society)',
            frequency: 3,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '27:18:6',
              text: 'قَالَتْ نَمْلَةٌ يَا أَيُّهَا النَّمْلُ ادْخُلُوا مَسَاكِنَكُمْ',
              translation: 'An ant said: O ants, enter your dwellings...',
              surahName: 'An-Naml'
            }
          },
          {
            id: 'al-ibil',
            word: 'الْإِبِل',
            transliteration: 'al-Ibil',
            cleanArabic: 'الإبل',
            root: 'Abl',
            rootArabic: 'أ ب ل',
            grammarCategory: 'Noun',
            meaning: 'The Camels (Marvels of anatomical adaptation)',
            frequency: 2,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '88:17:4',
              text: 'أَفَلَا يَنْظُرُونَ إِلَى الْإِبِلِ كَيْفَ خُلِقَتْ',
              translation: 'Then do they not look at the camels - how they are created?',
              surahName: 'Al-Ghashiyah'
            }
          },
          {
            id: 'al-nakhil',
            word: 'النَّخِيل',
            transliteration: 'al-Nakhīl',
            cleanArabic: 'النخيل',
            root: 'nxl',
            rootArabic: 'ن خ ل',
            grammarCategory: 'Noun',
            meaning: 'Date Palm Trees',
            frequency: 20,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '16:11:7',
              text: 'يُنْبِتُ لَكُمْ بِهِ الزَّرْعَ وَالزَّيْتُونَ وَالنَّخِيلَ وَالْأَعْنَابَ',
              translation: 'He causes to grow for you thereby the crops, olives, palm trees, grapevines...',
              surahName: 'An-Nahl'
            }
          },
          {
            id: 'al-zaytun',
            word: 'الزَّيْتُون',
            transliteration: 'al-Zaytūn',
            cleanArabic: 'الزيتون',
            root: 'zyt',
            rootArabic: 'ز ي ت',
            grammarCategory: 'Noun',
            meaning: 'The Olive Tree & Its Blessed Oil',
            frequency: 6,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '95:1:2',
              text: 'وَالتِّينِ وَالزَّيْتُونِ',
              translation: 'By the fig and the olive!',
              surahName: 'At-Tin'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'humanity-body',
    name: 'Humanity, Anatomy & Senses',
    nameArabic: 'الإنسان والبدن والجوارح والحواس',
    description: 'Embryology, the soul, physical organs, hearing, sight, and cognitive faculties.',
    iconName: 'Activity',
    color: 'purple',
    totalWordsCount: 22,
    totalOccurrences: 2780,
    subcategories: [
      {
        id: 'creation-organs',
        name: 'Creation Stages & Anatomy',
        nameArabic: 'خلق الإنسان وأعضاء البدن',
        description: 'Clay, drop of fluid, clinging clot, heart, tongue, and skin.',
        words: [
          {
            id: 'al-insan',
            word: 'الْإِنْسَان',
            transliteration: 'al-Insān',
            cleanArabic: 'الإنسان',
            root: 'Ans',
            rootArabic: 'أ ن س',
            grammarCategory: 'Noun',
            meaning: 'The Human Being, Mankind',
            frequency: 65,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '103:2:2',
              text: 'إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ',
              translation: 'Indeed, mankind is in loss.',
              surahName: 'Al-Asr'
            }
          },
          {
            id: 'al-nafs',
            word: 'النَّفْس',
            transliteration: 'al-Nafs',
            cleanArabic: 'النفس',
            root: 'nfs',
            rootArabic: 'ن ف س',
            grammarCategory: 'Noun',
            meaning: 'The Soul, The Self, Inner Conscious Being',
            frequency: 298,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '89:27:3',
              text: 'يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ ارْجِعِي إِلَىٰ رَبِّكِ',
              translation: 'O reassured soul, return to your Lord, well-pleased and pleasing [to Him]...',
              surahName: 'Al-Fajr'
            }
          },
          {
            id: 'al-qalb',
            word: 'الْقَلْب',
            transliteration: 'al-Qalb',
            cleanArabic: 'القلب',
            root: 'qlb',
            rootArabic: 'ق ل ب',
            grammarCategory: 'Noun',
            meaning: 'The Heart, Center of Intellect & Faith',
            frequency: 132,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '13:28:9',
              text: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
              translation: 'Unquestionably, by the remembrance of Allah hearts are assured.',
              surahName: 'Ar-Ra\'d'
            }
          },
          {
            id: 'al-sam-al-basar',
            word: 'السَّمْع وَالْبَصَر',
            transliteration: 'al-Samʿ wa-l-Baṣar',
            cleanArabic: 'السمع والبصر',
            root: 'smE',
            rootArabic: 'س م ع',
            grammarCategory: 'Noun phrase',
            meaning: 'Hearing and Sight (The Primary Senses)',
            frequency: 168,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '16:78:13',
              text: 'وَجَعَلَ لَكُمُ السَّمْعَ وَالْأَبْصَارَ وَالْأَفْئِدَةَ',
              translation: '...and He made for you hearing and vision and intellect...',
              surahName: 'An-Nahl'
            }
          },
          {
            id: 'al-lisan',
            word: 'اللِّسَان',
            transliteration: 'al-Lisān',
            cleanArabic: 'اللسان',
            root: 'lsn',
            rootArabic: 'ل س ن',
            grammarCategory: 'Noun',
            meaning: 'The Tongue, Instrument of Speech & Language',
            frequency: 25,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '90:9:2',
              text: 'وَلِسَانًا وَشَفَتَيْنِ',
              translation: 'And a tongue and two lips?',
              surahName: 'Al-Balad'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'family-society',
    name: 'Family, Society & Human Relations',
    nameArabic: 'الأسرة والمجتمع والوالدان والأمة',
    description: 'Kinship, filial piety toward parents, marriage, community solidarity, and protection of the vulnerable.',
    iconName: 'Users',
    color: 'indigo',
    totalWordsCount: 20,
    totalOccurrences: 1940,
    subcategories: [
      {
        id: 'family-kinship',
        name: 'Parents, Spouses & Children',
        nameArabic: 'بر الوالدين والأزواج والذرية والأرحام',
        description: 'Sacred bonds of marriage, parental love, and generational lineage.',
        words: [
          {
            id: 'al-walidayn',
            word: 'الْوَالِدَيْن',
            transliteration: 'al-Wālidayn',
            cleanArabic: 'الوالدين',
            root: 'wld',
            rootArabic: 'و ل د',
            grammarCategory: 'Dual noun',
            meaning: 'Both Parents (Deserving supreme filial devotion)',
            frequency: 28,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '17:23:7',
              text: 'وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا',
              translation: 'And your Lord has decreed that you not worship except Him, and to parents, good treatment.',
              surahName: 'Al-Isra'
            }
          },
          {
            id: 'al-zawj',
            word: 'الزَّوْج',
            transliteration: 'al-Zawj',
            cleanArabic: 'الزوج',
            root: 'zwj',
            rootArabic: 'ز و ج',
            grammarCategory: 'Noun',
            meaning: 'Spouse, Partner in holy matrimony',
            frequency: 81,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '30:21:6',
              text: 'أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً',
              translation: 'He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy.',
              surahName: 'Ar-Rum'
            }
          },
          {
            id: 'al-dhurriyyah',
            word: 'الذُّرِّيَّة',
            transliteration: 'al-Dhurriyyah',
            cleanArabic: 'الذرية',
            root: '*rr',
            rootArabic: 'ذ ر ر',
            grammarCategory: 'Noun',
            meaning: 'Offspring, Progeny, Righteous lineage',
            frequency: 38,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '25:74:5',
              text: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ',
              translation: 'Our Lord, grant us from among our wives and offspring comfort to our eyes...',
              surahName: 'Al-Furqan'
            }
          },
          {
            id: 'al-yatama',
            word: 'الْيَتَامَىٰ',
            transliteration: 'al-Yatāmā',
            cleanArabic: 'اليتامى',
            root: 'ytm',
            rootArabic: 'ي ت م',
            grammarCategory: 'Plural noun',
            meaning: 'Orphans (Entrusted with special legal protection)',
            frequency: 23,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '4:2:2',
              text: 'وَآتُوا الْيَتَامَىٰ أَمْوَالَهُمْ',
              translation: 'And give to the orphans their properties...',
              surahName: 'An-Nisa'
            }
          },
          {
            id: 'al-masakin',
            word: 'الْمَسَاكِين',
            transliteration: 'al-Masākīn',
            cleanArabic: 'المساكين',
            root: 'skn',
            rootArabic: 'س ك ن',
            grammarCategory: 'Plural noun',
            meaning: 'The Destitute Needy, The Impoverished',
            frequency: 23,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '2:177:18',
              text: 'وَآتَى الْمَالَ عَلَىٰ حُبِّهِ ذَوِي الْقُرْبَىٰ وَالْيَتَامَىٰ وَالْمَسَاكِينَ',
              translation: '...and gives wealth, in spite of love for it, to relatives, orphans, the needy...',
              surahName: 'Al-Baqarah'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'law-governance-commerce',
    name: 'Law, Governance & Transactions',
    nameArabic: 'التشريع والقضاء والمعاملات والعدل',
    description: 'Jurisprudence, contracts, trade ethics, mutual consultation (Shura), and defense.',
    iconName: 'Scale',
    color: 'emerald',
    totalWordsCount: 20,
    totalOccurrences: 1820,
    subcategories: [
      {
        id: 'justice-contracts',
        name: 'Justice, Contracts & Trade',
        nameArabic: 'العدل والقسط والعقود والتجارة',
        description: 'Equitable judgment, covenants, prohibition of usury, and legitimate commerce.',
        words: [
          {
            id: 'al-adl',
            word: 'الْعَدْل',
            transliteration: 'al-ʿAdl',
            cleanArabic: 'العدل',
            root: 'Edl',
            rootArabic: 'ع د ل',
            grammarCategory: 'Noun',
            meaning: 'Justice, Impartial Fairness',
            frequency: 28,
            semanticRole: 'Attribute',
            sampleVerse: {
              location: '4:58:12',
              text: 'وَإِذَا حَكَمْتُمْ بَيْنَ النَّاسِ أَنْ تَحْكُمُوا بِالْعَدْلِ',
              translation: '...and when you judge between people to judge with justice.',
              surahName: 'An-Nisa'
            }
          },
          {
            id: 'al-qist',
            word: 'الْقِسْط',
            transliteration: 'al-Qisṭ',
            cleanArabic: 'القسط',
            root: 'qsT',
            rootArabic: 'ق س ط',
            grammarCategory: 'Noun',
            meaning: 'Absolute Equity, Balanced Measure',
            frequency: 25,
            semanticRole: 'Attribute',
            sampleVerse: {
              location: '5:8:8',
              text: 'كُونُوا قَوَّامِينَ لِلَّهِ شُهَدَاءَ بِالْقِسْطِ',
              translation: 'Be persistently standing firm for Allah, witnesses in justice...',
              surahName: 'Al-Ma\'idah'
            }
          },
          {
            id: 'al-tijarah',
            word: 'التِّجَارَة',
            transliteration: 'al-Tijārah',
            cleanArabic: 'التجارة',
            root: 'tjr',
            rootArabic: 'ت ج ر',
            grammarCategory: 'Noun',
            meaning: 'Trade, Commerce by mutual consent',
            frequency: 9,
            semanticRole: 'Action',
            sampleVerse: {
              location: '4:29:10',
              text: 'إِلَّا أَنْ تَكُونَ تِجَارَةً عَنْ تَرَاضٍ مِنْكُمْ',
              translation: '...except that it be trade [conducted] by mutual consent among you.',
              surahName: 'An-Nisa'
            }
          },
          {
            id: 'al-riba',
            word: 'الرِّبَا',
            transliteration: 'al-Ribā',
            cleanArabic: 'الربا',
            root: 'rbw',
            rootArabic: 'ر ب و',
            grammarCategory: 'Noun',
            meaning: 'Usury, Unjust Exploitative Interest (Prohibited)',
            frequency: 8,
            semanticRole: 'Attribute',
            sampleVerse: {
              location: '2:275:13',
              text: 'وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا',
              translation: '...And Allah has permitted trade and has forbidden interest.',
              surahName: 'Al-Baqarah'
            }
          },
          {
            id: 'al-shura',
            word: 'الشُّورَىٰ',
            transliteration: 'al-Shūrā',
            cleanArabic: 'الشورى',
            root: '$wr',
            rootArabic: 'ش و ر',
            grammarCategory: 'Noun',
            meaning: 'Mutual Consultation, Deliberation',
            frequency: 3,
            semanticRole: 'Action',
            sampleVerse: {
              location: '42:38:7',
              text: 'وَأَمْرُهُمْ شُورَىٰ بَيْنَهُمْ',
              translation: '...and whose affair is [determined by] consultation among themselves...',
              surahName: 'Ash-Shura'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'intellect-communication',
    name: 'Intellect, Language & Reflection',
    nameArabic: 'العقل والتفكر والبيان والتدبر',
    description: 'The faculty of reason, contemplation of signs, speech, wisdom, and profound understanding.',
    iconName: 'Brain',
    color: 'blue',
    totalWordsCount: 20,
    totalOccurrences: 2450,
    subcategories: [
      {
        id: 'reason-reflection',
        name: 'Reason, Wisdom & Deep Contemplation',
        nameArabic: 'العقل والحكمة والتدبر والتفكر',
        description: 'Quranic imperative to think, ponder, and analyze reality.',
        words: [
          {
            id: 'al-aql',
            word: 'الْعَقْل',
            transliteration: 'al-ʿAql (yaʿqilūn)',
            cleanArabic: 'العقل',
            root: 'Eql',
            rootArabic: 'ع ق ل',
            grammarCategory: 'Verb (form I)',
            meaning: 'Reasoning, Discernment, Rational Intellect',
            frequency: 49,
            semanticRole: 'Action',
            sampleVerse: {
              location: '2:44:11',
              text: 'أَفَلَا تَعْقِلُونَ',
              translation: 'Then will you not reason?',
              surahName: 'Al-Baqarah'
            }
          },
          {
            id: 'al-hikmah',
            word: 'الْحِكْمَة',
            transliteration: 'al-Ḥikmah',
            cleanArabic: 'الحكمة',
            root: 'Hkm',
            rootArabic: 'ح ك م',
            grammarCategory: 'Noun',
            meaning: 'Wisdom, Profound discernment & Insight',
            frequency: 20,
            semanticRole: 'Attribute',
            sampleVerse: {
              location: '2:269:2',
              text: 'يُؤْتِي الْحِكْمَةَ مَنْ يَشَاءُ وَمَنْ يُؤْتَ الْحِكْمَةَ فَقَدْ أُوتِيَ خَيْرًا كَثِيرًا',
              translation: 'He gives wisdom to whom He wills, and whoever has been given wisdom has certainly been given much good.',
              surahName: 'Al-Baqarah'
            }
          },
          {
            id: 'al-tadabbur',
            word: 'التَّدَبُّر',
            transliteration: 'al-Tadabbur (yatadabbarūn)',
            cleanArabic: 'التدبر',
            root: 'dbr',
            rootArabic: 'د ب ر',
            grammarCategory: 'Verb (form V)',
            meaning: 'Deep Contemplative Reflection on the Quran',
            frequency: 4,
            semanticRole: 'Action',
            sampleVerse: {
              location: '47:24:2',
              text: 'أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ أَمْ عَلَىٰ قُلُوبٍ أَقْفَالُهَا',
              translation: 'Then do they not reflect upon the Quran, or are there locks upon [their] hearts?',
              surahName: 'Muhammad'
            }
          },
          {
            id: 'al-bayan',
            word: 'الْبَيَان',
            transliteration: 'al-Bayān',
            cleanArabic: 'البيان',
            root: 'byn',
            rootArabic: 'ب ي ن',
            grammarCategory: 'Noun',
            meaning: 'Lucid Speech, Eloquence, Clear Exposition',
            frequency: 3,
            semanticRole: 'Attribute',
            sampleVerse: {
              location: '55:4:2',
              text: 'عَلَّمَهُ الْبَيَانَ',
              translation: 'He taught him eloquent speech.',
              surahName: 'Ar-Rahman'
            }
          },
          {
            id: 'al-ilm',
            word: 'الْعِلْم',
            transliteration: 'al-ʿIlm',
            cleanArabic: 'العلم',
            root: 'Elm',
            rootArabic: 'ع ل م',
            grammarCategory: 'Noun',
            meaning: 'Knowledge, Truthful Realization',
            frequency: 105,
            semanticRole: 'Attribute',
            sampleVerse: {
              location: '20:114:14',
              text: 'وَقُلْ رَبِّ زِدْنِي عِلْمًا',
              translation: 'And say: My Lord, increase me in knowledge.',
              surahName: 'Taha'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'history-civilizations',
    name: 'History, Nations & Lessons',
    nameArabic: 'التاريخ والقرون الأولى والقصص والعبر',
    description: 'Historic nations, Aad, Thamud, Pharaoh, ancient civilizations, and sacred geography.',
    iconName: 'Landmark',
    color: 'stone',
    totalWordsCount: 20,
    totalOccurrences: 1450,
    subcategories: [
      {
        id: 'nations-tyrants',
        name: 'Past Peoples & Archetypes',
        nameArabic: 'الأمم السابقة والعبرة بمصيرها',
        description: 'Stories of ancient peoples who rejected divine messengers and the ruins they left behind.',
        words: [
          {
            id: 'firawn',
            word: 'فِرْعَوْن',
            transliteration: 'Firʿawn',
            cleanArabic: 'فرعون',
            root: 'frEn',
            rootArabic: 'ف ر ع ن',
            grammarCategory: 'Proper noun',
            meaning: 'Pharaoh (The Archetype of Tyranny and Arrogance)',
            frequency: 74,
            semanticRole: 'Agent',
            sampleVerse: {
              location: '79:17:3',
              text: 'اذْهَبْ إِلَىٰ فِرْعَوْنَ إِنَّهُ طَغَىٰ',
              translation: 'Go to Pharaoh. Indeed, he has transgressed.',
              surahName: 'An-Nazi\'at'
            }
          },
          {
            id: 'ad',
            word: 'عَاد',
            transliteration: 'ʿĀd',
            cleanArabic: 'عاد',
            root: 'Ewd',
            rootArabic: 'ع و د',
            grammarCategory: 'Proper noun',
            meaning: 'Aad (The Ancient Mighty Nation of Hud)',
            frequency: 24,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '89:6:4',
              text: 'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِعَادٍ',
              translation: 'Have you not considered how your Lord dealt with Aad?',
              surahName: 'Al-Fajr'
            }
          },
          {
            id: 'thamud',
            word: 'ثَمُود',
            transliteration: 'Thamūd',
            cleanArabic: 'ثمود',
            root: 'vmd',
            rootArabic: 'ث م د',
            grammarCategory: 'Proper noun',
            meaning: 'Thamud (The Rock-Carvers of Salih)',
            frequency: 26,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '89:9:2',
              text: 'وَثَمُودَ الَّذِينَ جَابُوا الصَّخْرَ بِالْوَادِ',
              translation: 'And with Thamud, who carved out the rocks in the valley?',
              surahName: 'Al-Fajr'
            }
          },
          {
            id: 'makkah-bakkah',
            word: 'مَكَّة / بَكَّة',
            transliteration: 'Makkah / Bakkah',
            cleanArabic: 'مكة',
            root: 'mkk',
            rootArabic: 'م ك ك',
            grammarCategory: 'Proper noun',
            meaning: 'Mecca (The Sacred Ancient Sanctuary)',
            frequency: 2,
            semanticRole: 'Entity',
            sampleVerse: {
              location: '3:96:4',
              text: 'إِنَّ أَوَّلَ بَيْتٍ وُضِعَ لِلنَّاسِ لَلَّذِي بِبَكَّةَ مُبَارَكًا',
              translation: 'Indeed, the first House [of worship] established for mankind was that at Bakkah - blessed...',
              surahName: 'Ali Imran'
            }
          }
        ]
      }
    ]
  }
];
