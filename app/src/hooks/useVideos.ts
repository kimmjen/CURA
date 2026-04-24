import type { Collection, Video } from '@/types/video';

// Stub hook kept for Sidebar's legacy "My Collections" section.
// Real collection data comes from @/api/hooks::useCollections.
export const useVideos = () => {
    return {
        collections: [] as Collection[],
        videos: [] as Video[],
        addVideo: () => { },
        markAsWatched: () => { },
    };
};
