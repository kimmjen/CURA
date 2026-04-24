import { formatDuration } from '@/utils/format';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import type { Video } from '@/types/video';
import { useLanguage } from '@/contexts/LanguageContext';

export interface VideoCardProps {
    video: Video;
    onClick?: () => void;
    showProgress?: boolean;
}

export default function VideoCard({ video, onClick, showProgress }: VideoCardProps) {
    const { t } = useLanguage();
    return (
        <Card
            variant="clickable"
            padding="none"
            onClick={onClick}
            className="group overflow-hidden"
        >
            {/* Thumbnail - 16:9 ratio */}
            <div className="relative aspect-video overflow-hidden bg-[var(--color-bg-tertiary)]">
                <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover transition-all group-hover:brightness-110"
                    loading="lazy"
                />

                {/* Duration badge */}
                <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-xs font-medium rounded">
                    {formatDuration(video.durationSeconds)}
                </div>

                {/* Watch progress */}
                {showProgress && video.watchProgress && video.watchProgress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-bg-tertiary)]">
                        <div
                            className="h-full bg-[var(--color-accent-primary)]"
                            style={{ width: `${video.watchProgress}%` }}
                        />
                    </div>
                )}

                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <div className="w-16 h-16 rounded-full bg-[var(--color-accent-primary)] flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-3">
                {/* Category badge */}
                <div className="mb-2">
                    <Badge variant="category" category={video.category} size="sm" />
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] line-clamp-2 mb-1">
                    {video.title}
                </h3>

                {/* Channel & metadata */}
                <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                    <span>{video.channelName}</span>
                    {video.viewCount && (
                        <>
                            <span>•</span>
                            <span>{video.viewCount.toLocaleString()} {t('common.views')}</span>
                        </>
                    )}
                </div>
            </div>
        </Card>
    );
}
