import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '@/utils/utils';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    indeterminate?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, indeterminate, className, ...props }, ref) => {
        return (
            <label className="inline-flex items-center gap-2 cursor-pointer">
                <div className="relative">
                    <input
                        ref={ref}
                        type="checkbox"
                        className={cn(
                            'w-5 h-5 rounded-[var(--radius-sm)] border-2 transition-all',
                            'border-[var(--color-border-default)] bg-[var(--color-bg-secondary)]',
                            'checked:bg-[var(--color-accent-primary)] checked:border-[var(--color-accent-primary)]',
                            'focus:ring-2 focus:ring-[var(--color-accent-primary)]/20',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                            'cursor-pointer',
                            className
                        )}
                        {...props}
                    />
                    {(props.checked || indeterminate) && (
                        <svg
                            className="absolute inset-0 w-5 h-5 text-white pointer-events-none"
                            viewBox="0 0 20 20"
                            fill="none"
                        >
                            {indeterminate ? (
                                <path d="M6 10h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            ) : (
                                <path
                                    d="M6 10l3 3 5-6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            )}
                        </svg>
                    )}
                </div>
                {label && (
                    <span className="text-sm text-[var(--color-text-primary)]">
                        {label}
                    </span>
                )}
            </label>
        );
    }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
