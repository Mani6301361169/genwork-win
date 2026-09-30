export interface User {
  id: string;
  email: string;
  role: 'STUDENT' | 'ADMIN' | 'SUPER_ADMIN';
  profile?: StudentProfile;
}

export interface Department {
  id: string;
  code: string;
  name: string;
}

export interface StudentProfile {
  id: string;
  studentId: string;
  fullName: string;
  phone?: string;
  college: string;
  departmentId: string;
  department: Department;
  academicYear: string;
  graduationYear: number;
  totalXP: number;
  currentStreak: number;
  bestScore: number;
  overallScore: number;
  speakingScore: number;
  interviewScore: number;
  technicalScore: number;
  confidenceScore: number;
  avatarUrl?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationSeconds: number;
  topicType: string;
  isCompleted?: boolean;
}

export interface ChallengeAttempt {
  id: string;
  challengeName: string;
  category: string;
  duration: string;
  date: string;
  score: number;
  status: string;
  transcript: string;
  strongestArea: string;
  focusArea: string;
  feedback: {
    strengths: string[];
    improvements: string[];
    nextPracticeRecommendation: string;
  };
  metrics: {
    fluency: number;
    grammar: number;
    vocabulary: number;
    pronunciation: number;
    relevance: number;
    confidence: number;
    structure: number;
  };
}

export interface InterviewCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: string;
  totalQuestions: number;
}

export interface InterviewQuestion {
  id: string;
  categoryId: string;
  questionText: string;
  difficulty: string;
  estimatedMinutes: number;
  sampleAnswer: string;
  keyPointsJson: string;
}

export interface CampusChallenge {
  id: string;
  title: string;
  description: string;
  category: string;
  department: string;
  departmentCode: string;
  totalQuestions: number;
  completed: number;
  remaining: number;
  difficulty: string;
}

export interface LearningContent {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedMinutes: number;
  difficulty: string;
  bodyText: string;
  iconName: string;
}

export interface LeaderboardEntry {
  rank: number;
  studentName: string;
  department: string;
  departmentCode: string;
  academicYear: string;
  score: number;
  speakingScore: number;
  interviewScore: number;
  challengesCompleted: number;
  streak: number;
  isCurrentUser: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  isImportant: boolean;
  createdAt: string;
}
