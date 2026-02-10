import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, TrendingUp, TrendingDown, Clock, ExternalLink } from 'lucide-react';
import axios from 'axios';

const NewsPage = () => {
    // Mock data for initial render, can be replaced with real API later
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
        <div className="min-h-screen bg-background pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <header className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                    >
                        <Newspaper className="w-4 h-4" /> Market Insights
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                        Global Market Pulse
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Stay ahead with curated financial news and real-time sentiment analysis powered by our AI engine.
                    </p>
                </header>

                {/* Sector Performance Bar */}
                <div className="flex flex-wrap justify-center gap-4">
                    {sectors.map((sector, idx) => (
                        <motion.div
                            key={sector.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`px-4 py-2 rounded-xl border ${sector.trending === 'up' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
                                } flex items-center gap-2 font-medium text-sm`}
                        >
                            {sector.name}
                            <span className="font-bold">{sector.change}</span>
                            {sector.trending === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        </motion.div>
                    ))}
                </div>

                {/* Main News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((item, idx) => (
                        <NewsCard key={item.id} item={item} index={idx} />
                    ))}
                </div>

            </div>
        </div>
    );
};

const NewsCard = ({ item, index }) => {
    const isBullish = item.sentiment === 'Bullish';
    const isBearish = item.sentiment === 'Bearish';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-card/50 backdrop-blur-sm border border-border p-6 rounded-2xl hover:bg-card/80 transition-all hover:shadow-lg hover:shadow-primary/5 cursor-pointer flex flex-col justify-between"
        >
            <div>
                <div className="flex justify-between items-start mb-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${isBullish ? 'bg-green-500/20 text-green-400' :
                        isBearish ? 'bg-red-500/20 text-red-400' :
                            'bg-blue-500/20 text-blue-400'
                        }`}>
                        {item.sentiment}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.time}
                    </span>
                </div>

                <h3 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                </h3>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/50">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {item.source}
                </span>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
        </motion.div>
    );
};

export default NewsPage;
