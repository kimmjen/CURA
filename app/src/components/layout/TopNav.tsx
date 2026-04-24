import { ReactNode } from 'react';
import { cn } from '@/utils/utils';

export interface TopNavProps {
    left?: ReactNode;
    center?: ReactNode;
    right?: ReactNode;
    className?: string;
}

export default function TopNav({ left, center, right, className }: TopNavProps) {
    return (
        <nav
            className={cn(
                'sticky top-0 z-40 w-full',
                'bg-[var(--color-bg-primary)]/95 backdrop-blur-sm',
                'border-b border-[var(--color-border-default)]',
                className
            )}
        >
            <div className="flex items-center justify-between h-16 px-6">
                {/* Left section */}
                <div className="flex items-center gap-4 flex-1">{left}</div>

                {/* Center section */}
                <div className="flex items-center justify-center flex-1">{center}</div>

                {/* Right section */}
                <div className="flex items-center justify-end gap-4 flex-1">{right}</div>
            </div>
        </nav>
    );
}
