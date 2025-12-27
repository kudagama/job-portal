import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Check localStorage for saved language preference, default to 'en'
    const [language, setLanguage] = useState(() => {
        const savedLang = localStorage.getItem('jobPortalLang');
        return savedLang || 'en';
    });

    useEffect(() => {
        localStorage.setItem('jobPortalLang', language);
    }, [language]);

    const switchLanguage = (lang) => {
        setLanguage(lang);
    };

    // Get the current translations
    const t = translations[language];

    return (
        <LanguageContext.Provider value={{ language, switchLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
