import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

const StockMarquee = () => {
    // Initial placeholders to show instantly on page load
    const placeholders = [
        { symbol: 'Nifty 50', price: 22000, change: 0.45, currency_symbol: '₹' },
        { symbol: 'NASDAQ', price: 16000, change: 1.2, currency_symbol: '$' },
        { symbol: 'Apple', price: 180, change: -0.5, currency_symbol: '$' },
        { symbol: 'Reliance', price: 2900, change: 0.1, currency_symbol: '₹' },
        { symbol: 'Bitcoin', price: 65000, change: 2.5, currency_symbol: '$' },
        { symbol: 'Gold', price: 2150, change: 0.3, currency_symbol: '$' }
    ];

    const [stocks, setStocks] = useState(placeholders);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopStocks = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/top-stocks');
                if (res.data && res.data.length > 0) {
                    setStocks(res.data);
                }
            } catch (err) {
                console.error("Marquee fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTopStocks();
        const interval = setInterval(fetchTopStocks, 60000); 
        return () => clearInterval(interval);
    }, []);

    // Create a duplicated list for seamless loop
    const StockItem = ({ stock, idx }) => (
        <div key={idx} className="inline-flex items-center gap-6 px-10 border-r border-white/10 select-none">
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Activity className={`w-3 h-3 ${loading ? 'opacity-20' : 'text-primary animate-pulse'}`} />
                    {stock.symbol}
                </span>
                <div className="flex items-center gap-3">
                    <span className="text-xl font-bold tracking-tighter text-white">
                        <span className="text-xs text-slate-500 mr-1.5 align-middle">{stock.currency_symbol}</span>
                        {stock.price.toLocaleString()}
                    </span>
                    <span className={`flex items-center gap-1 text-xs font-black ${
                        stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                        {stock.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {stock.change >= 0 ? '+' : ''}{stock.change}%
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full bg-slate-900/40 backdrop-blur-3xl border-y border-white/5 py-5 overflow-hidden relative group">
            {/* The infinite track - Doubled for seamless loop */}
            <div className="flex whitespace-nowrap animate-marquee group-hover:pause pointer-events-auto">
                <div className="flex shrink-0">
                    {stocks.map((stock, idx) => <StockItem key={`a-${idx}`} stock={stock} idx={idx} />)}
                </div>
                <div className="flex shrink-0">
                    {stocks.map((stock, idx) => <StockItem key={`b-${idx}`} stock={stock} idx={idx} />)}
                </div>
            </div>

            {/* Visual Overlays */}
            <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[#020617] via-[#020617]/50 to-transparent pointer-events-none z-10" />
            <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-[#020617] via-[#020617]/50 to-transparent pointer-events-none z-10" />

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    display: flex;
                    width: max-content;
                    animation: marquee 50s linear infinite;
                }
                .group:hover .animate-marquee {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};

export default StockMarquee;
