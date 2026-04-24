import type { ReactNode } from 'react';
import { cn } from '@/utils/utils';

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}

export default function PageHeader({
    title,
    description,
    action,
    className
}: PageHeaderProps) {
    return (
        <div className={cn("mb-8 flex items-end justify-between", className)}>
            <div>
                <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">{title}</h1>
                {description && (
                    <p className="text-[var(--color-text-secondary)] mt-2">
                        {description}
                    </p>
                )}
            </div>
            {action && (
                <div className="flex-shrink-0">
                    {action}
                </div>
            )}
        </div>
    );
}
