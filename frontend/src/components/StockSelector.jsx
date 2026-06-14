import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Search, ChevronDown, Check, Star, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils"; 

const StockSelector = ({ onSelect, modelType, setModelType, watchlist = [], toggleWatchlist }) => {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef(null);

    // Debounced Search Logic
    useEffect(() => {
        if (!query || query.length < 2) {
            setSearchResults([]);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/search?q=${query}`);
                setSearchResults(res.data);
                setIsOpen(true);
            } catch (err) {
                console.error("Global search failed", err);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchResults, 400); // 400ms debounce
        return () => clearTimeout(timeoutId);
    }, [query]);

    // Handle outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Color Generation for Avatar
    const getAvatarColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return `hsl(${hash % 360}, 70%, 50%)`;
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto z-[50] relative" ref={containerRef}>

            {/* AI Model Selection */}
            <div className="flex bg-slate-900/50 p-1.5 rounded-full border border-slate-800 backdrop-blur-xl">
                <button
                    className={cn(
                        "px-6 py-2 rounded-full text-sm font-black transition-all uppercase tracking-widest",
                        modelType === 'linear'
                            ? "bg-slate-800 text-white shadow-xl ring-1 ring-slate-700"
                            : "text-slate-500 hover:text-white"
                    )}
                    onClick={() => setModelType('linear')}
                >
                    Nueron Standard
                </button>
                <button
                    className={cn(
                        "px-8 py-2 rounded-full text-sm font-black transition-all uppercase tracking-[0.2em] relative overflow-hidden",
                        modelType === 'lstm'
                            ? "text-primary-foreground"
                            : "text-slate-500 hover:text-white"
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
                         Advanced AI Core
                        {modelType === 'lstm' && <span className="flex h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />}
                    </span>
                </button>
            </div>

            {/* GLOBAL SYMBOL SEARCH BAR */}
            <div className="relative w-full group">
                <motion.div
                    className={cn(
                        "flex items-center bg-slate-900/80 backdrop-blur-3xl border border-slate-800 rounded-[2rem] px-6 py-4 transition-all duration-300",
                        isOpen ? "ring-2 ring-primary/40 border-primary scale-[1.02] shadow-[0_0_40px_rgba(59,130,246,0.2)]" : "hover:border-primary/30"
                    )}
                >
                    <Search className={cn("w-5 h-5 mr-3 transition-colors", isOpen ? "text-primary" : "text-slate-500")} />
                    <input
                        type="text"
                        placeholder="Search global stocks (e.g. RELIANCE, AAPL, TSLA)..."
                        className="bg-transparent border-none outline-none w-full text-lg font-bold placeholder:text-slate-600 text-white"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsOpen(true)}
                    />
                    <div className="flex items-center gap-3">
                        {loading && <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin mr-2" />}
                        <div className="w-px h-6 bg-slate-800" />
                        <ChevronDown className={cn("w-5 h-5 text-slate-500 transition-transform duration-300", isOpen ? "rotate-180 text-primary" : "")} />
                    </div>
                </motion.div>

                {/* SEARCH RESULTS OVERLAY */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-full left-0 right-0 mt-4 p-3 bg-slate-900/95 backdrop-blur-3xl border border-slate-800 rounded-[2.5rem] shadow-2xl z-[9999] max-h-[450px] overflow-hidden flex flex-col"
                        >
                            <div className="overflow-y-auto scrollbar-hide flex flex-col gap-2 p-2">
                                {/* Favorites Section */}
                                {!query && watchlist.length > 0 && (
                                     <div className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                         <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> My Watchlist
                                     </div>
                                )}
                                
                                {searchResults.length > 0 ? (
                                    searchResults.map((stock) => (
                                        <motion.div
                                            key={stock.symbol}
                                            whileHover={{ scale: 1.01, x: 5 }}
                                            className="p-4 rounded-3xl hover:bg-slate-800/80 cursor-pointer flex justify-between items-center group transition-all border border-transparent hover:border-primary/20"
                                            onClick={() => {
                                                onSelect(stock.symbol);
                                                setQuery(stock.symbol);
                                                setIsOpen(false);
                                            }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div 
                                                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-2xl relative overflow-hidden"
                                                    style={{ backgroundColor: getAvatarColor(stock.symbol) }}
                                                >
                                                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    {stock.symbol[0]}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-white group-hover:text-primary transition-colors tracking-tight">
                                                        {stock.symbol}
                                                    </span>
                                                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                                        <Globe className="w-2.5 h-2.5" /> {stock.exchange} | {stock.name.slice(0, 25)}...
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {toggleWatchlist && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleWatchlist(stock.symbol);
                                                    }}
                                                    className={cn(
                                                        "p-3 rounded-2xl transition-all hover:bg-slate-700 shadow-inner",
                                                        watchlist.includes(stock.symbol) ? "text-yellow-400" : "text-slate-600"
                                                    )}
                                                >
                                                    <Star className={cn("w-5 h-5", watchlist.includes(stock.symbol) ? "fill-yellow-400" : "")} />
                                                </button>
                                            )}
                                        </motion.div>
                                    ))
                                ) : query && !loading ? (
                                    <div className="py-20 text-center flex flex-col items-center gap-4">
                                        <div className="p-6 bg-slate-800 rounded-full animate-pulse">
                                             <Search className="w-10 h-10 text-slate-600" />
                                        </div>
                                        <p className="text-slate-500 text-xs font-black uppercase tracking-widest">No Intelligence for "{query}"</p>
                                    </div>
                                ) : !query && (
                                    <div className="py-20 text-center flex flex-col items-center gap-4 opacity-50">
                                         <p className="text-slate-500 text-xs font-black uppercase tracking-widest leading-relaxed">Type 2+ characters to scan<br/>the global markets.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default StockSelector;
