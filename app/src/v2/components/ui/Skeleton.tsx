import { cn } from '@/utils/utils';

export interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
    shimmer?: boolean;
}

export default function Skeleton({
    className,
    variant = 'rectangular',
    width,
    height,
    shimmer = true,
}: SkeletonProps) {
    const variantStyles = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-[var(--radius-lg)]',
    };

    const style: React.CSSProperties = {
        width: width || (variant === 'circular' ? height : '100%'),
        height: height || '100%',
    };

    return (
        <div
            className={cn(
                'bg-[var(--color-bg-tertiary)] animate-pulse',
                variantStyles[variant],
                shimmer && 'shimmer',
                className
            )}
            style={style}
        />
    );
}

// Preset Skeleton Components
export function SkeletonVideoCard() {
    return (
        <div className="space-y-3">
            <Skeleton variant="rectangular" height={180} shimmer />
            <div className="space-y-2">
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="90%" />
                <Skeleton variant="text" width="40%" />
            </div>
        </div>
    );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    variant="text"
                    width={i === lines - 1 ? '60%' : '100%'}
                />
            ))}
        </div>
    );
}
