export type WorkStatus =
  | 'Completed'
  | 'Pending Approval'
  | 'Assigned'
  | 'Initiated'
  | 'Document Requested'
  | 'Not Assigned';

export type PaymentStatus = 'Received' | 'Not Received';
export type BilledStatus = 'Yes' | 'No';

export interface WorkEntry {
  id: string;
  date: string;
  customerName: string;
  areaOfWork: string;
  subParticular: string;
  assignedTo: string;
  assignedToInitials: string;
  assignedDate: string;
  status: WorkStatus;
  billed: BilledStatus;
  invoiceNo: string;
  amount: number;
  paymentStatus: PaymentStatus;

  // Additional fields for Edit Modal
  description?: string;
  dueDate?: string;
  priority?: 'Low' | 'Medium' | 'High';
  paymentMode?: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface Member {
  id: string;
  name: string;
  initials: string;
  role?: string;
}

export interface WorkArea {
  id: string;
  name: string;
  subParticulars: string[];
}
