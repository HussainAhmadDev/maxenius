import toast from 'react-hot-toast';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

import { PDFFormState } from '@/types/PdfProfile';

import PDFDocument from './PDFDocument';

const generatePDF = async (data: PDFFormState) => {
  try {
    const blob = await pdf(<PDFDocument data={data} />).toBlob();
    saveAs(blob, 'Konfigurator.pdf');
    const pdfUrl = URL.createObjectURL(blob);
    window.open(pdfUrl, '_blank');
  } catch (error) {
    toast.error('Failed to generate PDF');
    return null;
  }
};

export default generatePDF;
