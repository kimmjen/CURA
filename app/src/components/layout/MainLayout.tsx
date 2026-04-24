import type { ReactNode } from 'react';
import SidebarNav from './SidebarNav';

export interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <div className="flex">
                {/* Sidebar - Hidden on mobile */}
                <div className="hidden lg:block">
                    <SidebarNav />
                </div>

                {/* Content */}
                <main className="flex-1 min-h-screen overflow-x-hidden w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
