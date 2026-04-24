import { ReactNode } from 'react';
import { cn } from '@/utils/utils';

export interface SettingsSectionItem {
    id: string;
    label: string;
    icon: ReactNode;
}

interface SettingsSidebarProps {
    sections: SettingsSectionItem[];
    activeSection: string;
    onSectionChange: (id: string) => void;
}

export default function SettingsSidebar({
    sections,
    activeSection,
    onSectionChange
}: SettingsSidebarProps) {
    return (
        <nav className="space-y-1 sticky top-6">
            {sections.map((section) => (
                <button
                    key={section.id}
                    onClick={() => onSectionChange(section.id)}
                    className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-[var(--radius-lg)] text-sm font-medium transition-all group',
                        activeSection === section.id
                            ? 'bg-[var(--color-bg-hover)] text-[var(--color-accent-primary)] shadow-sm'
                            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]'
                    )}
                >
                    <span className={cn(
                        "transition-colors",
                        activeSection === section.id
                            ? "text-[var(--color-accent-primary)]"
                            : "text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-secondary)]"
                    )}>
                        {section.icon}
                    </span>
                    <span>{section.label}</span>
                </button>
            ))}
        </nav>
    );
}
