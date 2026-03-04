import React, { useState, useEffect } from 'react';
import {
  Landmark, Plus, BarChart2, Banknote, CheckCircle2,
  Search, Filter, Pencil, Trash2, RefreshCw, ChevronLeft, ChevronRight,
  Users, UserPlus, Briefcase, FileText, Download
} from 'lucide-react';
import { WorkEntry, Customer, Member, WorkArea } from './types';
import { subscribeToEntries } from './services/workEntries';
import { subscribeToCustomers, subscribeToMembers, subscribeToWorkAreas } from './services/dataPools';
import { exportToExcel, exportToPDF } from './utils/exportUtils';
import AddWorkModal from './components/AddWorkModal';
import EditWorkModal from './components/EditWorkModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import DetailViewModal from './components/DetailViewModal';
import CustomSelect from './components/CustomSelect';
import { StatusBadge, PaymentBadge } from './components/Badges';

// Manage Modals
import ManageCustomersModal from './components/ManageCustomersModal';
import ManageMembersModal from './components/ManageMembersModal';
import ManageAreasModal from './components/ManageAreasModal';

const PAGE_SIZE = 15;

export default function App() {
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [workAreas, setWorkAreas] = useState<WorkArea[]>([]);

  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState('');

  // Primary Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WorkEntry | null>(null);
  const [viewingEntry, setViewingEntry] = useState<WorkEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<{ id: string; name: string } | null>(null);

  // Pool Modals
  const [isCustOpen, setIsCustOpen] = useState(false);
  const [isMemberOpen, setIsMemberOpen] = useState(false);
  const [isAreaOpen, setIsAreaOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [billedFilter, setBilledFilter] = useState('');
  const [assignedToFilter, setAssignedToFilter] = useState('');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let unsubEntries = subscribeToEntries((data) => {
      setEntries(data);
      setLoading(false);
    });

    let unsubCust = subscribeToCustomers(setCustomers);
    let unsubMemb = subscribeToMembers(setMembers);
    let unsubAreas = subscribeToWorkAreas(setWorkAreas);

    return () => {
      unsubEntries();
      unsubCust();
      unsubMemb();
      unsubAreas();
    };
  }, []);

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
  const totalPending = entries.filter((e) => e.paymentStatus === 'Not Received').reduce((s, e) => s + e.amount, 0);
  const totalReceived = entries.filter((e) => e.paymentStatus === 'Received').reduce((s, e) => s + e.amount, 0);
  const completedCount = entries.filter((e) => e.status === 'Completed').length;
  const activeFiltersCount = [statusFilter, paymentStatusFilter, billedFilter, assignedToFilter, dateFromFilter, dateToFilter].filter(Boolean).length;

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

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-sm px-4 py-3 sm:px-6 lg:px-10 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-primary text-white flex-shrink-0">
            <Landmark className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold leading-tight text-slate-900">CA Work Management</h1>
            <p className="text-[10px] text-slate-400 hidden sm:block">Chartered Accountancy Office</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Quick Management Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setIsCustOpen(true)}
              title="Add Customer"
              className="p-1.5 sm:p-2 hover:bg-white hover:text-primary rounded-md transition-all text-slate-500 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cust</span>
            </button>
            <button
              onClick={() => setIsMemberOpen(true)}
              title="Add Member"
              className="p-1.5 sm:p-2 hover:bg-white hover:text-primary rounded-md transition-all text-slate-500 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Member</span>
            </button>
            <button
              onClick={() => setIsAreaOpen(true)}
              title="Add Work Area"
              className="p-1.5 sm:p-2 hover:bg-white hover:text-primary rounded-md transition-all text-slate-500 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Area</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg bg-primary px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white transition-opacity hover:opacity-90 flex-shrink-0 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Add Work</span>
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 lg:px-10">

        {/* ── Summary Cards ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="flex flex-col rounded-xl sm:rounded-2xl border border-slate-200/60 bg-white p-2.5 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[9px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Total</p>
              <BarChart2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            </div>
            <p className="text-sm sm:text-2xl font-bold text-slate-900">{loading ? '—' : entries.length.toLocaleString('en-IN')}</p>
            <p className="text-[9px] sm:text-xs text-slate-400 mt-0.5">{filtered.length} matching</p>
          </div>

          <div className="flex flex-col rounded-xl sm:rounded-2xl border border-slate-200/60 bg-white p-2.5 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[9px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending</p>
              <Banknote className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
            </div>
            <p className="text-sm sm:text-2xl font-bold text-slate-900 truncate">
              {loading ? '—' : `₹${totalPending.toLocaleString('en-IN')}`}
            </p>
            <p className="text-[9px] sm:text-xs text-slate-400 mt-0.5">
              {entries.filter((e) => e.paymentStatus === 'Not Received').length} invoices
            </p>
          </div>

          <div className="flex flex-col rounded-xl sm:rounded-2xl border border-slate-200/60 bg-white p-2.5 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[9px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Received</p>
              <Banknote className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
            </div>
            <p className="text-sm sm:text-2xl font-bold text-slate-900 truncate">
              {loading ? '—' : `₹${totalReceived.toLocaleString('en-IN')}`}
            </p>
            <p className="text-[9px] sm:text-xs text-slate-400 mt-0.5">
              {entries.filter((e) => e.paymentStatus === 'Received').length} received
            </p>
          </div>

          <div className="flex flex-col rounded-xl sm:rounded-2xl border border-slate-200/60 bg-white p-2.5 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[9px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Done</p>
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
            </div>
            <p className="text-sm sm:text-2xl font-bold text-slate-900">{loading ? '—' : completedCount}</p>
            <p className="text-[9px] sm:text-xs text-primary mt-0.5">
              {entries.length > 0 ? `${Math.round((completedCount / entries.length) * 100)}%` : '—'} rate
            </p>
          </div>
        </div>

        {/* ── Filters ──────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 rounded-xl sm:rounded-2xl border border-slate-200/60 bg-white p-3 sm:p-4 shadow-sm text-xs">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search customer, work or invoice..."
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm focus:border-primary outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => exportToExcel(filtered)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-[11px] font-bold uppercase tracking-wider transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline">Excel</span>
              </button>
              <button
                onClick={() => exportToPDF(filtered)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-[11px] font-bold uppercase tracking-wider transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-rose-500" />
                <span className="hidden sm:inline">PDF</span>
              </button>
            </div>
            <button
              onClick={() => setShowMobileFilters(f => !f)}
              className={`lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors flex-shrink-0 ${showMobileFilters || activeFiltersCount > 0 ? 'bg-primary text-white border-primary' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          <div className={`${showMobileFilters ? 'flex' : 'hidden'} lg:flex flex-col gap-3`}>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex gap-3">
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

            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
              <CustomSelect
                value={assignedToFilter}
                onChange={(v) => { setAssignedToFilter(v); setCurrentPage(1); }}
                placeholder="Assigned To"
                className="w-full sm:w-auto sm:min-w-[150px]"
                options={members.map((u) => ({ label: u.name, value: u.name }))}
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="date"
                  value={dateFromFilter}
                  onChange={(e) => { setDateFromFilter(e.target.value); setCurrentPage(1); }}
                  className="block flex-1 sm:flex-initial rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs focus:border-primary outline-none text-slate-600"
                />
                <span className="text-slate-400 text-[10px] flex-shrink-0">to</span>
                <input
                  type="date"
                  value={dateToFilter}
                  onChange={(e) => { setDateToFilter(e.target.value); setCurrentPage(1); }}
                  className="block flex-1 sm:flex-initial rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs focus:border-primary outline-none text-slate-600"
                />
              </div>
              <button
                onClick={() => { clearFilters(); setShowMobileFilters(false); }}
                className="w-full sm:w-auto sm:ml-auto flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Filter className="w-3.5 h-3.5" />
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* ── Data ─────────────────────────────────────────────────────── */}
        <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/60 bg-white shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading Data…</span>
            </div>
          ) : paginated.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              No entries found matching your criteria.
            </div>
          ) : (
            <>
              {/* Card List (Mobile/Tablet) */}
              <div className="lg:hidden divide-y divide-slate-100">
                {paginated.map((entry) => (
                  <div
                    key={entry.id}
                    onClick={() => setViewingEntry(entry)}
                    className="flex flex-col gap-2 px-4 py-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-xs truncate">{entry.customerName}</p>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{entry.areaOfWork}{entry.subParticular ? ` · ${entry.subParticular}` : ''}</p>
                      </div>
                      <StatusBadge status={entry.status} />
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                      <div className="flex items-center gap-1.5 grayscale opacity-70">
                        <div className="h-4 w-4 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[8px] font-bold">
                          {entry.assignedToInitials || '—'}
                        </div>
                        <span>{entry.assignedTo}</span>
                      </div>
                      <span className="text-slate-300">·</span>
                      <span>{entry.date}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-3 text-[10px]">
                        <span className="font-mono text-slate-400">{entry.invoiceNo}</span>
                        <span className="font-semibold text-slate-800">₹{entry.amount.toLocaleString('en-IN')}</span>
                      </div>
                      <PaymentBadge status={entry.paymentStatus} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Data Table (Desktop) */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-3 py-2.5 whitespace-nowrap">Date</th>
                      <th className="px-3 py-2.5 whitespace-nowrap">Customer</th>
                      <th className="px-3 py-2.5 whitespace-nowrap">Area</th>
                      <th className="px-3 py-2.5 whitespace-nowrap">Sub Particular</th>
                      <th className="px-3 py-2.5 whitespace-nowrap">Assigned</th>
                      <th className="px-3 py-2.5 whitespace-nowrap">Status</th>
                      <th className="px-3 py-2.5 whitespace-nowrap">Invoice</th>
                      <th className="px-3 py-2.5 whitespace-nowrap">Amount</th>
                      <th className="px-3 py-2.5 whitespace-nowrap">Payment</th>
                      <th className="px-3 py-2.5 text-center whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginated.map((entry) => (
                      <tr
                        key={entry.id}
                        onClick={() => setViewingEntry(entry)}
                        className="bg-white hover:bg-slate-50/80 transition-colors cursor-pointer"
                      >
                        <td className="whitespace-nowrap px-3 py-2 font-medium text-slate-500">{entry.date}</td>
                        <td className="px-3 py-2 font-semibold text-slate-900 max-w-[120px] truncate">{entry.customerName}</td>
                        <td className="px-3 py-2 text-slate-600 max-w-[100px] truncate">{entry.areaOfWork}</td>
                        <td className="px-3 py-2 text-slate-500 max-w-[100px] truncate">{entry.subParticular}</td>
                        <td className="px-3 py-2 text-slate-600 truncate max-w-[100px]">{entry.assignedTo}</td>
                        <td className="px-3 py-2"><StatusBadge status={entry.status} /></td>
                        <td className="px-3 py-2 text-slate-400 font-mono">{entry.invoiceNo}</td>
                        <td className="px-3 py-2 font-bold text-slate-800">₹{entry.amount.toLocaleString('en-IN')}</td>
                        <td className="px-3 py-2"><PaymentBadge status={entry.paymentStatus} /></td>
                        <td className="px-3 py-2 text-center">
                          <div className="flex justify-center gap-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); setEditingEntry(entry); }}
                              className="text-slate-400 hover:text-primary transition-colors p-1"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setDeletingEntry({ id: entry.id, name: entry.customerName }); }}
                              className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Pagination */}
          {!loading && filtered.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 bg-white">
              <p className="text-[10px] text-slate-500 italic">
                {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1 px-2 border border-slate-200 rounded text-[10px] disabled:opacity-30 flex items-center gap-1"
                >
                  <ChevronLeft className="w-3 h-3" /> Prev
                </button>
                <div className="flex gap-0.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-6 h-6 flex items-center justify-center rounded text-[10px] border transition-colors ${currentPage === page ? 'bg-primary text-white border-primary' : 'border-slate-100'}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1 px-2 border border-slate-200 rounded text-[10px] disabled:opacity-30 flex items-center gap-1"
                >
                  Next <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Primary Modals */}
      <AddWorkModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <EditWorkModal entry={editingEntry} onClose={() => setEditingEntry(null)} />
      <DeleteConfirmModal
        entryId={deletingEntry?.id ?? null}
        entryName={deletingEntry?.name ?? ''}
        onClose={() => setDeletingEntry(null)}
      />
      <DetailViewModal entry={viewingEntry} onClose={() => setViewingEntry(null)} />

      {/* Pool Modals */}
      <ManageCustomersModal isOpen={isCustOpen} onClose={() => setIsCustOpen(false)} />
      <ManageMembersModal isOpen={isMemberOpen} onClose={() => setIsMemberOpen(false)} />
      <ManageAreasModal isOpen={isAreaOpen} onClose={() => setIsAreaOpen(false)} />
    </div>
  );
}
