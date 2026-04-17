import { Request, Response } from 'express';
import { db } from '../config/db.ts';

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await db.execute(
      `SELECT user_id, name, email, role, created_at FROM users ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Get all jobs (Admin view)
export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await db.execute(
      `SELECT 
        j.job_id,
        j.title,
        j.description,
        j.salary,
        j.location,
        j.job_type,
        j.status,
        j.created_at,
        e.company_name
      FROM jobs j
      JOIN employers e ON j.employer_id = e.employer_id
      ORDER BY j.created_at DESC`
    );

    res.json(rows);
  } catch (error) {
    console.error('Get Jobs Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Approve / Reject job
export const approveJob = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.execute(
      `UPDATE jobs SET status = ? WHERE job_id = ?`,
      [status, id]
    );

    res.json({
      message: `Job ${status} successfully.`
    });
  } catch (error) {
    console.error('Approve Job Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await db.execute(`DELETE FROM users WHERE user_id = ?`, [id]);
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Get all applications
export const getAllApplications = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await db.execute(
      `SELECT 
        a.application_id,
        a.status,
        a.applied_at,
        j.title AS job_title,
        u.name AS applicant_name,
        e.company_name
      FROM applications a
      JOIN jobs j ON a.job_id = j.job_id
      JOIN job_seekers js ON a.seeker_id = js.seeker_id
      JOIN users u ON js.user_id = u.user_id
      JOIN employers e ON j.employer_id = e.employer_id
      ORDER BY a.applied_at DESC`
    );

    res.json(rows);
  } catch (error) {
    console.error('Get Applications Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};