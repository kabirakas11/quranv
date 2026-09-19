import json
import re
from collections import defaultdict

# -----------------------------------------------------------------------------
# 19 Quranic Semantic Domains & Sub-Clusters Definition
# -----------------------------------------------------------------------------
DOMAINS = {
    'divine-realm': {
        'en': 'Divine Realm & Sublime Attributes',
        'ar': 'الإلهيات والعقيدة والأسماء الحسنى',
        'desc': 'The Oneness of Allah, 99 Divine Names, Sovereignty, Throne, and Celestial Beings.',
        'icon': 'Sparkles',
        'clusters': {
            'divine-names': {'en': 'Divine Names & Attributes', 'ar': 'أسماء الله الحسنى وصفات الجلال'},
            'divine-sovereignty': {'en': 'Sovereignty, Will & Glory', 'ar': 'الملك والقدرة والعرش والمشيئة'},
            'angels-unseen': {'en': 'Angels & Celestial Realities', 'ar': 'الملائكة وعالم الغيب'}
        }
    },
    'prophethood-revelation': {
        'en': 'Prophethood, Scripture & Revelation',
        'ar': 'النبوات والرسالات والوحي',
        'desc': 'The Messengers of Allah, Revealed Heavenly Books, Divine Verses, and Proofs.',
        'icon': 'BookOpen',
        'clusters': {
            'prophets-messengers': {'en': 'Prophets & Messengers', 'ar': 'الأنبياء والرسل الكرام'},
            'scripture-books': {'en': 'Divine Scriptures & Books', 'ar': 'الكتب السماوية والصحف'},
            'revelation-signs': {'en': 'Revelation, Verses & Signs', 'ar': 'الوحي والآيات والبينات'}
        }
    },
    'afterlife-eschatology': {
        'en': 'Afterlife, Eschatology & Final Judgment',
        'ar': 'السمعيات واليوم الآخر والجزاء',
        'desc': 'The Day of Resurrection, Paradise, Hellfire, The Balance, and Ultimate Reckoning.',
        'icon': 'Flame',
        'clusters': {
            'paradise-bliss': {'en': 'Paradise & Eternal Bliss', 'ar': 'الجنة والنعيم المقيم'},
            'hellfire-punishment': {'en': 'Hellfire & Severe Torment', 'ar': 'جهنم والنار والعذاب'},
            'resurrection-reckoning': {'en': 'Resurrection, Gathering & Scales', 'ar': 'البعث والحساب والميزان'}
        }
    },
    'worship-rituals': {
        'en': 'Worship, Pillars & Devotional Rites',
        'ar': 'العبادات والشعائر والطاعات',
        'desc': 'Prayer, Fasting, Hajj pilgrimage, Mosques, Supplication, and Remembrance.',
        'icon': 'Compass',
        'clusters': {
            'prayer-prostration': {'en': 'Prayer & Prostration', 'ar': 'الصلاة والركوع والسجود'},
            'pilgrimage-sacred-rites': {'en': 'Hajj & Sacred Rites', 'ar': 'الحج والمشاعر والمناسك'},
            'fasting-charity': {'en': 'Fasting & Purification', 'ar': 'الصيام والشعائر التعبدية'},
            'supplication-remembrance': {'en': 'Supplication & Remembrance', 'ar': 'الدعاء والذكر والاستغفار'}
        }
    },
    'faith-virtues-ethics': {
        'en': 'Faith, Moral Virtues & Spiritual States',
        'ar': 'الإيمان والأخلاق والفضائل',
        'desc': 'True belief, Piety, Patience, Gratitude, Honesty, Justice, and Repentance.',
        'icon': 'Heart',
        'clusters': {
            'belief-conviction': {'en': 'Faith, Guidance & Conviction', 'ar': 'الإيمان والهدى واليقين'},
            'patience-gratitude': {'en': 'Patience, Gratitude & Trust', 'ar': 'الصبر والشكر والتوكل'},
            'piety-righteousness': {'en': 'Piety, Justice & Righteousness', 'ar': 'التقوى والعدل والبر والإحسان'},
            'repentance-mercy': {'en': 'Repentance, Pardon & Mercy', 'ar': 'التوبة والعفو والمغفرة'}
        }
    },
    'sin-corruption-hypocrisy': {
        'en': 'Sin, Disbelief, Hypocrisy & Transgression',
        'ar': 'الكفر والفسوق والنفاق والظلم',
        'desc': 'Polytheism, Denial, Hypocrisy, Injustice, Arrogance, Corruption, and Satan.',
        'icon': 'ShieldAlert',
        'clusters': {
            'disbelief-shirk': {'en': 'Disbelief, Polytheism & Denial', 'ar': 'الكفر والشرك والتكذيب'},
            'hypocrisy-deceit': {'en': 'Hypocrisy & Treachery', 'ar': 'النفاق والخداع والغدر'},
            'injustice-arrogance': {'en': 'Injustice, Arrogance & Corruption', 'ar': 'الظلم والاستكبار والفساد'},
            'satan-temptation': {'en': 'Satan, Whispering & Falsehood', 'ar': 'الشيطان والوسوسة والباطل'}
        }
    },
    'intellect-knowledge-speech': {
        'en': 'Knowledge, Reason, Speech & Dialogue',
        'ar': 'العلم والفكر والكلام والبيان',
        'desc': 'Intellect, Contemplation, Wisdom, Argumentation, Speech, and Discourse.',
        'icon': 'Brain',
        'clusters': {
            'knowledge-wisdom': {'en': 'Knowledge, Insight & Wisdom', 'ar': 'العلم والحكمة والبصيرة'},
            'reason-reflection': {'en': 'Contemplation & Reflection', 'ar': 'الفكر والعقل والتدبر'},
            'speech-discourse': {'en': 'Speech, Proclamation & Dialogue', 'ar': 'القول والكلام والجدال'}
        }
    },
    'humanity-creation-stages': {
        'en': 'Mankind, Creation, Body & Life Stages',
        'ar': 'الإنسان وخلقه والبدن وأطوار الحياة',
        'desc': 'Human origin from clay, The Soul, Physical organs, Senses, and Life stages.',
        'icon': 'Activity',
        'clusters': {
            'mankind-creation': {'en': 'Mankind & Genesis of Creation', 'ar': 'الإنسان وأصل الخلق'},
            'body-limbs-senses': {'en': 'Organs, Limbs & Senses', 'ar': 'الأعضاء والجوارح والحواس'},
            'life-death-stages': {'en': 'Life, Death & Age Stages', 'ar': 'الحياة والموت والشباب والهرم'}
        }
    },
    'emotions-trials-inner-life': {
        'en': 'Emotions, Psychological States & Trials',
        'ar': 'المشاعر والأحوال النفسية والابتلاءات',
        'desc': 'Fear, Awe, Grief, Joy, Love, Remorse, Trials, and Spiritual tests.',
        'icon': 'Smile',
        'clusters': {
            'fear-awe': {'en': 'Fear, Dread & Reverence', 'ar': 'الخوف والخشية والوجل'},
            'grief-remorse': {'en': 'Grief, Sorrow & Remorse', 'ar': 'الحزن والغم والحسرة'},
            'joy-love-peace': {'en': 'Joy, Love & Serenity', 'ar': 'الفرح والمحبة والسكينة'},
            'trials-hardship': {'en': 'Trials, Tribulations & Hardship', 'ar': 'الابتلاء والفتنة والشدائد'}
        }
    },
    'family-kinship-society': {
        'en': 'Family, Kinship, Marriage & Lineage',
        'ar': 'الأسرة والأنساب والقرابة والمجتمع',
        'desc': 'Parents, Spouses, Children, Kinship ties, Orphans, and the Vulnerable.',
        'icon': 'Users',
        'clusters': {
            'parents-kinship': {'en': 'Parents, Offspring & Relatives', 'ar': 'الوالدان والأبناء والأرحام'},
            'marriage-spouses': {'en': 'Marriage & Household Rulings', 'ar': 'الزواج والأزواج والمصاهرة'},
            'vulnerable-society': {'en': 'Orphans, The Poor & Society', 'ar': 'اليتامى والمساكين والمجتمع'}
        }
    },
    'law-governance-justice': {
        'en': 'Law, Covenants, Governance & Decrees',
        'ar': 'التشريع والعهود والأحكام والقضاء',
        'desc': 'Divine rulings, Commands, Prohibitions, Covenants, Oaths, and Judicial decrees.',
        'icon': 'Scale',
        'clusters': {
            'decrees-commandments': {'en': 'Decrees, Commands & Statutes', 'ar': 'الحكم والأمر والتشريع'},
            'covenants-oaths': {'en': 'Covenants, Treaties & Pledges', 'ar': 'العهود والمواثيق والأيمان'},
            'justice-testimony': {'en': 'Justice, Testimony & Retribution', 'ar': 'القضاء والشهادة والقصاص'}
        }
    },
    'commerce-wealth-property': {
        'en': 'Wealth, Commerce, Property & Sustenance',
        'ar': 'المال والتجارة والإنفاق والرزق',
        'desc': 'Property, Trade, Gold, Silver, Provision, Spending, and Accurate weights.',
        'icon': 'Coins',
        'clusters': {
            'wealth-precious-metals': {'en': 'Wealth, Gold & Treasures', 'ar': 'المال والذهب والفضة والكنوز'},
            'trade-contracts': {'en': 'Trade, Contracts & Usury', 'ar': 'التجارة والبيع والشراء والدين'},
            'sustenance-spending': {'en': 'Sustenance & Spending', 'ar': 'الرزق والإنفاق والعطاء'},
            'measures-scales': {'en': 'Weights, Measures & Shares', 'ar': 'المكاييل والموازين والأنصبة'}
        }
    },
    'struggle-defense-conflict': {
        'en': 'Struggle, Defense, Warfare & Peace',
        'ar': 'الجهاد والدفاع والحرب والسلم',
        'desc': 'Striving in Allah’s way, Defense, Armies, Weapons, Victory, and Peace.',
        'icon': 'Shield',
        'clusters': {
            'struggle-jihad': {'en': 'Jihad & Striving for Truth', 'ar': 'الجهاد والسعي في سبيل الله'},
            'warfare-armies': {'en': 'Warfare, Troops & Enemies', 'ar': 'الحرب والجيوش والأعداء'},
            'weapons-fortifications': {'en': 'Weapons, Armor & Fortresses', 'ar': 'السلاح والحديد والدروع والحصون'},
            'victory-peace': {'en': 'Victory, Triumph & Peace', 'ar': 'النصر والفتح والسلم والأمن'}
        }
    },
    'cosmology-astronomy-earth': {
        'en': 'Cosmology, Celestial Spheres & Weather',
        'ar': 'الكون والأفلاك والسموات والطقس',
        'desc': 'Heavens, Earth, Sun, Moon, Stars, Light, Darkness, Clouds, and Rain.',
        'icon': 'Sun',
        'clusters': {
            'heavens-celestial-bodies': {'en': 'Heavens, Sun, Moon & Stars', 'ar': 'السموات والشمس والقمر والنجوم'},
            'light-darkness': {'en': 'Light, Shadows & Darkness', 'ar': 'النور والظلمات والظل والضياء'},
            'weather-water-sky': {'en': 'Clouds, Rain, Thunder & Winds', 'ar': 'السحاب والمطر والريح والبرق'}
        }
    },
    'nature-fauna-flora': {
        'en': 'Animals, Plants, Agriculture & Nature',
        'ar': 'الحيوان والنبات والزروع والأنعام',
        'desc': 'Cattle, Birds, Insects, Date-palms, Olive trees, Crops, and Harvest.',
        'icon': 'Trees',
        'clusters': {
            'animals-cattle': {'en': 'Domestic Animals & Cattle', 'ar': 'الأنعام والدواب والبهائم'},
            'birds-insects-aquatic': {'en': 'Birds, Insects & Aquatic Life', 'ar': 'الطيور والحشرات ودواب البحر'},
            'flora-trees-gardens': {'en': 'Trees, Palms & Lush Gardens', 'ar': 'الأشجار والنخيل والحدائق والجنات'},
            'crops-harvest': {'en': 'Crops, Grains & Harvest', 'ar': 'الزروع والحبوب والحصاد والثمار'}
        }
    },
    'geography-places-dwellings': {
        'en': 'Topography, Places & Architecture',
        'ar': 'الجغرافيا والتضاريس والديار والمساكن',
        'desc': 'Mountains, Seas, Rivers, Valleys, Paths, Cities, and Dwellings.',
        'icon': 'Mountain',
        'clusters': {
            'terrain-mountains-water': {'en': 'Mountains, Seas & Rivers', 'ar': 'الجبال والبحار والأنهار والأودية'},
            'paths-roads': {'en': 'Highways, Paths & Open Ways', 'ar': 'السبل والطرق والصراط'},
            'dwellings-cities': {'en': 'Cities, Houses & Architecture', 'ar': 'القرى والمدن والبيوت والقصور'}
        }
    },
    'history-civilizations-peoples': {
        'en': 'Ancient Civilizations & Historical Lessons',
        'ar': 'الأمم السابقة والقرون والقصص',
        'desc': 'Peoples of past prophets, Ancient tribes, Pharaoh, and Moral lessons.',
        'icon': 'Landmark',
        'clusters': {
            'ancient-peoples': {'en': 'Ancient Peoples (Ad, Thamud, etc.)', 'ar': 'أمم الأنبياء والقبائل الغابرة'},
            'tyrants-rulers': {'en': 'Historical Rulers & Figures', 'ar': 'الملوك والجبابرة والأعلام التاريخية'},
            'historic-peoples': {'en': 'Children of Israel & Nations', 'ar': 'بنو إسرائيل والأمم التاريخية'}
        }
    },
    'movement-travel-physical': {
        'en': 'Movement, Physical Actions & Travel',
        'ar': 'الحركة والمسير والأسفار والأفعال البدنية',
        'desc': 'Walking, Travelling, Ascending, Descending, Turning, Eating, and Postures.',
        'icon': 'Footprints',
        'clusters': {
            'travel-motion': {'en': 'Journeying, Walking & Motion', 'ar': 'المسير والذهاب والمجيء والرحيل'},
            'ascent-descent': {'en': 'Ascent, Descent & Return', 'ar': 'الصعود والنزول والرجوع والانقلاب'},
            'posture-physical-acts': {'en': 'Postures, Sustenance & Acts', 'ar': 'القيام والقعود والأفعال المعيشية'}
        }
    },
    'time-periods-cosmic-cycles': {
        'en': 'Time, Epochs & Cosmic Cycles',
        'ar': 'الزمان والآجال والليل والنهار والعصور',
        'desc': 'Day, Night, Dawn, Twilight, Months, Years, Appointed terms, and Eternity.',
        'icon': 'Clock',
        'clusters': {
            'day-night-cycles': {'en': 'Day, Night, Dawn & Twilight', 'ar': 'الليل والنهار والفجر والشفق'},
            'temporal-measures': {'en': 'Hours, Months & Years', 'ar': 'الساعات والأيام والشهور والسنين'},
            'epochs-terms': {'en': 'Appointed Terms & Epochs', 'ar': 'الآجال والعصور والخلود والدهر'}
        }
    }
}

# -----------------------------------------------------------------------------
# Heuristics & Specific Matching Rules to Group Semantically Close Words
# -----------------------------------------------------------------------------

def classify_word(w):
    clean = (w.get('cleanArabic') or '').strip()
    raw = (w.get('word') or '').strip()
    meaning = (w.get('meaning') or '').lower()
    root = (w.get('root') or '').strip()
    pos = (w.get('pos') or '').lower()
    posCategory = w.get('posCategory')

    # Eligible check: only nouns (excl pronouns), proper nouns, adjectives, verbs
    if posCategory not in ['noun', 'proper_noun', 'adjective', 'verb']:
        return None, None

    # 1. DIVINE REALM
    if any(k in clean for k in ['الله', 'رحمن', 'رحيم', 'اله', 'قدوس', 'عزيز', 'حكيم', 'غفور', 'غفار', 'وهاب', 'رزاق', 'فتاح', 'عليم', 'باسط', 'خافض', 'رافع', 'معز', 'مذل', 'سميع', 'بصير', 'عدل', 'لطيف', 'خبير', 'حليم', 'عظيم', 'شكور', 'علي', 'كبير', 'حفيظ', 'مقيت', 'حسيب', 'جليل', 'كريم', 'رقيب', 'مجيب', 'واسع', 'ودود', 'مجيد', 'باعث', 'شهيد', 'حق', 'وكيل', 'قوي', 'متين', 'ولي', 'حميد', 'محيي', 'مميت', 'حي', 'قيوم', 'واحد', 'صمد', 'قادر', 'مقتدر', 'مقدم', 'مؤخر', 'اول', 'اخر', 'ظاهر', 'باطن', 'بر', 'تواب', 'منتقم', 'عفو', 'رؤوف', 'غني', 'نور', 'هادي', 'بديع', 'باقي', 'وارث', 'رشيد', 'صبور']) or any(k in meaning for k in ['allah', 'all-merciful', 'all-knowing', 'all-seeing', 'all-hearing', 'almighty', 'most gracious', 'most merciful', 'deity', 'divine']):
        return 'divine-realm', 'divine-names'
    if any(k in clean for k in ['عرش', 'كرسي', 'سلطان', 'ملك', 'ملكوت', 'كبرياء', 'جلال', 'مشيئه', 'اراده', 'سبحان', 'حمد']) or any(k in meaning for k in ['throne', 'sovereignty', 'dominion', 'divine will', 'glory of allah']):
        return 'divine-realm', 'divine-sovereignty'
    if any(k in clean for k in ['ملك', 'ملائك', 'جبريل', 'ميكال', 'ميكائيل', 'هاروت', 'ماروت', 'سجيل', 'روح القدس', 'غيب']) or any(k in meaning for k in ['angel', 'gabriel', 'michael', 'holy spirit', 'the unseen']):
        return 'divine-realm', 'angels-unseen'

    # 2. PROPHETHOOD & REVELATION
    if any(k in clean for k in ['محمد', 'احمد', 'ابراهيم', 'موسي', 'عيسي', 'نوح', 'يوسف', 'داود', 'سليمان', 'هارون', 'اسماعيل', 'اسحاق', 'يعقوب', 'يونس', 'لوط', 'هود', 'صالح', 'شعيب', 'زكريا', 'يحيي', 'ايوب', 'ادريس', 'ذو الكفل', 'ادم', 'رسول', 'نبي', 'مرسل']) or any(k in meaning for k in ['prophet', 'messenger', 'abraham', 'moses', 'jesus', 'noah', 'joseph', 'david', 'solomon', 'aaron', 'ishmael', 'isaac', 'jacob', 'jonah', 'lot']):
        return 'prophethood-revelation', 'prophets-messengers'
    if any(k in clean for k in ['قران', 'توران', 'توراه', 'انجيل', 'زبور', 'صحف', 'فرقان', 'كتاب']) or any(k in meaning for k in ['quran', 'torah', 'gospel', 'psalms', 'scripture', 'scrolls']):
        return 'prophethood-revelation', 'scripture-books'
    if any(k in clean for k in ['وحي', 'اوحي', 'يوحي', 'تنزيل', 'انزل', 'نذير', 'بشير', 'بلاغ', 'ايه', 'ايات', 'بينه', 'بينات']) or any(k in meaning for k in ['revelation', 'revealed', 'warn', 'warner', 'glad tidings', 'clear sign', 'verse']):
        return 'prophethood-revelation', 'revelation-signs'

    # 3. AFTERLIFE & ESCHATOLOGY
    if any(k in clean for k in ['جنه', 'جنات', 'فردوس', 'عدن', 'نعيم', 'حور', 'كوثر', 'سلسبيل', 'سندس', 'استبرق', 'رضوان', 'اباريق', 'سرر']) or any(k in meaning for k in ['paradise', 'garden of eden', 'eternal bliss', 'houris', 'couch', 'brocade', 'kauthar']):
        return 'afterlife-eschatology', 'paradise-bliss'
    if any(k in clean for k in ['جهنم', 'نار', 'سعير', 'جحيم', 'سقر', 'لظي', 'هاويه', 'غسلين', 'زقوم', 'صديد', 'حريق', 'سلاسل', 'اغلال']) or any(k in meaning for k in ['hell', 'hellfire', 'blazing fire', 'punish', 'torment', 'zaqqum', 'chains', 'shackles']):
        return 'afterlife-eschatology', 'hellfire-punishment'
    if any(k in clean for k in ['قيامه', 'بعث', 'حشر', 'حساب', 'ميزان', 'صاخه', 'طامه', 'حاقه', 'واقعه', 'قارعه', 'نفخ', 'صور', 'شفا']) or any(k in meaning for k in ['resurrection', 'day of judgment', 'reckoning', 'balance', 'scales', 'trumpet', 'gathering']):
        return 'afterlife-eschatology', 'resurrection-reckoning'

    # 4. WORSHIP & RITUALS
    if any(k in clean for k in ['صلاه', 'صلي', 'صلوات', 'سجود', 'سجد', 'ركوع', 'ركع', 'قنوت', 'قبله', 'مسجد', 'مساجد', 'محراب', 'اذان']) or any(k in meaning for k in ['prayer', 'prostrat', 'bowing', 'qiblah', 'mosque', 'masjid']):
        return 'worship-rituals', 'prayer-prostration'
    if any(k in clean for k in ['حج', 'عمره', 'كعبه', 'طواف', 'طاف', 'صفا', 'مروه', 'مشعر', 'هدي', 'مناسك', 'احرام', 'عرفات']) or any(k in meaning for k in ['pilgrimage', 'hajj', 'umrah', 'kabah', 'kaaba', 'circumambulate', 'safa', 'marwah', 'sacrificial animal']):
        return 'worship-rituals', 'pilgrimage-sacred-rites'
    if any(k in clean for k in ['صيام', 'صوم', 'صام', 'رمضان', 'زكاه', 'تزكي', 'تطهير']) or any(k in meaning for k in ['fasting', 'fast', 'ramadan', 'purification']):
        return 'worship-rituals', 'fasting-charity'
    if any(k in clean for k in ['دعاء', 'دعا', 'يدعو', 'ذكر', 'تسبيح', 'سبح', 'استغفار', 'استغفر', 'تضرع', 'خشوع', 'قانت']) or any(k in meaning for k in ['supplicat', 'call upon', 'remember allah', 'glorify', 'seek forgiveness', 'humbly']):
        return 'worship-rituals', 'supplication-remembrance'

    # 5. FAITH, MORALITY & VIRTUES
    if any(k in clean for k in ['ايمان', 'امن', 'مؤمن', 'توحيد', 'يقين', 'هدايه', 'اهتدي', 'مهتدي', 'رشد', 'اخلاص']) or any(k in meaning for k in ['faith', 'believ', 'guided', 'guidance', 'certainty', 'sincerity']):
        return 'faith-virtues-ethics', 'belief-conviction'
    if any(k in clean for k in ['صبر', 'صابر', 'شكر', 'شاكر', 'شكور', 'توكل', 'متوكل', 'رضا', 'انابه']) or any(k in meaning for k in ['patient', 'patience', 'grateful', 'thankful', 'rely', 'trust in allah', 'content']):
        return 'faith-virtues-ethics', 'patience-gratitude'
    if any(k in clean for k in ['تقوي', 'اتقي', 'متقي', 'بر', 'احسان', 'محسن', 'عدل', 'قسط', 'صدق', 'صادق', 'استقام', 'وفاء']) or any(k in meaning for k in ['righteous', 'piety', 'good-doer', 'justice', 'truthful', 'integrity', 'upright']):
        return 'faith-virtues-ethics', 'piety-righteousness'
    if any(k in clean for k in ['توبه', 'تاب', 'تواب', 'عفو', 'عفا', 'مغفره', 'غفر', 'رحمه', 'رحم', 'اشفاق', 'رافه']) or any(k in meaning for k in ['repent', 'forgive', 'pardon', 'mercy', 'compassion']):
        return 'faith-virtues-ethics', 'repentance-mercy'

    # 6. SIN, DISBELIEF & HYPOCRISY
    if any(k in clean for k in ['كفر', 'كافر', 'كفار', 'شرك', 'مشرك', 'تكذيب', 'كذب', 'كاذب', 'جحود', 'طاغوت']) or any(k in meaning for k in ['disbelie', 'deni', 'polytheis', 'associat partners', 'false deity', 'rejection']):
        return 'sin-corruption-hypocrisy', 'disbelief-shirk'
    if any(k in clean for k in ['نفاق', 'منافق', 'خداع', 'خدع', 'مكر', 'غدر', 'استهزاء', 'سخر', 'سخريه']) or any(k in meaning for k in ['hypocrit', 'deceive', 'mock', 'plot', 'ridicule', 'betray']):
        return 'sin-corruption-hypocrisy', 'hypocrisy-deceit'
    if any(k in clean for k in ['ظلم', 'ظالم', 'استكبار', 'متكبر', 'عتو', 'فساد', 'مفسد', 'اثم', 'اثيم', 'فجور', 'فاسق', 'طغيان']) or any(k in meaning for k in ['wrongdoer', 'unjust', 'arrogant', 'pride', 'corrupt', 'wicked', 'transgress', 'sinful']):
        return 'sin-corruption-hypocrisy', 'injustice-arrogance'
    if any(k in clean for k in ['شيطان', 'شياطين', 'ابليس', 'وسواس', 'خناس', 'غوايه', 'نزغ', 'باطل']) or any(k in meaning for k in ['satan', 'devil', 'iblis', 'whisper', 'falsehood', 'temptation']):
        return 'sin-corruption-hypocrisy', 'satan-temptation'

    # 7. INTELLECT, KNOWLEDGE & SPEECH
    if any(k in clean for k in ['علم', 'عالم', 'يعلم', 'حكمه', 'بصيره', 'فقه', 'يفقه', 'برهان', 'حجه']) or any(k in meaning for k in ['know', 'knowledge', 'wisdom', 'insight', 'understand', 'proof', 'argument']):
        return 'intellect-knowledge-speech', 'knowledge-wisdom'
    if any(k in clean for k in ['عقل', 'يعقل', 'فكر', 'تفكر', 'تدبر', 'نظر', 'ينظر', 'راي', 'الباب', 'نهي', 'عبره', 'ذكري']) or any(k in meaning for k in ['reason', 'think', 'ponder', 'reflect', 'contemplate', 'lesson', 'reminder', 'intellect']):
        return 'intellect-knowledge-speech', 'reason-reflection'
    if any(k in clean for k in ['قال', 'يقول', 'قول', 'قيل', 'كلام', 'تكلم', 'حديث', 'نطق', 'بيان', 'جادل', 'نبا', 'نادي', 'اسر', 'جهر']) or any(k in meaning for k in ['say', 'spoke', 'speak', 'speech', 'dispute', 'proclaim', 'call out', 'utter', 'whisper']):
        return 'intellect-knowledge-speech', 'speech-discourse'

    # 8. HUMANITY, BODY & LIFE STAGES
    if any(k in clean for k in ['انسان', 'ناس', 'بشر', 'طين', 'تراب', 'صلصال', 'نطفه', 'علقه', 'مضغه', 'خلق', 'يخلق', 'خالق', 'صور']) or any(k in meaning for k in ['mankind', 'human', 'dust', 'clay', 'sperm-drop', 'clot', 'create', 'fashion']):
        return 'humanity-creation-stages', 'mankind-creation'
    if any(k in clean for k in ['قلب', 'قلوب', 'فؤاد', 'صدر', 'صدور', 'عين', 'اعين', 'اذن', 'اذان', 'سمع', 'بصر', 'ابصار', 'لسان', 'السن', 'شفه', 'يد', 'ايدي', 'رجل', 'ارجل', 'وجه', 'وجوه', 'راس', 'ناصيه', 'عنق', 'اعناق', 'بطن', 'بطون', 'ظهر', 'جلد', 'جلود', 'لحم', 'دم']) or any(k in meaning for k in ['heart', 'breast', 'chest', 'eye', 'ear', 'tongue', 'lip', 'hand', 'foot', 'feet', 'face', 'head', 'neck', 'belly', 'skin', 'flesh', 'blood', 'bone']):
        return 'humanity-creation-stages', 'body-limbs-senses'
    if any(k in clean for k in ['حياه', 'حي', 'احيا', 'موت', 'ميت', 'امات', 'وفاه', 'توفي', 'اجل', 'طفل', 'وليد', 'غلام', 'شيب', 'شيخ', 'هرم', 'عجوز']) or any(k in meaning for k in ['life', 'live', 'death', 'die', 'dead', 'child', 'youth', 'boy', 'gray hair', 'old man', 'aged']):
        return 'humanity-creation-stages', 'life-death-stages'

    # 9. EMOTIONS, TRIALS & INNER LIFE
    if any(k in clean for k in ['خوف', 'خاف', 'يخاف', 'خائف', 'خشيه', 'يخشي', 'وجل', 'رعب', 'فزع', 'هلع', 'اشفاق']) or any(k in meaning for k in ['fear', 'afraid', 'dread', 'awe', 'terror', 'alarm', 'frightened']):
        return 'emotions-trials-inner-life', 'fear-awe'
    if any(k in clean for k in ['حزن', 'يحزن', 'حزين', 'غم', 'اسف', 'حسره', 'ندم', 'ضيق', 'كرب', 'ياس', 'قنوط']) or any(k in meaning for k in ['grief', 'sorrow', 'sad', 'regret', 'remorse', 'despair', 'anguish', 'distress']):
        return 'emotions-trials-inner-life', 'grief-remorse'
    if any(k in clean for k in ['فرح', 'يفرح', 'فرحين', 'مرح', 'سرور', 'حب', 'يحب', 'محبه', 'ود', 'موده', 'رجاء', 'امل', 'سكينه', 'طمانينه']) or any(k in meaning for k in ['rejoice', 'joy', 'glad', 'love', 'affection', 'hope', 'tranquility', 'peace of mind']):
        return 'emotions-trials-inner-life', 'joy-love-peace'
    if any(k in clean for k in ['بلاء', 'ابتلي', 'يبتلي', 'فتنه', 'افتن', 'ضراء', 'باساء', 'عسر', 'شده', 'خصاصه', 'نصب', 'كبد']) or any(k in meaning for k in ['trial', 'test', 'afflict', 'hardship', 'adversity', 'tribulation', 'distress', 'toil']):
        return 'emotions-trials-inner-life', 'trials-hardship'

    # 10. FAMILY, KINSHIP & SOCIETY
    if any(k in clean for k in ['والد', 'اب', 'اباء', 'ام', 'امهات', 'ابن', 'بنين', 'ابناء', 'بنت', 'بنات', 'ذريه', 'اخ', 'اخوان', 'اخت', 'اخوات', 'عشيره', 'ارحام', 'قربي', 'نسب', 'صهر']) or any(k in meaning for k in ['parent', 'father', 'mother', 'son', 'daughter', 'offspring', 'brother', 'sister', 'kinship', 'relative', 'lineage']):
        return 'family-kinship-society', 'parents-kinship'
    if any(k in clean for k in ['زوج', 'ازواج', 'بعل', 'امراه', 'نساء', 'نكاح', 'انكح', 'طلاق', 'طلق', 'عده', 'صداق', 'حليله', 'ايمانكم']) or any(k in meaning for k in ['spouse', 'wife', 'husband', 'women', 'marry', 'marriage', 'divorce', 'dowry']):
        return 'family-kinship-society', 'marriage-spouses'
    if any(k in clean for k in ['يتيم', 'يتامي', 'مسكين', 'مساكين', 'فقير', 'فقراء', 'سائل', 'محروم', 'ابن السبيل', 'رقاب', 'اسير', 'اسري']) or any(k in meaning for k in ['orphan', 'poor', 'needy', 'beggar', 'wayfarer', 'slave', 'captive']):
        return 'family-kinship-society', 'vulnerable-society'

    # 11. LAW, GOVERNANCE & JUSTICE
    if any(k in clean for k in ['حكم', 'يحكم', 'حاكم', 'امر', 'يامر', 'نهي', 'ينهي', 'فرض', 'شرع', 'حلال', 'حرام', 'حدود الله', 'وصيه', 'نصيب']) or any(k in meaning for k in ['judge', 'command', 'decree', 'forbid', 'ordain', 'lawful', 'unlawful', 'limits of allah', 'bequest', 'share']):
        return 'law-governance-justice', 'decrees-commandments'
    if any(k in clean for k in ['عهد', 'ميثاق', 'مواثيق', 'عقد', 'عقود', 'يمين', 'ايمان', 'قسام', 'حلف', 'بيعه', 'اوفوا']) or any(k in meaning for k in ['covenant', 'treaty', 'contract', 'oath', 'pledge', 'fulfill covenants']):
        return 'law-governance-justice', 'covenants-oaths'
    if any(k in clean for k in ['قضاء', 'قضي', 'شهاده', 'شهد', 'يشهد', 'شاهد', 'شهيد', 'شهداء', 'قصاص', 'براءه']) or any(k in meaning for k in ['testify', 'witness', 'testimony', 'retribution', 'innocence', 'verdict']):
        return 'law-governance-justice', 'justice-testimony'

    # 12. COMMERCE, WEALTH & SUSTENANCE
    if any(k in clean for k in ['مال', 'اموال', 'ذهب', 'فضه', 'كنز', 'كنوز', 'خزائن', 'حلي', 'متاع', 'زينه', 'ثروه', 'غني']) or any(k in meaning for k in ['wealth', 'money', 'gold', 'silver', 'treasure', 'jewels', 'adornment', 'goods', 'rich']):
        return 'commerce-wealth-property', 'wealth-precious-metals'
    if any(k in clean for k in ['تجاره', 'بيع', 'بايع', 'شري', 'اشتري', 'ثمن', 'دين', 'تداينتم', 'ربا', 'ربح', 'خسر', 'خساره', 'بضاعه']) or any(k in meaning for k in ['trade', 'merchandise', 'buy', 'sell', 'price', 'debt', 'usury', 'profit', 'loss']):
        return 'commerce-wealth-property', 'trade-contracts'
    if any(k in clean for k in ['رزق', 'يرزق', 'رازق', 'ارزاق', 'انفق', 'ينفق', 'انفاق', 'اجر', 'اجور', 'جزاء', 'عطاء', 'فضل', 'كسب', 'يكسب', 'غنيمه']) or any(k in meaning for k in ['provision', 'provide', 'sustenance', 'spend', 'reward', 'bounty', 'earn', 'spoils']):
        return 'commerce-wealth-property', 'sustenance-spending'
    if any(k in clean for k in ['مكيال', 'كيل', 'كالوا', 'ميزان', 'موازين', 'وزن', 'زنوا', 'قسطاس', 'مثقال', 'خردل', 'قطمير', 'نقير', 'فتيل']) or any(k in meaning for k in ['measure', 'weight', 'scale', 'atom', 'mustard seed', 'speck']):
        return 'commerce-wealth-property', 'measures-scales'

    # 13. STRUGGLE, DEFENSE & CONFLICT
    if any(k in clean for k in ['جهاد', 'جاهد', 'يجاهد', 'قتال', 'قاتل', 'يقاتل', 'نفر', 'سبيل الله', 'رباط', 'مرابط']) or any(k in meaning for k in ['jihad', 'strive', 'fight', 'cause of allah', 'march forth']):
        return 'struggle-defense-conflict', 'struggle-jihad'
    if any(k in clean for k in ['حرب', 'معركه', 'جيش', 'جيوش', 'جند', 'جنود', 'عدو', 'اعداء', 'كيد', 'حصر', 'غلب', 'يغلب', 'مغلوب']) or any(k in meaning for k in ['war', 'battle', 'army', 'host', 'enemy', 'defeat', 'overcome', 'conquer']):
        return 'struggle-defense-conflict', 'warfare-armies'
    if any(k in clean for k in ['سلاح', 'اسلحه', 'سيف', 'درع', 'دروع', 'رمح', 'خيل', 'جياد', 'حديد', 'باس', 'حصن', 'حصون']) or any(k in meaning for k in ['weapon', 'armor', 'sword', 'horse', 'steed', 'iron', 'fortress', 'might']):
        return 'struggle-defense-conflict', 'weapons-fortifications'
    if any(k in clean for k in ['نصر', 'ينصر', 'انصر', 'ناصر', 'نصير', 'فتح', 'فوز', 'فلاح', 'ظفر', 'سلم', 'سلام', 'صلح', 'امن', 'امان']) or any(k in meaning for k in ['victory', 'help', 'triumph', 'success', 'peace', 'reconcil', 'security', 'safety']):
        return 'struggle-defense-conflict', 'victory-peace'

    # 14. COSMOLOGY, ASTRONOMY & WEATHER
    if any(k in clean for k in ['سماء', 'سموات', 'شمس', 'قمر', 'نجم', 'نجوم', 'كوكب', 'كواكب', 'فلك', 'بروج', 'مطلع', 'مغرب']) or any(k in meaning for k in ['heaven', 'sky', 'sun', 'moon', 'star', 'planet', 'orbit', 'constellation']):
        return 'cosmology-astronomy-earth', 'heavens-celestial-bodies'
    if any(k in clean for k in ['نور', 'انوار', 'ظلمه', 'ظلمات', 'ضياء', 'مصباح', 'سراج', 'ظل', 'ظلال', 'دجي', 'غسق']) or any(k in meaning for k in ['light', 'darkness', 'lamp', 'radiance', 'shadow', 'shade', 'dusk']):
        return 'cosmology-astronomy-earth', 'light-darkness'
    if any(k in clean for k in ['سحاب', 'غمام', 'مطر', 'غيث', 'وابل', 'ريح', 'رياح', 'اعصار', 'رعد', 'برق', 'صاعقه', 'صواعق', 'ماء', 'ندي']) or any(k in meaning for k in ['cloud', 'rain', 'downpour', 'wind', 'whirlwind', 'thunder', 'lightning', 'water from sky']):
        return 'cosmology-astronomy-earth', 'weather-water-sky'

    # 15. NATURE, FAUNA & FLORA
    if any(k in clean for k in ['انعام', 'بهيمه', 'بقر', 'بقره', 'ابل', 'ناقه', 'جمل', 'خيل', 'بغال', 'حمير', 'حمار', 'غنم', 'نعجه', 'ضان', 'معز', 'سبع', 'كلب', 'ذئب', 'خنزير', 'قرده', 'دابه', 'دواب']) or any(k in meaning for k in ['cattle', 'cow', 'camel', 'she-camel', 'horse', 'mule', 'donkey', 'sheep', 'ewe', 'goat', 'beast', 'dog', 'wolf', 'swine', 'pig', 'ape']):
        return 'nature-fauna-flora', 'animals-cattle'
    if any(k in clean for k in ['طير', 'طائر', 'هدهد', 'غراب', 'نحل', 'نمل', 'عنكبوت', 'ذباب', 'بعوضه', 'فراش', 'جراد', 'قمل', 'ضفادع', 'حوت']) or any(k in meaning for k in ['bird', 'hoopoe', 'crow', 'bee', 'ant', 'spider', 'fly', 'mosquito', 'moth', 'locust', 'frog', 'fish', 'whale']):
        return 'nature-fauna-flora', 'birds-insects-aquatic'
    if any(k in clean for k in ['شجر', 'شجره', 'اشجار', 'نخل', 'نخيل', 'زيتون', 'تين', 'اعناب', 'عنب', 'رمان', 'سدر', 'طلح', 'اثل', 'حدائق', 'روضه']) or any(k in meaning for k in ['tree', 'palm', 'date-palm', 'olive', 'fig', 'grape', 'pomegranate', 'lote-tree', 'garden', 'orchard']):
        return 'nature-fauna-flora', 'flora-trees-gardens'
    if any(k in clean for k in ['زرع', 'زروع', 'حب', 'حبه', 'سنبله', 'سنابل', 'حصاد', 'حصد', 'ثمر', 'ثمرات', 'فاكهه', 'فواكه', 'عصف', 'ريحان', 'رطب']) or any(k in meaning for k in ['crop', 'grain', 'ear of corn', 'harvest', 'fruit', 'herb', 'fresh dates']):
        return 'nature-fauna-flora', 'crops-harvest'

    # 16. GEOGRAPHY, PLACES & DWELLINGS
    if any(k in clean for k in ['جبل', 'جبال', 'طور', 'رواسي', 'بحر', 'بحار', 'نهر', 'انهار', 'عين', 'عيون', 'ينبوع', 'ينابيع', 'واد', 'وادي', 'يم', 'مرج']) or any(k in meaning for k in ['mountain', 'mount', 'sea', 'ocean', 'river', 'spring', 'fountain', 'valley', 'gulf']):
        return 'geography-places-dwellings', 'terrain-mountains-water'
    if any(k in clean for k in ['سبيل', 'صراط', 'طريق', 'فجاج', 'منهج', 'شرعه', 'مسلك']) or any(k in meaning for k in ['way', 'path', 'highway', 'road', 'straight path', 'course']):
        return 'geography-places-dwellings', 'paths-roads'
    if any(k in clean for k in ['مدينه', 'قريه', 'قري', 'بلد', 'بلده', 'مكه', 'بكه', 'يثرب', 'دار', 'ديار', 'بيت', 'بيوت', 'مسكن', 'مساكن', 'قصر', 'قصور', 'صرح', 'غرف', 'باب', 'ابواب', 'كهف']) or any(k in meaning for k in ['city', 'town', 'village', 'dwelling', 'home', 'house', 'palace', 'chamber', 'gate', 'door', 'cave', 'makkah', 'mecca']):
        return 'geography-places-dwellings', 'dwellings-cities'

    # 17. HISTORY, CIVILIZATIONS & PEOPLES
    if any(k in clean for k in ['عاد', 'ثمود', 'مدين', 'ايكه', 'رس', 'اخدود', 'ارم', 'سبا', 'قرون', 'قوم']) or any(k in meaning for k in ['dwellers of', 'people of', 'aad', 'thamud', 'midian', 'sheba', 'ancient nation', 'generation']):
        return 'history-civilizations-peoples', 'ancient-peoples'
    if any(k in clean for k in ['فرعون', 'هامان', 'قارون', 'نمرود', 'جالوت', 'طالوت', 'ذو القرنين', 'لقمان', 'مريم', 'عمران', 'ازر']) or any(k in meaning for k in ['pharaoh', 'haman', 'korah', 'goliath', 'saul', 'dhul-qarnayn', 'luqman', 'mary', 'imran']):
        return 'history-civilizations-peoples', 'tyrants-rulers'
    if any(k in clean for k in ['اسرائيل', 'بنو اسرائيل', 'يهود', 'نصاري', 'روم', 'ياجوج', 'ماجوج', 'حواريون', 'اصحاب الكهف']) or any(k in meaning for k in ['israel', 'children of israel', 'jew', 'christian', 'romans', 'gog and magog', 'disciples']):
        return 'history-civilizations-peoples', 'historic-peoples'

    # 18. MOVEMENT, TRAVEL & PHYSICAL ACTIONS
    if any(k in clean for k in ['سار', 'يسير', 'سير', 'مشي', 'يمشي', 'مشي', 'ذهب', 'يذهب', 'جاء', 'اتي', 'ياتي', 'خرج', 'يخرج', 'خروج', 'دخل', 'يدخل', 'دخول', 'رحل', 'ركب', 'يركب', 'جري', 'يجري']) or any(k in meaning for k in ['walk', 'travel', 'journey', 'go', 'come', 'exit', 'enter', 'ride', 'run', 'sail', 'flow']):
        return 'movement-travel-physical', 'travel-motion'
    if any(k in clean for k in ['صعد', 'يصعد', 'عرج', 'يعرج', 'معارج', 'نزل', 'ينزل', 'هبط', 'يهبط', 'رجع', 'يرجع', 'مرجع', 'انقلب', 'ينقلب', 'تولي', 'يتولي', 'اقبل', 'ادبر', 'طاف']) or any(k in meaning for k in ['ascend', 'descend', 'return', 'turn back', 'turn away', 'come forward', 'flee']):
        return 'movement-travel-physical', 'ascent-descent'
    if any(k in clean for k in ['قام', 'يقوم', 'قيام', 'قعد', 'يقعد', 'قعود', 'اضطجع', 'نام', 'ينام', 'نوم', 'سنه', 'اكل', 'ياكل', 'طعام', 'شرب', 'يشرب', 'شراب', 'لبس', 'يلبس', 'لباس', 'حمل', 'يحمل', 'القي', 'يلقي', 'اخذ', 'ياخذ', 'قبض', 'بسط']) or any(k in meaning for k in ['stand', 'sit', 'lie down', 'sleep', 'eat', 'food', 'drink', 'beverage', 'garment', 'clothe', 'carry', 'cast', 'throw', 'seize', 'take', 'grasp', 'spread']):
        return 'movement-travel-physical', 'posture-physical-acts'

    # 19. TIME, PERIODS & COSMIC CYCLES
    if any(k in clean for k in ['ليل', 'ليال', 'نهار', 'فجر', 'صبح', 'صباح', 'ضحي', 'عشي', 'عشيه', 'شفق', 'سحر', 'بكره', 'اصيل']) or any(k in meaning for k in ['night', 'daytime', 'dawn', 'morning', 'forenoon', 'evening', 'twilight', 'early morning']):
        return 'time-periods-cosmic-cycles', 'day-night-cycles'
    if any(k in clean for k in ['ساعه', 'يوم', 'ايام', 'شهر', 'اشهر', 'شهور', 'سنه', 'سنين', 'سنون', 'عام', 'اعوام', 'جمعه', 'سبت']) or any(k in meaning for k in ['hour', 'day', 'days', 'month', 'year', 'years', 'friday', 'sabbath']):
        return 'time-periods-cosmic-cycles', 'temporal-measures'
    if any(k in clean for k in ['اجل', 'اماد', 'حين', 'عصر', 'دهر', 'امد', 'سرمد', 'خلود', 'خالد', 'ابدا', 'اول', 'اخر']) or any(k in meaning for k in ['appointed time', 'term', 'epoch', 'era', 'eternity', 'forever', 'abide forever', 'time', 'first', 'last']):
        return 'time-periods-cosmic-cycles', 'epochs-terms'

    # Logical Fallback according to word POS & core nature
    if posCategory == 'proper_noun':
        return 'history-civilizations-peoples', 'historic-peoples'
    elif posCategory == 'verb':
        # Action/physical default
        return 'movement-travel-physical', 'travel-motion'
    elif posCategory == 'adjective':
        # Quality default
        return 'faith-virtues-ethics', 'piety-righteousness'
    else:
        # Noun default
        return 'cosmology-astronomy-earth', 'heavens-celestial-bodies'

# -----------------------------------------------------------------------------
# Main processing
# -----------------------------------------------------------------------------
def run():
    print("Reading src/data/fluentArabicWords.json...")
    with open('src/data/fluentArabicWords.json', 'r', encoding='utf-8') as f:
        words = json.load(f)

    print(f"Loaded {len(words)} total words.")

    updated_words = []
    semantic_count = 0
    non_semantic_count = 0
    total_occurrences = 0

    # Domain group structures
    domain_groups = {}
    for d_id, d_info in DOMAINS.items():
        domain_groups[d_id] = {
            'domainId': d_id,
            'domainName': d_info['en'],
            'domainArabic': d_info['ar'],
            'description': d_info['desc'],
            'icon': d_info['icon'],
            'totalWords': 0,
            'totalOccurrences': 0,
            'categories': {
                'proper_noun': {'name': 'Proper Nouns', 'nameArabic': 'أسماء الأعلام', 'count': 0, 'occurrences': 0, 'words': []},
                'noun': {'name': 'Nouns', 'nameArabic': 'الأسماء', 'count': 0, 'occurrences': 0, 'words': []},
                'adjective': {'name': 'Adjectives & Attributes', 'nameArabic': 'الصفات والنعوت', 'count': 0, 'occurrences': 0, 'words': []},
                'verb': {'name': 'Verbs & Actions', 'nameArabic': 'الأفعال', 'count': 0, 'occurrences': 0, 'words': []}
            },
            'clusters': {
                c_id: {
                    'clusterId': c_id,
                    'clusterName': c_info['en'],
                    'clusterArabic': c_info['ar'],
                    'count': 0,
                    'occurrences': 0,
                    'words': []
                }
                for c_id, c_info in d_info['clusters'].items()
            },
            'topWords': []
        }

    pos_totals = {
        'noun': {'count': 0, 'occurrences': 0},
        'proper_noun': {'count': 0, 'occurrences': 0},
        'adjective': {'count': 0, 'occurrences': 0},
        'verb': {'count': 0, 'occurrences': 0},
        'pronoun': {'count': 0, 'occurrences': 0},
        'adverb': {'count': 0, 'occurrences': 0},
        'particle': {'count': 0, 'occurrences': 0}
    }

    for w in words:
        freq = w.get('frequency', 0)
        total_occurrences += freq
        cat = w.get('posCategory', 'noun')

        if cat in pos_totals:
            pos_totals[cat]['count'] += 1
            pos_totals[cat]['occurrences'] += freq

        d_id, c_id = classify_word(w)

        w_updated = dict(w)

        if d_id and d_id in DOMAINS:
            semantic_count += 1
            d_info = DOMAINS[d_id]
            c_info = d_info['clusters'].get(c_id, list(d_info['clusters'].values())[0])

            w_updated['semanticDomain'] = d_id
            w_updated['semanticDomainName'] = d_info['en']
            w_updated['semanticDomainArabic'] = d_info['ar']
            w_updated['semanticCluster'] = c_id
            w_updated['semanticClusterName'] = c_info['en']
            w_updated['semanticClusterArabic'] = c_info['ar']

            # Aggregate into domain groups
            dg = domain_groups[d_id]
            dg['totalWords'] += 1
            dg['totalOccurrences'] += freq

            if cat in dg['categories']:
                dg['categories'][cat]['count'] += 1
                dg['categories'][cat]['occurrences'] += freq
                if len(dg['categories'][cat]['words']) < 30:
                    dg['categories'][cat]['words'].append(w_updated)

            if c_id in dg['clusters']:
                cl = dg['clusters'][c_id]
                cl['count'] += 1
                cl['occurrences'] += freq
                if len(cl['words']) < 25:
                    cl['words'].append(w_updated)

            if len(dg['topWords']) < 20:
                dg['topWords'].append(w_updated)
        else:
            non_semantic_count += 1
            w_updated['semanticDomain'] = None
            w_updated['semanticDomainName'] = None
            w_updated['semanticDomainArabic'] = None
            w_updated['semanticCluster'] = None
            w_updated['semanticClusterName'] = None
            w_updated['semanticClusterArabic'] = None

        updated_words.append(w_updated)

    # Sort domains by occurrences
    sorted_domains = sorted(list(domain_groups.values()), key=lambda d: d['totalOccurrences'], reverse=True)

    stats_payload = {
        'totalWords': len(updated_words),
        'totalOccurrences': total_occurrences,
        'source': 'Fluent Arabic Quran Frequency List & Corpus Quran Morphology',
        'sourceSpreadsheet': 'Quran-All-Words.xlsx',
        'posTotals': pos_totals,
        'semanticStats': {
            'groupedWordsCount': semantic_count,
            'excludedWordsCount': non_semantic_count,
            'allowedCategories': ['noun', 'proper_noun', 'adjective', 'verb'],
            'totalDomainsCount': len(sorted_domains),
            'rule': 'Only content words: nouns (excluding pronouns), proper nouns, adjectives, and verbs are grouped semantically into thematic domains and close semantic clusters.'
        },
        'semanticDomains': sorted_domains
    }

    # Write files
    with open('src/data/fluentArabicWords.json', 'w', encoding='utf-8') as f:
        json.dump(updated_words, f, ensure_ascii=False, indent=2)

    with open('src/data/fluentArabicStats.json', 'w', encoding='utf-8') as f:
        json.dump(stats_payload, f, ensure_ascii=False, indent=2)

    print(f"Successfully enriched {len(updated_words)} words.")
    print(f"Semantically grouped words: {semantic_count}")
    print(f"Excluded non-semantic words (pronouns, particles, adverbs): {non_semantic_count}")
    print(f"Total Semantic Domains: {len(sorted_domains)}")
    print("\n--- Summary of All 19 Semantic Domains ---")
    for idx, d in enumerate(sorted_domains, 1):
        print(f"{idx:2d}. [{d['domainId']}] {d['domainName']} ({d['totalWords']} words, {d['totalOccurrences']} occurrences)")
        for c_id, c in d['clusters'].items():
            print(f"      - {c['clusterName']} ({c['count']} words, {c['occurrences']}x)")

if __name__ == '__main__':
    run()
