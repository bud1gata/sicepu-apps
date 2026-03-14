import express from 'express';
import Student from '../models/student.js';
import AccessLog from '../models/accessLog.js';

const router = express.Router();

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalLulus = await Student.countDocuments({ status: 'LULUS' });
    const totalTidakLulus = await Student.countDocuments({ status: 'TIDAK LULUS' });

    // Count unique NISNs that have been searched (checked)
    const checkedNisns = await AccessLog.distinct('nisn', { status: { $ne: 'NOT_FOUND' } });
    const sudahCek = checkedNisns.length;
    const belumCek = Math.max(totalStudents - sudahCek, 0);

    const passRate = totalStudents > 0 ? Math.round((totalLulus / totalStudents) * 100) : 0;

    res.json({
      success: true,
      data: {
        totalStudents,
        totalLulus,
        totalTidakLulus,
        sudahCek,
        belumCek,
        passRate
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   GET /api/dashboard/logs
// @desc    Get recent access logs (last 20)
router.get('/logs', async (req, res) => {
  try {
    const logs = await AccessLog.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.json({ success: true, data: logs });
  } catch (error) {
    console.error('Logs error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   GET /api/dashboard/hourly
// @desc    Get hourly access chart data for today
router.get('/hourly', async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const hourlyData = await AccessLog.aggregate([
      { $match: { createdAt: { $gte: todayStart, $lte: todayEnd } } },
      {
        $group: {
          _id: { $hour: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill all 24 hours
    const hours = Array.from({ length: 24 }, (_, i) => {
      const found = hourlyData.find(h => h._id === i);
      return { hour: i, count: found ? found.count : 0 };
    });

    res.json({ success: true, data: hours });
  } catch (error) {
    console.error('Hourly error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

export default router;
