import type { Meta, StoryObj } from '@storybook/react';
import LoadingSpinner from './LoadingSpinner';

const meta = {
    title: 'Common/LoadingSpinner',
    component: LoadingSpinner,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof LoadingSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
    args: {
        size: 'sm',
    },
};

export const Medium: Story = {
    args: {
        size: 'md',
    },
};

export const Large: Story = {
    args: {
        size: 'lg',
    },
};

export const InContext: Story = {
    render: () => (
        <div className="flex flex-col items-center gap-4 p-8">
            <LoadingSpinner size="lg" />
            <p className="text-[var(--color-text-secondary)]">Loading videos...</p>
        </div>
    ),
};
