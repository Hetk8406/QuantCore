import React from 'react';
import { TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react';

const SentimentCard = ({ sentiment }) => {
    if (!sentiment) return null;

    const { score, label, news } = sentiment;

    // Determine color based on label
    let colorClass = "text-yellow-500";
    let bgClass = "bg-yellow-500/10 border-yellow-500/20";
    let Icon = Minus;

    if (label === "Bullish") {
        colorClass = "text-green-500";
        bgClass = "bg-green-500/10 border-green-500/20";
        Icon = TrendingUp;
    } else if (label === "Bearish") {
        colorClass = "text-red-500";
        bgClass = "bg-red-500/10 border-red-500/20";
        Icon = TrendingDown;
    }

    // Convert score (-1 to 1) to percentage (0 to 100)
    const percentage = ((score + 1) / 2) * 100;

    return (
        <div className="bg-card/50 backdrop-blur-md border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-foreground/90 flex items-center gap-2">
                Market Sentiment 🧠
            </h2>

            <div className={`rounded-lg p-4 border ${bgClass} mb-6`}>
                <div className="flex justify-between items-center mb-2">
                    <span className={`text-lg font-bold flex items-center gap-2 ${colorClass}`}>
                        <Icon className="w-5 h-5" />
                        {label}
                    </span>
                    <span className="text-sm text-foreground/60 font-mono">Score: {score}</span>
                </div>

                {/* Sentiment Meter */}
                <div className="h-3 bg-secondary rounded-full overflow-hidden relative">
                    <div
                        className={`h-full absolute transition-all duration-1000 ease-out ${score > 0 ? "bg-green-500" : score < 0 ? "bg-red-500" : "bg-yellow-500"
                            }`}
                        style={{ width: `${percentage}%`, left: 0 }}
                    />
                    {/* Center Marker */}
                    <div className="absolute top-0 left-1/2 w-0.5 h-full bg-foreground/20 -translate-x-1/2" />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1 px-1">
                    <span>Bearish</span>
                    <span>Neutral</span>
                    <span>Bullish</span>
                </div>
            </div>

            <h3 className="text-sm font-semibold mb-3 text-foreground/80">Latest News</h3>
            <div className="space-y-3">
                {news && news.length > 0 ? (
                    news.slice(0, 3).map((item, index) => (
                        <a
                            key={index}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group"
                        >
                            <div className="p-3 rounded-lg bg-background/50 hover:bg-muted/50 transition-colors border border-border/50 group-hover:border-primary/20">
                                <h4 className="text-sm font-medium text-foreground/90 line-clamp-2 group-hover:text-primary transition-colors">
                                    {item.title}
                                </h4>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs text-muted-foreground">{item.publisher}</span>
                                    <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        </a>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No recent news found.</p>
                )}
            </div>
        </div>
    );
};

export default SentimentCard;
