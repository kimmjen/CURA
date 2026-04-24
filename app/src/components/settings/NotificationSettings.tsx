import { useState } from 'react';
import { Bell } from 'lucide-react';
import { SettingsItem } from '@/components/ui';
import SettingsSection from './SettingsSection';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NotificationSettings() {
    const { t } = useLanguage();
    const [notifications, setNotifications] = useState({
        newVideo: true,
        collectionUpdate: true,
        email: false,
    });

    return (
        <SettingsSection
            title={t('settings.account.notification_test').split(' ')[0]}
            icon={<Bell size={20} />}
            description="Configure how and when you want to be notified."
        >
            <div className="space-y-3 pt-2">
                <SettingsItem
                    title="New Video Alerts"
                    description="Get notified when new videos are added to your followed collections"
                >
                    <input
                        type="checkbox"
                        checked={notifications.newVideo}
                        onChange={(e) => setNotifications({ ...notifications, newVideo: e.target.checked })}
                        className="w-5 h-5 rounded accent-[var(--color-accent-primary)] cursor-pointer"
                    />
                </SettingsItem>

                <SettingsItem
                    title="Collection Updates"
                    description="Notifications for changes in collection metadata or status"
                >
                    <input
                        type="checkbox"
                        checked={notifications.collectionUpdate}
                        onChange={(e) => setNotifications({ ...notifications, collectionUpdate: e.target.checked })}
                        className="w-5 h-5 rounded accent-[var(--color-accent-primary)] cursor-pointer"
                    />
                </SettingsItem>

                <SettingsItem
                    title="Email Summaries"
                    description="Weekly digest of new content and trending videos"
                >
                    <input
                        type="checkbox"
                        checked={notifications.email}
                        onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                        className="w-5 h-5 rounded accent-[var(--color-accent-primary)] cursor-pointer"
                    />
                </SettingsItem>
            </div>
        </SettingsSection>
    );
}
