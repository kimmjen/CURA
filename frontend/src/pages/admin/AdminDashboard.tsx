import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { BarChart3, Video, FolderOpen, Plus, TrendingUp } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import * as api from '@/api';

export const AdminDashboard: React.FC = () => {
    // Fetch all collections for statistics
    const { data: collections = [] } = useQuery({
        queryKey: ['collections'],
        queryFn: api.getCollections
    });

    // Calculate statistics
    const totalCollections = collections.length;
    const totalVideos = collections.reduce((sum: number, c: any) => sum + (c.video_count || 0), 0);

    // Get recent collections (last 4)
    const recentCollections = collections.slice(0, 4);

    return (
        <AdminLayout>
            <div className="p-10 space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                    <p className="text-gray-400">Overview of your CURA collections</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Collections */}
                    <div className="bg-gray-900 rounded-xl border border-white/5 p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-500/10 p-3 rounded-lg">
                                <FolderOpen className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Total Collections</p>
                                <p className="text-3xl font-bold">{totalCollections}</p>
                            </div>
                        </div>
                    </div>

                    {/* Total Videos */}
                    <div className="bg-gray-900 rounded-xl border border-white/5 p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-purple-500/10 p-3 rounded-lg">
                                <Video className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Total Videos</p>
                                <p className="text-3xl font-bold">{totalVideos.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Average Videos */}
                    <div className="bg-gray-900 rounded-xl border border-white/5 p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-green-500/10 p-3 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Avg. per Collection</p>
                                <p className="text-3xl font-bold">
                                    {totalCollections > 0 ? Math.round(totalVideos / totalCollections) : 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-900 rounded-xl border border-white/5 p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-gray-400" />
                        Quick Actions
                    </h2>
                    <Link
                        to="/admin/create"
                        className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Collection
                    </Link>
                </div>

                {/* Recent Collections */}
                <div className="bg-gray-900 rounded-xl border border-white/5 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Recent Collections</h2>
                        <Link to="/admin/collections" className="text-sm text-blue-400 hover:text-blue-300">
                            View All →
                        </Link>
                    </div>

                    {recentCollections.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No collections yet</p>
                            <Link to="/admin/create" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">
                                Create your first collection
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {recentCollections.map((collection: any) => (
                                <Link
                                    key={collection.id}
                                    to={`/admin/collections/${collection.id}`}
                                    className="group block"
                                >
                                    <div className="bg-black rounded-lg border border-white/5 overflow-hidden hover:border-white/20 transition">
                                        {collection.cover_image_url ? (
                                            <img
                                                src={collection.cover_image_url}
                                                alt={collection.title}
                                                className="w-full h-32 object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-32 bg-gray-800 flex items-center justify-center">
                                                <FolderOpen className="w-8 h-8 text-gray-600" />
                                            </div>
                                        )}
                                        <div className="p-4">
                                            <h3 className="font-bold truncate group-hover:text-blue-400 transition">
                                                {collection.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {collection.video_count || 0} videos
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};
