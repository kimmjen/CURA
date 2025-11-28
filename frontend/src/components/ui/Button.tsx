import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-white text-black font-bold hover:bg-gray-200 focus:ring-white',
    accent: 'bg-blue-600 text-white font-bold hover:bg-blue-500 focus:ring-blue-400',
    secondary: 'bg-gray-800 text-white font-bold hover:bg-gray-700 focus:ring-gray-600',
    danger: 'bg-red-900/20 text-red-400 border border-red-900/50 font-bold hover:bg-red-900/40 focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-white/10 text-white focus:ring-white/40'
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-4 py-2 text-sm rounded-md',
    md: 'px-6 py-3 rounded-lg',
    lg: 'px-8 py-4 text-lg rounded-lg',
    icon: 'p-3 rounded-full'
};

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    children,
    className,
    ...props
}) => {
    return (
        <button
            className={clsx(
                'transition-all duration-200 inline-flex items-center justify-center gap-2',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                variantStyles[variant],
                sizeStyles[size],
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {children}
        </button>
    );
};
