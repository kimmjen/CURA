import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ImageUpload } from '../../components/common/ImageUpload';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { AdminLayout } from '../../components/layout/AdminLayout';

interface CreateCollectionForm {
    title: string;
    description: string;
    cover_image_url: string;
    profile_image_url: string;
    official_link: string;
    type: 'OFFICIAL' | 'USER';
}

export const AdminCreateCollection: React.FC = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm<CreateCollectionForm>();

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
            queryClient.invalidateQueries({ queryKey: ['collections'] });
            navigate('/admin');
        },
        onError: () => setError('Failed to create collection.'),
    });

    return (
        <AdminLayout>
            <div className="p-10 max-w-4xl mx-auto">
                <Link to="/admin" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>

                <h1 className="text-3xl font-bold mb-8">Create New Collection</h1>

                {error && (
                    <div className="bg-red-900/50 text-red-200 p-4 rounded mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit((data) => createCollectionMutation.mutate(data))} className="space-y-6 bg-gray-900 rounded-xl border border-white/5 p-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                        <input {...register('title', { required: true })} className="w-full bg-black border border-gray-700 rounded p-3 focus:border-white outline-none transition" placeholder="e.g. TAEYEON" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                        <textarea {...register('description', { required: true })} className="w-full bg-black border border-gray-700 rounded p-3 focus:border-white outline-none transition" rows={4} placeholder="Collection description..." />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Cover Image</label>
                        <div className="space-y-2">
                            <ImageUpload
                                value={watch('cover_image_url')}
                                onChange={(url) => setValue('cover_image_url', url, { shouldDirty: true })}
                                placeholder="Upload Cover Image"
                            />
                            <input
                                {...register('cover_image_url', { required: true })}
                                value={watch('cover_image_url') || ''}
                                className="w-full bg-black border border-gray-700 rounded p-3 focus:border-white outline-none transition text-sm text-gray-500"
                                placeholder="Or enter URL directly..."
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Profile Image (Logo/Avatar)</label>
                        <div className="space-y-2">
                            <ImageUpload
                                value={watch('profile_image_url')}
                                onChange={(url) => setValue('profile_image_url', url, { shouldDirty: true })}
                                placeholder="Upload Profile Image"
                            />
                            <input
                                {...register('profile_image_url')}
                                value={watch('profile_image_url') || ''}
                                className="w-full bg-black border border-gray-700 rounded p-3 focus:border-white outline-none transition text-sm text-gray-500"
                                placeholder="Or enter URL directly..."
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Official Channel Link (YouTube)</label>
                        <input
                            {...register('official_link')}
                            className="w-full bg-black border border-gray-700 rounded p-3 focus:border-white outline-none transition text-sm text-gray-500"
                            placeholder="e.g., https://www.youtube.com/@taeyeon_official"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Type</label>
                        <select {...register('type')} className="w-full bg-black border border-gray-700 rounded p-3 focus:border-white outline-none transition">
                            <option value="OFFICIAL">Official</option>
                            <option value="USER">User</option>
                        </select>
                    </div>
                    <div className="pt-4">
                        <button type="submit" disabled={isSubmitting} className="w-full bg-white text-black py-3 rounded font-bold hover:bg-gray-200 transition disabled:opacity-50">
                            {isSubmitting ? 'Creating...' : 'Create Collection'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};
