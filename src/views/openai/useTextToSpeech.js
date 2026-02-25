// // import { useRef } from "react";

// // export const useTextToSpeech = () => {
// //   const synthRef = useRef(window.speechSynthesis);

// //   const speak = (text) => {
// //     if (!text) return;

// //     synthRef.current.cancel(); // stop previous speech

// //     const utterance = new SpeechSynthesisUtterance(text);

// //     utterance.rate = 1; // speed (0.1 - 10)
// //     utterance.pitch = 1; // voice pitch
// //     utterance.volume = 1; // volume (0 - 1)

// //     synthRef.current.speak(utterance);
// //   };

// //   const stop = () => {
// //     synthRef.current.cancel();
// //   };

// //   return { speak, stop };
// // };

// import { useEffect, useRef, useState } from "react";

// export const useTextToSpeech = () => {
//   const synthRef = useRef(window.speechSynthesis);
//   const [hindiVoice, setHindiVoice] = useState(null);

//   useEffect(() => {
//     const loadVoices = () => {
//       const voices = synthRef.current.getVoices();

//       const googleHindi = voices.find((v) => v.name === "Google हिन्दी");

//       if (googleHindi) {
//         setHindiVoice(googleHindi);
//       }
//     };

//     loadVoices();

//     // Required for Chrome (voices load async)
//     synthRef.current.onvoiceschanged = loadVoices;

//     return () => {
//       synthRef.current.onvoiceschanged = null;
//     };
//   }, []);

//   const speak = (text) => {
//     if (!text || !hindiVoice) return;

//     synthRef.current.cancel();

//     const utterance = new SpeechSynthesisUtterance(text);

//     utterance.voice = hindiVoice;
//     utterance.lang = "hi-IN";

//     // Hindi natural tuning
//     utterance.rate = 0.9; // Slightly slower = clearer Hindi
//     utterance.pitch = 1;
//     utterance.volume = 1;

//     synthRef.current.speak(utterance);
//   };

//   const stop = () => {
//     synthRef.current.cancel();
//   };

//   return { speak, stop };
// };

import { useEffect, useRef, useState } from "react";

export const useTextToSpeech = () => {
  const synthRef = useRef(window.speechSynthesis);
  const [hindiVoice, setHindiVoice] = useState(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = synthRef.current.getVoices();
      const googleHindi = voices.find((v) => v.name === "Google हिन्दी");

      if (googleHindi) {
        setHindiVoice(googleHindi);
      }
    };

    loadVoices();
    synthRef.current.onvoiceschanged = loadVoices;

    return () => {
      synthRef.current.onvoiceschanged = null;
    };
  }, []);

  // 🔹 Remove emojis & special characters (keep Hindi, English, numbers, hyphen)
  const cleanText = (text) => {
    return text
      .replace(/[^\u0900-\u097F\w\s\-.,]/g, "") // keep Hindi + English + numbers
      .replace(/\s+/g, " ")
      .trim();
  };

  const speak = (text) => {
    if (!text || !hindiVoice) return;

    const sanitizedText = cleanText(text);

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(sanitizedText);

    utterance.voice = hindiVoice;
    utterance.lang = "hi-IN";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    synthRef.current.speak(utterance);
  };

  const stop = () => {
    synthRef.current.cancel();
  };

  return { speak, stop };
};
