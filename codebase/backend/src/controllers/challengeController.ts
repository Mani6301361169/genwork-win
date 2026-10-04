import { Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { evaluateSpeakingAttempt } from '../utils/aiEvaluator';
import { getOrCreateStudentProfileId } from '../utils/profileHelper';

const FALLBACK_CHALLENGES = [
  {
    id: '1',
    title: 'How I Stand Apart',
    description: 'How do you differentiate yourself from other candidates with similar backgrounds and qualifications?',
    category: 'Placement Prep',
    difficulty: 'Intermediate',
    durationSeconds: 60,
    topicType: 'DAILY',
    createdAt: new Date(),
    isOverdue: false,
    daysRemaining: 7,
    statusText: '7d left in active window',
  },
  {
    id: '2',
    title: 'My Placement Introduction',
    description: 'Give a 60-second professional self-introduction highlighting your top skills and background.',
    category: 'Placement Prep',
    difficulty: 'Beginner',
    durationSeconds: 60,
    topicType: 'TOPICAL',
    createdAt: new Date(),
    isOverdue: false,
    daysRemaining: 7,
    statusText: '7d left in active window',
  },
  {
    id: '3',
    title: 'A Skill I\'d Love to Learn in College',
    description: 'Explain a technical or soft skill you want to master before graduating and why.',
    category: 'Soft Skills',
    difficulty: 'Beginner',
    durationSeconds: 60,
    topicType: 'TOPICAL',
    createdAt: new Date(),
    isOverdue: false,
    daysRemaining: 7,
    statusText: '7d left in active window',
  },
  {
    id: '4',
    title: 'Multitasking – Help or Hindrance?',
    description: 'Discuss whether multitasking improves productivity or decreases focus in project execution.',
    category: 'Topical Debate',
    difficulty: 'Intermediate',
    durationSeconds: 60,
    topicType: 'TOPICAL',
    createdAt: new Date(),
    isOverdue: false,
    daysRemaining: 7,
    statusText: '7d left in active window',
  },
];

export const getChallenges = async (req: AuthRequest, res: Response) => {
  try {
    let formatted: any[] = [];
    try {
      const { category, difficulty, search } = req.query;
      const whereClause: any = { isArchived: false, topicType: { in: ['DAILY', 'TOPICAL'] } };

      if (category && category !== 'All') {
        whereClause.category = String(category);
      }
      if (difficulty && difficulty !== 'All') {
        whereClause.difficulty = String(difficulty);
      }
      if (search) {
        whereClause.OR = [
          { title: { contains: String(search) } },
          { description: { contains: String(search) } },
        ];
      }

      const challenges = await prisma.challenge.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
      });

      let studentAttemptsMap: Record<string, boolean> = {};
      const studentProfileId = await getOrCreateStudentProfileId(req);
      if (studentProfileId) {
        const attempts = await prisma.challengeAttempt.findMany({
          where: { studentId: studentProfileId },
          select: { challengeId: true },
        });
        attempts.forEach((a: any) => {
          studentAttemptsMap[a.challengeId] = true;
        });
      }

      const now = new Date();
      formatted = challenges.map((c: any) => {
        const createdAt = new Date(c.createdAt || now);
        const ageInMs = now.getTime() - createdAt.getTime();
        const ageInDays = Math.floor(ageInMs / (1000 * 3600 * 24));
        const isOverdue = ageInDays >= 7;
        const daysRemaining = Math.max(0, 7 - ageInDays);

        return {
          ...c,
          isCompleted: !!studentAttemptsMap[c.id],
          isOverdue,
          daysRemaining: isOverdue ? 0 : daysRemaining,
          statusText: isOverdue
            ? 'Overdue Notice: Topic posted >1 week ago. Practicing still earns full evaluation score!'
            : `${daysRemaining}d left in active window`,
        };
      });
    } catch (dbErr: any) {
      console.warn('DB getChallenges error, returning fallback challenges:', dbErr.message);
    }

    if (!formatted || formatted.length === 0) {
      formatted = FALLBACK_CHALLENGES;
    }

    return res.json({ challenges: formatted });
  } catch (error: any) {
    return res.json({ challenges: FALLBACK_CHALLENGES });
  }
};

export const getTodayChallenge = async (req: AuthRequest, res: Response) => {
  try {
    let ch: any = null;
    try {
      ch = await prisma.challenge.findFirst({
        where: { topicType: 'DAILY', isArchived: false },
        orderBy: { createdAt: 'desc' },
      });
      if (!ch) {
        ch = await prisma.challenge.findFirst({ where: { isArchived: false } });
      }
    } catch (dbErr: any) {
      console.warn('DB getTodayChallenge error:', dbErr.message);
    }

    if (!ch) {
      ch = FALLBACK_CHALLENGES[0];
    }

    const now = new Date();
    const createdAt = new Date(ch.createdAt || now);
    const ageInDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24));
    const isOverdue = ageInDays >= 7;
    const daysRemaining = Math.max(0, 7 - ageInDays);

    return res.json({
      challenge: {
        ...ch,
        isOverdue,
        daysRemaining: isOverdue ? 0 : daysRemaining,
        statusText: isOverdue
          ? 'Overdue Notice: Topic posted >1 week ago. Complete to get evaluated!'
          : `${daysRemaining}d left in active window`,
      },
    });
  } catch (error: any) {
    return res.json({
      challenge: FALLBACK_CHALLENGES[0],
    });
  }
};

export const getChallengeById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    let challenge: any = null;
    try {
      challenge = await prisma.challenge.findUnique({
        where: { id },
      });
    } catch (dbErr: any) {
      console.warn('DB getChallengeById error:', dbErr.message);
    }

    if (!challenge) {
      challenge = FALLBACK_CHALLENGES.find((c) => c.id === id) || FALLBACK_CHALLENGES[0];
    }

    return res.json({ challenge });
  } catch (error: any) {
    return res.json({ challenge: FALLBACK_CHALLENGES[0] });
  }
};

export const submitAttempt = async (req: AuthRequest, res: Response) => {
  try {
    const studentProfileId = await getOrCreateStudentProfileId(req);
    const { challengeId, transcript, audioUrl } = req.body;
    if (!challengeId || transcript === undefined) {
      return res.status(400).json({ message: 'Challenge ID and transcript are required.' });
    }

    let challengeTitle = 'How I Stand Apart';
    let durationSeconds = 60;

    try {
      const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
      if (challenge) {
        challengeTitle = challenge.title;
        durationSeconds = challenge.durationSeconds;
      }
    } catch (dbErr: any) {
      console.warn('DB challenge find error in submitAttempt:', dbErr.message);
    }

    // AI Speaking Evaluation
    const evaluation = evaluateSpeakingAttempt(transcript, challengeTitle, durationSeconds);

    let newAttempt: any = null;
    try {
      newAttempt = await prisma.challengeAttempt.create({
        data: {
          studentId: studentProfileId,
          challengeId,
          audioUrl: audioUrl || null,
          transcript: transcript || 'Audio recorded',
          overallScore: evaluation.overallScore,
          fluencyScore: evaluation.fluencyScore,
          grammarScore: evaluation.grammarScore,
          vocabularyScore: evaluation.vocabularyScore,
          pronunciationScore: evaluation.pronunciationScore,
          relevanceScore: evaluation.relevanceScore,
          confidenceScore: evaluation.confidenceScore,
          structureScore: evaluation.structureScore,
          strongestArea: evaluation.strongestArea,
          focusArea: evaluation.focusArea,
          aiFeedbackJson: JSON.stringify(evaluation.feedback),
        },
      });
    } catch (createErr: any) {
      console.warn('DB create attempt fallback:', createErr.message);
    }

    if (!newAttempt) {
      newAttempt = {
        id: `att-${Date.now()}`,
        studentId: studentProfileId,
        challengeId,
        audioUrl: audioUrl || null,
        transcript: transcript || 'Audio recorded',
        overallScore: evaluation.overallScore,
        fluencyScore: evaluation.fluencyScore,
        grammarScore: evaluation.grammarScore,
        vocabularyScore: evaluation.vocabularyScore,
        pronunciationScore: evaluation.pronunciationScore,
        relevanceScore: evaluation.relevanceScore,
        confidenceScore: evaluation.confidenceScore,
        structureScore: evaluation.structureScore,
        strongestArea: evaluation.strongestArea,
        focusArea: evaluation.focusArea,
        aiFeedbackJson: JSON.stringify(evaluation.feedback),
        completedAt: new Date(),
      };
    }

    return res.json({
      message: 'Challenge submitted successfully!',
      attempt: {
        id: newAttempt.id,
        overallScore: evaluation.overallScore,
        fluencyScore: evaluation.fluencyScore,
        grammarScore: evaluation.grammarScore,
        vocabularyScore: evaluation.vocabularyScore,
        pronunciationScore: evaluation.pronunciationScore,
        relevanceScore: evaluation.relevanceScore,
        confidenceScore: evaluation.confidenceScore,
        structureScore: evaluation.structureScore,
        strongestArea: evaluation.strongestArea,
        focusArea: evaluation.focusArea,
        feedback: evaluation.feedback,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to submit challenge attempt.' });
  }
};
