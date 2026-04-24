import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/common';

export interface CreateCollectionModalProps {
    open: boolean;
    onClose: () => void;
    onCreate: (data: {
        title: string;
        description: string;
        coverImageUrl?: string;
        profileImageUrl?: string;
    }) => Promise<void>;
}

export default function CreateCollectionModal({
    open,
    onClose,
    onCreate,
}: CreateCollectionModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('제목을 입력하세요');
            return;
        }

        setLoading(true);
        try {
            await onCreate({
                title: title.trim(),
                description: description.trim(),
                coverImageUrl: coverImageUrl.trim() || undefined,
                profileImageUrl: profileImageUrl.trim() || undefined,
            });
            setTitle('');
            setDescription('');
            setCoverImageUrl('');
            setProfileImageUrl('');
            onClose();
        } catch (err: any) {
            setError(err.message || '컬렉션 생성 실패');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose} title="새 컬렉션 만들기" size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="제목"
                    placeholder="컬렉션 이름"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    error={error}
                    disabled={loading}
                    required
                />

                <Textarea
                    label="설명 (선택사항)"
                    placeholder="이 컬렉션에 대한 설명을 입력하세요..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                    rows={3}
                />

                <Input
                    label="프로필 이미지 URL (선택사항)"
                    placeholder="https://..."
                    value={profileImageUrl}
                    onChange={(e) => setProfileImageUrl(e.target.value)}
                    disabled={loading}
                    helperText="채널 프로필 이미지 URL을 입력하세요"
                />

                <Input
                    label="커버 이미지 URL (선택사항)"
                    placeholder="https://..."
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    disabled={loading}
                    helperText="컬렉션 커버 이미지 URL을 입력하세요"
                />

                <div className="flex gap-3 justify-end pt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        취소
                    </Button>
                    <Button type="submit" disabled={loading || !title.trim()}>
                        {loading ? (
                            <>
                                <LoadingSpinner size="sm" />
                                생성 중...
                            </>
                        ) : (
                            '생성'
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
