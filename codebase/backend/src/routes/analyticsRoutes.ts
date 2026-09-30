import { Router } from 'express';
import {
  getLeaderboard,
  getStudentScores,
  getCampusChallenges,
  getLearningContent,
  submitFeedback,
  getAnnouncements,
  generateAssessmentReport,
} from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/leaderboard', authenticate, getLeaderboard);
router.get('/scores', authenticate, getStudentScores);
router.get('/campus', authenticate, getCampusChallenges);
router.get('/learning', authenticate, getLearningContent);
router.get('/announcements', authenticate, getAnnouncements);
router.post('/feedback', authenticate, submitFeedback);
router.post('/assessment-report', authenticate, generateAssessmentReport);

export default router;

