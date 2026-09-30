import { Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getAdminDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalStudents = await prisma.studentProfile.count();
    const activeStudents = await prisma.studentProfile.count({
      where: { currentStreak: { gt: 0 } },
    });
    const challengesCompleted = await prisma.challengeAttempt.count();
    const avgScoreRaw = await prisma.studentProfile.aggregate({
      _avg: { overallScore: true },
    });
    const averageScore = Math.round(avgScoreRaw._avg.overallScore || 70);

    const weeklyParticipation = [
      { day: 'Mon', attempts: 42, activeStudents: 35 },
      { day: 'Tue', attempts: 58, activeStudents: 48 },
      { day: 'Wed', attempts: 64, activeStudents: 52 },
      { day: 'Thu', attempts: 71, activeStudents: 60 },
      { day: 'Fri', attempts: 85, activeStudents: 74 },
      { day: 'Sat', attempts: 50, activeStudents: 40 },
      { day: 'Sun', attempts: 38, activeStudents: 30 },
    ];

    return res.json({
      totalStudents,
      activeStudents,
      challengesCompleted,
      averageScore,
      weeklyParticipation,
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch admin stats.' });
  }
};

export const getStudentsList = async (req: AuthRequest, res: Response) => {
  try {
    const { search, departmentId } = req.query;

    const whereClause: any = {};
    if (departmentId && departmentId !== 'All') {
      whereClause.departmentId = String(departmentId);
    }
    if (search) {
      whereClause.OR = [
        { fullName: { contains: String(search) } },
        { studentId: { contains: String(search) } },
        { user: { email: { contains: String(search) } } },
      ];
    }

    const students = await prisma.studentProfile.findMany({
      where: whereClause,
      include: {
        user: { select: { email: true, role: true, createdAt: true } },
        department: true,
        _count: { select: { challengeAttempts: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = students.map((s) => ({
      id: s.id,
      studentId: s.studentId,
      fullName: s.fullName,
      email: s.user.email,
      phone: s.phone,
      college: s.college,
      department: s.department.name,
      academicYear: s.academicYear,
      graduationYear: s.graduationYear,
      overallScore: s.overallScore,
      speakingScore: s.speakingScore,
      interviewScore: s.interviewScore,
      attemptsCount: s._count.challengeAttempts,
      streak: s.currentStreak,
      joinedAt: s.createdAt.toISOString().split('T')[0],
    }));

    return res.json({ students: formatted });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch student directory.' });
  }
};

export const createChallenge = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, difficulty, durationSeconds, topicType, targetDeptId } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Title, description, and category are required.' });
    }

    const challenge = await prisma.challenge.create({
      data: {
        title,
        description,
        category,
        difficulty: difficulty || 'Intermediate',
        durationSeconds: parseInt(String(durationSeconds), 10) || 60,
        topicType: topicType || 'TOPICAL',
        targetDeptId: targetDeptId || null,
      },
    });

    return res.status(201).json({ message: 'Challenge created successfully!', challenge });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to create challenge.' });
  }
};

export const deleteChallenge = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.challenge.delete({ where: { id } });
    return res.json({ message: 'Challenge deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to delete challenge.' });
  }
};

export const createAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, isImportant } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        isImportant: !!isImportant,
        author: req.user?.email || 'Faculty Admin',
      },
    });

    return res.status(201).json({ message: 'Announcement published!', announcement });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to publish announcement.' });
  }
};

export const getFeedbackList = async (req: AuthRequest, res: Response) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      include: {
        student: { include: { department: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ feedbacks });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch student feedback.' });
  }
};
