import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Select, Input } from '@/components/ui';
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
    const [importMode, setImportMode] = useState<'official' | 'custom'>('official');
    const [customChannelUrl, setCustomChannelUrl] = useState('');
    const [defaultCategory, setDefaultCategory] = useState<string>('');


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
            setMessage(`Found channel "${info.title}" with ${info.video_count} videos. Do you want to import all of them?`);
        } catch (error: any) {
            setState('error');
            setMessage(error.message);
        }
    };

    const executeImport = async () => {
        setState('importing');
        setMessage('Fetching videos from YouTube... This may take a while.');

        try {
            const data = await api.importFromChannel(
                collectionId,
                5000,
                importMode === 'custom' ? customChannelUrl : undefined,
                importMode === 'custom' && defaultCategory ? defaultCategory : undefined
            );
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
        setImportMode('official');
        setCustomChannelUrl('');
        setDefaultCategory('');
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

                {/* Import Mode Selection */}
                {state === 'confirm' && (
                    <div className="space-y-4">
                        <Select
                            label="Import Source"
                            value={importMode}
                            onChange={(e) => setImportMode(e.target.value as 'official' | 'custom')}
                        >
                            <option value="official">Official Channel</option>
                            <option value="custom">Custom Channel URL</option>
                        </Select>

                        {importMode === 'custom' && (
                            <>
                                <Input
                                    label="YouTube Channel URL"
                                    value={customChannelUrl}
                                    onChange={(e) => setCustomChannelUrl(e.target.value)}
                                    placeholder="https://www.youtube.com/@channel_name"
                                />

                                <Select
                                    label="Default Category (Optional)"
                                    value={defaultCategory}
                                    onChange={(e) => setDefaultCategory(e.target.value)}
                                >
                                    <option value="">No default category</option>
                                    <option value="FANCAM">FANCAM</option>
                                    <option value="MV">MV</option>
                                    <option value="LIVE">LIVE</option>
                                    <option value="INTERVIEW">INTERVIEW</option>
                                    <option value="SHORTS">SHORTS</option>
                                    <option value="BEHIND">BEHIND</option>
                                    <option value="VLOG">VLOG</option>
                                    <option value="ETC">ETC</option>
                                </Select>
                            </>
                        )}
                    </div>
                )}

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
