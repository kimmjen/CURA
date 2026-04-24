import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '@/utils/utils';

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
    label?: string;
    size?: 'sm' | 'md';
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
    ({ label, size = 'md', className, disabled, ...props }, ref) => {
        const sizeStyles = {
            sm: 'w-10 h-5',
            md: 'w-12 h-6',
        };

        const thumbSizeStyles = {
            sm: 'w-4 h-4',
            md: 'w-5 h-5',
        };

        return (
            <label className={cn('inline-flex items-center gap-3 cursor-pointer', disabled && 'opacity-50 cursor-not-allowed')}>
                <div className="relative">
                    <input
                        ref={ref}
                        type="checkbox"
                        className="sr-only peer"
                        disabled={disabled}
                        {...props}
                    />
                    <div
                        className={cn(
                            'rounded-full transition-colors',
                            'bg-[var(--color-bg-tertiary)] peer-checked:bg-[var(--color-accent-primary)]',
                            'peer-focus:ring-2 peer-focus:ring-[var(--color-accent-primary)]/20',
                            sizeStyles[size],
                            className
                        )}
                    />
                    <div
                        className={cn(
                            'absolute top-0.5 left-0.5 rounded-full bg-white transition-transform',
                            'peer-checked:translate-x-full',
                            thumbSizeStyles[size],
                            size === 'sm' && 'peer-checked:translate-x-5',
                            size === 'md' && 'peer-checked:translate-x-6'
                        )}
                    />
                </div>
                {label && (
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">
                        {label}
                    </span>
                )}
            </label>
        );
    }
);

Toggle.displayName = 'Toggle';

export default Toggle;
