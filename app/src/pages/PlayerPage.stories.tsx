import type { Meta, StoryObj } from '@storybook/react';
import PlayerPage from './PlayerPage';

const meta = {
    title: 'Pages/PlayerPage',
    component: PlayerPage,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PlayerPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TheaterMode: Story = {
    render: () => <PlayerPage />,
};
