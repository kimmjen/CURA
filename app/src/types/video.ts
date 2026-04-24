export interface Video {
    id: number;
    youtubeVideoId: string;
    title: string;
    channelName: string;
    thumbnailUrl: string;
    description?: string;
    durationSeconds: number;
    publishedAt: string;
    category: VideoCategory;
    collectionId: number;
    viewCount?: number;
    watchProgress?: number; // 0-100
}

export interface Collection {
    id: number;
    type: 'OFFICIAL' | 'USER';
    title: string;
    description: string;
    coverImageUrl: string;
    profileImageUrl: string;
    officialLink?: string;
    createdAt: string;
    videoCount: number;
    source?: 'imported' | 'manual';
}

export type VideoCategory =
    | 'LIVE'
    | 'MV'
    | 'FANCAM'
    | 'BROADCAST'
    | 'BEHIND'
    | 'SHORTS'
    | 'INTERVIEW'
    | 'VLOG'
    | 'DANCE'
    | 'COVER'
    | 'REACTION'
    | 'TUTORIAL'
    | 'OTHER';

export const CATEGORY_COLORS: Record<VideoCategory, string> = {
    LIVE: 'var(--color-category-live)',
    MV: 'var(--color-category-mv)',
    FANCAM: 'var(--color-category-fancam)',
    BROADCAST: 'var(--color-category-broadcast)',
    BEHIND: 'var(--color-category-behind)',
    SHORTS: 'var(--color-category-shorts)',
    INTERVIEW: 'var(--color-category-interview)',
    VLOG: '#9e9e9e',
    DANCE: '#e91e63',
    COVER: '#3f51b5',
    REACTION: '#ff5722',
    TUTORIAL: '#8bc34a',
    OTHER: '#607d8b',
};

export const CATEGORY_LABELS: Record<VideoCategory, string> = {
    LIVE: 'Live',
    MV: 'Music Video',
    FANCAM: 'Fancam',
    BROADCAST: 'Broadcast',
    BEHIND: 'Behind',
    SHORTS: 'Shorts',
    INTERVIEW: 'Interview',
    VLOG: 'Vlog',
    DANCE: 'Dance',
    COVER: 'Cover',
    REACTION: 'Reaction',
    TUTORIAL: 'Tutorial',
    OTHER: 'Other',
};
