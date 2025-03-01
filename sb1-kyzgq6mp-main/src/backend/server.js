const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
// Make sure to set this in your .env file or deployment environment
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is not set!');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// User Model
const User = mongoose.model('User', userSchema);

// Routes
app.post('/api/users', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({ success: true, message: 'Email already exists' });
    }
    
    // Create new user
    const user = new User({ email });
    await user.save();
    
    res.status(201).json({ success: true, message: 'Email saved successfully' });
  } catch (error) {
    console.error('Error saving email:', error);
    res.status(500).json({ success: false, error: 'Server error. Please try again later.' });
  }
});

// Get all emails (admin route - should be protected in production)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('email createdAt -_id').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('dist'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));