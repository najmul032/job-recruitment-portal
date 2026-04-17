import express from 'express';
import {
  getProfile,
  updateEmployerProfile,
  updateSeekerProfile,
  uploadCV
} from '../controllers/profileController.ts';
import { authenticateToken, authorizeRoles } from '../middleware/auth.ts';
import upload from '../middleware/upload.ts';

const router = express.Router();

// Get profile
router.get('/', authenticateToken, getProfile);

// Employer update
router.put('/employer', authenticateToken, authorizeRoles('employer'), updateEmployerProfile);

// Seeker update
router.put('/seeker', authenticateToken, authorizeRoles('jobseeker'), updateSeekerProfile);

// Seeker CV upload
router.post(
  '/seeker/upload-cv',
  authenticateToken,
  authorizeRoles('jobseeker'),
  upload.single('resume'),
  uploadCV
);

export default router;