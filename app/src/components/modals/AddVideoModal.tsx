import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/common';

export interface AddVideoModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: (url: string) => Promise<void>;
    collectionId?: number;
}

export default function AddVideoModal({
    open,
    onClose,
    onAdd,
    collectionId,
}: AddVideoModalProps) {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate YouTube URL
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        if (!youtubeRegex.test(url)) {
            setError('유효한 YouTube URL을 입력하세요');
            return;
        }

        setLoading(true);
        try {
            await onAdd(url);
            setUrl('');
            onClose();
        } catch (err: any) {
            setError(err.message || '비디오 추가 실패');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose} title="비디오 추가">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Input
                        label="YouTube URL"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        error={error}
                        disabled={loading}
                    />
                    <p className="text-xs text-[var(--color-text-tertiary)] mt-2">
                        YouTube 비디오 URL을 입력하세요. 메타데이터가 자동으로 가져와집니다.
                    </p>
                </div>

                <div className="flex gap-3 justify-end">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        취소
                    </Button>
                    <Button type="submit" disabled={loading || !url}>
                        {loading ? (
                            <>
                                <LoadingSpinner size="sm" />
                                추가 중...
                            </>
                        ) : (
                            '추가'
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
