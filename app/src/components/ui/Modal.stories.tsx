import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';

const meta = {
    title: 'UI/Modal',
    component: Modal,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Button onClick={() => setOpen(true)}>Open Modal</Button>
                <Modal open={open} onClose={() => setOpen(false)} title="Modal Title">
                    <p className="text-[var(--color-text-secondary)]">
                        This is a modal dialog. Click outside or press Escape to close.
                    </p>
                    <div className="mt-4 flex gap-2 justify-end">
                        <Button variant="secondary" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => setOpen(false)}>Confirm</Button>
                    </div>
                </Modal>
            </>
        );
    },
};

export const Small: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Button onClick={() => setOpen(true)}>Small Modal</Button>
                <Modal open={open} onClose={() => setOpen(false)} title="Small" size="sm">
                    <p>Small modal content</p>
                </Modal>
            </>
        );
    },
};

export const Large: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Button onClick={() => setOpen(true)}>Large Modal</Button>
                <Modal open={open} onClose={() => setOpen(false)} title="Large Modal" size="lg">
                    <p>Large modal with more content...</p>
                </Modal>
            </>
        );
    },
};
