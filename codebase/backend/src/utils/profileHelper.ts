import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getOrCreateStudentProfileId = async (req: AuthRequest): Promise<string> => {
  const userId = req.user?.id || '65f1a2b3c4d5e6f7a8b9c0d3';
  const defaultProfileId = req.user?.studentProfileId || '65f1a2b3c4d5e6f7a8b9c0d2';

  try {
    if (req.user?.studentProfileId) {
      const existing = await prisma.studentProfile.findUnique({
        where: { id: req.user.studentProfileId },
      });
      if (existing) return existing.id;
    }

    // Check by userId
    const existingByUserId = await prisma.studentProfile.findUnique({
      where: { userId },
    });
    if (existingByUserId) {
      return existingByUserId.id;
    }

    // Find or create default department
    let dept = await prisma.department.findFirst();
    if (!dept) {
      dept = await prisma.department.create({
        data: { code: 'CSE-GEN', name: 'Computer Science & Engineering (General)' },
      });
    }

    // Auto-create profile
    const newProfile = await prisma.studentProfile.create({
      data: {
        userId,
        studentId: `USR-${Date.now().toString().slice(-6)}`,
        fullName: req.user?.email ? req.user.email.split('@')[0] : 'SkillSprint User',
        departmentId: dept.id,
        academicYear: req.user?.role === 'ADMIN' ? 'Faculty Admin' : '4th Year',
        graduationYear: 2026,
        overallScore: 0,
        speakingScore: 0,
        interviewScore: 0,
        technicalScore: 0,
        confidenceScore: 0,
      },
    });

    return newProfile.id;
  } catch (err: any) {
    console.warn('DB query error in getOrCreateStudentProfileId, returning session profile ID fallback:', err.message);
    return defaultProfileId;
  }
};
