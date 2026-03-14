import mongoose from 'mongoose';
import Student from './server/models/student.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://bud1gata:root@budilab.2y4qrf6.mongodb.net/?appName=budilab')
  .then(async () => {
    console.log('Connected to DB');
    const testStudent = {
      nisn: '1234567890',
      nama: 'Budi Santoso',
      tgl_lahir: '2005-05-15',
      kelas: 'XII IPA 1',
      nilai_bindo: 88,
      nilai_mtk: 92,
      nilai_bing: 85,
      status: 'LULUS'
    };
    await Student.findOneAndUpdate({ nisn: testStudent.nisn }, testStudent, { upsert: true });
    
    const failStudent = {
      nisn: '0987654321',
      nama: 'Joko Widodo',
      tgl_lahir: '2005-06-20',
      kelas: 'XII IPS 2',
      nilai_bindo: 60,
      nilai_mtk: 50,
      nilai_bing: 55,
      status: 'TIDAK LULUS'
    };
    await Student.findOneAndUpdate({ nisn: failStudent.nisn }, failStudent, { upsert: true });

    console.log('Test students added! 1234567890 / 2005-05-15 (LULUS) and 0987654321 / 2005-06-20 (TIDAK LULUS)');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
