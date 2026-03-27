import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Newspaper, TrendingUp, TrendingDown, Clock, ExternalLink, Eye, Zap } from 'lucide-react';
import axios from 'axios';

const NewsPage = () => {
    // Mouse tracking for 3D Parallax
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

    const [news, setNews] = useState([
        { id: 1, title: "NIFTY 50 Hits All-Time High Amid Global Rally", source: "MarketWatch", time: "2 hours ago", sentiment: "Bullish", sentimentScore: 0.8 },
        { id: 2, title: "Tech Sector Faces Headwinds as Inflation Data Looms", source: "Bloomberg", time: "4 hours ago", sentiment: "Bearish", sentimentScore: -0.4 },
        { id: 3, title: "Reliance Industries Announces New Green Energy Initiative", source: "Reuters", time: "5 hours ago", sentiment: "Bullish", sentimentScore: 0.6 },
        { id: 4, title: "Banking Stocks Show Resilience in Volatile Market", source: "CNBC", time: "8 hours ago", sentiment: "Neutral", sentimentScore: 0.1 },
        { id: 5, title: "TCS Quarterly Results Beat Expectations", source: "Economic Times", time: "1 day ago", sentiment: "Bullish", sentimentScore: 0.7 },
        { id: 6, title: "Auto Sales Dip in Q3, Manufacturers Cautious", source: "Financial Express", time: "1 day ago", sentiment: "Bearish", sentimentScore: -0.3 },
    ]);

    const [sectors, setSectors] = useState([
        { name: "IT", change: "+1.2%", trending: "up" },
        { name: "Pharma", change: "-0.5%", trending: "down" },
        { name: "Banking", change: "+0.8%", trending: "up" },
        { name: "Auto", change: "-1.1%", trending: "down" },
        { name: "Energy", change: "+0.4%", trending: "up" },
    ]);

    return (
        <div 
            onMouseMove={handleMouseMove}
            className="min-h-screen bg-[#020617] text-foreground pt-36 pb-20 px-6 relative overflow-hidden"
            style={{ perspective: "1500px" }}
        >
            {/* Background Atmosphere */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
            </div>

            <div className="max-w-7xl mx-auto space-y-16 relative z-10">

                {/* Header */}
                <header className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]"
                    >
                        <Newspaper className="w-3 h-3" /> Sentiment Intel
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                        Global <span className="text-primary italic">Pulse</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto font-medium">
                        Live semantic extraction from thousands of financial nodes. 
                        Turning headlines into quantitative market signals.
                    </p>
                </header>

                {/* Sector Performance Bar (Layered 3D) */}
                <div className="flex flex-wrap justify-center gap-6">
                    {sectors.map((sector, idx) => (
                        <motion.div
                            key={sector.name}
                            initial={{ opacity: 0, z: -100 }}
                            animate={{ opacity: 1, z: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ scale: 1.1, z: 50, rotateY: 10 }}
                            className={`px-6 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl ${sector.trending === 'up' 
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                                } flex items-center gap-3 font-black text-xs tracking-tight transition-all cursor-default relative overflow-hidden`}
                        >
                            <div className={`absolute inset-0 bg-current opacity-[0.03]`} />
                            {sector.name}
                            <span className="text-white opacity-90">{sector.change}</span>
                            {sector.trending === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        </motion.div>
                    ))}
                </div>

                {/* Main News Display with 3D Rotation */}
                <motion.div 
                    style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {news.map((item, idx) => (
                        <NewsCard key={item.id} item={item} index={idx} />
                    ))}
                </motion.div>

            </div>
        </div>
    );
};

const NewsCard = ({ item, index }) => {
    const isBullish = item.sentiment === 'Bullish';
    const isBearish = item.sentiment === 'Bearish';

    // Local 3D state for hover
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, z: -100 }}
            animate={{ opacity: 1, y: 0, z: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            whileHover={{ 
                z: 100, 
                backgroundColor: "rgba(30, 41, 59, 0.6)",
                borderColor: "rgba(255, 255, 255, 0.2)" 
            }}
            className="group relative bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 p-8 rounded-[2.5rem] transition-all duration-500 shadow-2xl cursor-pointer flex flex-col justify-between overflow-hidden"
        >
            {/* 3D Reflection Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isBullish 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : isBearish 
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                        {isBullish ? <Zap className="w-3 h-3 fill-emerald-400" /> : isBearish ? <Eye className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {item.sentiment}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 italic">
                         {item.time}
                    </span>
                </div>

                <h3 className="text-xl font-black mb-4 leading-tight group-hover:text-primary transition-colors pr-4">
                    {item.title}
                </h3>
            </div>

            <div className="relative z-10 flex justify-between items-center mt-6 pt-6 border-t border-slate-800/50">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    {item.source}
                </span>
                <div className="p-2 bg-slate-800 rounded-xl group-hover:bg-primary transition-all group-hover:scale-110">
                    <ExternalLink className="w-4 h-4 text-white" />
                </div>
            </div>

            {/* Hidden Floating Detail Line */}
            <motion.div 
                animate={{ x: hovered ? 20 : -50, opacity: hovered ? 0.3 : 0 }}
                className="absolute top-1/2 right-0 w-2 h-16 bg-primary rounded-full blur-sm"
            />
        </motion.div>
    );
};

export default NewsPage;
