// src/config/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// 🔹 Импортируем переводы
import uz from "../locales/uz/translation.json";
import ru from "../locales/ru/translation.json";
import en from "../locales/en/translation.json";

i18n
  .use(LanguageDetector) // автоопределение языка (localStorage / браузер / html)
  .use(initReactI18next)
  .init({
    resources: {
      uz: { translation: uz },
      ru: { translation: ru },
      en: { translation: en },
    },
    supportedLngs: ["uz", "ru", "en"], // ✅ список поддерживаемых языков
    fallbackLng: "uz", // если язык не найден — по умолчанию uz
    debug: false,
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
  });

export default i18n;