import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import CreateCollectionModal from './CreateCollectionModal';

const meta = {
    title: 'Modals/CreateCollectionModal',
    component: CreateCollectionModal,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof CreateCollectionModal>;

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
                    새 컬렉션 만들기
                </button>
                <CreateCollectionModal
                    open={open}
                    onClose={() => setOpen(false)}
                    onCreate={async (data) => {
                        console.log('Creating collection:', data);
                        await new Promise((resolve) => setTimeout(resolve, 1000));
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
            <CreateCollectionModal
                open={open}
                onClose={() => setOpen(false)}
                onCreate={async (data) => {
                    console.log('Creating:', data);
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }}
            />
        );
    },
};
