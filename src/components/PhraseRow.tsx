import type { Phrase } from '../data/content';
import { speakPhrase, type SpeakLang } from '../utils/speak';

interface PhraseRowProps {
  phrase: Phrase;
  lang: SpeakLang;
}

export function PhraseRow({ phrase, lang }: PhraseRowProps) {
  const handleSpeak = async () => {
    const ok = await speakPhrase(phrase.foreign, phrase.speakLang ?? lang);
    if (!ok) {
      alert(
        'Voice not available on this device. On Android, install English (US) in Settings → System → Languages → Text-to-speech.'
      );
    }
  };

  return (
    <div className="phrase-row">
      <div className="phrase-main">
        <span className="phrase-fr">{phrase.foreign}</span>
        <span className="phrase-sounds">{phrase.sounds}</span>
        <span className="phrase-en">{phrase.english}</span>
      </div>
      <button
        type="button"
        className="btn btn-speak"
        onClick={() => void handleSpeak()}
        aria-label={`Listen: ${phrase.foreign}`}
        title="Listen"
      >
        🔊
      </button>
    </div>
  );
}
