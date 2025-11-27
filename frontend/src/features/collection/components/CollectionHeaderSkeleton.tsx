

export const CollectionHeaderSkeleton = () => (
    <div className="relative h-[500px] w-full bg-gray-900 animate-pulse">
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
            <div className="mx-auto max-w-5xl flex items-end gap-6">
                <div className="h-32 w-32 rounded-full bg-gray-800" />
                <div className="flex-1 space-y-4">
                    <div className="h-6 w-32 bg-gray-800 rounded" />
                    <div className="h-16 w-3/4 bg-gray-800 rounded" />
                    <div className="h-4 w-1/2 bg-gray-800 rounded" />
                </div>
            </div>
        </div>
    </div>
);
