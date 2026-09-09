import { Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { evaluateSpeakingAttempt } from '../utils/aiEvaluator';

export const getChallenges = async (req: AuthRequest, res: Response) => {
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

    // Attach student completion status if logged in
    let studentAttemptsMap: Record<string, boolean> = {};
    if (req.user?.studentProfileId) {
      const attempts = await prisma.challengeAttempt.findMany({
        where: { studentId: req.user.studentProfileId },
        select: { challengeId: true },
      });
      attempts.forEach((a) => {
        studentAttemptsMap[a.challengeId] = true;
      });
    }

    const formatted = challenges.map((c) => ({
      ...c,
      isCompleted: !!studentAttemptsMap[c.id],
    }));

    return res.json({ challenges: formatted });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch challenges.' });
  }
};

export const getTodayChallenge = async (req: AuthRequest, res: Response) => {
  try {
    const featured = await prisma.challenge.findFirst({
      where: { topicType: 'DAILY', isArchived: false },
      orderBy: { createdAt: 'desc' },
    });

    if (!featured) {
      const fallback = await prisma.challenge.findFirst({ where: { isArchived: false } });
      return res.json({ challenge: fallback });
    }

    return res.json({ challenge: featured });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to fetch today's challenge." });
  }
};

export const getChallengeById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const challenge = await prisma.challenge.findUnique({
      where: { id },
    });

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found.' });
    }

    return res.json({ challenge });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch challenge details.' });
  }
};

export const submitAttempt = async (req: AuthRequest, res: Response) => {
  try {
    const studentProfileId = req.user?.studentProfileId;
    if (!studentProfileId) {
      return res.status(401).json({ message: 'Student profile required to submit practice.' });
    }

    const { challengeId, transcript, audioUrl } = req.body;
    if (!challengeId || transcript === undefined) {
      return res.status(400).json({ message: 'Challenge ID and transcript are required.' });
    }

    const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge) {
      return res.status(404).json({ message: 'Target challenge not found.' });
    }

    // AI Speaking Evaluation
    const evaluation = evaluateSpeakingAttempt(transcript, challenge.title, challenge.durationSeconds);

    const newAttempt = await prisma.challengeAttempt.create({
      data: {
        studentId: studentProfileId,
        challengeId: challenge.id,
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

    // Update Student Stats in DB dynamically
    const student = await prisma.studentProfile.findUnique({ where: { id: studentProfileId } });
    if (student) {
      const attempts = await prisma.challengeAttempt.findMany({ where: { studentId: studentProfileId } });
      const avgSpeakingScore = Math.round(
        attempts.reduce((acc, curr) => acc + curr.overallScore, 0) / attempts.length
      );
      const newStreak = student.currentStreak + 1;
      const newXP = student.totalXP + evaluation.overallScore + 20;
      const newBest = Math.max(student.bestScore, evaluation.overallScore);

      await prisma.studentProfile.update({
        where: { id: studentProfileId },
        data: {
          speakingScore: avgSpeakingScore,
          overallScore: Math.round((avgSpeakingScore + student.interviewScore) / 2),
          currentStreak: newStreak,
          totalXP: newXP,
          bestScore: newBest,
        },
      });

      // Update Leaderboard cache
      await prisma.leaderboardEntry.upsert({
        where: { studentId: studentProfileId },
        update: {
          overallScore: Math.round((avgSpeakingScore + student.interviewScore) / 2),
          speakingScore: avgSpeakingScore,
          challengesCompleted: attempts.length,
          streak: newStreak,
        },
        create: {
          studentId: studentProfileId,
          overallScore: Math.round((avgSpeakingScore + student.interviewScore) / 2),
          speakingScore: avgSpeakingScore,
          challengesCompleted: attempts.length,
          streak: newStreak,
        },
      });
    }

    return res.json({
      message: 'Challenge submitted successfully!',
      attempt: {
        ...newAttempt,
        aiFeedback: evaluation.feedback,
      },
    });
  } catch (error: any) {
    console.error('Submit attempt error:', error);
    return res.status(500).json({ message: 'Failed to process practice attempt submission.' });
  }
};

export const getAttemptHistory = async (req: AuthRequest, res: Response) => {
  try {
    const studentProfileId = req.user?.studentProfileId;
    if (!studentProfileId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { category } = req.query;

    const attempts = await prisma.challengeAttempt.findMany({
      where: {
        studentId: studentProfileId,
        ...(category && category !== 'All' ? { challenge: { category: String(category) } } : {}),
      },
      include: {
        challenge: true,
      },
      orderBy: { completedAt: 'desc' },
    });

    const formatted = attempts.map((a) => ({
      id: a.id,
      challengeName: a.challenge.title,
      category: a.challenge.category,
      duration: `${a.challenge.durationSeconds}s`,
      date: a.completedAt.toISOString().split('T')[0],
      score: a.overallScore,
      status: 'Completed',
      transcript: a.transcript,
      strongestArea: a.strongestArea,
      focusArea: a.focusArea,
      feedback: JSON.parse(a.aiFeedbackJson || '{}'),
      metrics: {
        fluency: a.fluencyScore,
        grammar: a.grammarScore,
        vocabulary: a.vocabularyScore,
        pronunciation: a.pronunciationScore,
        relevance: a.relevanceScore,
        confidence: a.confidenceScore,
        structure: a.structureScore,
      },
    }));

    return res.json({ attempts: formatted });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch practice attempt history.' });
  }
};

export const getAttemptById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const attempt = await prisma.challengeAttempt.findUnique({
      where: { id },
      include: { challenge: true },
    });

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt record not found.' });
    }

    return res.json({
      attempt: {
        ...attempt,
        aiFeedback: JSON.parse(attempt.aiFeedbackJson || '{}'),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch attempt details.' });
  }
};
