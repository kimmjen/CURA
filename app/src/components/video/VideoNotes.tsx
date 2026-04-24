import { lazy, Suspense } from 'react';
import { Pencil, Clock, Trash2, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/common';
import { useLanguage } from '@/contexts/LanguageContext';
import type { VideoNote } from '@/api/client';

// Markdown renderer is ~90 kB gzipped with deps. Only the Notes tab
// needs it — load on demand instead of shipping in the player chunk.
const ReactMarkdown = lazy(() => import('react-markdown'));

interface VideoNotesProps {
    notes: VideoNote[];
    isLoading: boolean;
    isPending: boolean;
    newNoteContent: string;
    onNewNoteChange: (content: string) => void;
    onAddNote: () => void;
    onDeleteNote: (id: number) => void;
    onSeek: (seconds: number) => void;
}

export default function VideoNotes({
    notes,
    isLoading,
    isPending,
    newNoteContent,
    onNewNoteChange,
    onAddNote,
    onDeleteNote,
    onSeek
}: VideoNotesProps) {
    const { t } = useLanguage();

    const formatTimestamp = (seconds: number | undefined) => {
        if (seconds === undefined || seconds === null) return null;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col h-full">
            {/* Notes List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <LoadingSpinner size="md" />
                    </div>
                ) : notes.length === 0 ? (
                    <div className="text-center py-8 text-[var(--color-text-tertiary)]">
                        <Pencil size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">{t('player.no_notes')}</p>
                    </div>
                ) : (
                    notes.map((note: VideoNote) => (
                        <div
                            key={note.id}
                            className="bg-[var(--color-bg-secondary)] rounded-[var(--radius-lg)] p-3 border border-[var(--color-border-default)] group hover:border-[var(--color-accent-primary)]/30 transition-all"
                        >
                            <div className="flex items-start justify-between gap-2 mb-2">
                                {note.timestampSeconds !== undefined && note.timestampSeconds !== null && (
                                    <button
                                        onClick={() => onSeek(note.timestampSeconds!)}
                                        className="flex items-center gap-1 px-2 py-0.5 bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] rounded text-xs font-mono hover:bg-[var(--color-accent-primary)]/20 transition-colors"
                                    >
                                        <Clock size={12} />
                                        {formatTimestamp(note.timestampSeconds)}
                                    </button>
                                )}
                                <button
                                    onClick={() => onDeleteNote(note.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1 text-[var(--color-text-tertiary)] hover:text-red-500 transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <div className="prose prose-sm prose-invert max-w-none text-[var(--color-text-primary)]">
                                <Suspense fallback={<span className="whitespace-pre-wrap text-sm">{note.content}</span>}>
                                    <ReactMarkdown>{note.content}</ReactMarkdown>
                                </Suspense>
                            </div>
                            <div className="mt-2 text-[10px] text-[var(--color-text-tertiary)]">
                                {new Date(note.createdAt).toLocaleString()}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Note Input */}
            <div className="p-4 border-t border-[var(--color-border-default)] bg-[var(--color-bg-primary)]">
                <div className="flex flex-col gap-2">
                    <textarea
                        className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-3 text-sm focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] resize-none transition-all placeholder:text-[var(--color-text-tertiary)]"
                        placeholder={t('player.notes_placeholder')}
                        value={newNoteContent}
                        onChange={(e) => onNewNoteChange(e.target.value)}
                        rows={2}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                e.preventDefault();
                                onAddNote();
                            }
                        }}
                    />
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[var(--color-text-tertiary)]">
                            Markdown • Cmd+Enter to save
                        </span>
                        <Button
                            size="sm"
                            onClick={onAddNote}
                            disabled={!newNoteContent.trim() || isPending}
                        >
                            {isPending ? (
                                <LoadingSpinner size="sm" />
                            ) : (
                                <>
                                    <Plus size={14} className="mr-1" />
                                    Add Note
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
