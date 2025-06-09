const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Company = require('../Models/Company');
const generateToken = require('../utils/generateToken');
const upload = require('../middleware/uploadMiddleware'); // multer middleware import

// 🔐 Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const company = await Company.findById(decoded.id).select('-password');
    if (!company) return res.status(404).json({ message: 'Company not found' });

    req.company = company;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// 📝 Register Company with Logo Upload
// 📝 Register Company with Logo Upload
router.post('/register', upload.single('logo'), async (req, res) => {
  const { email, password, name, ...otherDetails } = req.body;

  try {
    // Check if company with same email exists
    const existingEmail = await Company.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: 'Company email already exists' });

    // Check if company with same name exists
    const existingName = await Company.findOne({ name });
    if (existingName) return res.status(400).json({ message: 'Company name already exists' });

    const company = new Company({
      email,
      password,
      name,
      ...otherDetails,
      logo: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await company.save();

    res.status(201).json({
      _id: company._id,
      email: company.email,
      message: 'Company registered successfully',
    });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern?.name) {
      return res.status(400).json({ message: 'Company name already exists' });
    }
    if (err.code === 11000 && err.keyPattern?.email) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: err.message || 'Registration failed' });
  }
});

// 🔐 Login Company
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const company = await Company.findOne({ email });

    if (company && (await company.matchPassword(password))) {
      res.json({
        _id: company._id,
        email: company.email,
        name: company.name,
        token: generateToken(company._id), // JWT token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// 👁️ Get logged-in company details (protected)
router.get('/company/details', protect, async (req, res) => {
  try {
    const company = await Company.findById(req.company._id).select('-password');
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    console.error('Error fetching company details:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});
// 📃 Public: Get All Companies (no token required)
router.get('/companies/all', async (req, res) => {
  try {
    const companies = await Company.find().select('-password'); // exclude passwords
    res.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ message: 'Failed to fetch companies' });
  }
});

module.exports = router;