import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getOrCreateStudentProfileId = async (req: AuthRequest): Promise<string | null> => {
  const userId = req.user?.id;
  if (!userId) return null;

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
      data: { code: 'GEN', name: 'General Placement Suite' },
    });
  }

  // Auto-create profile for seamless practice access for any user role (including ADMIN)
  const newProfile = await prisma.studentProfile.create({
    data: {
      userId,
      studentId: `USR-${Date.now().toString().slice(-6)}`,
      fullName: req.user?.email ? req.user.email.split('@')[0] : 'SkillSprint User',
      departmentId: dept.id,
      academicYear: req.user?.role === 'ADMIN' ? 'Faculty Admin' : '4th Year',
      graduationYear: 2026,
      overallScore: 82,
      speakingScore: 84,
      interviewScore: 80,
      technicalScore: 82,
      confidenceScore: 85,
    },
  });

  return newProfile.id;
};
