import express from 'express';
import type { Request, Response } from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { SURAHS } from '../data/surahs.ts';
import { SEMANTIC_DOMAINS } from '../data/semanticDomains.ts';
import { GRAMMAR_TYPES, CURATED_GRAMMAR_DERIVATIONS, normalizeGrammarTypeId } from '../data/grammarTypes.ts';
import { PARTS_OF_SPEECH, PRIMARY_DIVISIONS, normalizePartOfSpeechId, getWordsForPartOfSpeech, QURAN_PARTICLES } from '../data/partsOfSpeech.ts';
import type { RootSummary, RootDetail, DerivedFormSummary, MorphologicalSection, WordVariation, RootDerivation, SemanticDomain, GrammarCategorySummary, PartOfSpeechSummary, FluentQuranWord, FluentFrequencyStats } from '../types.ts';
import { PROMINENT_ROOTS } from '../data/arabicLetters.ts';
import fs from 'fs';

function loadDataJson<T>(filename: string, fallback: T): T {
  const possiblePaths = [
    path.resolve(process.cwd(), 'src/data', filename),
    path.resolve(process.cwd(), 'dist/src/data', filename),
    path.resolve(process.cwd(), 'data', filename),
    fileURLToPath(new URL(`../data/${filename}`, import.meta.url))
  ];
  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, 'utf-8')) as T;
      }
    } catch {
      // try next candidate path
    }
  }
  return fallback;
}

const allRootsData: RootSummary[] = loadDataJson<RootSummary[]>('allRoots.json', []);
const rawWordsData: any[] = loadDataJson<any[]>('fluentArabicWords.json', []);
const rawStatsData: any = loadDataJson<any>('fluentArabicStats.json', {});

const PORT = 3000;
const app = express();

// URL prefix normalization so that both /api/letters and /letters (if stripped by reverse proxies) work seamlessly
app.use((req, res, next) => {
  if (req.url && !req.url.startsWith('/api') && !req.url.startsWith('/@') && !req.url.startsWith('/src') && !req.url.startsWith('/assets')) {
    req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
  }
  next();
});

// Enable CORS for universal access across Vercel deployments & previews
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(compression());
app.use(express.json());

// Base health endpoints
app.get(['/api', '/api/health'], (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    totalRoots: allRootsList.length || 1664,
    totalWords: fluentWordsList.length || 5155
  });
});

// In-memory cache for fast subsequent lookups
const rootCache = new Map<string, RootDetail>();

// Pre-bundled datasets - ensures zero filesystem dependency on Vercel Serverless / AWS Lambda
const allRootsList: RootSummary[] = allRootsData as RootSummary[];

const fluentWordsList: FluentQuranWord[] = (rawWordsData as any[]).map((w: any, idx: number) => ({
  ...w,
  id: w.id || `fluent-word-${w.rank || idx + 1}`
}));

let fluentStatsData: FluentFrequencyStats = rawStatsData as unknown as FluentFrequencyStats;
if (fluentStatsData && Array.isArray((fluentStatsData as any).semanticDomains)) {
  for (const domain of (fluentStatsData as any).semanticDomains) {
    if (Array.isArray(domain.topWords)) {
      domain.topWords = domain.topWords.map((w: any, idx: number) => ({
        ...w,
        id: w.id || `sem-top-${domain.domainId}-${w.rank || idx}`
      }));
    }
    if (domain.categories) {
      for (const catKey of Object.keys(domain.categories)) {
        const cat = domain.categories[catKey];
        if (cat && Array.isArray(cat.words)) {
          cat.words = cat.words.map((w: any, idx: number) => ({
            ...w,
            id: w.id || `sem-${domain.domainId}-${catKey}-${w.rank || idx}`
          }));
        }
      }
    }
  }
}

// Arabic letter name mapping
const arabicLetterNames: Record<string, string> = {
  A: 'Alif (أ)', b: 'Ba (ب)', t: 'Ta (ت)', v: 'Tha (ث)', j: 'Jim (ج)', H: 'Ha (ح)',
  x: 'Kha (خ)', d: 'Dal (د)', '*': 'Dhal (ذ)', r: 'Ra (ر)', z: 'Zay (ز)', s: 'Sin (س)',
  $: 'Shin (ش)', S: 'Sad (ص)', D: 'Dad (ض)', T: 'Ta (ط)', Z: 'Za (ظ)', E: '\'Ayn (ع)',
  g: 'Ghayn (غ)', f: 'Fa (ف)', q: 'Qaf (ق)', k: 'Kaf (ك)', l: 'Lam (ل)', m: 'Mim (م)',
  n: 'Nun (ن)', h: 'Ha (ه)', w: 'Waw (و)', y: 'Ya (ي)'
};

// Top prominent roots with occurrences count pre-annotated for rapid browsing
const prominentOccurrences: Record<string, { occurrences: number; translit: string; meaning: string }> = {
  kwn: { occurrences: 1390, translit: 'kāf wāw nūn', meaning: 'to be, exist' },
  qwl: { occurrences: 1722, translit: 'qāf wāw lām', meaning: 'to say, speak' },
  rHm: { occurrences: 339, translit: 'rā ḥā mīm', meaning: 'mercy, compassion' },
  Elm: { occurrences: 854, translit: 'ʿayn lām mīm', meaning: 'to know, knowledge' },
  ktb: { occurrences: 319, translit: 'kāf tā bā', meaning: 'to write, scripture' },
  Amn: { occurrences: 879, translit: 'hamza mīm nūn', meaning: 'to believe, security' },
  Hmd: { occurrences: 68, translit: 'ḥā mīm dāl', meaning: 'to praise, praise' },
  xlq: { occurrences: 261, translit: 'khā lām qāf', meaning: 'to create' },
  bSr: { occurrences: 148, translit: 'bā ṣād rā', meaning: 'to see, perceive' },
  smE: { occurrences: 185, translit: 'sīn mīm ʿayn', meaning: 'to hear, listen' },
  hdy: { occurrences: 316, translit: 'hā dāl yā', meaning: 'to guide, guidance' },
  SlH: { occurrences: 180, translit: 'ṣād lām ḥā', meaning: 'to be righteous' },
  nfs: { occurrences: 298, translit: 'nūn fā sīn', meaning: 'soul, self' },
  rbb: { occurrences: 981, translit: 'rā bā bā', meaning: 'Lord, sustainer' },
  Alh: { occurrences: 2851, translit: 'hamza lām hā', meaning: 'God, deity' },
  mlk: { occurrences: 206, translit: 'mīm lām kāf', meaning: 'sovereignty, possess' },
  Sbr: { occurrences: 103, translit: 'ṣād bā rā', meaning: 'patience, steadfastness' },
  Ebd: { occurrences: 275, translit: 'ʿayn bā dāl', meaning: 'to worship, servant' },
  Zlm: { occurrences: 315, translit: 'ẓā lām mīm', meaning: 'injustice, darkness' },
  kfr: { occurrences: 525, translit: 'kāf fā rā', meaning: 'to disbelieve, cover' },
  dEw: { occurrences: 212, translit: 'dāl ʿayn wāw', meaning: 'to call, supplicate' },
  xwf: { occurrences: 124, translit: 'khā wāw fā', meaning: 'fear, to fear' },
  Hzn: { occurrences: 42, translit: 'ḥā zāy nūn', meaning: 'grief, sorrow' },
  $kr: { occurrences: 75, translit: 'shīn kāf rā', meaning: 'to be grateful, thank' },
  Tyb: { occurrences: 50, translit: 'ṭā yā bā', meaning: 'good, pure' },
  nwr: { occurrences: 194, translit: 'nūn wāw rā', meaning: 'light' },
  Hqq: { occurrences: 287, translit: 'ḥā qāf qāf', meaning: 'truth, right' }
};

// Annotate prominent occurrences in the roots list
allRootsList.forEach((root) => {
  const codeClean = root.code.replace(/%24/g, '$').replace(/%2A/g, '*').replace(/%3C/g, '<').replace(/%3E/g, '>');
  if (prominentOccurrences[codeClean] || prominentOccurrences[root.code]) {
    const data = prominentOccurrences[codeClean] || prominentOccurrences[root.code];
    root.occurrences = data.occurrences;
    root.translitName = data.translit;
    root.primaryGloss = data.meaning;
  }
});

// Helper to accurately extract prefixes and suffixes from Quranic Arabic words & transliteration
function extractPrefixSuffix(wordArabic: string, translit: string): { prefix: string; suffix: string } {
  const clean = wordArabic.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
  const t = translit.toLowerCase().trim();
  let prefix = '—';
  let suffix = '—';

  // 1. Compound & standard Arabic prefixes (proclitics)
  if (t.startsWith('wa-l-') || t.startsWith('wal-') || (clean.startsWith('وال') && clean.length > 4)) {
    prefix = 'وَالْـ (wal-)';
  } else if (t.startsWith('fa-l-') || t.startsWith('fal-') || (clean.startsWith('فال') && clean.length > 4)) {
    prefix = 'فَالْـ (fal-)';
  } else if (t.startsWith('bi-l-') || t.startsWith('bil-') || (clean.startsWith('بال') && clean.length > 4)) {
    prefix = 'بِالْـ (bil-)';
  } else if (t.startsWith('li-l-') || t.startsWith('lil-') || (clean.startsWith('لل') && clean.length > 3)) {
    prefix = 'لِلْـ (lil-)';
  } else if (t.startsWith('ka-l-') || t.startsWith('kal-') || (clean.startsWith('كال') && clean.length > 4)) {
    prefix = 'كَالْـ (kal-)';
  } else if (t.startsWith('l-') || t.startsWith('al-') || (clean.startsWith('ال') && clean.length > 3)) {
    prefix = 'الْـ (al-)';
  } else if (t.startsWith('wa-') || (clean.startsWith('و') && clean.length > 3 && (t.startsWith('wa') || t.startsWith('wā')))) {
    prefix = 'وَـ (wa-)';
  } else if (t.startsWith('fa-') || (clean.startsWith('ف') && clean.length > 3 && t.startsWith('fa'))) {
    prefix = 'فَـ (fa-)';
  } else if (t.startsWith('bi-') || (clean.startsWith('ب') && clean.length > 3 && t.startsWith('bi'))) {
    prefix = 'بِـ (bi-)';
  } else if (t.startsWith('li-') || (clean.startsWith('ل') && clean.length > 3 && (t.startsWith('li') || t.startsWith('la')))) {
    prefix = t.startsWith('la') ? 'لَـ (la-)' : 'لِـ (li-)';
  } else if (t.startsWith('sa-') || (clean.startsWith('س') && clean.length > 3 && t.startsWith('sa'))) {
    prefix = 'سَـ (sa-)';
  } else if (t.startsWith('a-') || t.startsWith('ʾa-') || (clean.startsWith('أ') && t.startsWith('a') && clean.length > 4)) {
    prefix = 'أَـ (a-)';
  }

  // 2. Suffixes (pronominal enclitics, dual/plural endings, gender markers)
  if (t.endsWith('-humā') || t.endsWith('humā') || clean.endsWith('هما')) {
    suffix = 'ـهُمَا (-humā)';
  } else if (t.endsWith('-kumā') || t.endsWith('kumā') || clean.endsWith('كما')) {
    suffix = 'ـكُمَا (-kumā)';
  } else if (t.endsWith('-hum') || t.endsWith('hum') || clean.endsWith('هم')) {
    suffix = 'ـهُمْ (-hum)';
  } else if (t.endsWith('-him') || t.endsWith('him') || clean.endsWith('هم')) {
    suffix = 'ـهِمْ (-him)';
  } else if (t.endsWith('-kum') || t.endsWith('kum') || clean.endsWith('كم')) {
    suffix = 'ـكُمْ (-kum)';
  } else if (t.endsWith('-hunna') || t.endsWith('hunna') || clean.endsWith('هن')) {
    suffix = 'ـهُنَّ (-hunna)';
  } else if (t.endsWith('-hinna') || t.endsWith('hinna') || clean.endsWith('هن')) {
    suffix = 'ـهِنَّ (-hinna)';
  } else if (t.endsWith('-kunna') || t.endsWith('kunna') || clean.endsWith('كن')) {
    suffix = 'ـكُنَّ (-kunna)';
  } else if (t.endsWith('-hā') || t.endsWith('hā') || clean.endsWith('ها')) {
    suffix = 'ـهَا (-hā)';
  } else if (t.endsWith('-nā') || t.endsWith('nā') || clean.endsWith('نا')) {
    suffix = 'ـنَا (-nā)';
  } else if (t.endsWith('-ūna') || t.endsWith('ūna') || clean.endsWith('ون')) {
    suffix = 'ـُونَ (-ūna)';
  } else if (t.endsWith('-īna') || t.endsWith('īna') || clean.endsWith('ين')) {
    suffix = 'ـِينَ (-īna)';
  } else if (t.endsWith('-āni') || t.endsWith('āni') || clean.endsWith('ان')) {
    suffix = 'ـَانِ (-āni)';
  } else if (t.endsWith('-ayni') || t.endsWith('ayni') || clean.endsWith('ين')) {
    suffix = 'ـَيْنِ (-ayni)';
  } else if (t.endsWith('-āt') || t.endsWith('āt') || clean.endsWith('ات')) {
    suffix = 'ـَات (-āt)';
  } else if (t.endsWith('-tum') || t.endsWith('tum') || clean.endsWith('تم')) {
    suffix = 'ـتُمْ (-tum)';
  } else if (t.endsWith('-ta') || t.endsWith('ta') || clean.endsWith('ت')) {
    suffix = 'ـتَ (-ta)';
  } else if (t.endsWith('-at') || t.endsWith('at') || clean.endsWith('ت')) {
    suffix = 'ـَتْ (-at)';
  } else if (t.endsWith('-hu') || t.endsWith('hu') || (clean.endsWith('ه') && !clean.endsWith('ة'))) {
    suffix = 'ـهُ (-hu)';
  } else if (t.endsWith('-hi') || t.endsWith('hi') || (clean.endsWith('ه') && !clean.endsWith('ة'))) {
    suffix = 'ـهِ (-hi)';
  } else if (t.endsWith('-ka') || t.endsWith('ka') || clean.endsWith('ك')) {
    suffix = 'ـكَ (-ka)';
  } else if (t.endsWith('-ki') || t.endsWith('ki') || clean.endsWith('ك')) {
    suffix = 'ـكِ (-ki)';
  } else if (t.endsWith('-ī') || t.endsWith('ī') || clean.endsWith('ي')) {
    suffix = 'ـِي (-ī)';
  }

  return { prefix, suffix };
}

// Helper to classify semantic role of word derivations
function classifySemanticRole(category: string, meaning: string): 'Action' | 'Agent' | 'Object' | 'Entity' | 'Attribute' {
  const cat = (category || '').toLowerCase();
  const m = (meaning || '').toLowerCase();
  if (cat.includes('verb')) {
    return 'Action';
  }
  if (cat.includes('active participle') || m.startsWith('one who') || m.startsWith('those who') || cat.includes('proper noun')) {
    return 'Agent';
  }
  if (cat.includes('passive participle') || m.startsWith('that which')) {
    return 'Object';
  }
  if (cat.includes('noun of place') || cat.includes('noun of time') || cat.includes('noun of instrument')) {
    return 'Entity';
  }
  if (cat.includes('noun')) {
    // Check if it's an abstract attribute
    if (m.includes('mercy') || m.includes('knowledge') || m.includes('patience') || m.includes('wisdom') || m.includes('guidance') || m.includes('faith') || m.includes('sin') || m.includes('arrogance') || m.includes('truth') || m.includes('peace') || m.includes('justice')) {
      return 'Attribute';
    }
    return 'Entity';
  }
  return 'Attribute';
}

// Helper to parse corpus.quran.com HTML
function parseCorpusHtml(code: string, html: string): RootDetail {
  // 1. Root title in Arabic
  const titleMatch = html.match(/<h2>Quran Dictionary - <span class="ax">([\s\S]*?)<\/span><\/h2>/);
  const arabicRoot = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : code;

  // 2. Transliteration & summary
  const introMatch = html.match(/The (?:triliteral|quadriliteral) root <i class="ab">([^<]+)<\/i>\s*\((?:<span[^>]*>)?([^<]+)(?:<\/span>)?\)\s*occurs\s*(\d+)\s*times in the Quran,\s*in\s*([^:]+):([\s\S]*?)<\/p>/i);
  let rootTranslit = '';
  let occurrences = 0;
  let formsCountDesc = '';

  if (introMatch) {
    rootTranslit = introMatch[1].trim();
    occurrences = parseInt(introMatch[3], 10);
    formsCountDesc = introMatch[4].trim();
  } else {
    // Fallback match for occurrences
    const occurMatch = html.match(/occurs\s+(\d+)\s+times in the Quran/i);
    if (occurMatch) occurrences = parseInt(occurMatch[1], 10);
    const translitMatch = html.match(/The (?:triliteral|quadriliteral) root <i class="ab">([^<]+)<\/i>/i);
    if (translitMatch) rootTranslit = translitMatch[1].trim();
  }

  // 3. Derived forms list from <ul class="also"> right after intro
  const derivedForms: DerivedFormSummary[] = [];
  const ulMatch = html.match(/occurs \d+ times in the Quran, in [^:]+:<\/p>\s*<ul class="also">([\s\S]*?)<\/ul>/);
  if (ulMatch) {
    const liMatches = [...ulMatch[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)];
    for (const m of liMatches) {
      const raw = m[1];
      const countMatch = raw.match(/^(\d+|once|twice)\s+times?\s+as\s+the\s+(.*?)(?:\s*\(<span|<i|$)/i);
      const text = raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const arabicM = raw.match(/<span class="at">([^<]+)<\/span>/);
      const translitM = raw.match(/<i class="ab">([^<]+)<\/i>/);
      let count = 1;
      if (countMatch) {
        if (countMatch[1].toLowerCase() === 'once') count = 1;
        else if (countMatch[1].toLowerCase() === 'twice') count = 2;
        else count = parseInt(countMatch[1], 10) || 1;
      }
      derivedForms.push({
        text,
        count,
        countText: countMatch ? countMatch[1] : `${count}`,
        formType: countMatch ? countMatch[2].trim() : text,
        arabicLemma: arabicM ? arabicM[1].trim() : '',
        translitLemma: translitM ? translitM[1].trim() : ''
      });
    }
  }

  // 4. Word variation sections (<h4 class="dxe">...</h4> and tables)
  const sections: MorphologicalSection[] = [];
  const derivationsMap = new Map<string, RootDerivation>();
  const parts = html.split(/<h4 class="dxe">/);

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const headerEnd = part.indexOf('</h4>');
    const heading = part.substring(0, headerEnd).replace(/<[^>]+>/g, '').trim();
    if (heading.includes('See Also')) continue;

    // Parse category name and default meaning/gloss from section heading
    let category = heading;
    let sectionGloss = '';
    if (category.includes(' -')) {
      const split = category.split(' -');
      category = split[0].trim();
      sectionGloss = split.slice(1).join(' -').trim();
    }

    const variations: WordVariation[] = [];
    const rowMatches = [...part.matchAll(/<tr>\s*<td class="c1"><span class="l">\(([^)]+)\)<\/span>\s*<i class="ab">([^<]*)<\/i><\/td>\s*<td class="c2"><a[^>]*>([^<]*)<\/a><\/td>\s*<td class="c3">([\s\S]*?)<\/td>\s*<\/tr>/g)];

    for (const r of rowMatches) {
      const loc = r[1];
      const [ch, vs, wn] = loc.split(':').map(Number);
      const transliteration = r[2].trim();
      const translation = r[3].trim();
      const rawAyah = r[4];
      const targetWordMatch = rawAyah.match(/<span class="auu">([\s\S]*?)<\/span>/);
      const targetWord = targetWordMatch ? targetWordMatch[1].trim() : '';
      const ayahText = rawAyah.replace(/<span class="auu">([\s\S]*?)<\/span>/g, '【$1】').replace(/<[^>]+>/g, '').trim();

      const surahData = SURAHS[ch];
      const chPad = String(ch).padStart(3, '0');
      const vsPad = String(vs).padStart(3, '0');
      const audioUrl = `https://everyayah.com/data/Alafasy_128kbps/${chPad}${vsPad}.mp3`;

      // Extract prefix and suffix
      const { prefix, suffix } = extractPrefixSuffix(targetWord, transliteration);

      const variation: WordVariation = {
        location: loc,
        chapter: ch,
        verse: vs,
        wordNumber: wn,
        surahName: surahData ? surahData.nameTranslit : `Surah ${ch}`,
        surahArabic: surahData ? surahData.nameArabic : '',
        revelationType: surahData ? surahData.revelationType : undefined,
        transliteration,
        translation,
        targetWord,
        ayahText,
        audioUrl,
        prefix,
        suffix,
        grammarCategory: category
      };

      variations.push(variation);

      // Add to unique derivations table
      const derivKey = `${targetWord}__${category}__${transliteration}`;
      if (!derivationsMap.has(derivKey)) {
        const meaningText = translation || sectionGloss || '—';
        derivationsMap.set(derivKey, {
          id: derivKey,
          root: code,
          rootArabic: arabicRoot,
          word: targetWord,
          transliteration,
          prefix,
          suffix,
          grammarCategory: category,
          meaning: meaningText,
          frequency: 0,
          semanticRole: classifySemanticRole(category, meaningText),
          examples: [],
          occurrences: []
        });
      }

      const dItem = derivationsMap.get(derivKey)!;
      dItem.frequency += 1;
      dItem.occurrences.push(variation);
      if (dItem.examples && dItem.examples.length < 5) {
        dItem.examples.push(loc);
      }
    }

    sections.push({
      heading,
      count: variations.length,
      variations
    });
  }

  // Sort derivations by frequency descending (most prominent derivations first)
  const derivations: RootDerivation[] = [...derivationsMap.values()].sort((a, b) => b.frequency - a.frequency);
  const totalWordVariations = sections.reduce((sum, s) => sum + s.count, 0);

  return {
    code,
    arabicRoot,
    rootTranslit: rootTranslit || arabicRoot,
    occurrences: occurrences || totalWordVariations,
    formsCountDesc: formsCountDesc || `${derivedForms.length} derived forms`,
    derivedForms,
    derivations,
    sections,
    totalWordVariations,
    sourceUrl: `https://corpus.quran.com/qurandictionary.jsp?q=${encodeURIComponent(code)}`
  };
}

// ---------------- API ROUTES ----------------

// GET /api/roots - get list of roots with search & filter
app.get('/api/roots', (req: Request, res: Response) => {
  const { q, letter, sort } = req.query;
  let filtered = [...allRootsList];

  if (letter && typeof letter === 'string' && letter !== 'all') {
    filtered = filtered.filter((r) => r.letter.toLowerCase() === letter.toLowerCase());
  }

  if (q && typeof q === 'string') {
    const query = q.trim().toLowerCase();
    filtered = filtered.filter((r) =>
      r.arabic.includes(query) ||
      r.cleanArabic.includes(query) ||
      r.code.toLowerCase().includes(query) ||
      (r.translitName && r.translitName.toLowerCase().includes(query)) ||
      (r.primaryGloss && r.primaryGloss.toLowerCase().includes(query))
    );
  }

  if (sort === 'occurrences') {
    filtered.sort((a, b) => (b.occurrences || 0) - (a.occurrences || 0));
  } else if (sort === 'arabic') {
    filtered.sort((a, b) => a.cleanArabic.localeCompare(b.cleanArabic, 'ar'));
  }

  res.json({
    totalCount: allRootsList.length,
    filteredCount: filtered.length,
    roots: filtered
  });
});

function synthesizeRootDetail(code: string): RootDetail {
  const cleanCode = code.replace(/%24/g, '$').replace(/%2A/g, '*').replace(/%3C/g, '<').replace(/%3E/g, '>');
  const rootSummary = (allRootsList as RootSummary[]).find((r) => r.code === code || r.code === cleanCode);
  const prominent = PROMINENT_ROOTS[cleanCode] || PROMINENT_ROOTS[code];

  const rootLetters = (rootSummary?.cleanArabic || rootSummary?.arabic || '').replace(/[\s\u064B-\u065F]/g, '');
  const matchingWords = fluentWordsList.filter((w) => {
    if (w.word && rootLetters.length >= 2) {
      const cleanW = (w.cleanArabic || w.word).replace(/[\s\u064B-\u065F]/g, '');
      let lastIdx = -1;
      let matchedAll = true;
      for (const char of rootLetters) {
        const idx = cleanW.indexOf(char, lastIdx + 1);
        if (idx === -1) {
          matchedAll = false;
          break;
        }
        lastIdx = idx;
      }
      return matchedAll;
    }
    return false;
  });

  const occurrences = prominent?.occurrences || rootSummary?.occurrences || (matchingWords.length > 0 ? matchingWords.reduce((sum, w) => sum + w.frequency, 0) : 1);
  const translit = prominent?.translit || rootSummary?.translitName || cleanCode;
  const meaning = prominent?.meaning || rootSummary?.primaryGloss || 'Quranic root';

  const variations: WordVariation[] = matchingWords.slice(0, 50).map((w, idx) => {
    const locParts = (w.sampleVerse?.location || '1:1').split(':');
    const chapter = parseInt(locParts[0], 10) || 1;
    const verse = parseInt(locParts[1], 10) || 1;
    return {
      location: w.sampleVerse ? `${chapter}:${verse}:${w.rank || idx + 1}` : `1:1:${idx + 1}`,
      chapter,
      verse,
      wordNumber: idx + 1,
      transliteration: w.transliteration,
      translation: w.meaning,
      targetWord: w.word,
      ayahText: w.sampleVerse?.text || w.word,
      grammarCategory: w.pos
    };
  });

  const sections: MorphologicalSection[] = [
    {
      heading: `Quranic Vocabulary Variations (${matchingWords.length})`,
      count: matchingWords.length,
      variations
    }
  ];

  return {
    code,
    arabicRoot: rootSummary?.arabic || cleanCode,
    rootTranslit: translit,
    occurrences,
    formsCountDesc: `${matchingWords.length} vocabulary forms identified`,
    derivedForms: [],
    derivations: [],
    sections,
    totalWordVariations: matchingWords.length,
    sourceUrl: `https://corpus.quran.com/qurandictionary.jsp?q=${encodeURIComponent(code)}`
  };
}

// GET /api/root/:code - get full root details, forms, and word occurrences
app.get('/api/root/:code', async (req: Request, res: Response) => {
  const code = req.params.code;
  if (!code) {
    return res.status(400).json({ error: 'Root code is required' });
  }

  // Check cache
  if (rootCache.has(code)) {
    return res.json(rootCache.get(code));
  }

  try {
    const targetUrl = `https://corpus.quran.com/qurandictionary.jsp?q=${encodeURIComponent(code)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const html = await response.text();
      const detail = parseCorpusHtml(code, html);

      // Update occurrences in memory root list if discovered
      const rootItem = allRootsList.find((r) => r.code === code);
      if (rootItem && detail.occurrences > 0) {
        rootItem.occurrences = detail.occurrences;
        if (detail.rootTranslit) rootItem.translitName = detail.rootTranslit;
      }

      // Save in cache
      rootCache.set(code, detail);
      return res.json(detail);
    }
  } catch (error: any) {
    console.warn(`Upstream fetch for root ${code} failed or timed out, using synthesized data:`, error?.message || error);
  }

  // Graceful fallback to local synthesized root detail
  const fallback = synthesizeRootDetail(code);
  rootCache.set(code, fallback);
  return res.json(fallback);
});

// POST /api/root-linguistics - Deep linguistic analysis with Gemini
app.post('/api/root-linguistics', async (req: Request, res: Response) => {
  const { rootCode, arabicRoot, rootTranslit, occurrences, derivedForms } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on server' });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const prompt = `Analyze the Quranic Arabic root: "${arabicRoot}" (${rootTranslit}, code: ${rootCode}).
Total Quranic occurrences: ${occurrences}.
Derived forms in the Quran: ${JSON.stringify(derivedForms || [])}.

Provide a classical linguistic and morphological breakdown strictly formatted as a valid JSON object matching this structure:
{
  "root": "${arabicRoot}",
  "coreSemanticMeaning": "Precise primary semantic essence in Classical Arabic (as defined in Lisān al-ʿArab / Taj al-ʿArūs)",
  "classicalLexicon": "Classical lexicographical insights, metaphorical extensions, and idiomatic usages",
  "formEvolution": [
    {
      "formName": "e.g. Form I / Form II / Noun / Active Participle",
      "pattern": "e.g. فَعَلَ / فَعَّلَ / مَفْعُول",
      "meaningInContext": "How the morphological pattern alters the root meaning in the Quranic text"
    }
  ],
  "thematicSignificance": "Thematic theological and rhetorical impact of this root across the Quran",
  "famousVerses": [
    {
      "citation": "Surah:Ayah (e.g. 2:255)",
      "arabicSample": "Short Arabic phrase with target word",
      "significance": "Why this usage of the root is central"
    }
  ]
}

Return ONLY the raw JSON without markdown formatting or code blocks.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const jsonText = response.text || '{}';
    const parsed = JSON.parse(jsonText);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error generating root linguistics:', error);
    res.status(500).json({ error: `Linguistic analysis failed: ${error.message}` });
  }
});

// GET /api/letters - get list of 28 Arabic letters with count of roots
app.get('/api/letters', (req: Request, res: Response) => {
  const lettersOrder = ['A', 'b', 't', 'v', 'j', 'H', 'x', 'd', '*', 'r', 'z', 's', '$', 'S', 'D', 'T', 'Z', 'E', 'g', 'f', 'q', 'k', 'l', 'm', 'n', 'h', 'w', 'y'];
  const stats = lettersOrder.map((l) => {
    const rootsForLetter = allRootsList.filter((r) => r.letter === l);
    const arabicSymbol = rootsForLetter[0]?.arabicLetter || l;
    return {
      letterCode: l,
      arabic: arabicSymbol,
      name: arabicLetterNames[l] || l,
      count: rootsForLetter.length
    };
  });
  res.json(stats);
});

// GET /api/semantic-domains - Get all semantic domains, optionally filtered by query
app.get('/api/semantic-domains', (req: Request, res: Response) => {
  const { q, domain, subcategory } = req.query;
  let domains: SemanticDomain[] = JSON.parse(JSON.stringify(SEMANTIC_DOMAINS));

  // Filter by domain id if specified
  if (domain && typeof domain === 'string' && domain !== 'all') {
    domains = domains.filter((d) => d.id.toLowerCase() === domain.toLowerCase());
  }

  // Filter by search query if specified
  if (q && typeof q === 'string' && q.trim()) {
    const query = q.toLowerCase().trim();
    domains = domains
      .map((d) => {
        const matchingSubcategories = d.subcategories
          .map((sub) => {
            const matchingWords = sub.words.filter(
              (w) =>
                w.word.toLowerCase().includes(query) ||
                w.cleanArabic.toLowerCase().includes(query) ||
                w.transliteration.toLowerCase().includes(query) ||
                w.meaning.toLowerCase().includes(query) ||
                w.root.toLowerCase().includes(query) ||
                w.rootArabic.toLowerCase().includes(query) ||
                w.grammarCategory.toLowerCase().includes(query)
            );
            return { ...sub, words: matchingWords };
          })
          .filter((sub) => sub.words.length > 0 || sub.name.toLowerCase().includes(query) || sub.nameArabic.includes(query));

        const wordsCount = matchingSubcategories.reduce((acc, sub) => acc + sub.words.length, 0);
        return {
          ...d,
          subcategories: matchingSubcategories,
          totalWordsCount: wordsCount
        };
      })
      .filter((d) => d.subcategories.length > 0 || d.name.toLowerCase().includes(query) || d.nameArabic.includes(query));
  }

  // Filter by subcategory id if specified
  if (subcategory && typeof subcategory === 'string' && subcategory !== 'all') {
    domains = domains.map((d) => ({
      ...d,
      subcategories: d.subcategories.filter((s) => s.id.toLowerCase() === subcategory.toLowerCase())
    })).filter((d) => d.subcategories.length > 0);
  }

  res.json({
    domains,
    totalDomains: domains.length,
    totalWords: domains.reduce((sum, d) => sum + d.totalWordsCount, 0)
  });
});

// GET /api/semantic-domain/:id - Get specific domain with full metadata
app.get('/api/semantic-domain/:id', (req: Request, res: Response) => {
  const domainId = req.params.id;
  const domain = SEMANTIC_DOMAINS.find((d) => d.id.toLowerCase() === domainId.toLowerCase());
  if (!domain) {
    return res.status(404).json({ error: `Semantic domain '${domainId}' not found` });
  }
  res.json(domain);
});

// GET /api/particles - Comprehensive catalog of all Quranic particles, prepositions, interjections, and conjunctions
app.get('/api/particles', (req: Request, res: Response) => {
  const { category, q } = req.query;
  let result = QURAN_PARTICLES;
  if (category && typeof category === 'string' && category !== 'all') {
    result = result.filter((p) => p.category === category || p.categoryTitle.toLowerCase().includes(category.toLowerCase()));
  }
  if (q && typeof q === 'string') {
    const query = q.toLowerCase().trim();
    result = result.filter((p) =>
      p.word.includes(query) ||
      p.transliteration.toLowerCase().includes(query) ||
      p.meaning.toLowerCase().includes(query) ||
      p.usageRule.toLowerCase().includes(query)
    );
  }
  res.json({
    particles: result,
    total: result.length,
    categories: [
      { id: 'all', title: 'All Particles (جميع الحروف والأدوات)', count: QURAN_PARTICLES.length },
      { id: 'preposition', title: 'Prepositions (حروف الجر والقسم)', count: QURAN_PARTICLES.filter((p) => p.category === 'preposition').length },
      { id: 'interjection', title: 'Interjections & Vocatives (حروف النداء وأسماء الأفعال)', count: QURAN_PARTICLES.filter((p) => p.category === 'interjection').length },
      { id: 'negative', title: 'Negation & Prohibition (حروف النفي والنهي)', count: QURAN_PARTICLES.filter((p) => p.category === 'negative').length },
      { id: 'conjunction', title: 'Conjunctions (حروف العطف)', count: QURAN_PARTICLES.filter((p) => p.category === 'conjunction').length },
      { id: 'conditional', title: 'Conditionals (أدوات الشرط)', count: QURAN_PARTICLES.filter((p) => p.category === 'conditional').length },
      { id: 'inna_sister', title: 'Inna & Sisters (إن وأخواتها)', count: QURAN_PARTICLES.filter((p) => p.category === 'inna_sister').length },
      { id: 'emphasis', title: 'Emphasis & Corroboration (حروف التوكيد)', count: QURAN_PARTICLES.filter((p) => p.category === 'emphasis').length },
      { id: 'interrogative', title: 'Interrogatives (أدوات الاستفهام)', count: QURAN_PARTICLES.filter((p) => p.category === 'interrogative').length },
      { id: 'exception', title: 'Exceptions (أدوات الاستثناء)', count: QURAN_PARTICLES.filter((p) => p.category === 'exception').length },
      { id: 'inceptive', title: 'Exclamation & Suddenness (حروف التنبيه والردع والفجاءة)', count: QURAN_PARTICLES.filter((p) => p.category === 'inceptive').length }
    ]
  });
});

// GET /api/parts-of-speech - Get all parts of speech categorized by 3 Arabic Primary Divisions (Ism, Fi'l, Harf)
app.get('/api/parts-of-speech', (req: Request, res: Response) => {
  res.json({
    primaryDivisions: PRIMARY_DIVISIONS,
    partsOfSpeech: PARTS_OF_SPEECH,
    totalPartsOfSpeech: PARTS_OF_SPEECH.length
  });
});

// GET /api/grammar-types - Get all grammar types with metadata and occurrence stats (compatibility alias)
app.get('/api/grammar-types', (req: Request, res: Response) => {
  res.json({
    grammarTypes: PARTS_OF_SPEECH,
    totalGrammarTypes: PARTS_OF_SPEECH.length
  });
});

// GET /api/pos-words & /api/grammar-derivations - Get all words of a part of speech with word, meaning, frequency
const handlePosWords = async (req: Request, res: Response) => {
  const { pos, type, root, q } = req.query;
  const rawTarget = typeof pos === 'string' ? pos : typeof type === 'string' ? type : 'noun';
  const normId = normalizePartOfSpeechId(rawTarget);

  // Find info either from primary divisions or detailed parts of speech
  const primaryDiv = PRIMARY_DIVISIONS.find((d) => d.id === normId);
  const detailedPos = PARTS_OF_SPEECH.find((p) => p.id === normId);

  const typeInfo = detailedPos || (primaryDiv ? {
    id: primaryDiv.id,
    name: primaryDiv.name,
    nameArabic: primaryDiv.nameArabic,
    pattern: 'قسم الكلام الأصلي',
    categoryGroup: primaryDiv.id as any,
    primaryDivision: primaryDiv.id,
    description: primaryDiv.description,
    totalDerivations: primaryDiv.totalWordsEst,
    totalOccurrences: primaryDiv.totalOccurrencesEst
  } : PARTS_OF_SPEECH[0]);

  // Start with words for this part of speech (broad division or specific category)
  let derivations: RootDerivation[] = JSON.parse(JSON.stringify(getWordsForPartOfSpeech(normId)));

  // If a specific root was requested, also include derivations from that root if available in cache
  if (root && typeof root === 'string' && rootCache.has(root)) {
    const cached = rootCache.get(root)!;
    const rootMatches = (cached.derivations || []).filter((d) => {
      const dNorm = normalizePartOfSpeechId(d.grammarCategory);
      if (normId === 'noun') {
        return ['noun', 'proper-noun', 'verbal-noun', 'active-participle', 'passive-participle', 'adjective', 'noun-place-time'].includes(dNorm);
      }
      if (normId === 'verb') {
        return dNorm.startsWith('verb');
      }
      if (normId === 'particle') {
        return dNorm === 'particle' || dNorm === 'preposition' || dNorm === 'interjection';
      }
      if (normId === 'preposition') {
        return dNorm === 'preposition' || d.grammarCategory?.toLowerCase().includes('preposition') || d.grammarCategory?.includes('حرف جر');
      }
      if (normId === 'interjection') {
        return dNorm === 'interjection' || d.grammarCategory?.toLowerCase().includes('interjection') || d.grammarCategory?.toLowerCase().includes('vocative');
      }
      return dNorm === normId;
    });
    // Merge without duplicates by id
    const existingIds = new Set(derivations.map((d) => d.id));
    for (const d of rootMatches) {
      if (!existingIds.has(d.id)) {
        derivations.push({
          ...d,
          root: cached.code,
          rootArabic: cached.arabicRoot
        });
        existingIds.add(d.id);
      }
    }
  }

  // Also harvest any matching words from semantic domains as derivations if not present
  for (const domain of SEMANTIC_DOMAINS) {
    for (const sub of domain.subcategories) {
      for (const w of sub.words) {
        const wNorm = normalizePartOfSpeechId(w.grammarCategory);
        let matches = false;
        if (normId === 'noun') {
          matches = ['noun', 'proper-noun', 'verbal-noun', 'active-participle', 'passive-participle', 'adjective', 'noun-place-time'].includes(wNorm);
        } else if (normId === 'verb') {
          matches = wNorm.startsWith('verb');
        } else if (normId === 'particle') {
          matches = wNorm === 'particle' || wNorm === 'preposition' || wNorm === 'interjection';
        } else if (normId === 'preposition') {
          matches = wNorm === 'preposition' || w.grammarCategory?.toLowerCase().includes('preposition');
        } else if (normId === 'interjection') {
          matches = wNorm === 'interjection' || w.grammarCategory?.toLowerCase().includes('interjection') || w.grammarCategory?.toLowerCase().includes('vocative');
        } else {
          matches = wNorm === normId;
        }

        if (matches) {
          const wId = `${w.root}_${w.cleanArabic}_${wNorm}`;
          if (!derivations.some((d) => d.id === wId || d.word === w.word)) {
            derivations.push({
              id: wId,
              root: w.root,
              rootArabic: w.rootArabic,
              word: w.word,
              transliteration: w.transliteration,
              prefix: '—',
              suffix: '—',
              grammarCategory: w.grammarCategory,
              meaning: w.meaning,
              frequency: w.frequency,
              semanticRole: w.semanticRole,
              examples: w.sampleVerse ? [w.sampleVerse.location] : [],
              occurrences: w.sampleVerse ? [
                {
                  location: w.sampleVerse.location,
                  chapter: parseInt(w.sampleVerse.location.split(':')[0], 10) || 1,
                  verse: parseInt(w.sampleVerse.location.split(':')[1], 10) || 1,
                  wordNumber: parseInt(w.sampleVerse.location.split(':')[2], 10) || 1,
                  surahName: w.sampleVerse.surahName || 'Quran',
                  targetWord: w.word,
                  transliteration: w.transliteration,
                  translation: w.meaning,
                  ayahText: w.sampleVerse.text,
                  audioUrl: `https://everyayah.com/data/Alafasy_128kbps/${String(parseInt(w.sampleVerse.location.split(':')[0], 10) || 1).padStart(3, '0')}${String(parseInt(w.sampleVerse.location.split(':')[1], 10) || 1).padStart(3, '0')}.mp3`,
                  prefix: '—',
                  suffix: '—',
                  grammarCategory: w.grammarCategory
                }
              ] : []
            });
          }
        }
      }
    }
  }

  // Filter by root if provided
  if (root && typeof root === 'string' && root.trim() !== '' && root !== 'all') {
    const rootQuery = root.trim().toLowerCase();
    derivations = derivations.filter((d) => (d.root && d.root.toLowerCase() === rootQuery) || (d.rootArabic && d.rootArabic.includes(rootQuery)));
  }

  // Filter by search query if provided
  if (q && typeof q === 'string' && q.trim()) {
    const query = q.toLowerCase().trim();
    derivations = derivations.filter((d) =>
      d.word.includes(query) ||
      d.transliteration.toLowerCase().includes(query) ||
      d.meaning.toLowerCase().includes(query) ||
      d.prefix.toLowerCase().includes(query) ||
      d.suffix.toLowerCase().includes(query) ||
      (d.root && d.root.toLowerCase().includes(query)) ||
      (d.rootArabic && d.rootArabic.includes(query))
    );
  }

  // Sort by frequency descending
  derivations.sort((a, b) => b.frequency - a.frequency);

  res.json({
    partOfSpeech: typeInfo,
    grammarType: typeInfo,
    words: derivations,
    derivations,
    totalCount: derivations.length,
    totalFrequency: derivations.reduce((sum, d) => sum + d.frequency, 0)
  });
};

app.get('/api/pos-words', handlePosWords);
app.get('/api/grammar-derivations', handlePosWords);

// ---------------- FLUENT ARABIC FREQUENCY LIST APIS ----------------

// GET /api/fluent-words/stats - Return aggregate statistics
app.get('/api/fluent-words/stats', (req: Request, res: Response) => {
  const nounCount = fluentWordsList.filter(w => w.primaryDivision === 'noun').length;
  const nounOccurrences = fluentWordsList.filter(w => w.primaryDivision === 'noun').reduce((acc, w) => acc + w.frequency, 0);
  const verbCount = fluentWordsList.filter(w => w.primaryDivision === 'verb').length;
  const verbOccurrences = fluentWordsList.filter(w => w.primaryDivision === 'verb').reduce((acc, w) => acc + w.frequency, 0);
  const particleCount = fluentWordsList.filter(w => w.primaryDivision === 'particle').length;
  const particleOccurrences = fluentWordsList.filter(w => w.primaryDivision === 'particle').reduce((acc, w) => acc + w.frequency, 0);
  const totalOccurrences = fluentWordsList.reduce((acc, w) => acc + w.frequency, 0);

  const primaryDivisions = [
    { id: 'noun', name: 'Nouns (Ism)', nameArabic: 'الاسم', count: nounCount || 3531, occurrences: nounOccurrences },
    { id: 'verb', name: 'Verbs (Fi‘l)', nameArabic: 'الفعل', count: verbCount || 1541, occurrences: verbOccurrences },
    { id: 'particle', name: 'Particles (Harf)', nameArabic: 'الحرف', count: particleCount || 83, occurrences: particleOccurrences }
  ];

  const milestones = [
    { label: 'Top 500', count: 500, coveragePercent: 78.4, desc: 'Covers ~78% of Quranic text' },
    { label: 'Top 1000', count: 1000, coveragePercent: 86.8, desc: 'Covers ~87% of Quranic text' },
    { label: 'Top 2000', count: 2000, coveragePercent: 93.5, desc: 'Covers ~94% of Quranic text' },
    { label: 'All 5,155', count: fluentWordsList.length, coveragePercent: 100.0, desc: '100% complete vocabulary' }
  ];

  res.json({
    ...(fluentStatsData || {}),
    totalWords: fluentWordsList.length || 5155,
    totalOccurrences,
    primaryDivisions,
    milestones,
    source: 'Fluent Arabic Quran Frequency List & Corpus Quran Morphology',
    sourceSpreadsheet: 'Quran-All-Words.xlsx'
  });
});

// GET /api/vocab/download - Complete vocabulary bundle for client-side local caching & offline storage
app.get(['/api/vocab/download', '/api/vocab/bundle'], (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.json({
    words: fluentWordsList,
    stats: fluentStatsData,
    totalWords: fluentWordsList.length,
    rootsCount: allRootsList.length,
    version: '1.0.0',
    exportedAt: new Date().toISOString()
  });
});

// GET /api/fluent-words - Query and filter words list
app.get('/api/fluent-words', (req: Request, res: Response) => {
  const {
    q,
    search,
    pos,
    primaryDivision,
    semanticDomain,
    maxRank,
    minRank,
    minFreq,
    sort = 'rank',
    direction = 'asc',
    page = '1',
    limit = '100'
  } = req.query;

  let results = [...fluentWordsList];

  // 1. Text Search across Arabic, cleanArabic, transliteration, meaning
  const queryStr = ((q || search || '') as string).trim().toLowerCase();
  if (queryStr) {
    results = results.filter((w) =>
      w.word.includes(queryStr) ||
      w.cleanArabic.includes(queryStr) ||
      w.transliteration.toLowerCase().includes(queryStr) ||
      w.meaning.toLowerCase().includes(queryStr) ||
      w.pos.toLowerCase().includes(queryStr) ||
      w.posArabic.includes(queryStr)
    );
  }

  // 2. Primary Division (noun, verb, particle)
  if (primaryDivision && typeof primaryDivision === 'string' && primaryDivision !== 'all') {
    results = results.filter((w) => w.primaryDivision === primaryDivision);
  }

  // 3. Specific Part of Speech
  if (pos && typeof pos === 'string' && pos !== 'all') {
    const posLower = pos.toLowerCase();
    results = results.filter((w) => w.pos.toLowerCase() === posLower || w.posArabic === pos);
  }

  // 3b. Specific POS Category (noun, proper_noun, adjective, verb, particle)
  const { posCategory } = req.query;
  if (posCategory && typeof posCategory === 'string' && posCategory !== 'all') {
    const catLower = posCategory.toLowerCase().replace('-', '_');
    results = results.filter((w) => w.posCategory === catLower);
  }

  // 4. Semantic Domain
  if (semanticDomain && typeof semanticDomain === 'string' && semanticDomain !== 'all') {
    results = results.filter((w) => w.semanticDomain === semanticDomain);
  }

  // 4b. Semantic Cluster (semantically close sub-group)
  const { semanticCluster } = req.query;
  if (semanticCluster && typeof semanticCluster === 'string' && semanticCluster !== 'all') {
    results = results.filter((w) => w.semanticCluster === semanticCluster);
  }

  // 5. Rank range (e.g. Top 50, Top 100, Top 300, Top 500)
  if (maxRank) {
    const max = parseInt(maxRank as string, 10);
    if (!isNaN(max) && max > 0) {
      results = results.filter((w) => w.rank <= max);
    }
  }
  if (minRank) {
    const min = parseInt(minRank as string, 10);
    if (!isNaN(min) && min > 0) {
      results = results.filter((w) => w.rank >= min);
    }
  }

  // 6. Minimum frequency
  if (minFreq) {
    const minF = parseInt(minFreq as string, 10);
    if (!isNaN(minF) && minF > 0) {
      results = results.filter((w) => w.frequency >= minF);
    }
  }

  // 7. Sorting
  const isDesc = direction === 'desc';
  if (sort === 'frequency') {
    results.sort((a, b) => isDesc ? b.frequency - a.frequency : a.frequency - b.frequency);
  } else if (sort === 'word' || sort === 'alphabetical') {
    results.sort((a, b) => isDesc ? b.cleanArabic.localeCompare(a.cleanArabic, 'ar') : a.cleanArabic.localeCompare(b.cleanArabic, 'ar'));
  } else if (sort === 'pos') {
    results.sort((a, b) => isDesc ? b.pos.localeCompare(a.pos) : a.pos.localeCompare(b.pos));
  } else if (sort === 'semantic') {
    results.sort((a, b) => {
      const semA = a.semanticDomain || '';
      const semB = b.semanticDomain || '';
      return isDesc ? semB.localeCompare(semA) : semA.localeCompare(semB);
    });
  } else {
    // Default: by rank
    results.sort((a, b) => isDesc ? b.rank - a.rank : a.rank - b.rank);
  }

  const totalCount = results.length;
  const totalOccurrences = results.reduce((sum, w) => sum + w.frequency, 0);

  // 8. Pagination
  const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
  const limitNum = parseInt(limit as string, 10);

  let paginatedWords: FluentQuranWord[] = results;
  let totalPages = 1;

  if (limitNum > 0) {
    totalPages = Math.ceil(totalCount / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    paginatedWords = results.slice(startIndex, startIndex + limitNum);
  }

  res.json({
    words: paginatedWords,
    totalCount,
    totalOccurrences,
    page: pageNum,
    limit: limitNum,
    totalPages,
    source: 'Fluent Arabic Quran Frequency List (https://fluentarabic.net/quran-frequency-list/)'
  });
});

// GET /api/fluent-words/by-pos - Grouped by Part of Speech
app.get('/api/fluent-words/by-pos', (req: Request, res: Response) => {
  const { primaryDivision } = req.query;

  const groupsMap = new Map<string, {
    pos: string;
    posArabic: string;
    posTitle: string;
    primaryDivision: 'noun' | 'verb' | 'particle';
    totalWords: number;
    totalOccurrences: number;
    topWords: FluentQuranWord[];
  }>();

  for (const w of fluentWordsList) {
    if (primaryDivision && primaryDivision !== 'all' && w.primaryDivision !== primaryDivision) {
      continue;
    }

    let grp = groupsMap.get(w.pos);
    if (!grp) {
      grp = {
        pos: w.pos,
        posArabic: w.posArabic,
        posTitle: w.posTitle,
        primaryDivision: w.primaryDivision,
        totalWords: 0,
        totalOccurrences: 0,
        topWords: []
      };
      groupsMap.set(w.pos, grp);
    }

    grp.totalWords += 1;
    grp.totalOccurrences += w.frequency;
    if (grp.topWords.length < 15) {
      grp.topWords.push(w);
    }
  }

  const groups = Array.from(groupsMap.values()).sort((a, b) => b.totalOccurrences - a.totalOccurrences);

  res.json({
    groups,
    totalCategories: groups.length,
    totalWords: groups.reduce((acc, g) => acc + g.totalWords, 0),
    totalOccurrences: groups.reduce((acc, g) => acc + g.totalOccurrences, 0)
  });
});

// GET /api/fluent-words/by-semantic - Grouped Semantically (Only Nouns except pronouns, Proper Nouns, Adjectives, Verbs)
app.get('/api/fluent-words/by-semantic', (req: Request, res: Response) => {
  const { posCategory, limit } = req.query;
  const targetCategory = typeof posCategory === 'string' && posCategory !== 'all' 
    ? posCategory.toLowerCase().replace('-', '_') 
    : null;
  const wordLimit = Math.min(100, parseInt(limit as string, 10) || 40);

  const groupsMap = new Map<string, {
    domainId: string;
    domainName: string;
    domainArabic: string;
    totalWords: number;
    totalOccurrences: number;
    clusters: Record<string, {
      clusterId: string;
      clusterName: string;
      clusterArabic: string;
      count: number;
      occurrences: number;
      words: FluentQuranWord[];
    }>;
    categories: {
      proper_noun: { name: string; nameArabic: string; count: number; occurrences: number; words: FluentQuranWord[] };
      noun: { name: string; nameArabic: string; count: number; occurrences: number; words: FluentQuranWord[] };
      adjective: { name: string; nameArabic: string; count: number; occurrences: number; words: FluentQuranWord[] };
      verb: { name: string; nameArabic: string; count: number; occurrences: number; words: FluentQuranWord[] };
    };
    topWords: FluentQuranWord[];
  }>();

  for (const w of fluentWordsList) {
    // Only group semantically: Nouns (excluding pronouns), Proper Nouns, Adjectives, and Verbs
    if (!w.semanticDomain) {
      continue;
    }
    const cat = w.posCategory;
    if (!cat || !['proper_noun', 'noun', 'adjective', 'verb'].includes(cat)) {
      continue;
    }

    if (targetCategory && cat !== targetCategory) {
      continue;
    }

    let grp = groupsMap.get(w.semanticDomain);
    if (!grp) {
      grp = {
        domainId: w.semanticDomain,
        domainName: w.semanticDomainName || w.semanticDomain,
        domainArabic: w.semanticDomainArabic || '',
        totalWords: 0,
        totalOccurrences: 0,
        clusters: {},
        categories: {
          proper_noun: { name: 'Proper Nouns', nameArabic: 'أسماء الأعلام', count: 0, occurrences: 0, words: [] },
          noun: { name: 'Nouns', nameArabic: 'الأسماء', count: 0, occurrences: 0, words: [] },
          adjective: { name: 'Adjectives & Attributes', nameArabic: 'الصفات والنعوت', count: 0, occurrences: 0, words: [] },
          verb: { name: 'Verbs & Actions', nameArabic: 'الأفعال', count: 0, occurrences: 0, words: [] }
        },
        topWords: []
      };
      groupsMap.set(w.semanticDomain, grp);
    }

    grp.totalWords += 1;
    grp.totalOccurrences += w.frequency;

    // Sub-group into semantically close cluster
    if (w.semanticCluster) {
      if (!grp.clusters[w.semanticCluster]) {
        grp.clusters[w.semanticCluster] = {
          clusterId: w.semanticCluster,
          clusterName: w.semanticClusterName || w.semanticCluster,
          clusterArabic: w.semanticClusterArabic || '',
          count: 0,
          occurrences: 0,
          words: []
        };
      }
      const cl = grp.clusters[w.semanticCluster];
      cl.count += 1;
      cl.occurrences += w.frequency;
      if (cl.words.length < wordLimit) {
        cl.words.push(w);
      }
    }

    const catKey = cat as 'proper_noun' | 'noun' | 'adjective' | 'verb';
    if (grp.categories[catKey]) {
      grp.categories[catKey].count += 1;
      grp.categories[catKey].occurrences += w.frequency;
      if (grp.categories[catKey].words.length < wordLimit) {
        grp.categories[catKey].words.push(w);
      }
    }

    if (grp.topWords.length < 20) {
      grp.topWords.push(w);
    }
  }

  const domains = Array.from(groupsMap.values()).sort((a, b) => b.totalOccurrences - a.totalOccurrences);

  res.json({
    domains,
    totalDomains: domains.length,
    totalWords: domains.reduce((acc, d) => acc + d.totalWords, 0),
    totalOccurrences: domains.reduce((acc, d) => acc + d.totalOccurrences, 0)
  });
});

// Global Error Handler so Express never crashes or leaves connection hanging
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('API Error:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: err?.message || 'Internal Server Error' });
  }
});


export default app;
export { app };
