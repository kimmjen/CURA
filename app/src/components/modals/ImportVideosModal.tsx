import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import type { Tab } from '@/components/ui/Tabs';
import { LoadingSpinner } from '@/components/common';
import Dropdown, { DropdownItem } from '@/components/ui/Dropdown';

export interface ImportVideosModalProps {
    open: boolean;
    onClose: () => void;
    collectionId: number;
    onImport: (data: {
        type: 'video' | 'playlist' | 'channel';
        url: string;
        defaultCategory?: string;
    }) => Promise<void>;
}

export default function ImportVideosModal({
    open,
    onClose,
    collectionId,
    onImport,
}: ImportVideosModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Single Video
    const [videoUrl, setVideoUrl] = useState('');
    const [videoCategory, setVideoCategory] = useState('');

    // Playlist
    const [playlistUrl, setPlaylistUrl] = useState('');

    // Channel
    const [channelUrl, setChannelUrl] = useState('');
    const [defaultCategory, setDefaultCategory] = useState('');

    const handleImportVideo = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        if (!youtubeRegex.test(videoUrl)) {
            setError('유효한 YouTube 비디오 URL을 입력하세요');
            return;
        }

        setLoading(true);
        try {
            await onImport({
                type: 'video',
                url: videoUrl,
                defaultCategory: videoCategory || undefined,
            });
            setVideoUrl('');
            setVideoCategory('');
            onClose();
        } catch (err: any) {
            setError(err.message || '비디오 가져오기 실패');
        } finally {
            setLoading(false);
        }
    };

    const handleImportPlaylist = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Accept both /playlist?list=... and /watch?v=...&list=... formats
        const playlistRegex = /^(https?:\/\/)?(www\.)?youtube\.com\/(playlist\?|watch\?.*[&?])list=([a-zA-Z0-9_-]+)/;
        if (!playlistRegex.test(playlistUrl)) {
            setError('유효한 YouTube 플레이리스트 URL을 입력하세요');
            return;
        }

        setLoading(true);
        try {
            await onImport({ type: 'playlist', url: playlistUrl });
            setPlaylistUrl('');
            onClose();
        } catch (err: any) {
            setError(err.message || '플레이리스트 가져오기 실패');
        } finally {
            setLoading(false);
        }
    };

    const handleImportChannel = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const channelRegex = /^(https?:\/\/)?(www\.)?youtube\.com\/@?([a-zA-Z0-9_-]+)/;
        if (!channelRegex.test(channelUrl)) {
            setError('유효한 YouTube 채널 URL을 입력하세요');
            return;
        }

        setLoading(true);
        try {
            await onImport({
                type: 'channel',
                url: channelUrl,
                defaultCategory: defaultCategory || undefined,
            });
            setChannelUrl('');
            setDefaultCategory('');
            onClose();
        } catch (err: any) {
            setError(err.message || '채널 비디오 가져오기 실패');
        } finally {
            setLoading(false);
        }
    };

    const tabs: Tab[] = [
        {
            id: 'video',
            label: '단일 비디오',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z" stroke="currentColor" strokeWidth="2" />
                </svg>
            ),
            content: (
                <form onSubmit={handleImportVideo} className="space-y-4">
                    <Input
                        label="YouTube 비디오 URL"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        error={error}
                        disabled={loading}
                    />

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                            카테고리 (선택사항)
                        </label>
                        <Dropdown
                            trigger={
                                <Button variant="secondary" className="w-full justify-between" type="button">
                                    {videoCategory || '카테고리 선택'}
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Button>
                            }
                        >
                            <DropdownItem onClick={() => setVideoCategory('')}>선택 안함</DropdownItem>
                            <DropdownItem onClick={() => setVideoCategory('MV')}>Music Video</DropdownItem>
                            <DropdownItem onClick={() => setVideoCategory('LIVE')}>Live</DropdownItem>
                            <DropdownItem onClick={() => setVideoCategory('FANCAM')}>Fancam</DropdownItem>
                            <DropdownItem onClick={() => setVideoCategory('BROADCAST')}>Broadcast</DropdownItem>
                            <DropdownItem onClick={() => setVideoCategory('BEHIND')}>Behind</DropdownItem>
                            <DropdownItem onClick={() => setVideoCategory('SHORTS')}>Shorts</DropdownItem>
                            <DropdownItem onClick={() => setVideoCategory('INTERVIEW')}>Interview</DropdownItem>
                            <DropdownItem onClick={() => setVideoCategory('VLOG')}>Vlog</DropdownItem>
                            <DropdownItem onClick={() => setVideoCategory('DANCE')}>Dance</DropdownItem>
                            <DropdownItem onClick={() => setVideoCategory('COVER')}>Cover</DropdownItem>
                            <DropdownItem onClick={() => setVideoCategory('REACTION')}>Reaction</DropdownItem>
                        </Dropdown>
                    </div>

                    <p className="text-xs text-[var(--color-text-tertiary)]">
                        단일 비디오를 이 컬렉션에 추가합니다.
                    </p>

                    <div className="flex gap-3 justify-end pt-4">
                        <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                            취소
                        </Button>
                        <Button type="submit" disabled={loading || !videoUrl}>
                            {loading ? <><LoadingSpinner size="sm" /> 추가 중...</> : '추가'}
                        </Button>
                    </div>
                </form>
            ),
        },
        {
            id: 'playlist',
            label: '플레이리스트',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 4h12M9 8h12M9 12h12M3 4h.01M3 8h.01M3 12h.01M9 16h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            ),
            content: (
                <form onSubmit={handleImportPlaylist} className="space-y-4">
                    <Input
                        label="YouTube 플레이리스트 URL"
                        placeholder="https://www.youtube.com/playlist?list=..."
                        value={playlistUrl}
                        onChange={(e) => setPlaylistUrl(e.target.value)}
                        error={error}
                        disabled={loading}
                    />
                    <p className="text-xs text-[var(--color-text-tertiary)]">
                        플레이리스트의 모든 비디오를 가져옵니다.
                    </p>

                    <div className="flex gap-3 justify-end pt-4">
                        <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                            취소
                        </Button>
                        <Button type="submit" disabled={loading || !playlistUrl}>
                            {loading ? <><LoadingSpinner size="sm" /> 가져오는 중...</> : '가져오기'}
                        </Button>
                    </div>
                </form>
            ),
        },
        {
            id: 'channel',
            label: '채널 전체',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            ),
            content: (
                <form onSubmit={handleImportChannel} className="space-y-4">
                    <Input
                        label="YouTube 채널 URL"
                        placeholder="https://www.youtube.com/@channel_name"
                        value={channelUrl}
                        onChange={(e) => setChannelUrl(e.target.value)}
                        error={error}
                        disabled={loading}
                    />

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                            기본 카테고리 (선택사항)
                        </label>
                        <Dropdown
                            trigger={
                                <Button variant="secondary" className="w-full justify-between" type="button">
                                    {defaultCategory || '카테고리 선택'}
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Button>
                            }
                        >
                            <DropdownItem onClick={() => setDefaultCategory('')}>선택 안함</DropdownItem>
                            <DropdownItem onClick={() => setDefaultCategory('MV')}>Music Video</DropdownItem>
                            <DropdownItem onClick={() => setDefaultCategory('LIVE')}>Live</DropdownItem>
                            <DropdownItem onClick={() => setDefaultCategory('FANCAM')}>Fancam</DropdownItem>
                            <DropdownItem onClick={() => setDefaultCategory('BEHIND')}>Behind</DropdownItem>
                            <DropdownItem onClick={() => setDefaultCategory('SHORTS')}>Shorts</DropdownItem>
                            <DropdownItem onClick={() => setDefaultCategory('INTERVIEW')}>Interview</DropdownItem>
                            <DropdownItem onClick={() => setDefaultCategory('VLOG')}>Vlog</DropdownItem>
                        </Dropdown>
                        <p className="text-xs text-[var(--color-text-tertiary)] mt-2">
                            팬 계정 등 커스텀 채널의 모든 비디오에 기본 카테고리를 적용합니다.
                        </p>
                    </div>

                    <div className="bg-[var(--color-bg-tertiary)] p-4 rounded-[var(--radius-lg)]">
                        <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
                            ⚠️ 주의사항
                        </h4>
                        <p className="text-xs text-[var(--color-text-secondary)]">
                            채널의 모든 공개 비디오를 가져옵니다. 많은 비디오가 있는 경우 시간이 오래 걸릴 수 있습니다.
                        </p>
                    </div>

                    <div className="flex gap-3 justify-end">
                        <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                            취소
                        </Button>
                        <Button type="submit" disabled={loading || !channelUrl}>
                            {loading ? <><LoadingSpinner size="sm" /> 가져오는 중...</> : '가져오기'}
                        </Button>
                    </div>
                </form>
            ),
        },
    ];

    return (
        <Modal open={open} onClose={onClose} title="비디오 가져오기" size="lg">
            <Tabs tabs={tabs} />
        </Modal>
    );
}
