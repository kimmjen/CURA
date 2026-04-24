import Button from '@/components/ui/Button';
import { cn } from '@/utils/utils';

export interface ErrorStateProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    className?: string;
}

export default function ErrorState({
    title = 'Something went wrong',
    message,
    onRetry,
    className,
}: ErrorStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center p-12 text-center',
                className
            )}
        >
            {/* Error icon */}
            <div className="mb-4 text-[var(--color-error)]">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </div>

            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                {title}
            </h3>
            <p className="text-[var(--color-text-secondary)] mb-6 max-w-md">
                {message}
            </p>

            {onRetry && (
                <Button onClick={onRetry}>
                    Try Again
                </Button>
            )}
        </div>
    );
}
