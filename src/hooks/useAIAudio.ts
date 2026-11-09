import { useState, useEffect, useRef, useCallback } from 'react';
import { normalizeUnicode } from '../utils/unicode.ts';

export interface UseAIAudioProps {
  vietnameseText: string;
  englishText: string;
  onFinished?: () => void;
  onStarted?: () => void;
}

export function useAIAudio({
  vietnameseText,
  englishText,
  onFinished,
  onStarted
}: UseAIAudioProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [gender, setGender] = useState<'female' | 'male'>('female');
  const [rate, setRate] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(1.0);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number>(-1);
  const [supported, setSupported] = useState<boolean>(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Unicode NFC normalized text
  const currentRawText = language === 'vi' ? (vietnameseText || '') : (englishText || '');
  const currentText = normalizeUnicode(currentRawText);

  // Split text into readable sentences while keeping proper punctuation
  const sentences = currentText
    ? currentText
        .split(/(?<=[.!?。])\s+|\n+/)
        .map(s => s.trim())
        .filter(s => s.length > 0)
    : [];

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const sentenceQueueIndexRef = useRef<number>(0);
  const isStoppingRef = useRef<boolean>(false);

  // Load available voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSupported(false);
      return;
    }

    const updateVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length > 0) {
        setVoices(available);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Stop playback when component unmounts or text changes
  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      isStoppingRef.current = true;
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setActiveSentenceIndex(-1);
      sentenceQueueIndexRef.current = 0;
      setTimeout(() => {
        isStoppingRef.current = false;
      }, 50);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  // Pick suitable voice based on language and preferred gender
  const pickVoice = useCallback((lang: 'vi' | 'en', prefGender: 'female' | 'male') => {
    let pool = voices;
    if ((!pool || pool.length === 0) && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      pool = window.speechSynthesis.getVoices();
    }
    if (!pool || pool.length === 0) return null;

    const langPrefix = lang === 'vi' ? 'vi' : 'en';
    const langVoices = pool.filter(v => v.lang.toLowerCase().startsWith(langPrefix));

    if (langVoices.length === 0) {
      // Fallback to any voice with matching prefix
      return pool.find(v => v.lang.toLowerCase().includes(langPrefix)) || null;
    }

    // Try gender matching
    if (lang === 'vi') {
      const femaleKeywords = ['female', 'hoaimy', 'linh', 'mai', 'lan', 'nu', 'vietnamese female', 'google tiếng việt'];
      const maleKeywords = ['male', 'namminh', 'nam', 'vietnamese male'];

      const targetKeywords = prefGender === 'female' ? femaleKeywords : maleKeywords;
      const matched = langVoices.find(v =>
        targetKeywords.some(kw => v.name.toLowerCase().includes(kw))
      );
      if (matched) return matched;
      return langVoices[0];
    } else {
      const femaleKeywords = ['female', 'samantha', 'zira', 'jenny', 'karen', 'victoria', 'google us english'];
      const maleKeywords = ['male', 'david', 'george', 'guy', 'daniel'];

      const targetKeywords = prefGender === 'female' ? femaleKeywords : maleKeywords;
      const matched = langVoices.find(v =>
        targetKeywords.some(kw => v.name.toLowerCase().includes(kw))
      );
      if (matched) return matched;
      return langVoices[0];
    }
  }, [voices]);

  // Play next sentence in queue
  const playSentenceAtIndex = useCallback((index: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (index >= sentences.length) {
      setIsPlaying(false);
      setIsPaused(false);
      setActiveSentenceIndex(-1);
      onFinished?.();
      return;
    }

    // Unpause in case browser paused speech synthesis
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const sentence = sentences[index];
    sentenceQueueIndexRef.current = index;
    setActiveSentenceIndex(index);

    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = language === 'vi' ? 'vi-VN' : 'en-US';
    utterance.rate = rate;
    utterance.volume = volume;

    const chosenVoice = pickVoice(language, gender);
    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    utterance.onend = () => {
      if (isStoppingRef.current) return;
      playSentenceAtIndex(index + 1);
    };

    utterance.onerror = (e) => {
      console.warn('TTS sentence error:', e);
      if (isStoppingRef.current) return;
      playSentenceAtIndex(index + 1);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [sentences, language, rate, volume, gender, pickVoice, onFinished]);

  // Main start/play function
  const play = useCallback((fromSentenceIndex: number = 0) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn hiện chưa hỗ trợ Web Speech API.');
      return;
    }

    // Cancel any ongoing speech globally
    window.speechSynthesis.cancel();
    isStoppingRef.current = false;
    setIsPlaying(true);
    setIsPaused(false);
    onStarted?.();

    const startIdx = Math.max(0, Math.min(fromSentenceIndex, sentences.length - 1));
    playSentenceAtIndex(startIdx);
  }, [sentences.length, onStarted, playSentenceAtIndex]);

  // Pause
  const pause = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isPlaying]);

  // Resume
  const resume = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else if (!isPlaying) {
      play(sentenceQueueIndexRef.current || 0);
    }
  }, [isPaused, isPlaying, play]);

  // Replay from beginning
  const replay = useCallback(() => {
    stop();
    setTimeout(() => {
      play(0);
    }, 100);
  }, [stop, play]);

  // Change language dynamically
  const switchLanguage = useCallback((newLang: 'vi' | 'en') => {
    const wasPlaying = isPlaying;
    stop();
    setLanguage(newLang);
    if (wasPlaying) {
      setTimeout(() => {
        // restart with new language
        setIsPlaying(true);
        sentenceQueueIndexRef.current = 0;
      }, 150);
    }
  }, [isPlaying, stop]);

  return {
    isPlaying,
    isPaused,
    language,
    gender,
    rate,
    volume,
    activeSentenceIndex,
    sentences,
    supported,
    play,
    pause,
    resume,
    stop,
    replay,
    setLanguage: switchLanguage,
    setGender,
    setRate: (newRate: number) => {
      setRate(newRate);
      if (isPlaying && !isPaused) {
        // Re-play current sentence at new rate
        play(sentenceQueueIndexRef.current);
      }
    },
    setVolume
  };
}
