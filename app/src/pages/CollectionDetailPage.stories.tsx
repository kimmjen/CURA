import type { Meta, StoryObj } from '@storybook/react';
import CollectionDetailPage from './CollectionDetailPage';

const meta = {
    title: 'Pages/CollectionDetailPage',
    component: CollectionDetailPage,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof CollectionDetailPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const GridView: Story = {
    render: () => <CollectionDetailPage />,
};
