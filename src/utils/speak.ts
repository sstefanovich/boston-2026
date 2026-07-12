import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

export type SpeakLang = 'fr-FR' | 'nl-NL' | 'en-US';

function cleanPhraseText(text: string): string {
  return text
    .replace(/\s*\(.*?\)\s*/g, ' ')
    .replace(/…/g, '')
    .replace(/\?/g, '?')
    .trim();
}

function hasWebSpeech(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/** Whether TTS is available (Web Speech API or native Android/iOS). */
export function canSpeak(): boolean {
  return Capacitor.isNativePlatform() || hasWebSpeech();
}

async function speakNative(text: string, lang: SpeakLang): Promise<boolean> {
  try {
    await TextToSpeech.stop();
    await TextToSpeech.speak({
      text,
      lang,
      rate: 0.82,
      pitch: 1.0,
      volume: 1.0,
    });
    return true;
  } catch {
    return false;
  }
}

function speakWeb(text: string, lang: SpeakLang): boolean {
  if (!hasWebSpeech()) return false;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.82;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
  return true;
}

/** Speak phrase using native TTS on mobile, Web Speech API in the browser. */
export async function speakPhrase(text: string, lang: SpeakLang): Promise<boolean> {
  const cleaned = cleanPhraseText(text);
  if (!cleaned) return false;

  if (Capacitor.isNativePlatform()) {
    return speakNative(cleaned, lang);
  }

  return speakWeb(cleaned, lang);
}
