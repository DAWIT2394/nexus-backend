const jwt = require('jsonwebtoken');

// Admin login controller
const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Validate inputs
    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide phone number and password',
      });
    }

    const adminPhone = process.env.ADMIN_PHONE;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Check if the phone and password match the admin credentials in env
    if (phone !== adminPhone || password !== adminPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or password',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { role: 'admin' },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        phone: adminPhone,
        role: 'admin',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

module.exports = {
  login,
};
