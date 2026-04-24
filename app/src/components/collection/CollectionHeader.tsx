import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Collection } from '@/types/video';

export interface CollectionHeaderProps {
    collection: Collection;
    onPlayAll?: () => void;
    onEdit?: () => void;
}

export default function CollectionHeader({
    collection,
    onPlayAll,
    onEdit,
}: CollectionHeaderProps) {
    const { t } = useLanguage();
    return (
        <div className="flex flex-col md:flex-row gap-6 p-6 bg-[var(--color-bg-secondary)] rounded-[var(--radius-xl)] border border-[var(--color-border-default)]">
            {/* Cover Image */}
            <div className="shrink-0">
                <img
                    src={collection.coverImageUrl}
                    alt={collection.title}
                    className="w-64 h-64 object-cover rounded-[var(--radius-lg)]"
                />
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-center">
                {/* Type badge */}
                <div className="mb-2">
                    {collection.type === 'OFFICIAL' && (
                        <Badge
                            variant="status"
                            label={t('collection_header.official_collection')}
                            className="bg-[var(--color-accent-primary)]/20 text-[var(--color-accent-primary)] border border-[var(--color-accent-primary)]/40"
                        />
                    )}
                    {collection.source && (
                        <Badge
                            variant="status"
                            label={collection.source === 'imported' ? t('collection_header.imported') : t('collection_header.custom')}
                            className="ml-2"
                        />
                    )}
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-2">
                    {collection.title}
                </h1>

                {/* Description */}
                {collection.description && (
                    <p className="text-[var(--color-text-secondary)] mb-4 max-w-2xl">
                        {collection.description}
                    </p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)] mb-6">
                    <span className="font-semibold text-[var(--color-text-primary)]">
                        {collection.videoCount} {t('collection_header.videos_count')}
                    </span>
                    <span>•</span>
                    <span>{new Date(collection.createdAt).getFullYear()}</span>
                    {collection.officialLink && (
                        <>
                            <span>•</span>
                            <a
                                href={collection.officialLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--color-accent-primary)] hover:underline"
                            >
                                {t('collection_header.official_link')}
                            </a>
                        </>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button size="lg" onClick={onPlayAll}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        {t('collection_header.play_all')}
                    </Button>
                    {onEdit && (
                        <Button variant="secondary" size="lg" onClick={onEdit}>
                            {t('collection_header.edit')}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
