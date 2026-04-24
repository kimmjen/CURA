import type { ReactNode } from 'react';
import { cn } from '@/utils/utils';

export interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}

export default function EmptyState({
    icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center p-12 text-center',
                className
            )}
        >
            {icon && (
                <div className="mb-4 text-[var(--color-text-tertiary)]">
                    {icon}
                </div>
            )}
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                {title}
            </h3>
            {description && (
                <p className="text-[var(--color-text-secondary)] mb-6 max-w-md">
                    {description}
                </p>
            )}
            {action}
        </div>
    );
}
