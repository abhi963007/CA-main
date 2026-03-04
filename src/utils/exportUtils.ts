import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { WorkEntry } from '../types';
import { logoBase64 } from './logo';

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
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Add Black Border/Margin
    doc.setDrawColor(0); // Black
    doc.setLineWidth(0.5);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10); // 5mm padding frame

    // Add Logo
    try {
        doc.addImage(logoBase64, 'PNG', 15, 12, 45, 10);
    } catch (e) {
        console.error('Error adding logo to PDF', e);
    }

    // Header - Company Name
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59); // Slate 800
    doc.text('Abraham & Kurian', 15, 28);

    // Contact Info (Small text at top right)
    doc.setFontSize(8);
    doc.setTextColor(100);
    const rightMargin = doc.internal.pageSize.width - 15;
    doc.text('Thiruvalla: 0469-2601291 | abrahamnkurian@gmail.com', rightMargin, 15, { align: 'right' });
    doc.text('Changanacherry: 0481-2422053 | antony.fca@gmail.com', rightMargin, 20, { align: 'right' });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Work Management Report - Generated on: ${new Date().toLocaleDateString()}`, 15, 36);

    autoTable(doc, {
        startY: 42,
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
            cellPadding: 3,
            halign: 'center'
        },
        bodyStyles: {
            fontSize: 8,
            cellPadding: 2,
            valign: 'middle'
        },
        columnStyles: {
            5: { halign: 'right' }, // Amount column
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        margin: { top: 45, right: 15, bottom: 15, left: 15 },
        styles: { font: 'helvetica' }
    });

    doc.save(`${fileName}.pdf`);
};
