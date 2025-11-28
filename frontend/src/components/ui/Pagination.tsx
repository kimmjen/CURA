import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    className
}) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = [];
        const showPages = 5; // Show 5 page numbers at a time

        if (totalPages <= showPages) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            // Adjust if near the start
            if (currentPage <= 3) {
                start = 2;
                end = 4;
            }

            // Adjust if near the end
            if (currentPage >= totalPages - 2) {
                start = totalPages - 3;
                end = totalPages - 1;
            }

            // Add ellipsis if needed
            if (start > 2) {
                pages.push('ellipsis');
            }

            // Add middle pages
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // Add ellipsis if needed
            if (end < totalPages - 1) {
                pages.push('ellipsis');
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className={clsx('flex items-center justify-between gap-4', className)}>
            {/* Page Info */}
            <div className="text-sm text-gray-500">
                Page <span className="font-bold text-white">{currentPage}</span> of{' '}
                <span className="font-bold text-white">{totalPages}</span>
            </div>

            {/* Page Numbers */}
            <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={clsx(
                        'p-2 rounded-lg transition-all',
                        'border border-gray-800',
                        'disabled:opacity-30 disabled:cursor-not-allowed',
                        'hover:bg-white/10 hover:border-white/20',
                        'focus:outline-none focus:ring-2 focus:ring-white/20'
                    )}
                    aria-label="Previous page"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((page, index) => {
                    if (page === 'ellipsis') {
                        return (
                            <span key={`ellipsis-${index}`} className="px-2 text-gray-600">
                                ...
                            </span>
                        );
                    }

                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={clsx(
                                'min-w-[40px] h-10 px-3 rounded-lg font-bold text-sm transition-all',
                                'border focus:outline-none focus:ring-2 focus:ring-white/20',
                                currentPage === page
                                    ? 'bg-white text-black border-white'
                                    : 'bg-transparent text-gray-400 border-gray-800 hover:bg-white/10 hover:border-white/20 hover:text-white'
                            )}
                        >
                            {page}
                        </button>
                    );
                })}

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={clsx(
                        'p-2 rounded-lg transition-all',
                        'border border-gray-800',
                        'disabled:opacity-30 disabled:cursor-not-allowed',
                        'hover:bg-white/10 hover:border-white/20',
                        'focus:outline-none focus:ring-2 focus:ring-white/20'
                    )}
                    aria-label="Next page"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
