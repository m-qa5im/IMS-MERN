import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import dotenv from 'dotenv';
dotenv.config();

// REGISTER
export const register = async (req, res) => {
  const { firstname, lastname, email, phoneno, password } = req.body;

  if (!firstname || !lastname || !email || !phoneno || !password) {
    return res.status(400).json({ Success: false, message: "Please fill all the fields" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ Success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      firstname,
      lastname,
      email,
      phoneno,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',  // true only in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    // ✉️ Send Welcome Email
    const welcomeMail = {
      from: {
        name: 'Inventory Management System',
        address: process.env.SENDER_EMAIL,
      },
      to: email,
      subject: 'Welcome to Inventory Management System',
      html: `
                <div style="font-family: sans-serif; background: #fff; padding: 20px;">
                    <h2>Welcome, ${firstname} ${lastname}!</h2>
                    <p>Thank you for registering with us. We're excited to have you onboard!</p>
                    <p>Start managing your inventory more efficiently with our powerful tools.</p>
                    <p>Best regards,<br>Team Inventory Management System</p>
                </div>
            `
    };
    await transporter.sendMail(welcomeMail);

    // 🔐 Generate OTP and send Verification Email
    const Otp = String(Math.floor(100000 + Math.random() * 900000));
    newUser.verifyOTP = Otp;
    newUser.verifyOTPExpireAt = Date.now() + 5 * 60 * 1000; // expires in 5 mins
    await newUser.save();

    const otpMail = {
      from: {
        name: 'Inventory Management System',
        address: process.env.SENDER_EMAIL,
      },
      to: email,
      subject: 'Verify Your Account - OTP',
      html: `
                <div style="font-family: sans-serif; background: #fff; padding: 20px;">
                    <h2>Hello ${firstname} ${lastname},</h2>
                    <p>Your OTP for account verification is:</p>
                    <h1 style="color: #2ecc71;">${Otp}</h1>
                    <p>This code will expire in <strong>5 minutes</strong>. Do not share it with anyone.</p>
                    <p>If you did not register, please ignore this email.</p>
                    <p>Best regards,<br>Team Inventory Management System</p>
                </div>
            `
    };
    await transporter.sendMail(otpMail);

    return res.status(201).json({ Success: true, message: "Registration successful, OTP sent" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ Success: false, message: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ Success: false, message: "Please fill all the fields" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ Success: false, message: "User not found" });
    }

    // ❗️Check the correct field here
    if (!user.isAccountVerified) {
      return res.status(403).json({ Success: false, message: "Please verify your email first" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ Success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      Success: true,
      message: "Login successful",
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
      }
    });


  } catch (error) {
    console.error(error);
    return res.status(500).json({ Success: false, message: error.message });
  }
};



// LOGOUT
export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
    return res.status(200).json({ Success: true, message: "Logout successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ Success: false, message: error.message });
  }
};

// SEND VERIFY OTP
export const sendVerifyOtp = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ Success: false, message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({ Success: false, message: "Account already verified" });
    }

    const Otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOTP = Otp;
    user.verifyOTPExpireAt = Date.now() + 5 * 60 * 1000; // 5 minutes from now
    await user.save();

    const mailOptions = {
      from: {
        name: 'Inventory Management System',
        address: process.env.SENDER_EMAIL,
      },
      to: user.email,
      subject: 'Account Verification OTP',
      text: `Hello ${user.firstname} ${user.lastname},

Your OTP for account verification is: ${Otp}

This OTP will expire in 5 minutes.

Best regards,
Team Inventory Management System`,
      html: `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f6f8;
          padding: 20px;
          margin: 0;
        }
        .container {
          max-width: 600px;
          margin: auto;
          background-color: #ffffff;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .otp {
          font-size: 24px;
          font-weight: bold;
          color: #27ae60;
          margin: 20px 0;
        }
        .footer {
          margin-top: 30px;
          font-size: 14px;
          color: #888;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Hello ${user.firstname} ${user.lastname},</h2>
        <p>Thank you for registering with us! Please use the following OTP to verify your account:</p>
        <p class="otp">${Otp}</p>
        <p><strong>Note:</strong> This OTP is valid for <strong>5 minutes</strong>. Do not share this code with anyone.</p>
        <p>If you did not initiate this action, please ignore this email or contact support.</p>
        <div class="footer">
          Best regards,<br/>
          Team Inventory Management System
        </div>
      </div>
    </body>
  </html>
  `
    };


    await transporter.sendMail(mailOptions);

    res.json({ Success: true, message: "OTP sent to your email" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ Success: false, message: error.message });
  }
};

// VERIFY EMAIL
export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const { id: userId } = req.user;

  if (!userId || !otp) {
    return res.status(400).json({ Success: false, message: "Please provide OTP" });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ Success: false, message: "User not found" });
    }

    if (user.verifyOTP !== otp) {
      return res.status(400).json({ Success: false, message: "Invalid OTP" });
    }

    if (user.verifyOTPExpireAt < Date.now()) {
      return res.status(400).json({ Success: false, message: "OTP expired" });
    }

    user.isAccountVerified = true;
    user.verifyOTP = '';
    user.verifyOTPExpireAt = 0;
    await user.save();

    return res.json({ Success: true, message: "Account verified successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ Success: false, message: error.message });
  }
};


export const isAuthenticated = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select('-password');
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const sendResetPasswordOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ Success: false, message: "Please provide email" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ Success: false, message: "User not found" });
    }
    const Otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOTP = Otp;
    user.resetOTPExpireAt = Date.now() + 5 * 60 * 1000; // 5 minutes from now
    await user.save();
    const mailOptions = {
      from: {
        name: 'Inventory Management System',
        address: process.env.SENDER_EMAIL,
      },
      to: user.email,
      subject: 'Reset Password OTP',
      text: `Hello ${user.firstname} ${user.lastname},\n\nYour OTP is: ${Otp}\n\nThis OTP will expire in 5 minutes.\n\nBest regards,\nTeam Inventory Management System`,
      html: `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f6f8;
          padding: 20px;
          margin: 0;
        }
        .container {
          max-width: 600px;
          margin: auto;
          background-color: #ffffff;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .otp {
          font-size: 24px;
          font-weight: bold;
          color: #2e86de;
          margin: 20px 0;
        }
        .footer {
          margin-top: 30px;
          font-size: 14px;
          color: #888;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Hello ${user.firstname} ${user.lastname},</h2>
        <p>You have requested to reset your password. Please use the OTP below to proceed:</p>
        <p class="otp">${Otp}</p>
        <p><strong>Note:</strong> This OTP is valid for <strong>5 minutes</strong>. Do not share this code with anyone for security reasons.</p>
        <p>If you did not request this, please ignore this email or contact support immediately.</p>
        <div class="footer">
          Best regards,<br/>
          Team Inventory Management System
        </div>
      </div>
    </body>
  </html>
  `
    };

    await transporter.sendMail(mailOptions);
    return res.json({ Success: true, message: "OTP sent to your email" });

  }
  catch (error) {
    console.error(error);
    return res.json({ Success: false, message: error.message });
  }
};


export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.json({ Success: false, message: "Please fill all the fields" });
  }
  try {

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ Success: false, message: "User not found" });
    }
    if (user.resetOTP == "" || user.resetOTP != otp) {
      return res.json({ Success: false, message: "Invalid OTP" });
    }
    if (user.resetOTPExpireAt < Date.now()) {
      return res.json({ Success: false, message: "OTP expired" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOTP = "";
    user.resetOTPExpireAt = 0;
    await user.save();
    return res.json({ Success: true, message: "Password reset successfully" });
  } catch (error) {
    return res.json({ Success: false, message: error.message });
  }
};