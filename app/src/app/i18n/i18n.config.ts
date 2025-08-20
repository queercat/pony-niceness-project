import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "./en/translation.json";
import es from "./es/translation.json";
import fr from "./fr/translation.json";
import de from "./de/translation.json";
import zh from "./zh/translation.json";
import ar from "./ar/translation.json";
import hi from "./hi/translation.json";
import pt from "./pt/translation.json";
import ru from "./ru/translation.json";
import ja from "./ja/translation.json";

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: {
        caches: []
    },
    fallbackLng: "en",
    supportedLngs: ["en", "es", "fr", "de", "zh", "ar", "hi", "pt", "ru", "ja"],
    resources: {
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
      de: { translation: de },
      zh: { translation: zh },
      ar: { translation: ar },
      hi: { translation: hi },
      pt: { translation: pt },
      ru: { translation: ru },
      ja: { translation: ja },
    },
  });
