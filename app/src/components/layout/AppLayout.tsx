import type { ReactNode } from 'react';
import { cn } from '@/utils/utils';

export interface AppLayoutProps {
    sidebar?: ReactNode;
    topNav?: ReactNode;
    children: ReactNode;
    className?: string;
}

export default function AppLayout({ sidebar, topNav, children, className }: AppLayoutProps) {
    return (
        <div className={cn('min-h-screen bg-[var(--color-bg-primary)]', className)}>
            {/* Top Navigation */}
            {topNav}

            <div className="flex">
                {/* Sidebar */}
                {sidebar}

                {/* Main Content */}
                <main className="flex-1 min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
}
