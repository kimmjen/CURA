import Card from '@/components/ui/Card';
import { cn } from '@/utils/utils';

export interface CollectionCardSkeletonProps {
    className?: string;
}

export default function CollectionCardSkeleton({ className }: CollectionCardSkeletonProps) {
    return (
        <Card
            variant="default"
            padding="none"
            className={cn('overflow-hidden animate-pulse', className)}
        >
            {/* Cover Image skeleton - Square */}
            <div className="relative aspect-square bg-[var(--color-bg-tertiary)]" />

            {/* Content skeleton */}
            <div className="p-4 space-y-3">
                {/* Title skeleton */}
                <div className="h-5 bg-[var(--color-bg-tertiary)] rounded w-3/4" />

                {/* Description skeleton - 2 lines */}
                <div className="space-y-2">
                    <div className="h-4 bg-[var(--color-bg-tertiary)] rounded w-full" />
                    <div className="h-4 bg-[var(--color-bg-tertiary)] rounded w-2/3" />
                </div>

                {/* Stats skeleton */}
                <div className="flex items-center gap-2">
                    <div className="h-3 bg-[var(--color-bg-tertiary)] rounded w-20" />
                    <div className="h-3 w-1 bg-[var(--color-bg-tertiary)] rounded-full" />
                    <div className="h-3 bg-[var(--color-bg-tertiary)] rounded w-16" />
                </div>
            </div>
        </Card>
    );
}
