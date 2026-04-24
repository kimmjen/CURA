import type { Meta, StoryObj } from '@storybook/react';
import ShortsCard from './ShortsCard';
import type { Video } from '@/types/video';

const mockShort: Video = {
    id: 1,
    youtubeVideoId: 'short123',
    title: 'Amazing Dance Challenge #shorts',
    channelName: 'Dance Channel',
    thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    durationSeconds: 45,
    publishedAt: '2024-01-15T10:00:00Z',
    category: 'SHORTS',
    collectionId: 1,
    viewCount: 2500000,
};

const meta = {
    title: 'Video/ShortsCard',
    component: ShortsCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof ShortsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        video: mockShort,
    },
};

export const HighViews: Story = {
    args: {
        video: {
            ...mockShort,
            viewCount: 15000000,
            title: 'Viral Dance Trend 🔥',
        },
    },
};

export const Grid: Story = {
    render: () => (
        <div className="flex gap-4">
            <ShortsCard video={mockShort} />
            <ShortsCard video={{ ...mockShort, title: 'Behind the Scenes #shorts' }} />
            <ShortsCard video={{ ...mockShort, title: 'Quick Tutorial #shorts', viewCount: 890000 }} />
            <ShortsCard video={{ ...mockShort, title: 'Funny Moment 😂 #shorts' }} />
        </div>
    ),
};
