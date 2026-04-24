import type { ReactNode } from 'react';
import { cn } from '@/utils/utils';

interface SettingsItemProps {
    title: string;
    description?: string;
    children?: ReactNode;
    icon?: ReactNode;
    className?: string;
}

export default function SettingsItem({
    title,
    description,
    children,
    icon,
    className
}: SettingsItemProps) {
    return (
        <div className={cn(
            "flex items-center justify-between p-4 bg-[var(--color-bg-primary)] rounded-[var(--radius-lg)] border border-[var(--color-border-default)] hover:border-[var(--color-border-hover)] transition-all",
            className
        )}>
            <div className="flex items-start gap-4">
                {icon && (
                    <div className="mt-1 text-[var(--color-text-secondary)]">
                        {icon}
                    </div>
                )}
                <div>
                    <p className="font-semibold text-[var(--color-text-primary)]">{title}</p>
                    {description && (
                        <p className="text-sm text-[var(--color-text-tertiary)] mt-1">
                            {description}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex-shrink-0 ml-4">
                {children}
            </div>
        </div>
    );
}
