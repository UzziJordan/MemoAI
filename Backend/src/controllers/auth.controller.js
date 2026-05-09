//Imports
const User = require('../models/User');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

//Register user 

exports.createUser = async (req, res) => {
    try {
        const {email, name, password, googleId} = req.body;

        //create and login with google auth
        if (googleId) {
            if (!email) return res.status(400).json({ message: 'Email is required for Google authentication' });
            let user = await User.findOne({ googleId });

            if (!user) {
                user = new User({ email, name, googleId });
                await user.save();
            }

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const {passwordHash: _, ...userwithoutPassword} = user.toObject();
            return res.status(200).json({ message: 'User authenticated with Google', token, user: { ...userwithoutPassword } });
        } 
        else {

            //create user with email and password
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }

            if (!password) {
                return res.status(400).json({ message: 'Password is required' });
            }

            const passwordHash = await bcrypt.hash(password, 10);
            const user = new User({ email, name, passwordHash });

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const { passwordHash: _, ...userwithoutPassword } = user.toObject();

            await user.save();

            return res.status(201).json({ message: 'User created successfully', token, user: { ...userwithoutPassword } });

        }
    } catch (err) {
        console.error('Error creating user', err);
        return res.status(500).json({ message: 'Server error' });
    }
}

//Login user with email and password
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // If user signed up with Google, they don’t have a password
    if (user.googleId && !user.passwordHash) {
      return res.status(401).json({ message: 'Please login with Google' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return user without passwordHash
    const { passwordHash: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json({ message: 'Login successful', token, user: userWithoutPassword });

  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

