import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { Link, useNavigate } from 'react-router-dom';
import { BarChart3, Video, FolderOpen, Plus, TrendingUp, Clock } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, Button } from '@/components/ui';
import * as api from '@/api';
import { API_BASE_URL } from '@/api';

export const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    // Fetch all collections for statistics
    const { data: collections = [] } = useQuery({
        queryKey: ['collections'],
        queryFn: api.getCollections
    });

    // Fetch stats from new API
    const { data: stats } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const response = await fetch(`${API_BASE_URL}/api/stats`);
            if (!response.ok) throw new Error('Failed to fetch stats');
            return response.json();
        }
    });

    // Calculate statistics
    const totalCollections = stats?.total_collections || collections.length;
    const totalVideos = stats?.total_videos || collections.reduce((sum: number, c: any) => sum + (c.video_count || 0), 0);

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
                    <Card className="p-6 bg-gray-900">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-500/10 p-3 rounded-lg">
                                <FolderOpen className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Total Collections</p>
                                <p className="text-3xl font-bold">{totalCollections}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Total Videos */}
                    <Card className="p-6 bg-gray-900">
                        <div className="flex items-center gap-4">
                            <div className="bg-purple-500/10 p-3 rounded-lg">
                                <Video className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Total Videos</p>
                                <p className="text-3xl font-bold">{totalVideos.toLocaleString()}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Average Videos */}
                    <Card className="p-6 bg-gray-900">
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
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card className="p-6 bg-gray-900">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-gray-400" />
                        Quick Actions
                    </h2>
                    <Button
                        onClick={() => navigate('/admin/create')}
                        className="gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Collection
                    </Button>
                </Card>

                {/* Recent Collections */}
                <Card className="p-6 bg-gray-900">
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
                </Card>

                {/* Category Distribution */}
                {stats?.category_distribution && Object.keys(stats.category_distribution).length > 0 && (
                    <Card className="p-6 bg-gray-900">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-gray-400" />
                            Category Distribution
                        </h2>
                        <div className="space-y-3">
                            {Object.entries(stats.category_distribution)
                                .sort(([, a], [, b]) => (b as number) - (a as number))
                                .map(([category, count]) => {
                                    const maxCount = Math.max(...Object.values(stats.category_distribution) as number[]);
                                    const percentage = ((count as number) / maxCount) * 100;

                                    return (
                                        <div key={category}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-mono font-bold">{category}</span>
                                                <span className="text-gray-400">{String(count)} videos</span>
                                            </div>
                                            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="bg-blue-500 h-full transition-all duration-300"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </Card>
                )}

                {/* Recent Videos */}
                {stats?.recent_videos && stats.recent_videos.length > 0 && (
                    <Card className="p-6 bg-gray-900">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-gray-400" />
                            Recent Videos
                        </h2>
                        <div className="space-y-2">
                            {stats.recent_videos.slice(0, 5).map((video: any) => (
                                <Link
                                    key={video.id}
                                    to={`/admin/collections/${video.collection_id}`}
                                    className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition group"
                                >
                                    <img
                                        src={video.thumbnail_url}
                                        alt={video.title}
                                        className="w-24 aspect-video object-cover rounded border border-white/10"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm truncate group-hover:text-blue-400 transition">
                                            {video.title}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs px-2 py-0.5 bg-gray-800 rounded text-gray-400">
                                                {video.category}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {video.published_at ? new Date(video.published_at).toLocaleDateString() : 'Unknown'}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </Card>
                )}
            </div>
        </AdminLayout >
    );
};
