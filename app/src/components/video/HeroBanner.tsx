import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import YouTube from 'react-youtube';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Video } from '../../types/video';

interface HeroBannerProps {
    video: Video;
}

export default function HeroBanner({ video }: HeroBannerProps) {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const playerRef = useRef<any>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [volume, setVolume] = useState(50);
    const [prevVolume, setPrevVolume] = useState(50);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);

    return (
        <div className="relative h-[60vh] md:h-[70vh] lg:h-[75vh] mb-6 md:mb-8 overflow-hidden rounded-2xl shadow-2xl bg-[var(--color-bg-secondary)]">
            {/* Background Video */}
            <div className="absolute inset-0">
                <YouTube
                    videoId={video.youtubeVideoId}
                    opts={{
                        height: '100%',
                        width: '100%',
                        playerVars: {
                            autoplay: 1,
                            mute: 1,
                            controls: 0,
                            loop: 1,
                            playlist: video.youtubeVideoId,
                            modestbranding: 1,
                            rel: 0,
                            showinfo: 0,
                        },
                    }}
                    className="w-full h-full pointer-events-none"
                    iframeClassName="w-full h-full scale-[2] origin-center"
                    onReady={(event) => {
                        playerRef.current = event.target;
                        event.target.setPlaybackQuality('highres');
                        event.target.setVolume(volume);
                        if (isMuted) {
                            event.target.mute();
                        }
                    }}
                    onError={(e) => console.warn('YouTube player error:', e)}
                />
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-primary)] via-[var(--color-bg-primary)]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg-primary)]/80 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-end px-4 md:px-6 pb-8 md:pb-12">
                <div className="max-w-xl">
                    <Badge variant="category" category={video.category} className="mb-2" />
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 drop-shadow-lg line-clamp-2">
                        {video.title}
                    </h1>
                    <p className="text-sm md:text-base text-white/90 mb-4 drop-shadow-md">
                        {video.channelName}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                            size="md"
                            className="w-full sm:w-auto px-6"
                            onClick={() => navigate(`/player/${video.id}`)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            {t('common.play')}
                        </Button>
                        <Button
                            size="md"
                            variant="secondary"
                            className="w-full sm:w-auto px-6 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md"
                            onClick={() => navigate(`/collection/${video.collectionId}`)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mr-2 text-white">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            {t('common.details')}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Volume Controls */}
            <div
                className="absolute bottom-4 right-4 flex items-center gap-2"
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
            >
                <div className={`transition-all duration-300 ${showVolumeSlider ? 'opacity-100 w-24' : 'opacity-0 w-0 pointer-events-none'}`}>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => {
                            const newVolume = parseInt(e.target.value);
                            setVolume(newVolume);
                            if (playerRef.current) {
                                playerRef.current.setVolume(newVolume);
                                if (newVolume === 0) {
                                    if (!isMuted) {
                                        playerRef.current.mute();
                                        setIsMuted(true);
                                    }
                                } else {
                                    if (isMuted) {
                                        playerRef.current.unMute();
                                        setIsMuted(false);
                                    }
                                }
                            }
                        }}
                        className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                    />
                </div>

                <button
                    onClick={() => {
                        if (playerRef.current) {
                            if (isMuted) {
                                playerRef.current.unMute();
                                const newVol = prevVolume || 50;
                                setVolume(newVol);
                                playerRef.current.setVolume(newVol);
                                setIsMuted(false);
                            } else {
                                playerRef.current.mute();
                                setPrevVolume(volume);
                                setVolume(0);
                                setIsMuted(true);
                            }
                        }
                    }}
                    className="p-3 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full transition-all duration-200 group"
                    aria-label={isMuted ? t('common.unmute') : t('common.mute')}
                >
                    {isMuted ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" className="group-hover:scale-110 transition-transform">
                            <path d="M11 5L6 9H2v6h4l5 4V5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <line x1="23" y1="9" x2="17" y2="15" strokeWidth="2" strokeLinecap="round" />
                            <line x1="17" y1="9" x2="23" y2="15" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" className="group-hover:scale-110 transition-transform">
                            <path d="M11 5L6 9H2v6h4l5 4V5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
}
