import { motion } from 'framer-motion';
import { ShieldAlert, BookOpen, AlertTriangle, Scale, Lock, ShieldCheck } from 'lucide-react';

const TermsPage = () => {
    return (
        <div className="min-h-screen bg-[#020617] text-foreground pt-36 pb-20 px-6 font-sans selection:bg-rose-500/20 relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-4xl mx-auto space-y-16 relative z-10">

                {/* Header Section */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]"
                    >
                        <Scale className="w-3 h-3 text-slate-500" /> Compliance Framework
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent italic">
                        Legal <span className="text-emerald-500 not-italic">Intelligence</span>
                    </h1>
                    <p className="text-slate-400 font-medium text-lg leading-relaxed">
                        Terms of usage and strategic intelligence oversight for the StockAI ecosystem.
                    </p>
                </div>

                {/* Terms Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Advisory Disclaimer */}
                    <div className="bg-rose-500/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-rose-500/20 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <AlertTriangle className="w-12 h-12 text-rose-500" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight mb-4 text-rose-400">Not Financial Advice</h2>
                        <p className="text-slate-400 text-sm leading-relaxed font-semibold">
                            All predictions are generated via automated machine learning models. 
                            StockAI does not provide certified financial advisory. Trading involves high risk—always consult a licensed professional before execution.
                        </p>
                    </div>

                    {/* Data Sovereignty */}
                    <div className="bg-slate-900/50 backdrop-blur-3xl p-10 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Lock className="w-12 h-12 text-slate-500" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight mb-4 text-white">Data Sovereignty</h2>
                        <p className="text-slate-400 text-sm leading-relaxed font-semibold">
                            We do not collect sensitive user financial data. All analysis is performed on-the-fly using 
                            encrypted local sessions. Your strategy remains your intellectual property.
                        </p>
                    </div>

                    {/* Usage Limits */}
                    <div className="bg-slate-900/50 backdrop-blur-3xl p-10 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <BookOpen className="w-12 h-12 text-slate-500" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight mb-4 text-white">Interface Access</h2>
                        <p className="text-slate-400 text-sm leading-relaxed font-semibold">
                            The StockAI interface is provided for personal, non-commercial research use only. 
                            Automated crawling or API scraping for commercial resale is strictly prohibited.
                        </p>
                    </div>

                    {/* Final Shield */}
                    <div className="bg-emerald-500/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-emerald-500/20 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <ShieldCheck className="w-12 h-12 text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight mb-4 text-emerald-400">System Integrity</h2>
                        <p className="text-slate-400 text-sm leading-relaxed font-semibold">
                            We prioritize sub-second model accuracy and zero-latency data drains. 
                            Your access to institutional-grade AI is our core commitment to the retail community.
                        </p>
                    </div>
                </div>

                {/* Contact Banner */}
                <div className="p-10 bg-slate-900/40 rounded-[3rem] border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-black tracking-tight text-white uppercase mb-2">Legal Oversight Contact</h3>
                        <p className="text-slate-500 text-sm font-medium">Have queries regarding neural transparency or system terms?</p>
                    </div>
                    <a href="mailto:hetkikani990@gmail.com" className="px-8 py-3.5 bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all hover:scale-105 active:scale-95">
                        Initiate Comms
                    </a>
                </div>

            </div>
        </div>
    );
};

export default TermsPage;
