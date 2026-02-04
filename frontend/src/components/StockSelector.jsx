import { useState, useEffect } from "react";
import axios from "axios";
import { Search, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const StockSelector = ({ onSelect, modelType, setModelType, watchlist = [], toggleWatchlist }) => {
    const [stocks, setStocks] = useState([]);
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const res = await axios.get("http://127.0.0.1:8000/api/stocks");
                setStocks(res.data);
            } catch (err) {
                console.error("Failed to fetch stocks", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStocks();
    }, []);

    const filteredStocks = stocks.filter((stock) =>
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto z-[50] relative">
            {/* Model Toggles */}
            <div className="flex bg-secondary p-1 rounded-lg">
                <button
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${modelType === 'linear'
                        ? 'bg-background shadow text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                    onClick={() => setModelType('linear')}
                >
                    Basic (Linear)
                </button>
                <button
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${modelType === 'lstm'
                        ? 'bg-primary text-primary-foreground shadow'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                    onClick={() => setModelType('lstm')}
                >
                    Advanced (LSTM)
                </button>
            </div>

            <div className="relative w-full">
                <div
                    className="flex items-center bg-card border border-border rounded-lg p-3 cursor-pointer shadow-sm hover:border-primary transition-colors"
                >
                    <Search className="w-5 h-5 text-muted-foreground mr-2" />
                    <input
                        type="text"
                        placeholder="Search Stock (e.g. RELIANCE)..."
                        className="bg-transparent border-none outline-none w-full text-foreground placeholder-muted-foreground"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                    />
                    <ChevronDown
                        className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                        onClick={() => setIsOpen(!isOpen)}
                    />
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto z-[9999]"
                        >
                            {loading ? (
                                <div className="p-4 text-center text-muted-foreground">Loading...</div>
                            ) : filteredStocks.length > 0 ? (
                                filteredStocks.map((stock) => {
                                    const isStarred = watchlist.includes(stock.symbol);
                                    return (
                                        <div
                                            key={stock.symbol}
                                            className="p-3 hover:bg-muted cursor-pointer flex justify-between items-center group"
                                            onClick={() => {
                                                onSelect(stock.symbol);
                                                setQuery(stock.symbol);
                                                setIsOpen(false);
                                            }}
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-medium">{stock.symbol}</span>
                                                <span className="text-xs text-muted-foreground">{stock.name}</span>
                                            </div>

                                            {toggleWatchlist && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleWatchlist(stock.symbol);
                                                    }}
                                                    className={`p-1.5 rounded-full transition-colors ${isStarred
                                                            ? "text-yellow-400 hover:text-yellow-500"
                                                            : "text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100"
                                                        }`}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill={isStarred ? "currentColor" : "none"}
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="w-4 h-4"
                                                    >
                                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-4 text-center text-muted-foreground">No stocks found</div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default StockSelector;
