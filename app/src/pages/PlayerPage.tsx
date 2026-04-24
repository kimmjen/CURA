import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Play } from 'lucide-react';
import PlayerLayout from '@/components/layout/PlayerLayout';
import Button from '@/components/ui/Button';
import { LoadingSpinner, ErrorState } from '@/components/common';
import {
    VideoPlayer,
    VideoInfo,
    VideoTabs
} from '@/components/video';
import {
    useVideo,
    useVideos,
    useCollections,
    useVideoNotes,
    useCreateNote,
    useDeleteNote,
    api,
    watchHistoryApi
} from '@/api';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Video, Collection } from '../types/video';

const PlayerPage: React.FC = () => {
    const { videoId } = useParams<{ videoId: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { user } = useAuth();

    const id = Number(videoId);
    const paramCollectionId = searchParams.get('collectionId');
    const collectionId = paramCollectionId ? Number(paramCollectionId) : 0;

    const { data: video, isLoading, error } = useVideo(id);

    // Smart Category Mode logic
    const targetCollectionId = collectionId || 0;
    const { data: collectionVideosData, isLoading: isQueueLoading } = useVideos(targetCollectionId, {
        size: 100,
    });

    const { data: collections } = useCollections();
    const [categoryVideos, setCategoryVideos] = useState<Video[]>([]);
    const [isCategoryLoading, setIsCategoryLoading] = useState(false);

    useEffect(() => {
        if (targetCollectionId !== 0 || !collections || !video) return;

        const fetchCategoryVideos = async () => {
            setIsCategoryLoading(true);
            try {
                const content = Array.isArray(collections) ? collections : (collections as any).content || [];
                const promises = content.map((col: Collection) =>
                    api.getVideos(col.id, { size: 50 }).catch(() => ({ videos: [] as Video[] }))
                );
                const results = await Promise.all(promises);
                const allVideos = results.flatMap((r: any) => r.videos || []);
                const filtered = allVideos
                    .filter((v: Video) => v.category === video.category)
                    .filter((v: Video, i: number, self: Video[]) => self.findIndex((t: Video) => t.id === v.id) === i);
                setCategoryVideos(filtered);
            } catch (e) {
                console.error("Failed to fetch category videos", e);
            } finally {
                setIsCategoryLoading(false);
            }
        };
        fetchCategoryVideos();
    }, [targetCollectionId, collections, video]);

    const [newNoteContent, setNewNoteContent] = useState('');
    const [isPlayerError, setIsPlayerError] = useState(false);
    const [autoplay, setAutoplay] = useState(true);
    const playerRef = useRef<any>(null);

    // Video Notes
    const { data: notes = [], isLoading: isNotesLoading } = useVideoNotes(id);
    const createNoteMutation = useCreateNote();
    const deleteNoteMutation = useDeleteNote();

    const handleAddNote = async () => {
        if (!newNoteContent.trim()) return;
        try {
            let currentTime: number | undefined;
            if (playerRef.current) {
                currentTime = Math.floor(await playerRef.current.getCurrentTime());
            }
            await createNoteMutation.mutateAsync({
                videoId: id,
                content: newNoteContent.trim(),
                timestampSeconds: currentTime,
            });
            setNewNoteContent('');
        } catch (e) {
            console.error('Failed to add note', e);
        }
    };

    const handleDeleteNote = async (noteId: number) => {
        try {
            await deleteNoteMutation.mutateAsync({ videoId: id, noteId });
        } catch (e) {
            console.error('Failed to delete note', e);
        }
    };

    const seekToTimestamp = (seconds: number) => {
        if (playerRef.current) {
            playerRef.current.seekTo(seconds, true);
        }
    };

    const saveProgress = async (isCompleted: boolean = false) => {
        if (!user || !video || !playerRef.current) return;
        try {
            const currentTime = await playerRef.current.getCurrentTime();
            const duration = await playerRef.current.getDuration();
            if (duration > 0) {
                await watchHistoryApi.save(user.id, {
                    videoId: video.id,
                    progressSeconds: Math.floor(currentTime),
                    durationSeconds: Math.floor(duration),
                    lastPositionSeconds: Math.floor(currentTime),
                });
            }
        } catch (error) {
            console.error('Failed to save watch history:', error);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (playerRef.current && playerRef.current.getPlayerState() === 1) {
                saveProgress();
            }
        }, 30000);
        return () => clearInterval(interval);
    }, [user, video]);

    const queue = useMemo(() => {
        if (!video) return [];
        if (targetCollectionId !== 0 && collectionVideosData?.videos) {
            return collectionVideosData.videos
                .sort((a: Video, b: Video) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
        }
        if (targetCollectionId === 0) return categoryVideos;
        return [];
    }, [collectionVideosData, video, targetCollectionId, categoryVideos]);

    const handleNextVideo = () => {
        const currentIndex = queue.findIndex((v: Video) => v.id === video.id);
        if (currentIndex !== -1 && currentIndex < queue.length - 1) {
            const nextVideoId = queue[currentIndex + 1].id;
            navigate(`/player/${nextVideoId}${collectionId ? `?collectionId=${collectionId}` : ''}`);
        } else {
            navigate('/');
        }
    };

    const isNextAvailable = queue.findIndex((v: Video) => v.id === video.id) < queue.length - 1;

    if (isLoading) {
        return (
            <PlayerLayout
                onBack={() => navigate('/')}
                hideHeader
                player={<div className="w-full h-full flex items-center justify-center bg-black"><LoadingSpinner size="lg" /></div>}
                info={<div />}
                playlist={<div />}
            />
        );
    }

    if (error || !video) {
        return (
            <PlayerLayout
                onBack={() => navigate('/')}
                hideHeader
                player={<div className="w-full h-full flex items-center justify-center bg-black"><ErrorState title={t('player.error_not_found_title')} message={t('player.error_not_found_msg')} /></div>}
                info={<div />}
                playlist={<div />}
            />
        );
    }

    return (
        <PlayerLayout
            onBack={() => navigate('/')}
            hideHeader
            player={
                <VideoPlayer
                    video={video}
                    isPlayerError={isPlayerError}
                    onReady={(event) => { playerRef.current = event.target; }}
                    onEnd={() => { saveProgress(true); if (autoplay) handleNextVideo(); }}
                    onStateChange={(event) => { if (event.data === 2) saveProgress(); }}
                    onError={(e) => { console.error("YouTube Player Error:", e); setIsPlayerError(true); }}
                />
            }
            info={
                <VideoInfo
                    video={video}
                    autoplay={autoplay}
                    onToggleAutoplay={() => setAutoplay(!autoplay)}
                />
            }
            playlist={
                <div className="flex flex-col h-full bg-[var(--color-bg-primary)]">
                    <div className="flex-1 overflow-hidden">
                        <VideoTabs
                            queue={queue}
                            currentVideoId={video.id}
                            collectionId={collectionId}
                            isQueueLoading={isQueueLoading || isCategoryLoading}
                            notes={notes}
                            isNotesLoading={isNotesLoading}
                            isNotePending={createNoteMutation.isPending}
                            newNoteContent={newNoteContent}
                            onNewNoteChange={setNewNoteContent}
                            onAddNote={handleAddNote}
                            onDeleteNote={handleDeleteNote}
                            onSeek={seekToTimestamp}
                        />
                    </div>
                    {isNextAvailable && (
                        <div className="p-4 border-t border-[var(--color-border-default)] bg-[var(--color-bg-primary)] sticky bottom-0 z-10">
                            <Button
                                variant="primary"
                                onClick={handleNextVideo}
                                className="w-full py-3 shadow-lg shadow-[var(--color-accent-primary)]/10"
                            >
                                <Play size={16} className="mr-2 fill-current" />
                                {t('player.next_video')}
                            </Button>
                        </div>
                    )}
                </div>
            }
        />
    );
};

export default PlayerPage;
