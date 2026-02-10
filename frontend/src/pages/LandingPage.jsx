import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart2, Cpu, LineChart } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center overflow-hidden relative">

            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px]" />
            </div>

            {/* Hero Section */}
            <header className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-8 mt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-secondary/50 border border-border text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
                        AI-Powererd Analysis
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent mb-6">
                        Predict the Future of <br />
                        <span className="text-primary">NIFTY 50 Stocks</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Harness the power of <strong>LSTM Neural Networks</strong> and <strong>Linear Regression</strong> to forecast market trends with precision. Analyze sentiment from news in real-time.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <Link
                        to="/dashboard"
                        className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 transition-all flex items-center gap-2 shadow-xl shadow-primary/25 hover:scale-105"
                    >
                        Start Predicting <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                        to="/features"
                        className="px-8 py-4 bg-secondary text-secondary-foreground font-semibold rounded-full hover:bg-secondary/80 transition-all border border-border"
                    >
                        Learn More
                    </Link>
                </motion.div>
            </header>

            {/* Feature Grid */}
            <section className="relative z-10 mt-24 mb-10 w-full max-w-6xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard
                    icon={<Cpu className="w-8 h-8 text-blue-400" />}
                    title="Deep Learning Models"
                    desc="Utilizes Long Short-Term Memory (LSTM) networks to understand complex time-series patterns."
                />
                <FeatureCard
                    icon={<BarChart2 className="w-8 h-8 text-green-400" />}
                    title="Sentiment Analysis"
                    desc="Scans global news headlines to gauge market mood (Bullish/Bearish) instantly."
                />
                <FeatureCard
                    icon={<LineChart className="w-8 h-8 text-purple-400" />}
                    title="Technical Indicators"
                    desc="Visualizes RSI, MACD, and Moving Averages for comprehensive technical analysis."
                />
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="p-6 rounded-2xl bg-card/40 backdrop-blur-sm border border-border/50 hover:bg-card/60 transition-colors"
    >
        <div className="mb-4 bg-secondary/50 p-3 rounded-xl inline-block">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
);

export default LandingPage;
