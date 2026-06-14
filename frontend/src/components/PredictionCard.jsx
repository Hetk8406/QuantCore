import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Target, Activity, Zap, CheckCircle2 } from "lucide-react";

const PredictionCard = ({ data }) => {
    const { symbol, current_price, current_date, predicted_price, prediction_date, mae, r2_score, currency_symbol = '₹' } = data;

    const diff = predicted_price - current_price;
    const percentChange = ((diff / current_price) * 100).toFixed(2);
    const isPositive = diff >= 0;
    const isGold = symbol === 'GC=F';
    const isSilver = symbol === 'SI=F';

    // Helper to format currency with space for long codes (e.g. KRW vs $)
    const formatPrice = (val) => {
        const needsSpace = currency_symbol.length > 1;
        return `${currency_symbol}${needsSpace ? ' ' : ''}${val?.toLocaleString()}`;
    };

    const cardStyles = isGold 
        ? "bg-yellow-500/5 backdrop-blur-md border border-yellow-500/20 rounded-xl p-6 shadow-[0_0_20px_rgba(234,179,8,0.05)] flex flex-col justify-between h-full"
        : isSilver
        ? "bg-slate-400/5 backdrop-blur-md border border-slate-400/20 rounded-xl p-6 shadow-sm flex flex-col justify-between h-full"
        : "bg-card/50 backdrop-blur-md border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between h-full";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cardStyles}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground/90 flex items-center gap-2">
                    <Zap className={`w-5 h-5 ${isGold ? 'text-yellow-400' : isSilver ? 'text-slate-300' : 'text-primary'}`} />
                    <span className={isGold ? 'text-yellow-500' : isSilver ? 'text-slate-200' : ''}>
                        {isGold ? 'Gold Vault' : isSilver ? 'Silver Reserve' : 'AI Forecast'}
                    </span>
                </h2>
                <span className={`text-xs font-mono px-2 py-1 rounded border ${isGold ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' : 'bg-secondary text-muted-foreground border-border'}`}>
                    {symbol}
                </span>
            </div>

            {/* Main Price Comparison */}
            <div className="grid grid-cols-2 gap-4 mb-6 relative">
                {/* Current */}
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Current</p>
                    <div className="text-2xl font-bold text-foreground">{formatPrice(current_price)}</div>
                    <p className="text-[10px] text-muted-foreground">{current_date}</p>
                </div>

                {/* Arrow Indicator (Absolute Centered) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isPositive ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    </div>
                </div>

                {/* Predicted */}
                <div className="space-y-1 text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Predicted</p>
                    <div className={`text-2xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {formatPrice(predicted_price)}
                    </div>
                    <p className={`text-[10px] font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? '+' : ''}{percentChange}%
                    </p>
                </div>
            </div>

            {/* Prediction Date Label */}
            <div className="text-center mb-6">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-xs font-medium text-primary">
                    Target Date: {prediction_date}
                </span>
            </div>


            {/* Divider */}
            <div className="h-px w-full bg-border/50 mb-4" />


            {/* Stats Footer */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Accuracy (R²)</p>
                        <p className="text-sm font-bold">{(r2_score * 100).toFixed(1)}%</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <Activity className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Mean Error</p>
                        <p className="text-sm font-bold">{formatPrice(mae)}</p>
                    </div>
                </div>
            </div>

        </motion.div>
    );
};

export default PredictionCard;
