import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { VideoCard, VideoCardSkeleton } from '@/components/video';
import Button from '@/components/ui/Button';
import { EmptyState, LoadingSpinner } from '@/components/common';
import { cn } from '@/utils/utils';
import { watchHistoryApi, type WatchHistoryResponse } from '@/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function RecentPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [watchHistory, setWatchHistory] = useState<WatchHistoryResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const observerTarget = useRef<HTMLDivElement>(null);

    // Load watch history from API
    const loadWatchHistory = useCallback(async (pageNum: number, append = false) => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            if (!append) setLoading(true);
            else setLoadingMore(true);

            const response = await watchHistoryApi.getRecent(user.id, pageNum, 20);

            if (append) {
                setWatchHistory(prev => [...prev, ...response.content]);
            } else {
                setWatchHistory(response.content);
            }

            setHasMore(pageNum + 1 < response.totalPages);
        } catch (err) {
            console.error('Failed to load watch history:', err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [user]);

    // Initial load
    useEffect(() => {
        loadWatchHistory(0, false);
    }, [loadWatchHistory]);

    // Infinite scroll observer
    useEffect(() => {
        if (!hasMore || loadingMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore) {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    loadWatchHistory(nextPage, true);
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasMore, loadingMore, page, loadWatchHistory]);

    const handleClearHistory = async () => {
        if (!user) return;

        if (window.confirm('모든 시청 기록을 삭제하시겠습니까?')) {
            try {
                await watchHistoryApi.clearAll(user.id);
                setWatchHistory([]);
                showToast('모든 시청 기록이 삭제되었습니다', 'success');
            } catch (err) {
                console.error('Failed to clear history:', err);
                showToast('기록 삭제에 실패했습니다', 'error');
            }
        }
    };

    const handleRemoveItem = async (videoId: number) => {
        if (!user) return;

        try {
            await watchHistoryApi.delete(user.id, videoId);
            setWatchHistory(prev => prev.filter(item => item.video.id !== videoId));
            showToast('시청 기록이 삭제되었습니다', 'success');
        } catch (err) {
            console.error('Failed to remove item:', err);
            showToast('삭제에 실패했습니다', 'error');
        }
    };

    const formatWatchTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}일 전`;
        if (hours > 0) return `${hours}시간 전`;
        if (minutes > 0) return `${minutes}분 전`;
        return '방금 전';
    };

    const calculateProgress = (item: WatchHistoryResponse) => {
        if (item.durationSeconds === 0) return 0;
        return Math.floor((item.progressSeconds / item.durationSeconds) * 100);
    };

    if (!user) {
        return (
            <MainLayout>
                <div className="pb-12 px-4 md:px-6 pt-4 md:pt-6">
                    <EmptyState
                        icon={
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L2 7v10c0 5.5 3.8 10.7 10 12 6.2-1.3 10-6.5 10-12V7l-10-5z" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        }
                        title="로그인이 필요합니다"
                        description="시청 기록을 보려면 로그인해주세요"
                        action={
                            <Button onClick={() => navigate('/login')}>
                                로그인
                            </Button>
                        }
                    />
                </div>
            </MainLayout>
        );
    }

    if (loading) {
        return (
            <MainLayout>
                <div className="pb-12 px-4 md:px-6 pt-4 md:pt-6">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">최근 시청</h1>
                        <p className="text-[var(--color-text-secondary)]">
                            로딩 중...
                        </p>
                    </div>

                    {/* Skeleton Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <VideoCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="pb-12 px-4 md:px-6 pt-4 md:pt-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">최근 시청</h1>
                        <p className="text-[var(--color-text-secondary)]">
                            시청 기록이 자동으로 저장됩니다
                        </p>
                    </div>
                    {watchHistory.length > 0 && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleClearHistory}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            기록 삭제
                        </Button>
                    )}
                </div>

                {/* Watch History */}
                {watchHistory.length > 0 ? (
                    <div className="space-y-6">
                        {/* Group by date */}
                        {(() => {
                            const today = new Date().toDateString();
                            const yesterday = new Date(Date.now() - 86400000).toDateString();

                            const todayItems = watchHistory.filter(
                                (item) => new Date(item.watchedAt).toDateString() === today
                            );
                            const yesterdayItems = watchHistory.filter(
                                (item) => new Date(item.watchedAt).toDateString() === yesterday
                            );
                            const olderItems = watchHistory.filter(
                                (item) =>
                                    new Date(item.watchedAt).toDateString() !== today &&
                                    new Date(item.watchedAt).toDateString() !== yesterday
                            );

                            return (
                                <>
                                    {todayItems.length > 0 && (
                                        <div>
                                            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                                                오늘
                                            </h2>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                                {todayItems.map((item) => (
                                                    <div key={`${item.video.id}-${item.id}`} className="relative group">
                                                        {/* Remove button */}
                                                        <button
                                                            onClick={() => handleRemoveItem(item.video.id)}
                                                            className={cn(
                                                                'absolute top-2 right-2 z-10',
                                                                'w-8 h-8 rounded-full bg-black/70 hover:bg-black/90',
                                                                'flex items-center justify-center',
                                                                'opacity-0 group-hover:opacity-100 transition-opacity'
                                                            )}
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                                <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </button>

                                                        <VideoCard
                                                            video={{
                                                                id: item.video.id,
                                                                youtubeVideoId: item.video.youtubeVideoId,
                                                                title: item.video.title,
                                                                thumbnailUrl: item.video.thumbnailUrl,
                                                                channelName: item.video.channelName,
                                                                durationSeconds: item.video.durationSeconds || 0,
                                                                publishedAt: item.video.publishedAt,
                                                                category: item.video.category as any,
                                                                collectionId: item.video.collectionId,
                                                                watchProgress: calculateProgress(item),
                                                            }}
                                                            onClick={() => navigate(`/player/${item.video.id}`)}
                                                            showProgress
                                                        />

                                                        <div className="mt-2 text-xs text-[var(--color-text-tertiary)]">
                                                            {formatWatchTime(item.watchedAt)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {yesterdayItems.length > 0 && (
                                        <div>
                                            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                                                어제
                                            </h2>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                                {yesterdayItems.map((item) => (
                                                    <div key={`${item.video.id}-${item.id}`} className="relative group">
                                                        <button
                                                            onClick={() => handleRemoveItem(item.video.id)}
                                                            className={cn(
                                                                'absolute top-2 right-2 z-10',
                                                                'w-8 h-8 rounded-full bg-black/70 hover:bg-black/90',
                                                                'flex items-center justify-center',
                                                                'opacity-0 group-hover:opacity-100 transition-opacity'
                                                            )}
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                                <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </button>

                                                        <VideoCard
                                                            video={{
                                                                id: item.video.id,
                                                                youtubeVideoId: item.video.youtubeVideoId,
                                                                title: item.video.title,
                                                                thumbnailUrl: item.video.thumbnailUrl,
                                                                channelName: item.video.channelName,
                                                                durationSeconds: item.video.durationSeconds || 0,
                                                                publishedAt: item.video.publishedAt,
                                                                category: item.video.category as any,
                                                                collectionId: item.video.collectionId,
                                                                watchProgress: calculateProgress(item),
                                                            }}
                                                            onClick={() => navigate(`/player/${item.video.id}`)}
                                                            showProgress
                                                        />

                                                        <div className="mt-2 text-xs text-[var(--color-text-tertiary)]">
                                                            {formatWatchTime(item.watchedAt)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {olderItems.length > 0 && (
                                        <div>
                                            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                                                이전
                                            </h2>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                                {olderItems.map((item) => (
                                                    <div key={`${item.video.id}-${item.id}`} className="relative group">
                                                        <button
                                                            onClick={() => handleRemoveItem(item.video.id)}
                                                            className={cn(
                                                                'absolute top-2 right-2 z-10',
                                                                'w-8 h-8 rounded-full bg-black/70 hover:bg-black/90',
                                                                'flex items-center justify-center',
                                                                'opacity-0 group-hover:opacity-100 transition-opacity'
                                                            )}
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                                <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </button>

                                                        <VideoCard
                                                            video={{
                                                                id: item.video.id,
                                                                youtubeVideoId: item.video.youtubeVideoId,
                                                                title: item.video.title,
                                                                thumbnailUrl: item.video.thumbnailUrl,
                                                                channelName: item.video.channelName,
                                                                durationSeconds: item.video.durationSeconds || 0,
                                                                publishedAt: item.video.publishedAt,
                                                                category: item.video.category as any,
                                                                collectionId: item.video.collectionId,
                                                                watchProgress: calculateProgress(item),
                                                            }}
                                                            onClick={() => navigate(`/player/${item.video.id}`)}
                                                            showProgress
                                                        />

                                                        <div className="mt-2 text-xs text-[var(--color-text-tertiary)]">
                                                            {formatWatchTime(item.watchedAt)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            );
                        })()}

                        {/* Infinite scroll target */}
                        {hasMore && (
                            <div ref={observerTarget} className="flex justify-center py-8">
                                {loadingMore && (
                                    <div className="flex flex-col items-center gap-2">
                                        <LoadingSpinner size="sm" />
                                        <p className="text-sm text-[var(--color-text-tertiary)]">더 불러오는 중...</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <EmptyState
                        icon={
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        }
                        title="시청 기록이 없습니다"
                        description="영상을 시청하면 여기에 기록이 표시됩니다"
                        action={
                            <Button onClick={() => navigate('/')}>
                                영상 둘러보기
                            </Button>
                        }
                    />
                )}
            </div>
        </MainLayout>
    );
}
