import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Save, Globe, Lock, Bell } from 'lucide-react';

export const AdminSettings: React.FC = () => {
    return (
        <AdminLayout>
            <div className="p-10 space-y-8 max-w-4xl">
                <div>
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-gray-400 mt-1">Configure system preferences</p>
                </div>

                <div className="space-y-6">
                    {/* General Settings */}
                    <section className="bg-gray-900 rounded-xl border border-white/5 p-6">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-blue-400" /> General Settings
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Site Name</label>
                                <input type="text" defaultValue="CURA" className="w-full bg-black border border-gray-700 rounded p-3 focus:border-white outline-none transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Site Description</label>
                                <textarea rows={3} defaultValue="Premium K-POP Video Curation Platform" className="w-full bg-black border border-gray-700 rounded p-3 focus:border-white outline-none transition" />
                            </div>
                        </div>
                    </section>

                    {/* Security Settings */}
                    <section className="bg-gray-900 rounded-xl border border-white/5 p-6">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-red-400" /> Security & Access
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-black/50 rounded-lg border border-white/5">
                                <div>
                                    <div className="font-bold">Maintenance Mode</div>
                                    <div className="text-sm text-gray-500">Disable public access to the site</div>
                                </div>
                                <div className="w-12 h-6 bg-gray-700 rounded-full relative cursor-pointer transition hover:bg-gray-600">
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-black/50 rounded-lg border border-white/5">
                                <div>
                                    <div className="font-bold">Allow User Registration</div>
                                    <div className="text-sm text-gray-500">New users can sign up</div>
                                </div>
                                <div className="w-12 h-6 bg-green-600 rounded-full relative cursor-pointer transition hover:bg-green-500">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Notifications */}
                    <section className="bg-gray-900 rounded-xl border border-white/5 p-6">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-yellow-400" /> Notifications
                        </h2>
                        <div className="space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-700 bg-black text-blue-600 focus:ring-offset-0 focus:ring-0" />
                                <span className="text-gray-300 group-hover:text-white transition">Email me when a new user signs up</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" className="w-5 h-5 rounded border-gray-700 bg-black text-blue-600 focus:ring-offset-0 focus:ring-0" />
                                <span className="text-gray-300 group-hover:text-white transition">Email me on system errors</span>
                            </label>
                        </div>
                    </section>

                    <div className="flex justify-end pt-4">
                        <button className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition flex items-center gap-2">
                            <Save className="w-4 h-4" /> Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};
