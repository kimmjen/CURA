import type { ReactNode } from 'react';
import { cn } from '@/utils/utils';

export interface VideoGridProps {
    children: ReactNode;
    columns?: 2 | 3 | 4 | 6;
    gap?: 2 | 4 | 6 | 8;
    className?: string;
}

export default function VideoGrid({
    children,
    columns = 4,
    gap = 4,
    className,
}: VideoGridProps) {
    const columnStyles = {
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
    };

    const gapStyles = {
        2: 'gap-2',
        4: 'gap-4',
        6: 'gap-6',
        8: 'gap-8',
    };

    return (
        <div className={cn('grid', columnStyles[columns], gapStyles[gap], className)}>
            {children}
        </div>
    );
}
