import { useState, useEffect } from 'react';
import axios from 'axios';
import StockSelector from './components/StockSelector';
import PredictionCard from './components/PredictionCard';
import PriceChart from './components/PriceChart';
import SentimentCard from './components/SentimentCard';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

function App() {
  const [predictionData, setPredictionData] = useState(null);
  const [sentimentData, setSentimentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modelType, setModelType] = useState('linear');

  const [isComparing, setIsComparing] = useState(false);
  const [predictionData2, setPredictionData2] = useState(null);
  const [sentimentData2, setSentimentData2] = useState(null);
  const [loading2, setLoading2] = useState(false);

  // Watchlist State
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem('watchlist');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn("Watchlist parse error", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = (symbol) => {
    setWatchlist(prev =>
      prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const handleSelectStock = async (symbol) => {
    setLoading(true);
    setError(null);
    setPredictionData(null);
    setSentimentData(null);

    try {
      const predRes = await axios.get(`http://127.0.0.1:8000/api/predict/${symbol}?model_type=${modelType}`);
      setPredictionData(predRes.data);

      try {
        const sentRes = await axios.get(`http://127.0.0.1:8000/api/sentiment/${symbol}`);
        setSentimentData(sentRes.data);
      } catch (sentErr) {
        console.warn("Sentiment fetch failed (optional feature):", sentErr);
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to fetch prediction.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStock2 = async (symbol) => {
    setLoading2(true);
    setPredictionData2(null);
    setSentimentData2(null);
    try {
      const predRes = await axios.get(`http://127.0.0.1:8000/api/predict/${symbol}?model_type=${modelType}`);
      setPredictionData2(predRes.data);

      try {
        const sentRes = await axios.get(`http://127.0.0.1:8000/api/sentiment/${symbol}`);
        setSentimentData2(sentRes.data);
      } catch (e) {
        console.warn("Sentiment 2 failed", e);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading2(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8 font-sans selection:bg-primary/20">
      <div className="max-w-6xl mx-auto">

        <header className="mb-8 text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block p-3 rounded-2xl bg-primary/10 mb-4 ring-1 ring-primary/20">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Indian Stock Predictor
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto text-lg mt-4">
              AI-powered forecasting for NIFTY 50 stocks using <span className="text-primary font-medium">Linear Regression</span> & <span className="text-primary font-medium">Deep Learning (LSTM)</span>
            </p>
          </motion.div>
        </header>

        {/* Global Controls */}
        <div className="flex justify-center mb-8 gap-4">
          <button
            onClick={() => setIsComparing(!isComparing)}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${isComparing ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent border-border hover:bg-secondary'
              }`}
          >
            {isComparing ? 'Exit Comparison' : 'Compare Stocks'}
          </button>
        </div>

        {/* WATCHLIST QUICK ACCESS (Global) */}
        {!isComparing && watchlist.length > 0 && (
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {watchlist.map(symbol => (
              <button
                key={symbol}
                onClick={() => handleSelectStock(symbol)}
                className="px-3 py-1 bg-secondary hover:bg-secondary/80 rounded-full text-xs font-medium transition-colors border border-border flex items-center gap-1"
              >
                {symbol}
                <span className="text-muted-foreground hover:text-red-400 ml-1" onClick={(e) => { e.stopPropagation(); toggleWatchlist(symbol); }}>×</span>
              </button>
            ))}
          </div>
        )}

        {isComparing ? (
          /* ================= COMPARISON MODE LAYOUT ================= */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* STOCK 1 */}
            <div className="flex flex-col gap-6">
              <div className="relative z-50">
                <StockSelector onSelect={handleSelectStock} modelType={modelType} setModelType={setModelType} watchlist={watchlist} toggleWatchlist={toggleWatchlist} />
              </div>
              {loading && <LoadingSpinner message={modelType === 'lstm' ? "Training..." : "Analyzing..."} />}
              {error && <ErrorMessage message={error} />}

              {predictionData && !loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <PredictionCard data={predictionData} />
                  <SentimentCard sentiment={sentimentData} />
                  <PriceChart data={predictionData.chart_data} />
                </motion.div>
              )}
            </div>

            {/* STOCK 2 */}
            <div className="flex flex-col gap-6 lg:pl-8 lg:border-l border-border/50">
              <div className="bg-secondary/20 p-4 rounded-xl border border-dashed border-border text-center relative z-40">
                <p className="text-sm text-muted-foreground mb-2">Select Comparison Target</p>
                <StockSelector onSelect={handleSelectStock2} modelType={modelType} setModelType={setModelType} watchlist={watchlist} toggleWatchlist={toggleWatchlist} />
              </div>
              {loading2 && <LoadingSpinner message="Analyzing..." />}

              {predictionData2 && !loading2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <PredictionCard data={predictionData2} />
                  <SentimentCard sentiment={sentimentData2} />
                  <PriceChart data={predictionData2.chart_data} />
                </motion.div>
              )}
            </div>
          </div>
        ) : (
          /* ================= SINGLE MODE LAYOUT (Vertical Flow) ================= */
          <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            {/* 1. Selector */}
            <div className="relative z-50">
              <StockSelector onSelect={handleSelectStock} modelType={modelType} setModelType={setModelType} watchlist={watchlist} toggleWatchlist={toggleWatchlist} />
            </div>

            {loading && <LoadingSpinner message={modelType === 'lstm' ? "Training..." : "Analyzing..."} />}
            {error && <ErrorMessage message={error} />}

            {predictionData && !loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">

                {/* 2. Cards Row (Prediction + Sentiment) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <PredictionCard data={predictionData} />
                  <SentimentCard sentiment={sentimentData} />
                </div>

                {/* 3. Full Width Chart */}
                <div>
                  <PriceChart data={predictionData.chart_data} />
                </div>

              </motion.div>
            )}
          </div>
        )}

      </div>

      <footer className="py-8 text-center text-muted-foreground text-sm border-t border-border mt-20">
        <p>&copy; {new Date().getFullYear()} StockAI Predictor. Data provided by Yahoo Finance.</p>
      </footer>
    </div>
  );
}

// Simple Helper Components for cleaner JSX
const LoadingSpinner = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-12 space-y-4">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    <p className="text-muted-foreground animate-pulse">{message}</p>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg text-center my-4">
    {message}
  </div>
);

export default App;
