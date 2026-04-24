import type { ReactNode } from 'react';
import { cn } from '@/utils/utils';

export interface GlassCardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    hover?: boolean;
    border?: 'default' | 'gradient' | 'glow';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function GlassCard({
    children,
    className,
    onClick,
    hover = true,
    border = 'default',
    padding = 'md',
}: GlassCardProps) {
    const paddingStyles = {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
    };

    const borderStyles = {
        default: 'border border-[var(--color-glass-border)]',
        gradient: 'border border-transparent bg-clip-padding before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-br before:from-[var(--color-accent-primary)] before:to-[var(--color-accent-secondary)] before:rounded-[inherit]',
        glow: 'border border-[var(--color-glass-border)] hover:glow-sm',
    };

    return (
        <div
            onClick={onClick}
            className={cn(
                'relative glass rounded-[var(--radius-xl)]',
                'backdrop-blur-md',
                'transition-all duration-300',
                borderStyles[border],
                paddingStyles[padding],
                hover && 'hover:bg-[var(--color-glass-hover)] hover:scale-[1.02] hover:shadow-xl',
                onClick && 'cursor-pointer',
                className
            )}
        >
            {children}
        </div>
    );
}
