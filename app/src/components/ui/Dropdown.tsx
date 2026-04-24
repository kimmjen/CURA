import { useState, useRef, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/utils/utils';

const DropdownContext = createContext<{ close: () => void } | null>(null);

export interface DropdownProps {
    trigger: ReactNode;
    children: ReactNode;
    align?: 'start' | 'center' | 'end';
    direction?: 'up' | 'down';
}

export default function Dropdown({ trigger, children, align = 'start', direction = 'down' }: DropdownProps) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false);
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [open]);

    const alignStyles = {
        start: 'left-0',
        center: 'left-1/2 -translate-x-1/2',
        end: 'right-0',
    };

    const directionStyles = {
        down: 'top-full mt-2',
        up: 'bottom-full mb-2',
    };

    return (
        <div ref={dropdownRef} className="relative inline-block">
            <div onClick={() => setOpen(!open)}>{trigger}</div>

            {open && (
                <DropdownContext.Provider value={{ close: () => setOpen(false) }}>
                    <div
                        className={cn(
                            'absolute z-50 min-w-[200px]',
                            'bg-[var(--color-bg-secondary)] rounded-[var(--radius-lg)]',
                            'border border-[var(--color-border-default)] shadow-lg',
                            'py-2',
                            'animate-in fade-in-0 zoom-in-95 duration-100',
                            alignStyles[align],
                            directionStyles[direction]
                        )}
                    >
                        {children}
                    </div>
                </DropdownContext.Provider>
            )}
        </div>
    );
}

export function DropdownItem({
    children,
    onClick,
    disabled,
    className,
}: {
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}) {
    const context = useContext(DropdownContext);

    const handleClick = () => {
        if (!disabled && onClick) {
            onClick();
            context?.close(); // Auto-close dropdown after click
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className={cn(
                'w-full px-4 py-2 text-left text-sm',
                'text-[var(--color-text-primary)]',
                'hover:bg-[var(--color-bg-hover)] transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                className
            )}
        >
            {children}
        </button>
    );
}
