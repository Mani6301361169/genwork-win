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
