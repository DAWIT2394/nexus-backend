const { body, validationResult } = require('express-validator');

const validateStudentRegistration = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Full name must be between 3 and 100 characters'),
  
  body('age')
    .isInt({ min: 15, max: 60 }).withMessage('Age must be between 15 and 60'),
  
  body('weight')
    .isFloat({ min: 30, max: 200 }).withMessage('Weight must be between 30kg and 200kg'),
  
  body('height')
    .isFloat({ min: 120, max: 220 }).withMessage('Height must be between 120cm and 220cm'),
  
  body('sex')
    .isIn(['Male', 'Female']).withMessage('Gender must be either Male or Female'),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[0-9]{10}$/).withMessage('Phone number must be 10 digits'),
  
  body('idNumber')
    .trim()
    .notEmpty().withMessage('ID Number is required')
    .isLength({ min: 5, max: 50 }).withMessage('ID Number must be between 5 and 50 characters'),
  
  body('talent')
    .notEmpty().withMessage('Talent selection is required'),
  
  body('language')
    .notEmpty().withMessage('Language selection is required'),
  
  body('course')
    .notEmpty().withMessage('Course selection is required'),
  
  body('courseDuration')
    .notEmpty().withMessage('Course duration is required'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

module.exports = { validateStudentRegistration };