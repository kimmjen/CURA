import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { VideoCard, VideoCardSkeleton } from '@/components/video';
import Button from '@/components/ui/Button';
import Dropdown, { DropdownItem } from '@/components/ui/Dropdown';
import { EmptyState } from '@/components/common';
import type { Video } from '@/types/video';

type TimeFilter = 'week' | 'month' | 'all';
type SortBy = 'trending' | 'recent';

export default function TrendingPage() {
    const navigate = useNavigate();
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');
    const [sortBy, setSortBy] = useState<SortBy>('trending');
    const [videos, setVideos] = useState<Video[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch trending or recent videos from API
    useEffect(() => {
        const fetchVideos = async () => {
            setIsLoading(true);
            try {
                const endpoint = sortBy === 'trending'
                    ? '/api/videos/trending?limit=40'
                    : '/api/videos/recent?limit=40';

                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`);
                if (!response.ok) throw new Error('Failed to fetch videos');

                const data = await response.json();
                const videoList = data.videos || data;
                setVideos(filterByTime(videoList));
            } catch (error) {
                console.error('Failed to fetch videos:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVideos();
    }, [sortBy]);

    // Filter videos by time when timeFilter changes
    useEffect(() => {
        if (videos.length > 0) {
            setVideos(prev => filterByTime(prev));
        }
    }, [timeFilter]);

    const filterByTime = (videoList: Video[]) => {
        if (timeFilter === 'all') return videoList;

        const now = new Date();
        return videoList.filter((video) => {
            const publishedDate = new Date(video.publishedAt);

            if (timeFilter === 'week') {
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return publishedDate >= weekAgo;
            } else if (timeFilter === 'month') {
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                return publishedDate >= monthAgo;
            }
            return true;
        });
    };

    const timeFilterLabels: Record<TimeFilter, string> = {
        week: '이번 주',
        month: '이번 달',
        all: '전체',
    };

    if (isLoading) {
        return (
            <MainLayout>
                <div className="pb-12 px-4 md:px-6 pt-4 md:pt-6">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">🔥 인기 영상</h1>
                        <p className="text-[var(--color-text-secondary)]">
                            로딩 중...
                        </p>
                    </div>

                    {/* Skeleton Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 12 }).map((_, i) => (
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
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">🔥 인기 영상</h1>
                    <p className="text-[var(--color-text-secondary)]">
                        {sortBy === 'trending' ? '가장 많이 시청한 영상들을 확인하세요' : '최근에 추가된 영상들을 확인하세요'}
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <div className="flex items-center gap-4">
                        {/* Time Filter */}
                        <Dropdown
                            trigger={
                                <Button variant="secondary" size="sm" className="justify-between min-w-[120px]">
                                    기간: {timeFilterLabels[timeFilter]}
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Button>
                            }
                        >
                            <DropdownItem onClick={() => setTimeFilter('week')}>이번 주</DropdownItem>
                            <DropdownItem onClick={() => setTimeFilter('month')}>이번 달</DropdownItem>
                            <DropdownItem onClick={() => setTimeFilter('all')}>전체</DropdownItem>
                        </Dropdown>

                        {/* Sort */}
                        <Dropdown
                            trigger={
                                <Button variant="secondary" size="sm" className="justify-between min-w-[120px]">
                                    정렬: {sortBy === 'trending' ? '인기순' : '최신순'}
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Button>
                            }
                        >
                            <DropdownItem onClick={() => setSortBy('trending')}>인기순</DropdownItem>
                            <DropdownItem onClick={() => setSortBy('recent')}>최신순</DropdownItem>
                        </Dropdown>
                    </div>

                    <div className="ml-auto text-sm text-[var(--color-text-tertiary)]">
                        {videos.length}개의 영상
                    </div>
                </div>

                {/* Video Grid */}
                {videos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {videos.map((video) => (
                            <VideoCard
                                key={video.id}
                                video={video}
                                onClick={() => navigate(`/player/${video.id}`)}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        }
                        title="인기 영상이 없습니다"
                        description="선택한 기간에 해당하는 영상이 없습니다"
                    />
                )}
            </div>
        </MainLayout>
    );
}
