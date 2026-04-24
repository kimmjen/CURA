import type { Meta, StoryObj } from '@storybook/react';
import SearchBar from './SearchBar';

const meta = {
    title: 'Layout/SearchBar',
    component: SearchBar,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div style={{ width: '500px' }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        onSearch: (query) => console.log('Search:', query),
    },
};

export const CustomPlaceholder: Story = {
    args: {
        placeholder: '영상, 컬렉션, 채널 검색...',
        onSearch: (query) => console.log('Search:', query),
    },
};
