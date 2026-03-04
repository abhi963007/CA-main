import React, { useState, useEffect } from 'react';
import { X, Save, RefreshCw, AlertCircle } from 'lucide-react';
import { subscribeToCustomers, subscribeToMembers, subscribeToWorkAreas } from '../services/dataPools';
import { updateEntry } from '../services/workEntries';
import { WorkEntry, Customer, Member, WorkArea, WorkStatus, PaymentStatus, BilledStatus } from '../types';
import CustomSelect from './CustomSelect';

interface EditWorkModalProps {
  entry: WorkEntry | null;
  onClose: () => void;
}

export default function EditWorkModal({ entry, onClose }: EditWorkModalProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [workAreas, setWorkAreas] = useState<WorkArea[]>([]);

  // Form State
  const [date, setDate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [areaOfWork, setAreaOfWork] = useState('');
  const [subParticular, setSubParticular] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [assignedDate, setAssignedDate] = useState('');
  const [status, setStatus] = useState<WorkStatus>('Not Assigned');
  const [billed, setBilled] = useState<BilledStatus>('No');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Not Received');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [description, setDescription] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [dueDate, setDueDate] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // 1. Snapshot listeners for dropdowns
  useEffect(() => {
    if (!entry) return;
    const unsubCust = subscribeToCustomers(setCustomers);
    const unsubMemb = subscribeToMembers(setMembers);
    const unsubAreas = subscribeToWorkAreas(setWorkAreas);
    return () => { unsubCust(); unsubMemb(); unsubAreas(); };
  }, [entry]);

  // 2. Initialize form when entry changes
  useEffect(() => {
    if (entry) {
      setDate(entry.date || '');
      setCustomerName(entry.customerName || '');
      setAreaOfWork(entry.areaOfWork || '');
      setSubParticular(entry.subParticular || '');
      setAssignedTo(entry.assignedTo || '');
      setAssignedDate(entry.assignedDate || '');
      setStatus(entry.status || 'Not Assigned');
      setBilled(entry.billed || 'No');
      setInvoiceNo(entry.invoiceNo === '—' ? '' : entry.invoiceNo);
      setAmount(entry.amount?.toString() || '');
      setPaymentStatus(entry.paymentStatus || 'Not Received');
      setPriority(entry.priority || 'Medium');
      setDescription(entry.description || '');
      setPaymentMode(entry.paymentMode || '');
      setDueDate(entry.dueDate || '');
    }
  }, [entry]);

  // Derived: Sub Particulars based on selected Area
  const selectedAreaObj = workAreas.find(a => a.name === areaOfWork);
  const subOptions = selectedAreaObj?.subParticulars || [];

  if (!entry) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customerName || !areaOfWork) {
      setError('Please select at least Customer and Work Area');
      return;
    }

    setIsSaving(true);
    setError('');

    const assignedMember = members.find(m => m.name === assignedTo);
    const assignedInitials = assignedMember?.initials || (assignedMember ? assignedMember.name.split(' ').map(n => n[0]).join('').slice(0, 3).toUpperCase() : entry.assignedToInitials);

    try {
      await updateEntry(entry.id, {
        date,
        customerName,
        areaOfWork,
        subParticular,
        assignedTo: assignedTo || 'Unassigned',
        assignedToInitials: assignedInitials,
        assignedDate,
        status,
        billed,
        invoiceNo: invoiceNo || '—',
        amount: Number(amount) || 0,
        paymentStatus,
        priority,
        description,
        paymentMode,
        dueDate
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update work entry');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px] p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">

        {/* Header */}
        <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Edit Work Task</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Modify task and assignment details</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[75vh] space-y-8">

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-rose-600 text-sm font-medium">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Section 1: Basic Info */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-primary"></span>
              Work Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Entry Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 py-2.5 px-3 text-sm focus:bg-white focus:border-primary outline-none transition-all border" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Due Date</label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 py-2.5 px-3 text-sm focus:bg-white focus:border-primary outline-none transition-all border" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Customer Name *</label>
                <CustomSelect
                  value={customerName}
                  onChange={setCustomerName}
                  placeholder="Choose Customer..."
                  options={customers.map(c => ({ label: c.name, value: c.name }))}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Area of Work *</label>
                <CustomSelect
                  value={areaOfWork}
                  onChange={(v) => { setAreaOfWork(v); setSubParticular(''); }}
                  placeholder="Select Service..."
                  options={workAreas.map(a => ({ label: a.name, value: a.name }))}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Sub Particular</label>
                <CustomSelect
                  value={subParticular}
                  onChange={setSubParticular}
                  placeholder={areaOfWork ? "Choose Sub..." : "Select Area First"}
                  options={subOptions.map(s => ({ label: s, value: s }))}
                />
              </div>
            </div>
          </section>

          {/* Section 2: Assignment & Status */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-green-400"></span>
              Execution & Billing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Assigned To</label>
                <CustomSelect
                  value={assignedTo}
                  onChange={setAssignedTo}
                  placeholder="Select Member..."
                  options={members.map(m => ({ label: m.name, value: m.name }))}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Status</label>
                <CustomSelect
                  value={status}
                  onChange={(v) => setStatus(v as WorkStatus)}
                  placeholder="Select Status..."
                  options={[
                    { label: 'Assigned', value: 'Assigned' },
                    { label: 'Not Assigned', value: 'Not Assigned' },
                    { label: 'Initiated', value: 'Initiated' },
                    { label: 'Document Requested', value: 'Document Requested' },
                    { label: 'Pending Approval', value: 'Pending Approval' },
                    { label: 'Completed', value: 'Completed' },
                  ]}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Billed</label>
                  <CustomSelect
                    value={billed}
                    onChange={v => setBilled(v as BilledStatus)}
                    placeholder="..."
                    options={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Amount (₹)</label>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" className="w-full rounded-xl border-slate-200 bg-slate-50 py-2 px-3 text-sm focus:bg-white focus:border-primary outline-none transition-all border" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Payment Status</label>
                <CustomSelect
                  value={paymentStatus}
                  onChange={v => setPaymentStatus(v as PaymentStatus)}
                  placeholder="..."
                  options={[{ label: 'Received', value: 'Received' }, { label: 'Not Received', value: 'Not Received' }]}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Invoice No</label>
                <input type="text" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} placeholder="INV/..." className="w-full rounded-xl border-slate-200 bg-slate-50 py-2.5 px-3 text-sm focus:bg-white focus:border-primary outline-none transition-all border font-mono" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Priority</label>
                <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                  {['Low', 'Medium', 'High'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p as any)}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${priority === p ? 'bg-white shadow-sm text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Payment Mode</label>
                <CustomSelect
                  value={paymentMode}
                  onChange={setPaymentMode}
                  placeholder="Select mode..."
                  options={[
                    { label: 'UPI', value: 'UPI' },
                    { label: 'Bank Transfer', value: 'Bank Transfer' },
                    { label: 'Cash', value: 'Cash' },
                    { label: 'Cheque', value: 'Cheque' },
                  ]}
                />
              </div>
            </div>
          </section>

          <section>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Additional Notes</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              placeholder="Enter special instructions..."
              className="w-full rounded-xl border-slate-200 bg-slate-50 py-2.5 px-3 text-sm focus:bg-white focus:border-primary outline-none transition-all border resize-none"
            />
          </section>
        </form>

        {/* Footer */}
        <footer className="px-6 py-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-slate-400 hover:bg-slate-50 rounded-xl transition-all"
          >
            Discard
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-8 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-primary/20 flex items-center gap-2"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? 'Updating...' : 'Save Changes'}
          </button>
        </footer>
      </div>
    </div>
  );
}
