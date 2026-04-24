import { useRef, useState, useEffect, type ReactNode } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/utils/utils';
import Button from './Button';

export interface VideoSectionProps {
    title: string;
    onViewAll?: () => void;
    children: ReactNode;
    className?: string;
}

export default function VideoSection({
    title,
    onViewAll,
    children,
    className,
}: VideoSectionProps) {
    const { t } = useLanguage();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    useEffect(() => {
        checkScroll();
        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.addEventListener('scroll', checkScroll);
            window.addEventListener('resize', checkScroll);
        }
        return () => {
            if (scrollElement) {
                scrollElement.removeEventListener('scroll', checkScroll);
            }
            window.removeEventListener('resize', checkScroll);
        };
    }, [children]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 400;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <section className={cn('mb-8 overflow-hidden', className)}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-0">
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {title}
                </h2>
                {onViewAll && (
                    <Button variant="ghost" size="sm" onClick={onViewAll}>
                        {t('common.view_all')}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M9 18l6-6-6-6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </Button>
                )}
            </div>

            {/* Scrollable Content */}
            <div className="relative">
                {/* Left Arrow */}
                {canScrollLeft && (
                    <button
                        onClick={() => scroll('left')}
                        className={cn(
                            'absolute left-2 top-1/2 -translate-y-1/2 z-10',
                            'w-10 h-10 rounded-full bg-black/50 text-white',
                            'flex items-center justify-center',
                            'hover:bg-black/70 transition-all'
                        )}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M15 18l-6-6 6-6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                )}

                {/* Scroll Container */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-scroll scrollbar-hide pr-6 scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {children}
                </div>

                {/* Right Arrow */}
                {canScrollRight && (
                    <button
                        onClick={() => scroll('right')}
                        className={cn(
                            'absolute right-2 top-1/2 -translate-y-1/2 z-10',
                            'w-10 h-10 rounded-full bg-black/50 text-white',
                            'flex items-center justify-center',
                            'hover:bg-black/70 transition-all'
                        )}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M9 18l6-6-6-6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                )}
            </div>
        </section>
    );
}
