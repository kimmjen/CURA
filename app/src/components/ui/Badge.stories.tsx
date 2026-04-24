import type { Meta, StoryObj } from '@storybook/react';
import Badge from './Badge';

const meta = {
    title: 'UI/Badge',
    component: Badge,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CategoryLive: Story = {
    args: {
        variant: 'category',
        category: 'LIVE',
    },
};

export const CategoryMV: Story = {
    args: {
        variant: 'category',
        category: 'MV',
    },
};

export const CategoryFancam: Story = {
    args: {
        variant: 'category',
        category: 'FANCAM',
    },
};

export const CategoryBroadcast: Story = {
    args: {
        variant: 'category',
        category: 'BROADCAST',
    },
};

export const CategoryBehind: Story = {
    args: {
        variant: 'category',
        category: 'BEHIND',
    },
};

export const CategoryShorts: Story = {
    args: {
        variant: 'category',
        category: 'SHORTS',
    },
};

export const CategoryInterview: Story = {
    args: {
        variant: 'category',
        category: 'INTERVIEW',
    },
};

export const AllCategories: Story = {
    render: () => (
        <div className="flex flex-wrap gap-2">
            <Badge variant="category" category="LIVE" />
            <Badge variant="category" category="MV" />
            <Badge variant="category" category="FANCAM" />
            <Badge variant="category" category="BROADCAST" />
            <Badge variant="category" category="BEHIND" />
            <Badge variant="category" category="SHORTS" />
            <Badge variant="category" category="INTERVIEW" />
            <Badge variant="category" category="VLOG" />
            <Badge variant="category" category="DANCE" />
            <Badge variant="category" category="COVER" />
        </div>
    ),
};

export const StatusBadge: Story = {
    args: {
        variant: 'status',
        label: 'New',
    },
};

export const CountBadge: Story = {
    args: {
        variant: 'count',
        label: '24',
    },
};

export const LargeSize: Story = {
    args: {
        variant: 'category',
        category: 'LIVE',
        size: 'md',
    },
};
