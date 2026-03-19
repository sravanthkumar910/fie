const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Planning', 'Draft', 'Live', 'Review', 'Completed'],
    default: 'Planning'
  },
  platforms: {
    type: String
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  budget: {
    type: String,
    default: '$0'
  },
  deadline: {
    type: String,
    default: 'TBD'
  },
  description: {
    type: String,
    default: ''
  },
  deliverables: {
    type: [String],
    default: []
  },
  creators: [{
    name: { type: String },
    email: { type: String }
  }],
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);