import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clsx } from 'clsx';
import { Plus, Trash2 } from 'lucide-react';

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
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // --- Collection Creation ---
    const { register: registerCollection, handleSubmit: handleSubmitCollection, reset: resetCollection } = useForm<CreateCollectionForm>();

    const createCollectionMutation = useMutation({
        mutationFn: async (data: CreateCollectionForm) => {
            const response = await fetch('http://localhost:8000/api/collections/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to create collection');
            return response.json();
        },
        onSuccess: () => {
            setMessage({ type: 'success', text: 'Collection created successfully!' });
            resetCollection();
            queryClient.invalidateQueries({ queryKey: ['collections'] });
        },
        onError: () => setMessage({ type: 'error', text: 'Failed to create collection.' }),
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
            const response = await fetch('http://localhost:8000/api/collections/');
            if (!response.ok) throw new Error('Failed to fetch collections');
            return response.json();
        }
    });

    const handleBulkAdd = async (data: BulkAddForm) => {
        const urlList = data.videos.map(v => v.url.trim()).filter(u => u.length > 0);
        if (urlList.length === 0) return;

        setMessage(null);
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < urlList.length; i++) {
            const url = urlList[i];
            setAddProgress(`Processing ${i + 1}/${urlList.length}: ${url}`);

            try {
                // 1. Parse Video URL
                const parseResponse = await fetch(`http://localhost:8000/api/videos/parse?url=${encodeURIComponent(url)}`, {
                    method: 'POST'
                });
                if (!parseResponse.ok) throw new Error(`Failed to parse: ${url}`);
                const videoData = await parseResponse.json();

                // 2. Add to Collection
                const response = await fetch(`http://localhost:8000/api/collections/${data.collection_id}/videos`, {
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
        setMessage({
            type: failCount === 0 ? 'success' : 'error',
            text: `Finished! Added: ${successCount}, Failed: ${failCount}`
        });
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

                {message && (
                    <div className={clsx(
                        "p-4 rounded mb-8",
                        message.type === 'success' ? "bg-green-900/50 text-green-200" : "bg-red-900/50 text-red-200"
                    )}>
                        {message.text}
                    </div>
                )}

                {/* Create Collection Section */}
                <section className="bg-gray-900/50 p-8 rounded-xl border border-white/10">
                    <h2 className="text-2xl font-bold mb-6">Create New Collection</h2>
                    <form onSubmit={handleSubmitCollection((data) => createCollectionMutation.mutate(data))} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                            <input {...registerCollection('title', { required: true })} className="w-full bg-black border border-gray-700 rounded p-2 focus:border-white outline-none transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                            <textarea {...registerCollection('description', { required: true })} className="w-full bg-black border border-gray-700 rounded p-2 focus:border-white outline-none transition" rows={3} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Cover Image URL</label>
                            <input {...registerCollection('cover_image_url', { required: true })} className="w-full bg-black border border-gray-700 rounded p-2 focus:border-white outline-none transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                            <select {...registerCollection('type')} className="w-full bg-black border border-gray-700 rounded p-2 focus:border-white outline-none transition">
                                <option value="OFFICIAL">Official</option>
                                <option value="USER">User</option>
                            </select>
                        </div>
                        <button type="submit" disabled={createCollectionMutation.isPending} className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200 transition disabled:opacity-50">
                            {createCollectionMutation.isPending ? 'Creating...' : 'Create Collection'}
                        </button>
                    </form>
                </section>

                {/* Add Video Section */}
                <section className="bg-gray-900/50 p-8 rounded-xl border border-white/10">
                    <h2 className="text-2xl font-bold mb-6">Add Videos to Collection</h2>
                    <form onSubmit={handleSubmitVideo(handleBulkAdd)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Select Collection</label>
                            <select
                                {...registerVideo('collection_id', { required: true })}
                                className="w-full bg-black border border-gray-700 rounded p-2 focus:border-white outline-none transition"
                            >
                                <option value="">-- Select a Collection --</option>
                                {collections?.map((c: any) => (
                                    <option key={c.id} value={c.id}>
                                        {c.title} (ID: {c.id})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-400">YouTube URLs</label>
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-2">
                                    <input
                                        {...registerVideo(`videos.${index}.url` as const, { required: true })}
                                        className="flex-1 bg-black border border-gray-700 rounded p-2 focus:border-white outline-none transition"
                                        placeholder="https://youtu.be/..."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="p-2 text-gray-500 hover:text-red-400 transition"
                                        disabled={fields.length === 1}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => append({ url: '' })}
                                className="flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition"
                            >
                                <Plus className="w-4 h-4" /> Add Another URL
                            </button>
                        </div>

                        {addProgress && (
                            <div className="text-blue-400 text-sm font-mono animate-pulse">
                                {addProgress}
                            </div>
                        )}

                        <button type="submit" disabled={!!addProgress} className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200 transition disabled:opacity-50">
                            {addProgress ? 'Processing...' : 'Add All Videos'}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
};
