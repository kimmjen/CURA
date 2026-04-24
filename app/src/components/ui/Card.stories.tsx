import type { Meta, StoryObj } from '@storybook/react';
import Card from './Card';

const meta = {
    title: 'UI/Card',
    component: Card,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div style={{ width: '400px' }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: (
            <div>
                <h3 className="text-xl font-semibold mb-2">Card Title</h3>
                <p className="text-[var(--color-text-secondary)]">
                    This is a default card with some content inside.
                </p>
            </div>
        ),
    },
};

export const Hoverable: Story = {
    args: {
        variant: 'hoverable',
        children: (
            <div>
                <h3 className="text-xl font-semibold mb-2">Hoverable Card</h3>
                <p className="text-[var(--color-text-secondary)]">
                    Hover over this card to see the background change.
                </p>
            </div>
        ),
    },
};

export const Clickable: Story = {
    args: {
        variant: 'clickable',
        onClick: () => alert('Card clicked!'),
        children: (
            <div>
                <h3 className="text-xl font-semibold mb-2">Clickable Card</h3>
                <p className="text-[var(--color-text-secondary)]">
                    Click this card to trigger an action.
                </p>
            </div>
        ),
    },
};

export const NoPadding: Story = {
    args: {
        padding: 'none',
        children: (
            <img
                src="https://via.placeholder.com/400x200"
                alt="Placeholder"
                className="w-full rounded-[var(--radius-xl)]"
            />
        ),
    },
};

export const SmallPadding: Story = {
    args: {
        padding: 'sm',
        children: <p>Small padding card</p>,
    },
};

export const LargePadding: Story = {
    args: {
        padding: 'lg',
        children: (
            <div>
                <h3 className="text-2xl font-bold mb-4">Large Padding</h3>
                <p className="text-[var(--color-text-secondary)]">
                    This card has extra spacing for a more spacious feel.
                </p>
            </div>
        ),
    },
};
