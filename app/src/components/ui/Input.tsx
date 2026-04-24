import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
    helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, label, helperText, type = 'text', id, ...props }, ref) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
                    >
                        {label}
                    </label>
                )}
                <input
                    id={inputId}
                    type={type}
                    className={cn(
                        'w-full px-4 py-2 rounded-[var(--radius-lg)]',
                        'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]',
                        'border border-[var(--color-border-default)]',
                        'transition-all duration-[var(--transition-base)]',
                        'placeholder:text-[var(--color-text-tertiary)]',
                        'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:border-transparent',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        error && 'border-[var(--color-error)] focus:ring-[var(--color-error)]',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {(error || helperText) && (
                    <p
                        className={cn(
                            'mt-2 text-sm',
                            error ? 'text-[var(--color-error)]' : 'text-[var(--color-text-secondary)]'
                        )}
                    >
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
