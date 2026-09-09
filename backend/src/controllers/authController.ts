import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'skillsprint_jwt_secret_key_2026_secure';

export const register = async (req: Request, res: Response) => {
  try {
    const {
      studentId,
      fullName,
      email,
      phone,
      college,
      departmentId,
      academicYear,
      graduationYear,
      password,
    } = req.body;

    if (!studentId || !fullName || !email || !password || !departmentId || !academicYear) {
      return res.status(400).json({ message: 'All required registration fields must be provided.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(400).json({ message: 'A student account with this email address already exists.' });
    }

    const existingStudentId = await prisma.studentProfile.findUnique({ where: { studentId } });
    if (existingStudentId) {
      return res.status(400).json({ message: 'Student ID / Roll Number is already registered.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        role: 'STUDENT',
        profile: {
          create: {
            studentId,
            fullName,
            phone: phone || '',
            college: college || 'SkillSprint Academy',
            departmentId,
            academicYear,
            graduationYear: parseInt(graduationYear, 10) || new Date().getFullYear() + 2,
          },
        },
      },
      include: {
        profile: {
          include: {
            department: true,
          },
        },
      },
    });

    if (!newUser.profile) {
      return res.status(500).json({ message: 'Failed to create student profile.' });
    }

    // Create initial leaderboard entry
    await prisma.leaderboardEntry.create({
      data: {
        studentId: newUser.profile.id,
        overallScore: 70,
        speakingScore: 72,
        interviewScore: 68,
        challengesCompleted: 0,
        streak: 1,
      },
    });

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        studentProfileId: newUser.profile.id,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Student registered successfully!',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        profile: newUser.profile,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error during registration.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        profile: {
          include: {
            department: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. Please check your email and password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Please check your email and password.' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        studentProfileId: user.profile?.id,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error during login.' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        profile: {
          include: {
            department: true,
            challengeAttempts: {
              take: 5,
              orderBy: { completedAt: 'desc' },
              include: { challenge: true },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({ user });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch user profile.' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.studentProfileId) {
      return res.status(400).json({ message: 'Student profile not associated.' });
    }

    const { fullName, phone, college, departmentId, academicYear, graduationYear } = req.body;

    const updatedProfile = await prisma.studentProfile.update({
      where: { id: req.user.studentProfileId },
      data: {
        fullName,
        phone,
        college,
        departmentId,
        academicYear,
        graduationYear: graduationYear ? parseInt(graduationYear, 10) : undefined,
      },
      include: { department: true },
    });

    return res.json({ message: 'Profile updated successfully!', profile: updatedProfile });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to update profile.' });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required.' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password.' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { passwordHash: newHash },
    });

    return res.json({ message: 'Password changed successfully.' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to change password.' });
  }
};

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: 'asc' },
    });
    return res.json({ departments });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch departments.' });
  }
};
