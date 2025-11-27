import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShortsPlayerModalProps {
    isOpen: boolean;
    onClose: () => void;
    video: {
        title: string;
        youtubeVideoId: string;
    } | null;
}

export const ShortsPlayerModal: React.FC<ShortsPlayerModalProps> = ({ isOpen, onClose, video }) => {
    if (!isOpen || !video) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative w-full max-w-md aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button - Top Right */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-50 p-3 bg-black/50 backdrop-blur rounded-full text-white hover:bg-white/20 transition-colors touch-manipulation"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* YouTube Embed */}
                    <div className="absolute inset-0 z-0">
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${video.youtubeVideoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        />
                    </div>

                    {/* Mobile overlay for better touch handling if needed, or just rely on the button */}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
