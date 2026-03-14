// src/main.js

/**
 * Timer Settings
 * If the date is past, the button activates.
 */
const TARGET_DATE = new Date("2026-03-15T10:00:00+07:00").getTime(); // Set to future date to show timer

function updateCountdown() {
  const now = new Date().getTime();
  const distance = TARGET_DATE - now;

  const btnCek = document.getElementById("cek-btn");

  if (distance < 0) {
    // Pengumuman opened
    document.getElementById("days").innerText = "00";
    document.getElementById("hours").innerText = "00";
    document.getElementById("minutes").innerText = "00";
    document.getElementById("seconds").innerText = "00";

    if (btnCek) {
      btnCek.removeAttribute('disabled');
      btnCek.classList.remove('btn-disabled');
    }
    return;
  }

  // Calculate time
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Update DOM
  const updateElem = (id, val) => {
    const el = document.getElementById(id);
    if(el) el.innerText = val < 10 ? '0' + val : val;
  };

  updateElem("days", days);
  updateElem("hours", hours);
  updateElem("minutes", minutes);
  updateElem("seconds", seconds);

  // Disable CTA
  if (btnCek) {
      btnCek.setAttribute('disabled', 'true');
      btnCek.addEventListener('click', (e) => e.preventDefault());
  }
}

// Ensure the code runs when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    updateCountdown();
    // Update the timer every 1 second
    setInterval(updateCountdown, 1000);
});

// Create icons
if (window.lucide) {
    window.lucide.createIcons();
}
