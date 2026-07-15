@echo off
setlocal EnableExtensions

title HOPEX Development Environment

REM ============================================================
REM Resolve project paths relative to this script
REM ============================================================
set "FRONTEND_ROOT=%~dp0"
set "BACKEND_ROOT=%FRONTEND_ROOT%..\HopexBackend"
if not exist "%BACKEND_ROOT%\package.json" (
    echo [ERROR] Backend project not found:
    echo %BACKEND_ROOT%
    pause
    exit /b 1
)

if not exist "%FRONTEND_ROOT%expo-mobile-app\package.json" (
    echo [ERROR] expo-mobile-app not found.
    pause
    exit /b 1
)

if not exist "%FRONTEND_ROOT%expo-web-dashboard\package.json" (
    echo [ERROR] expo-web-dashboard not found.
    pause
    exit /b 1
)

if not exist "%FRONTEND_ROOT%hopex-landing-page-redesigned/hopex-landing-page\package.json" (
    echo [ERROR] hopex-landing-page not found.
    pause
    exit /b 1
)

echo Starting Backend...
start "Expo API" cmd /k "cd /d "%BACKEND_ROOT%" && npm run start:dev"

timeout /t 3 >nul

echo Starting Expo Mobile App...
start "Expo Mobile App" cmd /k "cd /d "%FRONTEND_ROOT%expo-mobile-app" && npm run dev -- --host"

timeout /t 1 >nul

echo Starting Expo Web Dashboard...
start "Expo Web Dashboard" cmd /k "cd /d "%FRONTEND_ROOT%expo-web-dashboard" && npm run dev"

timeout /t 1 >nul

echo Starting Hopex Landing Page...
start "Hopex Landing Page" cmd /k "cd /d "%FRONTEND_ROOT%hopex-landing-page-redesigned/hopex-landing-page" && npm run dev"

echo.
echo ============================================================
echo All projects started successfully.
echo ============================================================
echo.
echo Backend              : http://localhost:3000
echo Expo Mobile App      : http://localhost:5173
echo Expo Web Dashboard   : http://localhost:5180
echo Hopex Landing Page   : http://localhost:5174
echo.

pause