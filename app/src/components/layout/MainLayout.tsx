import type { ReactNode } from 'react';
import Header from './Header';
import SidebarNav from './SidebarNav';

export interface MainLayoutProps {
    children: ReactNode;
    onSearch?: (query: string) => void;
    onNavigate?: (path: string) => void;
}

export default function MainLayout({ children, onSearch, onNavigate }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            {/* Header */}
            {/* <Header onSearch={onSearch} /> */}

            {/* Main Container */}
            <div className="flex">
                {/* Sidebar - Hidden on mobile */}
                <div className="hidden lg:block">
                    <SidebarNav onNavigate={onNavigate} />
                </div>

                {/* Content */}
                <main className="flex-1 min-h-screen overflow-x-hidden w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
