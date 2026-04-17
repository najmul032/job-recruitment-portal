import { Request, Response } from 'express';
import { db } from '../config/db.ts';
import { AuthRequest } from '../middleware/auth.ts';

// Create a new job post
export const createJob = async (req: AuthRequest, res: Response) => {
  const { title, description, salary, location, job_type } = req.body;
  const userId = req.user?.user_id;

  if (!title || !description || !job_type || !location) {
    return res.status(400).json({ message: 'Title, description, location, and job type are required.' });
  }

  try {
    const [employerRows]: any = await db.execute(
      'SELECT employer_id FROM employers WHERE user_id = ? LIMIT 1',
      [userId]
    );

    if (employerRows.length === 0) {
      return res.status(404).json({ message: 'Employer profile not found.' });
    }

    const employerId = employerRows[0].employer_id;

    const [result]: any = await db.execute(
      `INSERT INTO jobs (title, description, salary, location, job_type, employer_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        salary || '',
        location,
        job_type,
        employerId,
        'pending'
      ]
    );

    return res.status(201).json({
      message: 'Job posted successfully. Waiting for admin approval.',
      job_id: result.insertId
    });
  } catch (error) {
    console.error('Create Job Error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Get all approved jobs
export const getApprovedJobs = async (req: Request, res: Response) => {
  const { search, location, job_type } = req.query;

  try {
    let sql = `
      SELECT 
        j.job_id,
        j.title,
        j.description,
        j.salary,
        j.location,
        j.job_type,
        j.status,
        j.created_at,
        e.company_name,
        e.company_description
      FROM jobs j
      JOIN employers e ON j.employer_id = e.employer_id
      WHERE j.status = 'approved'
    `;

    const params: any[] = [];

    if (search) {
      sql += ` AND (j.title LIKE ? OR j.description LIKE ? OR e.company_name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (location) {
      sql += ` AND j.location LIKE ?`;
      params.push(`%${location}%`);
    }

    if (job_type) {
      sql += ` AND j.job_type = ?`;
      params.push(job_type);
    }

    sql += ` ORDER BY j.created_at DESC`;

    const [rows]: any = await db.execute(sql, params);
    return res.json(rows);
  } catch (error) {
    console.error('Get Approved Jobs Error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Get single job details
export const getJobById = async (req: Request, res: Response) => {
  const { id } = req.params;

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
        e.company_name,
        e.contact_info,
        e.company_description
      FROM jobs j
      JOIN employers e ON j.employer_id = e.employer_id
      WHERE j.job_id = ?
      LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error('Get Job By ID Error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Get employer's own jobs
export const getEmployerJobs = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.user_id;

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
        j.created_at
      FROM jobs j
      JOIN employers e ON j.employer_id = e.employer_id
      WHERE e.user_id = ?
      ORDER BY j.created_at DESC`,
      [userId]
    );

    return res.json(rows);
  } catch (error) {
    console.error('Get Employer Jobs Error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Update job post
export const updateJob = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, description, salary, location, job_type, status } = req.body;
  const userId = req.user?.user_id;

  try {
    const [rows]: any = await db.execute(
      `SELECT j.job_id
       FROM jobs j
       JOIN employers e ON j.employer_id = e.employer_id
       WHERE j.job_id = ? AND e.user_id = ?
       LIMIT 1`,
      [id, userId]
    );

    if (rows.length === 0) {
      return res.status(403).json({ message: 'Unauthorized access or job not found.' });
    }

    await db.execute(
      `UPDATE jobs
       SET title = ?, description = ?, salary = ?, location = ?, job_type = ?, status = ?
       WHERE job_id = ?`,
      [
        title,
        description,
        salary,
        location,
        job_type,
        status || 'pending',
        id
      ]
    );

    return res.json({ message: 'Job updated successfully.' });
  } catch (error) {
    console.error('Update Job Error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Delete job post
export const deleteJob = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.user_id;
  const role = req.user?.role;

  try {
    let rows: any[] = [];

    if (role === 'admin') {
      const [adminRows]: any = await db.execute(
        `SELECT job_id FROM jobs WHERE job_id = ? LIMIT 1`,
        [id]
      );
      rows = adminRows;
    } else {
      const [ownerRows]: any = await db.execute(
        `SELECT j.job_id
         FROM jobs j
         JOIN employers e ON j.employer_id = e.employer_id
         WHERE j.job_id = ? AND e.user_id = ?
         LIMIT 1`,
        [id, userId]
      );
      rows = ownerRows;
    }

    if (rows.length === 0) {
      return res.status(403).json({ message: 'Unauthorized access or job not found.' });
    }

    await db.execute(`DELETE FROM jobs WHERE job_id = ?`, [id]);

    return res.json({ message: 'Job deleted successfully.' });
  } catch (error) {
    console.error('Delete Job Error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};