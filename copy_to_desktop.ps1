# Script to copy all SkillSprint data, codebase, exports, and databases to Desktop

$DesktopPaths = @(
    "C:\Users\LENOVO\OneDrive\Desktop\SkillSprint_Data",
    "C:\Users\LENOVO\Desktop\SkillSprint_Data"
)

$SourceRoot = "C:\Users\LENOVO\OneDrive\Desktop\xyz\genwork-win"

foreach ($TargetDesktop in $DesktopPaths) {
    Write-Host "Creating Desktop folder at $TargetDesktop..."
    if (Test-Path $TargetDesktop) {
        Remove-Item -Path $TargetDesktop -Recurse -Force -ErrorAction SilentlyContinue
    }
    New-Item -ItemType Directory -Path $TargetDesktop -Force | Out-Null
    New-Item -ItemType Directory -Path "$TargetDesktop\exported_json_data" -Force | Out-Null
    New-Item -ItemType Directory -Path "$TargetDesktop\database" -Force | Out-Null
    New-Item -ItemType Directory -Path "$TargetDesktop\codebase" -Force | Out-Null

    # 1. Copy Exported JSON Data Files
    Write-Host "Copying exported JSON files..."
    Copy-Item -Path "$SourceRoot\backend\exported_data_json\*" -Destination "$TargetDesktop\exported_json_data" -Recurse -Force

    # 2. Copy Database & Schema
    Write-Host "Copying SQLite Database..."
    Copy-Item -Path "$SourceRoot\prisma\dev.db" -Destination "$TargetDesktop\database\dev.db" -Force
    Copy-Item -Path "$SourceRoot\prisma\schema.prisma" -Destination "$TargetDesktop\database\schema.prisma" -Force

    # 3. Copy Codebase
    Write-Host "Copying Codebase files..."
    Copy-Item -Path "$SourceRoot\package.json" -Destination "$TargetDesktop\codebase\package.json" -Force
    Copy-Item -Path "$SourceRoot\start_local.bat" -Destination "$TargetDesktop\codebase\start_local.bat" -Force

    # Prisma root folder
    New-Item -ItemType Directory -Path "$TargetDesktop\codebase\prisma" -Force | Out-Null
    Copy-Item -Path "$SourceRoot\prisma\*" -Destination "$TargetDesktop\codebase\prisma" -Recurse -Force

    # Backend
    New-Item -ItemType Directory -Path "$TargetDesktop\codebase\backend" -Force | Out-Null
    Copy-Item -Path "$SourceRoot\backend\src" -Destination "$TargetDesktop\codebase\backend\src" -Recurse -Force
    Copy-Item -Path "$SourceRoot\backend\package.json" -Destination "$TargetDesktop\codebase\backend\package.json" -Force
    Copy-Item -Path "$SourceRoot\backend\tsconfig.json" -Destination "$TargetDesktop\codebase\backend\tsconfig.json" -Force

    # Frontend
    New-Item -ItemType Directory -Path "$TargetDesktop\codebase\frontend" -Force | Out-Null
    Copy-Item -Path "$SourceRoot\frontend\src" -Destination "$TargetDesktop\codebase\frontend\src" -Recurse -Force
    if (Test-Path "$SourceRoot\frontend\public") {
        Copy-Item -Path "$SourceRoot\frontend\public" -Destination "$TargetDesktop\codebase\frontend\public" -Recurse -Force
    }
    Copy-Item -Path "$SourceRoot\frontend\package.json" -Destination "$TargetDesktop\codebase\frontend\package.json" -Force
    Copy-Item -Path "$SourceRoot\frontend\tsconfig.json" -Destination "$TargetDesktop\codebase\frontend\tsconfig.json" -Force
    Copy-Item -Path "$SourceRoot\frontend\vite.config.ts" -Destination "$TargetDesktop\codebase\frontend\vite.config.ts" -Force
    Copy-Item -Path "$SourceRoot\frontend\tailwind.config.js" -Destination "$TargetDesktop\codebase\frontend\tailwind.config.js" -Force
    Copy-Item -Path "$SourceRoot\frontend\postcss.config.js" -Destination "$TargetDesktop\codebase\frontend\postcss.config.js" -Force
    Copy-Item -Path "$SourceRoot\frontend\index.html" -Destination "$TargetDesktop\codebase\frontend\index.html" -Force

    # 4. Create START_SKILLSPRINT.bat batch file
    $BatContent = @"
@echo off
echo ===================================================
echo     SkillSprint College Student Career Platform
echo ===================================================
echo.
echo Starting SkillSprint Full-Stack Application...
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
echo.
cd /d "%~dp0codebase"
call npm run dev
pause
"@
    Set-Content -Path "$TargetDesktop\START_SKILLSPRINT.bat" -Value $BatContent

    # 5. Create README_DATA.md
    $ReadmeContent = @"
# SkillSprint - Desktop Export & Data Package

Welcome to the **SkillSprint** complete data and codebase export folder on your Desktop!

## 📁 Directory Overview

- **`exported_json_data/`**: Full JSON exports of all platform database tables.
  - `students.json` (20 student profiles with credentials, department details, and metrics)
  - `departments.json` (5 college engineering/management departments)
  - `challenges.json` (30 speaking practice prompt challenges across categories)
  - `challenge_attempts.json` (Real NLP transcript score records)
  - `interview_categories.json` (Technical & HR interview topics)
  - `interview_questions.json` (150 technical and behavioral interview questions)
  - `campus_challenges.json` (Campus departmental challenges)
  - `learning_content.json` (Self-paced learning guides & modules)
  - `leaderboard.json` (Student ranking rankings)
  - `announcements.json` (Placement & campus announcements)
  - `full_database_dump.json` (Single combined JSON file containing all data)

- **`database/`**:
  - `dev.db`: SQLite database populated with all seed data.
  - `schema.prisma`: Complete database relational schema definitions.

- **`codebase/`**: Full TypeScript source code for the React 18 frontend and Node.js Express backend.

---

## 🚀 How to Run the App

1. Double click **`START_SKILLSPRINT.bat`** in this folder.
2. Open your browser at:
   - **Frontend UI**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🔑 Demo Login Accounts

| Role | Email | Password |
|---|---|---|
| Student | `arun.v@college.edu` | `Student123!` |
| Student | `priya.s@college.edu` | `Student123!` |
| Admin / Faculty | `admin@skillsprint.edu` | `Admin123!` |
"@
    Set-Content -Path "$TargetDesktop\README_DATA.md" -Value $ReadmeContent

    Write-Host "Successfully created folder at $TargetDesktop!"
}
