// admin/js/auth-guard.js
// Include this script at the top of every protected admin page.
// It verifies the admin_token in sessionStorage against the backend.

(async function() {
  const token = sessionStorage.getItem('admin_token');

  if (!token) {
    window.location.href = '/admin/login.html';
    return;
  }

  try {
    const res = await fetch('http://127.0.0.1:3000/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    const data = await res.json();

    if (!data.success) {
      sessionStorage.removeItem('admin_token');
      window.location.href = '/admin/login.html';
    }
  } catch (err) {
    // If server is unreachable, don't redirect — just log it.
    // This prevents redirect loops when the backend is loading.
    console.warn('Auth verification failed (server may be starting):', err.message);
  }
})();
