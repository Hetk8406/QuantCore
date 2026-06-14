import { motion } from 'framer-motion';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6 flex items-center justify-center">
            <div className="max-w-2xl mx-auto text-center space-y-8">

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-24 h-24 bg-gradient-to-br from-primary to-purple-600 rounded-2xl mx-auto flex items-center justify-center text-4xl shadow-xl"
                >
                    🚀
                </motion.div>

                <h1 className="text-4xl font-bold">About StockAI</h1>

                <p className="text-lg text-muted-foreground leading-relaxed">
                    StockAI was built to democratize access to advanced financial modeling.
                    Institutional investors have used AI for years; now, retail traders can access
                    similar insights through a clean, easy-to-use interface.
                </p>

                <div className="grid grid-cols-2 gap-4 text-left mt-8">
                    <div className="p-4 bg-secondary/30 rounded-xl border border-border">
                        <h4 className="font-bold mb-2">Frontend</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                            <li>React + Vite</li>
                            <li>TailwindCSS</li>
                            <li>Framer Motion</li>
                            <li>Recharts</li>
                        </ul>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-xl border border-border">
                        <h4 className="font-bold mb-2">Backend</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                            <li>Python (FastAPI)</li>
                            <li>TensorFlow (Keras)</li>
                            <li>Scikit-Learn</li>
                            <li>YFinance</li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                        Developed by <strong className="text-foreground">Hettik Patel</strong>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default AboutPage;
