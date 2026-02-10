import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Search, ChevronDown, Check, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils"; // Assuming utils exists for cn helper

const StockSelector = ({ onSelect, modelType, setModelType, watchlist = [], toggleWatchlist }) => {
    const [stocks, setStocks] = useState([]);
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);

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

        // Close on outside click
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredStocks = stocks.filter((stock) =>
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
    );

    // Group stocks: Starred first
    const starredStocks = filteredStocks.filter(stock => watchlist.includes(stock.symbol));
    const otherStocks = filteredStocks.filter(stock => !watchlist.includes(stock.symbol));

    // Combine for display (Starred first, then others)
    const displayStocks = [...starredStocks, ...otherStocks];

    // Generate consistent color from string
    const stringToColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
        return "#" + "00000".substring(0, 6 - c.length) + c;
    };

    // Generate HSL color that is always legible
    const getAvatarColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = hash % 360;
        return `hsl(${hue}, 70%, 50%)`;
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto z-[50] relative" ref={containerRef}>

            {/* 1. Model Selection Pills */}
            <div className="flex bg-secondary/50 p-1.5 rounded-full border border-border backdrop-blur-sm">
                <button
                    className={cn(
                        "px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300",
                        modelType === 'linear'
                            ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    )}
                    onClick={() => setModelType('linear')}
                >
                    Standard (Linear)
                </button>
                <button
                    className={cn(
                        "px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 relative overflow-hidden",
                        modelType === 'lstm'
                            ? "text-primary-foreground shadow-md"
                            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    )}
                    onClick={() => setModelType('lstm')}
                >
                    {modelType === 'lstm' && (
                        <motion.div
                            layoutId="activePill"
                            className="absolute inset-0 bg-primary z-0"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                        Advanced (AI)
                        {modelType === 'lstm' && <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />}
                    </span>
                </button>
            </div>

            {/* 2. Search Box */}
            <div className="relative w-full group">
                <motion.div
                    className={cn(
                        "flex items-center bg-card/80 backdrop-blur-md border border-border rounded-xl px-4 py-3 shadow-sm transition-all duration-300",
                        isOpen ? "ring-2 ring-primary/20 border-primary shadow-lg scale-[1.02]" : "hover:border-primary/50"
                    )}
                    initial={false}
                >
                    <Search className={cn("w-5 h-5 mr-3 transition-colors", isOpen ? "text-primary" : "text-muted-foreground")} />
                    <input
                        type="text"
                        placeholder="Search specific stock..."
                        className="bg-transparent border-none outline-none w-full text-lg font-medium placeholder:text-muted-foreground/50 text-foreground"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                    />
                    <div className="flex items-center gap-2">
                        {loading && <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />}
                        <ChevronDown
                            className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`}
                            onClick={() => setIsOpen(!isOpen)}
                        />
                    </div>
                </motion.div>

                {/* 3. Dropdown Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute top-full left-0 right-0 mt-3 p-2 bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent z-[9999]"
                        >
                            {loading ? (
                                <div className="p-8 text-center text-muted-foreground text-sm">Loading market data...</div>
                            ) : displayStocks.length > 0 ? (
                                <div className="flex flex-col gap-1">
                                    {/* Optional: Section Header for Starred */}
                                    {starredStocks.length > 0 && query === "" && (
                                        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            Favorites
                                        </div>
                                    )}

                                    {displayStocks.map((stock) => {
                                        const isStarred = watchlist.includes(stock.symbol);
                                        const avatarColor = getAvatarColor(stock.symbol);

                                        return (
                                            <motion.div
                                                key={stock.symbol}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="p-3 rounded-lg hover:bg-secondary/80 cursor-pointer flex justify-between items-center group transition-colors relative overflow-hidden"
                                                onClick={() => {
                                                    onSelect(stock.symbol);
                                                    setQuery(stock.symbol); // Set name on click
                                                    setIsOpen(false);
                                                }}
                                            >
                                                <div className="flex items-center gap-4 z-10">
                                                    {/* Avatar */}
                                                    <div
                                                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm"
                                                        style={{ backgroundColor: avatarColor }}
                                                    >
                                                        {stock.symbol[0]}
                                                    </div>

                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                                                            {stock.symbol}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            National Stock Exchange
                                                        </span>
                                                    </div>
                                                </div>

                                                {toggleWatchlist && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleWatchlist(stock.symbol);
                                                        }}
                                                        className={`p-2 rounded-full transition-all z-10 hover:bg-background ${isStarred
                                                            ? "text-yellow-400"
                                                            : "text-muted-foreground/30 hover:text-yellow-400"
                                                            }`}
                                                    >
                                                        <Star
                                                            className={cn("w-5 h-5 transition-transform active:scale-90", isStarred ? "fill-yellow-400" : "")}
                                                        />
                                                    </button>
                                                )}

                                                {/* Selection Checkmark (if currently typed) */}
                                                {query === stock.symbol && (
                                                    <div className="absolute right-14 top-1/2 -translate-y-1/2 text-primary opacity-20">
                                                        <Check className="w-16 h-16" />
                                                    </div>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-8 text-center flex flex-col items-center gap-2 text-muted-foreground">
                                    <Search className="w-8 h-8 opacity-20" />
                                    <p>No results found for "{query}"</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default StockSelector;
