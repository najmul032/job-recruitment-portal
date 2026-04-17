import express from 'express';
import { createJob, getApprovedJobs, getJobById, getEmployerJobs, updateJob, deleteJob } from '../controllers/jobController.ts';
import { authenticateToken, authorizeRoles } from '../middleware/auth.ts';

const router = express.Router();

// Public routes
router.get('/', getApprovedJobs);
router.get('/:id', getJobById);

// Employer routes
router.post('/', authenticateToken, authorizeRoles('employer'), createJob);
router.get('/employer/my-jobs', authenticateToken, authorizeRoles('employer'), getEmployerJobs);
router.put('/:id', authenticateToken, authorizeRoles('employer'), updateJob);
router.delete('/:id', authenticateToken, authorizeRoles('employer', 'admin'), deleteJob);

export default router;
