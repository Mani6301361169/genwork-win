# SkillSprint - Desktop Export & Data Package

Welcome to the **SkillSprint** complete data and codebase export folder on your Desktop!

## 📁 Directory Overview

- **exported_json_data/**: Full JSON exports of all platform database tables.
  - students.json (20 student profiles with credentials, department details, and metrics)
  - departments.json (5 college engineering/management departments)
  - challenges.json (30 speaking practice prompt challenges across categories)
  - challenge_attempts.json (Real NLP transcript score records)
  - interview_categories.json (Technical & HR interview topics)
  - interview_questions.json (150 technical and behavioral interview questions)
  - campus_challenges.json (Campus departmental challenges)
  - learning_content.json (Self-paced learning guides & modules)
  - leaderboard.json (Student ranking rankings)
  - nnouncements.json (Placement & campus announcements)
  - ull_database_dump.json (Single combined JSON file containing all data)

- **database/**:
  - dev.db: SQLite database populated with all seed data.
  - schema.prisma: Complete database relational schema definitions.

- **codebase/**: Full TypeScript source code for the React 18 frontend and Node.js Express backend.

---

## 🚀 How to Run the App

1. Double click **START_SKILLSPRINT.bat** in this folder.
2. Open your browser at:
   - **Frontend UI**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🔑 Demo Login Accounts

| Role | Email | Password |
|---|---|---|
| Student | run.v@college.edu | Student123! |
| Student | priya.s@college.edu | Student123! |
| Admin / Faculty | dmin@skillsprint.edu | Admin123! |
