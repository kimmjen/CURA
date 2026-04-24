import { HTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/utils/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'hoverable' | 'clickable';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    children?: ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ variant = 'default', padding = 'md', className, children, ...props }, ref) => {
        const paddingStyles = {
            none: '',
            sm: 'p-3',
            md: 'p-4',
            lg: 'p-6',
        };

        const variantStyles = {
            default: 'bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)]',
            hoverable: 'bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] hover:bg-[var(--color-bg-tertiary)] transition-colors',
            clickable: 'bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] hover:scale-105 hover:shadow-lg cursor-pointer transition-all',
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-[var(--radius-xl)]',
                    variantStyles[variant],
                    paddingStyles[padding],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

export default Card;
