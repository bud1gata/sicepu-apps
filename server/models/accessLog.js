import mongoose from 'mongoose';

const accessLogSchema = new mongoose.Schema({
  nisn: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['LULUS', 'TIDAK LULUS', 'NOT_FOUND'],
    required: true
  },
  ip: {
    type: String,
    default: '0.0.0.0'
  }
}, {
  timestamps: true // createdAt will be used as the log time
});

const AccessLog = mongoose.model('AccessLog', accessLogSchema);

export default AccessLog;
