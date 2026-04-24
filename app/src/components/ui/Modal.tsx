import { useEffect, useRef, ReactNode, HTMLAttributes } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/utils';

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'full';
}

export default function Modal({
    open,
    onClose,
    title,
    children,
    size = 'md',
    className,
    ...props
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (open) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    if (!open) return null;

    const sizeStyles = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        full: 'max-w-6xl',
    };

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal */}
            <div
                ref={modalRef}
                className={cn(
                    'relative w-full bg-[var(--color-bg-secondary)] rounded-[var(--radius-xl)]',
                    'border border-[var(--color-border-default)] shadow-xl',
                    'animate-in fade-in-0 zoom-in-95 duration-200',
                    sizeStyles[size],
                    className
                )}
                {...props}
            >
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between p-6 border-b border-[var(--color-border-default)]">
                        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M18 6L6 18M6 6l12 12"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Content */}
                <div className="p-6">{children}</div>
            </div>
        </div>,
        document.body
    );
}
