import { Play } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { CATEGORY_COLORS } from '@/types/video';
import type { Video } from '../../types/video';

interface VideoInfoProps {
    video: Video;
    autoplay: boolean;
    onToggleAutoplay: () => void;
}

export default function VideoInfo({
    video,
    autoplay,
    onToggleAutoplay
}: VideoInfoProps) {
    const { t } = useLanguage();

    return (
        <div>
            {/* Title & Category */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-start justify-between gap-4">
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)] leading-tight">
                        {video.title}
                    </h1>
                    <Badge className={CATEGORY_COLORS[video.category]}>{video.category}</Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                    <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                    <button
                        onClick={onToggleAutoplay}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors text-xs font-medium ${autoplay
                            ? 'bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]'
                            : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
                            }`}
                    >
                        <Play size={12} className={autoplay ? 'fill-current' : ''} />
                        {t('player.autoplay')}
                    </button>
                </div>
            </div>

            {/* Channel Info */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[var(--color-border-default)]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                        {video.channelName.charAt(0)}
                    </span>
                </div>
                <div>
                    <p className="font-semibold text-[var(--color-text-primary)]">
                        {video.channelName}
                    </p>
                    <a
                        href={`https://youtube.com/watch?v=${video.youtubeVideoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[var(--color-accent-primary)] hover:underline font-medium"
                    >
                        {t('player.watch_on_youtube')}
                    </a>
                </div>
            </div>

            {/* Description */}
            <div>
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-2 text-sm uppercase tracking-wide opacity-80">
                    {t('player.description')}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
                    {video.description || t('player.no_description')}
                </p>
            </div>
        </div>
    );
}
