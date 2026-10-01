import { Router } from 'express';
import {
  getChallenges,
  getTodayChallenge,
  getChallengeById,
  submitAttempt,
  getAttemptHistory,
  getAttemptById,
} from '../controllers/challengeController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getChallenges);
router.get('/today', authenticate, getTodayChallenge);
router.get('/history', authenticate, getAttemptHistory);
router.get('/attempts/:id', authenticate, getAttemptById);
router.get('/:id', authenticate, getChallengeById);
router.post('/submit', authenticate, submitAttempt);

export default router;
