import { motion } from 'framer-motion';

const FeaturesPage = () => {
    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto space-y-16">

                <header className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-foreground">Capabilities & Technology</h1>
                    <p className="text-muted-foreground">Under the hood of our prediction engine.</p>
                </header>

                <div className="grid gap-8">
                    <Section
                        title="1. Long Short-Term Memory (LSTM)"
                        desc="LSTM is a type of Recurrent Neural Network (RNN) capable of learning order dependence in sequence prediction problems. Unlike standard feedforward neural networks, LSTM has feedback connections, making it perfect for processing entire sequences of data (like stock prices over time). It can remember values over arbitrary intervals."
                    />
                    <Section
                        title="2. Linear Regression"
                        desc="A statistical method that models the relationship between a scalar response (dependent variable) and one or more explanatory variables (independent variables). We use it to establish a baseline trend line for stocks, helpful for identifying general direction (uptrend/downtrend) over long periods."
                    />
                    <Section
                        title="3. Sentiment Analysis (VADER)"
                        desc="We use VADER (Valence Aware Dictionary and sEntiment Reasoner), a lexicon and rule-based sentiment analysis tool that is specifically attuned to sentiments expressed in social media and short texts (like news headlines). It gives us a 'Positive', 'Negative', or 'Neutral' score to augment technical data."
                    />
                    <Section
                        title="4. Technical Indicators"
                        desc="We calculate RSI (Relative Strength Index) to identify overbought or oversold conditions, and MACD (Moving Average Convergence Divergence) to spot changes in the strength, direction, momentum, and duration of a trend."
                    />
                </div>

            </div>
        </div>
    );
};

const Section = ({ title, desc }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-card border border-border p-8 rounded-2xl shadow-sm"
    >
        <h2 className="text-2xl font-bold text-primary mb-4">{title}</h2>
        <p className="text-muted-foreground leading-7">{desc}</p>
    </motion.div>
);

export default FeaturesPage;
