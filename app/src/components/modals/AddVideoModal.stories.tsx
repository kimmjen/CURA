import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import AddVideoModal from './AddVideoModal';

const meta = {
    title: 'Modals/AddVideoModal',
    component: AddVideoModal,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof AddVideoModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <div>
                <button
                    onClick={() => setOpen(true)}
                    className="px-4 py-2 bg-[var(--color-accent-primary)] text-white rounded-[var(--radius-lg)] font-medium"
                >
                    비디오 추가
                </button>
                <AddVideoModal
                    open={open}
                    onClose={() => setOpen(false)}
                    onAdd={async (url) => {
                        console.log('Adding video:', url);
                        await new Promise((resolve) => setTimeout(resolve, 1000));
                    }}
                />
            </div>
        );
    },
};

export const WithCollection: Story = {
    render: () => {
        const [open, setOpen] = useState(true);
        return (
            <AddVideoModal
                open={open}
                onClose={() => setOpen(false)}
                onAdd={async (url) => {
                    console.log('Adding video to collection:', url);
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }}
                collectionId={1}
            />
        );
    },
};
