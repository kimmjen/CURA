import type { Meta, StoryObj } from '@storybook/react';
import CollectionCard from './CollectionCard';
import type { Collection } from '@/types/video';

const mockCollection: Collection = {
    id: 1,
    type: 'OFFICIAL',
    title: 'Artist Name - Music Videos',
    description: 'Complete collection of official music videos',
    coverImageUrl: 'https://via.placeholder.com/400',
    profileImageUrl: 'https://via.placeholder.com/100',
    createdAt: '2024-01-01T00:00:00Z',
    videoCount: 24,
    source: 'imported',
};

const meta = {
    title: 'Collection/CollectionCard',
    component: CollectionCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div style={{ width: '320px' }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof CollectionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Official: Story = {
    args: {
        collection: mockCollection,
    },
};

export const Custom: Story = {
    args: {
        collection: {
            ...mockCollection,
            type: 'USER',
            title: 'My Favorite Videos',
            description: 'Personal curated collection',
            source: 'manual',
        },
    },
};

export const Grid: Story = {
    render: () => (
        <div className="grid grid-cols-3 gap-4" style={{ width: '1000px' }}>
            <CollectionCard collection={mockCollection} />
            <CollectionCard
                collection={{ ...mockCollection, title: 'Dance Performances', videoCount: 18 }}
            />
            <CollectionCard
                collection={{
                    ...mockCollection,
                    type: 'USER',
                    title: 'Favorites',
                    source: 'manual',
                    videoCount: 12,
                }}
            />
        </div>
    ),
};
