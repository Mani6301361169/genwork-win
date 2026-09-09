import { Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { evaluateInterviewResponse } from '../utils/aiEvaluator';

export const getInterviewCategories = async (req: AuthRequest, res: Response) => {
  try {
    const categories = await prisma.interviewCategory.findMany({
      include: {
        _count: {
          select: { questions: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    const formatted = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      type: cat.type,
      totalQuestions: cat._count.questions,
    }));

    return res.json({ categories: formatted });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch interview categories.' });
  }
};

export const getQuestionsByCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { categoryId } = req.params;
    const { difficulty } = req.query;

    const questions = await prisma.interviewQuestion.findMany({
      where: {
        categoryId,
        ...(difficulty && difficulty !== 'All' ? { difficulty: String(difficulty) } : {}),
      },
      include: { category: true },
      orderBy: { createdAt: 'asc' },
    });

    return res.json({ questions });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch category questions.' });
  }
};

export const createInterviewSession = async (req: AuthRequest, res: Response) => {
  try {
    const studentProfileId = req.user?.studentProfileId;
    if (!studentProfileId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { roleName, difficulty, totalQuestions = 5 } = req.body;

    const session = await prisma.interviewSession.create({
      data: {
        studentId: studentProfileId,
        roleName: roleName || 'Software Developer',
        difficulty: difficulty || 'Intermediate',
        totalQuestions: parseInt(String(totalQuestions), 10),
        status: 'IN_PROGRESS',
      },
    });

    return res.status(201).json({ message: 'Interview simulator session started!', session });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to start interview simulator.' });
  }
};

export const submitInterviewResponse = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId, questionId, questionText, responseText } = req.body;

    if (!sessionId || !questionText || responseText === undefined) {
      return res.status(400).json({ message: 'Session ID, questionText, and responseText are required.' });
    }

    const evaluation = evaluateInterviewResponse(questionText, responseText, 'TECHNICAL');

    const newResponse = await prisma.interviewResponse.create({
      data: {
        sessionId,
        questionId: questionId || null,
        questionText,
        responseText: responseText || 'No text response',
        score: evaluation.score,
        feedbackText: evaluation.feedbackText,
        criteriaScoresJson: JSON.stringify(evaluation),
      },
    });

    // Update Session aggregates
    const allResponses = await prisma.interviewResponse.findMany({ where: { sessionId } });
    const session = await prisma.interviewSession.findUnique({ where: { id: sessionId } });

    if (session) {
      const avgOverall = Math.round(allResponses.reduce((a, b) => a + b.score, 0) / allResponses.length);
      const isComplete = allResponses.length >= session.totalQuestions;

      const updatedSession = await prisma.interviewSession.update({
        where: { id: sessionId },
        data: {
          overallScore: avgOverall,
          communicationScore: evaluation.communicationScore,
          technicalScore: evaluation.technicalKnowledgeScore,
          confidenceScore: evaluation.confidenceScore,
          answerQualityScore: evaluation.answerQualityScore,
          problemSolvingScore: evaluation.problemSolvingScore,
          professionalismScore: evaluation.professionalismScore,
          status: isComplete ? 'COMPLETED' : 'IN_PROGRESS',
          feedbackSummary: isComplete
            ? 'Completed all questions with solid clarity and professional posture.'
            : session.feedbackSummary,
        },
      });

      // Update student profile scores if complete
      if (isComplete && req.user?.studentProfileId) {
        await prisma.studentProfile.update({
          where: { id: req.user.studentProfileId },
          data: {
            interviewScore: avgOverall,
            technicalScore: evaluation.technicalKnowledgeScore,
          },
        });
      }

      return res.json({
        message: 'Response recorded successfully!',
        response: newResponse,
        session: updatedSession,
        evaluation,
      });
    }

    return res.json({ response: newResponse, evaluation });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to record interview response.' });
  }
};

export const getInterviewSessionResults = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const session = await prisma.interviewSession.findUnique({
      where: { id },
      include: {
        responses: {
          include: { question: true },
        },
      },
    });

    if (!session) {
      return res.status(404).json({ message: 'Interview session not found.' });
    }

    return res.json({ session });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch session results.' });
  }
};
