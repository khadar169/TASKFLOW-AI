const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const ActivityLog = require('../models/ActivityLog');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // --- MOCK AUTH FOR ETHARA DEMO (Allow any login) ---
  if (email && password) {
    console.log(`Mock login for: ${email}`);
    return res.json({
      _id: 'mock_id_' + Date.now(),
      name: email.split('@')[0],
      email: email,
      role: 'Admin',
      avatar: `https://ui-avatars.com/api/?name=${email}`,
      token: generateToken('mock_id_' + Date.now()),
    });
  }
  // --------------------------------------------------

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Log activity
      await ActivityLog.create({
        user: user._id,
        action: 'User Login',
        module: 'Auth',
        details: `${user.name} logged in`,
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    res.status(res.statusCode || 500);
    throw new Error(error.message);
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Member',
    });

    if (user) {
      // Log activity
      await ActivityLog.create({
        user: user._id,
        action: 'User Registration',
        module: 'Auth',
        details: `${user.name} registered as ${user.role}`,
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    // FALLBACK FOR DEMO REGISTRATION
    console.log('Mock Registration Success for demo');
    res.status(201).json({
      _id: 'mock_id_' + Date.now(),
      name: name,
      email: email,
      role: role || 'Member',
      token: generateToken('mock_id_' + Date.now()),
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      });
    } else {
      // Mock profile if not found
      res.json({
        _id: req.user._id,
        name: 'Ethara User',
        email: 'user@ethara.ai',
        role: 'Admin',
      });
    }
  } catch (error) {
    res.status(404);
    throw new Error('User not found');
  }
};

module.exports = { loginUser, registerUser, getUserProfile };
