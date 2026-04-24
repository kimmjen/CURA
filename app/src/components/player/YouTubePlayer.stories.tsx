import type { Meta, StoryObj } from '@storybook/react';
import YouTubePlayer from './YouTubePlayer';

const meta = {
    title: 'Player/YouTubePlayer',
    component: YouTubePlayer,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div style={{ width: '800px' }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof YouTubePlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        videoId: 'dQw4w9WgXcQ',
    },
};

export const Autoplay: Story = {
    args: {
        videoId: 'dQw4w9WgXcQ',
        autoplay: true,
    },
};
