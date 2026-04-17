import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.ts';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

const normalizeRole = (role: string) => {
  const value = role.toLowerCase().replace(/\s+/g, '');

  if (value === 'seeker') return 'jobseeker';
  if (value === 'jobseeker') return 'jobseeker';
  if (value === 'employer') return 'employer';
  if (value === 'admin') return 'admin';

  return value;
};

// Register
export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  let { role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  role = normalizeRole(role);

  if (!['admin', 'employer', 'jobseeker'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role.' });
  }

  try {
    console.log('Register body:', req.body);

    const [existingUsers]: any = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result]: any = await db.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    const userId = result.insertId;

    if (role === 'employer') {
      await db.execute(
        'INSERT INTO employers (user_id, company_name, contact_info, company_description) VALUES (?, ?, ?, ?)',
        [userId, 'My Company', '', '']
      );
    } else if (role === 'jobseeker') {
      await db.execute(
        'INSERT INTO job_seekers (user_id, resume, skills, education, experience) VALUES (?, ?, ?, ?, ?)',
        [userId, '', '', '', '']
      );
    }

    return res.status(201).json({
      message: 'User registered successfully.',
    });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const [rows]: any = await db.execute(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};