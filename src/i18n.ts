import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import file bahasa yang kamu buat
import en from './locales/en.json';
import id from './locales/id.json';

// Saat inisialisasi i18next, pastikan memuat bahasa dari localStorage
i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        id: { translation: id },
    },
    lng: localStorage.getItem('language') || 'en', // Ambil bahasa dari localStorage, jika ada
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false, // not needed for React
    },
    react: {
        useSuspense: false, // nonaktifkan Suspense
    },
});

export default i18n;