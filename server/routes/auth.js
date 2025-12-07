
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory database for users
const users = [
  {
    id: uuidv4(),
    email: 'demo@example.com',
    password: 'password123',
    name: 'Demo User',
    token: uuidv4(),
    createdAt: new Date().toISOString()
  }
];

// In-memory store for OTP codes
const otpCodes = {};

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
  
  const user = users.find(u => u.token === token);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
  
  req.user = user;
  next();
};

// Register endpoint
router.post('/register', (req, res) => {
  const { email, password } = req.body;
  
  // Check if user exists
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  // Create new user
  const newUser = {
    id: uuidv4(),
    email,
    password, // In a real app, this would be hashed
    name: email.split('@')[0],
    token: uuidv4(), // Generate a simple token
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  // Return user data (except password)
  const { password: _, ...userData } = newUser;
  res.status(201).json(userData);
});

// Login endpoint
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Regenerate token
  user.token = uuidv4();
  
  // Return user data (except password)
  const { password: _, ...userData } = user;
  res.json(userData);
});

// Request OTP endpoint
router.post('/request-otp', (req, res) => {
  const { email } = req.body;
  
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store OTP
  otpCodes[email] = {
    code: otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
  };
  
  // In a real app, send email here
  console.log(`OTP for ${email}: ${otp}`);
  
  res.json({ message: 'OTP sent successfully' });
});

// Verify OTP endpoint
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  
  const storedOtp = otpCodes[email];
  
  if (!storedOtp) {
    return res.status(400).json({ message: 'No OTP requested for this email' });
  }
  
  if (storedOtp.expiresAt < new Date()) {
    delete otpCodes[email];
    return res.status(400).json({ message: 'OTP has expired' });
  }
  
  if (storedOtp.code !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }
  
  // OTP is valid, check if user exists
  let user = users.find(u => u.email === email);
  
  if (!user) {
    // Create new user with OTP login
    user = {
      id: uuidv4(),
      email,
      name: email.split('@')[0],
      token: uuidv4(),
      createdAt: new Date().toISOString()
    };
    users.push(user);
  } else {
    // Update token
    user.token = uuidv4();
  }
  
  // Clear OTP
  delete otpCodes[email];
  
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    token: user.token
  });
});

// Get current user endpoint
router.get('/me', isAuthenticated, (req, res) => {
  const { password, ...userData } = req.user;
  res.json(userData);
});

// Logout endpoint
router.post('/logout', isAuthenticated, (req, res) => {
  // In a real app, we would invalidate the token
  // Here we just respond with success
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
