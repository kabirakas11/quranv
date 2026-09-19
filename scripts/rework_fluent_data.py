import zipfile
import xml.etree.ElementTree as ET
import json
import re
from collections import defaultdict, Counter

print("Starting Quran Fluent Frequency and Semantic Data Rework...")

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

# Normalization functions
def norm_ar(text):
    if not text: return ''
    t = text
    t = re.sub(r'[\u064B-\u065F\u06D6-\u06ED]', '', t)
    t = re.sub(r'ىٰ|ٰ|ى|ي$', 'ا', t)
    t = re.sub(r'[إأآٱ]', 'ا', t)
    t = re.sub(r'ة', 'ه', t)
    t = re.sub(r'ؤ', 'و', t)
    t = re.sub(r'ئ', 'ي', t)
    t = re.sub(r'[\u0640ـ]', '', t)
    t = re.sub(r'ء', '', t)
    return t.strip()

def strip_al(t):
    if t.startswith('ال') and len(t) > 3:
        return t[2:]
    return t

# 2. Load Word-by-Word Translations
print("Loading /tmp/wbw-data.json...")
with open('/tmp/wbw-data.json') as f:
    wbw_pages = json.load(f)

wbw_map = {}
wbw_meta = {} # vk_pos -> {ayahIndex, suraName}
for p in wbw_pages:
    for ay in p.get('ayahs', []):
        sura_name = ay.get('metaData', {}).get('suraName', '')
        for w in ay.get('words', []):
            vk = w.get('parentAyahVerseKey')
            pos = w.get('position')
            trans = w.get('translation', {}).get('text')
            if vk and pos and trans:
                vk_pos = f'{vk}:{pos}'
                wbw_map[vk_pos] = trans.strip()
                wbw_meta[vk_pos] = {'sura': sura_name, 'loc': vk}

print(f"Loaded {len(wbw_map)} WBW translation tokens.")

# 3. Load Morphology
print("Loading /tmp/quran-morphology.txt...")
morph_tokens = defaultdict(lambda: {'parts': [], 'lem': None, 'root': None, 'pos': None})
with open('/tmp/quran-morphology.txt') as f:
    for line in f:
        parts = line.strip().split('\t')
        if len(parts) >= 4:
            loc = parts[0]
            loc_parts = loc.split(':')
            if len(loc_parts) == 4:
                vk_pos = f'{loc_parts[0]}:{loc_parts[1]}:{loc_parts[2]}'
                morph_tokens[vk_pos]['parts'].append(parts[1])
                for feat in parts[3].split('|'):
                    if feat.startswith('LEM:'):
                        morph_tokens[vk_pos]['lem'] = feat[4:]
                    elif feat.startswith('ROOT:'):
                        morph_tokens[vk_pos]['root'] = feat[5:]
                    elif feat in ['N', 'V', 'P', 'PN', 'ADJ']:
                        if not morph_tokens[vk_pos]['pos']:
                            morph_tokens[vk_pos]['pos'] = feat

# Index translations and occurrences by Lemma, by Word, and by Normalized Arabic
lem_trans_map = defaultdict(list)
lem_roots_map = defaultdict(Counter)
lem_samples_map = defaultdict(list)
word_trans_map = defaultdict(list)
word_samples_map = defaultdict(list)
norm_trans_map = defaultdict(list)
norm_samples_map = defaultdict(list)
norm_roots_map = defaultdict(Counter)

for vk_pos, item in morph_tokens.items():
    trans = wbw_map.get(vk_pos)
    if not trans or re.match(r'^\(\d+\)$', trans):
        continue
    whole_word = ''.join(item['parts'])
    meta = wbw_meta.get(vk_pos, {})
    sample_item = {
        'location': meta.get('loc', vk_pos.rsplit(':', 1)[0]),
        'surahName': meta.get('sura', '').split(' - ')[-1] if meta.get('sura') else 'Quran',
        'word': whole_word,
        'trans': trans
    }

    word_trans_map[whole_word].append(trans)
    word_samples_map[whole_word].append(sample_item)

    wn = norm_ar(whole_word)
    norm_trans_map[wn].append(trans)
    norm_samples_map[wn].append(sample_item)
    if item['root']:
        norm_roots_map[wn][item['root']] += 1

    wn_strip = strip_al(wn)
    if wn_strip != wn:
        norm_trans_map[wn_strip].append(trans)
        norm_samples_map[wn_strip].append(sample_item)
        if item['root']:
            norm_roots_map[wn_strip][item['root']] += 1

    if item['lem']:
        lem = item['lem']
        lem_trans_map[lem].append(trans)
        lem_samples_map[lem].append(sample_item)
        if item['root']:
            lem_roots_map[lem][item['root']] += 1
        ln = norm_ar(lem)
        norm_trans_map[ln].append(trans)
        norm_samples_map[ln].append(sample_item)
        if item['root']:
            norm_roots_map[ln][item['root']] += 1
        ln_strip = strip_al(ln)
        if ln_strip != ln:
            norm_trans_map[ln_strip].append(trans)
            norm_samples_map[ln_strip].append(sample_item)
            if item['root']:
                norm_roots_map[ln_strip][item['root']] += 1

print("Indexed morphology and translation occurrences.")

# 4. Curated High-Value Quranic Vocabularies
CURATED_VOCAB = {
    # Divine Realm & Names
    "ٱللَّه": {"m": "Allah (The Almighty God)", "t": "Allāh", "d": "divine-realm"},
    "اللَّه": {"m": "Allah (The Almighty God)", "t": "Allāh", "d": "divine-realm"},
    "لِلَّه": {"m": "to Allah, for Allah", "t": "lillāh", "d": "divine-realm"},
    "رَبّ": {"m": "Lord, Sustainer, Cherisher", "t": "Rabb", "d": "divine-realm"},
    "رَّحْمَٰن": {"m": "The Entirely Merciful, All-Gracious", "t": "al-Raḥmān", "d": "divine-realm"},
    "رَّحِيم": {"m": "The Especially Merciful", "t": "al-Raḥīm", "d": "divine-realm"},
    "إِلَٰه": {"m": "deity, god, object of worship", "t": "ilāh", "d": "divine-realm"},
    "عَلِيم": {"m": "All-Knowing, Omniscient", "t": "ʿAlīm", "d": "divine-realm"},
    "حَكِيم": {"m": "All-Wise, Possessor of Wisdom", "t": "Ḥakīm", "d": "divine-realm"},
    "غَفُور": {"m": "All-Forgiving, Oft-Pardoning", "t": "Ghafūr", "d": "divine-realm"},
    "عَزِيز": {"m": "Almighty, All-Powerful, Honorable", "t": "ʿAzīz", "d": "divine-realm"},
    "خَبِير": {"m": "All-Aware, Fully Acquainted", "t": "Khabīr", "d": "divine-realm"},
    "قَدِير": {"m": "Omnipotent, All-Capable", "t": "Qadīr", "d": "divine-realm"},
    "بَصِير": {"m": "All-Seeing, Ever-Observant", "t": "Baṣīr", "d": "divine-realm"},
    "سَمِيع": {"m": "All-Hearing, Ever-Listening", "t": "Samīʿ", "d": "divine-realm"},
    "خَالِق": {"m": "The Creator, Originator", "t": "Khāliq", "d": "divine-realm"},
    "مَلِك": {"m": "The King, Sovereign Ruler", "t": "Malik", "d": "divine-realm"},
    "قُدُّوس": {"m": "The Holy, Pure, Transcendent", "t": "Quddūs", "d": "divine-realm"},
    "سَلَٰم": {"m": "Peace, The Source of Peace", "t": "Salām", "d": "divine-realm"},
    "عَرْش": {"m": "Throne, Celestial Dominion", "t": "ʿarsh", "d": "divine-realm"},
    "رُوح": {"m": "Spirit, Holy Spirit (Jibril), soul", "t": "rūḥ", "d": "divine-realm"},
    "مَلَٰٓئِكَة": {"m": "angels, heavenly messengers", "t": "malāʾikah", "d": "divine-realm"},
    "مَلَك": {"m": "angel, celestial emissary", "t": "malak", "d": "divine-realm"},
    "جِبْرِيل": {"m": "Gabriel (The Archangel)", "t": "Jibrīl", "d": "divine-realm"},
    "مِيكَىٰل": {"m": "Michael (The Archangel)", "t": "Mīkāʾīl", "d": "divine-realm"},

    # Prophethood & Scripture
    "مُحَمَّد": {"m": "Muhammad (The Final Messenger)", "t": "Muḥammad", "d": "prophethood-revelation"},
    "مُوسَىٰ": {"m": "Moses (Prophet Musa)", "t": "Mūsā", "d": "prophethood-revelation"},
    "إِبْرَٰهِيم": {"m": "Abraham (Prophet Ibrahim)", "t": "Ibrāhīm", "d": "prophethood-revelation"},
    "عِيسَى": {"m": "Jesus son of Mary (Prophet Isa)", "t": "ʿĪsā", "d": "prophethood-revelation"},
    "نُوح": {"m": "Noah (Prophet Nuh)", "t": "Nūḥ", "d": "prophethood-revelation"},
    "يُوسُف": {"m": "Joseph (Prophet Yusuf)", "t": "Yūsuf", "d": "prophethood-revelation"},
    "دَاوُۥد": {"m": "David (Prophet Dawud)", "t": "Dāwūd", "d": "prophethood-revelation"},
    "سُلَيْمَٰن": {"m": "Solomon (Prophet Sulayman)", "t": "Sulaymān", "d": "prophethood-revelation"},
    "آدَم": {"m": "Adam (Father of Mankind)", "t": "Ādam", "d": "prophethood-revelation"},
    "ءَادَم": {"m": "Adam (Father of Mankind)", "t": "Ādam", "d": "prophethood-revelation"},
    "هَٰرُون": {"m": "Aaron (Prophet Harun)", "t": "Hārūn", "d": "prophethood-revelation"},
    "إِسْمَٰعِيل": {"m": "Ishmael (Prophet Ismail)", "t": "Ismāʿīl", "d": "prophethood-revelation"},
    "إِسْحَٰق": {"m": "Isaac (Prophet Ishaq)", "t": "Isḥāq", "d": "prophethood-revelation"},
    "يَعْقُوب": {"m": "Jacob (Prophet Yaqub)", "t": "Yaʿqūb", "d": "prophethood-revelation"},
    "صَٰلِح": {"m": "Salih (Prophet Salih)", "t": "Ṣāliḥ", "d": "prophethood-revelation"},
    "هُود": {"m": "Hud (Prophet Hud)", "t": "Hūd", "d": "prophethood-revelation"},
    "شُعَيْب": {"m": "Shu'ayb (Prophet Shu'ayb)", "t": "Shuʿayb", "d": "prophethood-revelation"},
    "يُونُس": {"m": "Jonah (Prophet Yunus)", "t": "Yūnus", "d": "prophethood-revelation"},
    "زَكَرِيَّا": {"m": "Zechariah (Prophet Zakariyya)", "t": "Zakariyyā", "d": "prophethood-revelation"},
    "يَحْيَىٰ": {"m": "John the Baptist (Prophet Yahya)", "t": "Yaḥyā", "d": "prophethood-revelation"},
    "أَيُّوب": {"m": "Job (Prophet Ayyub)", "t": "Ayyūb", "d": "prophethood-revelation"},
    "إِدْرِيس": {"m": "Enoch (Prophet Idris)", "t": "Idrīs", "d": "prophethood-revelation"},
    "مَرْيَم": {"m": "Mary, mother of Jesus", "t": "Maryam", "d": "prophethood-revelation"},
    "فِرْعَوْن": {"m": "Pharaoh (Ruler of Egypt)", "t": "Firʿawn", "d": "history-civilizations"},
    "قَٰرُون": {"m": "Korah (Qarun)", "t": "Qārūn", "d": "history-civilizations"},
    "هَٰمَٰن": {"m": "Haman (Vizier of Pharaoh)", "t": "Hāmān", "d": "history-civilizations"},
    "قُرْءَان": {"m": "The Holy Quran (Recitation)", "t": "Qurʾān", "d": "prophethood-revelation"},
    "قُرْآن": {"m": "The Holy Quran (Recitation)", "t": "Qurʾān", "d": "prophethood-revelation"},
    "تَوْرَىٰة": {"m": "The Torah (Revealed Scripture)", "t": "Tawrāt", "d": "prophethood-revelation"},
    "تَّوْرَىٰة": {"m": "The Torah (Revealed Scripture)", "t": "al-Tawrāt", "d": "prophethood-revelation"},
    "إِنجِيل": {"m": "The Gospel (Revealed Scripture)", "t": "Injīl", "d": "prophethood-revelation"},
    "زَبُور": {"m": "The Psalms (Zabur)", "t": "Zabūr", "d": "prophethood-revelation"},
    "كِتَٰب": {"m": "book, scripture, revelation", "t": "kitāb", "d": "prophethood-revelation"},
    "ءَايَة": {"m": "sign, verse, divine miracle", "t": "āyah", "d": "prophethood-revelation"},
    "رَسُول": {"m": "messenger, envoy of God", "t": "rasūl", "d": "prophethood-revelation"},
    "نَبِىّ": {"m": "prophet, bearer of glad tidings", "t": "nabī", "d": "prophethood-revelation"},
    "وَحْى": {"m": "divine revelation, inspiration", "t": "waḥy", "d": "prophethood-revelation"},
    "بَيِّنَة": {"m": "clear evidence, proof, manifest sign", "t": "bayyinah", "d": "prophethood-revelation"},
    "فُرْقَان": {"m": "criterion between right and wrong", "t": "furqān", "d": "prophethood-revelation"},

    # Afterlife & Eschatology
    "جَنَّة": {"m": "Paradise, Garden of eternal bliss", "t": "jannah", "d": "afterlife-eschatology"},
    "جَهَنَّم": {"m": "Hellfire, Nethermost Abyss", "t": "jahannam", "d": "afterlife-eschatology"},
    "نَار": {"m": "Fire, the punishment of Hell", "t": "nār", "d": "afterlife-eschatology"},
    "عَذَاب": {"m": "torment, punishment, chastisement", "t": "ʿadhāb", "d": "afterlife-eschatology"},
    "أَجْر": {"m": "reward, heavenly recompense", "t": "ajr", "d": "afterlife-eschatology"},
    "ثَوَاب": {"m": "recompense, return, divine reward", "t": "thawāb", "d": "afterlife-eschatology"},
    "يَوْم": {"m": "Day (Day of Judgment / time)", "t": "yawm", "d": "afterlife-eschatology"},
    "قِيَٰمَة": {"m": "Resurrection, Standing before God", "t": "qiyāmah", "d": "afterlife-eschatology"},
    "سَاعَة": {"m": "The Hour (Appointed Time / Day)", "t": "sāʿah", "d": "afterlife-eschatology"},
    "آخِرَة": {"m": "The Hereafter, Final Abode", "t": "ākhirah", "d": "afterlife-eschatology"},
    "ءَاخِرَة": {"m": "The Hereafter, Final Abode", "t": "ākhirah", "d": "afterlife-eschatology"},
    "حِسَاب": {"m": "reckoning, accounting of deeds", "t": "ḥisāb", "d": "afterlife-eschatology"},
    "مِيزَان": {"m": "scale, balance of deeds", "t": "mīzān", "d": "afterlife-eschatology"},
    "سَعِير": {"m": "Blazing Flame (of Hell)", "t": "saʿīr", "d": "afterlife-eschatology"},
    "جَحِيم": {"m": "Blazing Infernal Fire", "t": "jaḥīm", "d": "afterlife-eschatology"},
    "فِرْدَوْس": {"m": "Firdaus, Highest Garden of Paradise", "t": "firdaws", "d": "afterlife-eschatology"},
    "نَعِيم": {"m": "eternal delight, luxury, felicity", "t": "naʿīm", "d": "afterlife-eschatology"},
    "سَقَر": {"m": "Saqar (scorching fire of Hell)", "t": "Saqar", "d": "afterlife-eschatology"},
    "كَوْثَر": {"m": "Abundance, heavenly river Kawthar", "t": "kawthar", "d": "afterlife-eschatology"},

    # Faith & Ethics
    "إِيمَٰن": {"m": "faith, belief, true conviction", "t": "īmān", "d": "faith-ethics"},
    "مُؤْمِن": {"m": "believer, faithful person", "t": "muʾmin", "d": "faith-ethics"},
    "كُفْر": {"m": "disbelief, denial of divine truth", "t": "kufr", "d": "faith-ethics"},
    "كَافِر": {"m": "disbeliever, denier of truth", "t": "kāfir", "d": "faith-ethics"},
    "نِفَاق": {"m": "hypocrisy, dissimulation", "t": "nifāq", "d": "faith-ethics"},
    "مُنَافِق": {"m": "hypocrite", "t": "munāfiq", "d": "faith-ethics"},
    "تَقْوَىٰ": {"m": "God-consciousness, piety, reverence", "t": "taqwā", "d": "faith-ethics"},
    "مُتَّقِى": {"m": "righteous, mindful of God", "t": "muttaqī", "d": "faith-ethics"},
    "مُتَّقِين": {"m": "the righteous, pious believers", "t": "muttaqīn", "d": "faith-ethics"},
    "صَبْر": {"m": "patience, steadfast perseverance", "t": "ṣabr", "d": "faith-ethics"},
    "شُكْر": {"m": "gratitude, thankfulness", "t": "shukr", "d": "faith-ethics"},
    "تَوْبَة": {"m": "repentance, returning to Allah", "t": "tawbah", "d": "faith-ethics"},
    "عَدْل": {"m": "justice, equity, fairness", "t": "ʿadl", "d": "faith-ethics"},
    "ظُلْم": {"m": "injustice, oppression, wrongdoing", "t": "ẓulm", "d": "faith-ethics"},
    "ظَالِم": {"m": "wrongdoer, unjust person", "t": "ẓālim", "d": "faith-ethics"},
    "إِحْسَٰن": {"m": "spiritual excellence, benevolence", "t": "iḥsān", "d": "faith-ethics"},
    "مُحْسِن": {"m": "doer of good, benevolent", "t": "muḥsin", "d": "faith-ethics"},
    "صِدْق": {"m": "truthfulness, sincerity, honesty", "t": "ṣidq", "d": "faith-ethics"},
    "صَادِق": {"m": "truthful, honest, sincere", "t": "ṣādiq", "d": "faith-ethics"},
    "كِذْب": {"m": "falsehood, lying, deceit", "t": "kidhb", "d": "faith-ethics"},
    "كَاذِب": {"m": "liar, fabricator of falsehood", "t": "kādhib", "d": "faith-ethics"},
    "خَيْر": {"m": "goodness, welfare, blessing, better", "t": "khayr", "d": "faith-ethics"},
    "شَرّ": {"m": "evil, malice, harm, worse", "t": "sharr", "d": "faith-ethics"},
    "حَقّ": {"m": "truth, reality, justice, due right", "t": "ḥaqq", "d": "faith-ethics"},
    "بَٰطِل": {"m": "falsehood, vanity, nullity", "t": "bāṭil", "d": "faith-ethics"},
    "صَّٰلِحَٰت": {"m": "righteous deeds, good works", "t": "al-ṣāliḥāt", "d": "faith-ethics"},
    "صَالِح": {"m": "righteous, upright, pious", "t": "ṣāliḥ", "d": "faith-ethics"},
    "فَاسِق": {"m": "rebellious, defiantly disobedient", "t": "fāsiq", "d": "faith-ethics"},
    "مُفْسِد": {"m": "corrupter, maker of mischief", "t": "mufsid", "d": "faith-ethics"},
    "مُفْلِحُون": {"m": "the successful, triumphant ones", "t": "mufliḥūn", "d": "faith-ethics"},

    # Worship & Rituals
    "صَلَوٰة": {"m": "prayer (Salat), supplication", "t": "ṣalāh", "d": "worship-rituals"},
    "صَلَاة": {"m": "prayer (Salat), supplication", "t": "ṣalāh", "d": "worship-rituals"},
    "زَكَوٰة": {"m": "purifying alms (Zakat), charity", "t": "zakāh", "d": "worship-rituals"},
    "زَكَاة": {"m": "purifying alms (Zakat), charity", "t": "zakāh", "d": "worship-rituals"},
    "صَوْم": {"m": "fasting (Sawm)", "t": "ṣawm", "d": "worship-rituals"},
    "صِيَام": {"m": "fasting, abstinence", "t": "ṣiyām", "d": "worship-rituals"},
    "حَجّ": {"m": "pilgrimage to Mecca (Hajj)", "t": "ḥajj", "d": "worship-rituals"},
    "عُمْرَة": {"m": "minor pilgrimage (Umrah)", "t": "ʿumrah", "d": "worship-rituals"},
    "سُجُود": {"m": "prostration before Allah", "t": "sujūd", "d": "worship-rituals"},
    "رُكُوع": {"m": "bowing in reverent worship", "t": "rukūʿ", "d": "worship-rituals"},
    "مَسْجِد": {"m": "mosque, place of prostration", "t": "masjid", "d": "worship-rituals"},
    "كَعْبَة": {"m": "The Ka'bah (Sacred House)", "t": "Kaʿbah", "d": "worship-rituals"},
    "قِبْلَة": {"m": "direction of prayer (Qiblah)", "t": "qiblah", "d": "worship-rituals"},
    "تَسْبِيح": {"m": "glorification of Allah, praise", "t": "tasbīḥ", "d": "worship-rituals"},
    "دُعَاء": {"m": "supplication, invocation, prayer", "t": "duʿāʾ", "d": "worship-rituals"},
    "ذِكْر": {"m": "remembrance of Allah, admonition", "t": "dhikr", "d": "worship-rituals"},
    "قُرْبَان": {"m": "sacrifice, sacrificial offering", "t": "qurbān", "d": "worship-rituals"},

    # Cosmology & Nature
    "سَمَاء": {"m": "sky, heaven, celestial sphere", "t": "samāʾ", "d": "cosmology-nature"},
    "سَمَٰوَٰت": {"m": "the seven heavens, skies", "t": "samāwāt", "d": "cosmology-nature"},
    "أَرْض": {"m": "earth, land, ground", "t": "arḍ", "d": "cosmology-nature"},
    "شَمْس": {"m": "sun, radiant celestial body", "t": "shams", "d": "cosmology-nature"},
    "قَمَر": {"m": "moon, luminous celestial sphere", "t": "qamar", "d": "cosmology-nature"},
    "نَجْم": {"m": "star, celestial body / vegetation", "t": "najm", "d": "cosmology-nature"},
    "بَحْر": {"m": "sea, ocean, great body of water", "t": "baḥr", "d": "cosmology-nature"},
    "نَهَر": {"m": "river, flowing stream", "t": "nahar", "d": "cosmology-nature"},
    "مَاء": {"m": "water, life-giving rain", "t": "māʾ", "d": "cosmology-nature"},
    "شَجَر": {"m": "trees, flora, vegetation", "t": "shajar", "d": "cosmology-nature"},
    "جَبَل": {"m": "mountain, towering elevation", "t": "jabal", "d": "cosmology-nature"},
    "رِيح": {"m": "wind, gale, scent, power", "t": "rīḥ", "d": "cosmology-nature"},
    "سَحَاب": {"m": "clouds, water-laden mist", "t": "saḥāb", "d": "cosmology-nature"},
    "مَطَر": {"m": "rain, downpour of judgment/mercy", "t": "maṭar", "d": "cosmology-nature"},
    "نُور": {"m": "light, radiant illumination", "t": "nūr", "d": "cosmology-nature"},
    "ظُلُمَٰت": {"m": "darknesses, obscure layers", "t": "ẓulumāt", "d": "cosmology-nature"},
    "لَيْل": {"m": "night, darkness", "t": "layl", "d": "time-space-motion"},
    "نَهَار": {"m": "day, daylight", "t": "nahār", "d": "time-space-motion"},
    "دَابَّة": {"m": "moving creature, beast of the earth", "t": "dābbah", "d": "cosmology-nature"},
    "طَيْر": {"m": "birds, winged fowl", "t": "ṭayr", "d": "cosmology-nature"},

    # Humanity & Body
    "إِنسَٰن": {"m": "human being, mankind", "t": "insān", "d": "humanity-body"},
    "نَاس": {"m": "people, humanity, mankind", "t": "nās", "d": "humanity-body"},
    "نَفْس": {"m": "soul, self, life, psyche", "t": "nafs", "d": "humanity-body"},
    "قَلْب": {"m": "heart, spiritual center, intellect", "t": "qalb", "d": "humanity-body"},
    "صَدْر": {"m": "chest, breast, inner self", "t": "ṣadr", "d": "humanity-body"},
    "عَيْن": {"m": "eye / water spring", "t": "ʿayn", "d": "humanity-body"},
    "أُذُن": {"m": "ear, hearing organ", "t": "udhun", "d": "humanity-body"},
    "يَد": {"m": "hand, power, influence", "t": "yad", "d": "humanity-body"},
    "رِجْل": {"m": "foot, leg", "t": "rijl", "d": "humanity-body"},
    "وَجْه": {"m": "face, countenance, direction", "t": "wajh", "d": "humanity-body"},
    "دَم": {"m": "blood", "t": "dam", "d": "humanity-body"},
    "لَحْم": {"m": "flesh, meat", "t": "laḥm", "d": "humanity-body"},
    "عَظْم": {"m": "bone, skeletal frame", "t": "ʿaẓm", "d": "humanity-body"},
    "جِلْد": {"m": "skin, hide", "t": "jild", "d": "humanity-body"},
    "طَعَام": {"m": "food, nourishment, provision", "t": "ṭaʿām", "d": "humanity-body"},
    "شَرَاب": {"m": "drink, pure beverage", "t": "sharāb", "d": "humanity-body"},
    "مَوْت": {"m": "death, cessation of worldly life", "t": "mawt", "d": "humanity-body"},
    "حَيَاة": {"m": "life, vitality, worldly existence", "t": "ḥayāh", "d": "humanity-body"},

    # Family & Society
    "وَالِد": {"m": "father, parent", "t": "wālid", "d": "family-society"},
    "وَالِدَة": {"m": "mother", "t": "wālidah", "d": "family-society"},
    "أُمّ": {"m": "mother, source, foundation", "t": "umm", "d": "family-society"},
    "أَب": {"m": "father, forefather, ancestor", "t": "ab", "d": "family-society"},
    "أَخ": {"m": "brother, compatriot, peer", "t": "akh", "d": "family-society"},
    "أُخْت": {"m": "sister", "t": "ukht", "d": "family-society"},
    "زَوْج": {"m": "spouse, mate, partner, pair", "t": "zawj", "d": "family-society"},
    "امْرَأَة": {"m": "woman, wife", "t": "imraʾah", "d": "family-society"},
    "رَجُل": {"m": "man, gentleman", "t": "rajul", "d": "humanity-body"},
    "وَلَد": {"m": "child, offspring, son", "t": "walad", "d": "family-society"},
    "بَنُون": {"m": "sons, children, progeny", "t": "banūn", "d": "family-society"},
    "ذُرِّيَّة": {"m": "offspring, descendants, lineage", "t": "dhurriyyah", "d": "family-society"},
    "أَهْل": {"m": "family, household, people", "t": "ahl", "d": "family-society"},
    "قَوْم": {"m": "people, nation, tribe, community", "t": "qawm", "d": "family-society"},
    "يَتِيم": {"m": "orphan, vulnerable ward", "t": "yatīm", "d": "family-society"},
    "مِسْكِين": {"m": "destitute person, needy poor", "t": "miskīn", "d": "family-society"},
    "فَقِير": {"m": "poor, impoverished, needy of God", "t": "faqīr", "d": "family-society"},
    "جَار": {"m": "neighbor", "t": "jār", "d": "family-society"},

    # Law, Governance & Commerce
    "مَال": {"m": "wealth, property, financial assets", "t": "māl", "d": "law-governance-commerce"},
    "ذَهَب": {"m": "gold, precious metal", "t": "dhahab", "d": "law-governance-commerce"},
    "فِضَّة": {"m": "silver, coin", "t": "fiḍḍah", "d": "law-governance-commerce"},
    "تِجَٰرَة": {"m": "commerce, trade, transaction", "t": "tijārah", "d": "law-governance-commerce"},
    "بَيْع": {"m": "buying and selling, contract", "t": "bayʿ", "d": "law-governance-commerce"},
    "رِبَوٰا": {"m": "usury (Riba), predatory interest", "t": "ribā", "d": "law-governance-commerce"},
    "عَهْد": {"m": "covenant, treaty, solemn pledge", "t": "ʿahd", "d": "law-governance-commerce"},
    "مِيثَٰق": {"m": "firm charter, binding covenant", "t": "mīthāq", "d": "law-governance-commerce"},
    "أَمَانَة": {"m": "trust, moral responsibility", "t": "amānah", "d": "law-governance-commerce"},
    "حَرْب": {"m": "war, warfare, armed conflict", "t": "ḥarb", "d": "law-governance-commerce"},
    "سِلْم": {"m": "peace, submission, concord", "t": "silm", "d": "law-governance-commerce"},
    "جِهَاد": {"m": "striving, endeavor in Allah's cause", "t": "jihād", "d": "law-governance-commerce"},
    "حُكْم": {"m": "judgment, ruling, governance, wisdom", "t": "ḥukm", "d": "law-governance-commerce"},
    "أَمْر": {"m": "command, decree, matter, affair", "t": "amr", "d": "law-governance-commerce"},
    "نَهْى": {"m": "prohibition, forbidding evil", "t": "nahy", "d": "law-governance-commerce"},
    "قِصَاص": {"m": "equitable retribution, just legal remedy", "t": "qiṣāṣ", "d": "law-governance-commerce"},
    "وَصِيَّة": {"m": "bequest, testament, will", "t": "waṣiyyah", "d": "law-governance-commerce"},

    # Intellect, Speech & Communication
    "قَوْل": {"m": "statement, utterance, word", "t": "qawl", "d": "intellect-communication"},
    "كَلَٰم": {"m": "speech, discourse, Word of God", "t": "kalām", "d": "intellect-communication"},
    "عِلْم": {"m": "knowledge, profound learning", "t": "ʿilm", "d": "intellect-communication"},
    "عَقْل": {"m": "intellect, reason, understanding", "t": "ʿaql", "d": "intellect-communication"},
    "فِكْر": {"m": "reflection, contemplation, thinking", "t": "fikr", "d": "intellect-communication"},
    "حِكْمَة": {"m": "wisdom, sagacity, discernment", "t": "ḥikmah", "d": "intellect-communication"},
    "لِسَان": {"m": "tongue, language, speech", "t": "lisān", "d": "intellect-communication"},
    "حَدِيث": {"m": "narration, discourse, message", "t": "ḥadīth", "d": "intellect-communication"},
    "نَبَأ": {"m": "news, great tidings, proclamation", "t": "nabaʾ", "d": "intellect-communication"},
    "بَيَان": {"m": "clear exposition, eloquence", "t": "bayān", "d": "intellect-communication"},
    "مَثَل": {"m": "parable, similitude, example", "t": "mathal", "d": "intellect-communication"},
    "يَجْرِمَ": {"m": "to let incite, cause to sin", "t": "yajrim", "d": "faith-ethics"},
    "نَـَٔا": {"m": "to turn away, withdraw arrogantly", "t": "naʾā", "d": "faith-ethics"},
    "يَطَـُٔ": {"m": "to step upon, tread, march", "t": "yaṭaʾ", "d": "time-space-motion"},
    "ٱسْتَـْٔجَرْ": {"m": "to hire, employ for service", "t": "istaʾjara", "d": "law-governance-commerce"},
    "يُبَتِّكُ": {"m": "to slit the ears of livestock", "t": "yubattiku", "d": "law-governance-commerce"},
    "يُبَطِّئَ": {"m": "to lag behind, delay, hesitate", "t": "yubaṭṭiʾ", "d": "faith-ethics"},
    "يَحْطِمَ": {"m": "to crush, break into pieces", "t": "yaḥṭima", "d": "cosmology-nature"},
    "أَحْتَنِكَ": {"m": "to seize, overpower offspring", "t": "aḥtanika", "d": "history-civilizations"},
    "ٱخْسَـُٔ": {"m": "stay away despised and humiliated", "t": "ikhsaʾū", "d": "afterlife-eschatology"},
    "نَسْفَعًۢ": {"m": "We will drag by the forelock", "t": "nasfaʿan", "d": "afterlife-eschatology"},
    "يَصْرِمُ": {"m": "to harvest, pluck the fruit", "t": "yaṣrimu", "d": "law-governance-commerce"},
    "يُضَٰهِـُٔ": {"m": "to imitate, match the sayings", "t": "yuḍāhiʾu", "d": "history-civilizations"},
    "يَسْتَنۢبِـُٔ": {"m": "to ask for information, inquire", "t": "yastanbiʾu", "d": "intellect-communication"},
    "يُنَٰزِعُ": {"m": "to dispute, contend with you", "t": "yunāziʿu", "d": "intellect-communication"},
    "يُوَاطِـُٔ": {"m": "to adjust, make conform the count", "t": "yuwāṭiʾu", "d": "worship-rituals"},
    "يَتَّكِـُٔ": {"m": "to recline upon adornments", "t": "yattakiʾu", "d": "afterlife-eschatology"},
    "هَنِيٓـٔ": {"m": "in ease, wholesome enjoyment, pleasant", "t": "hanīʾ", "d": "faith-ethics"},
    "مَّرِيٓـٔ": {"m": "wholesome, easily digested, good health", "t": "marīʾ", "d": "faith-ethics"},
    "ٱعْتَمَرَ": {"m": "to perform Umrah (minor pilgrimage)", "t": "iʿtamara", "d": "worship-rituals"},
    "كَانَ": {"m": "to be, was, existed", "t": "kāna", "d": "divine-realm"},
    "قَالَ": {"m": "he said, to say, to speak", "t": "qāla", "d": "intellect-communication"},
    "ءَامَنَ": {"m": "to believe, have faith", "t": "āmana", "d": "faith-ethics"},
    "عَلِمَ": {"m": "to know, learn, be aware", "t": "ʿalima", "d": "intellect-communication"},
    "خَلَقَ": {"m": "he created, to create, fashion", "t": "khalaqa", "d": "cosmology-nature"},
    "جَعَلَ": {"m": "he made, to make, appoint, set", "t": "jaʿala", "d": "divine-realm"},
    "أَنزَلَ": {"m": "he sent down, to reveal", "t": "anzala", "d": "prophethood-revelation"},
    "إِذَا": {"m": "when, whenever, as soon as", "t": "idhā", "d": "time-space-motion"},
    "إِذْ": {"m": "when, as, since", "t": "idh", "d": "time-space-motion"},
    "ضَلَٰل": {"m": "error, straying from guidance", "t": "ḍalāl", "d": "faith-ethics"},
    "هُدًى": {"m": "guidance, direction, truth", "t": "hudā", "d": "faith-ethics"},
}

# Domain metadata lookup (11 Authentic Semantic Domains - Strictly Nouns, Proper Nouns, Adjectives, Verbs)
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
    'history-civilizations': {'en': 'History, Peoples & Warnings', 'ar': 'الأمم السابقة والعبر والقصص'}
}

# Transliteration mapping
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
    for c in list(text):
        if c == 'ّ':
            if res and res[-1] in 'btthjḥkhddhrzsṣḍṭẓʿghfqklmnhwyʾ':
                res.append(res[-1])
            continue
        res.append(AR_TO_LATIN.get(c, c))
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

# POS metadata lookup & classification
def categorize_pos(pos_str):
    p = (pos_str or '').strip().lower()
    # 1. Pronouns - must be caught before general noun
    if 'pronoun' in p:
        return 'pronoun', 'noun', 'ضمير', pos_str
    # 2. Proper Nouns (names of Allah, prophets, places)
    if 'proper noun' in p:
        return 'proper_noun', 'noun', 'اسم علم', 'Proper Noun'
    # 3. Adjectives
    if 'adjective' in p:
        return 'adjective', 'noun', 'صفة / نعت', 'Adjective'
    # 4. Adverbs - must be checked before verb because 'adverb' contains 'verb'!
    if 'adverb' in p:
        return 'adverb', 'noun', 'ظرف', pos_str
    # 5. Verbal Noun
    if 'verbal noun' in p:
        return 'noun', 'noun', 'اسم فعل', 'Verbal Noun'
    # 6. Verbs
    if p == 'verb' or (re.search(r'\bverb\b', p) and 'adverb' not in p):
        return 'verb', 'verb', 'فعل', 'Verb'
    # 7. General Nouns
    if 'noun' in p:
        return 'noun', 'noun', 'اسم', 'Noun'
    # 8. Particles (Prepositions, Conjunctions, etc.)
    return 'particle', 'particle', 'حرف / أداة', pos_str or 'Particle'

def clean_wbw_meaning(raw_list, pos, clean_ar):
    if not raw_list:
        return ''
    cleaned = []
    for t in raw_list:
        s = re.sub(r'^\(\d+\)$', '', t).strip()
        s = re.sub(r'[\[\]]', '', s).strip()
        # strip leading (of), (the), etc.
        s = re.sub(r'^\((?:of|the|to|in|from|for|on|with|and|is)\)\s*', '', s, flags=re.IGNORECASE)
        s = re.sub(r'^(?:and|and\s+the|and\s+a|so\s+the|so\s+a)\s+', '', s, flags=re.IGNORECASE)
        s = s.strip()
        if s and len(s) > 1:
            cleaned.append(s.lower())
    if not cleaned:
        return ''
    c = Counter(cleaned)
    top_candidates = [k for k, _ in c.most_common(3)]
    best = top_candidates[0]
    if len(top_candidates) > 1 and c[top_candidates[1]] >= 2 and top_candidates[1] not in best:
        best = f"{best} / {top_candidates[1]}"
    
    # Adjust for verb presentation
    if pos == 'Verb':
        if best in ['is', 'was', 'were', 'been', 'be', 'are']:
            best = 'to be, was, existed'
        elif not best.startswith('to ') and not best.startswith('he ') and not best.startswith('they ') and not best.startswith('you '):
            best = f"to {best}"
    return best

def infer_domain(clean_ar, pos, posCategory, meaning):
    # Only group semantically: Nouns (except pronouns), Proper Nouns, Adjectives, Verbs
    if posCategory not in ['noun', 'proper_noun', 'adjective', 'verb']:
        return None

    m_low = (meaning or '').lower()
    
    # Check theological keywords
    if any(k in clean_ar for k in ['الله', 'رب', 'رحمن', 'رحيم', 'اله', 'قدوس', 'سلام', 'عزيز', 'حكيم', 'خالق', 'ملك', 'عرش', 'روح']) or any(k in m_low for k in ['allah', 'lord', 'merciful', 'almighty', 'deity', 'throne', 'angel']):
        return 'divine-realm'

    # Prophets / Revelation
    if any(k in clean_ar for k in ['موسي', 'ابراهيم', 'نوح', 'عيسي', 'يوسف', 'داود', 'سليمان', 'ادم', 'محمد', 'قران', 'كتاب', 'توراه', 'انجيل', 'فرقان', 'رسول', 'نبي', 'ايه']) or any(k in m_low for k in ['prophet', 'messenger', 'revelation', 'quran', 'book', 'verse', 'moses', 'abraham', 'jesus']):
        return 'prophethood-revelation'

    # Afterlife
    if any(k in clean_ar for k in ['جنه', 'جهنم', 'نار', 'عذاب', 'حساب', 'ميزان', 'بعث', 'قيامه', 'سعير', 'جحيم', 'فردوس', 'عدن', 'سقر']) or any(k in m_low for k in ['paradise', 'hell', 'fire', 'punishment', 'resurrection', 'hereafter', 'reward', 'reckoning']):
        return 'afterlife-eschatology'

    # Worship
    if any(k in clean_ar for k in ['صلاه', 'زكاه', 'حج', 'صوم', 'سجود', 'ركوع', 'مسجد', 'تسبيح', 'دعاء', 'كعبه']) or any(k in m_low for k in ['prayer', 'prostrat', 'bow', 'fast', 'pilgrim', 'mosque', 'worship']):
        return 'worship-rituals'

    # Faith & Ethics
    if any(k in clean_ar for k in ['ايمان', 'مؤمن', 'كفر', 'نفاق', 'تقوي', 'صبر', 'شكر', 'توبه', 'عدل', 'ظلم', 'احسان', 'صدق', 'كذب', 'خير', 'شر', 'حق', 'باطل', 'صالح']) or any(k in m_low for k in ['believ', 'faith', 'disbelie', 'patient', 'thank', 'just', 'unjust', 'righteous', 'truth', 'lie', 'good', 'evil']):
        return 'faith-ethics'

    # Nature / Cosmos
    if any(k in clean_ar for k in ['سماء', 'ارض', 'شمس', 'قمر', 'نجم', 'بحر', 'نهر', 'ماء', 'شجر', 'جبل', 'ريح', 'سحاب', 'مطر', 'طير']) or any(k in m_low for k in ['heaven', 'earth', 'sun', 'moon', 'star', 'sea', 'water', 'mountain', 'wind', 'rain']):
        return 'cosmology-nature'

    # Law / Commerce
    if any(k in clean_ar for k in ['مال', 'ذهب', 'فضه', 'جهاد', 'حرب', 'عهد', 'ميثاق', 'حكم', 'بيع', 'تجاره', 'ربوا']) or any(k in m_low for k in ['wealth', 'money', 'treaty', 'covenant', 'law', 'trade', 'usury']):
        return 'law-governance-commerce'

    # Speech / Intellect
    if any(k in clean_ar for k in ['قال', 'قول', 'علم', 'سمع', 'راي', 'عقل', 'فكر', 'ذكر', 'قرا', 'كتب', 'بيان', 'حديث', 'نبا']) or any(k in m_low for k in ['say', 'speak', 'know', 'hear', 'see', 'think', 'ponder', 'remember', 'recite']):
        return 'intellect-communication'

    # Humanity / Body
    if any(k in clean_ar for k in ['انسان', 'ناس', 'نفس', 'قلب', 'صدر', 'عين', 'يد', 'رجل', 'وجه', 'دم', 'لحم', 'طعام', 'موت', 'حياه']) or any(k in m_low for k in ['man', 'people', 'soul', 'heart', 'hand', 'eye', 'face', 'food', 'death', 'life']):
        return 'humanity-body'

    # Family / Society
    if any(k in clean_ar for k in ['ام', 'اب', 'اخ', 'اخت', 'زوج', 'ولد', 'اهل', 'قوم', 'يتيم', 'مسكين']) or any(k in m_low for k in ['father', 'mother', 'brother', 'sister', 'spouse', 'child', 'family', 'orphan']):
        return 'family-society'

    # History
    if any(k in clean_ar for k in ['فرعون', 'قارون', 'هامان', 'عاد', 'ثمود', 'مدين', 'قريه']) or any(k in m_low for k in ['pharaoh', 'people of', 'ancient', 'dwellers']):
        return 'history-civilizations'

    return 'faith-ethics' if posCategory == 'verb' else 'cosmology-nature'

    m_low = (meaning or '').lower()
    
    # Check theological keywords
    if any(k in clean_ar for k in ['الله', 'رب', 'رحمن', 'رحيم', 'اله', 'قدوس', 'سلام', 'عزيز', 'حكيم', 'خالق', 'ملك', 'عرش', 'روح']) or any(k in m_low for k in ['allah', 'lord', 'merciful', 'almighty', 'deity', 'throne', 'angel']):
        return 'divine-realm'

    # Prophets / Revelation
    if any(k in clean_ar for k in ['موسي', 'ابراهيم', 'نوح', 'عيسي', 'يوسف', 'داود', 'سليمان', 'ادم', 'محمد', 'قران', 'كتاب', 'توراه', 'انجيل', 'فرقان', 'رسول', 'نبي', 'ايه']) or any(k in m_low for k in ['prophet', 'messenger', 'revelation', 'quran', 'book', 'verse', 'moses', 'abraham', 'jesus']):
        return 'prophethood-revelation'

    # Afterlife
    if any(k in clean_ar for k in ['جنه', 'جهنم', 'نار', 'عذاب', 'حساب', 'ميزان', 'بعث', 'قيامه', 'سعير', 'جحيم', 'فردوس', 'عدن', 'سقر']) or any(k in m_low for k in ['paradise', 'hell', 'fire', 'punishment', 'resurrection', 'hereafter', 'reward', 'reckoning']):
        return 'afterlife-eschatology'

    # Worship
    if any(k in clean_ar for k in ['صلاه', 'زكاه', 'حج', 'صوم', 'سجود', 'ركوع', 'مسجد', 'تسبيح', 'دعاء', 'كعبه']) or any(k in m_low for k in ['prayer', 'prostrat', 'bow', 'fast', 'pilgrim', 'mosque', 'worship']):
        return 'worship-rituals'

    # Faith & Ethics
    if any(k in clean_ar for k in ['ايمان', 'مؤمن', 'كفر', 'نفاق', 'تقوي', 'صبر', 'شكر', 'توبه', 'عدل', 'ظلم', 'احسان', 'صدق', 'كذب', 'خير', 'شر', 'حق', 'باطل', 'صالح']) or any(k in m_low for k in ['believ', 'faith', 'disbelie', 'patient', 'thank', 'just', 'unjust', 'righteous', 'truth', 'lie', 'good', 'evil']):
        return 'faith-ethics'

    # Nature / Cosmos
    if any(k in clean_ar for k in ['سماء', 'ارض', 'شمس', 'قمر', 'نجم', 'بحر', 'نهر', 'ماء', 'شجر', 'جبل', 'ريح', 'سحاب', 'مطر', 'طير']) or any(k in m_low for k in ['heaven', 'earth', 'sun', 'moon', 'star', 'sea', 'water', 'mountain', 'wind', 'rain']):
        return 'cosmology-nature'

    # Law / Commerce
    if any(k in clean_ar for k in ['مال', 'ذهب', 'فضه', 'جهاد', 'حرب', 'عهد', 'ميثاق', 'حكم', 'بيع', 'تجاره', 'ربوا']) or any(k in m_low for k in ['wealth', 'money', 'treaty', 'covenant', 'law', 'trade', 'usury']):
        return 'law-governance-commerce'

    # Speech / Intellect
    if any(k in clean_ar for k in ['قال', 'قول', 'علم', 'سمع', 'راي', 'عقل', 'فكر', 'ذكر', 'قرا', 'كتب', 'بيان', 'حديث', 'نبا']) or any(k in m_low for k in ['say', 'speak', 'know', 'hear', 'see', 'think', 'ponder', 'remember', 'recite']):
        return 'intellect-communication'

    # Humanity / Body
    if any(k in clean_ar for k in ['انسان', 'ناس', 'نفس', 'قلب', 'صدر', 'عين', 'يد', 'رجل', 'وجه', 'دم', 'لحم', 'طعام', 'موت', 'حياه']) or any(k in m_low for k in ['man', 'people', 'soul', 'heart', 'hand', 'eye', 'face', 'food', 'death', 'life']):
        return 'humanity-body'

    # Family / Society
    if any(k in clean_ar for k in ['ام', 'اب', 'اخ', 'اخت', 'زوج', 'ولد', 'اهل', 'قوم', 'يتيم', 'مسكين']) or any(k in m_low for k in ['father', 'mother', 'brother', 'sister', 'spouse', 'child', 'family', 'orphan']):
        return 'family-society'

    # History
    if any(k in clean_ar for k in ['فرعون', 'قارون', 'هامان', 'عاد', 'ثمود', 'مدين', 'قريه']) or any(k in m_low for k in ['pharaoh', 'people of', 'ancient', 'dwellers']):
        return 'history-civilizations'

    return 'faith-ethics' if pos == 'Verb' else 'cosmology-nature'

print("Synthesizing 5,155 Quranic words with rich semantic grouping and English meanings...")

enriched_words = []
total_occurrences = 0

for idx, rw in enumerate(raw_words):
    rank = idx + 1
    w_ar = rw['word']
    freq = rw['frequency']
    pos = rw['pos']
    pct = rw['percentage']
    total_occurrences += freq

    clean_ar = normalize_arabic(w_ar)
    n_ar = norm_ar(w_ar)
    ns_ar = strip_al(n_ar)

    posCategory, primaryDiv, posAr, posTitle = categorize_pos(pos)

    # 1. Lookup meaning and transliteration
    meaning = ''
    translit = ''
    domain = ''

    # Check curated dictionary first
    if w_ar in CURATED_VOCAB:
        meaning = CURATED_VOCAB[w_ar]['m']
        translit = CURATED_VOCAB[w_ar]['t']
        domain = CURATED_VOCAB[w_ar]['d']
    elif clean_ar in CURATED_VOCAB:
        meaning = CURATED_VOCAB[clean_ar]['m']
        translit = CURATED_VOCAB[clean_ar]['t']
        domain = CURATED_VOCAB[clean_ar]['d']
    
    # If meaning not in curated, extract from WBW occurrences
    if not meaning:
        wbw_candidates = []
        if w_ar in word_trans_map:
            wbw_candidates.extend(word_trans_map[w_ar])
        if w_ar in lem_trans_map:
            wbw_candidates.extend(lem_trans_map[w_ar])
        if n_ar in norm_trans_map:
            wbw_candidates.extend(norm_trans_map[n_ar])
        if ns_ar in norm_trans_map:
            wbw_candidates.extend(norm_trans_map[ns_ar])
        
        # Also check with trailing plural suffixes stripped
        if not wbw_candidates:
            for suff in ['ين', 'ون', 'ات', 'ان', 'ها', 'هم', 'كم', 'نا', 'وا']:
                if ns_ar.endswith(suff) and len(ns_ar) > len(suff) + 2:
                    base = ns_ar[:-len(suff)]
                    if base in norm_trans_map:
                        wbw_candidates.extend(norm_trans_map[base])
                        break

        extracted_meaning = clean_wbw_meaning(wbw_candidates, pos, clean_ar)
        if extracted_meaning:
            meaning = extracted_meaning

    # Fallback to accurate default meaning based on grammatical type
    if not translit:
        translit = transliterate_arabic(w_ar)
    if not meaning:
        if posCategory == 'verb':
            meaning = f"to act / verb form of {translit}"
        elif posCategory == 'proper_noun':
            meaning = f"Quranic proper name ({translit})"
        elif posCategory == 'adjective':
            meaning = f"descriptive quality, {translit}"
        else:
            meaning = f"term, {translit}"

    # Semantic domain deduction - ONLY for Nouns (excl pronouns), Proper Nouns, Adjectives, Verbs
    if posCategory in ['noun', 'proper_noun', 'adjective', 'verb']:
        if not domain or domain not in DOMAIN_NAMES:
            domain = infer_domain(clean_ar, pos, posCategory, meaning)
    else:
        domain = None

    # Root deduction from morphology
    root = None
    if n_ar in norm_roots_map and norm_roots_map[n_ar]:
        root = norm_roots_map[n_ar].most_common(1)[0][0]
    elif ns_ar in norm_roots_map and norm_roots_map[ns_ar]:
        root = norm_roots_map[ns_ar].most_common(1)[0][0]
    elif w_ar in lem_roots_map and lem_roots_map[w_ar]:
        root = lem_roots_map[w_ar].most_common(1)[0][0]

    # Sample Verse extraction
    sample_verse = None
    samples_list = []
    if w_ar in word_samples_map:
        samples_list.extend(word_samples_map[w_ar])
    elif n_ar in norm_samples_map:
        samples_list.extend(norm_samples_map[n_ar])
    elif ns_ar in norm_samples_map:
        samples_list.extend(norm_samples_map[ns_ar])

    if samples_list:
        first_s = samples_list[0]
        sample_verse = {
            'location': first_s['location'],
            'text': first_s['word'],
            'translation': first_s['trans'],
            'surahName': first_s['surahName']
        }

    domain_meta = DOMAIN_NAMES.get(domain) if domain else None

    word_entry = {
        'rank': rank,
        'word': w_ar,
        'cleanArabic': clean_ar,
        'transliteration': translit,
        'meaning': meaning,
        'pos': pos,
        'posCategory': posCategory, # 'noun' | 'proper_noun' | 'adjective' | 'verb' | 'pronoun' | 'adverb' | 'particle'
        'posArabic': posAr,
        'posTitle': posTitle,
        'primaryDivision': primaryDiv, # 'noun' | 'verb' | 'particle'
        'semanticDomain': domain,
        'semanticDomainName': domain_meta['en'] if domain_meta else None,
        'semanticDomainArabic': domain_meta['ar'] if domain_meta else None,
        'frequency': freq,
        'percentage': pct,
        'root': root,
        'sampleVerse': sample_verse
    }
    enriched_words.append(word_entry)

print(f"Enriched all {len(enriched_words)} words.")

# Calculate breakdown by Semantic Domain (ONLY Noun, Proper Noun, Adjective, Verb)
domain_groups = defaultdict(lambda: {
    'domainId': '',
    'domainName': '',
    'domainArabic': '',
    'totalWords': 0,
    'totalOccurrences': 0,
    'categories': {
        'noun': {'name': 'Nouns', 'nameArabic': 'الأسماء', 'count': 0, 'occurrences': 0, 'words': []},
        'proper_noun': {'name': 'Proper Nouns', 'nameArabic': 'أسماء الأعلام', 'count': 0, 'occurrences': 0, 'words': []},
        'adjective': {'name': 'Adjectives & Attributes', 'nameArabic': 'الصفات والنعوت', 'count': 0, 'occurrences': 0, 'words': []},
        'verb': {'name': 'Verbs & Actions', 'nameArabic': 'الأفعال', 'count': 0, 'occurrences': 0, 'words': []}
    },
    'topWords': []
})

pos_totals = {
    'noun': {'count': 0, 'occurrences': 0},
    'proper_noun': {'count': 0, 'occurrences': 0},
    'adjective': {'count': 0, 'occurrences': 0},
    'verb': {'count': 0, 'occurrences': 0},
    'pronoun': {'count': 0, 'occurrences': 0},
    'adverb': {'count': 0, 'occurrences': 0},
    'particle': {'count': 0, 'occurrences': 0}
}

semantic_words_count = 0
non_semantic_words_count = 0

for w in enriched_words:
    cat = w['posCategory']
    if cat in pos_totals:
        pos_totals[cat]['count'] += 1
        pos_totals[cat]['occurrences'] += w['frequency']

    d_id = w['semanticDomain']
    if d_id and d_id in DOMAIN_NAMES:
        semantic_words_count += 1
        d_meta = DOMAIN_NAMES[d_id]
        dg = domain_groups[d_id]
        dg['domainId'] = d_id
        dg['domainName'] = d_meta['en']
        dg['domainArabic'] = d_meta['ar']
        dg['totalWords'] += 1
        dg['totalOccurrences'] += w['frequency']

        if cat in dg['categories']:
            dg['categories'][cat]['count'] += 1
            dg['categories'][cat]['occurrences'] += w['frequency']
            if len(dg['categories'][cat]['words']) < 25:
                dg['categories'][cat]['words'].append(w)

        if len(dg['topWords']) < 20:
            dg['topWords'].append(w)
    else:
        non_semantic_words_count += 1

stats_payload = {
    'totalWords': len(enriched_words),
    'totalOccurrences': total_occurrences,
    'source': 'Fluent Arabic Quran Frequency List & Corpus Quran Morphology',
    'sourceSpreadsheet': 'Quran-All-Words.xlsx',
    'posTotals': pos_totals,
    'semanticStats': {
        'groupedWordsCount': semantic_words_count,
        'excludedWordsCount': non_semantic_words_count,
        'allowedCategories': ['noun', 'proper_noun', 'adjective', 'verb'],
        'rule': 'Only nouns (excluding pronouns), proper nouns, adjectives, and verbs are grouped semantically.'
    },
    'semanticDomains': sorted(list(domain_groups.values()), key=lambda x: x['totalOccurrences'], reverse=True)
}

# Write output files
words_path = 'src/data/fluentArabicWords.json'
stats_path = 'src/data/fluentArabicStats.json'

with open(words_path, 'w', encoding='utf-8') as f:
    json.dump(enriched_words, f, ensure_ascii=False, indent=2)
print(f"Wrote {len(enriched_words)} words to {words_path}")

with open(stats_path, 'w', encoding='utf-8') as f:
    json.dump(stats_payload, f, ensure_ascii=False, indent=2)
print(f"Wrote stats to {stats_path}")

print("Verification sample of 10 enriched words with English meanings and semantic groups:")
for w in enriched_words[:10]:
    print(f"#{w['rank']} {w['word']} ({w['transliteration']}) [{w['posCategory']}] -> {w['meaning']} | Domain: {w['semanticDomain']}")
