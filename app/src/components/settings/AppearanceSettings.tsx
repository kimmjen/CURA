import { Moon, Sun, Monitor, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '@/utils/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import SettingsSection from './SettingsSection';

export default function AppearanceSettings() {
    const { theme, setTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();

    return (
        <div className="space-y-10">
            <SettingsSection
                title={t('settings.profile.appearance')}
                icon={<Monitor size={20} />}
                description="Choose how CURA looks on your device."
            >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    {(['light', 'dark', 'system'] as const).map((themeOption) => (
                        <button
                            key={themeOption}
                            onClick={() => setTheme(themeOption)}
                            className={cn(
                                'p-5 rounded-[var(--radius-xl)] border-2 transition-all flex flex-col items-center gap-3',
                                theme === themeOption
                                    ? 'border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/5 text-[var(--color-accent-primary)]'
                                    : 'border-[var(--color-border-default)] hover:border-[var(--color-border-hover)] bg-[var(--color-bg-primary)]'
                            )}
                        >
                            <div className={cn(
                                "p-3 rounded-full",
                                theme === themeOption
                                    ? "bg-[var(--color-accent-primary)] text-white"
                                    : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]"
                            )}>
                                {themeOption === 'light' && <Sun size={24} />}
                                {themeOption === 'dark' && <Moon size={24} />}
                                {themeOption === 'system' && <Monitor size={24} />}
                            </div>
                            <span className="text-sm font-bold uppercase tracking-tight">
                                {themeOption === 'light' ? t('settings.profile.light') : themeOption === 'dark' ? t('settings.profile.dark') : t('settings.profile.system')}
                            </span>
                        </button>
                    ))}
                </div>
            </SettingsSection>

            <SettingsSection
                title={t('settings.profile.language')}
                icon={<SettingsIcon size={20} />}
                description="Your preferred language for the interface."
            >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {[
                        { code: 'en', label: 'English (US)' },
                        { code: 'ko', label: '한국어 (KR)' },
                        { code: 'es', label: 'Español (ES)' }
                    ].map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => setLanguage(lang.code as any)}
                            className={cn(
                                'px-4 py-4 rounded-[var(--radius-lg)] border-2 transition-all font-medium text-sm',
                                language === lang.code
                                    ? 'border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)] text-white'
                                    : 'border-[var(--color-border-default)] hover:border-[var(--color-border-hover)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]'
                            )}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            </SettingsSection>
        </div>
    );
}
