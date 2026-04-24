import { HTMLAttributes } from 'react';
import { cn } from '@/utils/utils';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
    count?: number;
}

export default function Skeleton({
    variant = 'text',
    width,
    height,
    count = 1,
    className,
    ...props
}: SkeletonProps) {
    const baseStyles = 'animate-pulse bg-[var(--color-bg-tertiary)]';

    const variantStyles = {
        text: 'rounded-[var(--radius-md)] h-4',
        circular: 'rounded-full',
        rectangular: 'rounded-[var(--radius-lg)]',
    };

    const skeletonStyle = {
        width: width,
        height: variant === 'text' ? undefined : height,
    };

    if (count > 1) {
        return (
            <div className="space-y-2">
                {Array.from({ length: count }).map((_, index) => (
                    <div
                        key={index}
                        className={cn(baseStyles, variantStyles[variant], className)}
                        style={skeletonStyle}
                        {...props}
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            className={cn(baseStyles, variantStyles[variant], className)}
            style={skeletonStyle}
            {...props}
        />
    );
}
