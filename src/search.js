// src/search.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('search-form');
  const btn = document.getElementById('submit-btn');
  const btnIcon = document.getElementById('btn-icon');
  const spinnerIcon = document.getElementById('spinner-icon');
  const btnText = document.getElementById('btn-text');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nisn = document.getElementById('nisn').value;
    const dob = document.getElementById('dob').value;

    if (!nisn || !dob) return;

    // Show loading state
    btn.setAttribute('disabled', 'true');
    btnIcon.style.display = 'none';
    spinnerIcon.style.display = 'inline-block';
    btnText.innerText = 'MEMPROSES...';

    // Simulate API Call delay
    setTimeout(() => {
      // Check Local DB instead of Mock Math Logic
      const dbStr = localStorage.getItem('sicepu_students_db');
      if (dbStr) {
          const db = JSON.parse(dbStr);
          // Find student by NISN and Date of Birth
          // Mapping keys to what PapaParse usually gives (or fallback)
          const student = db.find(s => {
              const dbNisn = s['NISN'] || s['nisn'];
              const dbDob = s['Tanggal Lahir'] || s['tgl_lahir'];
              return dbNisn === nisn && dbDob === dob;
          });

          if (student) {
              const statusStr = (student['Status'] || student['status'] || '').toUpperCase();
              if (statusStr === 'LULUS') {
                  // Keep data in sessionStorage to pass it directly to the success page UI
                  sessionStorage.setItem('current_student', JSON.stringify(student));
                  window.location.href = '/result-pass.html';
              } else {
                  window.location.href = '/result-fail.html';
              }
          } else {
             // Not found fallback
             btn.removeAttribute('disabled');
             btnIcon.style.display = 'inline-block';
             spinnerIcon.style.display = 'none';
             btnText.innerText = 'DATA TIDAK DITEMUKAN';
             setTimeout(() => btnText.innerText = 'CEK HASIL', 2000);
          }
      } else {
           // Fallback to simple logic if no DB set yet by admin
          const lastDigit = parseInt(nisn.slice(-1), 10);
          if (!isNaN(lastDigit) && lastDigit % 2 === 0) {
            window.location.href = '/result-pass.html';
          } else {
            window.location.href = '/result-fail.html';
          }
      }
    }, 1500);

  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
});
