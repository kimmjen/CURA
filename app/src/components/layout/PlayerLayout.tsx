import type { ReactNode } from 'react';
import Button from '@/components/ui/Button';

export interface PlayerLayoutProps {
    player: ReactNode;
    playlist: ReactNode;
    info: ReactNode;
    onBack?: () => void;
    hideHeader?: boolean;
}

export default function PlayerLayout({ player, playlist, info, onBack, hideHeader = false }: PlayerLayoutProps) {
    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            {/* Mini Header */}
            {!hideHeader && (
                <div className="sticky top-0 z-50 bg-[var(--color-bg-primary)]/95 backdrop-blur-sm border-b border-[var(--color-border-default)]">
                    <div className="flex items-center h-14 md:h-16 px-4 md:px-6">
                        <Button variant="ghost" onClick={onBack} size="sm">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="hidden sm:inline">뒤로</span>
                        </Button>
                    </div>
                </div>
            )}

            {/* Player Area */}
            <div className="flex flex-col lg:flex-row">
                {/* Left: Player + Info */}
                <div className="flex-1 w-full">
                    {/* Video Player */}
                    <div className="bg-black w-full aspect-video">
                        {player}
                    </div>

                    {/* Video Info */}
                    <div className="p-4 md:p-6">
                        {info}
                    </div>
                </div>

                {/* Right: Playlist Sidebar - Hidden on mobile */}
                <div className="hidden lg:block lg:w-96 border-l border-[var(--color-border-default)] h-screen overflow-y-auto sticky top-0">
                    {playlist}
                </div>
            </div>
        </div>
    );
}
