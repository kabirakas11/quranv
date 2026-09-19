import React from 'react';
import { PartsOfSpeechBrowser } from './PartsOfSpeechBrowser.tsx';

interface GrammarBrowserProps {
  onSelectRoot?: (rootCode: string) => void;
  activeAudioUrl?: string | null;
  onPlayAudio?: (url: string) => void;
  onStopAudio?: () => void;
  initialGrammarType?: string | null;
}

/**
 * GrammarBrowser is updated to wrap the classical Parts of Speech Browser (أقسام الكلام)
 * maintaining full backwards compatibility.
 */
export const GrammarBrowser: React.FC<GrammarBrowserProps> = ({
  onSelectRoot,
  activeAudioUrl,
  onPlayAudio,
  onStopAudio,
  initialGrammarType
}) => {
  return (
    <PartsOfSpeechBrowser
      onSelectRoot={onSelectRoot}
      activeAudioUrl={activeAudioUrl}
      onPlayAudio={onPlayAudio}
      onStopAudio={onStopAudio}
      initialPartOfSpeech={initialGrammarType}
    />
  );
};

export default GrammarBrowser;
