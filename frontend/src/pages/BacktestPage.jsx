import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import StockSelector from '../components/StockSelector';
import DashboardSkeleton from '../components/DashboardSkeleton';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { History, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const BacktestPage = () => {
    const [selectedStock, setSelectedStock] = useState(null);
    const [days, setDays] = useState(30);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

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
        setSelectedStock(symbol);
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/backtest/${symbol}?days=${days}`);
            setResult(res.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || "Failed to run backtest simulation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground pt-32 pb-20 px-6 font-sans selection:bg-primary/20">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                    >
                        <History className="w-4 h-4" /> Time Machine
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                        Backtesting Simulator
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Test our AI model against historical data. See how accurate the predictions would have been if you traded in the past.
                    </p>
                </div>

                {/* Controls */}
                <div className="bg-card/30 p-6 rounded-2xl border border-border backdrop-blur-sm shadow-xl">
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                        <div className="w-full md:w-96 relative z-50">
                            <StockSelector
                                onSelect={handleRunBacktest}
                                watchlist={watchlist}
                                toggleWatchlist={toggleWatchlist}
                                modelType="linear" // Backtest uses Linear for speed
                                setModelType={() => { }} // No-op
                            />
                        </div>

                        <div className="flex items-center gap-2 bg-secondary/20 p-1 rounded-lg border border-border">
                            {[30, 60, 90].map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setDays(d)}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${days === d ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-secondary/50'
                                        }`}
                                >
                                    Last {d} Days
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results Area */}
                {loading && <DashboardSkeleton />}
                {/* We use dashboard skeleton as placeholder, or could make a simpler one */}

                {error && (
                    <div className="p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 text-center flex items-center justify-center gap-2">
                        <AlertCircle className="w-5 h-5" /> {error}
                    </div>
                )}

                {result && !loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                    >
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-card/50 p-6 rounded-2xl border border-border flex flex-col items-center justify-center text-center">
                                <h3 className="text-sm text-muted-foreground mb-1">Simulation Period</h3>
                                <p className="text-2xl font-bold">{result.days} Days</p>
                            </div>
                            <div className="bg-card/50 p-6 rounded-2xl border border-border flex flex-col items-center justify-center text-center">
                                <h3 className="text-sm text-muted-foreground mb-1">Model Accuracy</h3>
                                <div className="flex items-center gap-2">
                                    <p className={`text-4xl font-black ${result.accuracy >= 80 ? 'text-emerald-500' :
                                            result.accuracy >= 50 ? 'text-yellow-500' : 'text-red-500'
                                        }`}>
                                        {result.accuracy}%
                                    </p>
                                </div>
                            </div>
                            <div className="bg-card/50 p-6 rounded-2xl border border-border flex flex-col items-center justify-center text-center">
                                <h3 className="text-sm text-muted-foreground mb-1">Status</h3>
                                <div className="flex items-center gap-2 text-primary font-bold">
                                    <CheckCircle className="w-5 h-5" /> Completed
                                </div>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="bg-card/50 p-6 rounded-2xl border border-border h-[500px]">
                            <h3 className="text-lg font-bold mb-6">Actual vs Predicted Price</h3>
                            <ResponsiveContainer width="100%" height="90%">
                                <AreaChart data={result.data}>
                                    <defs>
                                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickFormatter={(str) => str.slice(5)}
                                    />
                                    <YAxis
                                        domain={['auto', 'auto']}
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickFormatter={(val) => `₹${val}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                                    />
                                    <Legend verticalAlign="top" height={36} />
                                    <Area
                                        type="monotone"
                                        dataKey="actual"
                                        name="Actual Price"
                                        stroke="#3b82f6"
                                        fill="url(#colorActual)"
                                        strokeWidth={2}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="predicted"
                                        name="Predicted Price"
                                        stroke="#10b981"
                                        fill="url(#colorPred)"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                )}

            </div>
        </div>
    );
};

export default BacktestPage;
