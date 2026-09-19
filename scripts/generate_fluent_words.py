import zipfile
import xml.etree.ElementTree as ET
import json
import re

def normalize_arabic(text):
    if not text: return ""
    t = re.sub(r'[\u064B-\u065F\u0670\u06D6-\u06ED]', '', text)
    t = re.sub(r'[ٱإأآء]', 'ا', t)
    t = t.replace('ة', 'ه').replace('ى', 'ي')
    return t.strip()

# Load raw words from xlsx
z = zipfile.ZipFile('/tmp/Quran-All-Words.xlsx')
shared_strings = []
if 'xl/sharedStrings.xml' in z.namelist():
    tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
    for si in tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
        texts = [node.text for node in si.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t') if node.text]
        shared_strings.append(''.join(texts))

sheet_tree = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
rows = sheet_tree.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row')

def get_val(c):
    t = c.attrib.get('t')
    v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
    if v is None: return ''
    val = v.text
    if t == 's': return shared_strings[int(val)] if int(val) < len(shared_strings) else val
    return val

raw_words = []
for r in rows[1:]:
    cells = [get_val(c) for c in r.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c')]
    if len(cells) >= 3 and cells[0].strip() and cells[1].strip():
        try:
            f = int(float(cells[1].strip()))
            p = float(cells[3].strip()) if len(cells) > 3 and cells[3].strip() else 0.0
            raw_words.append({
                'word': cells[0].strip(),
                'frequency': f,
                'pos': cells[2].strip(),
                'percentage': round(p, 2)
            })
        except: pass

print(f"Loaded {len(raw_words)} raw entries from Fluent Arabic spreadsheet.")

# Primary division and Arabic grammatical term mapping
POS_MAP = {
    'Noun': {'primary': 'noun', 'ar': 'اسم', 'desc': 'Substantive noun or substantive nominal form.'},
    'Verb': {'primary': 'verb', 'ar': 'فعل', 'desc': 'Action verb (past, present/imperfect, or imperative).'},
    'Adjective': {'primary': 'noun', 'ar': 'صفة / نعت', 'desc': 'Qualitative adjective or attribute.'},
    'Proper noun': {'primary': 'noun', 'ar': 'اسم علم', 'desc': 'Proper name of Allah, prophets, individuals, places, or scriptures.'},
    'Time adverb': {'primary': 'noun', 'ar': 'ظرف زمان', 'desc': 'Adverb indicating temporal context or duration.'},
    'Location adverb': {'primary': 'noun', 'ar': 'ظرف مكان', 'desc': 'Adverb indicating spatial context or location.'},
    'Conditional particle': {'primary': 'particle', 'ar': 'حرف شرط', 'desc': 'Particle establishing a conditional clause.'},
    'Demonstrative pronoun': {'primary': 'noun', 'ar': 'اسم إشارة', 'desc': 'Demonstrative pronoun pointing to near or distant entities.'},
    'Interogative particle': {'primary': 'particle', 'ar': 'حرف استفهام', 'desc': 'Particle used to introduce questions or inquiry.'},
    'Accusative particle': {'primary': 'particle', 'ar': 'حرف توكيد ونصب', 'desc': 'Governing accusative particle (Inna and its sisters).'},
    'Preposition': {'primary': 'particle', 'ar': 'حرف جر', 'desc': 'Governing preposition indicating relation or direction.'},
    'Negative particle': {'primary': 'particle', 'ar': 'حرف نفي', 'desc': 'Particle used to negate verbal or nominal sentences.'},
    'Relative pronoun': {'primary': 'noun', 'ar': 'اسم موصول', 'desc': 'Relative pronoun connecting descriptive clauses.'},
    'Subordinating conjunction': {'primary': 'particle', 'ar': 'حرف مصدري', 'desc': 'Subordinating conjunction that introduces dependent clauses.'},
    'Coordinating conjunction': {'primary': 'particle', 'ar': 'حرف عطف', 'desc': 'Conjunction connecting parallel words or clauses.'},
    'Answer particle': {'primary': 'particle', 'ar': 'حرف جواب', 'desc': 'Affirmative or responsive discourse particle.'},
    'Particle of certainty': {'primary': 'particle', 'ar': 'حرف تحقيق', 'desc': 'Particle emphasizing certainty or accomplishment (Qad).'},
    'Inceptive particle': {'primary': 'particle', 'ar': 'حرف ابتداء', 'desc': 'Particle initiating discourse or drawing attention.'},
    'Surprise particle': {'primary': 'particle', 'ar': 'حرف فجاءة', 'desc': 'Particle indicating sudden occurrence (Idha).'},
    'Exceptive particle': {'primary': 'particle', 'ar': 'أداة استثناء', 'desc': 'Particle establishing an exception from a general rule.'},
    'Explanation particle': {'primary': 'particle', 'ar': 'حرف تفسير', 'desc': 'Particle providing clarification or explanatory gloss.'},
    'Imperative verbal noun': {'primary': 'noun', 'ar': 'اسم فعل أمر', 'desc': 'Noun functioning as an imperative command (Hayhat, Hayya).'},
    'Restriction particle': {'primary': 'particle', 'ar': 'أداة حصر', 'desc': 'Particle restricting scope or exclusivity (Innama, Illa).'},
    'Prohibition particle': {'primary': 'particle', 'ar': 'حرف نهي', 'desc': 'Particle forbidding an action with jussive mood (La).'},
    'Retraction particle': {'primary': 'particle', 'ar': 'حرف إضراب', 'desc': 'Particle expressing retraction or turning away (Bal).'},
    'Amendment particle': {'primary': 'particle', 'ar': 'حرف استدراك', 'desc': 'Particle modifying preceding statement (Lakin).'},
    'Particle of interpretation': {'primary': 'particle', 'ar': 'حرف تفسير', 'desc': 'Particle introducing interpretation.'},
    'Future particle': {'primary': 'particle', 'ar': 'حرف استقبال', 'desc': 'Particle indicating near or distant future (Sawfa / Sa-).'},
    'Exhortation particle': {'primary': 'particle', 'ar': 'حرف تحضيض', 'desc': 'Particle urging or encouraging an action (Lawla).'},
    'Aversion particle': {'primary': 'particle', 'ar': 'حرف ردع وزجر', 'desc': 'Emphatic particle of rebuff or deterrent (Kalla).'},
    'Personal pronoun': {'primary': 'noun', 'ar': 'ضمير منفصل', 'desc': 'Detached personal pronoun.'},
    'Supplemental particle': {'primary': 'particle', 'ar': 'حرف صلة وتوكيد', 'desc': 'Connective reinforcing emphasis or cohesion.'},
}

# Domains definitions
SEMANTIC_DOMAINS_META = {
    'theology': {
        'name': 'Theology & Divine Realm',
        'nameArabic': 'الإلهيات والعقيدة والتوحيد',
        'description': 'The Nature of Allah, Sublime Attributes, Divine Will, Celestial Throne, Spirit, and Angels.'
    },
    'prophets-history': {
        'name': 'Prophets & Quranic History',
        'nameArabic': 'النبوات وتاريخ الرسل والأمم',
        'description': 'Names of Prophets, Messengers, Scripture, Revelation, and historical narratives.'
    },
    'eschatology': {
        'name': 'Afterlife & Eschatology',
        'nameArabic': 'السمعيات واليوم الآخر والجزاء',
        'description': 'The Day of Judgment, Resurrection, Paradise (Jannah), Hellfire (Jahannam), Eternity, and Divine Reckoning.'
    },
    'worship-devotion': {
        'name': 'Worship, Pillars & Devotion',
        'nameArabic': 'العبادات والشعائر والطاعات',
        'description': 'Prayer, Zakah, Fasting, Pilgrimage (Hajj), Prostration, Remembrance of Allah, and Supplication.'
    },
    'faith-inner-states': {
        'name': 'Faith, Soul & Spiritual States',
        'nameArabic': 'الإيمان والقلب والمعنويات',
        'description': 'Belief, Faith (Iman), Soul (Nafs), Heart (Qalb), Piety (Taqwa), Patience (Sabr), Fear, Hope, and Repentance.'
    },
    'creation-cosmos': {
        'name': 'Cosmos, Earth & Nature',
        'nameArabic': 'الكونيات والخلق والطبيعة',
        'description': 'The Heavens, Earth, Sun, Moon, Stars, Night, Day, Water, Clouds, Mountains, Animals, and Living Organisms.'
    },
    'ethics-virtues': {
        'name': 'Ethics, Virtues & Morality',
        'nameArabic': 'الأخلاق والفضائل والرذائل',
        'description': 'Truth, Justice, Good Deeds, Charity, Oppression, Falsehood, Arrogance, Hypocrisy, and Forgiveness.'
    },
    'human-society': {
        'name': 'Humanity, Society & Law',
        'nameArabic': 'الإنسان والمجتمع والتشريع',
        'description': 'Mankind, Parents, Kinship, Marriage, Children, Wealth, Community, Contracts, and Civil Decrees.'
    },
    'time-space-motion': {
        'name': 'Time, Space & Movement',
        'nameArabic': 'الزمان والمكان والحركة',
        'description': 'Days, Months, Years, Hours, Directions, Paths, Roads, Coming, Going, Returning, and Spatial Terms.'
    },
    'cognition-speech': {
        'name': 'Speech, Knowledge & Cognition',
        'nameArabic': 'الكلام والعلم والتدبر والفكر',
        'description': 'Speaking, Calling, Knowledge, Hearing, Seeing, Intellect, Reasoning, Reading, and Contemplation.'
    },
    'structural-connectives': {
        'name': 'Grammatical Connectives & Structure',
        'nameArabic': 'الروابط والأدوات اللغوية والتراكيب',
        'description': 'Prepositions, Conjunctions, Negations, Demonstratives, Conditionals, and Governing Particles.'
    }
}


# Common words dictionary with transliteration, English meaning, and semantic domain
KNOWN_LEXICON = {
    "مِن": {"meaning": "from, of, among", "translit": "min", "domain": "structural-connectives"},
    "ٱللَّه": {"meaning": "Allah (The Almighty God)", "translit": "Allāh", "domain": "theology"},
    "فِى": {"meaning": "in, within, inside", "translit": "fī", "domain": "structural-connectives"},
    "إِنّ": {"meaning": "indeed, truly, surely", "translit": "inna", "domain": "structural-connectives"},
    "قَالَ": {"meaning": "he said, to say, to utter", "translit": "qāla", "domain": "cognition-speech"},
    "عَلَىٰ": {"meaning": "on, upon, against, over", "translit": "ʿalā", "domain": "structural-connectives"},
    "ٱلَّذِى": {"meaning": "who, which, that (masc. sing.)", "translit": "alladhī", "domain": "structural-connectives"},
    "لَا": {"meaning": "not, no", "translit": "lā", "domain": "structural-connectives"},
    "كَانَ": {"meaning": "he was, to be, to exist", "translit": "kāna", "domain": "time-space-motion"},
    "مَا": {"meaning": "what, that which / not", "translit": "mā", "domain": "structural-connectives"},
    "رَبّ": {"meaning": "Lord, Sustainer, Cherisher", "translit": "Rabb", "domain": "theology"},
    "إِلَىٰ": {"meaning": "to, toward, unto", "translit": "ilā", "domain": "structural-connectives"},
    "مَن": {"meaning": "who, whoever, whomever", "translit": "man", "domain": "structural-connectives"},
    "إِن": {"meaning": "if, whether", "translit": "in", "domain": "structural-connectives"},
    "أَن": {"meaning": "that, to (conjunction)", "translit": "an", "domain": "structural-connectives"},
    "إِلَّا": {"meaning": "except, unless, but", "translit": "illā", "domain": "structural-connectives"},
    "ءَامَنَ": {"meaning": "he believed, to have faith", "translit": "āmana", "domain": "faith-inner-states"},
    "ذَٰلِك": {"meaning": "that, that one", "translit": "dhālika", "domain": "structural-connectives"},
    "عَن": {"meaning": "from, about, concerning", "translit": "ʿan", "domain": "structural-connectives"},
    "أَرْض": {"meaning": "earth, land, soil", "translit": "arḍ", "domain": "creation-cosmos"},
    "قَد": {"meaning": "already, indeed, certainly", "translit": "qad", "domain": "structural-connectives"},
    "إِذَا": {"meaning": "when, whenever, behold", "translit": "idhā", "domain": "structural-connectives"},
    "قَوْم": {"meaning": "people, folk, tribe, nation", "translit": "qawm", "domain": "human-society"},
    "ءَايَة": {"meaning": "sign, verse, divine miracle", "translit": "āyah", "domain": "prophets-history"},
    "عَلِمَ": {"meaning": "he knew, to know, to perceive", "translit": "ʿalima", "domain": "cognition-speech"},
    "أَنّ": {"meaning": "that, indeed that", "translit": "anna", "domain": "structural-connectives"},
    "كُلّ": {"meaning": "all, every, each", "translit": "kull", "domain": "structural-connectives"},
    "لَم": {"meaning": "did not, not yet (past negation)", "translit": "lam", "domain": "structural-connectives"},
    "جَعَلَ": {"meaning": "he made, appointed, set, established", "translit": "jaʿala", "domain": "creation-cosmos"},
    "ثُمّ": {"meaning": "then, thereupon, afterward", "translit": "thumma", "domain": "structural-connectives"},
    "رَسُول": {"meaning": "messenger, envoy, apostle", "translit": "rasūl", "domain": "prophets-history"},
    "يَوْم": {"meaning": "day, period, epoch", "translit": "yawm", "domain": "time-space-motion"},
    "عَذَاب": {"meaning": "punishment, penalty, torment", "translit": "ʿadhāb", "domain": "eschatology"},
    "هَٰذَا": {"meaning": "this, this one (masc.)", "translit": "hādhā", "domain": "structural-connectives"},
    "سَمَآء": {"meaning": "heaven, sky, firmament", "translit": "samāʾ", "domain": "creation-cosmos"},
    "نَفْس": {"meaning": "soul, self, living person", "translit": "nafs", "domain": "faith-inner-states"},
    "كَفَرَ": {"meaning": "he disbelieved, denied the truth", "translit": "kafara", "domain": "faith-inner-states"},
    "شَىْء": {"meaning": "thing, matter, entity", "translit": "shayʾ", "domain": "creation-cosmos"},
    "أَو": {"meaning": "or, otherwise", "translit": "aw", "domain": "structural-connectives"},
    "جَآءَ": {"meaning": "he came, arrived, reached", "translit": "jāʾa", "domain": "time-space-motion"},
    "عَمِلَ": {"meaning": "he worked, performed deeds, acted", "translit": "ʿamila", "domain": "ethics-virtues"},
    "آتَى": {"meaning": "he gave, bestowed, granted", "translit": "ātā", "domain": "theology"},
    "رَءَا": {"meaning": "he saw, beheld, perceived", "translit": "raʾā", "domain": "cognition-speech"},
    "أَتَى": {"meaning": "he came, approached, drew near", "translit": "atā", "domain": "time-space-motion"},
    "كِتَٰب": {"meaning": "book, scripture, record, decree", "translit": "kitāb", "domain": "prophets-history"},
    "بَيْن": {"meaning": "between, among", "translit": "bayna", "domain": "time-space-motion"},
    "حَقّ": {"meaning": "truth, right, reality, justice", "translit": "ḥaqq", "domain": "ethics-virtues"},
    "نَّاس": {"meaning": "people, mankind, humanity", "translit": "nās", "domain": "human-society"},
    "شَآءَ": {"meaning": "he willed, wished, decreed", "translit": "shāʾa", "domain": "theology"},
    "خَلَقَ": {"meaning": "he created, fashioned, originated", "translit": "khalaqa", "domain": "theology"},
    "أَنزَلَ": {"meaning": "he sent down, revealed", "translit": "anzala", "domain": "prophets-history"},
    "كَذَّبَ": {"meaning": "he denied, rejected, deemed false", "translit": "kadhdhaba", "domain": "ethics-virtues"},
    "دَعَا": {"meaning": "he called, invoked, supplicated", "translit": "daʿā", "domain": "worship-devotion"},
    "ٱتَّقَىٰ": {"meaning": "he was mindful of Allah, feared Allah, was pious", "translit": "ittaqā", "domain": "faith-inner-states"},
    "هَدَى": {"meaning": "he guided, directed, led aright", "translit": "hadā", "domain": "faith-inner-states"},
    "أَرَادَ": {"meaning": "he intended, willed, desired", "translit": "arāda", "domain": "cognition-speech"},
    "ٱتَّبَعَ": {"meaning": "he followed, obeyed, conformed to", "translit": "ittabaʿa", "domain": "faith-inner-states"},
    "مُوسَىٰ": {"meaning": "Moses (Prophet Musa)", "translit": "Mūsā", "domain": "prophets-history"},
    "شَيْطَٰن": {"meaning": "Satan, the Devil, rebellious spirit", "translit": "shayṭān", "domain": "faith-inner-states"},
    "جَهَنَّم": {"meaning": "Hell, Hellfire, Jahannam", "translit": "Jahannam", "domain": "eschatology"},
    "فِرْعَوْن": {"meaning": "Pharaoh (King of Egypt)", "translit": "Firʿawn", "domain": "prophets-history"},
    "إِبْرَاهِيم": {"meaning": "Abraham (Prophet Ibrahim)", "translit": "Ibrāhīm", "domain": "prophets-history"},
    "قُرْءَان": {"meaning": "The Noble Quran (The Recitation)", "translit": "Qurʾān", "domain": "prophets-history"},
    "جَنَّة": {"meaning": "Paradise, Garden of Bliss, lush garden", "translit": "jannah", "domain": "eschatology"},
    "إِسْرَائِيل": {"meaning": "Israel (Jacob, Banu Isra'il)", "translit": "Isrāʾīl", "domain": "prophets-history"},
    "نُوح": {"meaning": "Noah (Prophet Nuh)", "translit": "Nūḥ", "domain": "prophets-history"},
    "مَرْيَم": {"meaning": "Mary, mother of Jesus (Maryam)", "translit": "Maryam", "domain": "prophets-history"},
    "لُوط": {"meaning": "Lot (Prophet Lut)", "translit": "Lūṭ", "domain": "prophets-history"},
    "يُوسُف": {"meaning": "Joseph (Prophet Yusuf)", "translit": "Yūsuf", "domain": "prophets-history"},
    "ثَمُود": {"meaning": "Thamud (ancient Arab tribe)", "translit": "Thamūd", "domain": "prophets-history"},
    "آدَم": {"meaning": "Adam (The first human and prophet)", "translit": "Ādam", "domain": "prophets-history"},
    "عِيسَى": {"meaning": "Jesus, son of Mary (Prophet Isa)", "translit": "ʿĪsā", "domain": "prophets-history"},
    "عَاد": {"meaning": "'Ad (ancient people of Prophet Hud)", "translit": "ʿĀd", "domain": "prophets-history"},
    "هَٰرُون": {"meaning": "Aaron (Prophet Harun)", "translit": "Hārūn", "domain": "prophets-history"},
    "تَّوْرَىٰة": {"meaning": "The Torah (Scripture of Moses)", "translit": "al-Tawrāt", "domain": "prophets-history"},
    "إِسْحَاق": {"meaning": "Isaac (Prophet Ishaq)", "translit": "Isḥāq", "domain": "prophets-history"},
    "صَلَوٰة": {"meaning": "Prayer, ritual worship, supplication", "translit": "ṣalāh", "domain": "worship-devotion"},
    "زَكَوٰة": {"meaning": "Zakah, purifying obligatory alms", "translit": "zakāh", "domain": "worship-devotion"},
    "حَجّ": {"meaning": "Hajj, pilgrimage to the Sacred House", "translit": "ḥajj", "domain": "worship-devotion"},
    "صَوْم": {"meaning": "Fasting, abstinence", "translit": "ṣawm", "domain": "worship-devotion"},
    "سُجُود": {"meaning": "Prostration in reverence before Allah", "translit": "sujūd", "domain": "worship-devotion"},
    "مَسْجِد": {"meaning": "Mosque, place of prostration and prayer", "translit": "masjid", "domain": "worship-devotion"},
    "قَلْب": {"meaning": "Heart, inner consciousness, spiritual core", "translit": "qalb", "domain": "faith-inner-states"},
    "رُوح": {"meaning": "Spirit, soul, Angel Gabriel (Jibril)", "translit": "rūḥ", "domain": "theology"},
    "عَرْش": {"meaning": "The Divine Throne of Allah", "translit": "ʿArsh", "domain": "theology"},
    "مَلَك": {"meaning": "Angel, celestial messenger of Allah", "translit": "malak", "domain": "theology"},
    "مَلَٰٓئِكَة": {"meaning": "Angels (plural)", "translit": "malāʾikah", "domain": "theology"},
    "قِيَٰمَة": {"meaning": "Resurrection, standing before Allah", "translit": "qiyāmah", "domain": "eschatology"},
    "بَعْث": {"meaning": "Resurrection from the graves, raising", "translit": "baʿth", "domain": "eschatology"},
    "حِسَاب": {"meaning": "Reckoning, divine account of deeds", "translit": "ḥisāb", "domain": "eschatology"},
    "مِيزَان": {"meaning": "Scale, balance of deeds on the Last Day", "translit": "mīzān", "domain": "eschatology"},
    "صِرَٰط": {"meaning": "The Straight Path, highway of guidance", "translit": "ṣirāṭ", "domain": "faith-inner-states"},
    "خُلْد": {"meaning": "Eternity, everlasting abode", "translit": "khuld", "domain": "eschatology"},
    "شَمْس": {"meaning": "Sun", "translit": "shams", "domain": "creation-cosmos"},
    "قَمَر": {"meaning": "Moon", "translit": "qamar", "domain": "creation-cosmos"},
    "نَجْم": {"meaning": "Star, celestial body", "translit": "najm", "domain": "creation-cosmos"},
    "جَبَل": {"meaning": "Mountain", "translit": "jabal", "domain": "creation-cosmos"},
    "بَحْر": {"meaning": "Sea, ocean, large body of water", "translit": "baḥr", "domain": "creation-cosmos"},
    "نَهَر": {"meaning": "River, flowing stream", "translit": "nahar", "domain": "creation-cosmos"},
    "مَآء": {"meaning": "Water, rain", "translit": "māʾ", "domain": "creation-cosmos"},
    "شَجَر": {"meaning": "Tree, vegetation", "translit": "shajar", "domain": "creation-cosmos"},
    "رِيح": {"meaning": "Wind, tempest", "translit": "rīḥ", "domain": "creation-cosmos"},
    "سَحَاب": {"meaning": "Clouds", "translit": "saḥāb", "domain": "creation-cosmos"},
    "مَطَر": {"meaning": "Rain, showers", "translit": "maṭar", "domain": "creation-cosmos"},
    "نُور": {"meaning": "Light, illumination, divine radiance", "translit": "nūr", "domain": "theology"},
    "ظُلُمَٰت": {"meaning": "Darknesses, layers of gloom, ignorance", "translit": "ẓulumāt", "domain": "ethics-virtues"},
    "عَدْل": {"meaning": "Justice, fairness, equity", "translit": "ʿadl", "domain": "ethics-virtues"},
    "ظُلْم": {"meaning": "Oppression, injustice, wrongdoing", "translit": "ẓulm", "domain": "ethics-virtues"},
    "إِحْسَٰن": {"meaning": "Excellence in worship, benevolence, goodness", "translit": "iḥsān", "domain": "ethics-virtues"},
    "صَبْر": {"meaning": "Patience, perseverance, steadfastness", "translit": "ṣabr", "domain": "faith-inner-states"},
    "شُكْر": {"meaning": "Gratitude, thankfulness to Allah", "translit": "shukr", "domain": "faith-inner-states"},
    "تَوْبَة": {"meaning": "Repentance, returning to Allah in remorse", "translit": "tawbah", "domain": "faith-inner-states"},
    "مَغْفِرَة": {"meaning": "Forgiveness, divine pardon", "translit": "maghfirah", "domain": "theology"},
    "رَحْمَة": {"meaning": "Mercy, compassion, grace", "translit": "raḥmah", "domain": "theology"},
    "غَفُور": {"meaning": "All-Forgiving, Oft-Pardoning", "translit": "Ghafūr", "domain": "theology"},
    "رَّحِيم": {"meaning": "Most Merciful, Bestower of Mercy", "translit": "Raḥīm", "domain": "theology"},
    "رَّحْمَٰن": {"meaning": "The Entirely Merciful, All-Gracious", "translit": "Raḥmān", "domain": "theology"},
    "عَلِيم": {"meaning": "All-Knowing, Omniscient", "translit": "ʿAlīm", "domain": "theology"},
    "حَكِيم": {"meaning": "All-Wise", "translit": "Ḥakīm", "domain": "theology"},
    "عَزِيز": {"meaning": "All-Mighty, Honorable, Exalted", "translit": "ʿAzīz", "domain": "theology"},
    "قَدِير": {"meaning": "All-Powerful, Omnipotent", "translit": "Qadīr", "domain": "theology"},
    "خَبِير": {"meaning": "All-Aware, Acquainted with all matters", "translit": "Khabīr", "domain": "theology"},
    "بَصِير": {"meaning": "All-Seeing", "translit": "Baṣīr", "domain": "theology"},
    "سَمِيع": {"meaning": "All-Hearing", "translit": "Samīʿ", "domain": "theology"},
    "مَالِك": {"meaning": "Sovereign, Owner, King", "translit": "Mālik", "domain": "theology"},
    "مَلِك": {"meaning": "King, Sovereign Lord", "translit": "Malik", "domain": "theology"},
    "قُدُّوس": {"meaning": "The Holy, The Pure", "translit": "Quddūs", "domain": "theology"},
    "سَلَٰم": {"meaning": "Peace, The Flawless, Source of Peace", "translit": "Salām", "domain": "theology"},
    "مُؤْمِن": {"meaning": "Believer / The Granter of Security", "translit": "muʾmin", "domain": "faith-inner-states"},
    "مُهَيْمِن": {"meaning": "The Guardian, Preserver over all things", "translit": "Muhaymin", "domain": "theology"},
    "خَٰلِق": {"meaning": "The Creator", "translit": "Khāliq", "domain": "theology"},
    "بَارِئ": {"meaning": "The Originator, The Evolver", "translit": "Bāriʾ", "domain": "theology"},
    "مُصَوِّر": {"meaning": "The Fashioner, Shaper of forms", "translit": "Muṣawwir", "domain": "theology"},
    "وَهَّاب": {"meaning": "The Bestower, Giver of all gifts", "translit": "Wahhāb", "domain": "theology"},
    "رَزَّاق": {"meaning": "The Provider, Provider of sustenance", "translit": "Razzāq", "domain": "theology"},
    "فَتَّاح": {"meaning": "The Opener, The Supreme Arbiter", "translit": "Fattāḥ", "domain": "theology"},
    "غَفَّار": {"meaning": "The Repeatedly Forgiving", "translit": "Ghaffār", "domain": "theology"},
    "قَهَّار": {"meaning": "The Subduer, The Irresistible", "translit": "Qahhār", "domain": "theology"},
    "كَبِير": {"meaning": "The Great, Grand, Elder", "translit": "Kabīr", "domain": "theology"},
    "عَظِيم": {"meaning": "The Magnificent, Tremendous", "translit": "ʿAẓīm", "domain": "theology"},
    "عَلِىّ": {"meaning": "The Most High, Exalted", "translit": "ʿAlī", "domain": "theology"},
    "لَطِيف": {"meaning": "The Subtle, Most Kind", "translit": "Laṭīf", "domain": "theology"},
    "حَلِيم": {"meaning": "The Forbearing, Gentle", "translit": "Ḥalīm", "domain": "theology"},
    "شَكُور": {"meaning": "The Appreciative, Rewarder of gratitude", "translit": "Shakūr", "domain": "theology"},
    "حَفِيظ": {"meaning": "The Guardian, Preserver", "translit": "Ḥafīẓ", "domain": "theology"},
    "مُقِيت": {"meaning": "The Nourisher, Maintainer", "translit": "Muqīt", "domain": "theology"},
    "حَسِيب": {"meaning": "The Reckoner, Sufficer", "translit": "Ḥasīb", "domain": "theology"},
    "جَلِيل": {"meaning": "The Majestic", "translit": "Jalīl", "domain": "theology"},
    "كَرِيم": {"meaning": "The Generous, Bountiful, Noble", "translit": "Karīm", "domain": "theology"},
    "رَقِيب": {"meaning": "The Watchful, Observer", "translit": "Raqīb", "domain": "theology"},
    "مُجِيب": {"meaning": "The Responsive, Answerer of prayers", "translit": "Mujīb", "domain": "theology"},
    "وَٰسِع": {"meaning": "The All-Encompassing, Vast", "translit": "Wāsiʿ", "domain": "theology"},
    "وَدُود": {"meaning": "The Most Loving, Affectionate", "translit": "Wadūd", "domain": "theology"},
    "مَجِيد": {"meaning": "The Glorious, Honorable", "translit": "Majīd", "domain": "theology"},
    "بَاعِث": {"meaning": "The Resurrector", "translit": "Bāʿith", "domain": "theology"},
    "شَهِيد": {"meaning": "The Witness, Martyr, Omnipresent Observer", "translit": "Shahīd", "domain": "theology"},
    "وَكِيل": {"meaning": "The Trustee, Disposer of Affairs", "translit": "Wakīl", "domain": "theology"},
    "قَوِىّ": {"meaning": "The Strong, All-Powerful", "translit": "Qawī", "domain": "theology"},
    "مَتِين": {"meaning": "The Firm, Steadfast", "translit": "Matīn", "domain": "theology"},
    "وَلِىّ": {"meaning": "The Protecting Friend, Ally, Guardian", "translit": "Walī", "domain": "theology"},
    "حَمِيد": {"meaning": "The Praiseworthy, All-Lauded", "translit": "Ḥamīd", "domain": "theology"},
    "حَىّ": {"meaning": "The Ever-Living, Alive", "translit": "Ḥayy", "domain": "theology"},
    "قَيُّوم": {"meaning": "The Self-Subsisting, Sustainer of all existence", "translit": "Qayyūm", "domain": "theology"},
    "وَٰحِد": {"meaning": "The One, Unique", "translit": "Wāḥid", "domain": "theology"},
    "أَحَد": {"meaning": "The Absolute One, Indivisible", "translit": "Aḥad", "domain": "theology"},
    "صَمَد": {"meaning": "The Eternal, Self-Sufficient, Besought of all", "translit": "Ṣamad", "domain": "theology"},
    "أَوَّل": {"meaning": "The First, Beginning without origin", "translit": "Awwal", "domain": "theology"},
    "ءَاخِر": {"meaning": "The Last, End without termination", "translit": "Ākhir", "domain": "theology"},
    "ظَٰهِر": {"meaning": "The Manifest, Evident", "translit": "Ẓāhir", "domain": "theology"},
    "بَاطِن": {"meaning": "The Hidden, Unseen", "translit": "Bāṭin", "domain": "theology"},
    "بَرّ": {"meaning": "The Source of All Goodness, Dutiful, Righteous", "translit": "Barr", "domain": "theology"},
    "تَوَّاب": {"meaning": "The Accepter of Repentance, Oft-Returning", "translit": "Tawwāb", "domain": "theology"},
    "عَفُوّ": {"meaning": "The Pardoner, Effacer of sins", "translit": "ʿAfuww", "domain": "theology"},
    "رَءُوف": {"meaning": "The Most Kind, Full of Pity", "translit": "Raʾūf", "domain": "theology"},
    "غَنِىّ": {"meaning": "The Self-Sufficient, Free of all need", "translit": "Ghanī", "domain": "theology"},
    "نَاصِر": {"meaning": "The Helper, Victorious Grantor", "translit": "Nāṣir", "domain": "theology"},
    "هَادِى": {"meaning": "The Guide, Directing to Truth", "translit": "Hādī", "domain": "theology"},
    "بَدِيع": {"meaning": "The Originator without model", "translit": "Badīʿ", "domain": "theology"},
}

