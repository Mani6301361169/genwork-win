import { Router } from 'express';
import {
  getInterviewCategories,
  getQuestionsByCategory,
  createInterviewSession,
  submitInterviewResponse,
  getInterviewSessionResults,
} from '../controllers/interviewController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/categories', authenticate, getInterviewCategories);
router.get('/categories/:categoryId/questions', authenticate, getQuestionsByCategory);
router.post('/sessions', authenticate, createInterviewSession);
router.post('/responses', authenticate, submitInterviewResponse);
router.get('/sessions/:id', authenticate, getInterviewSessionResults);

export default router;
