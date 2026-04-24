import type { Meta, StoryObj } from '@storybook/react';
import { CollectionHeader } from './index';
import type { Collection } from '@/types/video';

const mockCollection: Collection = {
    id: 1,
    type: 'OFFICIAL',
    title: 'Music Videos Collection',
    description: 'Complete collection of official music videos and performances',
    coverImageUrl: 'https://via.placeholder.com/400',
    profileImageUrl: 'https://via.placeholder.com/100',
    createdAt: '2024-01-01T00:00:00Z',
    videoCount: 24,
    source: 'imported',
    officialLink: 'https://youtube.com/@channel',
};

const meta = {
    title: 'Collection/CollectionHeader',
    component: CollectionHeader,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof CollectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Official: Story = {
    args: {
        collection: mockCollection,
        onPlayAll: () => console.log('Play all'),
        onEdit: () => console.log('Edit'),
    },
};

export const UserCollection: Story = {
    args: {
        collection: {
            ...mockCollection,
            type: 'USER',
            title: 'My Favorite Videos',
            description: 'Personal curated collection',
            source: 'manual',
            officialLink: undefined,
        },
        onPlayAll: () => console.log('Play all'),
        onEdit: () => console.log('Edit'),
    },
};

export const ImportedPlaylist: Story = {
    args: {
        collection: {
            ...mockCollection,
            title: 'Imported YouTube Playlist',
            description: 'Auto-synced from YouTube',
            source: 'imported',
        },
        onPlayAll: () => console.log('Play all'),
    },
};

export const WithoutEdit: Story = {
    args: {
        collection: mockCollection,
        onPlayAll: () => console.log('Play all'),
    },
};
