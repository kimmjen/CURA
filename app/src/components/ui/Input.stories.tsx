import type { Meta, StoryObj } from '@storybook/react';
import Input from './Input';

const meta = {
    title: 'UI/Input',
    component: Input,
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
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        placeholder: 'Enter text...',
    },
};

export const WithLabel: Story = {
    args: {
        label: 'Email',
        placeholder: 'you@example.com',
        type: 'email',
    },
};

export const WithHelperText: Story = {
    args: {
        label: 'Username',
        placeholder: 'john_doe',
        helperText: 'Choose a unique username',
    },
};

export const WithError: Story = {
    args: {
        label: 'Password',
        type: 'password',
        error: 'Password must be at least 8 characters',
    },
};

export const Disabled: Story = {
    args: {
        label: 'Disabled Input',
        placeholder: 'Cannot edit',
        disabled: true,
    },
};

export const Search: Story = {
    args: {
        type: 'search',
        placeholder: 'Search videos...',
    },
};
