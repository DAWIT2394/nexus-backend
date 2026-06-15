const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [3, 'Full name must be at least 3 characters'],
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [15, 'Minimum age is 15'],
    max: [60, 'Maximum age is 60']
  },
  weight: {
    type: Number,
    required: [true, 'Weight is required'],
    min: [30, 'Weight must be at least 30kg'],
    max: [200, 'Weight cannot exceed 200kg']
  },
  height: {
    type: Number,
    required: [true, 'Height is required'],
    min: [120, 'Height must be at least 120cm'],
    max: [220, 'Height cannot exceed 220cm']
  },
  sex: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Male', 'Female']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  idNumber: {
    type: String,
    required: [true, 'ID Number is required'],
    unique: true,
    trim: true
  },
  talent: {
    type: String,
    required: [true, 'Talent selection is required'],
    enum: ['Catwalk', 'Photography', 'Acting', 'Dancing', 'Singing', 'Fitness', 'None - Willing to Learn']
  },
  language: {
    type: String,
    required: [true, 'Language selection is required'],
    enum: ['Amharic', 'English', 'Oromo', 'Tigrigna', 'Both Amharic & English', 'Other']
  },
  course: {
    type: String,
    required: [true, 'Course selection is required'],
    enum: [
      'High Fashion & Editorial Model',
      'Runway & Catwalk Model',
      'Commercial Model',
      'Photo Model',
      'Fitness Model',
      'Plus Size & Curve Model',
      'Parts Model'
    ]
  },
  courseDuration: {
    type: String,
    required: [true, 'Course duration is required'],
    enum: ['3 Months', '6 Months', '10 Months']
  },
  profileImage: {
    type: String,
    required: [true, 'Profile image is required'],
    default: ''
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  studentType: {
    type: String,
    enum: ['new', 'returning', 'graduated', 'experts', 'conducted'],
    default: 'new'
  },
  registrationFee: {
    type: Number,
    default: 500
  }
}, {
  timestamps: true
});

// Create indexes for unique fields
studentSchema.index({ phone: 1 }, { unique: true });
studentSchema.index({ idNumber: 1 }, { unique: true });

module.exports = mongoose.model('Student', studentSchema);