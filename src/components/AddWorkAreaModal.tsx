import React, { useState } from 'react';
import { X, Briefcase, Plus, Trash2 } from 'lucide-react';
import { addWorkArea } from '../services/dataPools';

interface AddWorkAreaModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddWorkAreaModal({ isOpen, onClose }: AddWorkAreaModalProps) {
    const [name, setName] = useState('');
    const [subPart, setSubPart] = useState('');
    const [subs, setSubs] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen) return null;

    function addSub() {
        if (!subPart.trim()) return;
        if (subs.includes(subPart.trim())) return;
        setSubs([...subs, subPart.trim()]);
        setSubPart('');
    }

    function removeSub(index: number) {
        setSubs(subs.filter((_, i) => i !== index));
    }

    async function handleSave() {
        if (!name.trim()) return;
        setIsSaving(true);
        try {
            await addWorkArea({ name, subParticulars: subs });
            setName('');
            setSubs([]);
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
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Add Work Area</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <label className="block">
                        <span className="text-sm font-semibold text-slate-700 mb-1 block">Work Area Name *</span>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="e.g. Income Tax Audit"
                            className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-primary h-11 px-3 text-sm border outline-none transition-colors"
                        />
                    </label>

                    <div className="space-y-3">
                        <span className="text-sm font-semibold text-slate-700 block">Sub Particulars</span>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={subPart}
                                onChange={e => setSubPart(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addSub()}
                                placeholder="Add sub-particular..."
                                className="flex-1 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-primary h-11 px-3 text-sm border outline-none transition-colors"
                            />
                            <button
                                onClick={addSub}
                                className="bg-primary text-white p-2.5 rounded-xl hover:bg-primary/90 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        {subs.length > 0 ? (
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                                {subs.map((s, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                                        <span className="text-sm text-slate-700">{s}</span>
                                        <button onClick={() => removeSub(idx)} className="text-rose-400 hover:text-rose-600 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400 italic">No sub-particulars added yet.</p>
                        )}
                    </div>
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
                        disabled={isSaving || !name.trim()}
                        className="px-6 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-all shadow-sm flex items-center gap-2"
                    >
                        {isSaving ? 'Saving...' : 'Add Work Area'}
                    </button>
                </div>
            </div>
        </div>
    );
}
