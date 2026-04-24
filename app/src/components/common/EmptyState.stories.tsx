import type { Meta, StoryObj } from '@storybook/react';
import EmptyState from './EmptyState';
import Button from '@/components/ui/Button';

const meta = {
    title: 'Common/EmptyState',
    component: EmptyState,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        title: 'No videos yet',
        description: 'Start adding videos to your collection',
    },
};

export const WithIcon: Story = {
    args: {
        icon: (
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
        title: 'No results found',
        description: 'Try adjusting your search or filters',
    },
};

export const WithAction: Story = {
    args: {
        title: 'No collections',
        description: 'Create your first collection to organize videos',
        action: <Button>Create Collection</Button>,
    },
};

export const Complete: Story = {
    args: {
        icon: (
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: 'No videos',
        description: 'Upload or import videos to get started',
        action: (
            <div className="flex gap-2">
                <Button>Import from YouTube</Button>
                <Button variant="secondary">Upload Video</Button>
            </div>
        ),
    },
};
