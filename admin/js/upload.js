// admin/js/upload.js

document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const previewContainer = document.getElementById('preview-container');
    const previewBody = document.getElementById('preview-body');
    const rowCount = document.getElementById('row-count');
    const uploadStatus = document.getElementById('upload-status');
    const downloadTemplateBtn = document.getElementById('download-template');
    const saveDataBtn = document.getElementById('save-data-btn');

    let parsedData = [];

    // --- Drag and Drop Events ---
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
    });

    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    });

    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });

    // --- File Handling ---
    function handleFiles(files) {
        if (files.length === 0) return;
        
        const file = files[0];
        
        // Check if CSV
        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            showStatus('Error: Harap unggah file berformat CSV.', 'danger');
            return;
        }

        showStatus(`Sedang memproses ${file.name}...`, 'info');

        // Use PapaParse to parse the CSV
        // We assume the CSV has a header row
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                if(results.errors.length > 0) {
                     showStatus(`Parsing Error: ${results.errors[0].message}`, 'danger');
                     return;
                }
                
                parsedData = results.data;
                renderPreview(parsedData);
                showStatus(`Berhasil membaca ${parsedData.length} data. Periksa preview di bawah sebelum menyimpan.`, 'success');
            },
            error: function(err) {
                showStatus(`Gagal membaca file: ${err.message}`, 'danger');
            }
        });
    }

    // --- Render Table ---
    function renderPreview(data) {
        previewBody.innerHTML = '';
        rowCount.innerText = data.length;
        
        // Only show first 100 rows for preview performance
        const previewLimit = Math.min(data.length, 100);
        
        for (let i = 0; i < previewLimit; i++) {
            const row = data[i];
            const tr = document.createElement('tr');
            
            // Map CSV columns securely. Fallback to empty string if column doesn't match perfectly.
            const nisn = row['NISN'] || row['nisn'] || '-';
            const nama = row['Nama Siswa'] || row['nama'] || row['Nama'] || '-';
            const tgl = row['Tanggal Lahir'] || row['tgl_lahir'] || '-';
            const kelas = row['Kelas'] || row['kelas'] || '-';
            const bind = row['B. Indonesia'] || row['bind'] || '-';
            const mtk = row['Matematika'] || row['mtk'] || '-';
            const bing = row['B. Inggris'] || row['bing'] || '-';
            const status = (row['Status'] || row['status'] || '').toString().toUpperCase();
            
            let statusBadge = `<span class="badge badge-success">LULUS</span>`;
            if(status === 'TIDAK LULUS' || status === 'GAGAL' || status === 'TIDAK') {
                statusBadge = `<span class="badge badge-danger">TIDAK LULUS</span>`;
            }

            tr.innerHTML = `
                <td>${nisn}</td>
                <td>${nama}</td>
                <td>${tgl}</td>
                <td>${kelas}</td>
                <td>${bind}</td>
                <td>${mtk}</td>
                <td>${bing}</td>
                <td>${statusBadge}</td>
            `;
            previewBody.appendChild(tr);
        }
        
        if(data.length > 100) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="8" style="text-align:center; color: var(--color-text-muted); padding: 1rem;">... and ${data.length - 100} more rows</td>`;
            previewBody.appendChild(tr);
        }

        previewContainer.style.display = 'block';
    }

    // --- Helper UI ---
    function showStatus(message, type) {
        uploadStatus.style.display = 'block';
        uploadStatus.innerText = message;
        
        uploadStatus.style.background = 'rgba(255,255,255,0.1)';
        uploadStatus.style.color = 'var(--color-text)';
        uploadStatus.style.border = '1px solid var(--color-border)';

        if(type === 'success') {
            uploadStatus.style.background = 'rgba(22, 163, 74, 0.2)';
            uploadStatus.style.color = 'var(--color-success)';
            uploadStatus.style.borderColor = 'var(--color-success)';
        } else if (type === 'danger') {
            uploadStatus.style.background = 'rgba(220, 38, 38, 0.2)';
            uploadStatus.style.color = 'var(--color-danger)';
            uploadStatus.style.borderColor = 'var(--color-danger)';
        }
    }

    // --- Template Generation ---
    downloadTemplateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Create an example CSV
        const csvContent = "NISN,Nama Siswa,Tanggal Lahir,Kelas,B. Indonesia,Matematika,B. Inggris,Status\n" +
                           "0012345678,Ahmad Rizky Pratama,2007-05-14,XII IPA 1,85,78,82,LULUS\n" +
                           "0056781234,Budi Santoso,2007-11-20,XII IPS 2,75,65,70,TIDAK LULUS";
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "Template_Data_Kelulusan.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // --- Mock Save to Database ---
    saveDataBtn.addEventListener('click', () => {
        if(parsedData.length === 0) return;
        
        saveDataBtn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Menyimpan...';
        saveDataBtn.disabled = true;
        lucide.createIcons();

        fetch('http://127.0.0.1:3000/api/students/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ students: parsedData })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showStatus(data.message || 'Data berhasil disave dan sinkronisasi selesai.', 'success');
                saveDataBtn.innerHTML = '<i data-lucide="check" size="16"></i> Berhasil';
            } else {
                showStatus(data.message || 'Gagal menyimpan data ke server.', 'danger');
                saveDataBtn.innerHTML = '<i data-lucide="x" size="16"></i> Gagal';
            }
            setTimeout(() => {
                saveDataBtn.innerHTML = '<i data-lucide="save" size="16"></i> Simpan ke Database';
                saveDataBtn.disabled = false;
                lucide.createIcons();
            }, 3000);
        })
        .catch(err => {
            showStatus('Error: ' + err.message, 'danger');
            saveDataBtn.innerHTML = '<i data-lucide="alert-circle" size="16"></i> Error';
            setTimeout(() => {
                saveDataBtn.innerHTML = '<i data-lucide="save" size="16"></i> Simpan ke Database';
                saveDataBtn.disabled = false;
                lucide.createIcons();
            }, 3000);
        });
    });
});
