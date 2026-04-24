import { cn } from '@/utils/utils';
import { formatDuration } from '@/utils/format';
import Badge from '@/components/ui/Badge';
import GlassCard from '../ui/GlassCard';
import type { Video } from '@/types/video';

export interface VideoCardV2Props {
    video: Video;
    onClick?: () => void;
    showProgress?: boolean;
}

export default function VideoCardV2({ video, onClick, showProgress }: VideoCardV2Props) {
    return (
        <GlassCard
            padding="none"
            onClick={onClick}
            border="glow"
            className={cn(
                'group overflow-hidden',
                'transition-all duration-300',
                'hover:scale-[1.03] hover:-translate-y-1'
            )}
        >
            {/* Thumbnail Container with Enhanced Effects */}
            <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-secondary)]">
                {/* Background Gradient Overlay for Depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Thumbnail Image */}
                <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className={cn(
                        'w-full h-full object-cover',
                        'transition-all duration-500',
                        'group-hover:scale-110',
                        'group-hover:brightness-75'
                    )}
                    loading="lazy"
                />

                {/* Glassmorphic Overlay on Hover */}
                <div className={cn(
                    'absolute inset-0 z-20',
                    'glass opacity-0 group-hover:opacity-100',
                    'transition-all duration-300',
                    'backdrop-blur-sm'
                )} />

                {/* Duration Badge with Glass Effect */}
                <div className={cn(
                    'absolute bottom-3 right-3 z-30',
                    'px-2 py-1',
                    'glass rounded-[var(--radius-md)]',
                    'text-white text-xs font-semibold',
                    'shadow-lg',
                    'transition-all duration-300',
                    'group-hover:scale-110'
                )}>
                    {formatDuration(video.durationSeconds)}
                </div>

                {/* Watch Progress Bar */}
                {showProgress && video.watchProgress && video.watchProgress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50 z-30">
                        <div
                            className={cn(
                                'h-full gradient-primary',
                                'transition-all duration-300',
                                'shadow-glow-sm'
                            )}
                            style={{ width: `${video.watchProgress}%` }}
                        />
                    </div>
                )}

                {/* Enhanced Play Button with Glow */}
                <div className={cn(
                    'absolute inset-0 z-30',
                    'flex items-center justify-center',
                    'opacity-0 group-hover:opacity-100',
                    'transition-all duration-300'
                )}>
                    <div className={cn(
                        'relative w-20 h-20',
                        'rounded-full',
                        'gradient-primary',
                        'flex items-center justify-center',
                        'shadow-xl',
                        'transition-all duration-300',
                        'group-hover:scale-110',
                        'group-hover:glow-lg',
                        'animate-pulse'
                    )}>
                        {/* Pulsing Ring */}
                        <div className={cn(
                            'absolute inset-0',
                            'rounded-full',
                            'border-2 border-white/50',
                            'scale-100 group-hover:scale-125',
                            'opacity-100 group-hover:opacity-0',
                            'transition-all duration-700'
                        )} />

                        {/* Play Icon */}
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="white"
                            className="translate-x-0.5"
                        >
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Content Area with Enhanced Styling */}
            <div className="p-4 relative z-10">
                {/* Category Badge */}
                <div className="mb-2 flex items-center gap-2">
                    <Badge variant="category" category={video.category} size="sm" />
                    {/* Optional: New badge */}
                    {video.publishedAt && new Date(video.publishedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                        <span className={cn(
                            'px-2 py-0.5 text-xs font-semibold',
                            'gradient-primary text-white',
                            'rounded-full',
                            'shadow-glow-sm'
                        )}>
                            NEW
                        </span>
                    )}
                </div>

                {/* Title with Gradient Hover */}
                <h3 className={cn(
                    'text-sm font-semibold',
                    'text-[var(--color-text-primary)]',
                    'line-clamp-2 mb-2',
                    'transition-colors duration-200',
                    'group-hover:gradient-text'
                )}>
                    {video.title}
                </h3>

                {/* Channel & Metadata */}
                <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                    <span className="truncate">{video.channelName}</span>
                    {video.viewCount && (
                        <>
                            <span>•</span>
                            <span className="whitespace-nowrap">
                                {video.viewCount.toLocaleString()} views
                            </span>
                        </>
                    )}
                </div>

                {/* Hover Accent Line */}
                <div className={cn(
                    'absolute bottom-0 left-0 right-0 h-0.5',
                    'gradient-primary',
                    'transform scale-x-0 group-hover:scale-x-100',
                    'transition-transform duration-300',
                    'origin-left'
                )} />
            </div>
        </GlassCard>
    );
}
