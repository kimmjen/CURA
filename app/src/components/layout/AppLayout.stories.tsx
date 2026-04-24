import type { Meta, StoryObj } from '@storybook/react';
import AppLayout from './AppLayout';

const meta = {
    title: 'Layout/AppLayout',
    component: AppLayout,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof AppLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: (
            <div className="p-8">
                <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">
                    App Content
                </h1>
                <p className="text-[var(--color-text-secondary)]">
                    AppLayout wraps your content with Sidebar and TopNav.
                </p>
            </div>
        ),
    },
};
