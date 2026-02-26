import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const HeatmapPage = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHeatmap = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/heatmap');
                setStocks(response.data);
            } catch (err) {
                console.error("Heatmap fetch error:", err);
                setError("Failed to load market data. Please make sure the backend is running.");
            } finally {
                setLoading(false);
            }
        };

        fetchHeatmap();
    }, []);

    // Function to determine background color based on percentage change
    const getHeatColor = (change) => {
        if (change >= 2.0) return 'bg-emerald-600/90 hover:bg-emerald-500 border-emerald-500';
        if (change > 0) return 'bg-emerald-500/80 hover:bg-emerald-400 border-emerald-400';
        if (change === 0) return 'bg-slate-600/80 hover:bg-slate-500 border-slate-500';
        if (change > -2.0) return 'bg-rose-500/80 hover:bg-rose-400 border-rose-400';
        return 'bg-rose-600/90 hover:bg-rose-500 border-rose-500';
    };

    // Simple grid layout - CSS Grid
    return (
        <div className="min-h-screen bg-background text-foreground py-20 px-4 pt-28 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 pb-4 border-b border-border/50">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400 mb-2">
                        Market Correlation Heatmap
                    </h1>
                    <p className="text-muted-foreground">
                        Visualizing daily momentum across the NIFTY 50 index.
                    </p>
                </div>

                <div className="mt-4 md:mt-0 flex gap-4 text-xs font-medium">
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-emerald-600"></div> Strong Buy</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Buy</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-slate-600"></div> Neutral</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-rose-500"></div> Sell</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-rose-600"></div> Strong Sell</div>
                </div>
            </div>

            {loading && (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                    <p>Analyzing NIFTY 50 pulse...</p>
                </div>
            )}

            {error && (
                <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg text-center">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
                >
                    {stocks.map((stock, index) => {
                        const isPositive = stock.change >= 0;
                        return (
                            <motion.div
                                key={stock.symbol}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.01 }}
                                onClick={() => navigate('/dashboard', { state: { selectedSymbol: stock.symbol } })}
                                className={`cursor-pointer rounded-lg p-3 border shadow-sm transition-all duration-300 flex flex-col justify-between aspect-square group ${getHeatColor(stock.change)} text-white`}
                            >
                                <div className="flex justify-between items-start">
                                    <span className="font-bold text-sm tracking-tight truncate w-full">{stock.name}</span>
                                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                                </div>

                                <div>
                                    <p className="text-sm font-medium opacity-90">₹{stock.price.toLocaleString('en-IN')}</p>
                                    <div className="flex items-center gap-1 font-bold text-lg mt-1">
                                        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                        {Math.abs(stock.change)}%
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}
        </div>
    );
};

export default HeatmapPage;
