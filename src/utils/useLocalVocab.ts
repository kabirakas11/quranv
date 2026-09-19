import { useState, useEffect } from 'react';
import { localVocabStore } from './localVocabStore.ts';

export function useLocalVocab() {
  const [status, setStatus] = useState(() => localVocabStore.getStatus());

  useEffect(() => {
    // Subscribe to changes in localVocabStore
    const unsubscribe = localVocabStore.subscribe(() => {
      setStatus(localVocabStore.getStatus());
    });
    return unsubscribe;
  }, []);

  return {
    ...status,
    syncFromBackend: (force?: boolean) => localVocabStore.syncFromBackend(force),
    exportJson: () => localVocabStore.exportCompleteVocabJson(),
    exportCsv: () => localVocabStore.exportVocabCsv(),
    clearCache: () => localVocabStore.clearLocalCache()
  };
}
