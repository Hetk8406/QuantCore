import React from 'react';
import { TrendingUp, TrendingDown, Minus, ExternalLink, Globe, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

const SentimentCard = ({ sentiment }) => {
    if (!sentiment) return (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl h-full flex flex-col items-center justify-center opacity-50 grayscale">
            <Brain className="w-12 h-12 text-slate-700 animate-pulse mb-4" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Awaiting Neural Link</p>
        </div>
    );

    const { score, label, news } = sentiment;

    // Determine dynamics based on sentiment
    const isBullish = label === "Bullish";
    const isBearish = label === "Bearish";
    const statusColor = isBullish ? "text-emerald-400" : isBearish ? "text-rose-400" : "text-blue-400";
    const statusBg = isBullish ? "bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : isBearish ? "bg-rose-500/10 border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.1)]" : "bg-blue-500/10 border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]";
    const Icon = isBullish ? TrendingUp : isBearish ? TrendingDown : Minus;

    // Normalize score for the gauge (-1 to 1 -> 0% to 100%)
    const percentage = ((score + 1) / 2) * 100;

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl h-full relative group overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <header className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700 shadow-inner group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
                        <Brain className="w-5 h-5 text-primary group-hover:animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Neural Sentiment</h2>
                        <div className="flex items-center gap-2 text-[8px] font-black text-slate-500 uppercase tracking-widest">
                            <Globe className="w-2.5 h-2.5" /> Worldwide Index
                        </div>
                    </div>
                </div>
                <div className="px-3 py-1 bg-slate-800/80 rounded-full border border-slate-700/50 text-[10px] font-black font-mono text-slate-400">
                    S:{score > 0 ? `+${score}` : score}
                </div>
            </header>

            {/* MAIN SIGNAL CARD */}
            <div className={`p-6 rounded-[2rem] border ${statusBg} transition-all duration-500 mb-8 relative overflow-hidden`}>
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <Icon className={`w-20 h-20 ${statusColor}`} />
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                         <div className={`w-2 h-2 rounded-full animate-pulse ${isBullish ? 'bg-emerald-400' : isBearish ? 'bg-rose-400' : 'bg-blue-400'}`} />
                         <span className={`text-2xl font-black uppercase tracking-tighter ${statusColor}`}>{label}</span>
                    </div>
                    
                    {/* Gauge */}
                    <div className="mt-4 h-2 bg-slate-950/50 rounded-full overflow-hidden relative shadow-inner">
                        <motion.div 
                            initial={{ width: "50%" }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className={`h-full relative ${isBullish ? 'bg-emerald-400' : isBearish ? 'bg-rose-400' : 'bg-blue-400'} shadow-[0_0_15px_rgba(59,130,246,0.5)]`}
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                        </motion.div>
                    </div>
                    
                    <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase tracking-widest mt-2 px-1">
                        <span>Panic</span>
                        <span>Equilibrium</span>
                        <span>Euched</span>
                    </div>
                </div>
            </div>

            {/* LIVE NEWS TICKER */}
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-2">Neural Audit (Top 3)</h3>
            <div className="space-y-4">
                {news && news.length > 0 ? (
                    news.slice(0, 3).map((item, index) => (
                        <a 
                            key={index} 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block group/link"
                        >
                            <div className="p-4 rounded-3xl bg-slate-900/50 border border-slate-800/50 hover:bg-slate-800/80 hover:border-primary/30 transition-all flex flex-col gap-2">
                                <h4 className="text-xs font-bold text-slate-200 line-clamp-2 leading-relaxed group-hover/link:text-white transition-colors">
                                    {item.title}
                                </h4>
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover/link:text-primary transition-colors">
                                        {item.publisher}
                                    </span>
                                    <ExternalLink className="w-3 h-3 text-slate-600 group-hover/link:text-primary transition-opacity" />
                                </div>
                            </div>
                        </a>
                    ))
                ) : (
                    <div className="text-center py-8 opacity-40">
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Silent Markets</p>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes shimmer {
                    from { background-position: 200% 0; }
                    to { background-position: -200% 0; }
                }
                .animate-shimmer {
                    animation: shimmer 3s infinite linear;
                }
            `}</style>
        </motion.div>
    );
};

export default SentimentCard;
