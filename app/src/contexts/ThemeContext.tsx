import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/config/supabase';
import { useAuth } from './AuthContext';


type Theme = 'dark' | 'light' | 'system';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);


export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    // Initialize with global local storage or system
    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('theme') as Theme) || 'system';
        }
        return 'system';
    });

    // Load theme preference from Supabase or User Local Storage
    useEffect(() => {
        const loadTheme = async () => {
            // 1. Try Supabase
            if (user?.id) {
                try {
                    const { data } = await supabase
                        .from('profiles')
                        .select('theme')
                        .eq('id', user.id)
                        .single();

                    if (data?.theme && ['light', 'dark', 'system'].includes(data.theme)) {
                        setThemeState(data.theme as Theme);
                        localStorage.setItem(`theme_${user.id}`, data.theme);
                        return;
                    }
                } catch (error) {
                    console.error('Error fetching theme from Supabase:', error);
                }
            }

            // 2. Fallback to User Local Storage
            if (user?.id) {
                const userTheme = localStorage.getItem(`theme_${user.id}`) as Theme;
                if (userTheme && ['light', 'dark', 'system'].includes(userTheme)) {
                    setThemeState(userTheme);
                    return;
                }
            }

            // 3. Fallback to Global (already loaded in useState, but good to re-check if logging out)
            if (!user?.id) {
                const globalTheme = localStorage.getItem('theme') as Theme;
                if (globalTheme) setThemeState(globalTheme);
            }
        };

        loadTheme();
    }, [user]);

    const setTheme = async (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem('theme', newTheme); // global

        if (user?.id) {
            localStorage.setItem(`theme_${user.id}`, newTheme); // user specific

            try {
                const { error } = await supabase
                    .from('profiles')
                    .upsert({
                        id: user.id,
                        theme: newTheme,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'id' });

                if (error) throw error;
            } catch (error) {
                console.error('Error saving theme to Supabase:', error);
                // Optional: show toast, but theme sync failure is less critical than language?
                // showToast('테마 설정을 저장하는 중 오류가 발생했습니다', 'error');
            }
        }
    };

    useEffect(() => {
        const root = window.document.documentElement;

        // Function to apply the actual CSS variables and classes
        const applyTheme = (mode: 'dark' | 'light') => {
            root.classList.remove('light', 'dark');
            root.classList.add(mode);

            if (mode === 'dark') {
                root.style.setProperty('--color-bg-primary', '#09090b');
                root.style.setProperty('--color-bg-secondary', '#18181b');
                root.style.setProperty('--color-bg-tertiary', '#27272a'); // Zinc 800
                root.style.setProperty('--color-bg-hover', '#27272a'); // Zinc 800
                root.style.setProperty('--color-text-primary', '#f4f4f5');
                root.style.setProperty('--color-text-secondary', '#a1a1aa');
                root.style.setProperty('--color-border-default', '#27272a');
            } else {
                // Light Theme Colors
                root.style.setProperty('--color-bg-primary', '#ffffff');
                root.style.setProperty('--color-bg-secondary', '#f4f4f5'); // Zinc 100
                root.style.setProperty('--color-bg-tertiary', '#e4e4e7'); // Zinc 200
                root.style.setProperty('--color-bg-hover', '#e4e4e7'); // Zinc 200
                root.style.setProperty('--color-text-primary', '#18181b');
                root.style.setProperty('--color-text-secondary', '#71717a');
                root.style.setProperty('--color-border-default', '#e4e4e7');
            }
        };

        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            if (theme === 'system') {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        };

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        // Logic to determine which theme to apply
        if (theme === 'system') {
            applyTheme(mediaQuery.matches ? 'dark' : 'light');
            mediaQuery.addEventListener('change', handleSystemThemeChange);
        } else {
            applyTheme(theme);
        }

        // We already save to localStorage in setTheme, but this effect runs on mount/change.
        // If the change came from setTheme, it's redundant but harmless. 
        // If it came from mount, we want to ensure basic global storage is set?
        // Actually, let's keep it simple and handle storage in setTheme mostly.

        return () => {
            mediaQuery.removeEventListener('change', handleSystemThemeChange);
        };
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined)
        throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};
