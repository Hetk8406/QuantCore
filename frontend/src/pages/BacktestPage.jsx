import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import axios from 'axios';
import StockSelector from '../components/StockSelector';
import DashboardSkeleton from '../components/DashboardSkeleton';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { History, TrendingUp, AlertCircle, CheckCircle, Zap, FastForward } from 'lucide-react';

const BacktestPage = () => {
    const [selectedStock, setSelectedStock] = useState(null);
    const [days, setDays] = useState(30);
    const [modelType, setModelType] = useState('linear');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    // 3D Motion Values
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 100, damping: 30 });
    const springY = useSpring(y, { stiffness: 100, damping: 30 });
    const rotateX = useTransform(springY, [-0.5, 0.5], [7, -7]);
    const rotateY = useTransform(springX, [-0.5, 0.5], [-7, 7]);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        x.set((clientX / innerWidth) - 0.5);
        y.set((clientY / innerHeight) - 0.5);
    };

    // Watchlist State (reused)
    const [watchlist, setWatchlist] = useState(() => {
        try {
            const saved = localStorage.getItem('watchlist');
            const parsed = saved ? JSON.parse(saved) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
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

    const handleRunBacktest = async (symbol) => {
        if (!symbol) return;
        const currentSymbol = typeof symbol === 'string' ? symbol : symbol.symbol;
        setSelectedStock(currentSymbol);
        setLoading(true);
        setError(null);

        try {
            const res = await axios.get(`/api/backtest/${currentSymbol}?days=${days}&model_type=${modelType}`);
            setResult(res.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || "Failed to run backtest simulation.");
        } finally {
            setLoading(false);
        }
    };

    // Auto re-run when days or modelType changes
    useEffect(() => {
        if (selectedStock) {
            handleRunBacktest(selectedStock);
        }
    }, [days, modelType]);

    return (
        <div 
            onMouseMove={handleMouseMove}
            className="min-h-screen bg-[#020617] text-foreground pt-32 pb-20 px-6 font-sans selection:bg-primary/20 relative overflow-hidden"
            style={{ perspective: "1500px" }}
        >
            {/* 3D Time Tunnel Background Effect */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,#1e293b_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] opacity-20 transform-gpu" style={{ transform: "rotateX(60deg) translateZ(-200px)" }} />
                
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]" 
                />
            </div>

            <div className="max-w-6xl mx-auto space-y-12 relative z-10">

                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest"
                    >
                        <History className="w-4 h-4" /> Lab: Backtesting Engine
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                        History <span className="text-primary italic">Simulator</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto font-medium">
                        Stress-test AI algorithms against the high-frequency volatility of the Indian Stock Market. 
                        Validating patterns across 90-day execution windows.
                    </p>
                </div>

                {/* Controls */}
                <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl relative z-[100]">
                    <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                        <div className="w-full md:w-96 relative z-[110]">
                            <StockSelector
                                onSelect={handleRunBacktest}
                                watchlist={watchlist}
                                toggleWatchlist={toggleWatchlist}
                                modelType={modelType}
                                setModelType={setModelType}
                            />
                        </div>

                        <div className="flex items-center gap-2 bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700 shadow-inner">
                            {[30, 60, 90].map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setDays(d)}
                                    className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-all tracking-wider uppercase ${days === d ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-105' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                        }`}
                                >
                                    {d} Days
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results Area */}
                <div className="relative z-10">
                    {loading && <DashboardSkeleton />}

                    {error && (
                        <div className="p-6 bg-destructive/10 text-destructive rounded-2xl border border-destructive/20 text-center flex items-center justify-center gap-3 font-bold backdrop-blur-md">
                            <AlertCircle className="w-5 h-5" /> {error}
                        </div>
                    )}

                    {result && !loading && (
                        <motion.div
                            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-10"
                        >
                            {/* KPI Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div style={{ transform: "translateZ(30px)" }} className="bg-slate-900/50 p-8 rounded-[2rem] border border-slate-800 flex flex-col items-center justify-center text-center shadow-xl backdrop-blur-md">
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Simulation Period</h3>
                                    <p className="text-3xl font-black text-white">{result.days} <span className="text-sm font-bold text-slate-500">Days</span></p>
                                </div>
                                <div style={{ transform: "translateZ(80px)" }} className="bg-slate-900/80 p-8 rounded-[2rem] border border-primary/30 flex flex-col items-center justify-center text-center shadow-[0_0_50px_rgba(59,130,246,0.1)] backdrop-blur-2xl ring-1 ring-primary/20">
                                    <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                        <Zap className="w-3 h-3 fill-primary" /> {modelType === 'linear' ? 'Linear' : 'Advanced'} Accuracy
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <p className={`text-5xl font-black ${result.accuracy >= 80 ? 'text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]' :
                                                result.accuracy >= 50 ? 'text-yellow-500' : 'text-red-500'
                                            }`}>
                                            {result.accuracy}%
                                        </p>
                                    </div>
                                </div>
                                <div style={{ transform: "translateZ(30px)" }} className="bg-slate-900/50 p-8 rounded-[2rem] border border-slate-800 flex flex-col items-center justify-center text-center shadow-xl backdrop-blur-md">
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Execution</h3>
                                    <div className="flex items-center gap-2 text-emerald-400 font-black text-sm tracking-tight">
                                        <CheckCircle className="w-5 h-5" /> VALIDATED
                                    </div>
                                </div>
                            </div>

                            {/* Chart */}
                            <motion.div 
                                style={{ transform: "translateZ(10px)" }}
                                className="bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[3rem] border border-slate-800 shadow-2xl h-[550px]"
                            >
                                <h3 className="text-xl font-black mb-8 flex items-center gap-3 tracking-tight">
                                    <div className="p-2 bg-primary/20 rounded-lg">
                                        <TrendingUp className="w-5 h-5 text-primary" />
                                    </div>
                                    Performance Matrix ({modelType === 'linear' ? 'Standard' : 'Advanced'})
                                </h3>
                                <ResponsiveContainer width="100%" height="85%">
                                    <AreaChart data={result.data}>
                                        <defs>
                                            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            stroke="#64748b"
                                            fontSize={10}
                                            fontWeight={700}
                                            tickFormatter={(str) => str.slice(5)}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            domain={['auto', 'auto']}
                                            stroke="#64748b"
                                            fontSize={10}
                                            fontWeight={700}
                                            tickFormatter={(val) => `₹${val}`}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={{ 
                                                backgroundColor: '#0f172a', 
                                                borderRadius: '20px', 
                                                border: '1px solid #334155', 
                                                color: '#f8fafc',
                                                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                                                padding: '15px'
                                            }}
                                            itemStyle={{ fontWeight: 800 }}
                                        />
                                        <Legend verticalAlign="top" height={40} iconType="circle" />
                                        <Area
                                            type="monotone"
                                            dataKey="actual"
                                            name="Historical Close"
                                            stroke="#3b82f6"
                                            fill="url(#colorActual)"
                                            strokeWidth={3}
                                            animationDuration={2000}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="predicted"
                                            name={`${modelType === 'linear' ? 'Linear' : 'Advanced'} Pred`}
                                            stroke="#8b5cf6"
                                            fill="url(#colorPred)"
                                            strokeWidth={3}
                                            strokeDasharray="6 6"
                                            animationDuration={2500}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </motion.div>
                        </motion.div>
                    )}
                </div>

                {/* Empty State / Initial View */}
                {!result && !loading && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        className="flex flex-col items-center justify-center text-center mt-20 space-y-8"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                            <div className="relative p-10 bg-slate-900/50 rounded-[3rem] border border-slate-800 shadow-inner">
                                <FastForward className="h-16 w-16 text-slate-500 animate-pulse" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-2xl font-black text-white tracking-tight">Simulator Standby</h2>
                            <p className="text-slate-500 max-w-sm mx-auto text-sm font-medium">Select a ticker to load historical price sequences into the neural simulator.</p>
                        </div>
                    </motion.div>
                )}

            </div>
        </div>
    );
};

export default BacktestPage;
