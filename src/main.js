// src/main.js

/**
 * Timer Settings
 * Fetched from backend dynamically.
 */
let TARGET_DATE = new Date().getTime() + (1000 * 60 * 60 * 24); // Fallback: 1 day in future
let isTimerLoaded = false;

async function loadTimerSettings() {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/settings/announcement_time');
    const json = await res.json();
    if (json.success && json.data) {
      TARGET_DATE = new Date(json.data).getTime();
    }
  } catch (err) {
    console.error('Failed to fetch timer settings, using fallback');
  } finally {
    isTimerLoaded = true;
    updateCountdown(); // force update once loaded
  }
}

// Start fetching immediately
loadTimerSettings();

function updateCountdown() {
  if (!isTimerLoaded) return; // wait until we know the target date

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
