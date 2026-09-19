import json
import re
from collections import defaultdict

print("Updating semantic grouping for Quran Fluent Frequency dataset...")

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

def categorize_pos(pos_str):
    p = (pos_str or '').strip().lower()
    # 1. Pronouns - MUST be checked before general noun
    if 'pronoun' in p:
        return 'pronoun', 'noun', 'ضمير', pos_str
    # 2. Proper Nouns (names of Allah, prophets, places)
    if 'proper noun' in p:
        return 'proper_noun', 'noun', 'اسم علم', 'Proper Noun'
    # 3. Adjectives
    if 'adjective' in p:
        return 'adjective', 'noun', 'صفة / نعت', 'Adjective'
    # 4. Adverbs - must be checked before verb because 'adverb' contains 'verb'
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

def infer_domain(clean_ar, posCategory, meaning):
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

words_path = 'src/data/fluentArabicWords.json'
with open(words_path, 'r', encoding='utf-8') as f:
    words = json.load(f)

print(f"Loaded {len(words)} words.")

# Process words
updated_words = []
total_occurrences = 0

for w in words:
    pos = w.get('pos')
    posCategory, primaryDiv, posAr, posTitle = categorize_pos(pos)
    
    clean_ar = w.get('cleanArabic', '')
    meaning = w.get('meaning', '')
    
    # Check if eligible for semantic grouping
    if posCategory in ['noun', 'proper_noun', 'adjective', 'verb']:
        existing_domain = w.get('semanticDomain')
        if existing_domain and existing_domain in DOMAIN_NAMES:
            domain = existing_domain
        else:
            domain = infer_domain(clean_ar, posCategory, meaning)
            
        domain_meta = DOMAIN_NAMES.get(domain, DOMAIN_NAMES['cosmology-nature'])
        sem_domain = domain
        sem_name = domain_meta['en']
        sem_ar = domain_meta['ar']
    else:
        sem_domain = None
        sem_name = None
        sem_ar = None

    w_copy = dict(w)
    w_copy['posCategory'] = posCategory
    w_copy['primaryDivision'] = primaryDiv
    w_copy['posArabic'] = posAr
    w_copy['posTitle'] = posTitle
    w_copy['semanticDomain'] = sem_domain
    w_copy['semanticDomainName'] = sem_name
    w_copy['semanticDomainArabic'] = sem_ar
    w_copy['id'] = f"fluent-word-{w['rank']}"
    
    total_occurrences += w.get('frequency', 0)
    updated_words.append(w_copy)

# Domain groups
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

for w in updated_words:
    cat = w['posCategory']
    if cat in pos_totals:
        pos_totals[cat]['count'] += 1
        pos_totals[cat]['occurrences'] += w.get('frequency', 0)

    d_id = w['semanticDomain']
    if d_id and d_id in DOMAIN_NAMES:
        semantic_words_count += 1
        d_meta = DOMAIN_NAMES[d_id]
        dg = domain_groups[d_id]
        dg['domainId'] = d_id
        dg['domainName'] = d_meta['en']
        dg['domainArabic'] = d_meta['ar']
        dg['totalWords'] += 1
        dg['totalOccurrences'] += w.get('frequency', 0)

        if cat in dg['categories']:
            dg['categories'][cat]['count'] += 1
            dg['categories'][cat]['occurrences'] += w.get('frequency', 0)
            if len(dg['categories'][cat]['words']) < 25:
                dg['categories'][cat]['words'].append(w)

        if len(dg['topWords']) < 20:
            dg['topWords'].append(w)
    else:
        non_semantic_words_count += 1

stats_payload = {
    'totalWords': len(updated_words),
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

with open('src/data/fluentArabicWords.json', 'w', encoding='utf-8') as f:
    json.dump(updated_words, f, ensure_ascii=False, indent=2)

with open('src/data/fluentArabicStats.json', 'w', encoding='utf-8') as f:
    json.dump(stats_payload, f, ensure_ascii=False, indent=2)

print(f"Successfully wrote {len(updated_words)} words to src/data/fluentArabicWords.json")
print(f"Semantically grouped: {semantic_words_count} words")
print(f"Excluded non-semantic words: {non_semantic_words_count} words")
print(f"Semantic domains count: {len(stats_payload['semanticDomains'])}")
for dom in stats_payload['semanticDomains']:
    print(f"- {dom['domainId']}: {dom['domainName']} ({dom['totalWords']} words, {dom['totalOccurrences']} occurrences)")
