import React from 'react';

interface CollectionInfoSectionProps {
    collection: {
        description: string;
        created_at: string;
        type: string;
        official_link?: string;
    };
    videoCount: number;
}

export const CollectionInfoSection: React.FC<CollectionInfoSectionProps> = ({ collection, videoCount }) => {
    return (
        <div className="animate-fade-in space-y-12">
            <section className="grid md:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">About</h2>
                    <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                        {collection.description}
                    </p>

                    <div className="mt-8 space-y-4">
                        <div className="flex items-center gap-4 text-gray-400">
                            <span className="w-24 text-xs font-bold uppercase tracking-wider">Created</span>
                            <span className="text-white">{new Date(collection.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-400">
                            <span className="w-24 text-xs font-bold uppercase tracking-wider">Videos</span>
                            <span className="text-white">{videoCount} items</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-400">
                            <span className="w-24 text-xs font-bold uppercase tracking-wider">Type</span>
                            <span className="text-white">{collection.type} Collection</span>
                        </div>
                    </div>
                </div>

                {/* Official Link Card */}
                {collection.official_link && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors group">
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Official Channel</h3>
                        <p className="text-gray-400 mb-6">Visit the official YouTube channel for more updates.</p>
                        <a
                            href={collection.official_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white font-bold border-b border-white hover:opacity-80 transition-opacity"
                        >
                            Visit Channel &rarr;
                        </a>
                    </div>
                )}
            </section>
        </div>
    );
};
