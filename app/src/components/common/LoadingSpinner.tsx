import { cn } from '@/utils/utils';

export interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
    const sizeStyles = {
        sm: 'w-6 h-6 border-2',
        md: 'w-12 h-12 border-4',
        lg: 'w-16 h-16 border-4',
    };

    return (
        <div
            className={cn(
                'border-[var(--color-accent-primary)] border-t-transparent rounded-full animate-spin',
                sizeStyles[size],
                className
            )}
        />
    );
}
