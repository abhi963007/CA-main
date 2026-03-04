import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { WorkEntry } from '../types';

export const exportToExcel = (data: WorkEntry[], fileName: string = 'CA_Work_Report') => {
    const worksheet = XLSX.utils.json_to_sheet(data.map(entry => ({
        'Date': entry.date,
        'Customer': entry.customerName,
        'Service': entry.areaOfWork,
        'Sub-Particular': entry.subParticular,
        'Assigned To': entry.assignedTo,
        'Status': entry.status,
        'Amount': entry.amount,
        'Payment': entry.paymentStatus,
        'Invoice': entry.invoiceNo,
        'Due Date': entry.dueDate || '—'
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Work Entries');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToPDF = (data: WorkEntry[], fileName: string = 'CA_Work_Report') => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('CA Office Work Report', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    autoTable(doc, {
        startY: 35,
        head: [['Date', 'Customer', 'Service', 'Assigned', 'Status', 'Amount', 'Payment']],
        body: data.map(e => [
            e.date,
            e.customerName,
            e.areaOfWork,
            e.assignedTo,
            e.status,
            `Rs. ${e.amount.toLocaleString('en-IN')}`,
            e.paymentStatus
        ]),
        headStyles: { fillColor: [43, 89, 219] }, // Primary color
        alternateRowStyles: { fillColor: [248, 250, 252] },
        margin: { top: 35 },
    });

    doc.save(`${fileName}.pdf`);
};
