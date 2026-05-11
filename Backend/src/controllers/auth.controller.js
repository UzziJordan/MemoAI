//Imports
const User = require('../models/User');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


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
                if (existingUser.googleId) {
                    return res.status(400).json({ message: 'Email already exists. Please login with Google.' });
                }
                return res.status(400).json({ message: 'Email already exists' });
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

exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = await User.create({
        email,
        name,
        profileImage: picture,
        googleId,
        passwordHash: '' // no password for Google users
      });
    } else if (!user.googleId) {
      return res.status(400).json({ message: 'Email already exists. Please login with password.' });
    }

    // Create your own JWT for the session
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.profileImage
      }
    });

  } catch (err) {
    console.error('Google auth error:', err);
    res.status(401).json({ message: 'Invalid Google token' });
  }
};