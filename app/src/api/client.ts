const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';
import type { Video, Collection } from '@/types/video';
import { supabase } from '@/config/supabase';

// Types
export interface ApiResponse<T> {
    data: T;
    message?: string;
}

export interface PaginatedResponse<T> {
    videos: T[];
    total: number;
    page: number;
    pageSize: number;
}

export const api = {
    // ============= Collections =============

    /**
     * GET /api/collections
     * 모든 컬렉션 목록 조회
     */
    getCollections: async ({ pageParam = 0 }: { pageParam?: number } = {}): Promise<{
        content: Collection[];
        last: boolean;
        first: boolean;
        size: number;
        number: number;
        numberOfElements: number;
        empty: boolean;
    }> => {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_BASE_URL}/api/collections?page=${pageParam}&size=20`, { headers });
        if (!response.ok) throw new Error('Failed to fetch collections');
        return response.json();
    },

    /**
     * GET /api/collections/{id}
     * 특정 컬렉션 조회
     */
    getCollection: async (id: number): Promise<Collection> => {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_BASE_URL}/api/collections/${id}`, { headers });
        if (!response.ok) throw new Error('Failed to fetch collection');
        return response.json();
    },

    /**
     * POST /api/collections
     * 새 컬렉션 생성
     */
    createCollection: async (data: {
        title: string;
        description?: string;
        coverImageUrl?: string;
        profileImageUrl?: string;
        type?: 'USER' | 'OFFICIAL';
    }) => {
        const { data: authData } = await supabase.auth.getSession();
        const token = authData.session?.access_token;

        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${API_BASE_URL}/api/collections`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create collection');
        return response.json();
    },

    /**
     * PUT /api/collections/{id}
     * 컬렉션 수정
     */
    updateCollection: async (id: number, data: {
        title?: string;
        description?: string;
        coverImageUrl?: string;
        profileImageUrl?: string;
        type?: 'USER' | 'OFFICIAL';
    }) => {
        const { data: authData } = await supabase.auth.getSession();
        const token = authData.session?.access_token;

        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${API_BASE_URL}/api/collections/${id}`, {
            method: 'PATCH', // Changed to PATCH to match backend
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update collection');
        return response.json();
    },

    /**
     * DELETE /api/collections/{id}
     * 컬렉션 삭제
     */
    deleteCollection: async (id: number) => {
        const { data: authData } = await supabase.auth.getSession();
        const token = authData.session?.access_token;

        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${API_BASE_URL}/api/collections/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) throw new Error('Failed to delete collection');
        // No content to return usually
    },

    // ============= Videos =============

    /**
     * GET /api/collections/{collectionId}/videos
     * 컬렉션의 비디오 목록 조회
     */
    getVideos: async (collectionId: number, params?: {
        page?: number;
        pageSize?: number;
        sort?: string;
    }): Promise<PaginatedResponse<Video>> => {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const query = new URLSearchParams();
        if (params?.page !== undefined) query.append('page', params.page.toString());
        if (params?.pageSize !== undefined) query.append('pageSize', params.pageSize.toString());
        if (params?.sort) query.append('sort', params.sort);

        const url = `${API_BASE_URL}/api/collections/${collectionId}/videos${query.toString() ? '?' + query.toString() : ''}`;
        const response = await fetch(url, { headers });
        if (!response.ok) throw new Error('Failed to fetch videos');
        return response.json();
    },

    /**
     * GET /api/videos/{id}
     * 특정 비디오 조회
     */
    getVideo: async (id: number): Promise<Video> => {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_BASE_URL}/api/videos/${id}`, { headers });
        if (!response.ok) throw new Error('Failed to fetch video');
        return response.json();
    },

    /**
     * POST /api/collections/{collectionId}/videos
     * YouTube 비디오 가져오기 (단일/플레이리스트/채널)
     */
    importVideos: async (data: {
        youtubeUrl: string;
        collectionId: number;
        defaultCategory?: string;
        type?: 'video' | 'playlist' | 'channel';
    }) => {
        const { data: authData } = await supabase.auth.getSession();
        const token = authData.session?.access_token;
        if (!token) throw new Error('Authentication required');

        const { collectionId, youtubeUrl, defaultCategory, type = 'video' } = data;

        // Different endpoint based on type
        let endpoint: string;
        let body: Record<string, unknown>;

        if (type === 'channel') {
            endpoint = `${API_BASE_URL}/api/videos/collection/${collectionId}/import-channel`;
            body = {
                channelUrl: youtubeUrl,
                defaultCategory: defaultCategory || 'ETC',
            };
        } else if (type === 'playlist') {
            endpoint = `${API_BASE_URL}/api/videos/collection/${collectionId}/import-playlist`;
            body = {
                playlistUrl: youtubeUrl,
                defaultCategory: defaultCategory || 'ETC',
            };
        } else {
            // Single video
            endpoint = `${API_BASE_URL}/api/collections/${collectionId}/videos`;
            body = {
                youtubeUrl,
                category: defaultCategory || 'ETC',
            };
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            console.error('Import videos failed:', response.status, response.statusText);
            const errorText = await response.text();
            console.error('Error body:', errorText);

            // Handle duplicate video (409 Conflict) specially
            if (response.status === 409) {
                const parsed = JSON.parse(errorText);
                const error = new Error(parsed.message || '이미 존재하는 비디오입니다.') as Error & { isDuplicate?: boolean };
                error.isDuplicate = true;
                throw error;
            }

            throw new Error(`Failed to import videos: ${response.status} - ${errorText}`);
        }
        return response.json();
    },

    /**
     * PATCH /api/videos/{id}
     * 비디오 정보 수정
     */
    updateVideo: async (id: number, data: {
        title?: string;
        category?: string;
    }) => {
        const { data: authData } = await supabase.auth.getSession();
        const token = authData.session?.access_token;
        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${API_BASE_URL}/api/videos/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update video');
        return response.json();
    },

    /**
     * DELETE /api/videos/{id}
     * 비디오 삭제
     */
    deleteVideo: async (id: number) => {
        const { data: authData } = await supabase.auth.getSession();
        const token = authData.session?.access_token;
        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${API_BASE_URL}/api/videos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) throw new Error('Failed to delete video');
        return response.json();
    },

    /**
     * POST /api/videos/sync-all
     * 모든 비디오 메타데이터 동기화
     */
    syncAllVideos: async () => {
        const { data: authData } = await supabase.auth.getSession();
        const token = authData.session?.access_token;
        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${API_BASE_URL}/api/videos/sync-all`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) throw new Error('Failed to sync all videos');
    },

    /**
     * POST /api/videos/{id}/sync
     * 단일 비디오 메타데이터 동기화
     */
    syncVideo: async (id: number) => {
        const { data: authData } = await supabase.auth.getSession();
        const token = authData.session?.access_token;
        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${API_BASE_URL}/api/videos/${id}/sync`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) throw new Error('Failed to sync video');
        return response.json();
    },

    /**
     * POST /api/videos/collection/{collectionId}/sync-channel
     * 채널 비디오 동기화
     */
    syncChannel: async (collectionId: number) => {
        const { data: authData } = await supabase.auth.getSession();
        const token = authData.session?.access_token;
        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${API_BASE_URL}/api/videos/collection/${collectionId}/sync-channel`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) throw new Error('Failed to sync channel');
        return response.json();
    },

    // ============= Video Notes =============

    /**
     * GET /api/videos/{videoId}/notes
     * 비디오 노트 목록 조회
     */
    getVideoNotes: async (videoId: number): Promise<VideoNote[]> => {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${API_BASE_URL}/api/videos/${videoId}/notes`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch notes');
        return response.json();
    },

    /**
     * POST /api/videos/{videoId}/notes
     * 노트 생성
     */
    createVideoNote: async (videoId: number, data: { content: string; timestampSeconds?: number }): Promise<VideoNote> => {
        const { data: authData } = await supabase.auth.getSession();
        const token = authData.session?.access_token;
        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${API_BASE_URL}/api/videos/${videoId}/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create note');
        return response.json();
    },

    /**
     * PATCH /api/videos/{videoId}/notes/{noteId}
     * 노트 수정
     */
    updateVideoNote: async (videoId: number, noteId: number, data: { content?: string; timestampSeconds?: number }): Promise<VideoNote> => {
        const { data: authData } = await supabase.auth.getSession();
        const token = authData.session?.access_token;
        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${API_BASE_URL}/api/videos/${videoId}/notes/${noteId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update note');
        return response.json();
    },

    /**
     * DELETE /api/videos/{videoId}/notes/{noteId}
     * 노트 삭제
     */
    deleteVideoNote: async (videoId: number, noteId: number): Promise<void> => {
        const { data: authData } = await supabase.auth.getSession();
        const token = authData.session?.access_token;
        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${API_BASE_URL}/api/videos/${videoId}/notes/${noteId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to delete note');
    },
};

// VideoNote type
export interface VideoNote {
    id: number;
    videoId: number;
    content: string;
    timestampSeconds?: number;
    createdAt: string;
    updatedAt?: string;
}
