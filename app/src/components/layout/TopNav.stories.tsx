import type { Meta, StoryObj } from '@storybook/react';
import TopNav from './TopNav';

const meta = {
    title: 'Layout/TopNav',
    component: TopNav,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof TopNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        left: <div className="font-bold">CURA</div>,
        center: <div>Center Content</div>,
        right: <div>Right Content</div>,
    },
};

export const WithSearch: Story = {
    args: {
        left: (
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[var(--color-accent-primary)] rounded-full" />
                <span className="font-bold">CURA</span>
            </div>
        ),
        center: (
            <input
                type="search"
                placeholder="Search..."
                className="px-4 py-2 bg-[var(--color-bg-tertiary)] rounded-full w-96"
            />
        ),
        right: (
            <div className="flex items-center gap-4">
                <button>🔔</button>
                <div className="w-8 h-8 bg-gray-500 rounded-full" />
            </div>
        ),
    },
};
