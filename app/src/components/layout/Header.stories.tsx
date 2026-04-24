import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './index';

const meta = {
    title: 'Layout/Header',
    component: Header,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        onSearch: (query) => console.log('Search:', query),
        onLogoClick: () => console.log('Logo clicked'),
        onProfileClick: () => console.log('Profile clicked'),
    },
};
