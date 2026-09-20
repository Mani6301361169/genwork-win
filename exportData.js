const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function exportAllData() {
  console.log('Exporting all SkillSprint database records...');

  const outputDir = path.join(__dirname, 'exported_data_json');
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

    const departments = await prisma.department.findMany({
      include: { students: { select: { id: true, fullName: true, rollNumber: true } } },
    });
    fs.writeFileSync(path.join(outputDir, 'departments.json'), JSON.stringify(departments, null, 2));
    console.log(`Exported ${departments.length} departments.`);

    const challenges = await prisma.challenge.findMany();
    fs.writeFileSync(path.join(outputDir, 'challenges.json'), JSON.stringify(challenges, null, 2));
    console.log(`Exported ${challenges.length} speaking challenges.`);

    const challengeAttempts = await prisma.challengeAttempt.findMany({
      include: { challenge: true, student: { select: { fullName: true, rollNumber: true } } },
    });
    fs.writeFileSync(path.join(outputDir, 'challenge_attempts.json'), JSON.stringify(challengeAttempts, null, 2));
    console.log(`Exported ${challengeAttempts.length} practice attempts.`);

    const hrQuestions = await prisma.hRQuestion.findMany();
    fs.writeFileSync(path.join(outputDir, 'hr_questions.json'), JSON.stringify(hrQuestions, null, 2));
    console.log(`Exported ${hrQuestions.length} HR interview questions.`);

    const leaderboard = await prisma.leaderboardEntry.findMany({
      include: { student: { select: { fullName: true, departmentName: true, rollNumber: true } } },
    });
    fs.writeFileSync(path.join(outputDir, 'leaderboard.json'), JSON.stringify(leaderboard, null, 2));
    console.log(`Exported ${leaderboard.length} leaderboard entries.`);

    const fullDump = {
      exportedAt: new Date().toISOString(),
      counts: {
        students: students.length,
        departments: departments.length,
        challenges: challenges.length,
        challengeAttempts: challengeAttempts.length,
        hrQuestions: hrQuestions.length,
        leaderboard: leaderboard.length,
      },
      students,
      departments,
      challenges,
      challengeAttempts,
      hrQuestions,
      leaderboard,
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
