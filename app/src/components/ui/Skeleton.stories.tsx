import type { Meta, StoryObj } from '@storybook/react';
import Skeleton from './Skeleton';
import Card from './Card';

const meta = {
    title: 'UI/Skeleton',
    component: Skeleton,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div style={{ width: '400px' }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
    args: {
        variant: 'text',
    },
};

export const MultipleLines: Story = {
    args: {
        variant: 'text',
        count: 3,
    },
};

export const Circular: Story = {
    args: {
        variant: 'circular',
        width: 40,
        height: 40,
    },
};

export const Rectangular: Story = {
    args: {
        variant: 'rectangular',
        width: '100%',
        height: 200,
    },
};

export const VideoCardLoading: Story = {
    render: () => (
        <Card>
            <Skeleton variant="rectangular" width="100%" height={180} className="mb-3" />
            <Skeleton variant="text" width="80%" className="mb-2" />
            <Skeleton variant="text" width="60%" />
        </Card>
    ),
};

export const ProfileLoading: Story = {
    render: () => (
        <div className="flex items-center gap-3">
            <Skeleton variant="circular" width={48} height={48} />
            <div className="flex-1">
                <Skeleton variant="text" width="60%" className="mb-2" />
                <Skeleton variant="text" width="40%" />
            </div>
        </div>
    ),
};
