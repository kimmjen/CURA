import { useState } from 'react';
import { ListVideo, Pencil } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import VideoQueue from './VideoQueue';
import VideoNotes from './VideoNotes';
import type { Video } from '../../types/video';
import type { VideoNote } from '@/api/client';

interface VideoTabsProps {
    queue: Video[];
    currentVideoId: number;
    collectionId: number;
    isQueueLoading: boolean;
    notes: VideoNote[];
    isNotesLoading: boolean;
    isNotePending: boolean;
    newNoteContent: string;
    onNewNoteChange: (content: string) => void;
    onAddNote: () => void;
    onDeleteNote: (id: number) => void;
    onSeek: (seconds: number) => void;
}

export default function VideoTabs({
    queue,
    currentVideoId,
    collectionId,
    isQueueLoading,
    notes,
    isNotesLoading,
    isNotePending,
    newNoteContent,
    onNewNoteChange,
    onAddNote,
    onDeleteNote,
    onSeek
}: VideoTabsProps) {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'queue' | 'notes'>('queue');

    return (
        <div className="flex flex-col h-full bg-[var(--color-bg-primary)]">
            {/* Tab Navigation */}
            <div className="flex border-b border-[var(--color-border-default)] bg-[var(--color-bg-secondary)]/50 backdrop-blur-sm sticky top-0 z-10">
                <button
                    onClick={() => setActiveTab('queue')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-all ${activeTab === 'queue'
                        ? 'border-[var(--color-accent-primary)] text-[var(--color-text-primary)] bg-[var(--color-bg-primary)]'
                        : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
                        }`}
                >
                    <ListVideo size={16} />
                    {t('player.tab_queue')}
                </button>
                <button
                    onClick={() => setActiveTab('notes')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-all ${activeTab === 'notes'
                        ? 'border-[var(--color-accent-primary)] text-[var(--color-text-primary)] bg-[var(--color-bg-primary)]'
                        : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
                        }`}
                >
                    <Pencil size={16} />
                    {t('player.tab_notes')}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {activeTab === 'queue' ? (
                    <VideoQueue
                        queue={queue}
                        currentVideoId={currentVideoId}
                        collectionId={collectionId}
                        isLoading={isQueueLoading}
                    />
                ) : (
                    <VideoNotes
                        notes={notes}
                        isLoading={isNotesLoading}
                        isPending={isNotePending}
                        newNoteContent={newNoteContent}
                        onNewNoteChange={onNewNoteChange}
                        onAddNote={onAddNote}
                        onDeleteNote={onDeleteNote}
                        onSeek={onSeek}
                    />
                )}
            </div>
        </div>
    );
}
