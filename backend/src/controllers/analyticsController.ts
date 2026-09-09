import { Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';

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

    const currentStudentProfileId = req.user?.studentProfileId;

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
    const studentProfileId = req.user?.studentProfileId;
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
      strengths: ['Vocabulary', 'Relevance', 'Confidence'],
      areasToImprove: ['Fluency', 'Grammar', 'Answer structure'],
      recommendations: [
        { id: 'rec-1', text: 'Practice speaking without filler words such as "um" and "like".', type: 'fluency', challengeId: 'c-1' },
        { id: 'rec-2', text: 'Try answering one HR technical or behavioral question today.', type: 'interview', categoryId: 'cat-hr' },
        { id: 'rec-3', text: 'Improve your answer structure using the STAR framework.', type: 'structure', contentId: 'learn-1' },
      ],
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch score analytics.' });
  }
};

export const getCampusChallenges = async (req: AuthRequest, res: Response) => {
  try {
    const studentProfileId = req.user?.studentProfileId;
    const campusList = await prisma.campusChallenge.findMany({
      include: { department: true },
      orderBy: { createdAt: 'asc' },
    });

    const userAttemptsCount = studentProfileId
      ? await prisma.challengeAttempt.count({ where: { studentId: studentProfileId } })
      : 0;

    const formatted = campusList.map((c, idx) => {
      const completed = Math.min(c.totalQuestions, (idx * 7 + userAttemptsCount) % (c.totalQuestions + 1));
      return {
        id: c.id,
        title: c.title,
        description: c.description,
        category: c.category,
        department: c.department.name,
        departmentCode: c.department.code,
        totalQuestions: c.totalQuestions,
        completed,
        remaining: c.totalQuestions - completed,
        difficulty: c.difficulty,
      };
    });

    return res.json({ campusChallenges: formatted });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch campus challenges.' });
  }
};

export const getLearningContent = async (req: AuthRequest, res: Response) => {
  try {
    const { category } = req.query;
    const items = await prisma.learningContent.findMany({
      where: category && category !== 'All' ? { category: String(category) } : {},
      orderBy: { createdAt: 'asc' },
    });

    return res.json({ learningContent: items });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch learning content.' });
  }
};

export const submitFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const studentProfileId = req.user?.studentProfileId;
    if (!studentProfileId) return res.status(401).json({ message: 'Unauthorized' });

    const { category, subject, message, rating } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required.' });
    }

    const feedback = await prisma.feedback.create({
      data: {
        studentId: studentProfileId,
        category: category || 'Platform',
        subject,
        message,
        rating: rating ? parseInt(rating, 10) : 5,
      },
    });

    return res.status(201).json({ message: 'Thank you for your feedback! Our mentors will review it.', feedback });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to submit feedback.' });
  }
};

export const getAnnouncements = async (req: AuthRequest, res: Response) => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    return res.json({ announcements });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch announcements.' });
  }
};
