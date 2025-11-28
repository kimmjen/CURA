import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className,
    hover = false
}) => {
    return (
        <div
            className={clsx(
                'bg-gray-900/30 p-4 rounded-lg border border-white/5',
                'transition-all duration-200',
                hover && 'hover:border-white/20 hover:shadow-lg',
                className
            )}
        >
            {children}
        </div>
    );
};
