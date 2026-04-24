import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/utils';
import type { VideoCategory } from '@/types/video';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/types/video';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'category' | 'status' | 'count';
    category?: VideoCategory;
    label?: string;
    size?: 'sm' | 'md';
}

export default function Badge({
    variant = 'status',
    category,
    label,
    size = 'sm',
    className,
    ...props
}: BadgeProps) {
    const sizeStyles = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
    };

    const getCategoryStyle = (cat: VideoCategory) => {
        const color = CATEGORY_COLORS[cat];
        return {
            backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)`,
            color: color,
            borderColor: color,
        };
    };

    if (variant === 'category' && category) {
        const style = getCategoryStyle(category);
        return (
            <span
                className={cn(
                    'inline-flex items-center gap-1 rounded-[var(--radius-md)] font-medium border',
                    sizeStyles[size],
                    className
                )}
                style={style}
                {...props}
            >
                {CATEGORY_LABELS[category]}
            </span>
        );
    }

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 rounded-[var(--radius-md)] font-medium',
                'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]',
                sizeStyles[size],
                className
            )}
            {...props}
        >
            {label}
        </span>
    );
}
