import React from 'react';
import { X } from 'lucide-react';

interface AddWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddWorkModal({ isOpen, onClose }: AddWorkModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px] p-4">
      <div className="bg-white w-full max-w-[680px] rounded-[16px] shadow-2xl overflow-hidden flex flex-col border border-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Add Work</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Left Column */}
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-1 block">Date</span>
                <input type="date" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-primary h-11 px-3 text-sm border outline-none transition-colors" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-1 block">Customer Name</span>
                <input type="text" placeholder="Enter customer name" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-primary h-11 px-3 text-sm border outline-none transition-colors" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-1 block">Area of Work</span>
                <input type="text" placeholder="e.g. Income Tax Return" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-primary h-11 px-3 text-sm border outline-none transition-colors" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-1 block">Sub Particular</span>
                <input type="text" placeholder="Details of the work" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-primary h-11 px-3 text-sm border outline-none transition-colors" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-1 block">Invoice Number</span>
                <input type="text" placeholder="INV-2023-001" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-primary h-11 px-3 text-sm border outline-none transition-colors" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-1 block">Payment Status</span>
                <select className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-primary h-11 px-3 text-sm border outline-none transition-colors">
                  <option value="">Select status</option>
                  <option>Received</option>
                  <option>Not Received</option>
                </select>
              </label>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-1 block">Assigned To</span>
                <input type="text" placeholder="Employee name" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-primary h-11 px-3 text-sm border outline-none transition-colors" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-1 block">Assigned Date</span>
                <input type="date" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-primary h-11 px-3 text-sm border outline-none transition-colors" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-1 block">Status</span>
                <select className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-primary h-11 px-3 text-sm border outline-none transition-colors">
                  <option value="">Select status</option>
                  <option>Assigned</option>
                  <option>Not Assigned</option>
                  <option>Initiated</option>
                  <option>Document Requested</option>
                  <option>Pending for Approval</option>
                  <option>Completed</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-1 block">Billed</span>
                <select className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-primary h-11 px-3 text-sm border outline-none transition-colors">
                  <option value="">Select Yes/No</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-1 block">Amount</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">₹</span>
                  <input type="number" placeholder="0.00" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-primary h-11 pl-8 pr-3 text-sm border outline-none transition-colors" />
                </div>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-1 block">Payment Mode</span>
                <select className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-primary h-11 px-3 text-sm border outline-none transition-colors">
                  <option value="">Select mode</option>
                  <option>Cash</option>
                  <option>Bank Transfer</option>
                  <option>UPI</option>
                </select>
              </label>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={onClose} className="w-full sm:w-32 bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 rounded-lg transition-all shadow-sm">
            Save
          </button>
          <button onClick={onClose} className="w-full sm:w-32 bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2.5 rounded-lg transition-all shadow-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
