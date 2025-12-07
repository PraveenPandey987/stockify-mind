
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PurchaseDetails {
  stockSymbol: string;
  quantity: number;
  price: number;
  amount: number;
  transactionId: string;
  timestamp: string;
  status: string;
}

export const generateReceipt = (purchaseDetails: PurchaseDetails): void => {
  // Create new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Purchase Receipt', 105, 15, { align: 'center' });
  
  // Add logo/header
  doc.setFontSize(12);
  doc.text('StockTrade App', 105, 25, { align: 'center' });
  doc.setDrawColor(0, 0, 0);
  doc.line(20, 30, 190, 30);
  
  // Add transaction details
  doc.setFontSize(12);
  doc.text('Transaction Details', 20, 40);
  
  const formattedDate = new Date(purchaseDetails.timestamp).toLocaleString();
  
  autoTable(doc, {
    startY: 45,
    head: [['Item', 'Details']],
    body: [
      ['Transaction ID', purchaseDetails.transactionId],
      ['Date & Time', formattedDate],
      ['Status', purchaseDetails.status],
    ],
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    margin: { left: 20, right: 20 },
  });
  
  // Add order summary
  const lastY = (doc as any).lastAutoTable.finalY + 10;
  doc.text('Order Summary', 20, lastY);
  
  autoTable(doc, {
    startY: lastY + 5,
    head: [['Item', 'Details']],
    body: [
      ['Stock', purchaseDetails.stockSymbol],
      ['Quantity', `${purchaseDetails.quantity} shares`],
      ['Price per share', `$${purchaseDetails.price.toFixed(2)}`],
      ['Total Amount', `$${purchaseDetails.amount.toFixed(2)}`],
    ],
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    margin: { left: 20, right: 20 },
  });
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text('Thank you for your purchase!', 105, 280, { align: 'center' });
    doc.text(`Page ${i} of ${pageCount}`, 105, 287, { align: 'center' });
  }
  
  // Save the PDF
  doc.save(`Receipt-${purchaseDetails.transactionId}.pdf`);
};
