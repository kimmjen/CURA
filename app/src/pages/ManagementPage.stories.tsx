import type { Meta, StoryObj } from '@storybook/react';
import ManagementPage from './ManagementPage';

const meta = {
    title: 'Pages/ManagementPage',
    component: ManagementPage,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof ManagementPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CollectionsTab: Story = {
    render: () => <ManagementPage />,
};
