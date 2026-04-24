import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import ImportVideosModal from './ImportVideosModal';
import Button from '@/components/ui/Button';

const meta = {
    title: 'Modals/ImportVideosModal',
    component: ImportVideosModal,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof ImportVideosModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <div>
                <Button onClick={() => setOpen(true)}>
                    비디오 가져오기
                </Button>
                <ImportVideosModal
                    open={open}
                    onClose={() => setOpen(false)}
                    collectionId={1}
                    onImport={async (data) => {
                        console.log('Importing:', data);
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
            <ImportVideosModal
                open={open}
                onClose={() => setOpen(false)}
                collectionId={1}
                onImport={async (data) => {
                    console.log('Importing:', data);
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                }}
            />
        );
    },
};

export const VideoTab: Story = {
    render: () => (
        <ImportVideosModal
            open={true}
            onClose={() => { }}
            collectionId={1}
            onImport={async (data) => console.log('Import video:', data)}
        />
    ),
};
