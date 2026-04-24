import { forwardRef } from 'react';
import type { ImgHTMLAttributes } from 'react';
import { cn } from '@/utils/utils';

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    src?: string;
    alt: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    fallback?: string;
}

const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
    ({ src, alt, size = 'md', fallback, className, ...props }, ref) => {
        const sizeStyles = {
            sm: 'w-8 h-8 text-xs',
            md: 'w-10 h-10 text-sm',
            lg: 'w-12 h-12 text-base',
            xl: 'w-16 h-16 text-lg',
        };

        const initials = fallback || (alt ? alt.charAt(0).toUpperCase() : '?');

        return (
            <div
                className={cn(
                    'shrink-0 rounded-full overflow-hidden bg-[var(--color-bg-tertiary)]',
                    'flex items-center justify-center',
                    'text-[var(--color-text-secondary)] font-semibold',
                    sizeStyles[size],
                    className
                )}
            >
                {src ? (
                    <img
                        ref={ref}
                        src={src}
                        alt={alt}
                        className="w-full h-full object-cover"
                        {...props}
                    />
                ) : (
                    <span>{initials}</span>
                )}
            </div>
        );
    }
);

Avatar.displayName = 'Avatar';

export default Avatar;
