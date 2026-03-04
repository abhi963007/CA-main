import React, { useState, useEffect } from 'react';
import {
  Landmark, Plus, BarChart2, Banknote, CheckCircle2,
  Search, Filter, Pencil, Trash2, RefreshCw,
} from 'lucide-react';
import { WorkEntry } from './types';
import { subscribeToEntries } from './services/workEntries';
import AddWorkModal from './components/AddWorkModal';
import EditWorkModal from './components/EditWorkModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import DetailViewModal from './components/DetailViewModal';
import CustomSelect from './components/CustomSelect';
import { StatusBadge, PaymentBadge } from './components/Badges';

const PAGE_SIZE = 15;

export default function App() {
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState('');

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WorkEntry | null>(null);
  const [viewingEntry, setViewingEntry] = useState<WorkEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<{ id: string; name: string } | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [billedFilter, setBilledFilter] = useState('');
  const [assignedToFilter, setAssignedToFilter] = useState('');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // ── Real-time Firestore listener ──────────────────────────────────────────
  useEffect(() => {
    let unsub: (() => void) | undefined;
    try {
      setLoading(true);
      unsub = subscribeToEntries((data) => {
        setEntries(data);
        setLoading(false);
        setFirebaseError('');
      });
    } catch (err: any) {
      setFirebaseError(err.message ?? 'Firebase connection failed.');
      setLoading(false);
    }
    return () => unsub?.();
  }, []);

  // ── Derived values ────────────────────────────────────────────────────────
  const assignedUsers: string[] = Array.from(new Set(entries.map((e) => e.assignedTo))).filter(
    (u): u is string => !!u && u !== 'Unassigned'
  );

  const filtered = entries.filter((entry) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      entry.customerName.toLowerCase().includes(q) ||
      entry.areaOfWork.toLowerCase().includes(q) ||
      entry.invoiceNo.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || entry.status === statusFilter;
    const matchesPayment = !paymentStatusFilter || entry.paymentStatus === paymentStatusFilter;
    const matchesBilled = !billedFilter || entry.billed === billedFilter;
    const matchesAssigned = !assignedToFilter || entry.assignedTo === assignedToFilter;
    const matchesFrom = !dateFromFilter || entry.date >= dateFromFilter;
    const matchesTo = !dateToFilter || entry.date <= dateToFilter;
    return matchesSearch && matchesStatus && matchesPayment && matchesBilled && matchesAssigned && matchesFrom && matchesTo;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const totalPending = entries
    .filter((e) => e.paymentStatus === 'Not Received')
    .reduce((s, e) => s + e.amount, 0);
  const completedCount = entries.filter((e) => e.status === 'Completed').length;

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setPaymentStatusFilter('');
    setBilledFilter('');
    setAssignedToFilter('');
    setDateFromFilter('');
    setDateToFilter('');
    setCurrentPage(1);
  };

  const goToPage = (p: number) => setCurrentPage(Math.max(1, Math.min(p, totalPages)));

  const handleEditSaved = (updated: WorkEntry) => {
    setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50">

      {/* ── Nav ──────────────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary text-white flex-shrink-0">
            <Landmark className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h2 className="text-base sm:text-xl font-bold leading-tight tracking-tight text-slate-900">
            CA Office Work Management
          </h2>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-3 sm:px-5 py-2 sm:py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 flex-shrink-0"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Add Work</span>
          <span className="sm:hidden">Add</span>
        </button>
      </header>

      <main className="flex flex-1 flex-col gap-4 sm:gap-6 p-4 sm:p-6 lg:px-10">

        {/* Firebase error banner */}
        {firebaseError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
            <span className="font-semibold">Firebase Error:</span> {firebaseError}
            <span className="ml-1 text-red-500">— Please update <code className="bg-red-100 px-1 rounded">src/firebase.ts</code> with your project config.</span>
          </div>
        )}

        {/* ── Summary Cards ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-2 rounded-2xl border border-slate-200/60 bg-white p-4 sm:p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Entries</p>
              <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">{loading ? '—' : entries.length.toLocaleString('en-IN')}</p>
            <p className="text-xs text-slate-400 font-medium">{filtered.length} matching filters</p>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl border border-slate-200/60 bg-white p-4 sm:p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider">Pending Payment (₹)</p>
              <Banknote className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">
              {loading ? '—' : `₹${totalPending.toLocaleString('en-IN')}`}
            </p>
            <p className="text-xs text-slate-500 font-medium">
              {entries.filter((e) => e.paymentStatus === 'Not Received').length} unpaid invoices
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl border border-slate-200/60 bg-white p-4 sm:p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider">Completed</p>
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">{loading ? '—' : completedCount}</p>
            <p className="text-xs text-primary font-medium">
              {entries.length > 0
                ? `${Math.round((completedCount / entries.length) * 100)}% completion rate`
                : 'No data yet'}
            </p>
          </div>
        </div>

        {/* ── Filters ───────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm">
          {/* Row 1: Search + Status/Payment/Billed */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search customer, work area or invoice..."
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 sm:pl-10 text-sm focus:border-primary focus:ring-primary outline-none"
              />
            </div>

            {/* Status / Payment / Billed filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:flex lg:gap-3">
              <CustomSelect
                value={statusFilter}
                onChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
                placeholder="Status"
                className="w-full lg:min-w-[140px]"
                options={[
                  { label: 'Completed', value: 'Completed' },
                  { label: 'Pending Approval', value: 'Pending Approval' },
                  { label: 'Assigned', value: 'Assigned' },
                  { label: 'Initiated', value: 'Initiated' },
                  { label: 'Document Requested', value: 'Document Requested' },
                  { label: 'Not Assigned', value: 'Not Assigned' },
                ]}
              />
              <CustomSelect
                value={paymentStatusFilter}
                onChange={(v) => { setPaymentStatusFilter(v); setCurrentPage(1); }}
                placeholder="Payment Status"
                className="w-full lg:min-w-[150px]"
                options={[
                  { label: 'Received', value: 'Received' },
                  { label: 'Not Received', value: 'Not Received' },
                ]}
              />
              <CustomSelect
                value={billedFilter}
                onChange={(v) => { setBilledFilter(v); setCurrentPage(1); }}
                placeholder="Billed"
                className="w-full lg:min-w-[110px]"
                options={[
                  { label: 'Yes', value: 'Yes' },
                  { label: 'No', value: 'No' },
                ]}
              />
            </div>
          </div>

          {/* Row 2: Assigned To + Date Range + Clear */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
            <CustomSelect
              value={assignedToFilter}
              onChange={(v) => { setAssignedToFilter(v); setCurrentPage(1); }}
              placeholder="Assigned To"
              className="w-full sm:w-auto sm:min-w-[160px]"
              options={assignedUsers.map((u) => ({ label: u, value: u }))}
            />

            {/* Date range */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="date"
                value={dateFromFilter}
                onChange={(e) => { setDateFromFilter(e.target.value); setCurrentPage(1); }}
                className="block flex-1 sm:flex-initial rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm focus:border-primary outline-none text-slate-600"
              />
              <span className="text-slate-400 text-sm flex-shrink-0">to</span>
              <input
                type="date"
                value={dateToFilter}
                onChange={(e) => { setDateToFilter(e.target.value); setCurrentPage(1); }}
                className="block flex-1 sm:flex-initial rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm focus:border-primary outline-none text-slate-600"
              />
            </div>

            <button
              onClick={clearFilters}
              className="w-full sm:w-auto sm:ml-auto flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Clear Filters
            </button>
          </div>
        </div>

        {/* ── Table ─────────────────────────────────────────────────────────── */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-3 py-2.5 whitespace-nowrap">Date</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">Customer Name</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">Area of Work</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">Sub Particular</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">Assigned To</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">Assigned Date</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">Status</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">Billed</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">Invoice No</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">Amount</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">Payment</th>
                  <th className="px-3 py-2.5 text-center whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={12} className="px-4 py-10 text-center">
                      <div className="flex items-center justify-center gap-2 text-slate-400">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span className="text-sm font-medium">Loading from Firebase…</span>
                      </div>
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-4 py-12 text-center text-slate-400 text-sm">
                      {entries.length === 0
                        ? 'No entries yet. Click "Add Work" to create your first entry.'
                        : 'No entries match your current filters.'}
                    </td>
                  </tr>
                ) : (
                  paginated.map((entry) => (
                    <tr
                      key={entry.id}
                      onClick={() => setViewingEntry(entry)}
                      className="bg-white hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <td className="whitespace-nowrap px-3 py-2.5 font-medium text-slate-500">{entry.date}</td>
                      <td className="px-3 py-2.5 font-semibold text-slate-900 max-w-[120px] truncate">{entry.customerName}</td>
                      <td className="px-3 py-2.5 text-slate-600 max-w-[100px] truncate">{entry.areaOfWork}</td>
                      <td className="px-3 py-2.5 text-slate-600 max-w-[100px] truncate">{entry.subParticular}</td>
                      <td className="px-3 py-2.5">
                        {entry.assignedToInitials ? (
                          <div className="flex items-center gap-1.5">
                            <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[9px] font-bold flex-shrink-0">
                              {entry.assignedToInitials}
                            </div>
                            <span className="text-slate-700 whitespace-nowrap">{entry.assignedTo}</span>
                          </div>
                        ) : (
                          <span className="italic text-slate-400">{entry.assignedTo}</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap">{entry.assignedDate}</td>
                      <td className="px-3 py-2.5"><StatusBadge status={entry.status} /></td>
                      <td className="px-3 py-2.5 text-slate-600">{entry.billed}</td>
                      <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap font-mono">{entry.invoiceNo}</td>
                      <td className="px-3 py-2.5 font-semibold text-slate-800 whitespace-nowrap">
                        ₹{entry.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-3 py-2.5"><PaymentBadge status={entry.paymentStatus} /></td>
                      <td className="px-3 py-2.5 text-center">
                        <div className="flex justify-center gap-1">
                          <button
                            title="Edit"
                            onClick={(e) => { e.stopPropagation(); setEditingEntry(entry); }}
                            className="text-slate-400 hover:text-primary transition-colors p-1 rounded hover:bg-primary/10"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="Delete"
                            onClick={(e) => { e.stopPropagation(); setDeletingEntry({ id: entry.id, name: entry.customerName }); }}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ──────────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-100 bg-white px-4 sm:px-6 py-4 gap-3">
            <p className="text-sm text-slate-500 text-center sm:text-left">
              Showing {paginated.length > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0}–
              {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} entries
            </p>
            <div className="flex justify-center gap-2 items-center">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-lg border border-slate-200 px-3 py-1 text-sm font-medium hover:bg-slate-50 disabled:opacity-40"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const page = totalPages <= 5 ? i + 1 : Math.max(1, currentPage - 2) + i;
                if (page > totalPages) return null;
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`rounded-lg px-3 py-1 text-sm font-medium border ${currentPage === page
                      ? 'bg-primary text-white border-primary'
                      : 'border-slate-200 hover:bg-slate-50'
                      }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-slate-200 px-3 py-1 text-sm font-medium hover:bg-slate-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <AddWorkModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <EditWorkModal
        entry={editingEntry}
        onClose={() => setEditingEntry(null)}
      />
      <DeleteConfirmModal
        entryId={deletingEntry?.id ?? null}
        entryName={deletingEntry?.name ?? ''}
        onClose={() => setDeletingEntry(null)}
      />
      <DetailViewModal
        entry={viewingEntry}
        onClose={() => setViewingEntry(null)}
      />
    </div>
  );
}
