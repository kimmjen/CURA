import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useVideos } from '@/hooks/useVideos';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import Dropdown, { DropdownItem } from '../ui/Dropdown';
import { X, Moon, Sun, Monitor, Globe } from 'lucide-react';

interface SidebarProps {
    className?: string;
    isOpen?: boolean;
    onClose?: () => void;
}

const SidebarContent: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { collections } = useVideos();
    const { user, signOut } = useAuth();
    const { t, language, setLanguage } = useLanguage();
    const { theme, setTheme } = useTheme();

    const mainItems = [
        {
            id: 'home',
            label: t('common.home'),
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" />
                </svg>
            ),
            path: '/',
        },
        {
            id: 'trending',
            label: t('common.trending'),
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" />
                </svg>
            ),
            path: '/trending',
        },
        {
            id: 'collections',
            label: t('common.collections'),
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" />
                </svg>
            ),
            path: '/collections',
        },
        {
            id: 'history',
            label: t('common.history'),
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            ),
            path: '/history',
        },
    ];

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login');
            if (onClose) onClose();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        if (onClose) onClose();
    };

    return (
        <div className="flex flex-col h-full bg-[var(--color-bg-primary)] border-r border-[var(--color-border-default)]">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-4">
                    {/* Logo */}
                    <div className="flex items-center justify-between mb-6 px-2">
                        <Link to="/" onClick={onClose} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--color-accent-primary)">
                                <path d="M12 2L2 7v10c0 5.5 3.8 10.7 10 12 6.2-1.3 10-6.5 10-12V7l-10-5zm0 18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                            </svg>
                            <span className="text-xl font-bold text-[var(--color-text-primary)]">CURA</span>
                        </Link>
                        {onClose && (
                            <button onClick={onClose} className="md:hidden text-[var(--color-text-secondary)]">
                                <X size={24} />
                            </button>
                        )}
                    </div>

                    {/* Main Navigation */}
                    <nav className="space-y-1 mb-6">
                        {mainItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleNavigation(item.path || '#')}
                                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${location.pathname === item.path
                                        ? 'bg-[var(--color-bg-secondary)] text-[var(--color-accent-primary)]'
                                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    <span>{item.label}</span>
                                </div>
                            </button>
                        ))}
                    </nav>

                    {/* Divider */}
                    <div className="h-px bg-[var(--color-border-default)] my-4" />

                    {/* My Collections */}
                    <div className="mb-6">
                        <h3 className="px-3 py-2 text-xs font-semibold text-[var(--color-text-secondary)] uppercase">
                            {t('common.my_collections')}
                        </h3>
                        <div className="space-y-1">
                            {collections && collections.length > 0 ? (
                                collections.slice(0, 10).map((collection) => (
                                    <button
                                        key={collection.id}
                                        onClick={() => handleNavigation(`/collections/${collection.id}`)}
                                        className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-all ${location.pathname === `/collections/${collection.id}`
                                                ? "bg-[var(--color-bg-secondary)] text-[var(--color-accent-primary)]"
                                                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
                                            }`}
                                    >
                                        <span className="truncate">{collection.title}</span>
                                        <span className="text-xs text-[var(--color-text-secondary)] opacity-70">
                                            {collection.videoIds?.length ?? 0}
                                        </span>
                                    </button>
                                ))
                            ) : (
                                <div className="px-3 py-2 text-xs text-[var(--color-text-secondary)]">
                                    {t('collections.empty_list')}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section - User Profile or Login */}
            <div className="border-t border-[var(--color-border-default)] p-3 bg-[var(--color-bg-primary)]">
                {user ? (
                    // Logged in - Show user profile
                    <Dropdown
                        trigger={
                            <div className="w-full p-2 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-hover)] active:scale-[0.98] rounded-lg border border-[var(--color-border-default)] cursor-pointer transition-all">
                                <div className="flex items-center gap-2">
                                    {/* Avatar */}
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-accent-primary)] to-[#059669] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 shadow-sm">
                                        {user.email?.[0].toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                                            {user.name || user.email?.split('@')[0]}
                                        </p>
                                        <p className="text-[10px] text-[var(--color-text-secondary)] truncate leading-none">
                                            {user.email}
                                        </p>
                                    </div>
                                    {/* Chevron icon */}
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 text-[var(--color-text-secondary)]">
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
                                <Monitor size={10} /> Theme
                            </div>
                            <div className="flex bg-[var(--color-bg-primary)] p-1 rounded-md border border-[var(--color-border-default)]">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setTheme('light'); }}
                                    className={`flex-1 flex justify-center p-1 rounded ${theme === 'light' ? 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] shadow-sm' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
                                >
                                    <Sun size={14} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setTheme('dark'); }}
                                    className={`flex-1 flex justify-center p-1 rounded ${theme === 'dark' ? 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] shadow-sm' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
                                >
                                    <Moon size={14} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setTheme('system'); }}
                                    className={`flex-1 flex justify-center p-1 rounded ${theme === 'system' ? 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] shadow-sm' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
                                >
                                    <Monitor size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Quick Settings: Language */}
                        <div className="px-3 pb-2">
                            <div className="text-[10px] font-semibold text-[var(--color-text-secondary)] uppercase mb-2 flex items-center gap-1">
                                <Globe size={10} /> Language
                            </div>
                            <div className="flex bg-[var(--color-bg-primary)] p-1 rounded-md border border-[var(--color-border-default)] text-xs">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setLanguage('en'); }}
                                    className={`flex-1 py-1 rounded ${language === 'en' ? 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] shadow-sm font-medium' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
                                >
                                    EN
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setLanguage('ko'); }}
                                    className={`flex-1 py-1 rounded ${language === 'ko' ? 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] shadow-sm font-medium' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
                                >
                                    KO
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setLanguage('es'); }}
                                    className={`flex-1 py-1 rounded ${language === 'es' ? 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] shadow-sm font-medium' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
                                >
                                    ES
                                </button>
                            </div>
                        </div>

                        <div className="h-px bg-[var(--color-border-default)] my-1" />

                        <DropdownItem onClick={() => { navigate('/settings'); if (onClose) onClose(); }}>
                            <div className="flex items-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                                    <path d="M12 1v6m0 6v6M5 5l4.24 4.24m5.52 5.52L19 19m0-14l-4.24 4.24M9.76 14.76L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                {t('common.settings')}
                            </div>
                        </DropdownItem>
                        <DropdownItem onClick={handleLogout}>
                            <div className="flex items-center gap-2 text-red-500">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                {t('common.logout')}
                            </div>
                        </DropdownItem>
                    </Dropdown>
                ) : (
                    // Not logged in - Show login button
                    <Link
                        to="/login"
                        onClick={onClose}
                        className="w-full block p-3 bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-hover)] rounded-xl text-center text-white font-semibold transition-colors shadow-lg shadow-[var(--color-accent-primary)]/20 active:scale-95"
                    >
                        {t('common.login')}
                    </Link>
                )}
            </div>
        </div>
    );
}

export default function Sidebar({ className = '', isOpen, onClose }: SidebarProps) {
    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`w-64 h-screen sticky top-0 hidden md:flex flex-col ${className}`}
            >
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar (Drawer) */}
            <div className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Drawer */}
                <div className={`absolute left-0 top-0 h-full w-[80%] max-w-xs bg-[var(--color-bg-primary)] shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <SidebarContent onClose={onClose} />
                </div>
            </div>
        </>
    );
}
