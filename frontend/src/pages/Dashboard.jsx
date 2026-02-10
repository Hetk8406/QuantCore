import { useState, useEffect } from 'react';
import axios from 'axios';
import StockSelector from '../components/StockSelector';
import PredictionCard from '../components/PredictionCard';
import PriceChart from '../components/PriceChart';
import SentimentCard from '../components/SentimentCard';
import { motion } from 'framer-motion';

import DashboardSkeleton from '../components/DashboardSkeleton';

function Dashboard() {
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
        <div className="min-h-screen bg-background text-foreground p-4 pt-32 md:px-8 md:pb-8 md:pt-32 font-sans selection:bg-primary/20">
            <div className="max-w-7xl mx-auto">

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

                {isComparing ? (
                    /* ================= COMPARISON MODE LAYOUT ================= */
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* STOCK 1 */}
                        <div className="flex flex-col gap-6">
                            <div className="relative z-50">
                                <StockSelector onSelect={handleSelectStock} modelType={modelType} setModelType={setModelType} watchlist={watchlist} toggleWatchlist={toggleWatchlist} />
                            </div>
                            {loading && <DashboardSkeleton />}
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
                            {loading2 && <DashboardSkeleton />}

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
                    /* ================= SINGLE MODE LAYOUT ================= */
                    <div className="flex flex-col gap-8 max-w-4xl mx-auto min-h-[600px]">

                        {/* Standard Header */}
                        <div className="relative z-50">
                            <StockSelector onSelect={handleSelectStock} modelType={modelType} setModelType={setModelType} watchlist={watchlist} toggleWatchlist={toggleWatchlist} />
                        </div>

                        {loading && <DashboardSkeleton />}
                        {error && <ErrorMessage message={error} />}

                        {predictionData && !loading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <PredictionCard data={predictionData} />
                                    <SentimentCard sentiment={sentimentData} />
                                </div>
                                <div>
                                    <PriceChart data={predictionData.chart_data} />
                                </div>
                            </motion.div>
                        )}

                        {/* Placeholder if nothing selected? Or just leave blank below selector */}
                        {!predictionData && !loading && (
                            <div className="flex flex-col items-center justify-center text-center mt-20 opacity-50 space-y-4">
                                <div className="p-4 bg-secondary/30 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                    </svg>
                                </div>
                                <p className="text-muted-foreground text-lg">Select a stock to view analysis</p>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

// Simple Helper Components for cleaner JSX
const ErrorMessage = ({ message }) => (
    <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg text-center my-4">
        {message}
    </div>
);

export default Dashboard;
