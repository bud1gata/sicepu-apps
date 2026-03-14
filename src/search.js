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

    fetch('http://127.0.0.1:3000/api/students/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nisn, dob })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.data) {
        const student = data.data;
        if (student.status === 'LULUS') {
          sessionStorage.setItem('current_student', JSON.stringify(student));
          window.location.href = '/result-pass.html';
        } else {
          window.location.href = '/result-fail.html';
        }
      } else {
        btn.removeAttribute('disabled');
        btnIcon.style.display = 'inline-block';
        spinnerIcon.style.display = 'none';
        btnText.innerText = 'DATA TIDAK DITEMUKAN';
        setTimeout(() => btnText.innerText = 'CEK HASIL', 2000);
      }
    })
    .catch(err => {
        console.error(err);
        btn.removeAttribute('disabled');
        btnIcon.style.display = 'inline-block';
        spinnerIcon.style.display = 'none';
        btnText.innerText = 'TERJADI KESALAHAN';
        setTimeout(() => btnText.innerText = 'CEK HASIL', 2000);
    });

  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
});
