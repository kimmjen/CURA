import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import MainLayout from '@/components/layout/MainLayout';
import { CollectionHeader } from '@/components/collection';
import { VideoGrid, VideoCard } from '@/components/video';
import Button from '@/components/ui/Button';
import Dropdown, { DropdownItem } from '@/components/ui/Dropdown';
import { ImportVideosModal } from '@/components/modals';
import EditCollectionModal from '@/components/modals/EditCollectionModal';
import { LoadingSpinner, EmptyState, ErrorState } from '@/components/common';
import { useCollection, useInfiniteVideos, useImportVideos } from '@/api';
import { api } from '@/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/contexts/ToastContext';
import type { Video, VideoCategory } from '@/types/video';

export default function CollectionDetailPage() {
    const { t } = useLanguage();
    const { showToast } = useToast();

    const VIDEO_CATEGORIES: { value: VideoCategory | 'ALL'; label: string }[] = [
        { value: 'ALL', label: t('collection_detail.all') },
        { value: 'MV', label: t('categories.MV') },
        { value: 'LIVE', label: t('categories.LIVE') },
        { value: 'FANCAM', label: t('categories.FANCAM') },
        { value: 'BROADCAST', label: t('categories.BROADCAST') },
        { value: 'BEHIND', label: t('categories.BEHIND') },
        { value: 'SHORTS', label: t('categories.SHORTS') },
        { value: 'INTERVIEW', label: t('categories.INTERVIEW') },
        { value: 'VLOG', label: t('categories.VLOG') },
        { value: 'DANCE', label: t('categories.DANCE') },
        { value: 'COVER', label: t('categories.COVER') },
        { value: 'REACTION', label: t('categories.REACTION') },
    ];
    const { id } = useParams();
    const navigate = useNavigate();
    const collectionId = Number(id);

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('recent');
    const [categoryFilter, setCategoryFilter] = useState<VideoCategory | 'ALL'>('ALL');
    const [showImportModal, setShowImportModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    // Infinite scroll
    const { ref: loadMoreRef, inView } = useInView();

    // React Query
    const { data: collection, isLoading: collectionLoading, error: collectionError, refetch: refetchCollection } = useCollection(collectionId);
    const {
        data: videosData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: videosLoading,
    } = useInfiniteVideos(collectionId, {
        size: 20,
        sort: sortBy,
        category: categoryFilter === 'ALL' ? undefined : categoryFilter,
    });
    const importVideosMutation = useImportVideos();

    // Auto load more when scrolling
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const allVideos = videosData?.pages.flatMap(page => page.videos || []) || [];

    const handleImportVideos = async (data: any) => {
        try {
            await importVideosMutation.mutateAsync({
                youtubeUrl: data.url,
                collectionId,
                defaultCategory: data.defaultCategory,
                type: data.type, // 'video' | 'playlist' | 'channel'
            });
            setShowImportModal(false);
            showToast('비디오 가져오기 성공!', 'success');
        } catch (err: any) {
            // Handle duplicate video gracefully
            if (err?.isDuplicate) {
                console.warn('Duplicate video:', err.message);
                showToast(err.message || '이미 존재하는 비디오입니다.', 'warning');
                setShowImportModal(false);
                return;
            }
            console.error('Failed to import videos:', err);
            showToast('비디오 가져오기 실패', 'error');
        }
    };

    const handlePlayAll = () => {
        if (allVideos.length > 0) {
            navigate(`/player/${allVideos[0].id}?collectionId=${collectionId}`);
        }
    };

    const handleEdit = () => {
        navigate(`/collection/${collectionId}/edit`);
    };

    const handleUpdateCollection = async (data: { title?: string; description?: string }) => {
        await api.updateCollection(collectionId, data);
        await refetchCollection();
    };

    if (collectionLoading || videosLoading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-screen">
                    <LoadingSpinner size="lg" />
                </div>
            </MainLayout>
        );
    }

    if (collectionError || !collection) {
        return (
            <MainLayout>
                <div className="p-8">
                    <ErrorState
                        title={t('collection_detail.not_found_title')}
                        message={t('collection_detail.not_found_msg')}
                    />
                </div>
            </MainLayout>
        );
    }

    const currentCategoryLabel = VIDEO_CATEGORIES.find(c => c.value === categoryFilter)?.label || t('collection_detail.all');

    return (
        <MainLayout>
            <div className="p-6">
                {/* Collection Header */}
                <CollectionHeader
                    collection={collection}
                    onPlayAll={handlePlayAll}
                    onEdit={handleEdit}
                />

                {/* Import Videos Button */}
                <div className="my-6">
                    <Button onClick={() => setShowImportModal(true)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        {t('collection_detail.import.btn_add')}
                    </Button>
                </div>

                {/* Filters & Controls */}
                <div className="flex items-center justify-between my-6">
                    <div className="flex items-center gap-4">
                        {/* Sort */}
                        <Dropdown
                            trigger={
                                <Button variant="secondary" size="sm" className="justify-between min-w-[140px]">
                                    {t('collection_detail.sort_by')} {sortBy === 'recent' ? t('collection_detail.recent') : t('collection_detail.popular')}
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Button>
                            }
                        >
                            <DropdownItem onClick={() => setSortBy('recent')}>{t('collection_detail.recent')}</DropdownItem>
                            <DropdownItem onClick={() => setSortBy('popular')}>{t('collection_detail.popular')}</DropdownItem>
                            <DropdownItem onClick={() => setSortBy('duration')}>{t('collection_detail.duration')}</DropdownItem>
                        </Dropdown>

                        {/* Filter by Category */}
                        <Dropdown
                            trigger={
                                <Button variant="secondary" size="sm" className="justify-between min-w-[160px]">
                                    {t('collection_detail.category')} {currentCategoryLabel}
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Button>
                            }
                        >
                            {VIDEO_CATEGORIES.map((cat) => (
                                <DropdownItem
                                    key={cat.value}
                                    onClick={() => setCategoryFilter(cat.value)}
                                >
                                    {cat.label}
                                </DropdownItem>
                            ))}
                        </Dropdown>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('grid')}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                                <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                                <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                                <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('list')}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </Button>
                    </div>
                </div>

                {/* Video Grid */}
                {allVideos.length > 0 ? (
                    <>
                        <VideoGrid columns={viewMode === 'grid' ? 4 : 2}>
                            {allVideos.map((video: Video) => (
                                <VideoCard
                                    key={video.id}
                                    video={video}
                                    onClick={() => navigate(`/player/${video.id}?collectionId=${collectionId}`)}
                                    showProgress
                                />
                            ))}
                        </VideoGrid>

                        {/* Load More Trigger */}
                        <div ref={loadMoreRef} className="flex justify-center py-8">
                            {isFetchingNextPage && <LoadingSpinner />}
                            {!hasNextPage && (
                                <p className="text-[var(--color-text-tertiary)] text-sm">
                                    {t('collection_detail.fetch_all_done')}
                                </p>
                            )}
                        </div>
                    </>
                ) : (
                    <EmptyState
                        title={t('collection_detail.no_videos_title')}
                        description={t('collection_detail.empty_desc')}
                        action={
                            <Button onClick={() => setShowImportModal(true)}>
                                {t('collection_detail.import.btn_add')}
                            </Button>
                        }
                    />
                )}
            </div>

            {/* Import Videos Modal */}
            <ImportVideosModal
                open={showImportModal}
                onClose={() => setShowImportModal(false)}
                collectionId={collectionId}
                onImport={handleImportVideos}
            />

            {/* Edit Collection Modal */}
            <EditCollectionModal
                open={showEditModal}
                onClose={() => setShowEditModal(false)}
                collection={collection}
                onUpdate={handleUpdateCollection}
            />
        </MainLayout>
    );
}
