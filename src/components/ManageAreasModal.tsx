import React, { useState, useEffect } from 'react';
import { X, Briefcase, Trash2, Search, Plus, ChevronRight, ChevronLeft } from 'lucide-react';
import { subscribeToWorkAreas, addWorkArea, deleteWorkArea, addSubParticular, removeSubParticular } from '../services/dataPools';
import { WorkArea } from '../types';

interface ManageAreasModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ManageAreasModal({ isOpen, onClose }: ManageAreasModalProps) {
    const [areas, setAreas] = useState<WorkArea[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 8;
    const [subPage, setSubPage] = useState(1);
    const SUB_ITEMS_PER_PAGE = 5;
    const [selectedArea, setSelectedArea] = useState<WorkArea | null>(null);

    // Add Area form
    const [newName, setNewName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Sub-particular form
    const [newSub, setNewSub] = useState('');

    useEffect(() => {
        if (!isOpen) return;
        return subscribeToWorkAreas(setAreas);
    }, [isOpen]);

    useEffect(() => {
        setSubPage(1);
    }, [selectedArea?.id]);

    if (!isOpen) return null;

    async function handleAddArea() {
        if (!newName.trim()) return;
        setIsSaving(true);
        try {
            await addWorkArea({ name: newName, subParticulars: [] });
            setNewName('');
        } catch (err) { console.error(err); }
        finally { setIsSaving(false); }
    }

    async function handleAddSub() {
        if (!selectedArea || !newSub.trim()) return;
        try {
            await addSubParticular(selectedArea.id, newSub.trim());
            setNewSub('');
        } catch (err) { console.error(err); }
    }

    async function handleDeleteSub(sub: string) {
        if (!selectedArea) return;
        try {
            await removeSubParticular(selectedArea.id, sub);
        } catch (err) { console.error(err); }
    }

    const filtered = areas.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px] p-4">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 h-[80vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Manage Work Areas & Subs</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100 text-xs">

                    {/* Areas List */}
                    <div className="w-full md:w-72 flex flex-col min-w-0">
                        <div className="p-3 border-b border-slate-50 bg-slate-50/30 space-y-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                <input
                                    type="text" placeholder="Search areas..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                                    className="w-full bg-white border border-slate-200 rounded-lg py-1.5 pl-8 pr-2 focus:border-primary outline-none transition-all"
                                />
                            </div>
                            <div className="flex gap-1.5">
                                <input
                                    placeholder="New area name..." value={newName} onChange={e => setNewName(e.target.value)}
                                    className="flex-1 border border-slate-200 rounded-lg px-2 py-1.5 focus:border-primary outline-none"
                                />
                                <button
                                    onClick={handleAddArea} disabled={isSaving || !newName.trim()}
                                    className="bg-primary text-white p-1.5 rounded-lg hover:opacity-90 disabled:opacity-50"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                            {paginated.map(a => (
                                <div key={a.id} className="flex group">
                                    <button
                                        onClick={() => setSelectedArea(a)}
                                        className={`flex-1 flex items-center justify-between p-2.5 rounded-lg text-left transition-all ${selectedArea?.id === a.id ? 'bg-primary/5 text-primary font-bold shadow-sm ring-1 ring-primary/10' : 'hover:bg-slate-50 text-slate-600'}`}
                                    >
                                        <span className="truncate">{a.name}</span>
                                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${selectedArea?.id === a.id ? 'translate-x-0.5 opacity-100' : 'opacity-0'}`} />
                                    </button>
                                    <button
                                        onClick={() => { if (window.confirm('Delete area?')) deleteWorkArea(a.id); }}
                                        className="p-2 text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Sub-footer */}
                        {totalPages > 1 && (
                            <div className="px-3 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                    Page {page} of {totalPages}
                                </span>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="p-1 rounded-md border border-slate-200 bg-white text-slate-500 disabled:opacity-30 hover:bg-slate-50 transition-colors shadow-sm"
                                    >
                                        <ChevronLeft className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="p-1 rounded-md border border-slate-200 bg-white text-slate-500 disabled:opacity-30 hover:bg-slate-50 transition-colors shadow-sm"
                                    >
                                        <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sub-Particulars Section */}
                    <div className="flex-1 flex flex-col bg-slate-50/30 min-w-0">
                        {selectedArea ? (
                            <>
                                <div className="p-6 border-b border-slate-100 bg-white">
                                    <h3 className="text-sm font-bold text-slate-900">{selectedArea.name}</h3>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Manage sub-categories for this work area</p>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="flex gap-2">
                                        <input
                                            placeholder="Add sub-particular (e.g. Audit, Filling...)"
                                            value={newSub} onChange={e => setNewSub(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleAddSub()}
                                            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-medium"
                                        />
                                        <button
                                            onClick={handleAddSub}
                                            className="px-4 py-2.5 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add
                                        </button>
                                    </div>

                                    <div className="space-y-2 pr-1 h-full min-h-[30vh]">
                                        {selectedArea.subParticulars.length > 0 ? (
                                            (() => {
                                                const subTotalPages = Math.ceil(selectedArea.subParticulars.length / SUB_ITEMS_PER_PAGE);
                                                const subPaginated = selectedArea.subParticulars.slice((subPage - 1) * SUB_ITEMS_PER_PAGE, subPage * SUB_ITEMS_PER_PAGE);

                                                return (
                                                    <>
                                                        {subPaginated.map((s, idx) => (
                                                            <div key={idx} className="flex items-center justify-between bg-white border border-slate-200/60 p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                                                                <span className="text-slate-700 font-medium">{s}</span>
                                                                <button
                                                                    onClick={() => handleDeleteSub(s)}
                                                                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ))}

                                                        {subTotalPages > 1 && (
                                                            <div className="mt-4 flex items-center justify-between py-2 border-t border-slate-100 border-dashed">
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Page {subPage} of {subTotalPages}</span>
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => setSubPage(p => Math.max(1, p - 1))}
                                                                        disabled={subPage === 1}
                                                                        className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 disabled:opacity-30 hover:bg-slate-50 shadow-sm"
                                                                    >
                                                                        <ChevronLeft className="w-3.5 h-3.5" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setSubPage(p => Math.min(subTotalPages, p + 1))}
                                                                        disabled={subPage === subTotalPages}
                                                                        className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 disabled:opacity-30 hover:bg-slate-50 shadow-sm"
                                                                    >
                                                                        <ChevronRight className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                );
                                            })()
                                        ) : (
                                            <div className="text-center py-10 bg-slate-100/50 rounded-2xl border border-dashed border-slate-200">
                                                <p className="text-slate-400 font-medium italic">No sub-particulars yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-3">
                                <div className="p-4 rounded-full bg-slate-100 text-slate-400">
                                    <Briefcase className="w-8 h-8 opacity-20" />
                                </div>
                                <div>
                                    <p className="text-slate-500 font-bold">Select a work area</p>
                                    <p className="text-slate-400 text-[10px]">Select an area from the left to manage its sub-particulars.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
