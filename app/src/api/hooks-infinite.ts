import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from './client';

/**
 * 무한 스크롤을 위한 비디오 목록 조회
 */
export function useInfiniteVideos(collectionId: number, params?: {
    pageSize?: number;
    sort?: string;
    category?: string;
}) {
    return useInfiniteQuery({
        queryKey: ['videos', 'infinite', collectionId, params],
        queryFn: ({ pageParam = 1 }) =>
            api.getVideos(collectionId, {
                page: pageParam,
                pageSize: params?.pageSize || 20,
                sort: params?.sort,
            }),
        getNextPageParam: (lastPage) => {
            const totalPages = Math.ceil(lastPage.total / lastPage.pageSize);
            return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
        },
        initialPageParam: 1,
        enabled: !!collectionId,
    });
}

/**
 * 무한 스크롤을 위한 컬렉션 목록 조회
 */
export function useInfiniteCollections() {
    return useInfiniteQuery({
        queryKey: ['collections-infinite'],
        queryFn: api.getCollections,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            return lastPage.last ? undefined : lastPage.number + 1;
        },
    });
}
