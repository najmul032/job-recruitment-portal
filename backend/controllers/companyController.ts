import { Request, Response } from 'express';
import { db } from '../config/db.ts';

// Get all companies with approved jobs count
export const getAllCompanies = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await db.execute(
      `SELECT
        e.employer_id,
        e.company_name,
        e.contact_info,
        e.company_description,
        COUNT(j.job_id) AS open_jobs
      FROM employers e
      LEFT JOIN jobs j
        ON e.employer_id = j.employer_id
        AND j.status = 'approved'
      GROUP BY
        e.employer_id,
        e.company_name,
        e.contact_info,
        e.company_description
      HAVING e.company_name IS NOT NULL AND e.company_name <> ''
      ORDER BY e.company_name ASC`
    );

    res.json(rows);
  } catch (error) {
    console.error('Get All Companies Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Get single company with real approved jobs
export const getCompanyById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [companyRows]: any = await db.execute(
      `SELECT
        employer_id,
        company_name,
        contact_info,
        company_description,
        created_at
      FROM employers
      WHERE employer_id = ?
      LIMIT 1`,
      [id]
    );

    if (companyRows.length === 0) {
      return res.status(404).json({ message: 'Company not found.' });
    }

    const [jobRows]: any = await db.execute(
      `SELECT
        job_id,
        title,
        description,
        salary,
        location,
        job_type,
        status,
        created_at
      FROM jobs
      WHERE employer_id = ? AND status = 'approved'
      ORDER BY created_at DESC`,
      [id]
    );

    res.json({
      company: companyRows[0],
      jobs: jobRows,
    });
  } catch (error) {
    console.error('Get Company By ID Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};