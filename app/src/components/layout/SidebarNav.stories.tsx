import type { Meta, StoryObj } from '@storybook/react';
import { SidebarNav } from './index';

const meta = {
    title: 'Layout/SidebarNav',
    component: SidebarNav,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof SidebarNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        onNavigate: (path) => console.log('Navigate to:', path),
    },
};
