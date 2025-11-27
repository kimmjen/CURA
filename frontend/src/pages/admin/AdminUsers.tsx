import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Search, MoreVertical, User, Shield } from 'lucide-react';

export const AdminUsers: React.FC = () => {
    // Mock Data
    const users = [
        { id: 1, name: 'Kim Minjeong', email: 'winter@aespa.com', role: 'ADMIN', status: 'Active', lastLogin: '2023-11-27 10:30' },
        { id: 2, name: 'Yu Jimin', email: 'karina@aespa.com', role: 'EDITOR', status: 'Active', lastLogin: '2023-11-26 15:45' },
        { id: 3, name: 'Ning Yizhuo', email: 'ningning@aespa.com', role: 'USER', status: 'Inactive', lastLogin: '2023-11-20 09:12' },
        { id: 4, name: 'Uchinaga Aeri', email: 'giselle@aespa.com', role: 'USER', status: 'Active', lastLogin: '2023-11-25 18:20' },
    ];

    return (
        <AdminLayout>
            <div className="p-10 space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Users</h1>
                        <p className="text-gray-400 mt-1">Manage user access and roles</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="bg-gray-900 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-white outline-none w-64 transition"
                        />
                    </div>
                </div>

                <div className="bg-gray-900 rounded-xl border border-white/5 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Last Login</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-white/5 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-300' :
                                                user.role === 'EDITOR' ? 'bg-blue-500/20 text-blue-300' :
                                                    'bg-gray-700 text-gray-300'
                                            }`}>
                                            {user.role === 'ADMIN' && <Shield className="w-3 h-3" />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
                                        <span className="text-sm text-gray-300">{user.status}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {user.lastLogin}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-500 hover:text-white transition">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};
