const Student = require("../models/Student");

// Register new student
const registerStudent = async (req, res) => {
  try {
    console.log("Registration request received:", req.body);
    console.log("File uploaded:", req.file);

    // Check if phone number already exists
    const existingPhone = await Student.findOne({ phone: req.body.phone });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already registered",
      });
    }
    const baseURL = process.env.BASE_URL || "http://localhost:4500";
    const imagePath = req.file ? req.file.filename : "";
    // Check if ID number already exists
    const existingId = await Student.findOne({ idNumber: req.body.idNumber });
    if (existingId) {
      return res.status(400).json({
        success: false,
        message: "ID Number already registered",
      });
    }
    console.log(imagePath);
    console.log(baseURL);
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
      profileImage: `${baseURL}/uploads/${imagePath}` || "",
      studentType: "new",
    };

    const student = new Student(studentData);
    console.log("student", student);
    await student.save();

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      data: {
        id: student._id,
        fullName: student.fullName,
        course: student.course,
        registrationDate: student.registrationDate,
        status: student.status,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const registerStudentPortal = async (req, res) => {
  try {
    console.log("Registration request received:", req.body);
    console.log("File uploaded:", req.file);

    // Check if phone number already exists
    const existingPhone = await Student.findOne({ phone: req.body.phone });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    // Check if ID number already exists
    const existingId = await Student.findOne({ idNumber: req.body.idNumber });
    if (existingId) {
      return res.status(400).json({
        success: false,
        message: "ID Number already registered",
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
      studentType: req.body.studentType,
      courseDuration: req.body.courseDuration,
      profileImage: req.file ? req.file.path : "",
    };

    const student = new Student(studentData);
    await student.save();

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      data: {
        id: student._id,
        fullName: student.fullName,
        course: student.course,
        registrationDate: student.registrationDate,
        status: student.status,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      age,
      weight,
      height,
      sex,
      phone,
      idNumber,
      talent,
      language,
      course,
      studentType,
      courseDuration,
    } = req.body;

    console.log("body", req.body)
    // Find the student
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Update fields
    if (fullName) student.fullName = fullName;
    if (age) student.age = parseInt(age);
    if (weight) student.weight = parseFloat(weight);
    if (height) student.height = parseFloat(height);
    if (sex) student.sex = sex;
    if (phone) student.phone = phone;
    if (idNumber) student.idNumber = idNumber;
    if (talent) student.talent = talent;
    if (language) student.language = language;
    if (course) student.course = course;
    if (studentType) student.studentType = studentType;
    if (courseDuration) student.courseDuration = courseDuration;

    // Handle profile image upload
    if (req.file) {
      student.profileImage = req.file.path;
    }

    await student.save();

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({
      success: false,
      message: "Error updating student",
      error: error.message,
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
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching students",
      error: error.message,
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
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching student",
      error: error.message,
    });
  }
};

// Update student status (approve/reject)
const updateStudentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Student ${status} successfully`,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating student status",
      error: error.message,
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
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting student",
      error: error.message,
    });
  }
};

// Get statistics
const getStatistics = async (req, res) => {
  try {
    const [
      totalStudents,
      maleStudents,
      femaleStudents,
      pendingStudents,
      approvedStudents,
      courseDistribution,
      studentTypeDistribution,
    ] = await Promise.all([
      Student.countDocuments(),
      Student.countDocuments({ sex: "Male" }),
      Student.countDocuments({ sex: "Female" }),
      Student.countDocuments({ status: "pending" }),
      Student.countDocuments({ status: "approved" }),

      Student.aggregate([
        {
          $group: {
            _id: "$course",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            course: "$_id",
            count: 1,
          },
        },
      ]),

      Student.aggregate([
        {
          $group: {
            _id: "$studentType",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    // Convert student type aggregation to object
    const studentTypeStats = {
      new: 0,
      returning: 0,
      graduated: 0,
      experts: 0,
      conducted: 0,
    };

    studentTypeDistribution.forEach((item) => {
      studentTypeStats[item._id] = item.count;
    });

    res.status(200).json({
      success: true,
      data: {
        totalStudents,

        genderDistribution: {
          male: maleStudents,
          female: femaleStudents,
        },

        statusDistribution: {
          pending: pendingStudents,
          approved: approvedStudents,
        },

        courseDistribution,

        studentType: studentTypeStats,
      },
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching statistics",
      error: error.message,
    });
  }
};

module.exports = {
  registerStudent,
  getAllStudents,
  getStudentById,
  updateStudentStatus,
  deleteStudent,
  getStatistics,
  registerStudentPortal,
  updateStudent,
};
