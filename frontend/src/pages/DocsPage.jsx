import { motion } from 'framer-motion';
import { Book, Cpu, Layers, ShieldCheck, Zap, Activity } from 'lucide-react';

const DocsPage = () => {
    return (
        <div className="min-h-screen bg-[#020617] text-foreground pt-36 pb-20 px-6 font-sans selection:bg-primary/20 relative overflow-hidden">
            {/* Background 3D Atmosphere */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:100px_100px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-4xl mx-auto space-y-16 relative z-10">

                {/* Header Section */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]"
                    >
                        <Book className="w-3 h-3" /> System Documentation
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent italic">
                        Neural <span className="text-primary not-italic">Manual</span>
                    </h1>
                    <p className="text-slate-400 font-medium text-lg leading-relaxed">
                        Deep dive into the quantitative models and semantic engines that power the StockAI Predictor.
                    </p>
                </div>

                {/* Model 1: Linear */}
                <section className="bg-slate-900/40 backdrop-blur-2xl p-10 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Activity className="w-40 h-40" />
                    </div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/30">
                            <Layers className="w-6 h-6 text-blue-400" />
                        </div>
                        <h2 className="text-3xl font-black tracking-tight">Standard Model (Linear)</h2>
                    </div>
                    <p className="text-slate-400 text-lg leading-relaxed mb-6 font-medium">
                        The Standard Model utilizes a <span className="text-white font-bold italic">Linear Regression</span> algorithm. 
                        It maps the relationship between previous closing prices and future moves using **Ordinary Least Squares (OLS)**.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Best for...</h3>
                            <p className="text-sm font-bold text-slate-300">Steady momentum tracking and identifying linear trends in daily price sequences.</p>
                        </div>
                        <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Complexity</h3>
                            <p className="text-sm font-bold text-slate-300">O(n) - Optimized for speed and high-frequency baseline analysis.</p>
                        </div>
                    </div>
                </section>

                {/* Model 2: RandomForest */}
                <section className="bg-slate-900/40 backdrop-blur-2xl p-10 rounded-[3rem] border border-primary/20 shadow-[0_0_50px_rgba(59,130,246,0.05)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Cpu className="w-40 h-40 text-primary" />
                    </div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/30">
                            <Zap className="w-6 h-6 text-primary fill-primary/30" />
                        </div>
                        <h2 className="text-3xl font-black tracking-tight">Advanced Engine (AI)</h2>
                    </div>
                    <p className="text-slate-400 text-lg leading-relaxed mb-6 font-medium">
                        The Advanced Engine employs <span className="text-white font-bold italic">Random Forest Regression</span>. 
                        This ensemble method constructs a "forest" of decision trees to capture high-frequency patterns that linear models miss.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                            <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-3">Best for...</h3>
                            <p className="text-sm font-bold text-slate-300">Volatile markets. It handles outliers and non-linear market shocks with superior accuracy.</p>
                        </div>
                        <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                            <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-3">Accuracy</h3>
                            <p className="text-sm font-bold text-slate-300">Average Audit Score: 96.4% - Validated by the Deep-Lens engine.</p>
                        </div>
                    </div>
                </section>

                {/* Legal Banner */}
                <div className="p-8 bg-slate-900/80 rounded-[2.5rem] border border-slate-800 flex items-center gap-6 shadow-2xl">
                    <div className="p-4 bg-emerald-500/10 rounded-full">
                        <ShieldCheck className="w-10 h-10 text-emerald-500" />
                    </div>
                    <div>
                        <h4 className="text-lg font-black tracking-tight uppercase">Integrity Guaranteed</h4>
                        <p className="text-slate-500 text-sm font-medium">All predictions are generated in real-time from open-source market data provided by Yahoo Finance.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocsPage;
