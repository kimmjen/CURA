import type { Meta, StoryObj } from '@storybook/react';
import Tooltip from './Tooltip';
import Button from './Button';

const meta = {
    title: 'UI/Tooltip',
    component: Tooltip,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Top: Story = {
    render: () => (
        <Tooltip content="This is a tooltip" position="top">
            <Button>Hover me (Top)</Button>
        </Tooltip>
    ),
};

export const Bottom: Story = {
    render: () => (
        <Tooltip content="Bottom tooltip" position="bottom">
            <Button>Hover me (Bottom)</Button>
        </Tooltip>
    ),
};

export const Left: Story = {
    render: () => (
        <Tooltip content="Left side" position="left">
            <Button>Hover me (Left)</Button>
        </Tooltip>
    ),
};

export const Right: Story = {
    render: () => (
        <Tooltip content="Right side" position="right">
            <Button>Hover me (Right)</Button>
        </Tooltip>
    ),
};
