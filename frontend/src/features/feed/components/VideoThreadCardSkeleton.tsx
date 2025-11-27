

export const VideoThreadCardSkeleton = () => (
    <div className="w-full max-w-2xl mx-auto border-b border-gray-800 py-6 px-4 md:px-0 animate-pulse">
        <div className="flex gap-4">
            <div className="flex flex-col items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-gray-800 shrink-0" />
                <div className="w-0.5 h-full bg-gray-800 rounded-full my-2 grow" />
            </div>
            <div className="flex-1 space-y-3">
                <div className="flex justify-between">
                    <div className="h-4 w-24 bg-gray-800 rounded" />
                    <div className="h-4 w-4 bg-gray-800 rounded" />
                </div>
                <div className="h-4 w-full bg-gray-800 rounded" />
                <div className="h-4 w-2/3 bg-gray-800 rounded" />
                <div className="w-full aspect-video rounded-xl bg-gray-800" />
            </div>
        </div>
    </div>
);
