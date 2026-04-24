import type { Meta, StoryObj } from '@storybook/react';
import ErrorState from './ErrorState';

const meta = {
    title: 'Common/ErrorState',
    component: ErrorState,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        message: 'Failed to load videos. Please try again.',
        onRetry: () => console.log('Retry clicked'),
    },
};

export const NetworkError: Story = {
    args: {
        title: 'Network Error',
        message: 'Unable to connect to the server. Please check your internet connection.',
        onRetry: () => console.log('Retry'),
    },
};

export const NotFound: Story = {
    args: {
        title: 'Not Found',
        message: 'The page you are looking for does not exist.',
    },
};

export const ServerError: Story = {
    args: {
        title: 'Server Error',
        message: 'Something went wrong on our end. Our team has been notified.',
        onRetry: () => console.log('Retry'),
    },
};
