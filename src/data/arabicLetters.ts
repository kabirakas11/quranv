import type { RootSummary } from '../types.ts';
import allRootsData from './allRoots.json';

export interface LetterStat {
  letterCode: string;
  arabic: string;
  name: string;
  count: number;
}

// Arabic letter name mapping
export const ARABIC_LETTER_NAMES: Record<string, string> = {
  A: 'Alif (أ)', b: 'Ba (ب)', t: 'Ta (ت)', v: 'Tha (ث)', j: 'Jim (ج)', H: 'Ha (ح)',
  x: 'Kha (خ)', d: 'Dal (د)', '*': 'Dhal (ذ)', r: 'Ra (ر)', z: 'Zay (ز)', s: 'Sin (س)',
  $: 'Shin (ش)', S: 'Sad (ص)', D: 'Dad (ض)', T: 'Ta (ط)', Z: 'Za (ظ)', E: '\'Ayn (ع)',
  g: 'Ghayn (غ)', f: 'Fa (ف)', q: 'Qaf (ق)', k: 'Kaf (ك)', l: 'Lam (ل)', m: 'Mim (م)',
  n: 'Nun (ن)', h: 'Ha (ه)', w: 'Waw (و)', y: 'Ya (ي)'
};

export const LETTERS_ORDER = [
  'A', 'b', 't', 'v', 'j', 'H', 'x', 'd', '*', 'r', 'z', 's',
  '$', 'S', 'D', 'T', 'Z', 'E', 'g', 'f', 'q', 'k', 'l', 'm',
  'n', 'h', 'w', 'y'
];

export const PROMINENT_ROOTS: Record<string, { occurrences: number; translit: string; meaning: string }> = {
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

// Compute letter statistics from a list of roots (or pre-bundled roots)
export function computeLetterStats(rootsList: RootSummary[] = allRootsData as RootSummary[]): LetterStat[] {
  return LETTERS_ORDER.map((letterCode) => {
    const matching = rootsList.filter((r) => r.letter === letterCode);
    const arabicSymbol = matching[0]?.arabicLetter || letterCode;
    return {
      letterCode,
      arabic: arabicSymbol,
      name: ARABIC_LETTER_NAMES[letterCode] || letterCode,
      count: matching.length
    };
  });
}
