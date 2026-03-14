import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  nisn: {
    type: String,
    required: true,
    unique: true
  },
  nama: {
    type: String,
    required: true
  },
  tgl_lahir: {
    type: String,
    required: true
  },
  kelas: {
    type: String
  },
  nilai_bindo: {
    type: Number,
    default: 0
  },
  nilai_mtk: {
    type: Number,
    default: 0
  },
  nilai_bing: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['LULUS', 'TIDAK LULUS']
  }
}, {
  timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
