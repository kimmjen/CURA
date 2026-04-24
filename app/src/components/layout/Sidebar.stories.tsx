import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar, SidebarSection, SidebarItem } from './Sidebar';

const meta = {
    title: 'Layout/Sidebar',
    component: Sidebar,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Sidebar>
            <SidebarSection title="Main">
                <SidebarItem icon="🏠" label="Home" active />
                <SidebarItem icon="🔥" label="Trending" />
                <SidebarItem icon="📚" label="Collections" />
            </SidebarSection>
            <SidebarSection title="My Collections">
                <SidebarItem label="Music Videos" />
                <SidebarItem label="Live Performances" />
                <SidebarItem label="Behind Scenes" />
            </SidebarSection>
        </Sidebar>
    ),
};

export const WithBadges: Story = {
    render: () => (
        <Sidebar>
            <SidebarSection title="Navigation">
                <SidebarItem icon="🏠" label="Home" active />
                <SidebarItem icon="🔥" label="Trending" badge={5} />
                <SidebarItem icon="📚" label="Collections" />
                <SidebarItem icon="⏰" label="Recent" badge={12} />
            </SidebarSection>
        </Sidebar>
    ),
};
