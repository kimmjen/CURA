import { formatDuration } from '@/utils/format';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import type { Video } from '@/types/video';

export interface ShortsCardProps {
    video: Video;
    onClick?: () => void;
}

export default function ShortsCard({ video, onClick }: ShortsCardProps) {
    return (
        <Card
            variant="clickable"
            padding="none"
            onClick={onClick}
            className="group overflow-hidden w-full max-w-[200px]"
        >
            {/* Thumbnail - 9:16 ratio (vertical) */}
            <div className="relative aspect-[9/16] overflow-hidden bg-[var(--color-bg-tertiary)]">
                <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                />

                {/* Shorts badge */}
                <div className="absolute top-2 left-2">
                    <Badge variant="category" category="SHORTS" size="sm" />
                </div>

                {/* Duration badge */}
                <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-xs font-medium rounded">
                    {formatDuration(video.durationSeconds)}
                </div>

                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-accent-primary)] flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-2">
                {/* Title */}
                <h3 className="text-xs font-semibold text-[var(--color-text-primary)] line-clamp-2 mb-1">
                    {video.title}
                </h3>

                {/* Views */}
                <div className="text-xs text-[var(--color-text-secondary)]">
                    {video.viewCount ? `${video.viewCount.toLocaleString()} views` : video.channelName}
                </div>
            </div>
        </Card>
    );
}
