import express from 'express';
import Setting from '../models/setting.js';

const router = express.Router();

// @route   GET /api/settings/:key
// @desc    Get a specific setting by key
router.get('/:key', async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    if (!setting) {
      return res.status(404).json({ success: false, message: 'Setting not found' });
    }
    res.json({ success: true, data: setting.value });
  } catch (error) {
    console.error('Settings GET error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   POST /api/settings/:key
// @desc    Create or update a setting
router.post('/:key', async (req, res) => {
  try {
    const { value } = req.body;
    
    if (value === undefined) {
      return res.status(400).json({ success: false, message: 'Value is required' });
    }

    const setting = await Setting.findOneAndUpdate(
      { key: req.params.key },
      { value },
      { new: true, upsert: true } // Create if doesn't exist
    );

    res.json({ success: true, message: 'Setting updated', data: setting.value });
  } catch (error) {
    console.error('Settings POST error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

export default router;
