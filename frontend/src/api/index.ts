const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// --- Collections ---

export const getCollections = async (): Promise<any[]> => {
    const res = await fetch(`${API_BASE_URL}/api/collections`);
    if (!res.ok) throw new Error('Failed to fetch collections');
    return res.json();
};

export const getCollection = async (id: string): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/api/collections/${id}`);
    if (!res.ok) throw new Error('Failed to fetch collection');
    return res.json();
};

export const updateCollection = async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/api/collections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update collection');
    return response.json();
};

export const deleteCollection = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/collections/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete collection');
};

export const getCollectionVideos = async (id: string, skip: number = 0, limit: number = 20): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/api/collections/${id}/videos?skip=${skip}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch videos');
    const data = await response.json();
    // New paginated format: { videos: [], total, skip, limit, has_more }
    // Return videos array for compatibility
    return data.videos || data;
};

export const deleteCollectionVideos = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/collections/${id}/videos`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete all videos');
};

export const getChannelInfo = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/collections/${id}/channel-info`);
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Failed to fetch channel info');
    }
    return response.json();
};

export const importFromChannel = async (id: string, limit: number = 5000, customChannelUrl?: string, defaultCategory?: string) => {
    const body: { limit: number; custom_channel_url?: string; default_category?: string } = { limit };
    if (customChannelUrl) {
        body.custom_channel_url = customChannelUrl;
    }
    if (defaultCategory) {
        body.default_category = defaultCategory;
    }

    const response = await fetch(`${API_BASE_URL}/api/collections/${id}/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Import failed');
    }
    return response.json();
};

// --- Videos ---

export const parseVideo = async (url: string) => {
    const response = await fetch(`${API_BASE_URL}/api/videos/parse?url=${encodeURIComponent(url)}`, { method: 'POST' });
    if (!response.ok) throw new Error(`Failed to parse: ${url}`);
    return response.json();
};

export const addVideoToCollection = async (collectionId: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/api/collections/${collectionId}/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to add video');
    return response.json();
};

export const updateVideo = async (id: number, data: any) => {
    const response = await fetch(`${API_BASE_URL}/api/videos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update video');
    return response.json();
};

export const deleteVideo = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/api/videos/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete video');
};
