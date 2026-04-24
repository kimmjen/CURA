import type { Meta, StoryObj } from '@storybook/react';
import VideoCard from './VideoCard';
import type { Video } from '@/types/video';

const mockVideo: Video = {
    id: 1,
    youtubeVideoId: 'dQw4w9WgXcQ',
    title: 'Amazing Music Video - Full Performance',
    channelName: 'Official Channel',
    thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    durationSeconds: 213,
    publishedAt: '2024-01-15T10:00:00Z',
    category: 'MV',
    collectionId: 1,
    viewCount: 1234567,
};

const meta = {
    title: 'Video/VideoCard',
    component: VideoCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div style={{ width: '320px' }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof VideoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        video: mockVideo,
    },
};

export const WithProgress: Story = {
    args: {
        video: {
            ...mockVideo,
            watchProgress: 65,
        },
        showProgress: true,
    },
};

export const LiveStream: Story = {
    args: {
        video: {
            ...mockVideo,
            title: '🔴 LIVE: Special Performance',
            category: 'LIVE',
            durationSeconds: 0,
        },
    },
};

export const Fancam: Story = {
    args: {
        video: {
            ...mockVideo,
            title: 'Member Name Fancam - Song Title',
            category: 'FANCAM',
            viewCount: 890000,
        },
    },
};

export const Grid: Story = {
    render: () => (
        <div className="grid grid-cols-3 gap-4" style={{ width: '1000px' }}>
            <VideoCard video={mockVideo} />
            <VideoCard video={{ ...mockVideo, category: 'LIVE', watchProgress: 30 }} showProgress />
            <VideoCard video={{ ...mockVideo, category: 'FANCAM' }} />
            <VideoCard video={{ ...mockVideo, category: 'BEHIND' }} />
            <VideoCard video={{ ...mockVideo, category: 'INTERVIEW' }} />
            <VideoCard video={{ ...mockVideo, category: 'SHORTS' }} />
        </div>
    ),
};
