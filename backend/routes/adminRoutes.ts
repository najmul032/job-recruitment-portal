import express from 'express';
import {
  getAllUsers,
  getAllJobs,
  approveJob,
  deleteUser,
  getAllApplications
} from '../controllers/adminController.ts';
import { authenticateToken, authorizeRoles } from '../middleware/auth.ts';

const router = express.Router();

router.use(authenticateToken, authorizeRoles('admin'));

router.get('/users', getAllUsers);
router.get('/jobs', getAllJobs);
router.put('/jobs/:id/approve', approveJob);
router.delete('/users/:id', deleteUser);
router.get('/applications', getAllApplications);

export default router;