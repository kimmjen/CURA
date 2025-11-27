import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { ImageUpload } from '@/components/common/ImageUpload';

interface EditVideoForm {
    title: string;
    channel_name: string;
    thumbnail_url: string;
    comment: string;
    category: 'MV' | 'LIVE' | 'FANCAM' | 'INTERVIEW' | 'SHORTS' | 'BEHIND' | 'VLOG' | 'ETC';
}

interface EditVideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    video: any;
    onSave: (data: any) => void;
}

export const EditVideoModal: React.FC<EditVideoModalProps> = ({ isOpen, onClose, video, onSave }) => {
    const { register, handleSubmit, setValue, watch } = useForm<EditVideoForm>();

    useEffect(() => {
        if (video) {
            setValue('title', video.title);
            setValue('channel_name', video.channel_name);
            setValue('thumbnail_url', video.thumbnail_url);
            setValue('comment', video.comment || '');
            setValue('category', video.category || 'ETC');
        }
    }, [video, setValue]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-gray-900 border border-white/10 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">Edit Video</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit((data) => onSave({ ...video, ...data }))} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                        <input {...register('title', { required: true })} className="w-full bg-black border border-gray-700 rounded p-2 focus:border-white outline-none transition text-white" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Channel Name</label>
                            <input {...register('channel_name', { required: true })} className="w-full bg-black border border-gray-700 rounded p-2 focus:border-white outline-none transition text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                            <select {...register('category')} className="w-full bg-black border border-gray-700 rounded p-2 focus:border-white outline-none transition text-white">
                                <option value="MV">MV</option>
                                <option value="LIVE">LIVE</option>
                                <option value="FANCAM">FANCAM</option>
                                <option value="SHORTS">SHORTS</option>
                                <option value="INTERVIEW">TALK</option>
                                <option value="BEHIND">BEHIND</option>
                                <option value="VLOG">VLOG</option>
                                <option value="ETC">ETC</option>
                            </select>
                        </div>
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Thumbnail</label>
                        <div className="space-y-2">
                            <ImageUpload
                                value={watch('thumbnail_url')}
                                onChange={(url) => setValue('thumbnail_url', url, { shouldDirty: true })}
                                placeholder="Upload Thumbnail"
                            />
                            <input
                                {...register('thumbnail_url', { required: true })}
                                value={watch('thumbnail_url') || ''}
                                className="w-full bg-black border border-gray-700 rounded p-2 focus:border-white outline-none transition text-white text-sm"
                                placeholder="Or enter URL..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Comment (Optional)</label>
                        <textarea {...register('comment')} className="w-full bg-black border border-gray-700 rounded p-2 focus:border-white outline-none transition text-white" rows={3} placeholder="Add a curator comment..." />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded text-gray-300 hover:bg-white/10 transition">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-white text-black rounded font-bold hover:bg-gray-200 transition">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
