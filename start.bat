@echo off

rem Navigate to backend, activate virtual environment, install dependencies, and start server
pushd "%~dp0backend"
call venv\Scripts\activate.bat
if "%errorlevel%" neq "0" (
    echo Failed to activate backend virtual environment.
    pause
    exit /b 1
)
pip install -r requirements.txt
start "Backend API" cmd /k "uvicorn main:app --reload"
popd

rem Navigate to frontend and start development server
pushd "%~dp0frontend"
start "Frontend UI" cmd /k "npm run dev"
popd

echo Servers started! && echo Backend: http://127.0.0.1:8000 && echo Frontend: http://localhost:5173
timeout /t 5
start "" "http://localhost:5173"
