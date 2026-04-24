import { useRef, useEffect, useState } from 'react';
import { cn } from '@/utils/utils';

export interface YouTubePlayerProps {
    videoId: string;
    autoplay?: boolean;
    onReady?: () => void;
    onStateChange?: (state: number) => void;
    className?: string;
}

export default function YouTubePlayer({
    videoId,
    autoplay = false,
    onReady,
    onStateChange: _onStateChange,
    className,
}: YouTubePlayerProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Reset loading state when video changes
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, [videoId]);

    const embedUrl = `https://www.youtube.com/embed/${videoId}?${new URLSearchParams({
        autoplay: autoplay ? '1' : '0',
        modestbranding: '1',
        rel: '0',
        enablejsapi: '1',
    }).toString()}`;

    return (
        <div className={cn('relative w-full aspect-video bg-black', className)}>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-[var(--color-accent-primary)] border-t-transparent rounded-full animate-spin" />
                </div>
            )}
            <iframe
                ref={iframeRef}
                src={embedUrl}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                onLoad={() => {
                    setIsLoading(false);
                    onReady?.();
                }}
            />
        </div>
    );
}
