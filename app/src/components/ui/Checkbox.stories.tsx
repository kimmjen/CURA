import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Checkbox from './Checkbox';

const meta = {
    title: 'UI/Checkbox',
    component: Checkbox,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        disabled: {
            control: 'boolean',
        },
        indeterminate: {
            control: 'boolean',
        },
    },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        label: 'Accept terms and conditions',
    },
};

export const Checked: Story = {
    args: {
        label: 'Checked checkbox',
        defaultChecked: true,
    },
};

export const Disabled: Story = {
    args: {
        label: 'Disabled checkbox',
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

export const Indeterminate: Story = {
    args: {
        label: 'Indeterminate state',
        indeterminate: true,
    },
};

export const WithoutLabel: Story = {
    args: {},
};

export const Group: Story = {
    render: () => (
        <div className="space-y-3">
            <Checkbox label="Option 1" defaultChecked />
            <Checkbox label="Option 2" />
            <Checkbox label="Option 3" />
            <Checkbox label="Option 4 (disabled)" disabled />
        </div>
    ),
};

export const Controlled: Story = {
    render: () => {
        const [checked, setChecked] = useState(false);
        return (
            <div className="space-y-4">
                <Checkbox
                    label="I agree to the terms"
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                />
                <p className="text-sm text-[var(--color-text-secondary)]">
                    Status: {checked ? 'Agreed' : 'Not agreed'}
                </p>
            </div>
        );
    },
};
