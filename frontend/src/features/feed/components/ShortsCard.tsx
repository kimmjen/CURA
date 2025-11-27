import React from 'react';
import { Play } from 'lucide-react';

interface ShortsCardProps {
    video: {
        id: number;
        title: string;
        thumbnailUrl: string;
        youtubeVideoId: string;
    };
    onPlay: () => void;
}

export const ShortsCard: React.FC<ShortsCardProps> = ({ video, onPlay }) => {
    return (
        <button
            onClick={onPlay}
            className="group relative block w-full aspect-[9/16] bg-gray-900 rounded-xl overflow-hidden border border-white/5 hover:border-white/20 transition-all hover:scale-[1.02] text-left"
        >
            {/* Thumbnail */}
            <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-4">
                <div className="flex items-center gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <Play className="w-3 h-3 text-black fill-current ml-0.5" />
                    </div>
                    <span className="text-xs font-bold text-white">Watch Short</span>
                </div>
                <h3 className="text-white font-bold leading-tight line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {video.title}
                </h3>
            </div>
        </button>
    );
};
