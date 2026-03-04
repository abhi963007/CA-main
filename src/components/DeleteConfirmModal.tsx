import React, { useState } from 'react';
import { Trash2, Loader2, X } from 'lucide-react';
import { deleteEntry } from '../services/workEntries';

interface DeleteConfirmModalProps {
    entryId: string | null;
    entryName: string;
    onClose: () => void;
}

export default function DeleteConfirmModal({ entryId, entryName, onClose }: DeleteConfirmModalProps) {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');

    if (!entryId) return null;

    const handleDelete = async () => {
        setDeleting(true);
        setError('');
        try {
            await deleteEntry(entryId);
            onClose();
        } catch (err: any) {
            setError(err.message ?? 'Could not delete entry. Try again.');
            setDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px] p-4">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-100 p-2 rounded-xl">
                            <Trash2 className="w-5 h-5 text-red-600" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Delete Entry</h2>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                    Are you sure you want to delete the entry for{' '}
                    <span className="font-semibold text-slate-900">"{entryName}"</span>? This action cannot be undone.
                </p>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
                        {error}
                    </div>
                )}

                <div className="flex gap-3 justify-end mt-2">
                    <button
                        onClick={onClose}
                        disabled={deleting}
                        className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition-colors text-sm disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="px-6 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 font-semibold shadow-md shadow-red-200 transition-all text-sm flex items-center gap-2 disabled:opacity-60"
                    >
                        {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        {deleting ? 'Deleting…' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}
