import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { SettingsItem } from '@/components/ui';
import SettingsSection from './SettingsSection';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/contexts/ToastContext';
import { supabase } from '@/config/supabase';

interface ProfileSettingsProps {
    user: any;
}

export default function ProfileSettings({ user }: ProfileSettingsProps) {
    const { t } = useLanguage();
    const { showToast } = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.user_metadata?.username || user.email?.split('@')[0] || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleSaveProfile = async () => {
        try {
            const { error } = await supabase.auth.updateUser({
                data: { username: name }
            });
            if (error) throw error;
            showToast(t('settings.account.save_success'), 'success');
        } catch (e) {
            console.error(e);
            showToast(t('common.error_saving'), 'error');
        }
    };

    return (
        <SettingsSection title={t('settings.profile.title')} icon={<User size={20} />}>
            <div className="space-y-6 pt-2">
                <SettingsItem
                    title={t('settings.account.photo_change')}
                    description={t('settings.account.photo_desc')}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-hover)] flex items-center justify-center text-white text-xl font-semibold shadow-inner">
                            {name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <Button variant="secondary" size="sm">
                            {t('settings.account.photo_change')}
                        </Button>
                    </div>
                </SettingsItem>

                <div className="grid grid-cols-1 gap-4">
                    <Input
                        label={t('settings.account.name')}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('settings.account.name_placeholder')}
                    />
                    <Input
                        label={t('settings.account.email')}
                        type="email"
                        value={email}
                        disabled
                        placeholder={t('settings.account.email_placeholder')}
                    />
                </div>

                <div className="pt-4 flex justify-end">
                    <Button onClick={handleSaveProfile} className="px-8">
                        {t('settings.account.save_profile')}
                    </Button>
                </div>
            </div>
        </SettingsSection>
    );
}
