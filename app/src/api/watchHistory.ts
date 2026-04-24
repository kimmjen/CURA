const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';
import { supabase } from '@/config/supabase';

export interface SaveWatchHistoryRequest {
    videoId: number;
    progressSeconds: number;
    durationSeconds: number;
    lastPositionSeconds: number;
}

export interface WatchHistoryVideo {
    id: number;
    youtubeVideoId: string;
    title: string;
    thumbnailUrl: string;
    channelName: string;
    durationSeconds: number;
    publishedAt: string;
    category: string;
    collectionId: number;
}

export interface WatchHistoryResponse {
    id: number;
    video: WatchHistoryVideo;
    watchedAt: string;
    progressSeconds: number;
    durationSeconds: number;
    isCompleted: boolean;
    lastPositionSeconds: number;
}

export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export const watchHistoryApi = {
    /**
     * POST /api/watch-history
     * 시청 기록 저장
     */
    save: async (userId: string, data: SaveWatchHistoryRequest): Promise<WatchHistoryResponse> => {
        const { data: authData } = await supabase.auth.getSession();
        const token = authData.session?.access_token;
        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${API_BASE_URL}/api/watch-history`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to save watch history');
        return response.json();
    },

    /**
     * GET /api/watch-history?page=0&size=20
     * 최근 시청 목록 조회
     */
    getRecent: async (userId: string, page = 0, size = 20): Promise<Page<WatchHistoryResponse>> => {
        const { data: authData } = await supabase.auth.getSession();
        const token = authData.session?.access_token;
        if (!token) throw new Error('Authentication required');

        const query = new URLSearchParams();
        query.append('page', page.toString());
        query.append('size', size.toString());

        const response = await fetch(`${API_BASE_URL}/api/watch-history?${query.toString()}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch watch history');
        return response.json();
    },

    /**
     * GET /api/watch-history/badge-count
     * 새 비디오 배지 카운트
     */
    getBadgeCount: async (userId: string): Promise<number> => {
        const { data: authData } = await supabase.auth.getSession();
        const token = authData.session?.access_token;
        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${API_BASE_URL}/api/watch-history/badge-count`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch badge count');
        return response.json();
    },

    /**
     * DELETE /api/watch-history/{videoId}
     * 특정 시청 기록 삭제
     */
    delete: async (userId: string, videoId: number): Promise<void> => {
        const { data: authData } = await supabase.auth.getSession();
        const token = authData.session?.access_token;
        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${API_BASE_URL}/api/watch-history/${videoId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to delete watch history');
    },

    /**
     * DELETE /api/watch-history
     * 전체 시청 기록 삭제
     */
    clearAll: async (userId: string): Promise<void> => {
        const { data: authData } = await supabase.auth.getSession();
        const token = authData.session?.access_token;
        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${API_BASE_URL}/api/watch-history`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to clear watch history');
    },
};