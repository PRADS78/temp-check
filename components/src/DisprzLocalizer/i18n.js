import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { NameSpace } from "../Enums";

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  // The languageKeys are handled in the LanguageKeys.js file
  supportedLngs: false,
  react: { useSuspense: false },
  ns: [NameSpace.DEFAULT, NameSpace.DCMP],
  defaultNS: NameSpace.DEFAULT,
});

export default i18n;
