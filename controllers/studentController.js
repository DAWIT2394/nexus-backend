const Student = require('../models/Student');

// Register new student
const registerStudent = async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    console.log('File uploaded:', req.file);

    // Check if phone number already exists
    const existingPhone = await Student.findOne({ phone: req.body.phone });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number already registered'
      });
    }

    // Check if ID number already exists
    const existingId = await Student.findOne({ idNumber: req.body.idNumber });
    if (existingId) {
      return res.status(400).json({
        success: false,
        message: 'ID Number already registered'
      });
    }

    // Create new student
    const studentData = {
      fullName: req.body.fullName,
      age: parseInt(req.body.age),
      weight: parseFloat(req.body.weight),
      height: parseFloat(req.body.height),
      sex: req.body.sex,
      phone: req.body.phone,
      idNumber: req.body.idNumber,
      talent: req.body.talent,
      language: req.body.language,
      course: req.body.course,
      courseDuration: req.body.courseDuration,
      profileImage: req.file ? req.file.path : ''
    };

    const student = new Student(studentData);
    await student.save();

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: {
        id: student._id,
        fullName: student.fullName,
        course: student.course,
        registrationDate: student.registrationDate,
        status: student.status
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all students (with pagination)
const getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const students = await Student.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Student.countDocuments();

    res.status(200).json({
      success: true,
      data: students,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
};

// Get single student by ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student',
      error: error.message
    });
  }
};

// Update student status (approve/reject)
const updateStudentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Student ${status} successfully`,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating student status',
      error: error.message
    });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student',
      error: error.message
    });
  }
};

// Get statistics
const getStatistics = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const maleStudents = await Student.countDocuments({ sex: 'Male' });
    const femaleStudents = await Student.countDocuments({ sex: 'Female' });
    const pendingStudents = await Student.countDocuments({ status: 'pending' });
    const approvedStudents = await Student.countDocuments({ status: 'approved' });
    
    // Course-wise distribution
    const courseDistribution = await Student.aggregate([
      { $group: { _id: '$course', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        genderDistribution: { male: maleStudents, female: femaleStudents },
        statusDistribution: { pending: pendingStudents, approved: approvedStudents },
        courseDistribution
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

module.exports = {
  registerStudent,
  getAllStudents,
  getStudentById,
  updateStudentStatus,
  deleteStudent,
  getStatistics
};