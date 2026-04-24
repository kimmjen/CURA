import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import type { Collection } from '@/types/collection';

export interface EditCollectionModalProps {
    open: boolean;
    onClose: () => void;
    collection: Collection | null;
    onUpdate: (data: { title?: string; description?: string }) => Promise<void>;
}

export default function EditCollectionModal({
    open,
    onClose,
    collection,
    onUpdate
}: EditCollectionModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (collection) {
            setTitle(collection.title);
            setDescription(collection.description || '');
        }
    }, [collection]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            setError('제목을 입력해주세요');
            return;
        }

        setError('');
        setIsSubmitting(true);

        try {
            await onUpdate({
                title: title.trim(),
                description: description.trim() || undefined,
            });
            onClose();
        } catch (err) {
            setError('컬렉션 수정에 실패했습니다');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose} title="컬렉션 수정">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                        제목 *
                    </label>
                    <Input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="컬렉션 제목을 입력하세요"
                        required
                        disabled={isSubmitting}
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                        설명
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="컬렉션 설명을 입력하세요 (선택사항)"
                        rows={4}
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
                    />
                </div>

                {/* Error */}
                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        취소
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? '저장 중...' : '저장'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
