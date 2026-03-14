import express from 'express';
import Student from '../models/student.js';
import AccessLog from '../models/accessLog.js';

const router = express.Router();

// @route   POST /api/students/search
// @desc    Search for student result by NISN and Date of Birth
router.post('/search', async (req, res) => {
  try {
    const { nisn, dob } = req.body;

    if (!nisn || !dob) {
      return res.status(400).json({ success: false, message: 'NISN and Date of Birth are required' });
    }

    // Get client IP
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '0.0.0.0';

    // Try finding by NISN and DOB
    const student = await Student.findOne({ nisn, tgl_lahir: dob });

    if (!student) {
      // Log failed search
      await AccessLog.create({ nisn, status: 'NOT_FOUND', ip });
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }

    // Log successful search
    await AccessLog.create({ nisn, status: student.status, ip });

    res.json({
      success: true,
      data: student
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   POST /api/students/upload
// @desc    Upload multiple students from CSV
router.post('/upload', async (req, res) => {
  try {
    const studentsData = req.body.students;

    if (!studentsData || !Array.isArray(studentsData)) {
      return res.status(400).json({ success: false, message: 'Invalid data format' });
    }

    // Process mapping depending on varied keys
    const processedData = studentsData.map(s => {
      // Find keys case-insensitively
       const getVal = (possibleKeys) => {
          const key = Object.keys(s).find(k => possibleKeys.includes(k.toLowerCase()));
          return key ? s[key] : null;
       };

       const bindo = parseFloat(getVal(['b. indo', 'b.indo', 'bahasa indonesia', 'bindo', 'nilai_bindo'])) || 0;
       const mtk = parseFloat(getVal(['mtk', 'matematika', 'nilai_mtk'])) || 0;
       const bing = parseFloat(getVal(['b. ing', 'b.ing', 'bahasa inggris', 'bing', 'nilai_bing'])) || 0;

       return {
          nisn: getVal(['nisn']),
          nama: getVal(['nama', 'nama siswa']),
          tgl_lahir: getVal(['tanggal lahir', 'tgl lahir', 'tgl_lahir']),
          kelas: getVal(['kelas']) || '',
          nilai_bindo: bindo,
          nilai_mtk: mtk,
          nilai_bing: bing,
          status: (getVal(['status']) || '').toUpperCase()
       };
    }).filter(s => s.nisn && s.tgl_lahir && s.status); // Basic validation filter

    if(processedData.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid records found to save' });
    }

    // Using insertMany with ordered: false to skip duplicates based on unique NISN
    // Or we could use updateOne with upsert depending on requirements.
    // For this case, let's use bulkWrite for upserts
    
    const ops = processedData.map(doc => ({
      updateOne: {
        filter: { nisn: doc.nisn },
        update: { $set: doc },
        upsert: true
      }
    }));

    const result = await Student.bulkWrite(ops);

    res.json({
      success: true,
      message: `${result.upsertedCount + result.modifiedCount} records processed successfully.`,
      result
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
  }
});

export default router;
