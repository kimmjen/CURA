import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/config/supabase';
import { cn } from '@/utils/utils';
import { LoadingSpinner } from '@/components/common';

export interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    bucket?: string;
    folder?: string;
    accept?: string;
    maxSizeMB?: number;
    shape?: 'square' | 'circle' | 'cover';
    placeholder?: string;
    className?: string;
}

export default function ImageUpload({
    value,
    onChange,
    bucket = 'images',
    folder = 'collections',
    accept = 'image/*',
    maxSizeMB = 5,
    shape = 'square',
    placeholder = '이미지를 드래그하거나 클릭하여 업로드',
    className,
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('이미지 파일만 업로드할 수 있습니다.');
            return;
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`파일 크기는 ${maxSizeMB}MB 이하여야 합니다.`);
            return;
        }

        setError(null);
        setIsUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

            const { data, error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(data.path);

            onChange(publicUrl);
        } catch (err: any) {
            console.error('Upload failed:', err);
            setError(err.message || '업로드에 실패했습니다.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            uploadFile(file);
        }
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadFile(file);
        }
        // Reset input
        e.target.value = '';
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
    };

    const shapeStyles = {
        square: 'aspect-square rounded-lg',
        circle: 'aspect-square rounded-full',
        cover: 'aspect-[16/9] rounded-lg',
    };

    return (
        <div className={cn('relative', className)}>
            <div
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={cn(
                    'relative cursor-pointer overflow-hidden border-2 border-dashed transition-all',
                    shapeStyles[shape],
                    isDragging
                        ? 'border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10'
                        : 'border-[var(--color-border-default)] hover:border-[var(--color-accent-primary)]',
                    value ? 'border-solid' : ''
                )}
            >
                {value ? (
                    <>
                        <img
                            src={value}
                            alt="Uploaded"
                            className="w-full h-full object-cover"
                        />
                        {/* Remove button */}
                        <button
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                        {/* Change overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-sm font-medium">변경하기</span>
                        </div>
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                        {isUploading ? (
                            <LoadingSpinner />
                        ) : (
                            <>
                                <svg
                                    width="40"
                                    height="40"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="text-[var(--color-text-tertiary)] mb-2"
                                >
                                    <path
                                        d="M4 14.8995V17C4 19.2091 5.79086 21 8 21H16C18.2091 21 20 19.2091 20 17V14.8995M12 15L12 3M12 3L7 7.5M12 3L17 7.5"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span className="text-sm text-[var(--color-text-secondary)]">
                                    {placeholder}
                                </span>
                                <span className="text-xs text-[var(--color-text-tertiary)] mt-1">
                                    최대 {maxSizeMB}MB
                                </span>
                            </>
                        )}
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-2 text-sm text-red-500">{error}</p>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}
