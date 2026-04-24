import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import ImportPlaylistModal from './ImportPlaylistModal';

const meta = {
    title: 'Modals/ImportPlaylistModal',
    component: ImportPlaylistModal,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof ImportPlaylistModal>;

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
                    플레이리스트 가져오기
                </button>
                <ImportPlaylistModal
                    open={open}
                    onClose={() => setOpen(false)}
                    onImport={async (url) => {
                        console.log('Importing playlist:', url);
                        await new Promise((resolve) => setTimeout(resolve, 2000));
                    }}
                />
            </div>
        );
    },
};

export const Open: Story = {
    render: () => {
        const [open, setOpen] = useState(true);
        return (
            <ImportPlaylistModal
                open={open}
                onClose={() => setOpen(false)}
                onImport={async (url) => {
                    console.log('Importing:', url);
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                }}
            />
        );
    },
};
