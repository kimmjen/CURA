import type { ReactNode } from 'react';
import { cn } from '@/utils/utils';

interface SettingsSectionProps {
    title: string;
    description?: string;
    children: ReactNode;
    icon?: ReactNode;
    className?: string;
}

export default function SettingsSection({
    title,
    description,
    children,
    icon,
    className
}: SettingsSectionProps) {
    return (
        <div className={cn("space-y-4", className)}>
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-default)]">
                {icon && <div className="text-[var(--color-text-secondary)]">{icon}</div>}
                <h2 className="text-xl font-bold text-[var(--color-text-primary)]">{title}</h2>
            </div>
            {description && (
                <p className="text-sm text-[var(--color-text-tertiary)] -mt-2">
                    {description}
                </p>
            )}
            <div className="space-y-3">
                {children}
            </div>
        </div>
    );
}
