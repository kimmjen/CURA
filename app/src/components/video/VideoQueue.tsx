import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, BarChart2 } from 'lucide-react';
import { LoadingSpinner } from '@/components/common';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Video } from '../../types/video';

interface VideoQueueProps {
    queue: Video[];
    currentVideoId: number;
    collectionId: number;
    isLoading: boolean;
}

export default function VideoQueue({
    queue,
    currentVideoId,
    collectionId,
    isLoading
}: VideoQueueProps) {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const activeVideoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeVideoRef.current) {
            activeVideoRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [currentVideoId, queue]);

    return (
        <div className="p-2 space-y-1">
            <div className="px-2 py-3 flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                    {t('player.from_your_list')}
                </span>
                <span className="text-[10px] bg-[var(--color-bg-secondary)] px-2 py-0.5 rounded-full text-[var(--color-text-tertiary)] border border-[var(--color-border-default)]">
                    {queue.length}
                </span>
            </div>

            {isLoading ? (
                <div className="p-8 flex justify-center">
                    <LoadingSpinner size="sm" />
                </div>
            ) : (
                queue.map((qVideo: Video) => {
                    const isCurrent = qVideo.id === currentVideoId;
                    const isWatched = false; // Placeholder for future watch history

                    return (
                        <div
                            key={qVideo.id}
                            ref={isCurrent ? activeVideoRef : null}
                            onClick={() => navigate(`/player/${qVideo.id}${collectionId ? `?collectionId=${collectionId}` : ''}`)}
                            className={`flex gap-3 p-2 rounded-[var(--radius-lg)] cursor-pointer group transition-all duration-300 border border-transparent ${isCurrent
                                ? 'bg-[var(--color-bg-secondary)] border-[var(--color-border-active)] shadow-sm'
                                : isWatched
                                    ? 'opacity-60 hover:opacity-100 hover:bg-[var(--color-bg-hover)]'
                                    : 'hover:bg-[var(--color-bg-hover)]'
                                }`}
                        >
                            <div className="relative w-28 aspect-video rounded-md overflow-hidden shrink-0 bg-black/20">
                                <img src={qVideo.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                                <div className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[10px] text-white font-mono">
                                    {Math.floor(qVideo.durationSeconds / 60)}:{String(qVideo.durationSeconds % 60).padStart(2, '0')}
                                </div>

                                {isCurrent && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center border-2 border-[var(--color-accent-primary)]">
                                        <BarChart2 size={24} className="text-[var(--color-accent-primary)] animate-pulse" />
                                    </div>
                                )}

                                {isWatched && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <CheckCircle size={20} className="text-[var(--color-accent-primary)]" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <h4 className={`text-sm font-medium line-clamp-2 leading-tight mb-1 transition-colors ${isCurrent ? 'text-[var(--color-accent-primary)]' : 'group-hover:text-[var(--color-accent-primary)] text-[var(--color-text-primary)]'
                                    }`}>
                                    {qVideo.title}
                                </h4>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs text-[var(--color-text-secondary)] truncate">
                                        {qVideo.channelName}
                                    </p>
                                    {isCurrent && (
                                        <span className="text-[10px] text-[var(--color-accent-primary)] font-bold animate-pulse">
                                            {t('player.now_playing')}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })
            )}

            {queue.length === 0 && !isLoading && (
                <div className="p-8 text-center text-[var(--color-text-secondary)] text-sm">
                    {t('player.empty_queue')}
                </div>
            )}
        </div>
    );
}
