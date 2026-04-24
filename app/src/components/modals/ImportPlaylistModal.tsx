import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/common';

export interface ImportPlaylistModalProps {
    open: boolean;
    onClose: () => void;
    onImport: (playlistUrl: string) => Promise<void>;
}

export default function ImportPlaylistModal({
    open,
    onClose,
    onImport,
}: ImportPlaylistModalProps) {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate YouTube Playlist URL
        const playlistRegex = /^(https?:\/\/)?(www\.)?youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/;
        if (!playlistRegex.test(url)) {
            setError('유효한 YouTube 플레이리스트 URL을 입력하세요');
            return;
        }

        setLoading(true);
        try {
            await onImport(url);
            setUrl('');
            onClose();
        } catch (err: any) {
            setError(err.message || '플레이리스트 가져오기 실패');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose} title="YouTube 플레이리스트 가져오기" size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Input
                        label="플레이리스트 URL"
                        placeholder="https://www.youtube.com/playlist?list=..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        error={error}
                        disabled={loading}
                    />
                    <p className="text-xs text-[var(--color-text-tertiary)] mt-2">
                        YouTube 플레이리스트 URL을 입력하면 자동으로 비디오 목록을 가져옵니다.
                    </p>
                </div>

                <div className="bg-[var(--color-bg-tertiary)] p-4 rounded-[var(--radius-lg)]">
                    <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
                        💡 가져오기 방법
                    </h4>
                    <ol className="text-xs text-[var(--color-text-secondary)] space-y-1 list-decimal list-inside">
                        <li>YouTube에서 플레이리스트 페이지로 이동</li>
                        <li>주소창의 URL 복사 (list= 포함)</li>
                        <li>위 입력창에 붙여넣기</li>
                    </ol>
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
                                가져오는 중...
                            </>
                        ) : (
                            '가져오기'
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
