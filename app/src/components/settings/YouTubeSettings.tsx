import { useState, useEffect } from 'react';
import { Youtube, RefreshCw, Database, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/common';
import { SettingsItem } from '@/components/ui';
import SettingsSection from './SettingsSection';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/contexts/ToastContext';
import { api } from '@/api/client';
import { supabase } from '@/config/supabase';

interface YouTubeSettingsProps {
    user: any;
}

export default function YouTubeSettings({ user }: YouTubeSettingsProps) {
    const { t } = useLanguage();
    const { showToast } = useToast();
    const [youtubeConnected, setYoutubeConnected] = useState(false);
    const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        if (user) {
            const storedYoutube = localStorage.getItem(`youtube_connected_${user.id}`);
            if (storedYoutube === 'true') setYoutubeConnected(true);
        }
    }, [user]);

    const handleConnectYouTube = () => {
        setYoutubeConnected(true);
        if (user) localStorage.setItem(`youtube_connected_${user.id}`, 'true');
        showToast('YouTube has been connected!', 'success');
    };

    const handleSyncPlaylists = () => {
        showToast(t('settings.youtube.sync_now') + '...', 'info');
        setTimeout(() => {
            showToast(t('common.save_success'), 'success');
        }, 1500);
    };

    const handleDisconnectYouTube = () => {
        if (window.confirm(t('settings.account.youtube_confirm_disconnect'))) {
            setYoutubeConnected(false);
            if (user) localStorage.removeItem(`youtube_connected_${user.id}`);
            showToast(t('settings.account.youtube_disconnected'), 'success');
        }
    };

    const handleSyncAll = async () => {
        setIsSyncing(true);
        setIsSyncModalOpen(false);
        showToast("Sync started in background...", "info");
        try {
            await api.syncAllVideos();
            showToast("Sync completed successfully!", "success");
        } catch (e) {
            showToast("Sync failed. Check connection.", "error");
            console.error(e);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleSeedData = async () => {
        if (!confirm(t('settings.dev.confirm_seed'))) return;
        setIsSyncing(true);
        try {
            const promises = Array.from({ length: 30 }).map((_, i) =>
                api.createCollection({
                    title: `Test Collection ${i + 1}`,
                    description: `This is a generated test collection ${i + 1}`,
                    type: 'USER'
                })
            );
            await Promise.all(promises);
            showToast(t('settings.dev.seed_success'), "success");
            window.location.reload();
        } catch (e) {
            console.error(e);
            showToast(t('settings.dev.seed_failed'), "error");
        } finally {
            setIsSyncing(false);
        }
    };

    const handleClaimData = async () => {
        if (!window.confirm('기존 데이터를 현재 계정으로 가져오시겠습니까?')) return;
        try {
            const { data: authData } = await supabase.auth.getSession();
            const token = authData.session?.access_token;
            if (!token) throw new Error('Authentication required');

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/collections/claim`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to claim data');
            const count = await response.json();
            showToast(`${count}개의 컬렉션을 성공적으로 가져왔습니다!`, 'success');
        } catch (e) {
            console.error(e);
            showToast('데이터 가져오기 실패', 'error');
        }
    };

    return (
        <div className="space-y-10">
            <SettingsSection title={t('settings.sync.title')} icon={<RefreshCw size={20} />}>
                <SettingsItem
                    title={t('settings.sync.refresh_title')}
                    description={t('settings.sync.refresh_desc')}
                >
                    <Button
                        onClick={() => setIsSyncModalOpen(true)}
                        disabled={isSyncing}
                        variant={isSyncing ? "secondary" : "primary"}
                    >
                        {isSyncing ? (
                            <span className="flex items-center gap-2">
                                <LoadingSpinner size="sm" />
                                {t('settings.sync.btn_syncing')}
                            </span>
                        ) : t('settings.sync.btn_sync')}
                    </Button>
                </SettingsItem>
            </SettingsSection>

            <SettingsSection title={t('settings.youtube.title')} icon={<Youtube size={20} />}>
                {youtubeConnected ? (
                    <div className="space-y-4 pt-2">
                        <div className="p-6 bg-green-500/5 border border-green-500/20 rounded-[var(--radius-xl)] flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-500 rounded-full text-white shadow-lg shadow-green-500/20">
                                    <Check size={24} />
                                </div>
                                <div>
                                    <span className="text-green-600 dark:text-green-400 font-bold text-lg block">
                                        {t('settings.youtube.connected_as')}
                                    </span>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button onClick={handleSyncPlaylists} className="flex-1">
                                <RefreshCw size={16} className="mr-2" />
                                {t('settings.youtube.sync_now')}
                            </Button>
                            <Button variant="secondary" onClick={handleDisconnectYouTube} className="border-red-500/50 text-red-500 hover:bg-red-500/10">
                                {t('settings.youtube.btn_disconnect')}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="pt-2">
                        <SettingsItem
                            title={t('settings.youtube.connect_title')}
                            description={t('settings.youtube.connect_desc')}
                        >
                            <Button onClick={handleConnectYouTube} size="lg" className="bg-[#FF0000] hover:bg-[#CC0000] text-white border-0">
                                <Youtube size={20} className="mr-2 fill-current" />
                                {t('settings.youtube.btn_connect')}
                            </Button>
                        </SettingsItem>
                    </div>
                )}
            </SettingsSection>

            <SettingsSection title="데이터 관리" icon={<Database size={20} />} description="Existing data connection and system management.">
                <div className="space-y-3 pt-2">
                    <SettingsItem
                        title="기존 컬렉션 가져오기"
                        description="소유자가 없는 컬렉션을 현재 계정으로 연결합니다."
                    >
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleClaimData}
                        >
                            가져오기
                        </Button>
                    </SettingsItem>

                    {import.meta.env.DEV && (
                        <SettingsItem
                            title="테스트 데이터 생성"
                            description="개발용 더미 데이터를 대량으로 생성합니다 (컬렉션 30개)."
                        >
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleSeedData}
                                disabled={isSyncing}
                            >
                                {isSyncing ? <LoadingSpinner size="sm" /> : "생성하기"}
                            </Button>
                        </SettingsItem>
                    )}
                </div>
            </SettingsSection>

            {/* Sync Confirmation Modal */}
            <Modal
                open={isSyncModalOpen}
                onClose={() => setIsSyncModalOpen(false)}
                title={t('settings.sync.confirm_title')}
                size="sm"
            >
                <div className="space-y-6">
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">
                        {t('settings.sync.confirm_desc')}
                    </p>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="secondary" onClick={() => setIsSyncModalOpen(false)} className="px-6">
                            {t('settings.sync.cancel_btn')}
                        </Button>
                        <Button onClick={handleSyncAll} className="px-8">
                            {t('settings.sync.confirm_btn')}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
