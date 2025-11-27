import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CheckCircle, Youtube } from 'lucide-react';

interface CollectionHeaderProps {
    title: string;
    description: string;
    coverImageUrl: string;
    profileImageUrl?: string;
    officialLink?: string;
    isOfficial?: boolean;
}

export const CollectionHeader: React.FC<CollectionHeaderProps> = ({
    title,
    description,
    coverImageUrl,
    profileImageUrl,
    officialLink,
    isOfficial = false,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();

    // Parallax effects
    const y = useTransform(scrollY, [0, 500], [0, 250]);
    const opacity = useTransform(scrollY, [0, 400], [1, 0.3]);
    const blur = useTransform(scrollY, [0, 400], ["0px", "10px"]);

    return (
        <div ref={ref} className="relative h-[500px] w-full overflow-hidden bg-black">
            {/* Background Image with Parallax */}
            <motion.div
                style={{ y, opacity, filter: `blur(${blur})` }}
                className="absolute inset-0 z-0"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />
                <img
                    src={coverImageUrl}
                    alt={title}
                    className="h-full w-full object-cover"
                />
            </motion.div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 z-20 w-full p-6 md:p-12">
                <div className="mx-auto max-w-5xl">
                    <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                        {/* Profile Image (Optional) */}
                        {profileImageUrl && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-black shadow-2xl"
                            >
                                <img
                                    src={profileImageUrl}
                                    alt="Profile"
                                    className="h-full w-full object-cover"
                                />
                            </motion.div>
                        )}

                        {/* Text Info */}
                        <div className="flex-1 space-y-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="flex items-center gap-2"
                            >
                                {isOfficial && (
                                    <>
                                        <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">
                                            Official Artist
                                        </span>
                                        <CheckCircle className="w-5 h-5 text-blue-400" />
                                    </>
                                )}
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="text-5xl md:text-7xl font-bold text-white tracking-tight"
                            >
                                {title}
                            </motion.h1>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="flex flex-col gap-4"
                            >
                                <p className="text-lg text-gray-300 max-w-2xl">
                                    {description}
                                </p>

                                {officialLink && (
                                    <a
                                        href={officialLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 w-fit bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                                    >
                                        <Youtube className="w-4 h-4" />
                                        Visit Official Channel
                                    </a>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
