import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { SECRET_KEY } from '../configs/constant.js';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, SECRET_KEY, {
    expiresIn: '7d',
  });
};

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({ message: "Username or email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id);

    return res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        bio: newUser.bio,
        profilePicture: newUser.profilePicture,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  const { username, bio } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.params.id !== req.userId) {
      return res.status(403).json({ message: "Not authorized to update this profile" });
    }

    if (username) {
      const usernameTaken = await User.findOne({
        username,
        _id: { $ne: req.userId },
      });

      if (usernameTaken) {
        return res.status(409).json({ message: "Username already in use" });
      }

      user.username = username;
    }

    if (bio !== undefined) user.bio = bio;
    if (req.file) user.profilePicture = req.file.filename;

    await user.save();

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  const { search } = req.query;

  try {
    const filter = search
      ? { username: { $regex: search, $options: 'i' } }
      : {};

    const users = await User.find(filter);

    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};