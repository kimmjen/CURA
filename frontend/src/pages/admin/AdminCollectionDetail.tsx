import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Trash2, Plus, ExternalLink, Youtube, Settings, Download, ListVideo, Edit } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { EditVideoModal } from '@/components/admin/EditVideoModal';
import { ImportModal } from '@/components/admin/ImportModal';
import clsx from 'clsx';
import * as api from '@/api';

interface UpdateCollectionForm {
    title: string;
    description: string;
    official_link?: string;
    cover_image_url: string;
    profile_image_url?: string;
    type: 'OFFICIAL' | 'USER';
}

interface BulkAddForm {
    videos: { url: string; category: 'MV' | 'LIVE' | 'SHORTS' | 'ETC' | 'FANCAM' | 'BEHIND' | 'VLOG' | 'INTERVIEW' }[];
}

export const AdminCollectionDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const [editingVideo, setEditingVideo] = useState<any>(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [filterCategory, setFilterCategory] = useState<string>('ALL');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [addProgress, setAddProgress] = useState<string | null>(null);



    // Fetch Collection Data
    const { data: collection, isLoading } = useQuery({
        queryKey: ['collection', id],
        queryFn: () => api.getCollection(id!),
        enabled: !!id
    });

    // Fetch Videos
    const { data: videos } = useQuery({
        queryKey: ['videos', id],
        queryFn: () => api.getCollectionVideos(id!),
        enabled: !!id
    });

    // --- Update Collection ---
    const { register: registerUpdate, handleSubmit: handleSubmitUpdate, reset: resetUpdate } = useForm<UpdateCollectionForm>();

    useEffect(() => {
        if (collection) {
            resetUpdate({
                title: collection.title,
                description: collection.description,
                cover_image_url: collection.cover_image_url,
                profile_image_url: collection.profile_image_url,
                official_link: collection.official_link,
                type: collection.type,
            });
        }
    }, [collection, resetUpdate]);

    const updateMutation = useMutation({
        mutationFn: (data: UpdateCollectionForm) => api.updateCollection(id!, data),
        onSuccess: () => {
            setMessage({ type: 'success', text: 'Collection updated successfully!' });
            queryClient.invalidateQueries({ queryKey: ['collection', id] });
        },
        onError: () => setMessage({ type: 'error', text: 'Failed to update collection.' }),
    });

    // --- Delete Video ---
    const deleteVideoMutation = useMutation({
        mutationFn: (videoId: number) => api.deleteVideo(videoId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['videos', id] });
        },
    });

    const deleteAllMutation = useMutation({
        mutationFn: () => api.deleteCollectionVideos(id!),
        onSuccess: () => {
            setMessage({ type: 'success', text: 'All videos deleted successfully.' });
            queryClient.invalidateQueries({ queryKey: ['videos', id] });
        },
        onError: () => setMessage({ type: 'error', text: 'Failed to delete videos.' }),
    });

    // --- Bulk Add Videos ---
    const { register: registerAdd, handleSubmit: handleSubmitAdd, reset: resetAdd } = useForm<BulkAddForm>({
        defaultValues: { videos: [{ url: '', category: 'ETC' }] }
    });



    const handleBulkAdd = async (data: BulkAddForm) => {
        const urlList = data.videos.filter(v => v.url.trim().length > 0);
        if (urlList.length === 0) return;

        setMessage(null);
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < urlList.length; i++) {
            const item = urlList[i];
            setAddProgress(`Processing ${i + 1}/${urlList.length}: ${item.url}`);

            try {
                const videoData = await api.parseVideo(item.url);

                // Add category to video data
                videoData.category = item.category;

                await api.addVideoToCollection(id!, videoData);
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
            resetAdd({ videos: [{ url: '', category: 'ETC' }] });
            queryClient.invalidateQueries({ queryKey: ['videos', id] });
        }
    };

    // --- Update Video ---
    const updateVideoMutation = useMutation({
        mutationFn: (updatedVideo: any) => api.updateVideo(updatedVideo.id, updatedVideo),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['videos', id] });
            setEditingVideo(null); // Close modal
        },
    });

    if (isLoading) return <div className="min-h-screen bg-black text-white p-12">Loading...</div>;

    return (
        <AdminLayout>
            <div className="p-10 space-y-12">
                <div className="flex items-center justify-between">
                    <Link to="/admin" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition">
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-500">Collection ID: {id}</h1>
                </div>

                {message && (
                    <div className={clsx(
                        "p-4 rounded mb-8",
                        message.type === 'success' ? "bg-green-900/50 text-green-200" : "bg-red-900/50 text-red-200"
                    )}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Edit Form */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-gray-900 rounded-xl border border-white/5 p-6">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Settings className="w-5 h-5 text-gray-400" /> Settings
                            </h2>
                            <form onSubmit={handleSubmitUpdate((data) => updateMutation.mutate(data))} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                                    <input {...registerUpdate('title')} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-white outline-none transition" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                    <textarea {...registerUpdate('description')} rows={3} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-white outline-none transition" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cover Image URL</label>
                                    <input {...registerUpdate('cover_image_url')} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-white outline-none transition" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Official Channel Link</label>
                                    <input {...registerUpdate('official_link')} placeholder="https://youtube.com/@channel" className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-white outline-none transition" />
                                </div>
                                <button type="submit" disabled={updateMutation.isPending} className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition">
                                    {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        </div>

                        {/* Import Tools */}
                        <div className="bg-gray-900 rounded-xl border border-white/5 p-6">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Download className="w-5 h-5 text-gray-400" /> Import Tools
                            </h2>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setIsImportModalOpen(true)}
                                    className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
                                >
                                    <Youtube className="w-5 h-5 text-red-500" /> Auto-Import from Channel
                                </button>
                                <p className="text-xs text-gray-500 text-center">
                                    Automatically fetches videos from the official channel link.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Video Management */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Quick Add */}
                        <div className="bg-gray-900 rounded-xl border border-white/5 p-6">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-gray-400" /> Quick Add Video
                            </h2>
                            <form onSubmit={handleSubmitAdd(handleBulkAdd)} className="flex gap-2">
                                <input
                                    {...registerAdd(`videos.0.url` as const)}
                                    placeholder="Paste YouTube URL here..."
                                    className="flex-1 bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-white outline-none transition"
                                />
                                <select
                                    {...registerAdd(`videos.0.category` as const)}
                                    className="w-32 bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-white outline-none transition"
                                >
                                    <option value="MV">MV</option>
                                    <option value="LIVE">LIVE</option>
                                    <option value="FANCAM">FANCAM</option>
                                    <option value="SHORTS">SHORTS</option>
                                    <option value="INTERVIEW">TALK</option>
                                    <option value="BEHIND">BEHIND</option>
                                    <option value="VLOG">VLOG</option>
                                    <option value="ETC">ETC</option>
                                </select>
                                <button type="submit" disabled={!!addProgress} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 rounded-lg transition">
                                    Add
                                </button>
                            </form>
                        </div>

                        {/* Video List */}
                        <div className="bg-gray-900 rounded-xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-bold flex items-center gap-2">
                                        <ListVideo className="w-5 h-5 text-gray-400" /> Video Library
                                        <span className="text-sm font-normal text-gray-500 ml-2">({videos?.length || 0})</span>
                                    </h2>
                                    {videos?.length > 0 && (
                                        <button
                                            onClick={() => {
                                                if (confirm("WARNING: This will delete ALL videos in this collection. This action cannot be undone. Are you sure?")) {
                                                    deleteAllMutation.mutate();
                                                }
                                            }}
                                            className="text-xs text-red-400 hover:text-red-300 hover:underline flex items-center gap-1"
                                        >
                                            <Trash2 className="w-3 h-3" /> Delete All Videos
                                        </button>
                                    )}
                                </div>

                                {/* Category Filter Tabs */}
                                <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                                    {['ALL', 'MV', 'LIVE', 'FANCAM', 'SHORTS', 'INTERVIEW', 'BEHIND', 'VLOG', 'ETC'].map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setFilterCategory(cat)}
                                            className={clsx(
                                                "px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap",
                                                filterCategory === cat
                                                    ? "bg-white text-black"
                                                    : "bg-black border border-gray-700 text-gray-400 hover:border-white hover:text-white"
                                            )}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="divide-y divide-white/5 max-h-[800px] overflow-y-auto">
                                {videos?.filter((v: any) => filterCategory === 'ALL' || v.category === filterCategory).map((video: any) => (
                                    <div key={video.id} className="p-4 flex gap-4 hover:bg-white/5 transition group">
                                        <div className="w-32 aspect-video bg-black rounded overflow-hidden flex-shrink-0 relative border border-white/10">
                                            <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
                                            <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/80 backdrop-blur rounded text-[10px] font-bold text-white border border-white/10">
                                                {video.category}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0 py-1">
                                            <h3 className="font-bold text-white text-sm truncate">{video.title}</h3>
                                            <p className="text-xs text-gray-500 truncate mt-0.5">{video.channel_name}</p>
                                            <div className="flex items-center gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => setEditingVideo(video)} className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1">
                                                    <Edit className="w-3 h-3" /> Edit
                                                </button>
                                                <a href={`https://youtu.be/${video.youtube_video_id}`} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                                                    <ExternalLink className="w-3 h-3" /> YouTube
                                                </a>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this video?')) {
                                                    deleteVideoMutation.mutate(video.id);
                                                }
                                            }}
                                            className="self-center p-2 text-gray-600 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {videos?.length === 0 && (
                                    <div className="text-center py-20 text-gray-500">
                                        No videos found in this category.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Video Modal */}
            <EditVideoModal
                isOpen={!!editingVideo}
                onClose={() => setEditingVideo(null)}
                video={editingVideo}
                onSave={(data) => updateVideoMutation.mutate(data)}
            />

            {/* Import Modal */}
            {id && (
                <ImportModal
                    isOpen={isImportModalOpen}
                    onClose={() => setIsImportModalOpen(false)}
                    collectionId={id}
                    onSuccess={() => {
                        // Optional: show a toast or just let the modal show success
                    }}
                />
            )}
        </AdminLayout>
    );
};
