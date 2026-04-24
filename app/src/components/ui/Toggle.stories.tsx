import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Toggle from './Toggle';

const meta = {
    title: 'UI/Toggle',
    component: Toggle,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md'],
        },
        disabled: {
            control: 'boolean',
        },
    },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        label: 'Enable notifications',
    },
};

export const Small: Story = {
    args: {
        label: 'Small toggle',
        size: 'sm',
    },
};

export const Medium: Story = {
    args: {
        label: 'Medium toggle',
        size: 'md',
    },
};

export const Disabled: Story = {
    args: {
        label: 'Disabled toggle',
        disabled: true,
    },
};

export const DisabledChecked: Story = {
    args: {
        label: 'Disabled checked',
        disabled: true,
        defaultChecked: true,
    },
};

export const WithoutLabel: Story = {
    args: {
        size: 'md',
    },
};

export const Controlled: Story = {
    render: () => {
        const [checked, setChecked] = useState(false);
        return (
            <div className="space-y-4">
                <Toggle
                    label="Dark mode"
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                />
                <p className="text-sm text-[var(--color-text-secondary)]">
                    Status: {checked ? 'On' : 'Off'}
                </p>
            </div>
        );
    },
};
