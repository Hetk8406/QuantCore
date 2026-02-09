# Indian Stock Market Predictor 📈

An advanced AI-powered web application for predicting Indian stock prices (NIFTY 50).

## Features
- **AI Predictions**: Uses **LSTM (Deep Learning)** and **Linear Regression** to forecast prices.
- **Sentiment Analysis**: Analyzes news headlines to determine market mood (Bullish/Bearish).
- **Technical Indicators**: Interactive charts with RSI, MACD, and Moving Averages.
- **Comparison Mode**: Compare two stocks side-by-side.
- **Watchlist**: Save your favorite stocks for quick access.

## 🚀 How to Run

### Option 1: The Easy Way (Recommended)
Simply double-click the `start.bat` file in the main folder. It will automatically:
1. Start the Backend Server.
2. Start the Frontend Server.
3. Open the website in your browser.

---

### Option 2: Manual Terminal Commands

You need to open **two separate terminals**.

**Terminal 1: Backend (FastAPI)**
```bash
cd backend
venv\Scripts\activate
uvicorn main:app --reload
```
*Server will start at: http://127.0.0.1:8000*

**Terminal 2: Frontend (React)**
```bash
cd frontend
npm run dev
```
*Website will start at: http://localhost:5173*