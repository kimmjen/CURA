import type { Meta, StoryObj } from '@storybook/react';
import { MainLayout } from './index';

const meta = {
    title: 'Layout/MainLayout',
    component: MainLayout,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof MainLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: (
            <div className="p-8">
                <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">
                    Main Content Area
                </h1>
                <p className="text-[var(--color-text-secondary)]">
                    This is where your page content goes. The MainLayout includes Header and SidebarNav.
                </p>
            </div>
        ),
    },
};

export const WithContent: Story = {
    args: {
        children: (
            <div className="p-8 space-y-6">
                <section>
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
                        최근 시청한 영상
                    </h2>
                    <div className="grid grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="aspect-video bg-[var(--color-bg-tertiary)] rounded-[var(--radius-lg)]" />
                        ))}
                    </div>
                </section>
                <section>
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
                        인기 영상
                    </h2>
                    <div className="grid grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="aspect-video bg-[var(--color-bg-tertiary)] rounded-[var(--radius-lg)]" />
                        ))}
                    </div>
                </section>
            </div>
        ),
    },
};
