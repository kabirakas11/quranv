import zipfile
import xml.etree.ElementTree as ET
import json
import re

# 1. Parse Excel from /tmp/Quran-All-Words.xlsx
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

# Load existing semantic domains lexicon
existing_lexicon = {}
try:
    with open('src/data/semanticDomains.ts', 'r', encoding='utf-8') as f:
        sd_text = f.read()
        entries = re.findall(r"\{\s*id:\s*['\"]([^'\"]+)['\"].*?word:\s*['\"]([^'\"]+)['\"].*?transliteration:\s*['\"]([^'\"]+)['\"].*?meaning:\s*['\"]([^'\"]+)['\"]", sd_text, re.DOTALL)
        for eid, w, tr, m in entries:
            clean_w = re.sub(r'[\u064B-\u065F\u0670\u06D6-\u06ED]', '', w).replace('ٱ', 'ا').strip()
            existing_lexicon[w.strip()] = {'meaning': m, 'translit': tr}
            existing_lexicon[clean_w] = {'meaning': m, 'translit': tr}
except Exception as e:
    print('Warning reading semanticDomains:', e)

# Arab letter to latin mapping
AR_TO_LATIN = {
    'ء': 'ʾ', 'آ': 'ā', 'أ': 'a', 'ؤ': 'u', 'إ': 'i', 'ئ': 'i', 'ا': 'ā', 'ٱ': 'a',
    'ب': 'b', 'ة': 'ah', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'ḥ', 'خ': 'kh',
    'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 'ṣ',
    'ض': 'ḍ', 'ط': 'ṭ', 'ظ': 'ẓ', 'ع': 'ʿ', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
    'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ى': 'ā',
    'ي': 'y', 'َ': 'a', 'ُ': 'u', 'ِ': 'i', 'ً': 'an', 'ٌ': 'un', 'ٍ': 'in',
    'ْ': '', 'ّ': 'ّ', 'ٰ': 'ā', 'ٓ': '', 'ۦ': 'ī', 'ۨ': '', 'ۥ': 'ū'
}

def transliterate_arabic(text):
    res = []
    chars = list(text)
    for idx, c in enumerate(chars):
        if c == 'ّ':
            if res:
                prev = res[-1]
                if prev in 'btthjḥkhddhrzsṣḍṭẓʿghfqklmnhwyʾ':
                    res.append(prev)
            continue
        lat = AR_TO_LATIN.get(c, c)
        res.append(lat)
    t = ''.join(res)
    t = re.sub(r'aā', 'ā', t)
    t = re.sub(r'iī', 'ī', t)
    t = re.sub(r'uū', 'ū', t)
    return t.strip()

def normalize_arabic(text):
    if not text: return ""
    t = re.sub(r'[\u064B-\u065F\u0670\u06D6-\u06ED]', '', text)
    t = re.sub(r'[ٱإأآء]', 'ا', t)
    t = t.replace('ة', 'ه').replace('ى', 'ي')
    return t.strip()

POS_INFO = {
    'Noun': {'primary': 'noun', 'ar': 'اسم', 'title': 'Noun'},
    'Verb': {'primary': 'verb', 'ar': 'فعل', 'title': 'Verb'},
    'Adjective': {'primary': 'noun', 'ar': 'صفة / نعت', 'title': 'Adjective'},
    'Proper noun': {'primary': 'noun', 'ar': 'اسم علم', 'title': 'Proper Noun'},
    'Time adverb': {'primary': 'noun', 'ar': 'ظرف زمان', 'title': 'Time Adverb'},
    'Location adverb': {'primary': 'noun', 'ar': 'ظرف مكان', 'title': 'Location Adverb'},
    'Conditional particle': {'primary': 'particle', 'ar': 'حرف شرط', 'title': 'Conditional Particle'},
    'Demonstrative pronoun': {'primary': 'noun', 'ar': 'اسم إشارة', 'title': 'Demonstrative Pronoun'},
    'Interogative particle': {'primary': 'particle', 'ar': 'حرف استفهام', 'title': 'Interrogative Particle'},
    'Accusative particle': {'primary': 'particle', 'ar': 'حرف توكيد ونصب', 'title': 'Accusative Particle (Inna)'},
    'Preposition': {'primary': 'particle', 'ar': 'حرف جر', 'title': 'Preposition'},
    'Negative particle': {'primary': 'particle', 'ar': 'حرف نفي', 'title': 'Negative Particle'},
    'Relative pronoun': {'primary': 'noun', 'ar': 'اسم موصول', 'title': 'Relative Pronoun'},
    'Subordinating conjunction': {'primary': 'particle', 'ar': 'حرف مصدري', 'title': 'Subordinating Conjunction'},
    'Coordinating conjunction': {'primary': 'particle', 'ar': 'حرف عطف', 'title': 'Coordinating Conjunction'},
    'Answer particle': {'primary': 'particle', 'ar': 'حرف جواب', 'title': 'Answer Particle'},
    'Particle of certainty': {'primary': 'particle', 'ar': 'حرف تحقيق', 'title': 'Particle of Certainty (Qad)'},
    'Inceptive particle': {'primary': 'particle', 'ar': 'حرف ابتداء', 'title': 'Inceptive Particle'},
    'Surprise particle': {'primary': 'particle', 'ar': 'حرف فجاءة', 'title': 'Surprise Particle (Idha)'},
    'Exceptive particle': {'primary': 'particle', 'ar': 'أداة استثناء', 'title': 'Exceptive Particle (Illa)'},
    'Explanation particle': {'primary': 'particle', 'ar': 'حرف تفسير', 'title': 'Explanation Particle'},
    'Imperative verbal noun': {'primary': 'noun', 'ar': 'اسم فعل أمر', 'title': 'Imperative Verbal Noun'},
    'Restriction particle': {'primary': 'particle', 'ar': 'أداة حصر', 'title': 'Restriction Particle (Innama)'},
    'Prohibition particle': {'primary': 'particle', 'ar': 'حرف نهي', 'title': 'Prohibition Particle (La)'},
    'Retraction particle': {'primary': 'particle', 'ar': 'حرف إضراب', 'title': 'Retraction Particle (Bal)'},
    'Amendment particle': {'primary': 'particle', 'ar': 'حرف استدراك', 'title': 'Amendment Particle (Lakin)'},
    'Particle of interpretation': {'primary': 'particle', 'ar': 'حرف تفسير', 'title': 'Interpretation Particle'},
    'Future particle': {'primary': 'particle', 'ar': 'حرف استقبال', 'title': 'Future Particle (Sawfa / Sa-)'},
    'Exhortation particle': {'primary': 'particle', 'ar': 'حرف تحضيض', 'title': 'Exhortation Particle (Lawla)'},
    'Aversion particle': {'primary': 'particle', 'ar': 'حرف ردع وزجر', 'title': 'Aversion Particle (Kalla)'},
    'Personal pronoun': {'primary': 'noun', 'ar': 'ضمير منفصل', 'title': 'Personal Pronoun'},
    'Supplemental particle': {'primary': 'particle', 'ar': 'حرف صلة وتوكيد', 'title': 'Supplemental Particle'}
}

# Rich vocabulary lexicon for frequent Quran words
VOCAB = {
    # Top particles & structural
    "مِن": {"m": "from, of, among", "t": "min", "d": "structural-connectives"},
    "فِى": {"m": "in, within, inside", "t": "fī", "d": "structural-connectives"},
    "إِنّ": {"m": "indeed, truly, surely", "t": "inna", "d": "structural-connectives"},
    "عَلَىٰ": {"m": "on, upon, against, over", "t": "ʿalā", "d": "structural-connectives"},
    "ٱلَّذِى": {"m": "who, which, that (masc. sing.)", "t": "alladhī", "d": "structural-connectives"},
    "لَا": {"m": "not, no, neither", "t": "lā", "d": "structural-connectives"},
    "مَا": {"m": "what, that which / not", "t": "mā", "d": "structural-connectives"},
    "إِلَىٰ": {"m": "to, toward, unto", "t": "ilā", "d": "structural-connectives"},
    "مَن": {"m": "who, whoever, whomever", "t": "man", "d": "structural-connectives"},
    "إِن": {"m": "if / not (in negative clauses)", "t": "in", "d": "structural-connectives"},
    "أَن": {"m": "that, to (conjunction)", "t": "an", "d": "structural-connectives"},
    "إِلَّا": {"m": "except, unless, but only", "t": "illā", "d": "structural-connectives"},
    "ذَٰلِك": {"m": "that, that one (masc.)", "t": "dhālika", "d": "structural-connectives"},
    "عَن": {"m": "from, away from, concerning", "t": "ʿan", "d": "structural-connectives"},
    "قَد": {"m": "already, indeed, certainly", "t": "qad", "d": "structural-connectives"},
    "إِذَا": {"m": "when, whenever / behold", "t": "idhā", "d": "time-space-motion"},
    "أَنّ": {"m": "that (subordinating)", "t": "anna", "d": "structural-connectives"},
    "كُلّ": {"m": "all, every, whole, each", "t": "kull", "d": "structural-connectives"},
    "لَم": {"m": "did not, not yet (past negation)", "t": "lam", "d": "structural-connectives"},
    "ثُمّ": {"m": "then, thereupon, afterward", "t": "thumma", "d": "structural-connectives"},
    "هَٰذَا": {"m": "this, this one (masc.)", "t": "hādhā", "d": "structural-connectives"},
    "أَو": {"m": "or, alternatively", "t": "aw", "d": "structural-connectives"},
    "بَيْن": {"m": "between, in between, among", "t": "bayna", "d": "time-space-motion"},
    "قَبْل": {"m": "before, prior to", "t": "qabla", "d": "time-space-motion"},
    "بَعْد": {"m": "after, afterward, beyond", "t": "baʿda", "d": "time-space-motion"},
    "حَتَّىٰ": {"m": "until, so that, even", "t": "ḥattā", "d": "structural-connectives"},
    "عِند": {"m": "at, near, with, in the presence of", "t": "ʿinda", "d": "time-space-motion"},
    "كَيْف": {"m": "how, in what manner", "t": "kayfa", "d": "structural-connectives"},
    "أَيّ": {"m": "which, whichever, what", "t": "ayyu", "d": "structural-connectives"},
    "إِذ": {"m": "when, as, since", "t": "idh", "d": "time-space-motion"},
    "حَيْث": {"m": "where, wherever", "t": "ḥaythu", "d": "time-space-motion"},
    "مَع": {"m": "with, accompanied by", "t": "maʿa", "d": "structural-connectives"},
    "لَن": {"m": "will never, by no means", "t": "lan", "d": "structural-connectives"},
    "لَمَّا": {"m": "when / not yet", "t": "lammā", "d": "time-space-motion"},
    "أَم": {"m": "or (in interrogatives)", "t": "am", "d": "structural-connectives"},
    "بَل": {"m": "nay, rather, but", "t": "bal", "d": "structural-connectives"},
    "لَٰكِن": {"m": "but, however", "t": "lākin", "d": "structural-connectives"},
    "إِنَّمَا": {"m": "only, merely, verily only", "t": "innamā", "d": "structural-connectives"},
    "كَلَّا": {"m": "by no means! nay! verily!", "t": "kallā", "d": "structural-connectives"},
    "عَسَىٰ": {"m": "perhaps, it may be that", "t": "ʿasā", "d": "faith-ethics"},
    "لَعَلّ": {"m": "so that, perhaps, hoping that", "t": "laʿalla", "d": "structural-connectives"},
    "لَيْت": {"m": "would that, I wish that", "t": "layta", "d": "structural-connectives"},
    "نِعْمَ": {"m": "how excellent! what a good...", "t": "niʿma", "d": "ethics-virtues"},
    "بِئْس": {"m": "how evil! what a wretched...", "t": "biʾsa", "d": "ethics-virtues"},
    "هَٰؤُلَآء": {"m": "these, these ones", "t": "hāʾulāʾ", "d": "structural-connectives"},
    "أُو۟لَٰٓئِك": {"m": "those, those ones", "t": "ulāʾik", "d": "structural-connectives"},
    "ٱلَّذِينَ": {"m": "those who (masc. plur.)", "t": "alladhīna", "d": "structural-connectives"},
    "ٱلَّتِى": {"m": "who, which (fem. sing.)", "t": "allatī", "d": "structural-connectives"},
    "هُوَ": {"m": "he, it (3rd pers. sing.)", "t": "huwa", "d": "structural-connectives"},
    "هِيَ": {"m": "she, it (3rd pers. fem. sing.)", "t": "hiya", "d": "structural-connectives"},
    "هُم": {"m": "they (3rd pers. masc. plur.)", "t": "hum", "d": "structural-connectives"},
    "أَنتَ": {"m": "you (2nd pers. masc. sing.)", "t": "anta", "d": "structural-connectives"},
    "أَنتُم": {"m": "you (2nd pers. masc. plur.)", "t": "antum", "d": "structural-connectives"},
    "نَحْن": {"m": "we (1st pers. plur.)", "t": "naḥnu", "d": "structural-connectives"},
    "أَنَا۠": {"m": "I (1st pers. sing.)", "t": "anā", "d": "structural-connectives"},

    # Proper Nouns (Divinity, Prophets, Scriptures, Entities)
    "ٱللَّه": {"m": "Allah (The Almighty God)", "t": "Allāh", "d": "divine-realm"},
    "مُوسَىٰ": {"m": "Moses (Prophet Musa)", "t": "Mūsā", "d": "prophethood-revelation"},
    "شَيْطَٰن": {"m": "Satan, the Devil, rebellious one", "t": "shayṭān", "d": "faith-ethics"},
    "جَهَنَّم": {"m": "Hell, Hellfire, Jahannam", "t": "Jahannam", "d": "afterlife-eschatology"},
    "فِرْعَوْن": {"m": "Pharaoh (King of ancient Egypt)", "t": "Firʿawn", "d": "history-civilizations"},
    "إِبْرَاهِيم": {"m": "Abraham (Prophet Ibrahim)", "t": "Ibrāhīm", "d": "prophethood-revelation"},
    "قُرْءَان": {"m": "The Noble Quran (The Divine Recitation)", "t": "Qurʾān", "d": "prophethood-revelation"},
    "جَنَّة": {"m": "Paradise, Garden of eternal bliss", "t": "Jannah", "d": "afterlife-eschatology"},
    "إِسْرَائِيل": {"m": "Israel (Jacob, Banu Isra'il)", "t": "Isrāʾīl", "d": "history-civilizations"},
    "نُوح": {"m": "Noah (Prophet Nuh)", "t": "Nūḥ", "d": "prophethood-revelation"},
    "مَرْيَم": {"m": "Mary, mother of Jesus (Maryam)", "t": "Maryam", "d": "prophethood-revelation"},
    "لُوط": {"m": "Lot (Prophet Lut)", "t": "Lūṭ", "d": "prophethood-revelation"},
    "يُوسُف": {"m": "Joseph (Prophet Yusuf)", "t": "Yūsuf", "d": "prophethood-revelation"},
    "ثَمُود": {"m": "Thamud (ancient Arab tribe of Salih)", "t": "Thamūd", "d": "history-civilizations"},
    "آدَم": {"m": "Adam (the first human and prophet)", "t": "Ādam", "d": "prophethood-revelation"},
    "عِيسَى": {"m": "Jesus, son of Mary (Prophet Isa)", "t": "ʿĪsā", "d": "prophethood-revelation"},
    "عَاد": {"m": "'Ad (ancient people of Prophet Hud)", "t": "ʿĀd", "d": "history-civilizations"},
    "هَٰرُون": {"m": "Aaron (Prophet Harun)", "t": "Hārūn", "d": "prophethood-revelation"},
    "تَّوْرَىٰة": {"m": "The Torah (Scripture of Moses)", "t": "al-Tawrāt", "d": "prophethood-revelation"},
    "إِسْحَاق": {"m": "Isaac (Prophet Ishaq)", "t": "Isḥāq", "d": "prophethood-revelation"},
    "سُلَيْمَٰن": {"m": "Solomon (Prophet Sulayman)", "t": "Sulaymān", "d": "prophethood-revelation"},
    "دَاوُۥد": {"m": "David (Prophet Dawud)", "t": "Dāwūd", "d": "prophethood-revelation"},
    "يَعْقُوب": {"m": "Jacob (Prophet Ya'qub)", "t": "Yaʿqūb", "d": "prophethood-revelation"},
    "إِسْمَٰعِيل": {"m": "Ishmael (Prophet Isma'il)", "t": "Ismāʿīl", "d": "prophethood-revelation"},
    "شُعَيْب": {"m": "Shu'ayb (Prophet of Madyan)", "t": "Shuʿayb", "d": "prophethood-revelation"},
    "صَٰلِح": {"m": "Salih (Prophet sent to Thamud)", "t": "Ṣāliḥ", "d": "prophethood-revelation"},
    "هُود": {"m": "Hud (Prophet sent to 'Ad)", "t": "Hūd", "d": "prophethood-revelation"},
    "زَكَرِيَّآ": {"m": "Zechariah (Prophet Zakariyya)", "t": "Zakariyyā", "d": "prophethood-revelation"},
    "يَحْيَىٰ": {"m": "John the Baptist (Prophet Yahya)", "t": "Yaḥyā", "d": "prophethood-revelation"},
    "يُونُس": {"m": "Jonah (Prophet Yunus)", "t": "Yūnus", "d": "prophethood-revelation"},
    "أَيُّوب": {"m": "Job (Prophet Ayyub)", "t": "Ayyūb", "d": "prophethood-revelation"},
    "إِدْرِيس": {"m": "Enoch (Prophet Idris)", "t": "Idrīs", "d": "prophethood-revelation"},
    "إِلْيَاس": {"m": "Elijah (Prophet Ilyas)", "t": "Ilyās", "d": "prophethood-revelation"},
    "مُحَمَّد": {"m": "Muhammad, the Seal of the Prophets (ﷺ)", "t": "Muḥammad", "d": "prophethood-revelation"},
    "أَحْمَد": {"m": "Ahmad (praised name of Prophet Muhammad ﷺ)", "t": "Aḥmad", "d": "prophethood-revelation"},
    "جِبْرِيل": {"m": "Gabriel (the Archangel Jibril)", "t": "Jibrīl", "d": "divine-realm"},
    "مِيكَىٰل": {"m": "Michael (the Archangel Mika'il)", "t": "Mīkāl", "d": "divine-realm"},
    "إِبْلِيس": {"m": "Iblis (the Devil, Lucifer)", "t": "Iblīs", "d": "faith-ethics"},
    "مَكَّة": {"m": "Makkah (the Sacred City)", "t": "Makkah", "d": "worship-rituals"},
    "بَكَّة": {"m": "Bakkah (ancient name of Makkah)", "t": "Bakkah", "d": "worship-rituals"},
    "مَدِينَة": {"m": "The City (al-Madinah) / City", "t": "Madīnah", "d": "history-civilizations"},
    "مِصْر": {"m": "Egypt", "t": "Miṣr", "d": "history-civilizations"},
    "بَابِل": {"m": "Babylon", "t": "Bābil", "d": "history-civilizations"},
    "إِنجِيل": {"m": "The Gospel (Scripture of Jesus)", "t": "al-Injīl", "d": "prophethood-revelation"},
    "زَبُور": {"m": "The Psalms (Scripture of David)", "t": "al-Zabūr", "d": "prophethood-revelation"},
    "فُرْقَان": {"m": "The Criterion (The Quran)", "t": "al-Furqān", "d": "prophethood-revelation"},

    # Top Verbs
    "قَالَ": {"m": "he said, to say, to speak", "t": "qāla", "d": "intellect-communication"},
    "كَانَ": {"m": "he was, to be, to exist", "t": "kāna", "d": "time-space-motion"},
    "ءَامَنَ": {"m": "he believed, had faith", "t": "āmana", "d": "faith-ethics"},
    "عَلِمَ": {"m": "he knew, to know, to perceive", "t": "ʿalima", "d": "intellect-communication"},
    "جَعَلَ": {"m": "he made, appointed, set, established", "t": "jaʿala", "d": "cosmology-nature"},
    "كَفَرَ": {"m": "he disbelieved, denied the truth, ungrateful", "t": "kafara", "d": "faith-ethics"},
    "جَآءَ": {"m": "he came, arrived, reached", "t": "jāʾa", "d": "time-space-motion"},
    "عَمِلَ": {"m": "he worked, performed deeds, acted", "t": "ʿamila", "d": "faith-ethics"},
    "آتَى": {"m": "he gave, bestowed, granted", "t": "ātā", "d": "divine-realm"},
    "رَءَا": {"m": "he saw, beheld, perceived", "t": "raʾā", "d": "intellect-communication"},
    "أَتَى": {"m": "he came, approached, drew near", "t": "atā", "d": "time-space-motion"},
    "شَآءَ": {"m": "he willed, wished, decreed", "t": "shāʾa", "d": "divine-realm"},
    "خَلَقَ": {"m": "he created, fashioned, originated", "t": "khalaqa", "d": "divine-realm"},
    "أَنزَلَ": {"m": "he sent down, revealed", "t": "anzala", "d": "prophethood-revelation"},
    "كَذَّبَ": {"m": "he denied, rejected as false, belied", "t": "kadhdhaba", "d": "faith-ethics"},
    "دَعَا": {"m": "he called, prayed, invoked", "t": "daʿā", "d": "worship-rituals"},
    "ٱتَّقَىٰ": {"m": "he feared Allah, was mindful of Allah, pious", "t": "ittaqā", "d": "faith-ethics"},
    "هَدَى": {"m": "he guided, directed to the straight path", "t": "hadā", "d": "faith-ethics"},
    "أَرَادَ": {"m": "he intended, wanted, willed", "t": "arāda", "d": "intellect-communication"},
    "ٱتَّبَعَ": {"m": "he followed, obeyed, pursued", "t": "ittabaʿa", "d": "faith-ethics"},
    "أَرْسَلَ": {"m": "he sent, dispatched as messenger", "t": "arsala", "d": "prophethood-revelation"},
    "أَخَذَ": {"m": "he took, seized, gripped", "t": "akhadha", "d": "law-governance-commerce"},
    "حَكَمَ": {"m": "he judged, ruled, decreed", "t": "ḥakama", "d": "law-governance-commerce"},
    "سَمِعَ": {"m": "he heard, listened, paid heed", "t": "samiʿa", "d": "intellect-communication"},
    "رَجَعَ": {"m": "he returned, went back", "t": "rajaʿa", "d": "time-space-motion"},
    "ظَلَمَ": {"m": "he wronged, committed injustice, oppressed", "t": "ẓalama", "d": "faith-ethics"},
    "نَصَرَ": {"m": "he helped, gave victory", "t": "naṣara", "d": "law-governance-commerce"},
    "غَفَرَ": {"m": "he forgave, pardoned", "t": "ghafara", "d": "divine-realm"},
    "رَزَقَ": {"m": "he provided sustenance, granted provisions", "t": "razaqa", "d": "divine-realm"},
    "ضَرَبَ": {"m": "he struck, set forth (a parable)", "t": "ḍaraba", "d": "intellect-communication"},
    "ذَكَرَ": {"m": "he remembered, mentioned, commemorated", "t": "dhakara", "d": "worship-rituals"},
    "تَلَا": {"m": "he recited, rehearsed", "t": "talā", "d": "worship-rituals"},
    "سَأَلَ": {"m": "he asked, questioned, inquired", "t": "saʾala", "d": "intellect-communication"},
    "صَبَرَ": {"m": "he was patient, persevered", "t": "ṣabara", "d": "faith-ethics"},
    "شَكَرَ": {"m": "he gave thanks, was grateful", "t": "shakara", "d": "faith-ethics"},
    "تَابَ": {"m": "he repented, turned in remorse", "t": "tāba", "d": "faith-ethics"},
    "قَضَىٰ": {"m": "he decreed, concluded, settled", "t": "qaḍā", "d": "divine-realm"},
    "بَلَغَ": {"m": "he reached, attained, delivered", "t": "balagha", "d": "time-space-motion"},
    "خَرَجَ": {"m": "he went out, emerged, departed", "t": "kharaja", "d": "time-space-motion"},
    "دَخَلَ": {"m": "he entered, stepped inside", "t": "dakhala", "d": "time-space-motion"},
    "مَاتَ": {"m": "he died, passed away", "t": "māta", "d": "humanity-body"},
    "أَحْيَا": {"m": "he gave life, revived, resurrected", "t": "aḥyā", "d": "divine-realm"},
    "أَمَاتَ": {"m": "he caused death", "t": "amāta", "d": "divine-realm"},
    "قَتَلَ": {"m": "he killed, fought, slew", "t": "qatala", "d": "law-governance-commerce"},
    "وَجَدَ": {"m": "he found, perceived", "t": "wajada", "d": "intellect-communication"},
    "خَافَ": {"m": "he feared, was apprehensive", "t": "khāfa", "d": "faith-ethics"},
    "رَجَا": {"m": "he hoped, expected", "t": "rajā", "d": "faith-ethics"},
    "أَمَرَ": {"m": "he commanded, enjoined, ordered", "t": "amara", "d": "law-governance-commerce"},
    "نَهَىٰ": {"m": "he forbade, prohibited", "t": "nahā", "d": "law-governance-commerce"},
    "أَطَاعَ": {"m": "he obeyed, complied with", "t": "aṭāʿa", "d": "faith-ethics"},
    "عَصَىٰ": {"m": "he disobeyed, rebelled", "t": "ʿaṣā", "d": "faith-ethics"},
    "سَجَدَ": {"m": "he prostrated, bowed in reverence", "t": "sajada", "d": "worship-rituals"},
    "رَكَعَ": {"m": "he bowed down (in prayer)", "t": "rakaʿa", "d": "worship-rituals"},
    "سَبَّحَ": {"m": "he glorified, exalted, declared perfection", "t": "sabbaḥa", "d": "worship-rituals"},
    "حَمِدَ": {"m": "he praised, extolled", "t": "ḥamida", "d": "worship-rituals"},
    "كَتَبَ": {"m": "he wrote, ordained, prescribed", "t": "kataba", "d": "law-governance-commerce"},

    # Top Nouns & Adjectives
    "رَبّ": {"m": "Lord, Sustainer, Cherisher", "t": "Rabb", "d": "divine-realm"},
    "أَرْض": {"m": "earth, land, ground", "t": "arḍ", "d": "cosmology-nature"},
    "قَوْم": {"m": "people, nation, tribe, folk", "t": "qawm", "d": "family-society"},
    "ءَايَة": {"m": "sign, verse, miraculous proof", "t": "āyah", "d": "prophethood-revelation"},
    "رَسُول": {"m": "messenger, envoy, apostle", "t": "rasūl", "d": "prophethood-revelation"},
    "نَبِىّ": {"m": "prophet, divine warner", "t": "nabī", "d": "prophethood-revelation"},
    "يَوْم": {"m": "day, period, era", "t": "yawm", "d": "time-space-motion"},
    "عَذَاب": {"m": "torment, punishment, agony", "t": "ʿadhāb", "d": "afterlife-eschatology"},
    "سَمَآء": {"m": "heaven, sky, cosmic canopy", "t": "samāʾ", "d": "cosmology-nature"},
    "نَفْس": {"m": "soul, self, living essence, person", "t": "nafs", "d": "humanity-body"},
    "شَىْء": {"m": "thing, matter, created object", "t": "shayʾ", "d": "cosmology-nature"},
    "كِتَٰب": {"m": "book, scripture, record of deeds", "t": "kitāb", "d": "prophethood-revelation"},
    "حَقّ": {"m": "truth, reality, justice, duty", "t": "ḥaqq", "d": "faith-ethics"},
    "بَٰطِل": {"m": "falsehood, vanity, nullity", "t": "bāṭil", "d": "faith-ethics"},
    "نَّاس": {"m": "people, humanity, mankind", "t": "nās", "d": "humanity-body"},
    "مُؤْمِن": {"m": "believer, person of faith", "t": "muʾmin", "d": "faith-ethics"},
    "كَافِر": {"m": "disbeliever, denier of truth", "t": "kāfir", "d": "faith-ethics"},
    "مُنَافِق": {"m": "hypocrite, double-dealer", "t": "munāfiq", "d": "faith-ethics"},
    "مُشْرِك": {"m": "polytheist, associator of partners with Allah", "t": "mushrik", "d": "faith-ethics"},
    "سَبِيل": {"m": "path, way, avenue (in Allah's cause)", "t": "sabīl", "d": "faith-ethics"},
    "صِرَٰط": {"m": "highway, straight course of guidance", "t": "ṣirāṭ", "d": "faith-ethics"},
    "أَمْر": {"m": "command, affair, matter, decree", "t": "amr", "d": "law-governance-commerce"},
    "بَعْض": {"m": "some, a portion, part", "t": "baʿḍ", "d": "structural-connectives"},
    "أَيُّهَا": {"m": "O, O ye (vocative particle)", "t": "ayyuhā", "d": "structural-connectives"},
    "خَيْر": {"m": "good, better, best, virtue, bounty", "t": "khayr", "d": "faith-ethics"},
    "شَرّ": {"m": "evil, bad, worst, wickedness", "t": "sharr", "d": "faith-ethics"},
    "إِلَٰه": {"m": "god, deity, object of worship", "t": "ilāh", "d": "divine-realm"},
    "نَار": {"m": "fire, the blazing Fire of Hell", "t": "nār", "d": "afterlife-eschatology"},
    "غَيْر": {"m": "other than, without, non-", "t": "ghayr", "d": "structural-connectives"},
    "دُون": {"m": "beside, instead of, beneath", "t": "dūn", "d": "structural-connectives"},
    "عِلْم": {"m": "knowledge, insight, certainty", "t": "ʿilm", "d": "intellect-communication"},
    "دِين": {"m": "religion, judgment, way of life", "t": "dīn", "d": "faith-ethics"},
    "دُنْيَا": {"m": "worldly life, near world, present realm", "t": "dunyā", "d": "cosmology-nature"},
    "ءَاخِرَة": {"m": "the Hereafter, the Last Abode", "t": "ākhirah", "d": "afterlife-eschatology"},
    "قَلْب": {"m": "heart, spiritual center, conscience", "t": "qalb", "d": "humanity-body"},
    "أَهْل": {"m": "family, people, dwellers, folk", "t": "ahl", "d": "family-society"},
    "مَال": {"m": "wealth, property, financial resources", "t": "māl", "d": "law-governance-commerce"},
    "وَلَد": {"m": "child, son, offspring", "t": "walad", "d": "family-society"},
    "إِنسَٰن": {"m": "human being, mankind, mortal", "t": "insān", "d": "humanity-body"},
    "رَحْمَة": {"m": "mercy, grace, divine compassion", "t": "raḥmah", "d": "divine-realm"},
    "أَجْر": {"m": "reward, recompense, wages", "t": "ajr", "d": "afterlife-eschatology"},
    "نِعْمَة": {"m": "blessing, favor, bounty of Allah", "t": "niʿmah", "d": "divine-realm"},
    "فَضْل": {"m": "grace, bounty, surplus, favor", "t": "faḍl", "d": "divine-realm"},
    "عَبْد": {"m": "servant, worshipper, slave of Allah", "t": "ʿabd", "d": "worship-rituals"},
    "مَلَك": {"m": "angel, celestial envoy", "t": "malak", "d": "divine-realm"},
    "مَلَٰٓئِكَة": {"m": "angels (plural)", "t": "malāʾikah", "d": "divine-realm"},
    "عَرْش": {"m": "The Divine Throne", "t": "ʿarsh", "d": "divine-realm"},
    "رُوح": {"m": "spirit, soul, Gabriel (Jibril)", "t": "rūḥ", "d": "divine-realm"},
    "غَيْب": {"m": "unseen, realm of divine hidden knowledge", "t": "ghayb", "d": "divine-realm"},
    "شَهَٰدَة": {"m": "witness, testimony, seen realm", "t": "shahādah", "d": "faith-ethics"},
    "صَلَوٰة": {"m": "prayer, worship ritual (Salah)", "t": "ṣalāh", "d": "worship-rituals"},
    "زَكَوٰة": {"m": "purifying obligatory alms (Zakah)", "t": "zakāh", "d": "worship-rituals"},
    "صَدَقَة": {"m": "charity, voluntary almsgiving", "t": "ṣadaqah", "d": "worship-rituals"},
    "صِيَام": {"m": "fasting, abstention", "t": "ṣiyām", "d": "worship-rituals"},
    "حَجّ": {"m": "pilgrimage to Makkah (Hajj)", "t": "ḥajj", "d": "worship-rituals"},
    "مَسْجِد": {"m": "mosque, sanctuary of prostration", "t": "masjid", "d": "worship-rituals"},
    "بَيْت": {"m": "house, home, the Sacred Ka'bah", "t": "bayt", "d": "family-society"},
    "سَاعَة": {"m": "hour, The Final Hour (Last Day)", "t": "sāʿah", "d": "afterlife-eschatology"},
    "قِيَٰمَة": {"m": "Resurrection, standing before Allah", "t": "qiyāmah", "d": "afterlife-eschatology"},
    "حِسَاب": {"m": "reckoning, calculation of deeds", "t": "ḥisāb", "d": "afterlife-eschatology"},
    "مِيزَان": {"m": "scales of divine justice", "t": "mīzān", "d": "afterlife-eschatology"},
    "خُلْد": {"m": "eternity, everlasting perpetuity", "t": "khuld", "d": "afterlife-eschatology"},
    "جَحِيم": {"m": "blazing furnace of Hell", "t": "jaḥīm", "d": "afterlife-eschatology"},
    "سَعِير": {"m": "scorching fire, flare", "t": "saʿīr", "d": "afterlife-eschatology"},
    "سَقَر": {"m": "scorching pit of Hell (Saqar)", "t": "Saqar", "d": "afterlife-eschatology"},
    "فِرْدَوْس": {"m": "Firdaus, highest gardens of Paradise", "t": "Firdaws", "d": "afterlife-eschatology"},
    "نَعِيم": {"m": "delight, eternal bliss and luxury", "t": "naʿīm", "d": "afterlife-eschatology"},
    "عَدْن": {"m": "'Adn, perpetual residence of Eden", "t": "ʿAdn", "d": "afterlife-eschatology"},
    "شَمْس": {"m": "sun", "t": "shams", "d": "cosmology-nature"},
    "قَمَر": {"m": "moon", "t": "qamar", "d": "cosmology-nature"},
    "نَجْم": {"m": "star, celestial body", "t": "najm", "d": "cosmology-nature"},
    "لَيْل": {"m": "night", "t": "layl", "d": "cosmology-nature"},
    "نَهَار": {"m": "daytime, daylight", "t": "nahār", "d": "cosmology-nature"},
    "جَبَل": {"m": "mountain", "t": "jabal", "d": "cosmology-nature"},
    "بَحْر": {"m": "sea, ocean, deep water", "t": "baḥr", "d": "cosmology-nature"},
    "نَهَر": {"m": "river, flowing water", "t": "nahar", "d": "cosmology-nature"},
    "مَآء": {"m": "water, life-giving fluid, rain", "t": "māʾ", "d": "cosmology-nature"},
    "شَجَر": {"m": "tree, plants", "t": "shajar", "d": "cosmology-nature"},
    "ثَمَر": {"m": "fruits, produce, harvests", "t": "thamar", "d": "cosmology-nature"},
    "رِيح": {"m": "wind, gale", "t": "rīḥ", "d": "cosmology-nature"},
    "سَحَاب": {"m": "clouds", "t": "saḥāb", "d": "cosmology-nature"},
    "مَطَر": {"m": "rain", "t": "maṭar", "d": "cosmology-nature"},
    "طَيْر": {"m": "birds, winged creatures", "t": "ṭayr", "d": "cosmology-nature"},
    "دَآبَّة": {"m": "beast, living creature that walks/crawls", "t": "dābbah", "d": "cosmology-nature"},
    "أَنْعَٰم": {"m": "livestock, cattle, grazing beasts", "t": "anʿām", "d": "cosmology-nature"},
    "خَيْل": {"m": "horses, cavalry", "t": "khayl", "d": "cosmology-nature"},
    "إِبِل": {"m": "camels", "t": "ibil", "d": "cosmology-nature"},
    "ذَهَب": {"m": "gold", "t": "dhahab", "d": "law-governance-commerce"},
    "فِضَّة": {"m": "silver", "t": "fiḍḍah", "d": "law-governance-commerce"},
    "حَدِيد": {"m": "iron", "t": "ḥadīd", "d": "cosmology-nature"},
    "حِكْمَة": {"m": "wisdom, sound judgment", "t": "ḥikmah", "d": "intellect-communication"},
    "عَقْل": {"m": "intellect, reason, discernment", "t": "ʿaql", "d": "intellect-communication"},
    "لِسَان": {"m": "tongue, language, speech", "t": "lisān", "d": "intellect-communication"},
    "قَوْل": {"m": "word, statement, saying, utterance", "t": "qawl", "d": "intellect-communication"},
    "حَدِيث": {"m": "discourse, narrative, account", "t": "ḥadīth", "d": "intellect-communication"},
    "نَبَأ": {"m": "tidings, momentous news", "t": "nabaʾ", "d": "intellect-communication"},
    "مَثَل": {"m": "parable, likeness, proverb, example", "t": "mathal", "d": "intellect-communication"},
    "قَلَم": {"m": "the pen, writing instrument", "t": "qalam", "d": "intellect-communication"},
    "عَدْل": {"m": "justice, equity, impartiality", "t": "ʿadl", "d": "faith-ethics"},
    "ظُلْم": {"m": "injustice, tyranny, wrongdoing", "t": "ẓulm", "d": "faith-ethics"},
    "إِحْسَٰن": {"m": "excellence, moral beauty, benevolence", "t": "iḥsān", "d": "faith-ethics"},
    "تَقْوَىٰ": {"m": "piety, God-consciousness, moral vigilance", "t": "taqwā", "d": "faith-ethics"},
    "صَبْر": {"m": "patience, steadfast perseverance", "t": "ṣabr", "d": "faith-ethics"},
    "شُكْر": {"m": "thankfulness, gratitude", "t": "shukr", "d": "faith-ethics"},
    "تَوْبَة": {"m": "repentance, turning to God", "t": "tawbah", "d": "faith-ethics"},
    "مَغْفِرَة": {"m": "forgiveness, divine pardon", "t": "maghfirah", "d": "divine-realm"},
    "صِدْق": {"m": "truthfulness, sincerity, integrity", "t": "ṣidq", "d": "faith-ethics"},
    "كِذْب": {"m": "falsehood, lie, deception", "t": "kidhb", "d": "faith-ethics"},
    "عَهْد": {"m": "covenant, treaty, solemn pledge", "t": "ʿahd", "d": "law-governance-commerce"},
    "مِيثَٰق": {"m": "firm charter, binding covenant", "t": "mīthāq", "d": "law-governance-commerce"},
    "أَمَانَة": {"m": "trust, fiduciary responsibility", "t": "amānah", "d": "law-governance-commerce"},
    "حَرْب": {"m": "war, warfare, armed conflict", "t": "ḥarb", "d": "law-governance-commerce"},
    "سِلْم": {"m": "peace, submission, reconciliation", "t": "silm", "d": "law-governance-commerce"},
    "جِهَاد": {"m": "striving, endeavor in Allah's cause", "t": "jihād", "d": "law-governance-commerce"},
    "شَهَادَة": {"m": "martyrdom / testimony of faith", "t": "shahādah", "d": "faith-ethics"},
    "وَالِد": {"m": "father, parent", "t": "wālid", "d": "family-society"},
    "وَالِدَة": {"m": "mother", "t": "wālidah", "d": "family-society"},
    "أُمّ": {"m": "mother, source, foundation", "t": "umm", "d": "family-society"},
    "أَب": {"m": "father, ancestor", "t": "ab", "d": "family-society"},
    "أَخ": {"m": "brother, compatriot", "t": "akh", "d": "family-society"},
    "أُخْت": {"m": "sister", "t": "ukht", "d": "family-society"},
    "زَوْج": {"m": "spouse, mate, partner, pair", "t": "zawj", "d": "family-society"},
    "امْرَأَة": {"m": "woman, wife", "t": "imraʾah", "d": "family-society"},
    "رَجُل": {"m": "man, gentleman", "t": "rajul", "d": "humanity-body"},
    "يَتِيم": {"m": "orphan", "t": "yatīm", "d": "family-society"},
    "مِسْكِين": {"m": "destitute person, needy poor", "t": "miskīn", "d": "family-society"},
    "فَقِير": {"m": "poor, impoverished, in need of God", "t": "faqīr", "d": "family-society"},
    "جَار": {"m": "neighbor", "t": "jār", "d": "family-society"},
    "وَجْه": {"m": "face, countenance, direction", "t": "wajh", "d": "humanity-body"},
    "عَيْن": {"m": "eye / water spring", "t": "ʿayn", "d": "humanity-body"},
    "أُذُن": {"m": "ear", "t": "udhun", "d": "humanity-body"},
    "يَد": {"m": "hand, power, influence", "t": "yad", "d": "humanity-body"},
    "رِجْل": {"m": "foot, leg", "t": "rijl", "d": "humanity-body"},
    "صَدْر": {"m": "chest, breast, heart interior", "t": "ṣadr", "d": "humanity-body"},
    "بَطْن": {"m": "belly, womb, interior", "t": "baṭn", "d": "humanity-body"},
    "دَم": {"m": "blood", "t": "dam", "d": "humanity-body"},
    "لَحْم": {"m": "flesh, meat", "t": "laḥm", "d": "humanity-body"},
    "عَظْم": {"m": "bone, skeleton", "t": "ʿaẓm", "d": "humanity-body"},
    "جِلْد": {"m": "skin, hide", "t": "jild", "d": "humanity-body"},
    "طَعَام": {"m": "food, nourishment, meal", "t": "ṭaʿām", "d": "humanity-body"},
    "شَرَاب": {"m": "drink, beverage", "t": "sharāb", "d": "humanity-body"},
    "لِبَاس": {"m": "garment, clothing, attire", "t": "libās", "d": "family-society"},
}

# Domain metadata lookup
DOMAIN_NAMES = {
    'divine-realm': {'en': 'Divine Realm & Theology', 'ar': 'الإلهيات والعقيدة والتوحيد'},
    'prophethood-revelation': {'en': 'Prophethood & Revelation', 'ar': 'النبوات والرسالات والوحي'},
    'afterlife-eschatology': {'en': 'Afterlife & Eschatology', 'ar': 'السمعيات واليوم الآخر والجزاء'},
    'faith-ethics': {'en': 'Faith, Morals & Virtues', 'ar': 'الإيمان والأخلاق والفضائل'},
    'worship-rituals': {'en': 'Worship, Pillars & Rituals', 'ar': 'العبادات والشعائر والطاعات'},
    'cosmology-nature': {'en': 'Cosmology, Earth & Nature', 'ar': 'الكونيات والخلق والطبيعة'},
    'humanity-body': {'en': 'Mankind & Human Physiology', 'ar': 'الإنسان والبدن والأحوال البشرية'},
    'family-society': {'en': 'Family, Kinship & Society', 'ar': 'الأسرة والمجتمع والنظام الاجتماعي'},
    'law-governance-commerce': {'en': 'Law, Governance & Commerce', 'ar': 'التشريع والمعاملات والمال'},
    'intellect-communication': {'en': 'Speech, Knowledge & Mind', 'ar': 'الكلام والعلم والفكر والتدبر'},
    'history-civilizations': {'en': 'History, Peoples & Warnings', 'ar': 'الأمم السابقة والعبر والقصص'},
    'structural-connectives': {'en': 'Grammar & Connectives', 'ar': 'الروابط والأدوات اللغوية'},
    'time-space-motion': {'en': 'Time, Space & Movement', 'ar': 'الزمان والمكان والحركة'}
}

# Domain heuristic deduction for any word
def infer_domain(word, clean_ar, pos, meaning):
    if pos in ['Preposition', 'Conditional particle', 'Relative pronoun', 'Subordinating conjunction',
                'Coordinating conjunction', 'Interogative particle', 'Negative particle', 'Accusative particle',
                'Particle of certainty', 'Inceptive particle', 'Surprise particle', 'Exceptive particle',
                'Explanation particle', 'Restriction particle', 'Prohibition particle', 'Retraction particle',
                'Amendment particle', 'Particle of interpretation', 'Future particle', 'Exhortation particle',
                'Aversion particle', 'Personal pronoun', 'Supplemental particle']:
        return 'structural-connectives'

    if pos == 'Time adverb':
        return 'time-space-motion'
    if pos == 'Location adverb':
        return 'time-space-motion'

    # Theological triggers
    if any(k in clean_ar for k in ['الله', 'رب', 'رحمن', 'رحيم', 'اله', 'قدوس', 'سلام', 'عزيز', 'حكيم', 'خالق', 'ملك', 'عرش', 'روح', 'ملك']):
        return 'divine-realm'

    # Prophets / Scriptures triggers
    if any(k in clean_ar for k in ['موسي', 'ابراهيم', 'نوح', 'عيسي', 'يوسف', 'داود', 'سليمان', 'قران', 'كتاب', 'توراه', 'انجيل', 'فرقان', 'رسول', 'نبي', 'ايه']):
        return 'prophethood-revelation'

    # Eschatology triggers
    if any(k in clean_ar for k in ['جنه', 'جهنم', 'نار', 'عذاب', 'حساب', 'ميزان', 'بعث', 'قيامه', 'سعير', 'جحيم', 'فردوس', 'عدن', 'سقر']):
        return 'afterlife-eschatology'

    # Worship triggers
    if any(k in clean_ar for k in ['صلاه', 'زكاه', 'حج', 'صوم', 'سجود', 'ركوع', 'مسجد', 'تسبيح', 'دعاء']):
        return 'worship-rituals'

    # Faith / Ethics triggers
    if any(k in clean_ar for k in ['ايمان', 'مؤمن', 'كفر', 'نفاق', 'تقوي', 'صبر', 'شكر', 'توبه', 'عدل', 'ظلم', 'احسان', 'صدق', 'كذب']):
        return 'faith-ethics'

    # Nature / Cosmos triggers
    if any(k in clean_ar for k in ['سماء', 'ارض', 'شمس', 'قمر', 'نجم', 'بحر', 'نهر', 'ماء', 'شجر', 'جبل', 'ريح', 'سحاب', 'مطر', 'طير']):
        return 'cosmology-nature'

    # Law / Commerce triggers
    if any(k in clean_ar for k in ['مال', 'ذهب', 'فضه', 'جهاد', 'حرب', 'امر', 'نهي', 'عهد', 'ميثاق', 'حكم']):
        return 'law-governance-commerce'

    # Speech / Intellect triggers
    if any(k in clean_ar for k in ['قال', 'قول', 'علم', 'سمع', 'راي', 'عقل', 'فكر', 'ذكر', 'قرا', 'كتب', 'بيان', 'حديث', 'نبا']):
        return 'intellect-communication'

    # Humanity / Body triggers
    if any(k in clean_ar for k in ['انسان', 'ناس', 'نفس', 'قلب', 'صدر', 'عين', 'يد', 'رجل', 'وجه', 'دم', 'لحم', 'طعام']):
        return 'humanity-body'

    # Family / Society triggers
    if any(k in clean_ar for k in ['ام', 'اب', 'اخ', 'اخت', 'زوج', 'ولد', 'اهل', 'قوم', 'يتيم', 'مسكين']):
        return 'family-society'

    if pos == 'Verb':
        return 'faith-ethics'
    return 'cosmology-nature'

# Heuristic meaning generation
def infer_meaning(word, clean_ar, pos, translit):
    if pos == 'Verb':
        return f"to perform {translit}, act, or verb form"
    elif pos == 'Adjective':
        return f"descriptive quality ({translit})"
    elif pos == 'Proper noun':
        return f"proper Quranic name ({translit})"
    else:
        return f"nominal entity / concept ({translit})"

# Build final 5,155 entries
enriched_entries = []
domain_counts = {}
pos_counts = {}
division_counts = {'noun': 0, 'verb': 0, 'particle': 0}

for idx, item in enumerate(raw_words, start=1):
    w = item['word']
    freq = item['frequency']
    pos = item['pos']
    pct = item['percentage']
    clean_w = normalize_arabic(w)

    pos_info = POS_INFO.get(pos, {'primary': 'noun', 'ar': 'اسم', 'title': pos})
    primary_div = pos_info['primary']
    pos_ar = pos_info['ar']
    division_counts[primary_div] += 1
    pos_counts[pos] = pos_counts.get(pos, 0) + 1

    # Check known lexicon
    meaning = None
    translit = None
    domain_id = None

    if w in VOCAB:
        meaning = VOCAB[w]['m']
        translit = VOCAB[w]['t']
        domain_id = VOCAB[w]['d']
    elif clean_w in VOCAB:
        meaning = VOCAB[clean_w]['m']
        translit = VOCAB[clean_w]['t']
        domain_id = VOCAB[clean_w]['d']
    elif w in existing_lexicon:
        meaning = existing_lexicon[w]['meaning']
        translit = existing_lexicon[w]['translit']
    elif clean_w in existing_lexicon:
        meaning = existing_lexicon[clean_w]['meaning']
        translit = existing_lexicon[clean_w]['translit']

    if not translit:
        translit = transliterate_arabic(w)

    if not domain_id:
        domain_id = infer_domain(w, clean_w, pos, meaning)

    if not meaning:
        meaning = infer_meaning(w, clean_w, pos, translit)

    d_meta = DOMAIN_NAMES.get(domain_id, {'en': 'Cosmology & Nature', 'ar': 'الكونيات والطبيعة'})
    domain_counts[domain_id] = domain_counts.get(domain_id, 0) + 1

    entry = {
        'id': f"fa_{idx}",
        'rank': idx,
        'word': w,
        'cleanArabic': clean_w,
        'frequency': freq,
        'percentage': pct,
        'pos': pos,
        'posArabic': pos_ar,
        'posTitle': pos_info['title'],
        'primaryDivision': primary_div,
        'transliteration': translit,
        'meaning': meaning,
        'semanticDomain': domain_id,
        'semanticDomainName': d_meta['en'],
        'semanticDomainArabic': d_meta['ar'],
        'semanticRole': 'Entity' if primary_div == 'noun' else ('Action' if primary_div == 'verb' else 'Connective')
    }
    enriched_entries.append(entry)

print(f"Enriched {len(enriched_entries)} entries successfully!")

# Write json to src/data/fluentArabicWords.json
with open('src/data/fluentArabicWords.json', 'w', encoding='utf-8') as f:
    json.dump(enriched_entries, f, ensure_ascii=False, indent=2)

print("Saved src/data/fluentArabicWords.json")

# Write stats summary
stats = {
    'totalWords': len(enriched_entries),
    'totalOccurrences': sum(e['frequency'] for e in enriched_entries),
    'source': 'Fluent Arabic Quran Frequency List (https://fluentarabic.net/quran-frequency-list/)',
    'sourceSpreadsheet': 'Quran-All-Words.xlsx',
    'milestones': [
        {'label': 'Top 50 Words', 'count': 50, 'coveragePercent': enriched_entries[49]['percentage'], 'desc': 'Covers nearly half of all Quran word occurrences (45.4%)'},
        {'label': 'Top 100 Words', 'count': 100, 'coveragePercent': enriched_entries[99]['percentage'], 'desc': 'Covers over 55% of the entire Quranic text (55.4%)'},
        {'label': 'Top 300 Words', 'count': 300, 'coveragePercent': enriched_entries[299]['percentage'], 'desc': 'Covers nearly three-quarters of all words in the Quran (71.7%)'},
        {'label': 'Top 500 Words', 'count': 500, 'coveragePercent': enriched_entries[499]['percentage'], 'desc': 'Covers approximately 80% of the complete Quran vocabulary (79.2%)'},
        {'label': 'Top 1000 Words', 'count': 1000, 'coveragePercent': enriched_entries[999]['percentage'], 'desc': 'Covers over 86% of the Quranic text'},
        {'label': 'All 5,155 Words', 'count': len(enriched_entries), 'coveragePercent': 100.0, 'desc': 'Comprehensive vocabulary corpus of the entire Noble Quran'}
    ],
    'primaryDivisions': [
        {'id': 'noun', 'name': 'Noun (Ism)', 'nameArabic': 'الاسم', 'count': division_counts['noun'], 'occurrences': sum(e['frequency'] for e in enriched_entries if e['primaryDivision'] == 'noun')},
        {'id': 'verb', 'name': 'Verb (Fi‘l)', 'nameArabic': 'الفعل', 'count': division_counts['verb'], 'occurrences': sum(e['frequency'] for e in enriched_entries if e['primaryDivision'] == 'verb')},
        {'id': 'particle', 'name': 'Particle (Harf)', 'nameArabic': 'الحرف', 'count': division_counts['particle'], 'occurrences': sum(e['frequency'] for e in enriched_entries if e['primaryDivision'] == 'particle')}
    ],
    'posBreakdown': sorted([
        {
            'pos': k,
            'posArabic': POS_INFO.get(k, {}).get('ar', k),
            'primaryDivision': POS_INFO.get(k, {}).get('primary', 'noun'),
            'count': v,
            'occurrences': sum(e['frequency'] for e in enriched_entries if e['pos'] == k)
        }
        for k, v in pos_counts.items()
    ], key=lambda x: x['occurrences'], reverse=True),
    'semanticBreakdown': sorted([
        {
            'id': k,
            'name': DOMAIN_NAMES.get(k, {}).get('en', k),
            'nameArabic': DOMAIN_NAMES.get(k, {}).get('ar', k),
            'count': v,
            'occurrences': sum(e['frequency'] for e in enriched_entries if e['semanticDomain'] == k)
        }
        for k, v in domain_counts.items()
    ], key=lambda x: x['occurrences'], reverse=True)
}

with open('src/data/fluentArabicStats.json', 'w', encoding='utf-8') as f:
    json.dump(stats, f, ensure_ascii=False, indent=2)

print("Saved src/data/fluentArabicStats.json")
print("Top 5 POS by occurrences:", [p['pos'] + f" ({p['occurrences']})" for p in stats['posBreakdown'][:5]])
print("Top 5 Semantic Domains by occurrences:", [d['name'] + f" ({d['occurrences']})" for d in stats['semanticBreakdown'][:5]])
