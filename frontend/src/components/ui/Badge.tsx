import React from 'react';
import { clsx } from 'clsx';

type BadgeVariant = 'default' | 'outline' | 'active' | 'inactive';

interface BadgeProps {
    variant?: BadgeVariant;
    children: React.ReactNode;
    className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
    default: 'px-2 py-1 rounded border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-wider',
    outline: 'px-2 py-1 rounded border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-wider',
    active: 'px-3 py-1.5 rounded-full text-xs font-bold bg-white text-black',
    inactive: 'px-3 py-1.5 rounded-full text-xs font-bold bg-gray-800 text-gray-400'
};

export const Badge: React.FC<BadgeProps> = ({
    variant = 'default',
    children,
    className
}) => {
    return (
        <span className={clsx(variantStyles[variant], className)}>
            {children}
        </span>
    );
};
