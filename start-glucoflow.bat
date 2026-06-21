@echo off
cd /d "C:\Users\22219\Documents\血糖app\GlucoFlow"
echo =====================================
echo   GlucoFlow - Starting...
echo =====================================
echo.
echo [1/2] Building web bundle...
call npx expo export --platform web > nul 2>&1
echo       Done!
echo.
echo [2/2] Starting server on http://localhost:3000
start http://localhost:3000
cd dist
node server.js
