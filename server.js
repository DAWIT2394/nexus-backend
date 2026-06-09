const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/database');
const studentRoutes = require('./routes/studentRoutes');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', studentRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Modeling School API is running',
    version: '1.0.0',
    endpoints: {
      register: 'POST /api/register',
      students: 'GET /api/students',
      student: 'GET /api/students/:id',
      status: 'PUT /api/students/:id/status',
      delete: 'DELETE /api/students/:id',
      statistics: 'GET /api/statistics'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 API URL: db done${PORT}/api`);
});