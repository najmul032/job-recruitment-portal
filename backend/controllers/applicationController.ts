import { Response } from 'express';
import { db } from '../config/db.ts';
import { AuthRequest } from '../middleware/auth.ts';

// Apply for a job
export const applyForJob = async (req: AuthRequest, res: Response) => {
  const { job_id, cover_letter } = req.body;
  const userId = req.user?.user_id;

  if (!job_id) {
    return res.status(400).json({ message: 'Job ID is required.' });
  }

  try {
    const [seekerRows]: any = await db.execute(
      'SELECT seeker_id FROM job_seekers WHERE user_id = ? LIMIT 1',
      [userId]
    );

    if (seekerRows.length === 0) {
      return res.status(404).json({ message: 'Job seeker profile not found.' });
    }

    const seekerId = seekerRows[0].seeker_id;

    const [jobRows]: any = await db.execute(
      `SELECT job_id, status FROM jobs WHERE job_id = ? LIMIT 1`,
      [job_id]
    );

    if (jobRows.length === 0) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    if (jobRows[0].status !== 'approved') {
      return res.status(400).json({ message: 'This job is not open for applications.' });
    }

    const [existingRows]: any = await db.execute(
      `SELECT application_id FROM applications WHERE job_id = ? AND seeker_id = ? LIMIT 1`,
      [job_id, seekerId]
    );

    if (existingRows.length > 0) {
      return res.status(400).json({ message: 'You have already applied for this job.' });
    }

    await db.execute(
      `INSERT INTO applications (job_id, seeker_id, status, cover_letter)
       VALUES (?, ?, ?, ?)`,
      [job_id, seekerId, 'Pending', cover_letter || '']
    );

    return res.status(201).json({ message: 'Application submitted successfully.' });
  } catch (error) {
    console.error('Apply For Job Error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Get applications by seeker
export const getSeekerApplications = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.user_id;

  try {
    const [rows]: any = await db.execute(
      `SELECT
        a.application_id,
        a.job_id,
        a.status,
        a.cover_letter,
        a.applied_at,
        j.title,
        j.location,
        e.company_name
      FROM applications a
      JOIN job_seekers js ON a.seeker_id = js.seeker_id
      JOIN jobs j ON a.job_id = j.job_id
      JOIN employers e ON j.employer_id = e.employer_id
      WHERE js.user_id = ?
      ORDER BY a.applied_at DESC`,
      [userId]
    );

    return res.json(rows);
  } catch (error) {
    console.error('Get Seeker Applications Error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Get applications for employer's jobs
export const getEmployerApplications = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.user_id;

  try {
    const [rows]: any = await db.execute(
      `SELECT
        a.application_id,
        a.job_id,
        a.status,
        a.cover_letter,
        a.applied_at,
        j.title,
        u.name AS applicant_name,
        u.email AS applicant_email,
        js.resume,
        js.skills
      FROM applications a
      JOIN jobs j ON a.job_id = j.job_id
      JOIN employers e ON j.employer_id = e.employer_id
      JOIN job_seekers js ON a.seeker_id = js.seeker_id
      JOIN users u ON js.user_id = u.user_id
      WHERE e.user_id = ?
      ORDER BY a.applied_at DESC`,
      [userId]
    );

    return res.json(rows);
  } catch (error) {
    console.error('Get Employer Applications Error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Update application status
export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user?.user_id;

  if (!status) {
    return res.status(400).json({ message: 'Status is required.' });
  }

  try {
    const [rows]: any = await db.execute(
      `SELECT a.application_id
       FROM applications a
       JOIN jobs j ON a.job_id = j.job_id
       JOIN employers e ON j.employer_id = e.employer_id
       WHERE a.application_id = ? AND e.user_id = ?
       LIMIT 1`,
      [id, userId]
    );

    if (rows.length === 0) {
      return res.status(403).json({ message: 'Unauthorized access or application not found.' });
    }

    await db.execute(
      `UPDATE applications SET status = ? WHERE application_id = ?`,
      [status, id]
    );

    return res.json({ message: 'Application status updated successfully.' });
  } catch (error) {
    console.error('Update Application Status Error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};