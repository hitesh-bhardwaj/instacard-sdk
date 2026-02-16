import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ar from "./ar";
import en from "./en";
import fr from "./fr";

const deviceLang = getLocales()[0]?.languageCode ?? "en";
const supportedLangs = ["en", "ar", "fr"];
const fallback = supportedLangs.includes(deviceLang) ? deviceLang : "en";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  resources: {
    en: { translation: en },
    ar: { translation: ar },
    fr: { translation: fr },
  },
  lng: fallback,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  initImmediate: false,
});

export default i18n;
