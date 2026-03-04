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
    doc.setTextColor(30, 41, 59); // Slate 800
    doc.text('Abhram and Kurian', 15, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Work Management Report - Generated on: ${new Date().toLocaleDateString()}`, 15, 30);

    autoTable(doc, {
        startY: 38,
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
        headStyles: {
            fillColor: [43, 89, 219],
            fontSize: 9,
            cellPadding: 3
        },
        bodyStyles: {
            fontSize: 8,
            cellPadding: 2
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        margin: { top: 40, right: 15, bottom: 15, left: 15 },
        styles: { font: 'helvetica' }
    });

    doc.save(`${fileName}.pdf`);
};
