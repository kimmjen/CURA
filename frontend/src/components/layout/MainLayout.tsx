import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Disc, ShieldCheck, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { useQuery } from '@tanstack/react-query';

interface MainLayoutProps {
    children: React.ReactNode;
}

import * as api from '../../api';

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Fetch Collections
    const { data: collections } = useQuery({
        queryKey: ['collections'],
        queryFn: api.getCollections,
    });

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20 overflow-x-hidden">
            {/* --- Top Navigation Bar --- */}
            <header
                className={clsx(
                    "fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b",
                    isScrolled || isMobileMenuOpen
                        ? "bg-black/80 backdrop-blur-md border-white/10 py-4"
                        : "bg-transparent border-transparent py-6"
                )}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Disc className="w-5 h-5 text-black animate-spin-slow" />
                        </div>
                        <span className="text-xl font-bold tracking-tighter">CURA</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <NavLink to="/" label="Home" active={location.pathname === '/'} />

                        {/* Collections Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                                Collections
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl p-2 w-56 shadow-2xl">
                                    {collections?.map((collection: any) => (
                                        <Link
                                            key={collection.id}
                                            to={`/collection/${collection.id}`}
                                            className="block px-4 py-3 rounded-lg hover:bg-white/10 text-sm text-gray-300 hover:text-white transition-colors"
                                        >
                                            {collection.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="w-[1px] h-4 bg-white/20" />
                        <Link
                            to="/admin"
                            className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                        >
                            <ShieldCheck className="w-4 h-4" />
                            Admin
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Navigation Dropdown */}
                <div
                    className={clsx(
                        "md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 overflow-hidden transition-all duration-300",
                        isMobileMenuOpen ? "max-h-[80vh] opacity-100 overflow-y-auto" : "max-h-0 opacity-0"
                    )}
                >
                    <nav className="flex flex-col p-6 gap-6">
                        <MobileNavLink to="/" label="Home" active={location.pathname === '/'} />

                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Collections</p>
                            <div className="space-y-2 pl-4 border-l border-white/10">
                                {collections?.map((collection: any) => (
                                    <MobileNavLink
                                        key={collection.id}
                                        to={`/collection/${collection.id}`}
                                        label={collection.title}
                                        active={location.pathname === `/collection/${collection.id}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10">
                            <MobileNavLink to="/admin" label="Admin Dashboard" active={location.pathname.startsWith('/admin')} />
                        </div>
                    </nav>
                </div>
            </header>

            {/* --- Main Content --- */}
            <main className="relative">
                {children}
            </main>

            {/* --- Footer --- */}
            <footer className="bg-black border-t border-white/10 py-12 mt-20">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 text-sm">
                    <p>&copy; 2025 CURA. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition">Privacy</a>
                        <a href="#" className="hover:text-white transition">Terms</a>
                        <a href="#" className="hover:text-white transition">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Helper Components
const NavLink = ({ to, label, active }: { to: string; label: string; active: boolean }) => (
    <Link
        to={to}
        className={clsx(
            "text-sm font-medium transition-colors relative group",
            active ? "text-white" : "text-gray-400 hover:text-white"
        )}
    >
        {label}
        <span className={clsx(
            "absolute -bottom-1 left-0 w-full h-[1px] bg-white transform origin-left transition-transform duration-300",
            active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        )} />
    </Link>
);

const MobileNavLink = ({ to, label, active }: { to: string; label: string; active: boolean }) => (
    <Link
        to={to}
        className={clsx(
            "block text-lg font-medium transition-colors",
            active ? "text-white" : "text-gray-400 hover:text-white"
        )}
    >
        {label}
    </Link>
);
