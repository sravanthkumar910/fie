const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  creator: {
    type: String, // Or mongoose.Schema.Types.ObjectId if using Refs
    required: true
  },
  creatorEmail: { 
    type: String 
  },
  project: {
    type: String, 
    required: true
  },
  amount: {
    type: Number, // Changed to Number for easier calculations later
    required: true
  },
  status: {
    type: String,
    enum: ['Completed', 'Pending', 'Processing', 'Failed'],
    default: 'Pending'
  },
  date: {
    type: Date, // Better to use Date type than String
    default: Date.now
  },
  method: {
    type: String,
    enum: ['Bank Transfer', 'PayPal'],
    default: 'Bank Transfer'
  },
  note: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);