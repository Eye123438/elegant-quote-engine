import jsPDF from 'jspdf';
import { Service } from '@/data/services';

interface ClientData {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  notes: string;
}

// Service pricing data (only used internally for PDF generation)
const servicePricing: Record<string, { basePrice: number; currency: string }> = {
  'corporate-website': { basePrice: 45000, currency: 'KES' },
  'small-business-website': { basePrice: 15000, currency: 'KES' },
  'ecommerce-website': { basePrice: 65000, currency: 'KES' },
  'school-management-system': { basePrice: 70000, currency: 'KES' },
  'hospital-management-system': { basePrice: 70000, currency: 'KES' },
  'pos-system': { basePrice: 20000, currency: 'KES' },
  'mpesa-integration': { basePrice: 15000, currency: 'KES' },
  'logo-design': { basePrice: 8000, currency: 'KES' },
  'company-profile': { basePrice: 12000, currency: 'KES' },
};

export async function generateQuotationPDF(service: Service, clientData: ClientData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let y = margin;

  // Colors
  const navyColor: [number, number, number] = [25, 45, 75];
  const goldColor: [number, number, number] = [217, 164, 45];
  const grayColor: [number, number, number] = [100, 100, 100];

  // Generate quote number
  const quoteNumber = `JL-${Date.now().toString(36).toUpperCase()}`;
  const quoteDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  // Header background
  doc.setFillColor(...navyColor);
  doc.rect(0, 0, pageWidth, 55, 'F');

  // Company Logo/Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('JL', margin, 25);
  doc.setFontSize(12);
  doc.text('Software & Digital Systems', margin + 20, 23);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('We Design Websites, Build Software & Power Digital Businesses', margin + 20, 30);

  // Quote info
  doc.setFontSize(10);
  doc.text(`Quotation: ${quoteNumber}`, pageWidth - margin - 50, 20);
  doc.text(`Date: ${quoteDate}`, pageWidth - margin - 50, 27);
  doc.text('Valid for: 30 days', pageWidth - margin - 50, 34);

  // Gold accent line
  doc.setFillColor(...goldColor);
  doc.rect(0, 55, pageWidth, 3, 'F');

  y = 75;

  // QUOTATION title
  doc.setTextColor(...navyColor);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('QUOTATION', margin, y);

  y += 20;

  // Client Details Box
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin, y - 5, (pageWidth - 2 * margin) / 2 - 5, 50, 3, 3, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...navyColor);
  doc.text('PREPARED FOR:', margin + 5, y + 5);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.setFontSize(9);
  doc.text(clientData.fullName, margin + 5, y + 15);
  if (clientData.companyName) {
    doc.text(clientData.companyName, margin + 5, y + 22);
  }
  doc.text(clientData.email, margin + 5, y + 29);
  doc.text(clientData.phone, margin + 5, y + 36);

  // Company Details Box
  const rightBoxX = margin + (pageWidth - 2 * margin) / 2 + 5;
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(rightBoxX, y - 5, (pageWidth - 2 * margin) / 2 - 5, 50, 3, 3, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...navyColor);
  doc.text('PREPARED BY:', rightBoxX + 5, y + 5);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.setFontSize(9);
  doc.text('JL Software & Digital Systems', rightBoxX + 5, y + 15);
  doc.text('Nairobi, Kenya', rightBoxX + 5, y + 22);
  doc.text('info@jlsoftware.co.ke', rightBoxX + 5, y + 29);
  doc.text('+254 700 000 000', rightBoxX + 5, y + 36);

  y += 60;

  // Service Details Section
  doc.setFillColor(...navyColor);
  doc.rect(margin, y, pageWidth - 2 * margin, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('SERVICE DETAILS', margin + 5, y + 7);

  y += 18;

  // Service Name
  doc.setTextColor(...navyColor);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(service.name, margin, y);

  y += 8;

  // Service Description
  doc.setTextColor(...grayColor);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const descLines = doc.splitTextToSize(service.fullDescription, pageWidth - 2 * margin);
  doc.text(descLines, margin, y);
  y += descLines.length * 5 + 5;

  // Delivery Time
  doc.setTextColor(...goldColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Delivery Timeline: ${service.deliveryTime}`, margin, y);

  y += 15;

  // Features Section
  doc.setFillColor(...navyColor);
  doc.rect(margin, y, pageWidth - 2 * margin, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('INCLUDED FEATURES', margin + 5, y + 7);

  y += 18;

  // Features list in 2 columns
  doc.setTextColor(...grayColor);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  const colWidth = (pageWidth - 2 * margin) / 2;
  service.features.forEach((feature, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const xPos = margin + col * colWidth;
    const yPos = y + row * 7;
    
    doc.setTextColor(...goldColor);
    doc.text('✓', xPos, yPos);
    doc.setTextColor(...grayColor);
    doc.text(feature.name, xPos + 6, yPos);
  });

  y += Math.ceil(service.features.length / 2) * 7 + 15;

  // Pricing Section
  const pricing = servicePricing[service.id] || { basePrice: 25000, currency: 'KES' };
  
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 35, 3, 3, 'F');
  
  doc.setTextColor(...navyColor);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('INVESTMENT', margin + 5, y + 10);
  
  doc.setFontSize(22);
  doc.setTextColor(...goldColor);
  doc.text(`${pricing.currency} ${pricing.basePrice.toLocaleString()}`, margin + 5, y + 25);
  
  doc.setFontSize(9);
  doc.setTextColor(...grayColor);
  doc.setFont('helvetica', 'normal');
  doc.text('*Price is subject to project scope and requirements', pageWidth - margin - 80, y + 25);

  y += 45;

  // Terms & Conditions
  if (y < pageHeight - 80) {
    doc.setTextColor(...navyColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('TERMS & CONDITIONS', margin, y);
    
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    const terms = [
      '• 50% deposit required to commence project, 50% upon completion',
      '• Price is valid for 30 days from the date of this quotation',
      '• Delivery timeline begins after deposit payment and project requirements are finalized',
      '• Changes to project scope may affect pricing and delivery timeline',
      '• All intellectual property rights transfer to client upon full payment'
    ];
    terms.forEach((term, i) => {
      doc.text(term, margin, y + i * 5);
    });
  }

  // Footer
  doc.setFillColor(...navyColor);
  doc.rect(0, pageHeight - 25, pageWidth, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text('JL Software & Digital Systems | info@jlsoftware.co.ke | +254 700 000 000', pageWidth / 2, pageHeight - 15, { align: 'center' });
  doc.text('www.jlsoftware.co.ke', pageWidth / 2, pageHeight - 8, { align: 'center' });

  // Signature area
  const sigY = pageHeight - 55;
  doc.setDrawColor(...navyColor);
  doc.line(margin, sigY, margin + 60, sigY);
  doc.line(pageWidth - margin - 60, sigY, pageWidth - margin, sigY);
  
  doc.setTextColor(...grayColor);
  doc.setFontSize(8);
  doc.text('Client Signature', margin, sigY + 5);
  doc.text('Authorized Signature', pageWidth - margin - 60, sigY + 5);

  // Save PDF
  doc.save(`JL-Quotation-${service.name.replace(/\s+/g, '-')}-${quoteNumber}.pdf`);
}
