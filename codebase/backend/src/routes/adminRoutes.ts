import { Router } from 'express';
import {
  getAdminDashboardStats,
  getStudentsList,
  createChallenge,
  deleteChallenge,
  createAnnouncement,
  getFeedbackList,
} from '../controllers/adminController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// Require ADMIN or SUPER_ADMIN role
router.use(authenticate);
router.use(requireRole(['ADMIN', 'SUPER_ADMIN']));

router.get('/stats', getAdminDashboardStats);
router.get('/students', getStudentsList);
router.post('/challenges', createChallenge);
router.delete('/challenges/:id', deleteChallenge);
router.post('/announcements', createAnnouncement);
router.get('/feedbacks', getFeedbackList);

export default router;
