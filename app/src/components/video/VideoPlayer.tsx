import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import YouTube from 'react-youtube';
import Button from '@/components/ui/Button';
import { ErrorState } from '@/components/common';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Video } from '../../types/video';

interface VideoPlayerProps {
    video: Video;
    isPlayerError: boolean;
    onReady: (event: any) => void;
    onEnd: () => void;
    onStateChange: (event: any) => void;
    onError: (e: any) => void;
}

export default function VideoPlayer({
    video,
    isPlayerError,
    onReady,
    onEnd,
    onStateChange,
    onError
}: VideoPlayerProps) {
    const { t } = useLanguage();
    const navigate = useNavigate();

    const opts = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 1 as 1,
            modestbranding: 1 as 1,
            rel: 0 as 0,
            origin: window.location.origin,
            widget_referrer: window.location.origin,
            enablejsapi: 1 as 1,
            wmode: 'transparent',
        },
    };

    return (
        <div className="w-full h-full bg-black flex items-center justify-center relative group">
            {/* Top Overlay Controls */}
            <div className="absolute top-0 left-0 w-full p-4 z-[60] flex justify-between items-start transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/')}
                    className="text-white hover:bg-white/10 pointer-events-auto cursor-pointer"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    {t('player.back_to_home')}
                </Button>
                <div className="text-white/80 text-sm font-medium hidden sm:block pointer-events-auto">
                    {video.title}
                </div>
            </div>

            {!isPlayerError ? (
                <YouTube
                    videoId={video.youtubeVideoId}
                    opts={opts}
                    onReady={onReady}
                    onEnd={onEnd}
                    onStateChange={onStateChange}
                    onError={onError}
                    className="w-full h-full"
                    iframeClassName="w-full h-full"
                />
            ) : (
                <ErrorState
                    title={t('player.unable_to_play')}
                    message={t('player.restricted_desc')}
                />
            )}
        </div>
    );
}
