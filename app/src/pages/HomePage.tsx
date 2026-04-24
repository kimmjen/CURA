import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import VideoSection from '@/components/ui/VideoSection';
import { VideoCard, HeroBanner } from '@/components/video';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { LoadingSpinner, PageHeader } from '@/components/common';
import { useCollections, api } from '@/api';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Video, VideoCategory } from '@/types/video';

export default function HomePage() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { data: collections, isLoading: collectionsLoading } = useCollections();
    const [allVideos, setAllVideos] = useState<Video[]>([]);
    const [isLoadingVideos, setIsLoadingVideos] = useState(false);
    const [heroVideo, setHeroVideo] = useState<Video | null>(null);

    // Fetch all videos from all collections
    useEffect(() => {
        const fetchAllVideos = async () => {
            if (!collections || collections.empty) return;

            setIsLoadingVideos(true);
            try {
                // Fetch videos with smaller size and better error handling
                // Check if collections.content exists (paginated) or fallback to collections (array)
                const collectionList = collections.content || collections;

                const videoPromises = collectionList.map(async (collection: any) => {
                    try {
                        const result = await api.getVideos(collection.id, { size: 20 });
                        return result;
                    } catch (error) {
                        console.warn(`Failed to fetch videos for collection ${collection.id}:`, error);
                        return { videos: [] };
                    }
                });

                const results = await Promise.all(videoPromises);
                const videos = results.flatMap(result => result.videos || []);
                setAllVideos(videos);

                // Set random hero video (exclude SHORTS - vertical format)
                if (videos.length > 0) {
                    const heroEligibleVideos = videos.filter(v => v.category !== 'SHORTS');
                    if (heroEligibleVideos.length > 0) {
                        const randomIndex = Math.floor(Math.random() * Math.min(heroEligibleVideos.length, 10));
                        setHeroVideo(heroEligibleVideos[randomIndex]);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch videos:', error);
                // Set empty array on error
                setAllVideos([]);
            } finally {
                setIsLoadingVideos(false);
            }
        };

        fetchAllVideos();
    }, [collections]);

    // Get videos by category
    const getVideosByCategory = (category: VideoCategory, limit = 12) => {
        return allVideos
            .filter(v => v.category === category)
            .slice(0, limit);
    };

    // Memoize expensive derived data
    const recentVideos = useMemo(() => {
        return [...allVideos]
            .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
            .slice(0, 12);
    }, [allVideos]);

    const popularVideos = useMemo(() => {
        return [...allVideos]
            .filter(v => v.viewCount)
            .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
            .slice(0, 12);
    }, [allVideos]);

    const recommendedVideos = useMemo(() => {
        // Create a stable shuffle based on allVideos length or just shuffle once when allVideos loads
        if (allVideos.length === 0) return [];
        const shuffled = [...allVideos].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 12);
    }, [allVideos]);

    if (collectionsLoading || isLoadingVideos) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-screen">
                    <LoadingSpinner size="lg" />
                </div>
            </MainLayout>
        );
    }

    // Check for empty collections using the new response structure
    if (!collections || (collections.empty && allVideos.length === 0)) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center h-screen px-6">
                    <div className="text-center max-w-2xl">
                        <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
                            {t('home.welcome_title')}
                        </h1>
                        <p className="text-lg text-[var(--color-text-secondary)] mb-8">
                            {t('home.welcome_desc')}
                        </p>
                        <Button size="lg" onClick={() => navigate('/collections')}>
                            {t('common.playrt_btn')}
                        </Button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="pb-12 px-4 md:px-6 pt-4 md:pt-6 max-w-7xl mx-auto">
                {/* Hero Banner */}
                {heroVideo && <HeroBanner video={heroVideo} />}


                {/* Recommended for You */}
                {
                    recommendedVideos.length > 0 && (
                        <VideoSection
                            title={t('home.recommended')}
                            onViewAll={() => navigate('/collections')}
                        >
                            {recommendedVideos.map((video: Video) => (
                                <div key={video.id} className="flex-shrink-0 w-64 sm:w-72">
                                    <VideoCard
                                        video={video}
                                        onClick={() => navigate(`/player/${video.id}`)}
                                    />
                                </div>
                            ))}
                        </VideoSection>
                    )
                }

                {/* Recent Videos */}
                {/* {getRecentVideos().length > 0 && (
                    <VideoSection
                        title="최근 추가된 영상"
                        onViewAll={() => navigate('/collections')}
                    >
                        {getRecentVideos().map((video) => (
                            <div key={video.id} className="flex-shrink-0 w-64 sm:w-72">
                                <VideoCard
                                    video={video}
                                    onClick={() => navigate(`/player/${video.id}`)}
                                />
                            </div>
                        ))}
                    </VideoSection>
                )} */}

                {/* Popular Videos */}
                {
                    popularVideos.length > 0 && (
                        <VideoSection
                            title={t('home.popular')}
                            onViewAll={() => navigate('/collections')}
                        >
                            {popularVideos.map((video: Video) => (
                                <div key={video.id} className="flex-shrink-0 w-64 sm:w-72">
                                    <VideoCard
                                        video={video}
                                        onClick={() => navigate(`/player/${video.id}`)}
                                    />
                                </div>
                            ))}
                        </VideoSection>
                    )
                }

                {/* Music Videos */}
                {
                    getVideosByCategory('MV').length > 0 && (
                        <VideoSection
                            title={t('home.music')}
                            onViewAll={() => navigate('/collections')}
                        >
                            {getVideosByCategory('MV').map((video) => (
                                <div key={video.id} className="flex-shrink-0 w-64 sm:w-72">
                                    <VideoCard
                                        video={video}
                                        onClick={() => navigate(`/player/${video.id}`)}
                                    />
                                </div>
                            ))}
                        </VideoSection>
                    )
                }

                {/* Live Performances */}
                {
                    getVideosByCategory('LIVE').length > 0 && (
                        <VideoSection
                            title={t('home.live')}
                            onViewAll={() => navigate('/collections')}
                        >
                            {getVideosByCategory('LIVE').map((video) => (
                                <div key={video.id} className="flex-shrink-0 w-64 sm:w-72">
                                    <VideoCard
                                        video={video}
                                        onClick={() => navigate(`/player/${video.id}`)}
                                    />
                                </div>
                            ))}
                        </VideoSection>
                    )
                }

                {/* Fancams */}
                {
                    getVideosByCategory('FANCAM').length > 0 && (
                        <VideoSection
                            title={t('home.fancam')}
                            onViewAll={() => navigate('/collections')}
                        >
                            {getVideosByCategory('FANCAM').map((video) => (
                                <div key={video.id} className="flex-shrink-0 w-64 sm:w-72">
                                    <VideoCard
                                        video={video}
                                        onClick={() => navigate(`/player/${video.id}`)}
                                    />
                                </div>
                            ))}
                        </VideoSection>
                    )
                }

                {/* Behind the Scenes */}
                {/* {getVideosByCategory('BEHIND').length > 0 && (
                    <VideoSection
                        title="비하인드"
                        onViewAll={() => navigate('/collections')}
                    >
                        {getVideosByCategory('BEHIND').map((video) => (
                            <div key={video.id} className="flex-shrink-0 w-64 sm:w-72">
                                <VideoCard
                                    video={video}
                                    onClick={() => navigate(`/player/${video.id}`)}
                                />
                            </div>
                        ))}
                    </VideoSection>
                )} */}


            </div >
        </MainLayout >
    );
}
