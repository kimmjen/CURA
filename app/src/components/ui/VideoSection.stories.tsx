import type { Meta, StoryObj } from '@storybook/react';
import VideoSection from './VideoSection';
import { VideoCard } from '@/components/video';
import type { Video } from '@/types/video';

const mockVideos: Video[] = Array.from({ length: 8 }, (_, i) => ({
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
    watchProgress: i % 3 === 0 ? 65 : undefined,
}));

const meta = {
    title: 'UI/VideoSection',
    component: VideoSection,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div className="bg-[var(--color-bg-primary)] p-0">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof VideoSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        title: '추천 영상',
        onViewAll: () => console.log('View all clicked'),
        children: mockVideos.slice(0, 6).map((video) => (
            <div key={video.id} className="flex-shrink-0 w-80">
                <VideoCard video={video} showProgress={video.watchProgress !== undefined} />
            </div>
        )),
    },
};

export const RecentlyWatched: Story = {
    args: {
        title: '최근 시청한 영상',
        onViewAll: () => console.log('View all'),
        children: mockVideos.slice(0, 6).map((video) => (
            <div key={video.id} className="flex-shrink-0 w-80">
                <VideoCard video={video} showProgress />
            </div>
        )),
    },
};

export const Trending: Story = {
    args: {
        title: '인기 영상',
        onViewAll: () => console.log('View all'),
        children: mockVideos.slice(0, 6).map((video) => (
            <div key={video.id} className="flex-shrink-0 w-80">
                <VideoCard video={{ ...video, category: 'LIVE' }} />
            </div>
        )),
    },
};

export const ManyVideos: Story = {
    args: {
        title: '새로 추가된 영상',
        onViewAll: () => console.log('View all'),
        children: mockVideos.map((video) => (
            <div key={video.id} className="flex-shrink-0 w-80">
                <VideoCard video={video} />
            </div>
        )),
    },
};

export const WithoutViewAll: Story = {
    args: {
        title: 'Shorts',
        children: mockVideos.slice(0, 6).map((video) => (
            <div key={video.id} className="flex-shrink-0 w-80">
                <VideoCard video={{ ...video, category: 'SHORTS' }} />
            </div>
        )),
    },
};
