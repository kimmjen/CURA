import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';

export const AdminDashboard: React.FC = () => {
    const { data: collections, isLoading } = useQuery({
        queryKey: ['collections'],
        queryFn: async () => {
            const response = await fetch('http://localhost:8000/api/collections/');
            if (!response.ok) throw new Error('Failed to fetch collections');
            return response.json();
        }
    });

    return (
        <AdminLayout>
            <div className="p-10">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold">Collections</h1>
                        <p className="text-gray-400 mt-1">Manage your curated video collections</p>
                    </div>
                    <Link to="/admin/create" className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        <Plus className="w-5 h-5" /> Create New
                    </Link>
                </div>

                {isLoading ? (
                    <div className="text-gray-500">Loading collections...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {collections?.map((collection: any) => (
                            <Link key={collection.id} to={`/admin/collections/${collection.id}`} className="group block bg-gray-900 rounded-xl overflow-hidden border border-white/5 hover:border-white/20 transition-all hover:shadow-2xl">
                                <div className="aspect-video relative">
                                    <img src={collection.cover_image_url} alt={collection.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h2 className="text-lg font-bold text-white truncate">{collection.title}</h2>
                                        <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">{collection.type}</span>
                                    </div>
                                </div>
                                <div className="p-4 flex justify-between items-center border-t border-white/5 bg-gray-900">
                                    <span className="text-xs text-gray-500">Last updated 2h ago</span>
                                    <span className="text-xs font-bold text-white bg-white/10 px-2 py-1 rounded group-hover:bg-white group-hover:text-black transition-colors">
                                        Manage
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};
