import { Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { getOrCreateStudentProfileId } from '../utils/profileHelper';

export const getLeaderboard = async (req: AuthRequest, res: Response) => {
  try {
    const { period = 'OVERALL', departmentId, academicYear } = req.query;

    const whereClause: any = {};
    if (departmentId && departmentId !== 'All') {
      whereClause.student = { departmentId: String(departmentId) };
    }
    if (academicYear && academicYear !== 'All') {
      whereClause.student = { ...whereClause.student, academicYear: String(academicYear) };
    }

    const leaderboardEntries = await prisma.leaderboardEntry.findMany({
      where: whereClause,
      include: {
        student: {
          include: { department: true },
        },
      },
      orderBy: { overallScore: 'desc' },
      take: 50,
    });

    const currentStudentProfileId = await getOrCreateStudentProfileId(req);

    const formatted = leaderboardEntries.map((entry, index) => {
      const isCurrentUser = entry.studentId === currentStudentProfileId;
      return {
        rank: index + 1,
        studentName: isCurrentUser ? `${entry.student.fullName} (You)` : `Student ${String.fromCharCode(65 + (index % 26))}`,
        department: entry.student.department.name,
        departmentCode: entry.student.department.code,
        academicYear: entry.student.academicYear,
        score: entry.overallScore,
        speakingScore: entry.speakingScore,
        interviewScore: entry.interviewScore,
        challengesCompleted: entry.challengesCompleted,
        streak: entry.streak,
        isCurrentUser,
      };
    });

    let currentUserRank = formatted.find((f) => f.isCurrentUser) || null;

    return res.json({ leaderboard: formatted, currentUserRank });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch leaderboard.' });
  }
};

export const getStudentScores = async (req: AuthRequest, res: Response) => {
  try {
    const studentProfileId = await getOrCreateStudentProfileId(req);
    if (!studentProfileId) return res.status(401).json({ message: 'Unauthorized' });

    const student = await prisma.studentProfile.findUnique({
      where: { id: studentProfileId },
      include: {
        department: true,
        challengeAttempts: {
          take: 10,
          orderBy: { completedAt: 'desc' },
        },
      },
    });

    if (!student) return res.status(404).json({ message: 'Student profile not found.' });

    // Calculate weekly progress graph points dynamically from attempts or baseline
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weeklyData = days.map((day, idx) => ({
      day,
      practiceCompleted: Math.max(1, (idx % 3) + (student.challengeAttempts.length > idx ? 1 : 0)),
      speakingScore: Math.min(100, student.speakingScore + ((idx % 5) - 2) * 2),
      interviewScore: Math.min(100, student.interviewScore + ((idx % 4) - 2) * 2),
    }));

    const skillProgress = [
      { skill: 'Fluency', score: Math.round(student.speakingScore * 0.95), fullMark: 100 },
      { skill: 'Grammar', score: Math.round(student.speakingScore * 1.02), fullMark: 100 },
      { skill: 'Vocabulary', score: Math.round(student.speakingScore * 1.08), fullMark: 100 },
      { skill: 'Confidence', score: student.confidenceScore, fullMark: 100 },
      { skill: 'Technical', score: student.technicalScore, fullMark: 100 },
      { skill: 'Relevance', score: Math.round(student.speakingScore * 1.05), fullMark: 100 },
      { skill: 'Structure', score: Math.round(student.interviewScore * 0.98), fullMark: 100 },
    ];

    return res.json({
      overallScore: student.overallScore,
      speakingScore: student.speakingScore,
      interviewScore: student.interviewScore,
      technicalScore: student.technicalScore,
      confidenceScore: student.confidenceScore,
      currentStreak: student.currentStreak,
      totalXP: student.totalXP,
      weeklyData,
      skillProgress,
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch student scores.' });
  }
};

export const getCampusChallenges = async (req: AuthRequest, res: Response) => {
  try {
    const campusChallenges = await prisma.campusChallenge.findMany({
      include: { department: true },
      orderBy: { createdAt: 'desc' },
    });

    const studentProfileId = await getOrCreateStudentProfileId(req);
    let attemptsCount = 0;
    if (studentProfileId) {
      attemptsCount = await prisma.challengeAttempt.count({ where: { studentId: studentProfileId } });
    }

    const formatted = campusChallenges.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      category: c.category,
      department: c.department.name,
      departmentCode: c.department.code,
      totalQuestions: c.totalQuestions,
      completed: Math.min(c.totalQuestions, attemptsCount),
      remaining: Math.max(0, c.totalQuestions - attemptsCount),
      difficulty: c.difficulty,
    }));

    return res.json({ campusChallenges: formatted });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch campus challenges.' });
  }
};

export const getLearningContent = async (req: AuthRequest, res: Response) => {
  try {
    const { category } = req.query;

    const whereClause: any = {};
    if (category && category !== 'All') {
      whereClause.category = String(category);
    }

    const learningContent = await prisma.learningContent.findMany({
      where: whereClause,
      orderBy: { createdAt: 'asc' },
    });

    return res.json({ learningContent });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch learning content.' });
  }
};

export const submitFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const studentProfileId = await getOrCreateStudentProfileId(req);
    if (!studentProfileId) return res.status(401).json({ message: 'Unauthorized' });

    const { category = 'Platform', subject, message, rating = 5 } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required.' });
    }

    const feedback = await prisma.feedback.create({
      data: {
        studentId: studentProfileId,
        category: String(category),
        subject: String(subject),
        message: String(message),
        rating: parseInt(String(rating), 10),
      },
    });

    return res.status(201).json({ message: 'Feedback submitted successfully!', feedback });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to submit feedback.' });
  }
};
