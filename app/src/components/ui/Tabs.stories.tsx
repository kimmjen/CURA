import type { Meta, StoryObj } from '@storybook/react';
import Tabs from './Tabs';
import type { Tab } from './Tabs';

const sampleTabs: Tab[] = [
    {
        id: 'home',
        label: 'Home',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" />
            </svg>
        ),
        content: <div className="text-[var(--color-text-primary)]">Home content goes here</div>,
    },
    {
        id: 'trending',
        label: 'Trending',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" />
            </svg>
        ),
        content: <div className="text-[var(--color-text-primary)]">Trending videos</div>,
    },
    {
        id: 'collections',
        label: 'Collections',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" />
            </svg>
        ),
        content: <div className="text-[var(--color-text-primary)]">Your collections</div>,
    },
];

const meta = {
    title: 'UI/Tabs',
    component: Tabs,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div style={{ width: '600px' }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        tabs: sampleTabs,
    },
};

export const WithIcons: Story = {
    args: {
        tabs: sampleTabs,
        defaultTab: 'trending',
    },
};

export const WithoutIcons: Story = {
    args: {
        tabs: [
            {
                id: 'tab1',
                label: 'Tab 1',
                content: <div className="text-[var(--color-text-primary)]">Content for tab 1</div>,
            },
            {
                id: 'tab2',
                label: 'Tab 2',
                content: <div className="text-[var(--color-text-primary)]">Content for tab 2</div>,
            },
            {
                id: 'tab3',
                label: 'Tab 3',
                content: <div className="text-[var(--color-text-primary)]">Content for tab 3</div>,
            },
        ],
    },
};

export const ManyTabs: Story = {
    args: {
        tabs: Array.from({ length: 6 }, (_, i) => ({
            id: `tab${i + 1}`,
            label: `Tab ${i + 1}`,
            content: <div className="text-[var(--color-text-primary)]">Content {i + 1}</div>,
        })),
    },
};
