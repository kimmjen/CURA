import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import type { Collection } from '@/types/video';
import { cn } from '@/utils/utils';

export interface CollectionCardProps {
    collection: Collection;
    onClick?: () => void;
}

export default function CollectionCard({ collection, onClick }: CollectionCardProps) {
    return (
        <Card
            variant="clickable"
            padding="none"
            onClick={onClick}
            className="group overflow-hidden"
        >
            {/* Cover Image - Square */}
            <div className="relative aspect-square overflow-hidden bg-[var(--color-bg-tertiary)]">
                <img
                    src={collection.coverImageUrl}
                    alt={collection.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                />

                {/* Source badge */}
                {collection.source && (
                    <div className="absolute top-2 right-2">
                        <Badge
                            variant="status"
                            label={collection.source === 'imported' ? 'Imported' : 'Custom'}
                            size="sm"
                            className={cn(
                                collection.source === 'imported'
                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                                    : 'bg-green-500/20 text-green-400 border border-green-500/40'
                            )}
                        />
                    </div>
                )}

                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <div className="w-20 h-20 rounded-full bg-[var(--color-accent-primary)] flex items-center justify-center">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Title */}
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] line-clamp-1 mb-1">
                    {collection.title}
                </h3>

                {/* Description */}
                {collection.description && (
                    <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-2">
                        {collection.description}
                    </p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-2 text-xs text-[var(--color-text-tertiary)]">
                    <span>{collection.videoCount} videos</span>
                    {collection.type === 'OFFICIAL' && (
                        <>
                            <span>•</span>
                            <span className="text-[var(--color-accent-primary)]">Official</span>
                        </>
                    )}
                </div>
            </div>
        </Card>
    );
}
