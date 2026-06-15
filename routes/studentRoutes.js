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
  getStatistics,
  updateStudent,
  registerStudentPortal
} = require('../controllers/studentController');
const { login } = require('../controllers/authController');
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
router.put('/students/:id', upload.single('profileImage'), updateStudent);
router.post('/students/portal', upload.single('profileImage'), registerStudentPortal);
router.post('/admin/login',login )

module.exports = router;