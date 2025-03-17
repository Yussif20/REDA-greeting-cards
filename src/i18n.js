// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      visit_website: 'Visit Our Website',
      select_card: 'Select a Card and Write Your Name',
      enter_name: 'Enter your name here',
      choose_color: 'Choose Name Color:',
      save_high_quality: 'Save in High Quality (300 DPI)',
      save_card: 'Save Card',
      select_card_alert: 'Please select a card first!',
      copyright: '© 2025 All rights reserved.', // Added English footer text
    },
  },
  ar: {
    translation: {
      visit_website: 'زوروا موقعنا الإلكتروني',
      select_card: 'اختر بطاقة واكتب اسمك',
      enter_name: 'اكتب اسمك هنا',
      choose_color: 'اختر لون الاسم:',
      save_high_quality: 'حفظ بجودة عالية (300 DPI)',
      save_card: 'حفظ البطاقة',
      select_card_alert: 'اختار بطاقة أولًا!',
      copyright: '© 2025 جميع الحقوق محفوظة', // Added Arabic footer text
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language remains English
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;