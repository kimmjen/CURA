import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    className?: string;
    placeholder?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, className = "", placeholder = "Upload Image" }) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            console.log('Starting upload...');
            const response = await fetch('http://localhost:8000/api/upload/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            console.log('Upload successful:', data.url);
            onChange(data.url);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className={`relative ${className}`}>
            {value ? (
                <div className="relative group rounded-lg overflow-hidden border border-gray-700 aspect-video bg-gray-900">
                    <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 bg-white text-black rounded-full hover:bg-gray-200 transition"
                            title="Change Image"
                        >
                            <Upload className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => onChange('')}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                            title="Remove Image"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-white hover:border-gray-500 transition cursor-pointer bg-gray-900/50 aspect-video"
                >
                    {isUploading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    ) : (
                        <>
                            <ImageIcon className="w-8 h-8" />
                            <span className="text-sm font-medium">{placeholder}</span>
                        </>
                    )}
                </div>
            )}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
        </div>
    );
};
