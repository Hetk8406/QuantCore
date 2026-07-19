import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import axios from 'axios';
import StockSelector from '../components/StockSelector';
import { Download, TrendingUp, AlertCircle, Target, Briefcase, Minus, CheckCircle, ArrowRightLeft, ShieldCheck, Database, Cpu } from 'lucide-react';

const INITIAL_STOCKS_POOL = [
    { symbol: '^NSEI', name: 'Nifty 50', price: 24200.50, change: 0.32, currency_symbol: '₹' },
    { symbol: 'RELIANCE.NS', name: 'Reliance', price: 3120.45, change: -0.15, currency_symbol: '₹' },
    { symbol: 'AAPL', name: 'Apple', price: 215.30, change: 1.45, currency_symbol: '$' },
    { symbol: 'MSFT', name: 'Microsoft', price: 442.10, change: 0.85, currency_symbol: '$' },
    { symbol: 'BTC-USD', name: 'Bitcoin', price: 68420.00, change: -1.25, currency_symbol: '$' },
    { symbol: 'TSLA', name: 'Tesla', price: 185.20, change: -2.40, currency_symbol: '$' },
    { symbol: 'NVDA', name: 'NVIDIA', price: 125.40, change: 3.12, currency_symbol: '$' },
    { symbol: 'TCS.NS', name: 'TCS', price: 3950.00, change: 0.50, currency_symbol: '₹' }
];

const PriceAnalysisPage = () => {
    const [selectedStock, setSelectedStock] = useState(null);
    const [modelType, setModelType] = useState('linear');
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState(null); // The array of data
    const [currencySymbol, setCurrencySymbol] = useState('₹');
    const [error, setError] = useState(null);

    const [defaultStocks, setDefaultStocks] = useState(() => {
        // Pick 5 random items from the initial pool on mount
        const shuffled = [...INITIAL_STOCKS_POOL].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 5);
    });
    const [stockLoading, setStockLoading] = useState(true);
    const isFirstFetch = useRef(true);

    useEffect(() => {
        let isMounted = true;
        const fetchDefaultStocks = async () => {
            try {
                const res = await axios.get('/api/top-stocks');
                if (res.data && res.data.length > 0 && isMounted) {
                    if (isFirstFetch.current) {
                        isFirstFetch.current = false;
                        const shuffled = [...res.data].sort(() => 0.5 - Math.random());
                        setDefaultStocks(shuffled.slice(0, 5));
                    } else {
                        setDefaultStocks(prevStocks => 
                            prevStocks.map(stock => {
                                const match = res.data.find(s => s.symbol === stock.symbol);
                                return match || stock;
                            })
                        );
                    }
                }
            } catch (err) {
                console.error("Failed to fetch default stocks", err);
            } finally {
                if (isMounted) setStockLoading(false);
            }
        };

        fetchDefaultStocks();
        const interval = setInterval(fetchDefaultStocks, 30000); // refresh every 30 seconds
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);


    // Helper to format currency with space for long codes (e.g. KRW vs $)
    // Enforces 2 decimal places for audit precision
    const formatPrice = (val) => {
        if (val === null || val === undefined) return 'N/A';
        const num = typeof val === 'number' ? val : parseFloat(val);
        const needsSpace = currencySymbol.length > 1;
        
        const formattedNum = num.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        return `${currencySymbol}${needsSpace ? ' ' : ''}${formattedNum}`;
    };

    // Mouse Tracking for 3D Perspective Audit
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        mouseX.set((clientX / innerWidth) - 0.5);
        mouseY.set((clientY / innerHeight) - 0.5);
    };

    const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
    const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });
    const rotateX = useTransform(springY, [-0.5, 0.5], [5, -5]);
    const rotateY = useTransform(springX, [-0.5, 0.5], [-5, 5]);

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
            const res = await axios.get(`/api/analysis/${symbol}?model_type=${modelType}`);
            // res.data is now { data: [], currency_symbol: "" }
            setResultData(res.data.data);
            setCurrencySymbol(res.data.currency_symbol || '₹');
            setSelectedStock(symbol);
        } catch (err) {
            setError(err.response?.data?.detail || "Error loading analysis data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedStock) {
            fetchAnalysisData(selectedStock);
        }
    }, [modelType]);

    const handleDownloadCSV = () => {
        if (!resultData) return;
        const headers = ["Date", "Actual Open", "Actual Close", "AI Prediction", "Pred Diff", "Daily Change (%)", "Accuracy (%)"];
        const rows = resultData.map(row => [
            row.date, row.actual_open, row.actual_close, row.predicted_close || "N/A",
            row.prediction_error || "N/A", row.daily_change_pct || "0.00", row.accuracy || "N/A"
        ]);
        let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(r => r.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${selectedStock}_audit.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div 
            onMouseMove={handleMouseMove}
            className="min-h-screen bg-[#020617] text-foreground pt-36 pb-20 px-6 font-sans relative overflow-hidden"
            style={{ perspective: "1500px" }}
        >
            {/* Background Data Stream Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
                <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,#1e293b_50%,transparent_100%)] bg-[size:100%_20px] animate-[pulse_4s_infinite]" />
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:30px_30px]" />
            </div>

            <div className="max-w-7xl mx-auto space-y-12 relative z-10">
                
                {/* Header Segment */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]"
                    >
                        <ShieldCheck className="w-3 h-3" /> System Audit Engine
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                        Price <span className="text-primary italic">Deep-Lens</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto font-medium">
                        Cross-referencing historical open-to-close deltas against neural predictions. 
                        Validating model integrity for the current financial quarter.
                    </p>
                </div>

                {/* Control Center (Floating 3D) */}
                <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl relative z-[100]">
                    <div className="flex flex-col md:flex-row gap-8 items-end justify-center">
                        <div className="w-full md:w-80 relative z-[110]">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-2">Audit Target Stock</label>
                            <StockSelector
                                onSelect={fetchAnalysisData}
                                watchlist={watchlist}
                                toggleWatchlist={toggleWatchlist}
                                modelType={modelType}
                                setModelType={setModelType}
                            />
                        </div>

                        {resultData && (
                            <button
                                onClick={handleDownloadCSV}
                                className="w-full md:w-auto px-8 py-3.5 bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/30 text-emerald-400 hover:text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 group"
                            >
                                <div className="p-1 px-2.5 bg-emerald-500/20 rounded-md group-hover:bg-white/20">
                                    <Download className="w-4 h-4" />
                                </div>
                                Export Audit Report
                            </button>
                        )}
                    </div>
                </div>

                {resultData && !loading && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10"
                    >
                        <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col justify-between relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
                                <Target className="w-20 h-20" />
                            </div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Baseline Accuracy</p>
                            <h3 className="text-5xl font-black text-primary tracking-tighter">
                                {(resultData.filter(r => r.accuracy).reduce((acc, curr) => acc + curr.accuracy, 0) / resultData.filter(r => r.accuracy).length).toFixed(1)}%
                            </h3>
                        </div>

                        <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col justify-between relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
                                <Cpu className="w-20 h-20 text-emerald-500" />
                            </div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Session Delta</p>
                            <h3 className={`text-5xl font-black tracking-tighter ${resultData[resultData.length - 1].daily_change_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {resultData[resultData.length - 1].daily_change_pct}%
                            </h3>
                        </div>

                        <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col justify-between relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
                                <Database className="w-20 h-20 text-slate-500" />
                            </div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Neural Error Margin</p>
                            <h3 className="text-5xl font-black text-white tracking-tighter">
                                {formatPrice(Math.abs(resultData[resultData.length - 1].prediction_error || 0).toFixed(1))}
                            </h3>
                        </div>
                    </motion.div>
                )}

                {/* Audit Grid (3D Table View) */}
                <div className="relative z-10 transition-transform duration-500">
                    {loading && (
                        <div className="space-y-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-28 bg-slate-900/20 rounded-3xl animate-pulse border border-slate-800" />
                            ))}
                        </div>
                    )}

                    {error && (
                        <div className="p-12 bg-rose-500/10 text-rose-500 rounded-[3rem] border border-rose-500/20 text-center flex flex-col items-center gap-4 font-bold backdrop-blur-xl">
                            <AlertCircle className="w-12 h-12" />
                            <p className="text-xl">{error}</p>
                        </div>
                    )}

                    {resultData && !loading && (
                        <motion.div
                            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                            initial={{ opacity: 0, z: -100 }}
                            animate={{ opacity: 1, z: 0 }}
                            className="bg-slate-900/40 rounded-[3rem] border border-slate-800 overflow-hidden shadow-2xl backdrop-blur-3xl"
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-800/30 border-b border-slate-800 shadow-md">
                                            <th className="px-8 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Historical Node</th>
                                            <th className="px-8 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Open State</th>
                                            <th className="px-8 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Close Reality</th>
                                            <th className="px-8 py-8 text-[10px] font-black text-primary uppercase tracking-[0.2em] text-right bg-primary/5">Neural Inference</th>
                                            <th className="px-8 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Audit Status</th>
                                            <th className="px-8 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/50">
                                        {resultData.map((row, idx) => (
                                            <motion.tr 
                                                key={idx} 
                                                whileHover={{ z: 30, backgroundColor: "rgba(30, 41, 59, 0.4)" }}
                                                className="transition-all duration-300 group cursor-default"
                                            >
                                                <td className="px-8 py-8 font-mono text-slate-400 text-xs flex items-center gap-3 whitespace-nowrap">
                                                    <Briefcase className="w-4 h-4 text-primary opacity-40" /> {row.date}
                                                </td>
                                                <td className="px-8 py-8 text-right font-bold text-slate-500 text-sm italic">{formatPrice(row.actual_open)}</td>
                                                <td className="px-8 py-8 text-right font-black text-white text-base">{formatPrice(row.actual_close)}</td>
                                                <td className="px-8 py-8 text-right font-black text-primary bg-primary/5 text-lg shadow-inner">
                                                    {row.predicted_close ? formatPrice(row.predicted_close) : <span className="opacity-20 text-[10px] tracking-widest">TRAINING...</span>}
                                                </td>
                                                <td className="px-8 py-8">
                                                    <div className="flex flex-col items-center gap-2">
                                                        {row.daily_change_pct ? (
                                                            <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg ${
                                                                row.daily_change_pct >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                            }`}>
                                                                {row.daily_change_pct >= 0 ? 'BULL' : 'BEAR'} : {row.daily_change_pct >= 0 ? '+' : ''}{row.daily_change_pct}%
                                                            </span>
                                                        ) : null}
                                                        
                                                        {row.prediction_error !== null && (
                                                            <span className={`text-[10px] font-black px-3 py-1 rounded-lg border tracking-tighter ${
                                                                Math.abs(row.prediction_error) < 5 ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/5' : 'border-slate-800 text-slate-500 bg-slate-900/50'
                                                            }`}>
                                                                {row.prediction_error >= 0 ? '+' : ''}{row.prediction_error.toFixed(1)} Δ
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-8 text-right">
                                                    {row.accuracy ? (
                                                        <div className="flex flex-col items-end gap-2">
                                                            <div className="flex items-center gap-2 font-black text-xl tracking-tighter">
                                                                <CheckCircle className={`w-4 h-4 ${row.accuracy >= 98 ? 'text-emerald-500' : row.accuracy >= 95 ? 'text-yellow-400' : 'text-slate-600'}`} />
                                                                {row.accuracy}%
                                                            </div>
                                                            <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                                                <motion.div 
                                                                    className={`h-full rounded-full ${row.accuracy >= 95 ? 'bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-700'}`}
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${row.accuracy}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : <span className="text-slate-700 text-[10px] font-black italic tracking-widest uppercase">Baselining...</span>}
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            <div className="p-8 bg-slate-800/30 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest border-t border-slate-800">
                                <span className="flex items-center gap-3"><Database className="w-4 h-4 opacity-40" /> Neural Lens Engine v3.04.1</span>
                                <span className="italic">* Accuracy Audit Threshold &gt; 95%</span>
                            </div>
                        </motion.div>
                    )}

                    {/* Placeholder and Default Stocks if nothing selected */}
                    {!resultData && !loading && !error && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center justify-center mt-10 space-y-8 w-full"
                        >
                            <div className="text-center space-y-3">
                                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">
                                    Initialize Audit Lens
                                </h2>
                                <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
                                    Select a Global Market ticker above to cross-reference historical data, or click one of the popular default assets below to run the audit instantly:
                                </p>
                            </div>

                            {/* Default Stocks Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 w-full mt-6">
                                {defaultStocks.map((stock, idx) => (
                                    <motion.button
                                        key={stock.symbol}
                                        onClick={() => fetchAnalysisData(stock.symbol)}
                                        whileHover={{ y: -6, scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.08, type: "spring", stiffness: 120 }}
                                        className="p-6 rounded-[2rem] bg-slate-900/40 border border-slate-800/80 hover:border-primary/50 text-left transition-all hover:bg-slate-900/60 shadow-[0_15px_30px_rgba(0,0,0,0.3)] group relative overflow-hidden flex flex-col justify-between min-h-[140px]"
                                    >
                                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        
                                        <div className="flex flex-col z-10">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-primary transition-colors">
                                                {stock.name}
                                            </span>
                                            <span className="text-xs text-slate-400 font-bold mt-0.5">
                                                {stock.symbol}
                                            </span>
                                        </div>

                                        <div className="flex flex-col mt-4 z-10">
                                            {stockLoading ? (
                                                <div className="h-6 w-16 bg-slate-800 animate-pulse rounded" />
                                            ) : (
                                                <div className="flex items-baseline justify-between w-full">
                                                    <span className="text-lg font-black text-white tracking-tight">
                                                        <span className="text-xs text-slate-500 mr-0.5 align-middle">{stock.currency_symbol}</span>
                                                        {stock.price ? stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                                                    </span>
                                                    <span className={`text-xs font-black ml-2 ${
                                                        stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                                                    }`}>
                                                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default PriceAnalysisPage;
