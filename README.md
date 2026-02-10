# Indian Stock Market Predictor 📈

An advanced, AI-powered web application for predicting Indian stock prices (NIFTY 50). This full-stack application combines machine learning models with real-time sentiment analysis to provide comprehensive market insights.

![Project Banner](frontend/src/assets/Indian%20Stock%20Market%20Predictor%20-%20LOGO.png)

## 🚀 Key Features

### 🤖 AI-Powered Predictions
- **Dual Model System**:
  - **Linear Regression**: Fast, trend-based predictions.
  - **LSTM Neural Network**: Deep learning for complex time-series forecasting.
- **Model Persistence**: Automatically saves trained models for instant subsequent load times.

### 🧠 Sentiment Analysis
- **Real-Time News**: Fetches latest financial headlines for specific stocks.
- **Smart Scoring**: Uses VADER NLP to assign Bullish/Bearish scores to news.
- **Market Pulse**: Dedicated News page tracking sector performance and global trends.

### 📊 Interactive Dashboard
- **Advanced Charts**: Interactive price charts with zoom, panner, and tooltips.
- **Technical Indicators**: Toggle RSI (Relative Strength Index) and MACD overlays.
- **Comparison Mode**: Split-screen view to compare two stocks side-by-side.
- **Watchlist**: Save your favorite stocks for quick access (persisted locally).

### 🌐 Modern Architecture
- **Multi-Page Layout**: Landing, Dashboard, News, Features, and About pages.
- **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile.
- **Premium UI**: Glassmorphism effects, skeleton loaders, and smooth frame-motion animations.

---

## 🛠️ Tech Stack

### Frontend
- **React (Vite)**: Fast, modern UI framework.
- **Tailwind CSS**: Utility-first styling for a custom, premium look.
- **Framer Motion**: Production-ready animations.
- **Recharts**: Composable charting library.
- **Lucide React**: Beautiful, consistent icons.

### Backend
- **FastAPI**: High-performance Python web framework.
- **TensorFlow/Keras**: For LSTM model training and inference.
- **Scikit-Learn**: For Linear Regression and data preprocessing.
- **yFinance**: For fetching real-time stock market data.
- **VADER Sentiment**: For natural language processing of news.

---

## ⚡ Quick Start

### Prerequisites
- Node.js & npm
- Python 3.8+

### One-Command Launch (Recommended)
We have streamlined the startup process. You only need to run **one command** in the root directory to start both the Frontend and Backend servers simultaneously.

1. Open your terminal in the project root (`d:\Projects\Stock Market`).
2. Run:
   ```bash
   npm start
   ```
3. The app will open automatically in your browser at `http://localhost:5173`.

### Manual Setup (Legacy)
If you prefer to run servers separately:

**Backend:**
```bash
cd backend
venv\Scripts\activate
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm run dev
```

---

## 📂 Project Structure

```
/
├── backend/                 # FastAPI Python Server
│   ├── models/              # Saved .keras and .pkl models
│   ├── main.py              # API Entry Point
│   ├── stocks.py            # NIFTY 50 Stock List
│   └── sentiment.py         # News & NLP Logic
│
├── frontend/                # React Vite Application
│   ├── src/
│   │   ├── components/      # Reusable UI (Navbar, Charts, Cards)
│   │   ├── pages/           # Route Pages (Dashboard, News, Landing)
│   │   └── ...
│   └── package.json
│
├── package.json             # Root config for "npm start"
└── README.md                # Documentation
```

## 📝 License
This project is open-source and available under the MIT License.