import express from 'express';
import crypto from 'crypto';
import Admin from '../models/admin.js';

const router = express.Router();

// In-memory token store (simple approach for this app)
// In production, use JWT or server-side sessions
const activeSessions = new Map();

// @route   POST /api/auth/login
// @desc    Authenticate admin and return a token
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username dan password wajib diisi' });
    }

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Username atau password salah' });
    }

    if (!admin.verifyPassword(password)) {
      return res.status(401).json({ success: false, message: 'Username atau password salah' });
    }

    // Generate session token
    const token = crypto.randomBytes(32).toString('hex');
    activeSessions.set(token, {
      adminId: admin._id.toString(),
      username: admin.username,
      createdAt: Date.now()
    });

    res.json({
      success: true,
      message: 'Login berhasil',
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   POST /api/auth/verify
// @desc    Verify if a token is valid
router.post('/verify', (req, res) => {
  const { token } = req.body;

  if (!token || !activeSessions.has(token)) {
    return res.status(401).json({ success: false, message: 'Token tidak valid' });
  }

  const session = activeSessions.get(token);
  
  // Expire tokens after 24 hours
  if (Date.now() - session.createdAt > 24 * 60 * 60 * 1000) {
    activeSessions.delete(token);
    return res.status(401).json({ success: false, message: 'Sesi telah berakhir' });
  }

  res.json({ success: true, username: session.username });
});

// @route   POST /api/auth/logout
// @desc    Invalidate a token
router.post('/logout', (req, res) => {
  const { token } = req.body;
  if (token) activeSessions.delete(token);
  res.json({ success: true, message: 'Logged out' });
});

export default router;
