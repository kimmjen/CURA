import type { Meta, StoryObj } from '@storybook/react';
import { PlayerLayout } from './index';
import { YouTubePlayer } from '@/components/player';

const meta = {
    title: 'Layout/PlayerLayout',
    component: PlayerLayout,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PlayerLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        onBack: () => console.log('Back clicked'),
        player: <YouTubePlayer videoId="dQw4w9WgXcQ" />,
        info: (
            <div>
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
                    Video Title - Amazing Performance
                </h1>
                <p className="text-[var(--color-text-secondary)]">
                    Video description and metadata goes here...
                </p>
            </div>
        ),
        playlist: (
            <div className="p-4">
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-4">
                    재생목록 (10)
                </h3>
                <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex gap-2 p-2 rounded-[var(--radius-lg)] hover:bg-[var(--color-bg-hover)] cursor-pointer"
                        >
                            <div className="w-24 h-14 bg-[var(--color-bg-tertiary)] rounded-[var(--radius-md)]" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                                    Video {i + 1}
                                </p>
                                <p className="text-xs text-[var(--color-text-tertiary)]">
                                    Channel Name
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ),
    },
};
