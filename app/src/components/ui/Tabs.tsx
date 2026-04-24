import { useState, type ReactNode } from 'react';
import { cn } from '@/utils/utils';

export interface Tab {
    id: string;
    label: string;
    icon?: ReactNode;
    content: ReactNode;
}

export interface TabsProps {
    tabs: Tab[];
    defaultTab?: string;
    onChange?: (tabId: string) => void;
    className?: string;
}

export default function Tabs({ tabs, defaultTab, onChange, className }: TabsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        onChange?.(tabId);
    };

    const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

    return (
        <div className={cn('w-full', className)}>
            {/* Tab Headers */}
            <div className="flex border-b border-[var(--color-border-default)] -mx-6 px-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={cn(
                            'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all',
                            'border-b-2 -mb-px',
                            activeTab === tab.id
                                ? 'border-[var(--color-accent-primary)] text-[var(--color-text-primary)]'
                                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                        )}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="py-6">
                {activeTabContent}
            </div>
        </div>
    );
}
