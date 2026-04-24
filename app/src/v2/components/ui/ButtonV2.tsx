import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/utils';

export interface ButtonV2Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gradient';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: ReactNode;
    children?: ReactNode;
    glow?: boolean;
}

const ButtonV2 = forwardRef<HTMLButtonElement, ButtonV2Props>(
    (
        {
            variant = 'primary',
            size = 'md',
            loading = false,
            icon,
            className,
            disabled,
            children,
            glow = false,
            ...props
        },
        ref
    ) => {
        const baseStyles = `
            relative inline-flex items-center justify-center gap-2 font-medium 
            transition-all duration-200 focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            overflow-hidden group
        `;

        const variantStyles = {
            primary: `
                bg-[var(--color-accent-primary)] text-white 
                hover:bg-[var(--color-accent-hover)] 
                shadow-md hover:shadow-lg hover:-translate-y-0.5
                active:translate-y-0 active:shadow-md
                ${glow ? 'hover:glow' : ''}
            `,
            gradient: `
                bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)]
                text-white shadow-lg hover:shadow-xl 
                hover:-translate-y-0.5 hover:glow
                active:translate-y-0 active:shadow-lg
                before:absolute before:inset-0 
                before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0
                before:translate-x-[-200%] hover:before:translate-x-[200%]
                before:transition-transform before:duration-700
            `,
            secondary: `
                bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]
                border border-[var(--color-border-default)]
                hover:bg-[var(--color-bg-tertiary)] hover:border-[var(--color-border-hover)]
                shadow-sm hover:shadow-md hover:-translate-y-0.5
                active:translate-y-0
            `,
            ghost: `
                text-[var(--color-text-primary)] 
                hover:bg-[var(--color-bg-hover)]
                active:bg-[var(--color-bg-tertiary)]
            `,
            danger: `
                bg-[var(--color-error)] text-white 
                hover:opacity-90 shadow-md hover:shadow-lg
                hover:-translate-y-0.5 active:translate-y-0
            `,
        };

        const sizeStyles = {
            sm: 'px-3 py-1.5 text-sm rounded-[var(--radius-md)]',
            md: 'px-4 py-2 text-base rounded-[var(--radius-lg)]',
            lg: 'px-6 py-3 text-lg rounded-[var(--radius-xl)]',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    baseStyles,
                    variantStyles[variant],
                    sizeStyles[size],
                    className
                )}
                disabled={disabled || loading}
                {...props}
            >
                {/* Ripple effect placeholder */}
                <span className="absolute inset-0 opacity-0 group-active:opacity-100 bg-white/20 transition-opacity duration-150 rounded-[inherit]" />

                {loading && (
                    <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {!loading && icon && (
                    <span className="transition-transform group-hover:scale-110 duration-200">
                        {icon}
                    </span>
                )}
                <span className="relative z-10">{children}</span>
            </button>
        );
    }
);

ButtonV2.displayName = 'ButtonV2';

export default ButtonV2;
