import { User, ShieldAlert } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { SettingsSection } from '@/components/settings';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/contexts/ToastContext';

export default function AccountSettings() {
    const { t } = useLanguage();
    const { showToast } = useToast();

    const handleDeleteAccount = () => {
        if (window.confirm(t('settings.account.delete_warning'))) {
            console.log('Deleting account');
            showToast('Account deletion request sent.', 'info');
        }
    };

    return (
        <div className="space-y-10">
            <SettingsSection title={t('settings.account.title')} icon={<User size={20} />}>
                <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                        {t('settings.account.password_change')}
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        <Input
                            label={t('settings.account.current_password')}
                            type="password"
                            placeholder={t('settings.account.current_password_placeholder')}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label={t('settings.account.new_password')}
                                type="password"
                                placeholder={t('settings.account.new_password_placeholder')}
                            />
                            <Input
                                label={t('settings.account.confirm_password')}
                                type="password"
                                placeholder={t('settings.account.confirm_password_placeholder')}
                            />
                        </div>
                    </div>
                    <div className="pt-2 flex justify-end">
                        <Button variant="primary">
                            {t('settings.account.password_change')}
                        </Button>
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection title="Danger Zone" icon={<ShieldAlert size={20} className="text-red-500" />}>
                <div className="pt-2">
                    <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-[var(--radius-xl)]">
                        <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">
                            {t('settings.account.delete_account')}
                        </h3>
                        <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                            {t('settings.account.delete_warning')}
                        </p>
                        <Button
                            variant="secondary"
                            onClick={handleDeleteAccount}
                            className="bg-red-500 hover:bg-red-600 text-white border-0 shadow-lg shadow-red-500/20"
                        >
                            {t('settings.account.delete_account')}
                        </Button>
                    </div>
                </div>
            </SettingsSection>
        </div>
    );
}
