const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function exportAllData() {
  console.log('Exporting all SkillSprint database records...');

  const outputDir = path.join(__dirname, '..', 'exported_data_json');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    const students = await prisma.studentProfile.findMany({
      include: {
        department: true,
        user: { select: { id: true, email: true, role: true } },
      },
    });
    fs.writeFileSync(path.join(outputDir, 'students.json'), JSON.stringify(students, null, 2));
    console.log(`Exported ${students.length} students.`);

    const departments = await prisma.department.findMany();
    fs.writeFileSync(path.join(outputDir, 'departments.json'), JSON.stringify(departments, null, 2));
    console.log(`Exported ${departments.length} departments.`);

    const challenges = await prisma.challenge.findMany();
    fs.writeFileSync(path.join(outputDir, 'challenges.json'), JSON.stringify(challenges, null, 2));
    console.log(`Exported ${challenges.length} speaking challenges.`);

    const challengeAttempts = await prisma.challengeAttempt.findMany({
      include: { challenge: true },
    });
    fs.writeFileSync(path.join(outputDir, 'challenge_attempts.json'), JSON.stringify(challengeAttempts, null, 2));
    console.log(`Exported ${challengeAttempts.length} practice attempts.`);

    const interviewCategories = await prisma.interviewCategory.findMany({
      include: { questions: true },
    });
    fs.writeFileSync(path.join(outputDir, 'interview_categories.json'), JSON.stringify(interviewCategories, null, 2));
    console.log(`Exported ${interviewCategories.length} interview categories.`);

    const interviewQuestions = await prisma.interviewQuestion.findMany();
    fs.writeFileSync(path.join(outputDir, 'interview_questions.json'), JSON.stringify(interviewQuestions, null, 2));
    console.log(`Exported ${interviewQuestions.length} interview questions.`);

    const interviewSessions = await prisma.interviewSession.findMany({
      include: { responses: true },
    });
    fs.writeFileSync(path.join(outputDir, 'interview_sessions.json'), JSON.stringify(interviewSessions, null, 2));
    console.log(`Exported ${interviewSessions.length} interview sessions.`);

    const campusChallenges = await prisma.campusChallenge.findMany();
    fs.writeFileSync(path.join(outputDir, 'campus_challenges.json'), JSON.stringify(campusChallenges, null, 2));
    console.log(`Exported ${campusChallenges.length} campus challenges.`);

    const learningContent = await prisma.learningContent.findMany();
    fs.writeFileSync(path.join(outputDir, 'learning_content.json'), JSON.stringify(learningContent, null, 2));
    console.log(`Exported ${learningContent.length} learning modules.`);

    const leaderboard = await prisma.leaderboardEntry.findMany({
      include: { student: { select: { fullName: true, college: true, studentId: true } } },
    });
    fs.writeFileSync(path.join(outputDir, 'leaderboard.json'), JSON.stringify(leaderboard, null, 2));
    console.log(`Exported ${leaderboard.length} leaderboard entries.`);

    const announcements = await prisma.announcement.findMany();
    fs.writeFileSync(path.join(outputDir, 'announcements.json'), JSON.stringify(announcements, null, 2));
    console.log(`Exported ${announcements.length} announcements.`);

    const fullDump = {
      exportedAt: new Date().toISOString(),
      counts: {
        students: students.length,
        departments: departments.length,
        challenges: challenges.length,
        challengeAttempts: challengeAttempts.length,
        interviewCategories: interviewCategories.length,
        interviewQuestions: interviewQuestions.length,
        interviewSessions: interviewSessions.length,
        campusChallenges: campusChallenges.length,
        learningContent: learningContent.length,
        leaderboard: leaderboard.length,
        announcements: announcements.length,
      },
      students,
      departments,
      challenges,
      challengeAttempts,
      interviewCategories,
      interviewQuestions,
      interviewSessions,
      campusChallenges,
      learningContent,
      leaderboard,
      announcements,
    };
    fs.writeFileSync(path.join(outputDir, 'full_database_dump.json'), JSON.stringify(fullDump, null, 2));
    console.log('Successfully created full_database_dump.json!');

  } catch (error) {
    console.error('Data export error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportAllData();
