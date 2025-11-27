import React from 'react';
import { Play, Trash2, ExternalLink, Edit, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { AdminLayout } from '../components/layout/AdminLayout';

export const StyleGuidePage: React.FC = () => {
    return (
        <AdminLayout>
            <div className="p-10 space-y-20 font-sans selection:bg-white/20">
                <div className="max-w-6xl mx-auto space-y-20">

                    {/* Header */}
                    <div className="border-b border-white/10 pb-8">
                        <h1 className="text-5xl font-bold tracking-tighter mb-4">CURA Design System</h1>
                        <p className="text-gray-400 text-lg">A collection of UI components and styles used across the platform.</p>
                    </div>

                    {/* Typography */}
                    <section className="space-y-8">
                        <h2 className="text-2xl font-bold text-blue-400 uppercase tracking-widest border-b border-blue-900/30 pb-2">Typography</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs text-gray-500 mb-2">Display / H1</p>
                                    <h1 className="text-5xl font-bold tracking-tighter">The Quick Brown Fox</h1>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-2">Heading / H2</p>
                                    <h2 className="text-3xl font-bold">Jumps Over The Lazy Dog</h2>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-2">Heading / H3</p>
                                    <h3 className="text-xl font-bold">Pack My Box With Five Dozen Liquor Jugs</h3>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs text-gray-500 mb-2">Body / Regular</p>
                                    <p className="text-gray-300 leading-relaxed">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-2">Body / Small</p>
                                    <p className="text-sm text-gray-400">
                                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-2">Caption / Mono</p>
                                    <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                                        2025-11-27 • OFFICIAL MV • 4K
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Colors */}
                    <section className="space-y-8">
                        <h2 className="text-2xl font-bold text-blue-400 uppercase tracking-widest border-b border-blue-900/30 pb-2">Color Palette</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            <ColorSwatch name="Black" hex="#000000" className="bg-black border border-white/10" />
                            <ColorSwatch name="Gray 900" hex="#111827" className="bg-gray-900" />
                            <ColorSwatch name="Gray 800" hex="#1f2937" className="bg-gray-800" />
                            <ColorSwatch name="Gray 500" hex="#6b7280" className="bg-gray-500" />
                            <ColorSwatch name="White" hex="#ffffff" className="bg-white text-black" />
                            <ColorSwatch name="Blue 500" hex="#3b82f6" className="bg-blue-500" />
                            <ColorSwatch name="Red 500" hex="#ef4444" className="bg-red-500" />
                        </div>
                    </section>

                    {/* Buttons */}
                    <section className="space-y-8">
                        <h2 className="text-2xl font-bold text-blue-400 uppercase tracking-widest border-b border-blue-900/30 pb-2">Buttons</h2>
                        <div className="flex flex-wrap gap-6 items-center">
                            <button className="bg-white text-black font-bold px-6 py-3 rounded-lg hover:bg-gray-200 transition">
                                Primary Button
                            </button>
                            <button className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-500 transition">
                                Accent Button
                            </button>
                            <button className="bg-gray-800 text-white font-bold px-6 py-3 rounded-lg hover:bg-gray-700 transition">
                                Secondary Button
                            </button>
                            <button className="bg-red-900/20 text-red-400 border border-red-900/50 font-bold px-6 py-3 rounded-lg hover:bg-red-900/40 transition">
                                Danger Button
                            </button>
                            <button className="p-3 rounded-full hover:bg-white/10 transition text-white">
                                <Settings className="w-6 h-6" />
                            </button>
                        </div>
                    </section>

                    {/* Form Elements */}
                    <section className="space-y-8">
                        <h2 className="text-2xl font-bold text-blue-400 uppercase tracking-widest border-b border-blue-900/30 pb-2">Form Elements</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Input Field</label>
                                <input type="text" placeholder="Enter text here..." className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-white outline-none transition" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Dropdown</label>
                                <select className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-white outline-none transition">
                                    <option>Option 1</option>
                                    <option>Option 2</option>
                                    <option>Option 3</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Text Area</label>
                                <textarea rows={3} placeholder="Enter long text..." className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-white outline-none transition" />
                            </div>
                        </div>
                    </section>

                    {/* Components */}
                    <section className="space-y-8">
                        <h2 className="text-2xl font-bold text-blue-400 uppercase tracking-widest border-b border-blue-900/30 pb-2">Components</h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Video Card */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-400">Video Thread Card</h3>
                                <div className="w-full max-w-md">
                                    <div className="group relative flex flex-col bg-transparent">
                                        <div className="relative w-full aspect-video bg-gray-900 overflow-hidden rounded-sm shadow-2xl group-hover:shadow-white/5 transition-all">
                                            <img src="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" alt="Demo" className="w-full h-full object-cover opacity-90" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                                                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <h2 className="font-bold text-white text-xl leading-tight">Never Gonna Give You Up</h2>
                                            <p className="text-gray-500 text-xs font-mono mt-2 uppercase tracking-wider">Rick Astley • 2009. 10. 25.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shorts Card */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-400">Shorts Card</h3>
                                <div className="w-48">
                                    <div className="group relative block aspect-[9/16] bg-gray-900 rounded-xl overflow-hidden border border-white/5 hover:border-white/20 transition-all hover:scale-[1.02]">
                                        <img src="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" alt="Shorts" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                        <div className="absolute bottom-0 left-0 w-full p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                                    <Play className="w-2 h-2 text-black fill-current ml-0.5" />
                                                </div>
                                                <span className="text-[10px] font-bold text-white">Watch Short</span>
                                            </div>
                                            <h3 className="text-white font-bold leading-tight line-clamp-2 text-sm">Rick Roll Short Version</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Admin List Item */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-400">Admin List Item</h3>
                            <div className="flex gap-4 bg-gray-900/30 p-4 rounded-lg border border-white/5 hover:border-white/20 transition group max-w-2xl">
                                <div className="w-40 aspect-video bg-gray-800 rounded overflow-hidden flex-shrink-0 relative">
                                    <img src="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" alt="Thumbnail" className="w-full h-full object-cover" />
                                    <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 backdrop-blur rounded text-[10px] font-bold text-white border border-white/10">
                                        MV
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-white truncate">Never Gonna Give You Up (Official Music Video)</h3>
                                    <p className="text-sm text-gray-500 truncate">Rick Astley</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-xs text-blue-400 flex items-center gap-1 cursor-pointer hover:underline">
                                            <ExternalLink className="w-3 h-3" /> View on YouTube
                                        </span>
                                        <button className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded transition flex items-center gap-1">
                                            <Edit className="w-3 h-3" /> Edit Info
                                        </button>
                                    </div>
                                </div>
                                <button className="p-2 text-gray-600 hover:text-red-500 transition">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Badges & Tags */}
                    <section className="space-y-8">
                        <h2 className="text-2xl font-bold text-blue-400 uppercase tracking-widest border-b border-blue-900/30 pb-2">Badges & Tags</h2>
                        <div className="flex flex-wrap gap-4">
                            <span className="px-2 py-1 rounded border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-wider">MV</span>
                            <span className="px-2 py-1 rounded border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-wider">LIVE</span>
                            <span className="px-2 py-1 rounded border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-wider">FANCAM</span>
                            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white text-black">Active Tab</span>
                            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-gray-800 text-gray-400">Inactive Tab</span>
                        </div>
                    </section>

                </div>
            </div>
        </AdminLayout>
    );
};

const ColorSwatch = ({ name, hex, className }: { name: string; hex: string; className: string }) => (
    <div className="space-y-2">
        <div className={clsx("w-full h-24 rounded-lg shadow-lg", className)} />
        <div>
            <p className="font-bold text-sm">{name}</p>
            <p className="text-xs text-gray-500 font-mono">{hex}</p>
        </div>
    </div>
);
