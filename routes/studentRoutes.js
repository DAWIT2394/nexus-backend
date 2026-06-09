const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { validateStudentRegistration } = require('../middleware/validation');
const {
  registerStudent,
  getAllStudents,
  getStudentById,
  updateStudentStatus,
  deleteStudent,
  getStatistics
} = require('../controllers/studentController');

// Public routes
router.post(
  '/register',
  upload.single('profileImage'),
  validateStudentRegistration,
  registerStudent
);

// Admin routes (you might want to add authentication middleware here)
router.get('/students', getAllStudents);
router.get('/students/:id', getStudentById);
router.get('/statistics', getStatistics);
router.put('/students/:id/status', updateStudentStatus);
router.delete('/students/:id', deleteStudent);

module.exports = router;