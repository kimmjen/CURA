import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    children: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, className, children, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    className={clsx(
                        'w-full bg-black border rounded-lg p-3 pr-10 text-white',
                        'focus:border-white focus:outline-none transition-colors',
                        'cursor-pointer',
                        error ? 'border-red-500' : 'border-gray-800',
                        className
                    )}
                    {...props}
                >
                    {children}
                </select>
                {error && (
                    <p className="mt-1 text-xs text-red-400">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';
