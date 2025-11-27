const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- Collections ---

export const getCollections = async () => {
    const response = await fetch(`${BASE_URL}/collections/`);
    if (!response.ok) throw new Error('Failed to fetch collections');
    return response.json();
};

export const getCollection = async (id: string) => {
    const response = await fetch(`${BASE_URL}/collections/${id}`);
    if (!response.ok) throw new Error('Failed to fetch collection');
    return response.json();
};

export const updateCollection = async (id: string, data: any) => {
    const response = await fetch(`${BASE_URL}/collections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update collection');
    return response.json();
};

export const getCollectionVideos = async (id: string, skip: number = 0, limit: number = 100) => {
    const response = await fetch(`${BASE_URL}/collections/${id}/videos?skip=${skip}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch videos');
    return response.json();
};

export const deleteCollectionVideos = async (id: string) => {
    const response = await fetch(`${BASE_URL}/collections/${id}/videos`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete all videos');
};

export const getChannelInfo = async (id: string) => {
    const response = await fetch(`${BASE_URL}/collections/${id}/channel-info`);
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Failed to fetch channel info');
    }
    return response.json();
};

export const importFromChannel = async (id: string, limit: number = 5000) => {
    const response = await fetch(`${BASE_URL}/collections/${id}/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit })
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Import failed');
    }
    return response.json();
};

// --- Videos ---

export const parseVideo = async (url: string) => {
    const response = await fetch(`${BASE_URL}/videos/parse?url=${encodeURIComponent(url)}`, { method: 'POST' });
    if (!response.ok) throw new Error(`Failed to parse: ${url}`);
    return response.json();
};

export const addVideoToCollection = async (collectionId: string, data: any) => {
    const response = await fetch(`${BASE_URL}/collections/${collectionId}/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to add video');
    return response.json();
};

export const updateVideo = async (id: number, data: any) => {
    const response = await fetch(`${BASE_URL}/videos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update video');
    return response.json();
};

export const deleteVideo = async (id: number) => {
    const response = await fetch(`${BASE_URL}/videos/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete video');
};
