import type { Meta, StoryObj } from '@storybook/react';
import Dropdown, { DropdownItem } from './Dropdown';
import Button from './Button';

const meta = {
    title: 'UI/Dropdown',
    component: Dropdown,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Dropdown trigger={<Button>Open Menu</Button>}>
            <DropdownItem onClick={() => alert('Edit')}>Edit</DropdownItem>
            <DropdownItem onClick={() => alert('Duplicate')}>Duplicate</DropdownItem>
            <DropdownItem onClick={() => alert('Delete')}>Delete</DropdownItem>
        </Dropdown>
    ),
};

export const WithIcons: Story = {
    render: () => (
        <Dropdown trigger={<Button variant="secondary">Actions</Button>}>
            <DropdownItem>📝 Edit</DropdownItem>
            <DropdownItem>📋 Copy</DropdownItem>
            <DropdownItem>🗑️ Delete</DropdownItem>
        </Dropdown>
    ),
};

export const AlignEnd: Story = {
    render: () => (
        <Dropdown trigger={<Button>Menu</Button>} align="end">
            <DropdownItem>Profile</DropdownItem>
            <DropdownItem>Settings</DropdownItem>
            <DropdownItem>Logout</DropdownItem>
        </Dropdown>
    ),
};
