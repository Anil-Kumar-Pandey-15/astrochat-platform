
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import en from '../i18n/en';
import hi from '../i18n/hi';
import mr from '../i18n/mr';
import ta from '../i18n/ta';
import te from '../i18n/te';
import gu from '../i18n/gu';
import bn from '../i18n/bn';
import kn from '../i18n/kn';

// Type definitions
export type Language = 'en' | 'hi' | 'ta' | 'te' | 'mr' | 'gu' | 'bn' | 'kn';
type TranslationContextType = {
  t: (key: string) => string;
  language: Language;
  setLanguage: (lang: Language) => void;
};

// Create the context
const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Create the provider component
export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('hi');
  
  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'hi', 'ta', 'te', 'mr', 'gu', 'bn', 'kn'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);
  
  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);
  
  // Translations dictionary
  const translations = {
    en,
    hi,
    mr,
    ta,
    te,
    gu,
    bn,
    kn
  };
  
  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        // If key not found, fallback to English, then to Hindi
        if (language !== 'hi') {
          // Try English first
          let engValue: any = translations.en;
          let foundEng = true;
          for (const fallbackKey of keys) {
            if (engValue && engValue[fallbackKey]) {
              engValue = engValue[fallbackKey];
            } else {
              foundEng = false;
              break;
            }
          }
          if (foundEng && engValue) {
            return engValue;
          }
          
          // Try Hindi second
          let hiValue: any = translations.hi;
          let foundHi = true;
          for (const fallbackKey of keys) {
            if (hiValue && hiValue[fallbackKey]) {
              hiValue = hiValue[fallbackKey];
            } else {
              foundHi = false;
              break;
            }
          }
          if (foundHi && hiValue) {
            return hiValue;
          }
          
          return key; // Return the key as is if not found anywhere
        } else {
          // If Hindi and not found, try English
          let engValue: any = translations.en;
          let foundEng = true;
          for (const fallbackKey of keys) {
            if (engValue && engValue[fallbackKey]) {
              engValue = engValue[fallbackKey];
            } else {
              foundEng = false;
              break;
            }
          }
          if (foundEng && engValue) {
            return engValue;
          }
          return key; // Return the key as is
        }
      }
    }
    
    return value || key;
  };
  
  return (
    <TranslationContext.Provider value={{ t, language, setLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};

// Custom hook to use the translation context
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
