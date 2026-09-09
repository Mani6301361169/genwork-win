import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import { StudentLayout } from './layouts/StudentLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';

// Student Pages
import { Dashboard } from './pages/student/Dashboard';
import { SpeakingChallenges } from './pages/student/SpeakingChallenges';
import { SpeakingPracticeRoom } from './pages/student/SpeakingPracticeRoom';
import { InterviewPractice } from './pages/student/InterviewPractice';
import { InterviewSimulator } from './pages/student/InterviewSimulator';
import { CampusChallenges } from './pages/student/CampusChallenges';
import { LearningCenter } from './pages/student/LearningCenter';
import { Leaderboard } from './pages/student/Leaderboard';
import { MyScores } from './pages/student/MyScores';
import { History } from './pages/student/History';
import { FeedbackMentoring } from './pages/student/FeedbackMentoring';
import { Profile } from './pages/student/Profile';
import { Settings } from './pages/student/Settings';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminStudents } from './pages/admin/AdminStudents';
import { AdminChallenges } from './pages/admin/AdminChallenges';
import { AdminAnnouncements } from './pages/admin/AdminAnnouncements';
import { AdminFeedback } from './pages/admin/AdminFeedback';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Student Workspace */}
            <Route path="/student" element={<StudentLayout />}>
              <Route index element={<Navigate to="/student/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="challenges" element={<SpeakingChallenges />} />
              <Route path="challenges/:id" element={<SpeakingPracticeRoom />} />
              <Route path="interviews" element={<InterviewPractice />} />
              <Route path="simulator" element={<InterviewSimulator />} />
              <Route path="campus" element={<CampusChallenges />} />
              <Route path="learning" element={<LearningCenter />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="scores" element={<MyScores />} />
              <Route path="history" element={<History />} />
              <Route path="feedback" element={<FeedbackMentoring />} />
              <Route path="mentoring" element={<FeedbackMentoring />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Admin Workspace */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="challenges" element={<AdminChallenges />} />
              <Route path="announcements" element={<AdminAnnouncements />} />
              <Route path="feedback" element={<AdminFeedback />} />
            </Route>

            {/* Root & Catch-all Fallback */}
            <Route path="/" element={<Navigate to="/student/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
