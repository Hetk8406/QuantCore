import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import StockSelector from '../components/StockSelector';
import { Download, FileSpreadsheet, TrendingUp, AlertCircle, Target, Briefcase, Minus, CheckCircle } from 'lucide-react';

const PriceAnalysisPage = () => {
    const [selectedStock, setSelectedStock] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    // Watchlist state
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

    const fetchAnalysisData = async (symbol) => {
        if (!symbol) return;
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/analysis/${symbol}`);
            setResult(res.data);
            setSelectedStock(symbol);
        } catch (err) {
            setError(err.response?.data?.detail || "Error loading analysis data.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadCSV = () => {
        if (!result) return;
        
        const headers = ["Date", "Actual Close", "AI Prediction", "Accuracy (%)", "Daily Change (%)"];
        const rows = result.map(row => [
            row.date,
            row.actual_close,
            row.predicted_close || "N/A",
            row.accuracy || "N/A",
            row.daily_change_pct || "0.00"
        ]);
        
        let csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n"
            + rows.map(r => r.join(",")).join("\n");
            
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${selectedStock}_prediction_analysis.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-background text-foreground pt-32 pb-20 px-6 font-sans">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Header Section */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                    >
                        <Target className="w-4 h-4" /> Prediction Benchmarking
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                        AI Accuracy Analysis
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Track how well our AI predicts stock prices day-over-day and compare results against the real market moves.
                    </p>
                </div>

                {/* Controls Bar */}
                <div className="bg-card/30 p-6 rounded-2xl border border-border backdrop-blur-sm shadow-xl relative z-[100]">
                    <div className="flex flex-col md:flex-row gap-8 items-end justify-center">
                        <div className="w-full md:w-80 relative z-[110]">
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Select Market Ticker</label>
                            <StockSelector
                                onSelect={fetchAnalysisData}
                                watchlist={watchlist}
                                toggleWatchlist={toggleWatchlist}
                                modelType="linear"
                                setModelType={() => {}}
                            />
                        </div>

                        {result && (
                            <button
                                onClick={handleDownloadCSV}
                                className="w-full md:w-auto px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                            >
                                <Download className="w-5 h-5" /> Export Report
                            </button>
                        )}
                    </div>
                </div>

                {result && !loading && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {/* Avg Accuracy Card */}
                        <div className="bg-card/40 p-6 rounded-2xl border border-border shadow-lg backdrop-blur-md flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Average Accuracy</p>
                                <h3 className="text-3xl font-black text-primary mt-1">
                                    {(result.filter(r => r.accuracy).reduce((acc, curr) => acc + curr.accuracy, 0) / result.filter(r => r.accuracy).length).toFixed(2)}%
                                </h3>
                            </div>
                            <div className="p-3 bg-primary/10 rounded-xl text-primary"><Target className="w-8 h-8" /></div>
                        </div>

                        {/* Current Price Card */}
                        <div className="bg-card/40 p-6 rounded-2xl border border-border shadow-lg backdrop-blur-md flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Last Recorded (₹)</p>
                                <h3 className="text-3xl font-black text-foreground mt-1">
                                    ₹{result[result.length - 1].actual_close.toLocaleString()}
                                </h3>
                            </div>
                            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500"><TrendingUp className="w-8 h-8" /></div>
                        </div>

                        {/* Recent Diff Card */}
                        <div className="bg-card/40 p-6 rounded-2xl border border-border shadow-lg backdrop-blur-md flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Latest Error (₹)</p>
                                <h3 className="text-3xl font-black text-foreground mt-1">
                                    ₹{Math.abs(result[result.length - 1].actual_close - (result[result.length - 1].predicted_close || result[result.length - 1].actual_close)).toFixed(2)}
                                </h3>
                            </div>
                            <div className="p-3 bg-slate-500/10 rounded-xl text-slate-500"><CheckCircle className="w-8 h-8" /></div>
                        </div>
                    </div>
                )}

                <div className="relative z-10">
                    {loading && (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="h-20 bg-card/20 rounded-xl animate-pulse border border-border/50"></div>
                            ))}
                        </div>
                    )}

                    {error && (
                        <div className="p-6 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 text-center flex flex-col items-center gap-2">
                            <AlertCircle className="w-10 h-10" />
                            <p className="font-medium">{error}</p>
                        </div>
                    )}

                    {result && !loading && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-card/40 rounded-3xl border border-border overflow-hidden shadow-2xl backdrop-blur-md"
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-secondary/50 border-b border-border">
                                            <th className="px-6 py-6 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Historical Date</th>
                                            <th className="px-6 py-6 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-right">Actual Close (₹)</th>
                                            <th className="px-6 py-6 text-sm font-semibold text-primary uppercase tracking-wider text-right bg-primary/5">AI Prediction (₹)</th>
                                            <th className="px-6 py-6 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center">Daily Close Move</th>
                                            <th className="px-6 py-6 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-right">Accuracy Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.map((row, idx) => (
                                            <tr key={idx} className="border-b border-border/50 hover:bg-muted/30 transition-colors group">
                                                <td className="px-6 py-5 font-mono text-muted-foreground flex items-center gap-2">
                                                    <Briefcase className="w-4 h-4 opacity-30" /> {row.date}
                                                </td>
                                                <td className="px-6 py-5 text-right font-bold text-foreground">₹{row.actual_close.toLocaleString()}</td>
                                                <td className="px-6 py-5 text-right font-black text-primary bg-primary/5 text-lg">
                                                    {row.predicted_close ? `₹${row.predicted_close.toLocaleString()}` : <span className="opacity-20 text-xs">- Training Baseline -</span>}
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    {row.daily_change_pct ? (
                                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black shadow-sm ${
                                                            row.daily_change_pct >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                                                        }`}>
                                                            {row.daily_change_pct >= 0 ? '▲' : '▼'} {Math.abs(row.daily_change_pct)}%
                                                        </span>
                                                    ) : <Minus className="mx-auto opacity-20" />}
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    {row.accuracy ? (
                                                        <div className="flex flex-col items-end">
                                                            <div className="flex items-center gap-1.5 font-bold text-lg">
                                                                <CheckCircle className={`w-4 h-4 ${row.accuracy >= 98 ? 'text-emerald-500' : row.accuracy >= 95 ? 'text-yellow-500' : 'text-slate-500'}`} />
                                                                {row.accuracy}%
                                                            </div>
                                                            <div className="w-24 h-1.5 bg-secondary/50 rounded-full mt-1 overflow-hidden">
                                                                <motion.div 
                                                                    className={`h-full rounded-full ${row.accuracy >= 95 ? 'bg-primary' : 'bg-slate-500'}`}
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${row.accuracy}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : <span className="text-muted-foreground/30 text-xs italic">N/A (N-1)</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            <div className="p-6 bg-secondary/10 flex items-center justify-between text-xs text-muted-foreground">
                                <span className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> Calculated via Linear Regression Engine</span>
                                <span className="italic">* Accuracy Score = 100 - (Absolute Error Percentage)</span>
                            </div>
                        </motion.div>
                    )}

                    {!result && !loading && !error && (
                        <div className="text-center py-24 opacity-30 select-none">
                            <TrendingUp className="w-24 h-24 mx-auto mb-6" />
                            <p className="text-2xl font-bold uppercase tracking-widest text-muted-foreground">Select a Stock to Benchmarking AI</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default PriceAnalysisPage;
