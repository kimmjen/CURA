import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { useQueryClient } from '@tanstack/react-query';
import * as api from '@/api';

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    collectionId: string;
    onSuccess: () => void;
}

type ModalState = 'initial' | 'checking' | 'confirm' | 'importing' | 'success' | 'error';

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, collectionId, onSuccess }) => {
    const queryClient = useQueryClient();
    const [state, setState] = useState<ModalState>('initial');
    const [message, setMessage] = useState('');


    // Reset state when opening
    React.useEffect(() => {
        if (isOpen && state === 'initial') {
            checkChannel();
        }
    }, [isOpen]);

    const checkChannel = async () => {
        setState('checking');
        setMessage('Fetching channel information from YouTube...');

        try {
            const info = await api.getChannelInfo(collectionId);
            // setChannelInfo(info);
            setState('confirm');
            setMessage(`Found channel "${info.title}" with ${info.video_count} videos.Do you want to import all of them ? `);
        } catch (error: any) {
            setState('error');
            setMessage(error.message);
        }
    };

    const executeImport = async () => {
        setState('importing');
        setMessage('Fetching videos from YouTube... This may take a while.');

        try {
            const data = await api.importFromChannel(collectionId);
            setState('success');
            setMessage(data.message);
            queryClient.invalidateQueries({ queryKey: ['videos', collectionId] });
            onSuccess();
        } catch (error: any) {
            setState('error');
            setMessage(error.message);
        }
    };

    const handleClose = () => {
        setState('initial');
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={
                state === 'checking' ? 'Checking Channel...' :
                    state === 'confirm' ? 'Confirm Import' :
                        state === 'importing' ? 'Importing Videos...' :
                            state === 'success' ? 'Import Successful' :
                                state === 'error' ? 'Import Failed' : 'Auto-Import'
            }
        >
            <div className="space-y-6">
                <p className="text-gray-300">{message}</p>

                <div className="flex justify-end gap-3">
                    {state === 'confirm' ? (
                        <>
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 text-gray-400 hover:text-white transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeImport}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold transition"
                            >
                                Start Import
                            </button>
                        </>
                    ) : state === 'checking' || state === 'importing' ? (
                        <div className="flex items-center gap-2 text-blue-400">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Processing...
                        </div>
                    ) : (
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-bold transition"
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
};
