import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
    label?: string;
    helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, error, label, helperText, id, ...props }, ref) => {
        const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
                    >
                        {label}
                    </label>
                )}
                <textarea
                    id={textareaId}
                    className={cn(
                        'w-full px-4 py-2 rounded-[var(--radius-lg)]',
                        'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]',
                        'border border-[var(--color-border-default)]',
                        'transition-all duration-[var(--transition-base)]',
                        'placeholder:text-[var(--color-text-tertiary)]',
                        'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:border-transparent',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        'resize-y min-h-[100px]',
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

Textarea.displayName = 'Textarea';

export default Textarea;
