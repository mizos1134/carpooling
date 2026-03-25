import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';

import en from './locales/en.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  ar: { translation: ar },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'fr', // French is the default language
  fallbackLng: 'fr',
  interpolation: {
    escapeValue: false, // React already escapes
  },
  compatibilityJSON: 'v3',
});

// Enable RTL layout for Arabic
i18n.on('languageChanged', (lng) => {
  const isRTL = lng === 'ar';
  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);
});

export default i18n;
