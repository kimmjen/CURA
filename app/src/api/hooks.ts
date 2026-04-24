import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { api } from './client';

// ============= Collections =============

/**
 * 모든 컬렉션 목록 조회
 */
export function useCollections() {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['collections', user?.id],
        queryFn: () => api.getCollections({ userId: user?.id }),
    });
}

/**
 * 특정 컬렉션 조회
 */
export function useCollection(id: number) {
    return useQuery({
        queryKey: ['collections', id],
        queryFn: () => api.getCollection(id),
        enabled: !!id,
    });
}

/**
 * 컬렉션 생성
 */
export function useCreateCollection() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: (data: any) => {
            if (!user) throw new Error('User must be logged in to create a collection');
            return api.createCollection({ ...data, userId: user.id });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collections'] });
            // Also invalidate sidebar collections list
            queryClient.invalidateQueries({ queryKey: ['collections-infinite'] });
        },
    });
}

/**
 * 컬렉션 수정
 */
export function useUpdateCollection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) =>
            api.updateCollection(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['collections'] });
            queryClient.invalidateQueries({ queryKey: ['collections', variables.id] });
            // Also invalidate sidebar collections list
            queryClient.invalidateQueries({ queryKey: ['collections-infinite'] });
        },
    });
}

/**
 * 컬렉션 삭제
 */
export function useDeleteCollection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: api.deleteCollection,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collections'] });
            // Also invalidate sidebar collections list
            queryClient.invalidateQueries({ queryKey: ['collections-infinite'] });
        },
    });
}

// ============= Videos =============

/**
 * 컬렉션의 비디오 목록 조회
 */
export function useVideos(collectionId: number, params?: {
    page?: number;
    size?: number;
    sort?: string;
}) {
    return useQuery({
        queryKey: ['videos', collectionId, params],
        queryFn: () => api.getVideos(collectionId, params),
        enabled: !!collectionId,
    });
}

/**
 * 특정 비디오 조회
 */
export function useVideo(id: number) {
    return useQuery({
        queryKey: ['videos', 'detail', id],
        queryFn: () => api.getVideo(id),
        enabled: !!id,
    });
}

/**
 * 비디오 가져오기 (단일/플레이리스트/채널)
 */
export function useImportVideos() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: api.importVideos,
        onSuccess: (_, variables) => {
            // Invalidate both regular and infinite video queries
            queryClient.invalidateQueries({ queryKey: ['videos', variables.collectionId] });
            queryClient.invalidateQueries({ queryKey: ['videos', 'infinite', variables.collectionId] });
            queryClient.invalidateQueries({ queryKey: ['collections', variables.collectionId] });
            // Also invalidate sidebar collections list for videoCount update
            queryClient.invalidateQueries({ queryKey: ['collections-infinite'] });
        },
    });
}

/**
 * 비디오 수정
 */
export function useUpdateVideo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) =>
            api.updateVideo(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['videos'] });
            queryClient.invalidateQueries({ queryKey: ['videos', 'detail', variables.id] });
        },
    });
}

/**
 * 비디오 삭제
 */
export function useDeleteVideo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: api.deleteVideo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['videos'] });
        },
    });
}

/**
 * 플레이리스트 가져오기
 */
export function useImportPlaylist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: api.importPlaylist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collections'] });
        },
    });
}

// ============= Video Notes =============

/**
 * 비디오 노트 목록 조회
 */
export function useVideoNotes(videoId: number) {
    return useQuery({
        queryKey: ['video-notes', videoId],
        queryFn: () => api.getVideoNotes(videoId),
        enabled: !!videoId,
    });
}

/**
 * 노트 생성
 */
export function useCreateNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ videoId, content, timestampSeconds }: { videoId: number; content: string; timestampSeconds?: number }) =>
            api.createVideoNote(videoId, { content, timestampSeconds }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['video-notes', variables.videoId] });
        },
    });
}

/**
 * 노트 수정
 */
export function useUpdateNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ videoId, noteId, content, timestampSeconds }: { videoId: number; noteId: number; content?: string; timestampSeconds?: number }) =>
            api.updateVideoNote(videoId, noteId, { content, timestampSeconds }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['video-notes', variables.videoId] });
        },
    });
}

/**
 * 노트 삭제
 */
export function useDeleteNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ videoId, noteId }: { videoId: number; noteId: number }) =>
            api.deleteVideoNote(videoId, noteId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['video-notes', variables.videoId] });
        },
    });
}
