import type { Meta, StoryObj } from '@storybook/react';
import VideoGrid from './VideoGrid';
import { VideoCard } from './index';
import type { Video } from '@/types/video';

const mockVideos: Video[] = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    youtubeVideoId: 'dQw4w9WgXcQ',
    title: `Video Title ${i + 1} - Amazing Performance`,
    channelName: 'Official Channel',
    thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    durationSeconds: 213 + i * 10,
    publishedAt: '2024-01-15T10:00:00Z',
    category: ['MV', 'LIVE', 'FANCAM', 'BEHIND'][i % 4] as any,
    collectionId: 1,
    viewCount: 1234567 + i * 10000,
}));

const meta = {
    title: 'Video/VideoGrid',
    component: VideoGrid,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof VideoGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwoColumns: Story = {
    args: {
        columns: 2,
        children: mockVideos.slice(0, 6).map((video) => (
            <VideoCard key={video.id} video={video} />
        )),
    },
};

export const ThreeColumns: Story = {
    args: {
        columns: 3,
        children: mockVideos.slice(0, 9).map((video) => (
            <VideoCard key={video.id} video={video} />
        )),
    },
};

export const FourColumns: Story = {
    args: {
        columns: 4,
        children: mockVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
        )),
    },
};

export const SixColumns: Story = {
    args: {
        columns: 6,
        children: mockVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
        )),
    },
};
