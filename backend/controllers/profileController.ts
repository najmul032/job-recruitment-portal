import { Response } from 'express';
import { db } from '../config/db.ts';
import { AuthRequest } from '../middleware/auth.ts';

// Get profile
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    const userId = Number(req.user.user_id);
    const role = req.user.role;

    const [userRows]: any = await db.execute(
      'SELECT user_id, name, email, role, created_at FROM users WHERE user_id = ? LIMIT 1',
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = userRows[0];

    if (role === 'employer') {
      const [employerRows]: any = await db.execute(
        'SELECT employer_id, company_name, contact_info, company_description, created_at FROM employers WHERE user_id = ? LIMIT 1',
        [userId]
      );

      return res.json({
        user,
        profile: employerRows.length > 0 ? employerRows[0] : null,
      });
    }

    if (role === 'jobseeker') {
      const [seekerRows]: any = await db.execute(
        'SELECT seeker_id, resume, skills, education, experience, created_at FROM job_seekers WHERE user_id = ? LIMIT 1',
        [userId]
      );

      return res.json({
        user,
        profile: seekerRows.length > 0 ? seekerRows[0] : null,
      });
    }

    return res.json({
      user,
      profile: null,
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Update employer profile
export const updateEmployerProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    const userId = Number(req.user.user_id);
    const { company_name, contact_info, company_description } = req.body;

    await db.execute(
      `UPDATE employers
       SET company_name = ?, contact_info = ?, company_description = ?
       WHERE user_id = ?`,
      [
        company_name || 'My Company',
        contact_info || '',
        company_description || '',
        userId,
      ]
    );

    return res.json({ message: 'Employer profile updated successfully.' });
  } catch (error) {
    console.error('Update Employer Profile Error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Update seeker profile
export const updateSeekerProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    const userId = Number(req.user.user_id);
    const { skills, education, experience } = req.body;

    await db.execute(
      `UPDATE job_seekers
       SET skills = ?, education = ?, experience = ?
       WHERE user_id = ?`,
      [
        skills || '',
        education || '',
        experience || '',
        userId,
      ]
    );

    return res.json({ message: 'Job seeker profile updated successfully.' });
  } catch (error) {
    console.error('Update Seeker Profile Error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Upload CV
export const uploadCV = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const userId = Number(req.user.user_id);
    const resumePath = `/uploads/${req.file.filename}`;

    await db.execute(
      `UPDATE job_seekers
       SET resume = ?
       WHERE user_id = ?`,
      [resumePath, userId]
    );

    return res.json({
      message: 'CV uploaded successfully.',
      resume: resumePath,
    });
  } catch (error) {
    console.error('Upload CV Error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};