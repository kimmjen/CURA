import { useState, ReactNode } from 'react';
import { cn } from '@/utils/utils';

export interface TooltipProps {
    content: ReactNode;
    children: ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({ content, children, position = 'top' }: TooltipProps) {
    const [show, setShow] = useState(false);

    const positionStyles = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {children}

            {show && (
                <div
                    className={cn(
                        'absolute z-50 px-3 py-2 text-sm whitespace-nowrap',
                        'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]',
                        'rounded-[var(--radius-md)] shadow-lg',
                        'animate-in fade-in-0 zoom-in-95 duration-100',
                        positionStyles[position]
                    )}
                >
                    {content}
                </div>
            )}
        </div>
    );
}
