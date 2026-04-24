import type { Meta, StoryObj } from '@storybook/react';
import Textarea from './Textarea';

const meta = {
    title: 'UI/Textarea',
    component: Textarea,
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
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        placeholder: 'Enter your message...',
    },
};

export const WithLabel: Story = {
    args: {
        label: 'Description',
        placeholder: 'Describe your video...',
    },
};

export const WithHelperText: Story = {
    args: {
        label: 'Comments',
        placeholder: 'Write your comment...',
        helperText: 'Maximum 500 characters',
    },
};

export const WithError: Story = {
    args: {
        label: 'Message',
        placeholder: 'Enter message...',
        error: 'This field is required',
    },
};

export const Disabled: Story = {
    args: {
        label: 'Disabled',
        placeholder: 'Cannot edit...',
        disabled: true,
    },
};
