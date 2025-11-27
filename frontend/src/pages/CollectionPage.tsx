import React, { useState, useEffect } from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useParams } from 'react-router-dom';
import { CollectionHeader } from '../features/collection/components/CollectionHeader';
import { CollectionHeaderSkeleton } from '../features/collection/components/CollectionHeaderSkeleton';
import { VideoThreadCardSkeleton } from '../features/feed/components/VideoThreadCardSkeleton';
import { clsx } from 'clsx';
import { LayoutGrid, List, Filter } from 'lucide-react';

import { CollectionInfoSection } from '../features/collection/components/CollectionInfoSection';
import { CollectionVideoGrid } from '../features/collection/components/CollectionVideoGrid';

type Tab = 'ALL' | 'MV' | 'LIVE' | 'SHORTS' | 'INTERVIEW' | 'INFO' | 'FANCAM' | 'BEHIND' | 'VLOG';

import * as api from '../api';

export const CollectionPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<Tab>('ALL');
    const [viewMode, setViewMode] = useState<'LIST' | 'GRID'>('LIST');

    // Reset tab when ID changes
    useEffect(() => {
        setActiveTab('ALL');
    }, [id]);

    // Fetch Collection Details
    const { data: collection, isLoading: isCollectionLoading, error: collectionError } = useQuery({
        queryKey: ['collection', id],
        queryFn: () => api.getCollection(id!),
        enabled: !!id,
    });

    // Fetch Videos with Infinite Scroll
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isVideosLoading,
        error: videosError
    } = useInfiniteQuery({
        queryKey: ['videos', id],
        queryFn: ({ pageParam = 0 }) => api.getCollectionVideos(id!, pageParam, 20),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 20 ? allPages.length * 20 : undefined;
        },
        initialPageParam: 0,
        enabled: !!id,
    });

    // Flatten videos from all pages
    const videos = data?.pages.flatMap(page => page) || [];

    // Intersection Observer for infinite scroll
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage]);

    if (collectionError) console.error('Collection Query Error:', collectionError);
    if (videosError) console.error('Videos Query Error:', videosError);

    if (isCollectionLoading || (isVideosLoading && !videos.length)) {
        return (
            <div className="min-h-screen bg-black">
                <CollectionHeaderSkeleton />
                <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
                    {[1, 2].map((i) => <VideoThreadCardSkeleton key={i} />)}
                </div>
            </div>
        );
    }

    if (!collection) return <div className="text-white text-center py-20">Collection not found</div>;

    // Filter videos based on active tab
    const filteredVideos = videos.filter((video: any) => {
        if (activeTab === 'ALL' || activeTab === 'INFO') return true;
        return video.category === activeTab;
    });

    return (
        <div className="pb-32">
            {/* Hero Section */}
            <CollectionHeader
                title={collection.title}
                description={collection.description}
                coverImageUrl={collection.cover_image_url}
                profileImageUrl={collection.profile_image_url}
                officialLink={collection.official_link}
                isOfficial={collection.type === 'OFFICIAL'}
            />

            {/* Sticky Navigation Bar */}
            <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Left: Tabs */}
                    <div className="flex items-center gap-8 h-full overflow-x-auto no-scrollbar max-w-full">
                        <TabButton label="ALL" active={activeTab === 'ALL'} onClick={() => setActiveTab('ALL')} />
                        <TabButton label="OFFICIAL MV" active={activeTab === 'MV'} onClick={() => setActiveTab('MV')} />
                        <TabButton label="LIVE STAGE" active={activeTab === 'LIVE'} onClick={() => setActiveTab('LIVE')} />
                        <TabButton label="FAN CAM" active={activeTab === 'FANCAM'} onClick={() => setActiveTab('FANCAM')} />
                        <TabButton label="SHORTS" active={activeTab === 'SHORTS'} onClick={() => setActiveTab('SHORTS')} />
                        <TabButton label="INTERVIEW" active={activeTab === 'INTERVIEW'} onClick={() => setActiveTab('INTERVIEW')} />
                        <TabButton label="BEHIND" active={activeTab === 'BEHIND'} onClick={() => setActiveTab('BEHIND')} />
                        <TabButton label="VLOG" active={activeTab === 'VLOG'} onClick={() => setActiveTab('VLOG')} />
                        <TabButton label="INFO" active={activeTab === 'INFO'} onClick={() => setActiveTab('INFO')} />
                    </div>

                    {/* Right: View Options (Desktop only) */}
                    {activeTab !== 'INFO' && activeTab !== 'SHORTS' && (
                        <div className="hidden md:flex items-center gap-4 text-gray-500">
                            <button className="hover:text-white transition"><Filter className="w-5 h-5" /></button>
                            <div className="w-[1px] h-4 bg-gray-800" />
                            <button
                                onClick={() => setViewMode('LIST')}
                                className={clsx("transition", viewMode === 'LIST' ? "text-white" : "hover:text-white")}
                            >
                                <List className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('GRID')}
                                className={clsx("transition", viewMode === 'GRID' ? "text-white" : "hover:text-white")}
                            >
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <main className="max-w-5xl mx-auto px-6 py-12">
                {activeTab === 'INFO' ? (
                    <CollectionInfoSection collection={collection} videoCount={videos?.length || 0} />
                ) : (
                    <>
                        {/* Editorial Section Header */}
                        <div className="mb-12 flex items-end justify-between border-b border-white/10 pb-4">
                            <div>
                                <h2 className="text-3xl font-bold text-white tracking-tighter mb-1">
                                    {activeTab === 'ALL' ? 'LATEST DROPS' : activeTab}
                                </h2>
                                <p className="text-gray-400 text-sm font-mono">COLLECTION #{collection.id.toString().padStart(3, '0')}</p>
                            </div>
                            <div className="text-right hidden md:block">
                                <p className="text-white font-bold text-lg">{filteredVideos?.length || 0}</p>
                                <p className="text-gray-500 text-xs uppercase tracking-wider">Items</p>
                            </div>
                        </div>

                        {/* Feed */}
                        <CollectionVideoGrid
                            videos={filteredVideos}
                            activeTab={activeTab}
                            viewMode={viewMode}
                            collection={collection}
                        />

                        {/* Loading Indicator / Sentinel */}
                        {(activeTab === 'ALL' || activeTab === 'SHORTS') && (
                            <div ref={ref} className="py-8 flex justify-center">
                                {isFetchingNextPage && <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

const TabButton = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
        onClick={onClick}
        className={clsx(
            "text-xs font-bold tracking-widest transition-colors relative h-full flex items-center whitespace-nowrap uppercase",
            active ? "text-white" : "text-gray-500 hover:text-gray-300"
        )}
    >
        {label}
        {active && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white" />
        )}
    </button>
);
