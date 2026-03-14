// src/pdf-generator.js
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('download-btn');
    const printArea = document.getElementById('print-area');
    const actionButtons = document.getElementById('action-buttons');
    
    if (downloadBtn && printArea) {
        downloadBtn.addEventListener('click', async () => {
            try {
                // UI feedback
                const originalText = downloadBtn.innerHTML;
                downloadBtn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Generating PDF...';
                downloadBtn.disabled = true;
                if (window.lucide) window.lucide.createIcons();
                
                // Temporarily hide buttons for the screenshot
                if (actionButtons) actionButtons.style.display = 'none';
                
                // Add a white background temporarily for the PDF readability if preferred
                // but since the user requested dark theme, let's keep the dark theme.
                const originalBackground = printArea.style.background;
                const originalBoxShadow = printArea.style.boxShadow;
                // remove glass blur briefly for clean render
                printArea.style.backdropFilter = "none";
                printArea.style.background = "#1E293B"; // solid dark background
                printArea.style.boxShadow = "none";

                const canvas = await html2canvas(printArea, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#1E293B'
                });
                
                // Restore styles
                printArea.style.backdropFilter = "";
                printArea.style.background = originalBackground;
                printArea.style.boxShadow = originalBoxShadow;
                if (actionButtons) actionButtons.style.display = 'flex';
                
                const imgData = canvas.toDataURL('image/png');
                
                // A4 dimensions at standard 72 DPI are 210x297mm
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });
                
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                
                // Get NISN for filename and QR
                const studentData = sessionStorage.getItem('current_student');
                const student = studentData ? JSON.parse(studentData) : {};
                const nisn = student.nisn || '0000000000';

                // Generate QR code for the SKL
                // We'll insert the QR image via dataurl onto the PDF directly
                import('qrcode').then(QRCode => {
                    QRCode.default.toDataURL(`https://sicepu.contoh.sch.id/verify/${nisn}`, {
                        width: 100,
                        margin: 1,
                        color: {
                            dark:"#000000FF",
                            light:"#FFFFFFFF"
                        }
                    }, function (err, url) {
                        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, Math.min(pdfHeight, pdf.internal.pageSize.getHeight()));
                        
                        // Add QR code at the bottom center or right
                        if (!err) {
                            pdf.addImage(url, 'PNG', 160, 250, 30, 30);
                            pdf.setFontSize(8);
                            pdf.setTextColor(150, 150, 150);
                            pdf.text('Scan for Verification', 160, 285);
                        }
                        
                        pdf.save(`SKL_${nisn}.pdf`);
                        
                        // Restore button
                        downloadBtn.innerHTML = originalText;
                        downloadBtn.disabled = false;
                        if (window.lucide) window.lucide.createIcons();
                    });
                });
                
            } catch (error) {
                console.error('Error generating PDF:', error);
                downloadBtn.innerHTML = '<i data-lucide="alert-triangle"></i> Failed';
                if (window.lucide) window.lucide.createIcons();
                
                setTimeout(() => {
                    downloadBtn.innerHTML = '<i data-lucide="file-down"></i> Download SKL';
                    downloadBtn.disabled = false;
                    if (window.lucide) window.lucide.createIcons();
                }, 3000);
            }
        });
    }
});
