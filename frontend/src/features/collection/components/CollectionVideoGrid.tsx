import React, { useState } from 'react';
import { clsx } from 'clsx';
import { VideoThreadCard } from '../../feed/components/VideoThreadCard';
import { ShortsCard } from '../../feed/components/ShortsCard';
import { ShortsPlayerModal } from '../../feed/components/ShortsPlayerModal';

interface CollectionVideoGridProps {
    videos: any[];
    activeTab: string;
    viewMode: 'LIST' | 'GRID';
    collection: any;
}

export const CollectionVideoGrid: React.FC<CollectionVideoGridProps> = ({ videos, activeTab, viewMode, collection }) => {
    const [selectedShort, setSelectedShort] = useState<any>(null);

    // Special Layout for Shorts
    if (activeTab === 'SHORTS') {
        return (
            <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {videos.map((video) => (
                        <ShortsCard
                            key={video.id}
                            video={{
                                id: video.id,
                                title: video.title,
                                thumbnailUrl: video.thumbnail_url,
                                youtubeVideoId: video.youtube_video_id
                            }}
                            onPlay={() => setSelectedShort(video)}
                        />
                    ))}
                    {videos.length === 0 && (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            No Shorts found in this collection.
                        </div>
                    )}
                </div>

                <ShortsPlayerModal
                    isOpen={!!selectedShort}
                    onClose={() => setSelectedShort(null)}
                    video={selectedShort ? {
                        title: selectedShort.title,
                        youtubeVideoId: selectedShort.youtube_video_id
                    } : null}
                />
            </>
        );
    }

    // Standard Layout for other videos
    return (
        <div className={clsx(
            "grid gap-12",
            viewMode === 'GRID' ? "md:grid-cols-2" : "grid-cols-1"
        )}>
            {videos.map((video) => (
                <VideoThreadCard
                    key={video.id}
                    video={{
                        ...video,
                        youtubeVideoId: video.youtube_video_id,
                        channelName: video.channel_name,
                        thumbnailUrl: video.thumbnail_url,
                        publishedAt: video.published_at,
                        tags: video.category ? [video.category] : []
                    }}
                    curatorName={collection.title + " Official"}
                    curatorAvatar={collection.profile_image_url || "https://via.placeholder.com/150"}
                    variant={viewMode === 'GRID' ? 'compact' : 'full'}
                />
            ))}

            {videos.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    No videos found in this category.
                </div>
            )}
        </div>
    );
};
