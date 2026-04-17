import express from 'express';
import {
  applyForJob,
  getSeekerApplications,
  getEmployerApplications,
  updateApplicationStatus
} from '../controllers/applicationController.ts';
import { authenticateToken, authorizeRoles } from '../middleware/auth.ts';

const router = express.Router();

// Job seeker routes
router.post('/', authenticateToken, authorizeRoles('jobseeker'), applyForJob);
router.get('/my-applications', authenticateToken, authorizeRoles('jobseeker'), getSeekerApplications);

// Employer routes
router.get('/employer/received', authenticateToken, authorizeRoles('employer'), getEmployerApplications);
router.put('/:id/status', authenticateToken, authorizeRoles('employer'), updateApplicationStatus);

export default router;