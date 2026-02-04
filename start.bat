@echo off
echo Starting Indian Stock Price Prediction App...

:: Start Backend
start "Backend API" cmd /k "cd backend && venv\Scripts\activate && uvicorn main:app --reload"

:: Start Frontend
start "Frontend UI" cmd /k "cd frontend && npm run dev"

echo Servers started!
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:5173
echo.
echo Opening Website...
timeout /t 5
start http://localhost:5173
