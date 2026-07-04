import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input, Textarea, Select, Button, Card } from '@/components/ui';
import { API_BASE_URL } from '../api';

interface CreateCollectionForm {
    title: string;
    description: string;
    cover_image_url: string;
    type: 'OFFICIAL' | 'USER';
}

interface BulkAddForm {
    collection_id: number;
    videos: { url: string }[];
}

export const AdminPage: React.FC = () => {
    const queryClient = useQueryClient();

    // --- Collection Creation ---
    const { register: registerCollection, handleSubmit: handleSubmitCollection, reset: resetCollection } = useForm<CreateCollectionForm>();

    const createCollectionMutation = useMutation({
        mutationFn: async (data: CreateCollectionForm) => {
            const response = await fetch(`${API_BASE_URL}/api/collections/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to create collection');
            return response.json();
        },
        onSuccess: () => {
            toast.success('Collection created successfully!');
            resetCollection();
            queryClient.invalidateQueries({ queryKey: ['collections'] });
        },
        onError: () => toast.error('Failed to create collection'),
    });

    // --- Video Addition ---
    const { register: registerVideo, control, handleSubmit: handleSubmitVideo, reset: resetVideo } = useForm<BulkAddForm>({
        defaultValues: {
            videos: [{ url: '' }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "videos"
    });

    const [addProgress, setAddProgress] = useState<string | null>(null);

    // Fetch collections for dropdown
    const { data: collections } = useQuery({
        queryKey: ['collections'],
        queryFn: async () => {
            const response = await fetch(`${API_BASE_URL}/api/collections/`);
            if (!response.ok) throw new Error('Failed to fetch collections');
            return response.json();
        }
    });

    const handleBulkAdd = async (data: BulkAddForm) => {
        const urlList = data.videos.map(v => v.url.trim()).filter(u => u.length > 0);
        if (urlList.length === 0) return;

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < urlList.length; i++) {
            const url = urlList[i];
            setAddProgress(`Processing ${i + 1}/${urlList.length}: ${url}`);

            try {
                // 1. Parse Video URL
                const parseResponse = await fetch(`${API_BASE_URL}/api/videos/parse?url=${encodeURIComponent(url)}`, {
                    method: 'POST'
                });
                if (!parseResponse.ok) throw new Error(`Failed to parse: ${url}`);
                const videoData = await parseResponse.json();

                // 2. Add to Collection
                const response = await fetch(`${API_BASE_URL}/api/collections/${data.collection_id}/videos`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(videoData),
                });
                if (!response.ok) throw new Error(`Failed to add: ${url}`);
                successCount++;
            } catch (error) {
                console.error(error);
                failCount++;
            }
        }

        setAddProgress(null);

        if (failCount === 0) {
            toast.success(`✅ Added ${successCount} videos successfully!`);
        } else {
            toast.error(`Finished! Added: ${successCount}, Failed: ${failCount}`);
        }

        if (successCount > 0) {
            resetVideo({
                collection_id: data.collection_id,
                videos: [{ url: '' }]
            });
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-12">
            <div className="max-w-4xl mx-auto space-y-12">
                <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

                {/* Create Collection Section */}
                <Card className="p-8 bg-gray-900/50 border-white/10">
                    <h2 className="text-2xl font-bold mb-6">Create New Collection</h2>
                    <form onSubmit={handleSubmitCollection((data) => createCollectionMutation.mutate(data))} className="space-y-4">
                        <Input
                            label="Title"
                            {...registerCollection('title', { required: true })}
                        />
                        <Textarea
                            label="Description"
                            {...registerCollection('description', { required: true })}
                            rows={3}
                        />
                        <Input
                            label="Cover Image URL"
                            {...registerCollection('cover_image_url', { required: true })}
                        />
                        <Select
                            label="Type"
                            {...registerCollection('type')}
                        >
                            <option value="OFFICIAL">Official</option>
                            <option value="USER">User</option>
                        </Select>
                        <Button
                            type="submit"
                            disabled={createCollectionMutation.isPending}
                            loading={createCollectionMutation.isPending}
                        >
                            Create Collection
                        </Button>
                    </form>
                </Card>

                {/* Add Video Section */}
                <Card className="p-8 bg-gray-900/50 border-white/10">
                    <h2 className="text-2xl font-bold mb-6">Add Videos to Collection</h2>
                    <form onSubmit={handleSubmitVideo(handleBulkAdd)} className="space-y-6">
                        <Select
                            label="Select Collection"
                            {...registerVideo('collection_id', { required: true })}
                        >
                            <option value="">-- Select a Collection --</option>
                            {collections?.map((c: any) => (
                                <option key={c.id} value={c.id}>
                                    {c.title} (ID: {c.id})
                                </option>
                            ))}
                        </Select>

                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-400">YouTube URLs</label>
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-2">
                                    <div className="flex-1">
                                        <Input
                                            {...registerVideo(`videos.${index}.url` as const, { required: true })}
                                            placeholder="https://youtu.be/..."
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={() => remove(index)}
                                        variant="ghost"
                                        className="text-gray-500 hover:text-red-400"
                                        disabled={fields.length === 1}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                </div>
                            ))}

                            <Button
                                type="button"
                                onClick={() => append({ url: '' })}
                                variant="ghost"
                                className="text-blue-400 hover:text-blue-300"
                            >
                                <Plus className="w-4 h-4 mr-2" /> Add Another URL
                            </Button>
                        </div>

                        {addProgress && (
                            <div className="text-blue-400 text-sm font-mono animate-pulse">
                                {addProgress}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={!!addProgress}
                            loading={!!addProgress}
                        >
                            {addProgress ? 'Processing...' : 'Add All Videos'}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};
