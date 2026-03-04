import React, { useState } from 'react';
import { X, UserCheck } from 'lucide-react';
import { addMember } from '../services/dataPools';

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddMemberModal({ isOpen, onClose }: AddMemberModalProps) {
    const [name, setName] = useState('');
    const [initials, setInitials] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen) return null;

    async function handleSave() {
        if (!name.trim() || !initials.trim()) return;
        setIsSaving(true);
        try {
            await addMember({ name, initials: initials.toUpperCase() });
            setName('');
            setInitials('');
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px] p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                            <UserCheck className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Add Team Member</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <label className="block">
                        <span className="text-sm font-semibold text-slate-700 mb-1 block">Full Name *</span>
                        <input
                            type="text"
                            value={name}
                            onChange={e => {
                                setName(e.target.value);
                                // Auto generate initials if empty
                                if (!initials) {
                                    const parts = e.target.value.split(' ');
                                    const ini = parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
                                    // Not setting it automatically to avoid confusing, but could be a helper
                                }
                            }}
                            placeholder="e.g. Rahul Sharma"
                            className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-primary h-11 px-3 text-sm border outline-none transition-colors"
                        />
                    </label>
                    <label className="block">
                        <span className="text-sm font-semibold text-slate-700 mb-1 block">Initials * (max 2-3 chars)</span>
                        <input
                            type="text"
                            value={initials}
                            onChange={e => setInitials(e.target.value)}
                            placeholder="e.g. RS"
                            maxLength={3}
                            className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-primary h-11 px-3 text-sm border outline-none transition-colors uppercase font-bold"
                        />
                    </label>
                </div>

                <div className="px-6 py-5 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !name.trim() || !initials.trim()}
                        className="px-6 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-all shadow-sm flex items-center gap-2"
                    >
                        {isSaving ? 'Saving...' : 'Add Member'}
                    </button>
                </div>
            </div>
        </div>
    );
}
