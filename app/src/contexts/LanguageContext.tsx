import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, type Language } from '../i18n/translations';
import { useAuth } from './AuthContext';

import { supabase } from '@/config/supabase';
import { useToast } from './ToastContext';

// Helper to get nested object values
const getNestedValue = (obj: any, path: string): string => {
    return path.split('.').reduce((prev, curr) => {
        return prev ? prev[curr] : null;
    }, obj) || path;
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [language, setLanguageState] = useState<Language>('en');

    // Load language preference
    useEffect(() => {
        const loadLanguage = async () => {
            // 1. Try to load from Supabase if user is logged in
            if (user?.id) {
                try {
                    const { data } = await supabase
                        .from('profiles')
                        .select('language')
                        .eq('id', user.id)
                        .single();

                    if (data?.language && ['en', 'ko', 'es'].includes(data.language)) {
                        setLanguageState(data.language as Language);
                        // Also update local storage to keep them in sync
                        localStorage.setItem(`app_language_${user.id}`, data.language);
                        return;
                    }
                } catch (error) {
                    console.error('Error fetching language from Supabase:', error);
                }
            }

            // 2. Fallback to Local Storage
            let storageKey = 'app_language';
            if (user?.id) {
                storageKey = `app_language_${user.id}`;
            }

            const storedLang = localStorage.getItem(storageKey) as Language;
            if (storedLang && ['en', 'ko', 'es'].includes(storedLang)) {
                setLanguageState(storedLang);
            } else if (user?.id) {
                // 3. Last resort: check global key if user specific is missing
                const globalLang = localStorage.getItem('app_language') as Language;
                if (globalLang && ['en', 'ko', 'es'].includes(globalLang)) {
                    setLanguageState(globalLang);
                }
            }
        };

        loadLanguage();
    }, [user]);

    const setLanguage = async (lang: Language) => {
        // Optimistic update
        setLanguageState(lang);
        localStorage.setItem('app_language', lang); // global backup

        if (user?.id) {
            localStorage.setItem(`app_language_${user.id}`, lang); // user specific local

            // Sync to Supabase
            try {
                const { error } = await supabase
                    .from('profiles')
                    .upsert({
                        id: user.id,
                        language: lang,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'id' });

                if (error) throw error;
            } catch (error) {
                console.error('Error saving language to Supabase:', error);
                showToast(t('common.error_saving'), 'error');
            }
        }
    };

    const t = (key: string): string => {
        const dict = translations[language];
        return getNestedValue(dict, key);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
