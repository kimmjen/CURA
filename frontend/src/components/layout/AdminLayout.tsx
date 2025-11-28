import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Disc, LogOut, Settings, Users, FolderOpen } from 'lucide-react';
import { clsx } from 'clsx';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-black text-white flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 flex flex-col fixed h-full bg-black z-50">
                <div className="p-6 border-b border-white/10">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Disc className="w-5 h-5 text-black" />
                        </div>
                        <span className="text-xl font-bold tracking-tighter">CURA ADMIN</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <AdminNavLink to="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" active={location.pathname === '/admin'} />
                    <AdminNavLink to="/admin/collections" icon={<FolderOpen size={20} />} label="Collections" active={location.pathname.startsWith('/admin/collections')} />
                    <AdminNavLink to="/admin/users" icon={<Users size={20} />} label="Users" active={location.pathname === '/admin/users'} />
                    <AdminNavLink to="/admin/settings" icon={<Settings size={20} />} label="Settings" active={location.pathname === '/admin/settings'} />
                    <AdminNavLink to="/style-guide" icon={<Disc size={20} />} label="Style Guide" active={location.pathname === '/style-guide'} />
                </nav>

                <div className="p-4 border-t border-white/10">
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <LogOut size={20} />
                        <span className="font-medium">Exit Admin</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 min-h-screen bg-gray-950">
                {children}
            </main>
        </div>
    );
};

const AdminNavLink = ({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active: boolean }) => (
    <Link
        to={to}
        className={clsx(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
            active ? "bg-white text-black font-bold" : "text-gray-400 hover:text-white hover:bg-white/5"
        )}
    >
        {icon}
        <span className="font-medium">{label}</span>
    </Link>
);
