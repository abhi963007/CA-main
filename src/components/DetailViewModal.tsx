import React from 'react';
import { X } from 'lucide-react';
import { WorkEntry } from '../types';
import { StatusBadge, PaymentBadge } from './Badges';

interface DetailViewModalProps {
    entry: WorkEntry | null;
    onClose: () => void;
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                {label}
            </span>
            <span className="text-sm font-medium text-slate-800 leading-snug">
                {value || <span className="text-slate-300 italic">—</span>}
            </span>
        </div>
    );
}

function Divider({ label }: { label: string }) {
    return (
        <div className="col-span-full flex items-center gap-3 pt-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap">
                {label}
            </span>
            <div className="h-px flex-1 bg-slate-100" />
        </div>
    );
}

export default function DetailViewModal({ entry, onClose }: DetailViewModalProps) {
    if (!entry) return null;

    const priorityColor =
        entry.priority === 'High'
            ? 'bg-red-50 text-red-600 border border-red-100'
            : entry.priority === 'Low'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : 'bg-amber-50 text-amber-700 border border-amber-100';

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-[640px] rounded-2xl shadow-xl border border-slate-200 flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Header ─────────────────────────────────────────────────────── */}
                <div className="flex items-start justify-between px-7 py-5 border-b border-slate-100">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                            Work Entry Details
                        </p>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight">
                            {entry.customerName}
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">{entry.areaOfWork}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-4 mt-0.5 flex-shrink-0 rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* ── Body ───────────────────────────────────────────────────────── */}
                <div className="px-7 py-6 overflow-y-auto max-h-[72vh]">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-5">

                        {/* ── Work Information ── */}
                        <Divider label="Work Information" />

                        <Field label="Area of Work" value={entry.areaOfWork} />
                        <Field label="Sub Particular" value={entry.subParticular} />

                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                                Status
                            </span>
                            <div><StatusBadge status={entry.status} /></div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                                Priority
                            </span>
                            <div>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${priorityColor}`}>
                                    {entry.priority || 'Medium'}
                                </span>
                            </div>
                        </div>

                        {/* ── Assignment ── */}
                        <Divider label="Assignment" />

                        <Field label="Assigned To" value={
                            entry.assignedToInitials ? (
                                <span className="flex items-center gap-2">
                                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                                        {entry.assignedToInitials}
                                    </span>
                                    {entry.assignedTo}
                                </span>
                            ) : entry.assignedTo
                        } />
                        <Field label="Created Date" value={entry.date} />
                        <Field label="Assigned Date" value={entry.assignedDate !== '—' ? entry.assignedDate : undefined} />
                        <Field label="Due Date" value={entry.dueDate} />

                        {/* ── Billing & Payment ── */}
                        <Divider label="Billing & Payment" />

                        <Field label="Invoice Number" value={
                            <span className="font-mono">{entry.invoiceNo !== '—' ? entry.invoiceNo : undefined}</span>
                        } />
                        <Field label="Billed" value={entry.billed} />
                        <Field label="Amount" value={
                            <span className="text-base font-bold text-slate-900">
                                ₹{entry.amount.toLocaleString('en-IN')}
                            </span>
                        } />
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                                Payment Status
                            </span>
                            <div><PaymentBadge status={entry.paymentStatus} /></div>
                        </div>
                        <Field label="Payment Mode" value={entry.paymentMode} />

                        {/* ── Notes ── */}
                        {entry.description && (
                            <>
                                <Divider label="Notes" />
                                <div className="col-span-full">
                                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                                        {entry.description}
                                    </p>
                                </div>
                            </>
                        )}

                    </div>
                </div>

                {/* ── Footer ─────────────────────────────────────────────────────── */}
                <div className="flex items-center justify-between border-t border-slate-100 px-7 py-4 bg-slate-50/60">
                    <span className="text-[10px] text-slate-300 font-mono select-all">
                        ID: {entry.id}
                    </span>
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
