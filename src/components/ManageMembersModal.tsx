import React, { useState, useEffect } from 'react';
import { X, UserCheck, Trash2, Search, Users } from 'lucide-react';
import { subscribeToMembers, addMember, deleteMember } from '../services/dataPools';
import { Member } from '../types';

interface ManageMembersModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ManageMembersModal({ isOpen, onClose }: ManageMembersModalProps) {
    const [members, setMembers] = useState<Member[]>([]);
    const [search, setSearch] = useState('');

    // Add form
    const [name, setName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        return subscribeToMembers(setMembers);
    }, [isOpen]);

    if (!isOpen) return null;

    async function handleAdd() {
        if (!name.trim()) return;
        setIsSaving(true);
        try {
            await addMember({ name });
            setName('');
        } catch (err) { console.error(err); }
        finally { setIsSaving(false); }
    }

    const filtered = members.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px] p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 h-[80vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                            <UserCheck className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Manage Team</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">

                    {/* List Section */}
                    <div className="flex-1 flex flex-col min-w-0">
                        <div className="p-4 border-b border-slate-50 bg-slate-50/30">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search members..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-sm focus:border-primary outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {filtered.map(m => {
                                const displayInitials = m.initials || m.name.split(' ').map(n => n[0]).join('').slice(0, 3).toUpperCase();
                                return (
                                    <div key={m.id} className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-primary/20 hover:bg-slate-50 transition-all">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                                                {displayInitials}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-slate-900 truncate">{m.name}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => deleteMember(m.id)}
                                            className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                );
                            })}
                            {filtered.length === 0 && (
                                <div className="text-center py-10">
                                    <p className="text-sm text-slate-400 italic">No members found</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Add Section */}
                    <div className="w-full md:w-64 p-6 bg-slate-50/30 space-y-4">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">New Member</h3>
                        <div className="space-y-3">
                            <input
                                placeholder="Full Name *"
                                value={name} onChange={e => setName(e.target.value)}
                                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-primary"
                            />
                            <button
                                onClick={handleAdd}
                                disabled={isSaving || !name.trim()}
                                className="w-full py-2.5 bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity font-bold uppercase tracking-wide"
                            >
                                {isSaving ? 'Saving...' : 'Add Member'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
