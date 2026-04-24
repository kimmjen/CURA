import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/utils/utils';
import { useInfiniteCollections } from '@/api';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import Dropdown, { DropdownItem } from '@/components/ui/Dropdown';
import type { Collection } from '@/types/video';
import { Moon, Sun, Monitor, Globe } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

export interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    path?: string;
    badge?: number;
}

export interface SidebarNavProps {
    className?: string;
}

export default function SidebarNav({ className }: SidebarNavProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        data: collections,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useInfiniteCollections();
    const { ref: loadMoreRef, inView } = useInView();

    React.useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    const { user, signOut } = useAuth();
    const { language, setLanguage } = useLanguage();
    const { t } = useLanguage();
    const { theme, setTheme } = useTheme();

    const mainItems: NavItem[] = [
        {
            id: 'home',
            label: t('sidebar.home'),
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" />
                </svg>
            ),
            path: '/',
        },
        {
            id: 'trending',
            label: t('sidebar.trending'),
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" />
                </svg>
            ),
            path: '/trending',
        },
        {
            id: 'collections',
            label: t('sidebar.collections'),
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" />
                </svg>
            ),
            path: '/collections',
        },
        {
            id: 'recent',
            label: t('sidebar.recent'),
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            ),
            path: '/recent',
        },
    ];

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <aside
            className={cn(
                'w-64 h-screen sticky top-0',
                'bg-[var(--color-bg-primary)] border-r border-[var(--color-border-default)]',
                'flex flex-col',
                className
            )}
        >
            <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 mb-6 px-2 hover:opacity-80 transition-opacity">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--color-accent-primary)">
                            <path d="M12 2L2 7v10c0 5.5 3.8 10.7 10 12 6.2-1.3 10-6.5 10-12V7l-10-5zm0 18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                        </svg>
                        <span className="text-xl font-bold text-[var(--color-text-primary)]">CURA</span>
                    </Link>

                    {/* Main Navigation */}
                    <nav className="space-y-1 mb-6">
                        {mainItems.map((item) => (
                            <Link
                                key={item.id}
                                to={item.path || '#'}
                                className={cn(
                                    'w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-[var(--radius-lg)]',
                                    'text-sm font-medium transition-all',
                                    location.pathname === item.path
                                        ? 'bg-[var(--color-bg-hover)] text-[var(--color-accent-primary)]'
                                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]'
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    <span>{item.label}</span>
                                </div>
                                {item.badge && (
                                    <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--color-accent-primary)] text-white">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Divider */}
                    <div className="h-px bg-[var(--color-border-default)] my-4" />

                    {/* My Collections */}
                    <div className="mb-6 flex flex-col min-h-0">
                        <h3 className="px-3 py-2 text-xs font-semibold text-[var(--color-text-tertiary)] uppercase flex-shrink-0">
                            {t('sidebar.my_collections')}
                        </h3>
                        <div className="space-y-1 flex-1 min-h-0">
                            {collections?.pages?.map((page, i) => (
                                <React.Fragment key={i}>
                                    {page.content.map((collection: Collection) => (
                                        <Link
                                            key={collection.id}
                                            to={`/collection/${collection.id}`}
                                            className={cn(
                                                "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-[var(--radius-lg)] text-sm transition-all",
                                                location.pathname === `/collection/${collection.id}`
                                                    ? "bg-[var(--color-bg-hover)] text-[var(--color-accent-primary)]"
                                                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
                                            )}
                                        >
                                            <span className="truncate">{collection.title}</span>
                                            <span className="text-xs text-[var(--color-text-tertiary)]">
                                                {collection.videoCount || 0}
                                            </span>
                                        </Link>
                                    ))}
                                </React.Fragment>
                            ))}

                            {(isLoading || isFetchingNextPage) && (
                                <div className="px-3 py-2 text-xs text-[var(--color-text-tertiary)] animate-pulse">
                                    Loading...
                                </div>
                            )}

                            <div ref={loadMoreRef} className="h-4" />

                            {!isLoading && collections?.pages?.[0]?.empty && (
                                <div className="px-3 py-2 text-xs text-[var(--color-text-tertiary)]">
                                    {t('sidebar.empty_collections')}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section - User Profile or Login */}
            <div className="border-t border-[var(--color-border-default)] p-4">
                {user ? (
                    // Logged in - Show user profile
                    <Dropdown
                        trigger={
                            <div className="w-full p-3 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-hover)] active:scale-[0.98] rounded-[var(--radius-lg)] border border-[var(--color-border-default)] cursor-pointer transition-all">
                                <div className="flex items-center gap-3">
                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-hover)] flex items-center justify-center text-white font-semibold flex-shrink-0">
                                        {user.email?.[0].toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                                            {user.user_metadata?.username || user.email?.split('@')[0]}
                                        </p>
                                        <p className="text-xs text-[var(--color-text-tertiary)] truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                    {/* Chevron icon to indicate dropdown */}
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 text-[var(--color-text-tertiary)]">
                                        <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        }
                        direction="up"
                        align="start"
                    >
                        {/* Quick Settings: Theme */}
                        <div className="px-3 py-2">
                            <div className="text-[10px] font-semibold text-[var(--color-text-secondary)] uppercase mb-2 flex items-center gap-1">
                                <Monitor size={10} /> {t('sidebar.theme')}
                            </div>
                            <div className="flex bg-[var(--color-bg-primary)] p-1 rounded-md border border-[var(--color-border-default)]">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setTheme('light'); }}
                                    className={cn(
                                        "flex-1 flex justify-center p-1 rounded transition-colors",
                                        theme === 'light' ? 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] shadow-sm' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                                    )}
                                >
                                    <Sun size={14} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setTheme('dark'); }}
                                    className={cn(
                                        "flex-1 flex justify-center p-1 rounded transition-colors",
                                        theme === 'dark' ? 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] shadow-sm' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                                    )}
                                >
                                    <Moon size={14} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setTheme('system'); }}
                                    className={cn(
                                        "flex-1 flex justify-center p-1 rounded transition-colors",
                                        theme === 'system' ? 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] shadow-sm' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                                    )}
                                >
                                    <Monitor size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Quick Settings: Language */}
                        <div className="px-3 pb-2">
                            <div className="text-[10px] font-semibold text-[var(--color-text-secondary)] uppercase mb-2 flex items-center gap-1">
                                <Globe size={10} /> {t('sidebar.language')}
                            </div>
                            <div className="flex bg-[var(--color-bg-primary)] p-1 rounded-md border border-[var(--color-border-default)] text-xs">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setLanguage('en'); }}
                                    className={cn(
                                        "flex-1 py-1 rounded transition-colors",
                                        language === 'en' ? 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] shadow-sm font-medium' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                                    )}
                                >
                                    EN
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setLanguage('ko'); }}
                                    className={cn(
                                        "flex-1 py-1 rounded transition-colors",
                                        language === 'ko' ? 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] shadow-sm font-medium' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                                    )}
                                >
                                    KO
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setLanguage('es'); }}
                                    className={cn(
                                        "flex-1 py-1 rounded transition-colors",
                                        language === 'es' ? 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] shadow-sm font-medium' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                                    )}
                                >
                                    ES
                                </button>
                            </div>
                        </div>

                        <div className="h-px bg-[var(--color-border-default)] my-1" />

                        <DropdownItem onClick={() => window.location.href = '/settings'}>
                            <div className="flex items-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                                    <path d="M12 1v6m0 6v6M5 5l4.24 4.24m5.52 5.52L19 19m0-14l-4.24 4.24M9.76 14.76L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                {t('sidebar.settings')}
                            </div>
                        </DropdownItem>
                        <DropdownItem onClick={handleLogout}>
                            <div className="flex items-center gap-2 text-red-500">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                {t('sidebar.logout')}
                            </div>
                        </DropdownItem>
                    </Dropdown>
                ) : (
                    // Not logged in - Show login button
                    <Link
                        to="/login"
                        className="w-full block p-3 bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-hover)] rounded-[var(--radius-lg)] text-center text-white font-semibold transition-colors"
                    >
                        {t('common.login')}
                    </Link>
                )}
            </div>
        </aside>
    );
}
