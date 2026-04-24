import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/ui/Button';
import { CollectionCard } from '@/components/collection';
import { VideoGrid } from '@/components/video';
import { CreateCollectionModal } from '@/components/modals';
import { EmptyState, LoadingSpinner } from '@/components/common';
import { useCollections, useCreateCollection } from '@/api';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Collection } from '@/types/video';

export default function ManagementPage() {
    const { t } = useLanguage();
    const [showCreateCollection, setShowCreateCollection] = useState(false);

    // React Query
    const { data: collections, isLoading, error } = useCollections();
    const createCollectionMutation = useCreateCollection();

    const handleCreateCollection = async (data: any) => {
        try {
            await createCollectionMutation.mutateAsync(data);
            setShowCreateCollection(false);
        } catch (err) {
            console.error('Failed to create collection:', err);
            throw err;
        }
    };

    if (isLoading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-screen">
                    <LoadingSpinner size="lg" />
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <div className="p-8">
                    <div className="text-center text-[var(--color-error)]">
                        {t('management.error_fetch')}
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                        {t('management.title')}
                    </h1>
                    <p className="text-[var(--color-text-secondary)]">
                        {t('management.subtitle')}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mb-6">
                    <Button onClick={() => setShowCreateCollection(true)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        {t('management.create_new')}
                    </Button>
                </div>

                {/* Collections Grid */}
                {collections && !collections.empty ? (
                    <VideoGrid columns={3}>
                        {collections.content.map((collection: Collection) => (
                            <CollectionCard
                                key={collection.id}
                                collection={collection}
                                onClick={() => window.location.href = `/collection/${collection.id}`}
                            />
                        ))}
                    </VideoGrid>
                ) : (
                    <EmptyState
                        title={t('management.empty_title')}
                        description={t('management.empty_desc')}
                        action={
                            <Button onClick={() => setShowCreateCollection(true)}>{t('management.create_new')}</Button>
                        }
                    />
                )}

                <div className="mt-8 p-4 bg-[var(--color-bg-tertiary)] rounded-[var(--radius-lg)]">
                    <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">
                        {t('management.manage_tip_title')}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        {t('management.manage_tip_desc')}
                    </p>
                    <ul className="text-sm text-[var(--color-text-secondary)] mt-2 space-y-1 list-disc list-inside">
                        <li>{t('management.manage_tip_list.item1')}</li>
                        <li>{t('management.manage_tip_list.item2')}</li>
                        <li>{t('management.manage_tip_list.item3')}</li>
                    </ul>
                </div>
            </div>

            {/* Modals */}
            <CreateCollectionModal
                open={showCreateCollection}
                onClose={() => setShowCreateCollection(false)}
                onCreate={handleCreateCollection}
            />
        </MainLayout>
    );
}
