import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import Dropdown, { DropdownItem } from '@/components/ui/Dropdown';
import { cn } from '@/utils/utils';

export interface HeaderProps {
    onSearch?: (query: string) => void;
    onProfileClick?: () => void;
    className?: string;
}

export default function Header({
    onSearch,
    onProfileClick,
    className,
}: HeaderProps) {
    return (
        <header
            className={cn(
                'sticky top-0 z-50 w-full',
                'bg-[var(--color-bg-primary)]/95 backdrop-blur-sm',
                'border-b border-[var(--color-border-default)]',
                className
            )}
        >
            <div className="flex items-center justify-between h-16 px-6">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2 text-xl font-bold text-[var(--color-text-primary)] hover:text-[var(--color-accent-primary)] transition-colors"
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7v10c0 5.5 3.8 10.7 10 12 6.2-1.3 10-6.5 10-12V7l-10-5zm0 18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                    </svg>
                    <span>CURA</span>
                </Link>

                {/* Search Bar */}
                <div className="flex-1 max-w-2xl mx-8">
                    <SearchBar onSearch={onSearch} placeholder="영상 검색..." />
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <Button variant="ghost" size="sm" className="relative">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="absolute top-0 right-0 w-2 h-2 bg-[var(--color-error)] rounded-full" />
                    </Button>

                    {/* Profile Dropdown */}
                    <Dropdown
                        trigger={
                            <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                <Avatar
                                    src="https://i.pravatar.cc/40"
                                    alt="프로필"
                                    size="sm"
                                />
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M6 9l6 6 6-6"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        }
                        align="end"
                    >
                        <DropdownItem onClick={onProfileClick}>내 프로필</DropdownItem>
                        <DropdownItem>설정</DropdownItem>
                        <DropdownItem className="text-[var(--color-error)]">
                            로그아웃
                        </DropdownItem>
                    </Dropdown>
                </div>
            </div>
        </header>
    );
}
