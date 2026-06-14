import { motion } from 'framer-motion';

const SignalGauge = ({ signal, score, symbol }) => {
    const isGold = symbol === 'GC=F';
    const isSilver = symbol === 'SI=F';

    // Determine color based on score (0-100)
    const getColor = (s) => {
        if (isGold) return "text-yellow-500";
        if (isSilver) return "text-slate-300";
        if (s >= 80) return "text-emerald-500";
        if (s >= 60) return "text-green-500";
        if (s >= 40) return "text-yellow-500";
        if (s >= 20) return "text-orange-500";
        return "text-red-500";
    };

    const getBgColor = (s) => {
        if (isGold) return "bg-yellow-500";
        if (isSilver) return "bg-slate-400";
        if (s >= 80) return "bg-emerald-500";
        if (s >= 60) return "bg-green-500";
        if (s >= 40) return "bg-yellow-500";
        if (s >= 20) return "bg-orange-500";
        return "bg-red-500";
    };

    // Calculate rotation for needle (-90 to 90 degrees)
    // 0 -> -90, 50 -> 0, 100 -> 90
    const rotation = (score / 100) * 180 - 90;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-3xl bg-secondary/10 border border-border/50 relative overflow-hidden backdrop-blur-sm"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-foreground">AI Verdict</h3>
                    <p className="text-xs text-muted-foreground">Technical Synthesis</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getColor(score)} bg-background/50 border-current`}>
                    {signal}
                </div>
            </div>

            {/* Gauge Graphic */}
            <div className="relative h-32 w-full flex justify-center items-end mb-4">
                {/* Arc Background */}
                <div className="absolute bottom-0 w-64 h-32 rounded-t-full border-[12px] border-secondary/20 border-b-0 overflow-hidden">
                    {/* Gradient Sections */}
                    <div className="absolute inset-0 w-full h-full bg-[conic-gradient(from_180deg,var(--tw-gradient-stops))] from-red-500 via-yellow-500 to-green-500 opacity-20" />
                </div>

                {/* Needle */}
                <motion.div
                    initial={{ rotate: -90 }}
                    animate={{ rotate: rotation }}
                    transition={{ type: "spring", stiffness: 60, damping: 15 }}
                    className="absolute bottom-0 w-1 h-28 bg-foreground origin-bottom z-10 rounded-full"
                    style={{
                        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                    }}
                >
                    <div className={`w-4 h-4 rounded-full absolute -bottom-2 -left-1.5 border-2 border-background ${getBgColor(score)}`} />
                </motion.div>

                {/* Ticks */}
                <div className="absolute bottom-1 w-full flex justify-between px-8 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                    <span>Sell</span>
                    <span className="-translate-y-6">Hold</span>
                    <span>Buy</span>
                </div>
            </div>

            {/* Score Display */}
            <div className="text-center">
                <h2 className="text-4xl font-black">{score}<span className="text-sm font-medium text-muted-foreground">/100</span></h2>
                <p className="text-sm text-muted-foreground mt-1">Confidence Score</p>
            </div>

            {/* Glow Effect */}
            <div className={`absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-20 ${getBgColor(score)}`} />
        </motion.div>
    );
};

export default SignalGauge;
