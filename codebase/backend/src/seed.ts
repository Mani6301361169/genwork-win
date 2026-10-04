import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SkillSprint Database Seed...');

  // Clean existing data
  await prisma.feedback.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.studentProgress.deleteMany();
  await prisma.learningContent.deleteMany();
  await prisma.campusChallenge.deleteMany();
  await prisma.interviewResponse.deleteMany();
  await prisma.interviewSession.deleteMany();
  await prisma.interviewQuestion.deleteMany();
  await prisma.interviewCategory.deleteMany();
  await prisma.challengeAttempt.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.leaderboardEntry.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  console.log('🧹 Cleaned existing database records.');

  // 1. Create 6 Departments
  const departments = await Promise.all([
    prisma.department.create({ data: { code: 'CSE-GEN', name: 'Computer Science & Engineering (General)' } }),
    prisma.department.create({ data: { code: 'CSE-AI', name: 'Computer Science & Engineering (AI)' } }),
    prisma.department.create({ data: { code: 'CSE-CS', name: 'Computer Science & Engineering (Cyber Security)' } }),
    prisma.department.create({ data: { code: 'ECE', name: 'Electronics & Communication Engineering' } }),
    prisma.department.create({ data: { code: 'AIML', name: 'Artificial Intelligence & Machine Learning' } }),
    prisma.department.create({ data: { code: 'CIVIL', name: 'Civil Engineering' } }),
  ]);
  console.log('✅ Created 6 college departments.');

  // 2. Create Admin Account
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@skillsprint.edu',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });
  console.log('✅ Created Admin user (admin@skillsprint.edu / admin123).');

  // 3. Create Demo Student Account & 19 Other Students (Total 20)
  const defaultPasswordHash = await bcrypt.hash('student123', 10);

  const studentNames = [
    { name: 'Alex Johnson', id: '21CS001', dept: departments[0], year: '3rd Year' }, // Demo Student
    { name: 'Priya Sharma', id: '21CS002', dept: departments[0], year: '3rd Year' },
    { name: 'Rohan Mehta', id: '21EC015', dept: departments[1], year: '4th Year' },
    { name: 'Sneha Patel', id: '21IT024', dept: departments[2], year: '3rd Year' },
    { name: 'Vikram Singh', id: '21ME009', dept: departments[3], year: '4th Year' },
    { name: 'Ananya Roy', id: '21EE011', dept: departments[4], year: '2nd Year' },
    { name: 'Rahul Verma', id: '21CS045', dept: departments[0], year: '4th Year' },
    { name: 'Divya Kulkarni', id: '21IT088', dept: departments[2], year: '3rd Year' },
    { name: 'Karan Malhotra', id: '21EC090', dept: departments[1], year: '3rd Year' },
    { name: 'Neha Gupta', id: '21CS102', dept: departments[0], year: '2nd Year' },
    { name: 'Arjun Das', id: '21ME033', dept: departments[3], year: '3rd Year' },
    { name: 'Meera Nair', id: '21EE052', dept: departments[4], year: '4th Year' },
    { name: 'Siddharth Rao', id: '21CS115', dept: departments[0], year: '4th Year' },
    { name: 'Pooja Reddy', id: '21IT067', dept: departments[2], year: '2nd Year' },
    { name: 'Aditya Dave', id: '21EC041', dept: departments[1], year: '3rd Year' },
    { name: 'Tanvi Joshi', id: '21CS140', dept: departments[0], year: '3rd Year' },
    { name: 'Varun Sen', id: '21ME078', dept: departments[3], year: '4th Year' },
    { name: 'Ritu Agarwal', id: '21EE099', dept: departments[4], year: '3rd Year' },
    { name: 'Yash Saxena', id: '21IT120', dept: departments[2], year: '4th Year' },
    { name: 'Ishita Bannerjee', id: '21CS162', dept: departments[0], year: '3rd Year' },
  ];

  const studentProfiles = [];

  for (let i = 0; i < studentNames.length; i++) {
    const s = studentNames[i];
    const email = i === 0 ? 'student@skillsprint.edu' : `student${i + 1}@skillsprint.edu`;

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: defaultPasswordHash,
        role: 'STUDENT',
        profile: {
          create: {
            studentId: s.id,
            fullName: s.name,
            phone: `+91 98765432${(10 + i).toString()}`,
            college: 'SkillSprint Institute of Technology',
            departmentId: s.dept.id,
            academicYear: s.year,
            graduationYear: 2026,
            totalXP: 0,
            currentStreak: 0,
            bestScore: 0,
            overallScore: 0,
            speakingScore: 0,
            interviewScore: 0,
            technicalScore: 0,
            confidenceScore: 0,
          },
        },
      },
      include: { profile: true },
    });

    if (user.profile) {
      studentProfiles.push(user.profile);

      // Leaderboard entry
      await prisma.leaderboardEntry.create({
        data: {
          studentId: user.profile.id,
          overallScore: 0,
          speakingScore: 0,
          interviewScore: 0,
          challengesCompleted: 0,
          streak: 0,
        },
      });
    }
  }

  console.log(`✅ Created 20 Students with zero baseline scores.`);

  // 5. Create Interview Categories & Questions (50 HR + 100 Technical = 150 total)
  const hrCategory = await prisma.interviewCategory.create({
    data: {
      name: 'HR Interview',
      slug: 'hr-interview',
      type: 'HR',
      description: 'Common behavioral, personal, and motivational questions asked by HR recruiters.',
    },
  });

  const technicalCategories = await Promise.all([
    prisma.interviewCategory.create({ data: { name: 'Python', slug: 'python', type: 'TECHNICAL', description: 'Python syntax, OOP, libraries, data structures, and async programming.' } }),
    prisma.interviewCategory.create({ data: { name: 'Java', slug: 'java', type: 'TECHNICAL', description: 'Core Java, JVM memory model, multi-threading, Spring framework, and OOP.' } }),
    prisma.interviewCategory.create({ data: { name: 'C / C++', slug: 'cpp', type: 'TECHNICAL', description: 'Pointers, memory allocation, STL containers, and low-level optimization.' } }),
    prisma.interviewCategory.create({ data: { name: 'SQL & Databases', slug: 'sql', type: 'TECHNICAL', description: 'Relational DB design, joins, indexing, normalization, and ACID properties.' } }),
    prisma.interviewCategory.create({ data: { name: 'Data Structures & Algorithms', slug: 'dsa', type: 'TECHNICAL', description: 'Arrays, trees, graphs, dynamic programming, sorting, and complexity.' } }),
    prisma.interviewCategory.create({ data: { name: 'Web Development', slug: 'web-dev', type: 'TECHNICAL', description: 'HTML5, CSS3, JavaScript, React, REST APIs, HTTP, and browser performance.' } }),
    prisma.interviewCategory.create({ data: { name: 'SAP ABAP', slug: 'sap-abap', type: 'TECHNICAL', description: 'ABAP dictionary, reports, BAPIs, BADIs, smartforms, and module pool programming.' } }),
    prisma.interviewCategory.create({ data: { name: 'Machine Learning & AI', slug: 'ml-ai', type: 'TECHNICAL', description: 'Supervised/unsupervised learning, neural networks, feature engineering, and LLMs.' } }),
    prisma.interviewCategory.create({ data: { name: 'Cyber Security', slug: 'cyber-security', type: 'TECHNICAL', description: 'Network security, cryptography, vulnerability assessment, OWASP Top 10.' } }),
    prisma.interviewCategory.create({ data: { name: 'Cloud Computing', slug: 'cloud', type: 'TECHNICAL', description: 'AWS, Azure, Docker, Kubernetes, microservices, and CI/CD pipelines.' } }),
  ]);

  // HR Questions (50 questions generated)
  const hrQuestionsList = [
    'Tell me about yourself.',
    'What are your greatest strengths?',
    'What is your biggest weakness and how do you manage it?',
    'Where do you see yourself in five years?',
    'Why do you want to work for our company?',
    'Describe a time you dealt with a difficult team member.',
    'How do you handle high pressure or tight deadlines?',
    'Why should we hire you over other candidate graduates?',
    'What is your expected CTC / Salary expectation?',
    'Describe a college project you are most proud of.',
    'How do you handle constructive feedback or criticism?',
    'Are you willing to relocate or work in rotational shifts?',
    'What motivates you to perform your best work?',
    'Describe a situation where you made a mistake and how you rectified it.',
    'How do you prioritize multiple urgent assignments?',
    'What do you know about our company values and recent news?',
    'Have you ever taken a leadership role in a college event?',
    'How do you stay updated with industry trends?',
    'What does successful teamwork mean to you?',
    'How do you handle disagreements with team leaders?',
    'What is your ideal work environment?',
    'What was your favorite subject in college and why?',
    'How do you balance academic studies with extracurriculars?',
    'Describe a situation where you had to learn a skill quickly.',
    'What are your career goals for the next two years?',
    'How do you define personal success?',
    'Describe a time you failed to meet a goal and what you learned.',
    'What would your college teammates say about working with you?',
    'How do you maintain enthusiasm during repetitive tasks?',
    'What steps do you take when you encounter a problem you cannot solve alone?',
    'Explain a complex topic to someone with no technical background.',
    'How do you stay organized during multi-project sprints?',
    'What values are most important to you in a employer?',
    'Describe your experience participating in hackathons or coding contests.',
    'How do you build trust with new colleagues?',
    'What is one project feature you wish you built differently?',
    'How do you prepare before giving a technical presentation?',
    'What do you do when requirements change mid-way through a project?',
    'How do you manage stress outside of work and college?',
    'Why did you choose your engineering department branch?',
    'Describe a time you mentored or helped a junior student.',
    'How do you verify the quality of your work before submission?',
    'What would you do if assigned a project using a technology you dislike?',
    'What active certifications or online courses have you completed recently?',
    'How do you approach goal setting at the start of a semester?',
    'What key lesson did you learn from your college internship?',
    'How do you stay focused when working remotely from home?',
    'What makes you stand out from other students in your batch?',
    'Do you have any questions for us regarding the role or company?',
    'How soon can you join if selected during campus placement?',
  ];

  for (const q of hrQuestionsList) {
    await prisma.interviewQuestion.create({
      data: {
        categoryId: hrCategory.id,
        questionText: q,
        difficulty: 'Intermediate',
        estimatedMinutes: 3,
        sampleAnswer: `Start with your current background, highlight 2-3 relevant projects or achievements, explain your passion for the domain, and conclude with why this specific role matches your career objectives.`,
        keyPointsJson: JSON.stringify(['Clear background summary', 'Relevant achievements', 'Positive enthusiastic tone', 'STAR format']),
      },
    });
  }
  console.log('✅ Created 50 HR Interview questions.');

  // Technical Questions (10 questions per technical category = 100 questions)
  for (const cat of technicalCategories) {
    for (let k = 1; k <= 10; k++) {
      await prisma.interviewQuestion.create({
        data: {
          categoryId: cat.id,
          questionText: `Explain key concept #${k} in ${cat.name} and provide a practical real-world application example.`,
          difficulty: k > 7 ? 'Advanced' : k > 3 ? 'Intermediate' : 'Beginner',
          estimatedMinutes: 4,
          sampleAnswer: `In ${cat.name}, concept #${k} plays a critical role in optimizing performance, maintaining clean architecture, and enabling scalable software operations.`,
          keyPointsJson: JSON.stringify(['Technical accuracy', 'Code structure', 'Performance awareness', 'Real-world example']),
        },
      });
    }
  }
  console.log('✅ Created 100 Technical Interview questions across 10 categories.');

  // 6. Create Campus Challenges
  const campusCategories = [
    { title: 'CSE Interview Preparation', cat: 'Technical', dept: departments[0], total: 100 },
    { title: 'Python Core & Advanced Questions', cat: 'Programming', dept: departments[0], total: 80 },
    { title: 'Java & Spring Boot Fundamentals', cat: 'Programming', dept: departments[0], total: 90 },
    { title: 'SAP ABAP Module & Reports Practice', cat: 'Enterprise Software', dept: departments[2], total: 100 },
    { title: 'ServiceNow System Admin & Scripting', cat: 'Cloud Platforms', dept: departments[2], total: 75 },
    { title: 'Cyber Security & Network Defense', cat: 'Security', dept: departments[1], total: 60 },
    { title: 'Data Science & Machine Learning Pipeline', cat: 'AI', dept: departments[0], total: 85 },
    { title: 'ECE Microcontrollers & Embedded Systems', cat: 'Hardware', dept: departments[1], total: 70 },
    { title: 'HR & Behavioral Placement Sprint', cat: 'Placement Prep', dept: departments[0], total: 50 },
    { title: 'Quantitative Aptitude & Logical Reasoning', cat: 'Aptitude', dept: departments[3], total: 120 },
    { title: 'Communication Skills Assessment', cat: 'Soft Skills', dept: departments[4], total: 50 },
  ];

  for (const c of campusCategories) {
    await prisma.campusChallenge.create({
      data: {
        title: c.title,
        description: `Comprehensive practice challenge tailored for ${c.dept.name} campus placement preparation.`,
        category: c.cat,
        departmentId: c.dept.id,
        totalQuestions: c.total,
        difficulty: 'Intermediate',
      },
    });
  }
  console.log('✅ Created Campus Challenges.');

  // 7. Create 10 Learning Content items
  const learningItems = [
    { title: 'How to Introduce Yourself in an Interview', cat: 'Interview Preparation', desc: 'Master the perfect 90-second self-introduction for campus placements.', mins: 5, icon: 'UserCheck' },
    { title: 'Mastering the STAR Framework for Behavioral Questions', cat: 'Interview Preparation', desc: 'Structure your answers cleanly using Situation, Task, Action, and Result.', mins: 7, icon: 'Award' },
    { title: 'Top 10 Communication Mistakes Students Make', cat: 'Communication', desc: 'Learn how to avoid filler words, monotone voice, and awkward pauses.', mins: 6, icon: 'MessageCircle' },
    { title: 'Building an ATS-Friendly Tech Resume in 2026', cat: 'Resume Building', desc: 'Format your GitHub projects, skills, and education for automated recruiters.', mins: 8, icon: 'FileText' },
    { title: 'Confidence Building Techniques Before Group Discussions', cat: 'Soft Skills', desc: 'Proven mental preparation frameworks to speak effectively in GDs.', mins: 5, icon: 'Users' },
    { title: 'Aptitude Quick Tricks: Time, Speed & Distance', cat: 'Aptitude', desc: 'Shortcut formulas to solve placement quantitative questions in 30 seconds.', mins: 10, icon: 'Zap' },
    { title: 'How to Answer "What Is Your Greatest Weakness?"', cat: 'Interview Preparation', desc: 'Turn weak points into compelling growth stories that recruiters respect.', mins: 5, icon: 'ShieldAlert' },
    { title: 'Body Language & Virtual Interview Etiquette', cat: 'Placement Preparation', desc: 'Eye contact, webcam framing, mic settings, and professional posture.', mins: 6, icon: 'Video' },
    { title: 'English Vocabulary Boost for Technical Presentations', cat: 'English', desc: 'Expand your transition phrases and active verbs for team presentations.', mins: 8, icon: 'BookOpen' },
    { title: 'How to Explain Complex Code During Technical Rounds', cat: 'Technical Skills', desc: 'Walk recruiters through algorithm logic step-by-step cleanly.', mins: 9, icon: 'Code' },
  ];

  for (const l of learningItems) {
    await prisma.learningContent.create({
      data: {
        title: l.title,
        description: l.desc,
        category: l.cat,
        estimatedMinutes: l.mins,
        difficulty: 'Beginner',
        iconName: l.icon,
        bodyText: `# ${l.title}\n\n${l.desc}\n\n## Key Takeaways\n- Be clear and concise.\n- Practice out loud before your actual interview.\n- Focus on quantifiable achievements and positive energy.\n\n## Practice Exercise\nRecord a 60-second response applying these principles right now in the SkillSprint Speaking Challenges tab!`,
      },
    });
  }
  console.log('✅ Created 10 Learning Content guides.');

  // 8. Create Announcements
  await prisma.announcement.create({
    data: {
      title: '🚀 SkillSprint Campus Drive 2026 Season Is Live!',
      content: 'Welcome students! Start completing your daily speaking challenges and HR practice rounds to boost your placement readiness score.',
      isImportant: true,
      author: 'Placement Cell Faculty',
    },
  });

  await prisma.announcement.create({
    data: {
      title: '📊 Weekly Leaderboard Reset & New Badges',
      content: 'Weekly scores update every Monday. Top 3 ranked students per department earn Placement Ready Honor Badges.',
      isImportant: false,
      author: 'SkillSprint Admin',
    },
  });

  console.log('✅ Created Announcements.');

  console.log('\n🎉 SkillSprint Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
