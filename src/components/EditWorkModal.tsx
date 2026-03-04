import React, { useState, useEffect } from 'react';
import { X, FileEdit, Save, AlignLeft, CalendarClock } from 'lucide-react';
import { WorkEntry } from '../types';

interface EditWorkModalProps {
  entry: WorkEntry | null;
  onClose: () => void;
}

export default function EditWorkModal({ entry, onClose }: EditWorkModalProps) {
  const [priority, setPriority] = useState<string>('Medium');
  const [description, setDescription] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');

  useEffect(() => {
    if (entry) {
      setPriority(entry.priority || 'Medium');
      setDescription(entry.description || 'Monthly GST filing for the period of October 2023. All documents received from client via email.');
      setDueDate(entry.dueDate || '2023-11-20');
    }
  }, [entry]);

  if (!entry) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px] p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-white">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl">
              <FileEdit className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold leading-tight tracking-tight text-slate-900">Edit Work</h2>
              <p className="text-xs text-slate-500 font-medium">Update task details for CA Office Management</p>
            </div>
          </div>
          <button onClick={onClose} className="flex items-center justify-center rounded-full h-10 w-10 hover:bg-slate-100 transition-colors text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Form Content */}
        <div className="p-6 space-y-8 overflow-y-auto max-h-[70vh]">
          
          {/* Section 1: General Information */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider flex items-center gap-2">
              <FileEdit className="w-4 h-4" />
              General Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Customer</label>
                <select defaultValue={entry.customerName} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white text-slate-900 focus:ring-2 focus:ring-primary focus:border-primary h-12 px-4 transition-all border outline-none">
                  <option value={entry.customerName}>{entry.customerName}</option>
                  <option value="XYZ Ltd">XYZ Ltd</option>
                  <option value="Global Industries">Global Industries</option>
                </select>
              </div>

              {/* Area/Service Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Area</label>
                <select defaultValue={entry.areaOfWork} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white text-slate-900 focus:ring-2 focus:ring-primary focus:border-primary h-12 px-4 transition-all border outline-none">
                  <option value={entry.areaOfWork}>{entry.areaOfWork}</option>
                  <option value="Income Tax Audit">Income Tax Audit</option>
                  <option value="TDS Return">TDS Return</option>
                  <option value="ROC Compliance">ROC Compliance</option>
                </select>
              </div>

              {/* Status Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Status</label>
                <select defaultValue={entry.status} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white text-slate-900 focus:ring-2 focus:ring-primary focus:border-primary h-12 px-4 transition-all border outline-none">
                  <option value="Draft">Draft</option>
                  <option value="Pending Approval">Pending for Approval</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Amount Input */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₹</span>
                  <input type="text" defaultValue={entry.amount.toLocaleString('en-IN')} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white text-slate-900 focus:ring-2 focus:ring-primary focus:border-primary h-12 pl-8 pr-4 transition-all border outline-none" />
                </div>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 2: Work Details */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider flex items-center gap-2">
              <AlignLeft className="w-4 h-4" />
              Work Details
            </h3>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">Description / Notes</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white text-slate-900 focus:ring-2 focus:ring-primary focus:border-primary p-4 transition-all border outline-none resize-none" 
                placeholder="Enter any specific instructions or notes..." 
                rows={3}
              />
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 3: Scheduling & Priority */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider flex items-center gap-2">
              <CalendarClock className="w-4 h-4" />
              Scheduling & Priority
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Due Date</label>
                <input 
                  type="date" 
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white text-slate-900 focus:ring-2 focus:ring-primary focus:border-primary h-12 px-4 transition-all border outline-none" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Priority Level</label>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setPriority('Low')}
                    className={`flex-1 py-2 px-3 border rounded-xl text-sm font-medium transition-colors ${priority === 'Low' ? 'bg-primary/10 border-primary text-primary font-bold' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'}`}
                  >
                    Low
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setPriority('Medium')}
                    className={`flex-1 py-2 px-3 border rounded-xl text-sm font-medium transition-colors ${priority === 'Medium' ? 'bg-primary/10 border-primary text-primary font-bold' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'}`}
                  >
                    Medium
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setPriority('High')}
                    className={`flex-1 py-2 px-3 border rounded-xl text-sm font-medium transition-colors ${priority === 'High' ? 'bg-primary/10 border-primary text-primary font-bold' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'}`}
                  >
                    High
                  </button>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <footer className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-white">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors">
            Cancel
          </button>
          <button onClick={onClose} className="px-8 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </footer>
      </div>
    </div>
  );
}
