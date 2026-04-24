import type { Meta, StoryObj } from '@storybook/react';
import Avatar from './Avatar';

const meta = {
    title: 'UI/Avatar',
    component: Avatar,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
    args: {
        src: 'https://i.pravatar.cc/150?img=1',
        alt: 'User Avatar',
    },
};

export const Fallback: Story = {
    args: {
        alt: 'John Doe',
    },
};

export const CustomFallback: Story = {
    args: {
        alt: 'User',
        fallback: 'JD',
    },
};

export const Small: Story = {
    args: {
        src: 'https://i.pravatar.cc/150?img=2',
        alt: 'User',
        size: 'sm',
    },
};

export const Medium: Story = {
    args: {
        src: 'https://i.pravatar.cc/150?img=3',
        alt: 'User',
        size: 'md',
    },
};

export const Large: Story = {
    args: {
        src: 'https://i.pravatar.cc/150?img=4',
        alt: 'User',
        size: 'lg',
    },
};

export const ExtraLarge: Story = {
    args: {
        src: 'https://i.pravatar.cc/150?img=5',
        alt: 'User',
        size: 'xl',
    },
};

export const Group: Story = {
    render: () => (
        <div className="flex -space-x-4">
            <Avatar src="https://i.pravatar.cc/150?img=1" alt="User 1" />
            <Avatar src="https://i.pravatar.cc/150?img=2" alt="User 2" />
            <Avatar src="https://i.pravatar.cc/150?img=3" alt="User 3" />
            <Avatar alt="User 4" fallback="+5" />
        </div>
    ),
};
