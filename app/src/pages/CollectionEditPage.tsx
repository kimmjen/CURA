import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Dropdown, { DropdownItem } from '@/components/ui/Dropdown';
import { LoadingSpinner, ErrorState } from '@/components/common';
import { useCollection, api } from '@/api';
import type { Video, VideoCategory } from '@/types/video';
import ImageUpload from '@/components/ui/ImageUpload';

const VIDEO_CATEGORIES: { value: VideoCategory; label: string }[] = [
    { value: 'MV', label: 'Music Video' },
    { value: 'LIVE', label: 'Live' },
    { value: 'FANCAM', label: 'Fancam' },
    { value: 'BROADCAST', label: 'Broadcast' },
    { value: 'BEHIND', label: 'Behind' },
    { value: 'SHORTS', label: 'Shorts' },
    { value: 'INTERVIEW', label: 'Interview' },
    { value: 'VLOG', label: 'Vlog' },
    { value: 'DANCE', label: 'Dance' },
    { value: 'COVER', label: 'Cover' },
    { value: 'REACTION', label: 'Reaction' },
];

export default function CollectionEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const collectionId = Number(id);

    const { data: collection, isLoading, error } = useCollection(collectionId);
    const [videos, setVideos] = useState<Video[]>([]);
    const [isLoadingVideos, setIsLoadingVideos] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Import state
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [defaultCategory, setDefaultCategory] = useState<VideoCategory>('MV');
    const [isImporting, setIsImporting] = useState(false);

    useEffect(() => {
        if (collection) {
            setTitle(collection.title);
            setDescription(collection.description || '');
            setProfileImageUrl(collection.profileImageUrl || '');
            setCoverImageUrl(collection.coverImageUrl || '');
        }
    }, [collection]);

    useEffect(() => {
        const fetchVideos = async () => {
            setIsLoadingVideos(true);
            try {
                const response = await api.getVideos(collectionId, { size: 100 });
                setVideos(response.videos || []);
            } catch (err) {
                console.error('Failed to fetch videos:', err);
            } finally {
                setIsLoadingVideos(false);
            }
        };

        if (collectionId) {
            fetchVideos();
        }
    }, [collectionId]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await api.updateCollection(collectionId, {
                title: title.trim(),
                description: description.trim() || undefined,
                profileImageUrl: profileImageUrl.trim() || undefined,
                coverImageUrl: coverImageUrl.trim() || undefined,
            });
            navigate(`/collection/${collectionId}`);
        } catch (err) {
            console.error('Failed to update collection:', err);
            alert('컬렉션 수정에 실패했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleImportVideo = async () => {
        if (!youtubeUrl.trim()) return;

        setIsImporting(true);
        try {
            await api.importVideos({
                youtubeUrl: youtubeUrl.trim(),
                collectionId,
                defaultCategory,
            });

            // Refresh videos
            const response = await api.getVideos(collectionId, { size: 100 });
            setVideos(response.videos || []);
            setYoutubeUrl('');
        } catch (err) {
            console.error('Failed to import video:', err);
            alert('비디오 가져오기에 실패했습니다.');
        } finally {
            setIsImporting(false);
        }
    };

    const handleDeleteVideo = async (videoId: number) => {
        if (!confirm('이 비디오를 삭제하시겠습니까?')) return;

        try {
            await api.deleteVideo(videoId);
            setVideos(videos.filter(v => v.id !== videoId));
        } catch (err) {
            console.error('Failed to delete video:', err);
            alert('비디오 삭제에 실패했습니다.');
        }
    };

    const handleUpdateVideo = async (videoId: number, data: { title?: string; category?: VideoCategory }) => {
        try {
            await api.updateVideo(videoId, data);
            setVideos(videos.map(v => v.id === videoId ? { ...v, ...data } as Video : v));
        } catch (err) {
            console.error('Failed to update video:', err);
            alert('비디오 수정에 실패했습니다.');
        }
    };

    if (isLoading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-screen">
                    <LoadingSpinner size="lg" />
                </div>
            </MainLayout>
        );
    }

    if (error || !collection) {
        return (
            <MainLayout>
                <div className="p-8">
                    <ErrorState
                        title="컬렉션을 찾을 수 없습니다"
                        message="컬렉션이 존재하지 않거나 삭제되었습니다."
                    />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => navigate(`/collection/${collectionId}`)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            뒤로
                        </Button>
                        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
                            컬렉션 편집
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={() => navigate(`/collection/${collectionId}`)}>
                            취소
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving || !title.trim()}>
                            {isSaving ? '저장 중...' : '저장'}
                        </Button>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column: Collection Info */}
                    <div className="space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                                기본 정보
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                                        제목 *
                                    </label>
                                    <Input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="컬렉션 제목"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                                        설명
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="컬렉션 설명"
                                        rows={4}
                                        className="w-full px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* Images */}
                        <Card>
                            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                                이미지
                            </h2>
                            <div className="space-y-6">
                                {/* Profile Image */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                                        프로필 이미지
                                    </label>
                                    <ImageUpload
                                        value={profileImageUrl}
                                        onChange={setProfileImageUrl}
                                        folder={`collections/${collectionId}/profile`}
                                        shape="circle"
                                        placeholder="프로필 이미지 업로드"
                                        className="w-32"
                                    />
                                </div>

                                {/* Cover Image */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                                        커버 이미지
                                    </label>
                                    <ImageUpload
                                        value={coverImageUrl}
                                        onChange={setCoverImageUrl}
                                        folder={`collections/${collectionId}/cover`}
                                        shape="cover"
                                        placeholder="커버 이미지 업로드"
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Video Management */}
                    <div className="space-y-6">
                        {/* Import Video */}
                        <Card>
                            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                                비디오 가져오기
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                                        YouTube URL
                                    </label>
                                    <Input
                                        type="url"
                                        value={youtubeUrl}
                                        onChange={(e) => setYoutubeUrl(e.target.value)}
                                        placeholder="https://youtube.com/watch?v=..."
                                        disabled={isImporting}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                                        기본 카테고리
                                    </label>
                                    <Dropdown
                                        trigger={
                                            <Button variant="secondary" className="w-full justify-between">
                                                {VIDEO_CATEGORIES.find(c => c.value === defaultCategory)?.label || 'Music Video'}
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </Button>
                                        }
                                    >
                                        {VIDEO_CATEGORIES.map((cat) => (
                                            <DropdownItem
                                                key={cat.value}
                                                onClick={() => setDefaultCategory(cat.value)}
                                            >
                                                {cat.label}
                                            </DropdownItem>
                                        ))}
                                    </Dropdown>
                                </div>
                                <Button
                                    onClick={handleImportVideo}
                                    disabled={isImporting || !youtubeUrl.trim()}
                                    className="w-full"
                                >
                                    {isImporting ? '가져오는...' : '비디오 가져오기'}
                                </Button>
                            </div>
                        </Card>

                        {/* Videos */}
                        <Card>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                                    비디오 목록
                                </h2>
                                <span className="text-sm text-[var(--color-text-secondary)]">
                                    {videos.length}개
                                </span>
                            </div>

                            {isLoadingVideos ? (
                                <div className="flex justify-center py-8">
                                    <LoadingSpinner />
                                </div>
                            ) : videos.length > 0 ? (
                                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                    {videos.map((video) => (
                                        <div
                                            key={video.id}
                                            className="flex items-center gap-3 p-3 bg-[var(--color-bg-secondary)] rounded-lg"
                                        >
                                            <img
                                                src={video.thumbnailUrl}
                                                alt={video.title}
                                                className="w-24 h-14 object-cover rounded flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <input
                                                    type="text"
                                                    defaultValue={video.title}
                                                    onBlur={(e) => {
                                                        if (e.target.value.trim() && e.target.value !== video.title) {
                                                            handleUpdateVideo(video.id, { title: e.target.value.trim() });
                                                        } else if (!e.target.value.trim()) {
                                                            e.target.value = video.title; // Restore if empty
                                                        }
                                                    }}
                                                    className="w-full bg-transparent text-xs font-medium text-[var(--color-text-primary)] border-none focus:outline-none focus:ring-0 mb-2"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <Dropdown
                                                        trigger={
                                                            <button className="text-xs hover:opacity-80 transition-opacity">
                                                                <Badge variant="category" category={video.category} size="sm" />
                                                            </button>
                                                        }
                                                    >
                                                        {VIDEO_CATEGORIES.map((cat) => (
                                                            <DropdownItem
                                                                key={cat.value}
                                                                onClick={() => handleUpdateVideo(video.id, { category: cat.value })}
                                                            >
                                                                {cat.label}
                                                            </DropdownItem>
                                                        ))}
                                                    </Dropdown>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteVideo(video.id)}
                                                className="text-red-500 hover:text-red-600 flex-shrink-0"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-[var(--color-text-tertiary)] py-8 text-sm">
                                    비디오가 없습니다
                                </p>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
