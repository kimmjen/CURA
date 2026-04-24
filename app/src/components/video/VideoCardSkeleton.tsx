import Card from '@/components/ui/Card';
import { cn } from '@/utils/utils';

export interface VideoCardSkeletonProps {
    className?: string;
}

export default function VideoCardSkeleton({ className }: VideoCardSkeletonProps) {
    return (
        <Card
            variant="default"
            padding="none"
            className={cn('overflow-hidden animate-pulse', className)}
        >
            {/* Thumbnail skeleton - 16:9 ratio */}
            <div className="relative aspect-video bg-[var(--color-bg-tertiary)]">
                {/* Duration badge skeleton */}
                <div className="absolute bottom-2 right-2 w-12 h-5 bg-[var(--color-bg-secondary)] rounded" />
            </div>

            {/* Content skeleton */}
            <div className="p-3 space-y-2">
                {/* Category badge skeleton */}
                <div className="w-16 h-5 bg-[var(--color-bg-tertiary)] rounded" />

                {/* Title skeleton - 2 lines */}
                <div className="space-y-2">
                    <div className="h-4 bg-[var(--color-bg-tertiary)] rounded w-full" />
                    <div className="h-4 bg-[var(--color-bg-tertiary)] rounded w-3/4" />
                </div>

                {/* Channel & metadata skeleton */}
                <div className="flex items-center gap-2">
                    <div className="h-3 bg-[var(--color-bg-tertiary)] rounded w-24" />
                    <div className="h-3 w-1 bg-[var(--color-bg-tertiary)] rounded-full" />
                    <div className="h-3 bg-[var(--color-bg-tertiary)] rounded w-16" />
                </div>
            </div>
        </Card>
    );
}
