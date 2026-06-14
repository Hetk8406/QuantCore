import { useState, useEffect } from 'react';
import axios from 'axios';
import StockSelector from '../components/StockSelector';
import PredictionCard from '../components/PredictionCard';
import PriceChart from '../components/PriceChart';
import SentimentCard from '../components/SentimentCard';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

import DashboardSkeleton from '../components/DashboardSkeleton';
import SignalGauge from '../components/SignalGauge';
import { Activity, ShieldCheck, Database } from 'lucide-react';

function Dashboard() {
    const [predictionData, setPredictionData] = useState(null);
    const [sentimentData, setSentimentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modelType, setModelType] = useState('linear');

    // 3D Motion Values
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 100, damping: 30 });
    const springY = useSpring(y, { stiffness: 100, damping: 30 });
    const rotateX = useTransform(springY, [-0.5, 0.5], [5, -5]);
    const rotateY = useTransform(springX, [-0.5, 0.5], [-5, 5]);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        x.set((clientX / innerWidth) - 0.5);
        y.set((clientY / innerHeight) - 0.5);
    };

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
            const predRes = await axios.get(`/api/predict/${symbol}?model_type=${modelType}`);
            setPredictionData(predRes.data);

            try {
                const sentRes = await axios.get(`/api/sentiment/${symbol}`);
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

    return (
        <div 
            onMouseMove={handleMouseMove}
            className="min-h-screen bg-[#020617] text-foreground p-4 pt-32 md:px-8 md:pb-8 md:pt-32 font-sans selection:bg-primary/20 relative overflow-hidden"
            style={{ perspective: "1200px" }}
        >
            {/* Background 3D Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">

                <div className="flex flex-col gap-10 max-w-6xl mx-auto min-h-[600px]">

                    {/* Standard Header */}
                    <div className="relative z-[100] flex flex-col md:flex-row items-center gap-8 bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[3rem] border border-slate-800 shadow-2xl">
                        <div className="flex-grow w-full">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 ml-2">Primary Analysis Node</p>
                            <StockSelector onSelect={handleSelectStock} modelType={modelType} setModelType={setModelType} watchlist={watchlist} toggleWatchlist={toggleWatchlist} />
                        </div>
                        <div className="hidden md:flex flex-col items-end gap-2 pr-4 text-right">
                            <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                                <ShieldCheck className="w-4 h-4" /> System Verified
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest">
                                <Database className="w-4 h-4" /> Live NIFTY Data
                            </div>
                        </div>
                    </div>

                    {loading && <DashboardSkeleton />}
                    {error && <ErrorMessage message={error} />}

                    {predictionData && !loading && (
                        <motion.div 
                            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                            initial={{ opacity: 0, y: 30 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            className="space-y-10"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div style={{ transform: "translateZ(60px)" }}>
                                    <SignalGauge 
                                        signal={predictionData.signal} 
                                        score={predictionData.signal_score} 
                                        symbol={predictionData.symbol}
                                    />
                                </div>
                                <div style={{ transform: "translateZ(20px)" }}>
                                    <PredictionCard data={predictionData} />
                                </div>
                                <div style={{ transform: "translateZ(40px)" }}>
                                    <SentimentCard sentiment={sentimentData} />
                                </div>
                            </div>
                            <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden relative group">
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <PriceChart data={predictionData.chart_data} currencySymbol={predictionData.currency_symbol} />
                            </div>
                        </motion.div>
                    )}

                    {/* Placeholder if nothing selected */}
                    {!predictionData && !loading && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            className="flex flex-col items-center justify-center text-center mt-20 space-y-6"
                        >
                            <div className="p-8 bg-slate-900/50 rounded-[2rem] border border-slate-800 shadow-inner">
                                <Activity className="h-16 w-16 text-slate-600 animate-pulse" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-slate-400 text-xl font-bold tracking-tight">Terminal Ready</p>
                                <p className="text-slate-500 text-sm">Select a Global Market ticker to initialize AI analysis</p>
                            </div>
                        </motion.div>
                    )}
                </div>

            </div>
        </div>
    );
}

// Simple Helper Components for cleaner JSX
const ErrorMessage = ({ message }) => (
    <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl text-center my-4 font-medium backdrop-blur-md">
        {message}
    </div>
);

export default Dashboard;
