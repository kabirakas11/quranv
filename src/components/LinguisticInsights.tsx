import React, { useState } from 'react';
import type { LinguisticInsight, RootDetail } from '../types.ts';
import { Sparkles, BookMarked, Layers, Compass, Quote, Loader2, AlertCircle } from 'lucide-react';

interface LinguisticInsightsProps {
  rootDetail: RootDetail;
}

export const LinguisticInsights: React.FC<LinguisticInsightsProps> = ({ rootDetail }) => {
  const [insight, setInsight] = useState<LinguisticInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/root-linguistics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rootCode: rootDetail.code,
          arabicRoot: rootDetail.arabicRoot,
          rootTranslit: rootDetail.rootTranslit,
          occurrences: rootDetail.occurrences,
          derivedForms: rootDetail.derivedForms.map((d) => d.text)
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setInsight(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate linguistic analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800 mb-5">
        <div>
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Classical Arabic Lexicography & Morphological Analysis</span>
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Deep morphological patterns, root etymology (Lisān al-ʿArab), and semantic shifts powered by Gemini AI
          </p>
        </div>

        <button
          onClick={fetchInsights}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-all cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing Root...</span>
            </>
          ) : insight ? (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Re-Analyze Root</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate AI Morphological Insight</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2 mb-4">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!insight && !loading && (
        <div className="text-center py-8 px-4 bg-stone-50 dark:bg-stone-950/40 rounded-xl border border-dashed border-stone-200 dark:border-stone-800">
          <BookMarked className="w-8 h-8 mx-auto text-amber-500/70 mb-2" />
          <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-200">
            Explore Classical Semantic Nuances for Root {rootDetail.arabicRoot}
          </h4>
          <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-4">
            Uncover the primordial desert meaning of this triliteral root, how grammatical forms alter its meaning across Quranic contexts, and theological resonances.
          </p>
          <button
            onClick={fetchInsights}
            className="px-4 py-2 rounded-lg bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 dark:hover:bg-stone-700 text-stone-100 text-xs font-medium transition-colors"
          >
            Start Linguistic Analysis
          </button>
        </div>
      )}

      {loading && (
        <div className="py-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-500 mb-3" />
          <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
            Consulting classical Arabic morphological lexicons...
          </p>
          <p className="text-xs text-stone-500 mt-1">
            Analyzing {rootDetail.occurrences} occurrences and {rootDetail.derivedForms.length} derived variations
          </p>
        </div>
      )}

      {insight && !loading && (
        <div className="space-y-5">
          {/* Core Meaning & Classical Lexicon */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-stone-50 dark:bg-stone-950/60 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-400 font-semibold text-xs uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                <span>Core Semantic Essence (الأَصْل الدَّلَالِيّ)</span>
              </div>
              <p className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
                {insight.coreSemanticMeaning}
              </p>
            </div>

            <div className="bg-stone-50 dark:bg-stone-950/60 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-400 font-semibold text-xs uppercase tracking-wider">
                <BookMarked className="w-4 h-4" />
                <span>Classical Lexicography (المَعَاجِم القَدِيمَة)</span>
              </div>
              <p className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
                {insight.classicalLexicon}
              </p>
            </div>
          </div>

          {/* Morphological Evolution Across Forms */}
          {insight.formEvolution && insight.formEvolution.length > 0 && (
            <div className="bg-stone-50 dark:bg-stone-950/60 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2 mb-3 text-emerald-700 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>Morphological Patterns & Semantic Shifts (تَصْرِيف الأَبْوَاب والأَوْزَان)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {insight.formEvolution.map((fe, i) => (
                  <div key={i} className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        {fe.formName}
                      </span>
                      <span className="font-arabic font-bold text-amber-600 dark:text-amber-400 text-sm">
                        {fe.pattern}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-normal">
                      {fe.meaningInContext}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Thematic Significance */}
          {insight.thematicSignificance && (
            <div className="bg-stone-50 dark:bg-stone-950/60 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2 mb-2 text-stone-700 dark:text-stone-300 font-semibold text-xs uppercase tracking-wider">
                <Quote className="w-4 h-4 text-amber-500" />
                <span>Thematic & Rhetorical Dimension in the Quran</span>
              </div>
              <p className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
                {insight.thematicSignificance}
              </p>
            </div>
          )}

          {/* Famous Verses */}
          {insight.famousVerses && insight.famousVerses.length > 0 && (
            <div className="bg-stone-50 dark:bg-stone-950/60 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-3">
                Key Quranic Verses Exemplifying Derived Variations
              </div>
              <div className="space-y-2.5">
                {insight.famousVerses.map((fv, idx) => (
                  <div key={idx} className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <span className="inline-block text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 mb-1">
                        Surah {fv.citation}
                      </span>
                      <p className="text-xs text-stone-600 dark:text-stone-400">
                        {fv.significance}
                      </p>
                    </div>
                    {fv.arabicSample && (
                      <span className="font-arabic text-base font-bold text-amber-700 dark:text-amber-300 sm:text-right shrink-0">
                        {fv.arabicSample}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
