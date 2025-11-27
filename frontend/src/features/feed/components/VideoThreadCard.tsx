import React from 'react';
import { Heart, Play, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

interface VideoThreadCardProps {
    video: {
        id: number;
        title: string;
        channelName: string;
        youtubeVideoId: string;
        comment?: string;
        thumbnailUrl: string;
        publishedAt: string;
        tags?: string[];
    };
    curatorName?: string;
    curatorAvatar?: string;
    variant?: 'full' | 'compact';
}

export const VideoThreadCard: React.FC<VideoThreadCardProps> = ({
    video,
    curatorName = "Gongwon Official",
    curatorAvatar = "https://via.placeholder.com/40",
    variant = 'full',
}) => {
    const isCompact = variant === 'compact';

    const [isPlaying, setIsPlaying] = React.useState(false);

    return (
        <article className={cn(
            "group relative flex flex-col bg-transparent transition-all duration-500",
            !isCompact && "border-b border-white/5 pb-12 last:border-0"
        )}>
            {/* Header (Only for Full View) */}
            {!isCompact && (
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden border border-white/10">
                            <img src={curatorAvatar} alt={curatorName} className="h-full w-full object-cover" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm tracking-wide uppercase">{curatorName}</h3>
                            <p className="text-gray-500 text-xs font-mono">CURATOR</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {video.tags?.map(tag => (
                            <span key={tag} className="px-2 py-1 rounded border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Video Container (The "Product" Image) */}
            <div className="relative w-full aspect-video bg-gray-900 overflow-hidden rounded-sm shadow-2xl group-hover:shadow-white/5 transition-all duration-500">
                {!isPlaying ? (
                    /* Thumbnail & Play Button Overlay */
                    <div
                        onClick={() => setIsPlaying(true)}
                        className="absolute inset-0 cursor-pointer group/video"
                    >
                        <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="w-full h-full object-cover opacity-90 group-hover/video:opacity-100 transition-opacity duration-500"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/video:bg-black/10 transition-colors">
                            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover/video:scale-110 transition-transform duration-300">
                                <Play className="w-8 h-8 text-white fill-white ml-1" />
                            </div>
                        </div>
                    </div>
                ) : (
                    /* YouTube Player */
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${video.youtubeVideoId}?autoplay=1`}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 z-0"
                    />
                )}
            </div>

            {/* Content / Details */}
            <div className="mt-6 space-y-4">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                        <h2 className={cn(
                            "font-bold text-white leading-tight group-hover:text-gray-300 transition-colors cursor-pointer",
                            isCompact ? "text-lg" : "text-2xl"
                        )}>
                            {video.title}
                        </h2>
                        <p className="text-gray-500 text-xs font-mono mt-2 uppercase tracking-wider">
                            {video.channelName} • {new Date(video.publishedAt).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-white">
                            <Heart className="w-6 h-6" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-white">
                            <Plus className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Curator Comment (The "Editorial" Text) */}
                {video.comment && (
                    <div className={cn(
                        "relative pl-4 border-l-2 border-white/20",
                        isCompact && "line-clamp-3"
                    )}>
                        <p className="text-gray-300 text-sm leading-relaxed font-light whitespace-pre-wrap">
                            {video.comment}
                        </p>
                    </div>
                )}
            </div>
        </article>
    );
};
