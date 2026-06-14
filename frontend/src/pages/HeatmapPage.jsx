import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowRight, Loader2, Activity, Zap, Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HeatmapPage = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Mouse tracking for 3D Perspective Rotation
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
    
    // Subtle rotation for the "city"
    const rotateX = useTransform(springY, [-0.5, 0.5], [20, 10]); 
    const rotateY = useTransform(springX, [-0.5, 0.5], [-5, 5]);

    useEffect(() => {
        const fetchHeatmap = async () => {
            try {
                const response = await axios.get('/api/heatmap');
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

    const getPillarColor = (change) => {
        if (change >= 2.0) return 'from-emerald-400/80 to-emerald-600/90 border-emerald-400/40 text-emerald-50 shadow-[0_0_30px_rgba(16,185,129,0.2)]';
        if (change > 0) return 'from-emerald-500/60 to-emerald-700/80 border-emerald-500/30 text-emerald-100';
        if (change === 0) return 'from-slate-600/60 to-slate-800/80 border-slate-600/30 text-slate-100';
        if (change > -2.0) return 'from-rose-500/60 to-rose-700/80 border-rose-500/30 text-rose-100';
        return 'from-rose-400/80 to-rose-600/90 border-rose-400/40 text-rose-50 shadow-[0_0_30px_rgba(244,63,94,0.2)]';
    };

    return (
        <div 
            onMouseMove={handleMouseMove}
            className="min-h-screen bg-[#020617] text-white py-20 px-6 pt-36 relative overflow-hidden"
            style={{ perspective: "2000px" }}
        >
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,#1e293b_1px,transparent_1px)] bg-[size:80px_80px] opacity-10" />
            </div>

            <div className="max-w-7xl mx-auto space-y-12 relative z-10">
                
                {/* Header Segment */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-slate-800/50">
                    <div className="text-center md:text-left space-y-3">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]"
                        >
                            <Box className="w-3 h-3" /> NIFTY 50 Cityscape
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                            Momentum <span className="text-primary italic">Matrix</span>
                        </h1>
                        <p className="text-slate-400 font-medium max-w-xl">
                            Real-time 3D volumetric mapping of index dominance. 
                            Pillar height is directly proportional to daily volatility amplitude.
                        </p>
                    </div>

                    {/* Legendary Scale */}
                    <div className="flex flex-wrap items-center justify-center gap-3 p-4 bg-slate-900/50 backdrop-blur-xl rounded-[2rem] border border-slate-800 shadow-2xl">
                        {[
                            { color: 'bg-emerald-500 shadow-[0_0_10px_#10b981]', label: 'Strong Buy' },
                            { color: 'bg-emerald-700', label: 'Buy' },
                            { color: 'bg-slate-700', label: 'Neutral' },
                            { color: 'bg-rose-700', label: 'Sell' },
                            { color: 'bg-rose-500 shadow-[0_0_10px_#f43f5e]', label: 'Strong Sell' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-full border border-slate-700/50">
                                <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {loading && (
                    <div className="flex flex-col items-center justify-center h-96 space-y-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse rounded-full" />
                            <Loader2 className="w-12 h-12 animate-spin text-primary relative z-10" />
                        </div>
                        <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Constructing Volumetric Map...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-8 rounded-[2rem] text-center font-bold backdrop-blur-xl">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <motion.div
                        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pt-10"
                    >
                        {stocks.map((stock, index) => {
                            const isPositive = stock.change >= 0;
                            const momentum = Math.abs(stock.change);
                            // Pillar height calculation: Base(0px) + Momentum * Intensity
                            const zHeight = momentum * 25; 

                            return (
                                <HeatmapPillar 
                                    key={stock.symbol}
                                    stock={stock}
                                    index={index}
                                    zHeight={zHeight}
                                    isPositive={isPositive}
                                    colorClass={getPillarColor(stock.change)}
                                    onClick={() => navigate('/dashboard', { state: { selectedSymbol: stock.symbol } })}
                                />
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

const HeatmapPillar = ({ stock, index, zHeight, colorClass, isPositive, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5, z: -200 }}
            animate={{ opacity: 1, scale: 1, z: 0 }}
            transition={{ delay: index * 0.01 + 0.3, type: "spring", stiffness: 100 }}
            whileHover={{ 
                z: zHeight + 50, 
                backgroundColor: "rgba(30, 41, 59, 1)",
                transition: { duration: 0.2 }
            }}
            onClick={onClick}
            className={`relative group cursor-pointer aspect-square bg-slate-900/50 backdrop-blur-xl p-5 rounded-3xl border border-slate-800 transition-all shadow-2xl flex flex-col justify-between overflow-hidden transform-gpu preserve-3d`}
            style={{ 
                transformStyle: "preserve-3d",
                // Physical height of the pillar is simulated bytranslateZ
                transform: `translateZ(${zHeight}px)`
            }}
        >
            {/* Top Shine / Glass Effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-80 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                    <div className="space-y-1 overflow-hidden">
                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 truncate block">
                            {stock.symbol}
                        </span>
                        <span className="font-black text-xs text-white tracking-tighter line-clamp-1">
                            {stock.name}
                        </span>
                    </div>
                    {stock.change >= 1.5 && (
                        <div className="bg-emerald-400 p-1 rounded-md animate-pulse">
                            <Zap className="w-3 h-3 text-black fill-current" />
                        </div>
                    )}
                </div>

                <div className="mt-auto">
                    <p className="text-[10px] font-bold text-slate-400 mb-1">₹{stock.price.toLocaleString('en-IN')}</p>
                    <div className={`flex items-center gap-1 font-black text-xl tracking-tighter ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                        {Math.abs(stock.change)}%
                    </div>
                </div>

                {/* Arrow hint on hover */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-primary" />
                </div>
            </div>

            {/* Simulated 3D Pillar Sides (only visible on perspective) */}
            <div className={`absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/50 to-transparent h-[100px] transform-gpu origin-bottom`} 
                 style={{ transform: "rotateX(-90deg) translateZ(0px)" }} />
        </motion.div>
    );
};

export default HeatmapPage;
