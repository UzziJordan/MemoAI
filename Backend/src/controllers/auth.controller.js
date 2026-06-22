//Imports
const User = require('../models/User');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const brevo = require('../config/email');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const sendWelcomeEmail = async (user) => {
  try {
    const welcomeEmail = await brevo.transactionalEmails.sendTransacEmail({
      subject: 'Welcome to Memo AI!',
      templateId: 7,
      params: {
        NAME: user.name,
      },
      sender: { name: 'MEMO AI', email: 'kpatakousman10@gmail.com' },
      to: [{ email: user.email, name: user.name }],
    });
    console.log('Welcome email sent successfully', welcomeEmail);
  } catch (emailErr) {
    console.error('Error sending welcome email', emailErr.response?.data || emailErr.body || emailErr.message || emailErr);
  }
};


//Register user 

exports.createUser = async (req, res) => {
  try {
    const { email, name, password, googleId } = req.body;

    //create and login with google auth
    if (googleId) {
      if (!email) return res.status(400).json({ message: 'Email is required for Google authentication' });
      let user = await User.findOne({ googleId });
      let isNewGoogleUser = false;

      if (!user) {
        user = new User({ email, name, googleId, isVerified: true });
        await user.save();
        isNewGoogleUser = true;
      }

      if (isNewGoogleUser) {
        await sendWelcomeEmail(user);
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      const { passwordHash: _, ...userwithoutPassword } = user.toObject();
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

      //otp generation for email verification
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      const passwordHash = await bcrypt.hash(password, 10);
      const user = new User({ 
        email, 
        name, 
        passwordHash,
        otp,
        otpExpires
      });

      await user.save();

      try {
        await brevo.transactionalEmails.sendTransacEmail({
          subject: 'Verify your account',
          templateId: 5, // Replace with your actual template ID
          params: {
            NAME: user.name,
            otp: otp
          },
          sender: { name: 'MEMO AI', email: 'kpatakousman10@gmail.com' },
          to: [{ email: user.email, name: user.name }],
        });
      } catch (emailErr) {
        console.error('Error sending verification email', emailErr);
      }

      return res.status(201).json({ 
        message: 'Registration successful. Please check your email for OTP.',
        user: { email: user.email, name: user.name } 
      });

    }
  } catch (err) {
    console.error('Error creating user', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const { passwordHash: _, ...userWithoutPassword } = user.toObject();

    await sendWelcomeEmail(user);

    res.status(200).json({ message: 'Account verified successfully', token, user: userWithoutPassword });
  } catch (err) {
    console.error('Error verifying OTP', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await brevo.transactionalEmails.sendTransacEmail({
      subject: 'Your new verification code',
      templateId: 5, // Replace with your actual template ID
      params: {
        NAME: user.name,
        otp: otp
      },
      sender: { name: 'MEMO AI', email: 'kpatakousman10@gmail.com' },
      to: [{ email: user.email, name: user.name }],
    });

    res.status(200).json({ message: 'OTP resent successfully' });
  } catch (err) {
    console.error('Error resending OTP', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    try {
      await brevo.transactionalEmails.sendTransacEmail({
        subject: 'Reset your password',
        templateId: 5, // Using the same template for OTP for now
        params: {
          NAME: user.name,
          otp: otp
        },
        sender: { name: 'MEMO AI', email: 'kpatakousman10@gmail.com' },
        to: [{ email: user.email, name: user.name }],
      });
    } catch (emailErr) {
      console.error('Error sending forgot password email', emailErr);
    }

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error('Error in forgotPassword', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;
    user.otp = null;
    user.otpExpires = null;
    user.isVerified = true; // Ensure user is verified if they reset password
    await user.save();

    res.status(200).json({ message: 'Password reset successful. You can now login.' });
  } catch (err) {
    console.error('Error in resetPassword', err);
    res.status(500).json({ message: 'Server error' });
  }
};

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
      return res.status(401).json({ message: 'Wrong Email or Password' });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Account not verified. Please verify your email.', unverified: true });
    }

    // If user signed up with Google, they don’t have a password
    if (user.googleId && !user.passwordHash) {
      return res.status(401).json({ message: 'Please login with Google' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Wrong Email or Password' });
    }

    // Create JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

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
        passwordHash: '', // no password for Google users
        isVerified: true
      });

      await sendWelcomeEmail(user);
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
